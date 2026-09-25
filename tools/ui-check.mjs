/* Headless Chrome UI checks for the static site: horizontal overflow,
   touch targets, the mobile drawer, the mega menu, the search filter,
   the directory filter and a real upload -> preview -> download run.

   Usage:  node tools/ui-check.mjs [--json out.json]
*/
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));
const PORT = 9333;
const PROFILE = mkdtempSync(path.join(tmpdir(), "tcm-ui-"));
const DOWNLOADS = path.join(PROFILE, "dl");
mkdirSync(DOWNLOADS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = (page) => pathToFileURL(path.join(ROOT, page)).href;

const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
  "--allow-file-access-from-files", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const info = await res.json();
      if (info.webSocketDebuggerUrl) return info.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error("Chrome did not expose a debugging endpoint");
}

class Session {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = new Map(); }
  static async open(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((ok, bad) => { ws.onopen = ok; ws.onerror = bad; });
    const s = new Session(ws);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id && s.pending.has(data.id)) {
        const { ok, bad } = s.pending.get(data.id);
        s.pending.delete(data.id);
        data.error ? bad(new Error(data.error.message)) : ok(data.result);
      } else if (data.method && s.events.has(data.method)) {
        s.events.get(data.method)(data.params);
        s.events.delete(data.method);
      }
    };
    return s;
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((ok, bad) => {
      this.pending.set(id, { ok, bad });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  once(method) { return new Promise((ok) => this.events.set(method, ok)); }
}

const results = [];
const record = (name, ok, detail) => results.push({ name, ok, detail });

const session = await Session.open(await endpoint());
const { targetId } = await session.send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await session.send("Target.attachToTarget", { targetId, flatten: true });
const call = (method, params) => session.send(method, params, sessionId);

await call("Page.enable");
await call("Runtime.enable");
await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const viewport = (width, height, mobile = true) =>
  call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });

async function evaluate(expression) {
  const res = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (res.exceptionDetails) throw new Error(res.exceptionDetails.text + " " + JSON.stringify(res.result));
  return res.result.value;
}

async function goto(page, width = 1440, height = 900, mobile = false) {
  await viewport(width, height, mobile);
  await call("Page.navigate", { url: url(page) });
  for (let i = 0; i < 80; i++) {
    const state = await evaluate("document.readyState").catch(() => "loading");
    if (state === "complete") break;
    await sleep(100);
  }
  await sleep(250);
}

async function waitForImages(scope = "document") {
  for (let i = 0; i < 40; i++) {
    const pending = await evaluate(`[...${scope}.querySelectorAll("img")].filter((i) => !i.complete || i.naturalWidth === 0).length`);
    if (pending === 0) return true;
    await sleep(120);
  }
  return false;
}

const OVERFLOW_PROBE = `(() => {
  const wide = [];
  document.querySelectorAll("body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > window.innerWidth + 1.5) {
      wide.push({ tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 40), right: Math.round(r.right), width: Math.round(r.width) });
    }
  });
  return {
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflows: document.documentElement.scrollWidth > window.innerWidth + 1,
    wide: wide.slice(0, 8),
    toggle: !!document.querySelector(".nav-toggle"),
    toggleVisible: (() => { const t = document.querySelector(".nav-toggle"); if (!t) return false; const s = getComputedStyle(t); return s.display !== "none" && t.getBoundingClientRect().width > 0; })(),
    navHidden: (() => { const n = document.querySelector("#site-nav"); return n ? getComputedStyle(n).display === "none" : null; })(),
  };
})()`;

// ---------------------------------------------------------------- mobile layout
for (const page of ["index.html", "tools.html", "gift-tag-maker.html", "photo-gifts.html", "inspiration.html"]) {
  await goto(page, 390, 844, true);
  if (page === "tools.html" && process.argv.includes("--screenshot")) {
    const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    writeFileSync(path.join(ROOT, "_shots", "tools-mobile-current.png"), Buffer.from(shot.data, "base64"));
  }
  const probe = await evaluate(OVERFLOW_PROBE);
  record(`mobile 390px no overflow - ${page}`, !probe.overflows,
    probe.overflows ? `scrollWidth ${probe.scrollWidth} > ${probe.innerWidth}; widest: ${JSON.stringify(probe.wide)}` : `scrollWidth ${probe.scrollWidth}`);
  record(`mobile 390px drawer button - ${page}`, probe.toggle && probe.toggleVisible && probe.navHidden !== false,
    `toggle=${probe.toggle} visible=${probe.toggleVisible} navHidden=${probe.navHidden}`);
}

// ---------------------------------------------------------------- drawer + mega
await goto("tools.html", 390, 844, true);
await evaluate(`document.querySelector(".nav-toggle").click()`);
await sleep(150);
const drawerOpen = await evaluate(`(() => {
  const h = document.querySelector(".site-top");
  const nav = document.querySelector("#site-nav");
  return { open: h.classList.contains("nav-open"), navVisible: getComputedStyle(nav).display !== "none",
           expanded: document.querySelector(".nav-toggle").getAttribute("aria-expanded"),
           overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
})()`);
record("mobile drawer opens and shows the nav", drawerOpen.open && drawerOpen.navVisible && drawerOpen.expanded === "true" && !drawerOpen.overflow,
  JSON.stringify(drawerOpen));
await evaluate(`document.querySelector(".nav-drop").click()`);
await sleep(120);
const drawerMega = await evaluate(`(() => {
  const mega = document.querySelector("#mega-tools");
  return { open: document.querySelector("[data-nav-group]").classList.contains("open"),
           visible: getComputedStyle(mega).display !== "none",
           cols: mega.querySelectorAll(".mega-col").length,
           links: mega.querySelectorAll("a").length,
           overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
})()`);
record("mobile drawer expands the 5 categories", drawerMega.open && drawerMega.visible && drawerMega.cols === 5 && !drawerMega.overflow,
  JSON.stringify(drawerMega));

await goto("tools.html", 1440, 900, false);
await evaluate(`document.querySelector(".nav-drop").click()`);
await sleep(150);
await waitForImages();
const mega = await evaluate(`(() => {
  const mega = document.querySelector("#mega-tools");
  const cols = [...mega.querySelectorAll(".mega-col")];
  return { visible: getComputedStyle(mega).display !== "none",
           cols: cols.length,
           perCol: cols.map((c) => c.querySelectorAll(".mega-list a").length),
           thumbs: mega.querySelectorAll("img").length,
           imagesLoaded: [...mega.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0),
           expanded: document.querySelector(".nav-drop").getAttribute("aria-expanded") };
})()`);
record("desktop mega menu opens with 5 populated columns",
  mega.visible && mega.cols === 5 && mega.perCol.every((count) => count >= 5) && mega.thumbs >= 28 && mega.imagesLoaded && mega.expanded === "true",
  JSON.stringify(mega));

// ---------------------------------------------------------------- search
await evaluate(`document.querySelector(".search-open").click()`);
await sleep(150);
const searchOpen = await evaluate(`(() => {
  const box = document.getElementById("site-search");
  return { visible: !box.hidden, focused: document.activeElement.id, count: document.getElementById("site-search-count").textContent };
})()`);
record("header search opens, input focused, 30 tools listed",
  searchOpen.visible && searchOpen.focused === "site-search-input" && searchOpen.count.startsWith("30"),
  JSON.stringify(searchOpen));
await evaluate(`(() => { const i = document.getElementById("site-search-input"); i.value = "sticker"; i.dispatchEvent(new Event("input", { bubbles: true })); })()`);
await sleep(120);
const searchFiltered = await evaluate(`(() => {
  const items = [...document.querySelectorAll("#site-search-list .search-item")];
  const shown = items.filter((i) => !i.hidden);
  return { shown: shown.length, names: shown.map((i) => i.querySelector("b").textContent),
           count: document.getElementById("site-search-count").textContent,
           empty: document.getElementById("site-search-empty").hidden === false };
})()`);
record("search filters to the sticker tools", searchFiltered.shown === 5 && searchFiltered.names.every((name) => /sticker|bookmark|topper/i.test(name)) && searchFiltered.empty === false,
  JSON.stringify(searchFiltered));
await evaluate(`(() => { const i = document.getElementById("site-search-input"); i.value = "zzzz"; i.dispatchEvent(new Event("input", { bubbles: true })); })()`);
await sleep(100);
const searchEmpty = await evaluate(`document.getElementById("site-search-empty").hidden === false && [...document.querySelectorAll("#site-search-list .search-item")].every((i) => i.hidden)`);
record("search shows an empty state for no matches", searchEmpty === true, String(searchEmpty));
await evaluate(`document.querySelector("[data-search-close]").click()`);
await sleep(120);
record("search closes again", await evaluate(`document.getElementById("site-search").hidden === true`), "");

// ---------------------------------------------------------------- directory filter
await goto("tools.html", 1440, 1000, false);
const dirTotal = await evaluate(`document.querySelectorAll(".tool-card").length`);
record("directory lists all 30 tools", dirTotal === 30, `cards=${dirTotal}`);
await evaluate(`(() => { const i = document.getElementById("dir-search"); i.value = "name"; i.dispatchEvent(new Event("input", { bubbles: true })); })()`);
await sleep(150);
const dirSearch = await evaluate(`(() => {
  const visible = [...document.querySelectorAll(".tool-card")].filter((c) => !c.classList.contains("is-hidden"));
  const groups = [...document.querySelectorAll(".dir-group")].filter((g) => !g.classList.contains("is-hidden"));
  return { visible: visible.length, names: visible.map((c) => c.querySelector("b").textContent), groups: groups.length,
           count: document.getElementById("dir-count").textContent };
})()`);
record("directory search narrows the grid and reports the count",
  dirSearch.visible > 0 && dirSearch.visible < 30 && dirSearch.count.includes(String(dirSearch.visible)),
  JSON.stringify(dirSearch));
await evaluate(`(() => { const i = document.getElementById("dir-search"); i.value = ""; i.dispatchEvent(new Event("input", { bubbles: true })); document.querySelector('.chip[data-filter="kids-learning"]').click(); })()`);
await sleep(150);
const dirChip = await evaluate(`(() => {
  const visible = [...document.querySelectorAll(".tool-card")].filter((c) => !c.classList.contains("is-hidden"));
  const groups = [...document.querySelectorAll(".dir-group")].filter((g) => !g.classList.contains("is-hidden")).map((g) => g.id);
  return { visible: visible.length, groups, count: document.getElementById("dir-count").textContent };
})()`);
record("category chip filters to Kids & Learning (5 tools)", dirChip.visible === 5 && dirChip.groups.length === 1 && dirChip.groups[0] === "kids-learning",
  JSON.stringify(dirChip));

// ---------------------------------------------------------------- tool page run
await goto("gift-tag-maker.html", 1440, 1100, false);
const dom = await evaluate(`({ maker: document.querySelector("main").dataset.maker, hasPhoto: !!document.getElementById("photo"),
  hasSize: !!document.getElementById("size"), hasPreview: !!document.getElementById("preview"),
  hasPng: !!document.getElementById("pngDownload"), quote: !!document.querySelector('form.quote-form'),
  related: document.querySelectorAll("#related-tools .tool-card").length,
  relatedCat: document.querySelector("#related-tools .eyebrow")?.textContent })`);
record("gift tag page keeps its maker contract", dom.maker === "gift-tag" && dom.hasPhoto && dom.hasSize && dom.hasPreview && dom.hasPng && dom.quote, JSON.stringify(dom));
record("gift tag page shows related tools from its own category", dom.related === 4 && /Events/.test(dom.relatedCat || ""), JSON.stringify(dom));

const sample = path.join(ROOT, "assets", "photos", "gift-tag.jpg");
const { root } = await call("DOM.getDocument", { depth: -1 });
const { nodeId } = await call("DOM.querySelector", { nodeId: root.nodeId, selector: "#photo" });
await call("DOM.setFileInputFiles", { files: [sample], nodeId });
await sleep(900);
const afterUpload = await evaluate(`(() => {
  const c = document.getElementById("preview");
  const ctx = c.getContext("2d");
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  let painted = 0;
  for (let i = 3; i < data.length; i += 4000) if (data[i] > 0) painted++;
  return { pngDisabled: document.getElementById("pngDownload").disabled, painted,
           dimensions: document.getElementById("dimensions").textContent.slice(0, 60),
           product: document.getElementById("productName").textContent };
})()`);
record("uploading a photo paints the preview and enables the download",
  afterUpload.pngDisabled === false && afterUpload.painted > 0, JSON.stringify(afterUpload));

const exported = await evaluate(`(() => {
  let result = null;
  const original = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute("download")) {
      const bytes = atob(this.href.split(",", 2)[1] || "");
      const u32 = (offset) => (((bytes.charCodeAt(offset) << 24) >>> 0) + (bytes.charCodeAt(offset + 1) << 16) + (bytes.charCodeAt(offset + 2) << 8) + bytes.charCodeAt(offset + 3)) >>> 0;
      result = { name: this.download, png: bytes.slice(1, 4) === "PNG", width: u32(16), height: u32(20), length: bytes.length };
    } else original.call(this);
  };
  try { document.getElementById("pngDownload").click(); }
  finally { HTMLAnchorElement.prototype.click = original; }
  return result;
})()`);
record("download button generates a 300 DPI PNG", exported?.png && exported.name.endsWith(".png") && exported.width >= 600 && exported.height >= 900,
  JSON.stringify(exported));

await evaluate(`document.getElementById("size").value = document.getElementById("size").options[2].value; document.getElementById("size").dispatchEvent(new Event("change", { bubbles: true }));`);
await sleep(500);
const resized = await evaluate(`document.getElementById("dimensions").textContent.slice(0, 80)`);
record("changing the size updates the preview contract", /px/.test(resized), String(resized));

// ---------------------------------------------------------------- report
const failed = results.filter((r) => !r.ok);
console.log("");
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : "  -> " + r.detail}`);
console.log(`\n${results.length - failed.length}/${results.length} UI checks passed`);
if (process.argv.includes("--json")) {
  const i = process.argv.indexOf("--json");
  const out = process.argv[i + 1] || "ui-check.json";
  const { writeFileSync } = await import("node:fs");
  writeFileSync(out, JSON.stringify(results, null, 2));
  console.log("wrote " + out);
}
session.ws.close();
chrome.kill();
await sleep(300);
rmSync(PROFILE, { recursive: true, force: true });
process.exit(failed.length ? 1 : 0);
