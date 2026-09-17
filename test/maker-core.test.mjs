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
  stripFlatBackground,
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
  ORNAMENT_SHAPES,
  ornamentShapePoints,
  PHOTO_BLOCK_SIZES,
  photoBlockSize,
  LUGGAGE_TAG_SIZES,
  LUGGAGE_TAG_SHAPES,
  luggageTagShapePoints,
  luggageTagHole,
  BOOKMARK_SIZES,
  BOOKMARK_SHAPES,
  bookmarkShapePoints,
  bookmarkHole,
  isBookmarkShape,
  COASTER_SIZES,
  COASTER_SHAPES,
  coasterShapePoints,
  isCoasterShape,
  DESK_NAME_PLATE_SIZES,
  NAME_PLATE_FINISHES,
  deskNamePlateSize,
  deskNamePlatePoints,
  isNamePlateFinish,
  CAKE_TOPPER_SIZES,
  CAKE_TOPPER_STYLES,
  cakeTopperBarRect,
  cakeTopperPlaque,
  isCakeTopperStyle,
  sizeOptionLabel,
  ornamentHole,
  widthAtY,
  circleInsidePolygon,
  PRINT_DPI,
  JIGSAW_PUZZLE_SIZES,
  JIGSAW_GRIDS,
  jigsawGrid,
  isJigsawGrid,
  jigsawEdgePoints,
  jigsawCutPaths,
  polylineToPathD,
} from "../assets/maker-core.mjs";
import fs from "node:fs";

test("the shared engine exposes the fourteen distinct maker profiles", () => {
  assert.deepEqual(listProductProfiles().map((profile) => profile.id), ["keychain", "standee", "sticker", "magnet", "photo-keychain", "name-keychain", "ornament", "block", "luggage-tag", "cake-topper", "bookmark", "coaster", "name-plate", "jigsaw"]);
  assert.equal(getProductProfile("standee").hasBase, true);
  assert.equal(getProductProfile("sticker").exportSvg, true);
  assert.equal(getProductProfile("photo-keychain").hasHardware, true);
  assert.equal(getProductProfile("name-keychain").hasHardware, true);
  assert.equal(getProductProfile("ornament").hasHardware, true);
  assert.equal(getProductProfile("ornament").exportSvg, true);
  assert.equal(getProductProfile("bookmark").exportSvg, true);
  assert.equal(getProductProfile("bookmark").hasHardware, false);
  assert.equal(getProductProfile("bookmark").sizes.length, 3);
  assert.equal(getProductProfile("block").exportSvg, false);
  assert.equal(getProductProfile("block").sizes.length, 4);
  assert.equal(getProductProfile("luggage-tag").exportSvg, true);
  assert.equal(getProductProfile("luggage-tag").sizes.length, 3);
  assert.equal(getProductProfile("cake-topper").exportSvg, true);
  assert.equal(getProductProfile("cake-topper").hasHardware, false);
  assert.equal(getProductProfile("cake-topper").hasBase, false);
  assert.equal(getProductProfile("cake-topper").sizes.length, 3);
  assert.equal(getProductProfile("coaster").exportSvg, true);
  assert.equal(getProductProfile("coaster").hasHardware, false);
  assert.equal(getProductProfile("coaster").hasBase, false);
  assert.equal(getProductProfile("coaster").sizes.length, 3);
  assert.equal(getProductProfile("name-plate").exportSvg, true);
  assert.equal(getProductProfile("name-plate").hasHardware, false);
  assert.equal(getProductProfile("name-plate").hasBase, false);
  assert.equal(getProductProfile("name-plate").sizes.length, 3);
  assert.equal(getProductProfile("jigsaw").exportSvg, true);
  assert.equal(getProductProfile("jigsaw").hasHardware, false);
  assert.equal(getProductProfile("jigsaw").hasBase, false);
  assert.equal(getProductProfile("jigsaw").sizes.length, 4);
});

test("the photo block sizes keep the inch label next to the centimetre print maths", () => {
  assert.equal(PHOTO_BLOCK_SIZES.length, 4);
  assert.equal(photoBlockSize("17.78").id, "5x7");
  assert.equal(photoBlockSize(17.78).label, "5 x 7 in (13 x 18 cm)");
  assert.equal(photoBlockSize("25.4").id, "8x10");
  assert.equal(photoBlockSize("999").id, "2x2", "an unknown long side should fall back to the first size");
  assert.equal(physicalPixels(photoBlockSize("17.78").heightCm, PRINT_DPI), 2100);
  assert.equal(physicalPixels(photoBlockSize("25.4").heightCm, PRINT_DPI), 3000);
  assert.equal(physicalPixels(photoBlockSize("5.08").heightCm, PRINT_DPI), 600);
  assert.equal(physicalPixels(photoBlockSize("10.16").heightCm, PRINT_DPI), 1200);
});

test("size dropdowns read in inches for photo blocks and centimetres everywhere else", () => {
  const block = getProductProfile("block");
  assert.equal(sizeOptionLabel(block, 17.78), "5 x 7 in (13 x 18 cm)");
  assert.equal(sizeOptionLabel(block, 25.4), "8 x 10 in (20 x 25 cm)");
  assert.equal(sizeOptionLabel(getProductProfile("keychain"), 5), "5 cm long side");
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
  for (const page of ["pet-keychain-maker.html", "photo-keychain-maker.html", "name-keychain-maker.html", "ornament-maker.html", "acrylic-standee-maker.html", "sticker-cutline-generator.html", "fridge-magnet-maker.html", "acrylic-photo-block-maker.html", "luggage-tag-maker.html", "cake-topper-maker.html", "photo-jigsaw-puzzle-maker.html"]) {
    assert.equal(fs.existsSync(new URL(`../${page}`, import.meta.url)), true, `${page} is missing`);
  }
});


// ---------------------------------------------------------------- jigsaw geometry

test("unknown jigsaw grids fall back to the first offer and the offered four pass", () => {
  assert.equal(JIGSAW_GRIDS.length, 4);
  assert.deepEqual(JIGSAW_GRIDS.map((grid) => grid.id), ["3x3", "4x4", "5x5", "6x6"]);
  assert.equal(JIGSAW_GRIDS[0].label, "3 x 3 - 9 pieces");
  assert.equal(jigsawGrid("5x5").id, "5x5");
  assert.equal(jigsawGrid("9x9").id, "3x3", "an unknown grid should fall back to the first offer");
  assert.equal(jigsawGrid(undefined).id, "3x3");
  assert.equal(isJigsawGrid("5x5"), true);
  assert.equal(isJigsawGrid("2x2"), false);
  assert.equal(isJigsawGrid(undefined), false);
});

test("jigsaw cut paths tile the sheet with the right number of interior seams", () => {
  const { outline, cuts } = jigsawCutPaths(300, 200, 3, 3);
  assert.equal(cuts.length, 12, "a 3 x 3 grid has twelve interior seams");
  assert.equal(jigsawCutPaths(300, 200, 6, 6).cuts.length, 60, "a 6 x 6 grid has sixty interior seams");
  const bounds = boundsOfContours([outline]);
  assert.ok(Math.abs(bounds.minX) <= 0.6 && Math.abs(bounds.minY) <= 0.6, "outline sits on the origin");
  assert.ok(Math.abs(bounds.maxX - 300) <= 0.6 && Math.abs(bounds.maxY - 200) <= 0.6, "outline covers the sheet");
  for (const cut of cuts) {
    assert.ok(cut.length >= 61, "every seam keeps enough samples for its wobble");
    for (const [x, y] of cut) {
      assert.ok(x >= -0.6 && x <= 300.6, "seam x stays inside the sheet");
      assert.ok(y >= -0.6 && y <= 200.6, "seam y stays inside the sheet");
    }
  }
});

test("jigsaw knobs bulge one way and mirror when the sign flips", () => {
  const up = jigsawEdgePoints(0, 0, 100, 0, 1);
  const down = jigsawEdgePoints(0, 0, 100, 0, -1);
  assert.equal(up.length, 101, "the seam keeps its one-unit sampling");
  assert.deepEqual(up[0], [0, 0]);
  assert.deepEqual(up[up.length - 1], [100, 0]);
  const peakUp = Math.max(...up.map(([, y]) => y));
  const peakDown = Math.min(...down.map(([, y]) => y));
  assert.ok(Math.abs(peakUp - 31) <= 1, "the knob rises about 0.31 of the seam, saw " + peakUp);
  assert.ok(Math.abs(peakDown + peakUp) <= 1, "the mirrored knob dips the same amount, saw " + peakDown);
  assert.ok(Math.min(...up.map(([, y]) => y)) >= -0.6, "the seam never dips below its span");
});

test("open polylines become path data without a closing command", () => {
  assert.equal(polylineToPathD([[0, 0], [10.5, 3]]), "M0 0L10.5 3");
  assert.equal(polylineToPathD([[0, 0], [10.5, 3]]).includes("Z"), false, "a cut seam stays open");
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

test("ink that runs to the edge of the mask still traces as one closed loop", () => {
  // A cake topper bar spans the full artwork width and a round plaque fills its canvas, so the
  // outline touches the image border on every side. Tracing used to leave that boundary open
  // and split the cut path into slivers; the padding inside traceContours keeps it closed.
  const size = 32;
  const contours = traceContours(blockMask(size, 0, 0, size, size), size, size);
  assert.equal(contours.length, 1);
  const bounds = boundsOfContours(contours);
  assert.equal(bounds.width, size);
  assert.equal(bounds.height, size);
  assert.ok(Math.abs(polygonArea(contours[0]) - size * size) < size, "a full mask traces to its own area");
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

// ---------------------------------------------------------------- ornament silhouette geometry

function polygonBounds(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  return { width, height, minX: Math.min(...xs), minY: Math.min(...ys) };
}

test("every ornament silhouette fills its box exactly so the long side means the same thing", () => {
  assert.deepEqual([...ORNAMENT_SHAPES], ["round", "oval", "hexagon", "star", "heart", "arch"]);
  for (const shape of ORNAMENT_SHAPES) {
    const box = polygonBounds(ornamentShapePoints(shape, 620, 620));
    assert.ok(Math.abs(box.width - 620) < 0.5, shape + " width should fill the box, got " + box.width);
    assert.ok(Math.abs(box.height - 620) < 0.5, shape + " height should fill the box, got " + box.height);
    assert.ok(Math.abs(box.minX) < 0.5 && Math.abs(box.minY) < 0.5, shape + " should anchor at the top-left of its box");
  }
  const oval = polygonBounds(ornamentShapePoints("oval", 620, 430));
  assert.ok(Math.abs(oval.width - 620) < 0.5 && Math.abs(oval.height - 430) < 0.5, "an oval box keeps its own aspect ratio");
});

test("an unknown ornament shape falls back to a safe round silhouette", () => {
  const box = polygonBounds(ornamentShapePoints("triangle", 300, 300));
  assert.ok(Math.abs(box.width - 300) < 0.5 && Math.abs(box.height - 300) < 0.5);
});

test("the hanging hole always sits on solid material for every silhouette", () => {
  for (const shape of ORNAMENT_SHAPES) {
    const points = ornamentShapePoints(shape, 620, 620);
    const hole = ornamentHole(shape, 620, 620);
    assert.ok(hole.r >= 3, shape + " hole should keep a usable radius");
    assert.equal(circleInsidePolygon(hole.cx, hole.cy, hole.r, points), true, shape + " hole must not cut through the outline");
  }
});

test("the pointed silhouettes drop their hanging hole below the narrow tips", () => {
  // A star point and the heart centre notch cannot hold a round hole at the very top,
  // so the geometry slides the hole down instead of clipping the outline.
  const starHole = ornamentHole("star", 620, 620);
  const roundHole = ornamentHole("round", 620, 620);
  assert.ok(starHole.cy > roundHole.cy + 6, "the star hole sits lower than a disc hole");
  const heartHole = ornamentHole("heart", 620, 620);
  assert.ok(heartHole.cy > roundHole.cy + 6, "the heart hole sits lower than a disc hole");
});

test("the silhouette width report gives engraving text a safe band to sit in", () => {
  // Engraving text is placed by walking up the silhouette until the row is wide
  // enough, so widthAtY has to report the real chord width at a given height.
  const heart = ornamentShapePoints("heart", 620, 620);
  const wide = widthAtY(heart, 620 * 0.5);
  const narrow = widthAtY(heart, 620 * 0.855);
  assert.ok(wide && narrow, "both probe heights should cross the heart");
  assert.ok(wide.width > narrow.width, "the heart is wider above its tip");
  const round = widthAtY(ornamentShapePoints("round", 620, 620), 620 * 0.5);
  assert.ok(Math.abs(round.width - 620) < 1, "a disc is at its full width through the middle");
  assert.equal(widthAtY(heart, -40), null, "heights outside the shape report nothing");
});

// ---------------------------------------------------------------- luggage tag silhouette geometry

test("every luggage tag silhouette fills its box exactly", () => {
  assert.deepEqual([...LUGGAGE_TAG_SHAPES], ["rounded", "tag", "circle", "oval"]);
  const boxes = { rounded: [0.66, 1], tag: [0.6, 1], circle: [1, 1], oval: [1, 0.72] };
  for (const shape of LUGGAGE_TAG_SHAPES) {
    const base = 620;
    const w = base * boxes[shape][0];
    const h = base * boxes[shape][1];
    const box = polygonBounds(luggageTagShapePoints(shape, w, h));
    assert.ok(Math.abs(box.width - w) < 0.5, shape + " width should fill the box, got " + box.width);
    assert.ok(Math.abs(box.height - h) < 0.5, shape + " height should fill the box, got " + box.height);
    assert.ok(Math.abs(box.minX) < 0.5 && Math.abs(box.minY) < 0.5, shape + " should anchor at the top-left of its box");
  }
});

test("an unknown luggage tag shape falls back to the rounded silhouette", () => {
  const box = polygonBounds(luggageTagShapePoints("square-ish", 620, 620));
  const rounded = polygonBounds(luggageTagShapePoints("rounded", 620, 620));
  assert.ok(Math.abs(box.width - rounded.width) < 0.5 && Math.abs(box.height - rounded.height) < 0.5);
});

test("the strap hole always sits on solid material for every luggage tag silhouette", () => {
  for (const shape of LUGGAGE_TAG_SHAPES) {
    const points = luggageTagShapePoints(shape, 620, 620);
    const hole = luggageTagHole(shape, 620, 620);
    assert.ok(hole.r >= 3, shape + " hole should keep a usable radius");
    assert.equal(circleInsidePolygon(hole.cx, hole.cy, hole.r, points), true, shape + " hole must not cut through the outline");
  }
});

test("luggage tag sizes print at 300 DPI on the long side", () => {
  assert.deepEqual([...LUGGAGE_TAG_SIZES], [7, 9, 11]);
  assert.equal(physicalPixels(9, PRINT_DPI), 1063);
  assert.equal(physicalPixels(7, PRINT_DPI), 827);
  assert.equal(physicalPixels(11, PRINT_DPI), 1299);
});

// ---------------------------------------------------------------- cake topper geometry

test("the cake topper styles stay limited to the three modelled acrylic shapes", () => {
  assert.deepEqual([...CAKE_TOPPER_STYLES], ["cutout", "bar", "plaque"]);
  assert.equal(isCakeTopperStyle("bar"), true);
  assert.equal(isCakeTopperStyle("cutout"), true);
  assert.equal(isCakeTopperStyle("plaque"), true);
  assert.equal(isCakeTopperStyle("sparkle"), false);
  assert.equal(isCakeTopperStyle(""), false);
});

test("the welded bar straddles the text baseline so the letters stay attached", () => {
  // Bar style welds the letters onto a strip of acrylic. The strip has to cross the
  // baseline, otherwise the glyphs float above it and the cut file falls apart.
  const rect = cakeTopperBarRect(1200, 400, 200, 50);
  assert.ok(rect.y < 400, 'the bar starts above the baseline, got y=' + rect.y);
  assert.ok(rect.y + rect.h > 400, 'the bar reaches below the baseline, got bottom=' + (rect.y + rect.h));
  assert.equal(rect.x, 0);
  assert.equal(rect.w, 1200);
  assert.ok(rect.h > 0 && rect.h < 200, 'the bar stays slimmer than the cap height, got h=' + rect.h);
  const tall = cakeTopperBarRect(1200, 400, 200, 200);
  assert.ok(tall.h > rect.h, 'a deeper descender pushes the bar lower');
});

test("the round plaque keeps a circle inside its bounding box", () => {
  const disc = cakeTopperPlaque(1200, 600);
  assert.equal(disc.r, 300);
  assert.equal(disc.cx, 600);
  assert.equal(disc.cy, 300);
  const tall = cakeTopperPlaque(400, 900);
  assert.equal(tall.r, 200, 'the radius follows the shorter side');
  assert.equal(tall.cy, 450);
});

test("cake topper sizes print at 300 DPI on the long side", () => {
  assert.deepEqual([...CAKE_TOPPER_SIZES], [10, 12, 15]);
  assert.equal(physicalPixels(10, PRINT_DPI), 1181);
  assert.equal(physicalPixels(12, PRINT_DPI), 1417);
  assert.equal(physicalPixels(15, PRINT_DPI), 1772);
});

function rgbaPicture(w, h, paint) {
  const pixels = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = (y * w + x) * 4;
    const [r, g, b, a] = paint(x, y);
    pixels[p] = r; pixels[p + 1] = g; pixels[p + 2] = b; pixels[p + 3] = a;
  }
  return pixels;
}

test("a flat backdrop behind an opaque photo is lifted so the cut line follows the subject", () => {
  // A JPEG has no alpha channel, so before this the mask covered the whole frame and the
  // sticker tool traced the frame instead of the subject.
  const w = 80, h = 60, cx = 40, cy = 30, radius = 16;
  const picture = rgbaPicture(w, h, (x, y) => {
    const inside = (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius;
    return inside ? [232, 90, 43, 255] : [255, 255, 255, 255];
  });
  const stripped = stripFlatBackground(picture, w, h);
  assert.equal(stripped.applied, true);
  assert.deepEqual(stripped.color, [255, 255, 255]);
  assert.ok(stripped.removedRatio > 0.6 && stripped.removedRatio < 0.95, "removed " + stripped.removedRatio);
  assert.equal(stripped.pixels[(2 * w + 2) * 4 + 3], 0, "a corner pixel becomes transparent");
  assert.equal(stripped.pixels[(cy * w + cx) * 4 + 3], 255, "the subject stays opaque");
  const contours = traceContours(alphaToMask(stripped.pixels, w, h, 18), w, h);
  assert.equal(contours.length, 1);
  const bounds = boundsOfContours(contours);
  assert.ok(Math.abs(bounds.width - radius * 2) <= 2, "cut width " + bounds.width);
  assert.ok(Math.abs(bounds.height - radius * 2) <= 2, "cut height " + bounds.height);
});

test("a busy border is left alone so a real scene still traces to its frame", () => {
  const w = 40, h = 30;
  const picture = rgbaPicture(w, h, (x, y) => ((x + y) % 2 === 0 ? [0, 0, 0, 255] : [255, 255, 255, 255]));
  const stripped = stripFlatBackground(picture, w, h);
  assert.equal(stripped.applied, false);
  assert.equal(stripped.pixels, picture, "the original buffer is handed straight back");
});

test("a backdrop that would swallow the whole picture is refused", () => {
  const picture = rgbaPicture(40, 30, () => [255, 255, 255, 255]);
  const stripped = stripFlatBackground(picture, 40, 30);
  assert.equal(stripped.applied, false, "a blank upload must not be erased into nothing");
  assert.equal(stripped.pixels, picture);
});

test("a picture that already carries transparency is never re-keyed", () => {
  const picture = rgbaPicture(40, 30, (x) => (x < 20 ? [20, 20, 20, 255] : [20, 20, 20, 0]));
  const stripped = stripFlatBackground(picture, 40, 30);
  assert.equal(stripped.applied, false);
  assert.equal(stripped.pixels, picture);
});

test("every bookmark silhouette fills its box and keeps the tassel hole on solid material", () => {
  const width = 290, height = 1000;
  for (const shape of BOOKMARK_SHAPES) {
    const points = bookmarkShapePoints(shape, width, height);
    const bounds = boundsOfContours([points]);
    assert.ok(Math.abs(bounds.minX) <= 0.6, shape + " left edge " + bounds.minX);
    assert.ok(Math.abs(bounds.maxX - width) <= 0.6, shape + " right edge " + bounds.maxX);
    assert.ok(Math.abs(bounds.minY) <= 0.6, shape + " top edge " + bounds.minY);
    assert.ok(Math.abs(bounds.maxY - height) <= 0.6, shape + " bottom edge " + bounds.maxY);
    const hole = bookmarkHole(shape, width, height);
    assert.ok(hole.r >= 3.4, shape + " hole radius " + hole.r);
    assert.ok(
      circleInsidePolygon(hole.cx, hole.cy, hole.r, points),
      shape + " tassel hole pokes outside the outline",
    );
  }
});

test("an unknown bookmark shape falls back to the classic slab", () => {
  assert.equal(isBookmarkShape("teardrop"), false);
  assert.equal(isBookmarkShape("classic"), true);
  assert.deepEqual(bookmarkShapePoints("teardrop", 200, 800), bookmarkShapePoints("classic", 200, 800));
});

test("bookmark sizes map to the documented print pixels", () => {
  assert.deepEqual([...BOOKMARK_SIZES], [15, 18, 20]);
  assert.equal(physicalPixels(15, PRINT_DPI), 1772);
  assert.equal(physicalPixels(18, PRINT_DPI), 2126);
  assert.equal(physicalPixels(20, PRINT_DPI), 2362);
});

test("every coaster blank fills its box and keeps its points on the blank", () => {
  const size = 600;
  for (const shape of COASTER_SHAPES) {
    const points = coasterShapePoints(shape, size, size);
    const bounds = boundsOfContours([points]);
    assert.ok(Math.abs(bounds.minX) <= 0.6, shape + " left edge " + bounds.minX);
    assert.ok(Math.abs(bounds.maxX - size) <= 0.6, shape + " right edge " + bounds.maxX);
    assert.ok(Math.abs(bounds.minY) <= 0.6, shape + " top edge " + bounds.minY);
    assert.ok(Math.abs(bounds.maxY - size) <= 0.6, shape + " bottom edge " + bounds.maxY);
  }
  const round = coasterShapePoints("round", size, size, 64);
  assert.equal(round.length, 64, "the round blank keeps the requested sample count");
  for (const point of round) {
    const dx = point[0] - size / 2, dy = point[1] - size / 2;
    assert.ok(Math.abs(Math.hypot(dx, dy) - size / 2) <= 0.8, "a round blank point drifts off the circle");
  }
});

test("an unknown coaster shape falls back to the square blank", () => {
  assert.equal(isCoasterShape("hexagon"), false);
  assert.equal(isCoasterShape("round"), true);
  assert.deepEqual(coasterShapePoints("hexagon", 200, 200), coasterShapePoints("square", 200, 200));
});

test("coaster sizes print at 300 DPI on the square blank", () => {
  assert.deepEqual([...COASTER_SIZES], [9, 10, 11]);
  assert.equal(physicalPixels(9, PRINT_DPI), 1063);
  assert.equal(physicalPixels(10, PRINT_DPI), 1181);
  assert.equal(physicalPixels(11, PRINT_DPI), 1299);
});

test("desk name plate sizes map inches onto the centimetre print maths", () => {
  assert.equal(DESK_NAME_PLATE_SIZES.length, 3);
  assert.equal(deskNamePlateSize("20.32").id, "2x8");
  assert.equal(deskNamePlateSize(20.32).label, "2 x 8 in (20 x 5 cm)");
  assert.equal(deskNamePlateSize(25.4).id, "2x10");
  assert.equal(deskNamePlateSize(30.48).id, "2x12");
  assert.equal(deskNamePlateSize("999").id, "2x8", "an unknown width should fall back to the first size");
  assert.equal(physicalPixels(deskNamePlateSize("20.32").widthCm, PRINT_DPI), 2400);
  assert.equal(physicalPixels(deskNamePlateSize("30.48").widthCm, PRINT_DPI), 3600);
});

test("every desk name plate blank fills its box", () => {
  const width = 1200, height = 300;
  const points = deskNamePlatePoints(width, height);
  const bounds = boundsOfContours([points]);
  assert.ok(Math.abs(bounds.minX) <= 0.6, "left edge " + bounds.minX);
  assert.ok(Math.abs(bounds.maxX - width) <= 0.6, "right edge " + bounds.maxX);
  assert.ok(Math.abs(bounds.minY) <= 0.6, "top edge " + bounds.minY);
  assert.ok(Math.abs(bounds.maxY - height) <= 0.6, "bottom edge " + bounds.maxY);
  assert.equal(deskNamePlatePoints(width, height, 64).length, 64, "the blank keeps the requested sample count");
});

test("an unknown desk name plate finish is rejected and the offered three pass", () => {
  assert.deepEqual([...NAME_PLATE_FINISHES], ["black", "clear", "frosted"]);
  assert.equal(isNamePlateFinish("black"), true);
  assert.equal(isNamePlateFinish("frosted"), true);
  assert.equal(isNamePlateFinish("glossy"), false);
  assert.equal(isNamePlateFinish(undefined), false);
});
