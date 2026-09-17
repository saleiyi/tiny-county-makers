import test from "node:test";
import assert from "node:assert/strict";
import {
  getProductProfile,
  listProductProfiles,
  physicalDimensions,
  stickerOffsetPixels,
  normalizeCutlineSmoothing,
  physicalPixels,
  workDpi,
  alphaToMask,
  traceContours,
  polygonArea,
  cleanContours,
  simplifyPath,
  smoothPath,
  offsetPath,
  offsetContours,
  contourDepths,
  contoursToPathD,
  boundsOfContours,
  PRINT_DPI,
} from "../assets/maker-core.mjs";
import fs from "node:fs";

test("the shared engine exposes the five distinct maker profiles", () => {
  assert.deepEqual(listProductProfiles().map((profile) => profile.id), ["keychain", "standee", "sticker", "magnet", "photo-keychain"]);
  assert.equal(getProductProfile("standee").hasBase, true);
  assert.equal(getProductProfile("sticker").exportSvg, true);
  assert.equal(getProductProfile("photo-keychain").hasHardware, true);
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

test("print math stays consistent between physical pixels and working DPI", () => {
  assert.equal(physicalPixels(2.54, PRINT_DPI), 300);
  assert.equal(physicalPixels(5, PRINT_DPI), 591);
  assert.equal(workDpi(300, 2.54), PRINT_DPI);
  assert.ok(Math.abs(stickerOffsetPixels(2, physicalPixels(5, PRINT_DPI) / (5 / 2.54)) - 24) <= 1);
});

test("each search-intent maker has a standalone crawlable entry page", () => {
  for (const page of ["pet-keychain-maker.html", "photo-keychain-maker.html", "acrylic-standee-maker.html", "sticker-cutline-generator.html", "fridge-magnet-maker.html"]) {
    assert.equal(fs.existsSync(new URL(`../${page}`, import.meta.url)), true, `${page} is missing`);
  }
});

// ---------------------------------------------------------------- contour geometry

function blockMask(size, x0, y0, x1, y1) {
  const mask = new Uint8Array(size * size);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) mask[y * size + x] = 1;
  return mask;
}

test("alphaToMask treats the alpha channel as the cut boundary", () => {
  const pixels = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 10, 0, 0, 0, 40]);
  assert.deepEqual(Array.from(alphaToMask(pixels, 3, 1, 24)), [1, 0, 1]);
});

test("marching squares traces one closed loop around a solid block", () => {
  const size = 24;
  const contours = traceContours(blockMask(size, 6, 6, 18, 18), size, size);
  assert.equal(contours.length, 1);
  const area = polygonArea(contours[0]);
  assert.ok(area > 100 && area < 170, `unexpected traced area ${area}`);
});

test("a solid ring is traced as an outer contour plus a hole", () => {
  const size = 32;
  const mask = blockMask(size, 4, 4, 28, 28);
  for (let y = 12; y < 20; y++) for (let x = 12; x < 20; x++) mask[y * size + x] = 0;
  const contours = traceContours(mask, size, size);
  assert.equal(contours.length, 2);
  const areas = contours.map(polygonArea).sort((a, b) => b - a);
  assert.ok(areas[0] > areas[1], "outer loop should be larger than the hole");
});

test("cleanContours drops specks and keeps the biggest loops first", () => {
  const big = [[0, 0], [10, 0], [10, 10], [0, 10]];
  const speck = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const kept = cleanContours([speck, big], 24, 10);
  assert.equal(kept.length, 1);
  assert.equal(polygonArea(kept[0]), 100);
});

test("offsetPath grows and shrinks a clockwise square outward", () => {
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  const before = polygonArea(square);
  assert.ok(polygonArea(offsetPath(square, 2)) > before);
  assert.ok(polygonArea(offsetPath(square, -2)) < before);
});

test("simplifyPath removes dense detail and smoothPath preserves point count", () => {
  const outline = [];
  for (let i = 0; i < 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    outline.push([30 * Math.cos(t), 30 * Math.sin(t)]);
  }
  const simplified = simplifyPath(outline, 1);
  assert.ok(simplified.length < outline.length, "simplification should drop points");
  assert.ok(simplified.length >= 3, "simplification must keep a usable polygon");
  assert.equal(smoothPath(simplified, 3).length, simplified.length);
  assert.deepEqual(smoothPath(simplified, 1).length, simplified.length);
});

test("contoursToPathD emits closed subpaths a printer can plot", () => {
  assert.equal(contoursToPathD([[[0, 0], [4, 0], [4, 4], [0, 4]]]), "M0 0L4 0L4 4L0 4Z");
  assert.equal(contoursToPathD([[[0, 0], [1, 0], [1, 1]], [[5, 5], [6, 5], [6, 6]]]).split("Z").length, 3);
});

test("boundsOfContours reports the printable area", () => {
  const box = boundsOfContours([[[2, 3], [12, 3], [12, 9], [2, 9]]]);
  assert.deepEqual({ x: box.minX, y: box.minY, w: box.width, h: box.height }, { x: 2, y: 3, w: 10, h: 6 });
  assert.equal(boundsOfContours([]), null);
});

test("holes keep their own offset direction so a ring never seals shut", () => {
  const size = 40;
  const mask = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - 19.5, y - 19.5);
      if (d < 16 && d > 7) mask[y * size + x] = 1;
    }
  }
  const contours = traceContours(mask, size, size);
  assert.equal(contours.length, 2);
  assert.deepEqual(contourDepths(contours), [0, 1], "outer loop is depth 0, the hole is depth 1");

  const [outerOff, holeOff] = offsetContours(contours, 3);
  assert.ok(polygonArea(outerOff) > polygonArea(contours[0]), "outer boundary grows outwards");
  assert.ok(polygonArea(holeOff) < polygonArea(contours[1]), "hole shrinks so the material expands");

  const naive = contours.map((points) => offsetPath(points, 3));
  assert.ok(polygonArea(naive[1]) > polygonArea(contours[1]), "offsetting every loop the same way is the bug this guards against");
});

test("an island inside a hole is material again and grows outwards", () => {
  const size = 40;
  const mask = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - 19.5, y - 19.5);
      if ((d < 18 && d > 12) || d < 5) mask[y * size + x] = 1;
    }
  }
  const contours = traceContours(mask, size, size);
  const depths = contourDepths(contours).slice().sort();
  assert.deepEqual(depths, [0, 1, 2], "a floating dot nests three levels deep");
  const offset = offsetContours(contours, 2);
  const island = contours.findIndex((points) => polygonArea(points) < 100);
  assert.ok(polygonArea(offset[island]) > polygonArea(contours[island]), "the island is depth 2, so it grows");
});