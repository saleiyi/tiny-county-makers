import test from "node:test";
import assert from "node:assert/strict";
import { getProductProfile, listProductProfiles, physicalDimensions, stickerOffsetPixels, normalizeCutlineSmoothing } from "../assets/maker-core.mjs";
import fs from "node:fs";

test("the shared engine exposes the four distinct maker profiles", () => {
  assert.deepEqual(listProductProfiles().map((profile) => profile.id), ["keychain", "standee", "sticker", "magnet"]);
  assert.equal(getProductProfile("standee").hasBase, true);
  assert.equal(getProductProfile("sticker").exportSvg, true);
});

test("physical dimensions preserve aspect ratio on the selected long side", () => {
  assert.deepEqual(physicalDimensions(1200, 600, 5), { widthCm: 5, heightCm: 2.5 });
  assert.deepEqual(physicalDimensions(600, 1200, 5), { widthCm: 2.5, heightCm: 5 });
});

test("cutline millimeters convert to print pixels at 300 DPI", () => {
  assert.equal(stickerOffsetPixels(1), 12);
  assert.equal(stickerOffsetPixels(5), 59);
});

test("cutline smoothing remains within the offered zero to ten range", () => {
  assert.equal(normalizeCutlineSmoothing(-3), 0);
  assert.equal(normalizeCutlineSmoothing(4.6), 5);
  assert.equal(normalizeCutlineSmoothing(17), 10);
});

test("each search-intent maker has a standalone crawlable entry page", () => {
  for (const page of ["pet-keychain-maker.html", "acrylic-standee-maker.html", "sticker-cutline-generator.html", "fridge-magnet-maker.html"]) {
    assert.equal(fs.existsSync(new URL(`../${page}`, import.meta.url)), true, `${page} is missing`);
  }
});
