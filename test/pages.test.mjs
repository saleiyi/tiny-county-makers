import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, ROOT), "utf8");

const TOOL_PAGES = [
  { file: "sticker-cutline-generator.html", maker: "sticker", title: "Sticker Cutline Generator" },
  { file: "acrylic-standee-maker.html", maker: "standee", title: "Acrylic Standee Maker" },
  { file: "fridge-magnet-maker.html", maker: "magnet", title: "Fridge Magnet Maker" },
];

const SHARED_IDS = ["photo", "size", "sizeLabel", "pngDownload", "preview", "dimensions", "productName"];

test("every tool page exposes the DOM contract maker-app.js expects", () => {
  for (const page of TOOL_PAGES) {
    const html = read(page.file);
    assert.match(html, new RegExp(`data-maker="${page.maker}"`), `${page.file} lost its maker root`);
    for (const id of SHARED_IDS) {
      assert.match(html, new RegExp(`id="${id}"`), `${page.file} is missing #${id}`);
    }
    for (const script of ["./config.js", "./maker-app.js"]) {
      assert.ok(html.includes(script), `${page.file} no longer loads ${script}`);
    }
  }
});

test("only the cutline tool offers cutline controls, and every offset control it shows is wired up", () => {
  const sticker = read("sticker-cutline-generator.html");
  for (const id of ["offset", "offsetControl", "offsetLabel", "smoothing", "smoothingControl", "smoothingLabel", "svgDownload"]) {
    assert.match(sticker, new RegExp(`id="${id}"`), `the cutline tool is missing #${id}`);
  }
  for (const page of TOOL_PAGES.filter((entry) => entry.maker !== "sticker")) {
    const html = read(page.file);
    assert.ok(!html.includes('id="offsetControl"'), `${page.file} shows a cutline control it cannot use`);
    assert.ok(!html.includes('id="svgDownload"'), `${page.file} offers an SVG download the engine will hide`);
  }
});

test("each indexable page carries a canonical URL, OG tags, a Twitter card and parseable JSON-LD", () => {
  const files = [...TOOL_PAGES.map((page) => page.file), "pet-keychain-maker.html"];
  for (const file of files) {
    const html = read(file);
    assert.match(html, /<link rel="canonical" href="https:\/\/saleiyi\.github\.io\/tiny-county-makers\//, `${file} needs a canonical URL`);
    assert.match(html, /property="og:title"/, `${file} needs an og:title`);
    assert.match(html, /name="twitter:card"/, `${file} needs a Twitter card`);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length >= 1, `${file} has no JSON-LD`);
    for (const block of blocks) {
      const data = JSON.parse(block[1]);
      assert.ok(data["@graph"] || data["@type"], `${file} JSON-LD has no type`);
    }
  }
});

test("structured data promises what the visible page actually shows", () => {
  for (const file of [...TOOL_PAGES.map((page) => page.file), "pet-keychain-maker.html"]) {
    const html = read(file);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    const faq = graph.find((node) => node["@type"] === "FAQPage");
    const howTo = graph.find((node) => node["@type"] === "HowTo");
    assert.ok(faq && howTo, `${file} should describe both an FAQ and a how-to`);
    assert.equal(faq.mainEntity.length, 5, `${file} FAQ count changed; update the accepted answer text too`);
    for (const question of faq.mainEntity) {
      assert.ok(html.includes(question.name), `${file} FAQ "${question.name}" is not visible on the page`);
    }
    assert.ok(howTo.step.length >= 3, `${file} how-to needs at least three steps`);
  }
});

test("every quote form is wired to the shared submitter and posts to the inquiry API", () => {
  const submitter = read("assets/quote-form.js");
  assert.match(submitter, /https:\/\/leadpilot-ai-6db\.pages\.dev\/api\/inquiries/);
  for (const file of [...TOOL_PAGES.map((page) => page.file), "pet-keychain-maker.html"]) {
    const html = read(file);
    const forms = [...html.matchAll(/<form class="quote-form"[^>]*>/g)];
    assert.equal(forms.length, 1, `${file} should expose exactly one quote form`);
    assert.ok(html.includes("assets/quote-form.js"), `${file} has a quote form but never loads quote-form.js`);
    assert.match(forms[0][0], /novalidate/, `${file} quote form should let the shared script report errors`);
    for (const field of ["name", "email", "service", "budget", "message", "website_url", "consent"]) {
      assert.match(forms[0][0] + html, new RegExp(`name="${field}"`), `${file} quote form is missing ${field}`);
    }
  }
});

test("no page ships a dead call to action", () => {
  // The download buttons start disabled on purpose: maker-app.js enables them once
  // artwork is loaded. Anything else that is disabled on arrival is a dead end.
  const ENABLED_AFTER_UPLOAD = new Set(["Download PNG", "Download SVG"]);
  for (const file of [...TOOL_PAGES.map((page) => page.file), "pet-keychain-maker.html"]) {
    const html = read(file);
    const disabled = [...html.matchAll(/<button[^>]*\bdisabled\b[^>]*>([^<]*)</g)].map((match) => match[1].trim());
    for (const label of disabled) {
      assert.ok(ENABLED_AFTER_UPLOAD.has(label), `${file} left the dead CTA "${label}" on the page`);
    }
    for (const phrase of ["Request proof soon", "coming soon", "Coming soon"]) {
      assert.ok(!html.includes(phrase), `${file} still advertises "${phrase}"`);
    }
  }
});

test("every conversion point on a tool page leads somewhere real", () => {
  for (const file of TOOL_PAGES.map((page) => page.file)) {
    const html = read(file);
    assert.match(html, /<section class="seo alt" id="quote">/, `${file} needs an anchored quote section`);
    assert.ok(html.includes('href="#quote"'), `${file} should link the preview panel to the quote section`);
  }
});

test("the sitemap lists every published page with the current lastmod", () => {
  const xml = read("sitemap.xml");
  const txt = read("sitemap.txt");
  const paths = [
    "https://saleiyi.github.io/tiny-county-makers/",
    "custom-acrylic-keychains.html",
    "pet-keychain-maker.html",
    "acrylic-standee-maker.html",
    "sticker-cutline-generator.html",
    "fridge-magnet-maker.html",
  ];
  for (const entry of paths) {
    assert.ok(xml.includes(entry), `sitemap.xml is missing ${entry}`);
    assert.ok(txt.includes(entry), `sitemap.txt is missing ${entry}`);
  }
  assert.ok(!xml.includes("2026-09-16"), "sitemap.xml still carries the old lastmod");
  assert.ok(xml.includes("<lastmod>2026-09-18</lastmod>"), "sitemap.xml should date this revision");
});

test("internal links between the tools resolve to files that exist", () => {
  const files = fs.readdirSync(ROOT).filter((name) => name.endsWith(".html"));
  for (const file of files) {
    const html = read(file);
    for (const match of html.matchAll(/href="\.\/([A-Za-z0-9._-]+\.html)/g)) {
      assert.ok(files.includes(match[1]), `${file} links to missing ${match[1]}`);
    }
  }
  assert.ok(path.basename(new URL(".", ROOT).pathname) === "tiny-county-makers");
});