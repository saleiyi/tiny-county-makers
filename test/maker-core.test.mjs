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
  PET_TAG_SIZES,
  PET_TAG_SHAPES,
  petTagShapePoints,
  isPetTagShape,
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
  STICKER_OUTLINE_SIZES,
  STICKER_BORDER_PRESETS,
  stickerBorderWidth,
  stickerBorderHex,
  PHOTO_STRIP_SIZES,
  PHOTO_STRIP_COUNTS,
  photoStripSize,
  photoStripCount,
  photoStripPaperHex,
  TABLE_NUMBER_SIZES,
  TABLE_NUMBER_SHAPES,
  tableNumberSize,
  tableNumberShape,
  tableNumberPaperHex,
  readableInk,
  PLACE_CARD_SHEETS,
  PLACE_CARD_STYLES,
  PLACE_CARD_PAPERS,
  placeCardSheet,
  placeCardStyle,
  placeCardPaperHex,
  placeCardMeal,
  placeCardGrid,
  placeCardGuests,
  POLAROID_FRAMES,
  POLAROID_PAPERS,
  POLAROID_FINISHES,
  POLAROID_SHEETS,
  polaroidFrame,
  polaroidPaperHex,
  polaroidFinish,
  polaroidSheet,
  polaroidGrid,
  CUPCAKE_TOPPER_SIZES,
  CUPCAKE_SHAPES,
  CUPCAKE_SHEETS,
  CUPCAKE_PAPERS,
  cupcakeTopper,
  cupcakeShape,
  cupcakeSheet,
  cupcakePaperHex,
  cupcakeGrid,
  GIFT_TAG_SIZES,
  GIFT_TAG_SHAPES,
  GIFT_TAG_SHEETS,
  GIFT_TAG_PAPERS,
  giftTagSize,
  giftTagShape,
  giftTagSheet,
  giftTagPaperHex,
  giftTagGrid,
  giftTagHole,
  NAME_TRACING_PAPERS,
  NAME_TRACING_STYLES,
  NAME_TRACING_RULES,
  NAME_TRACING_CASES,
  NAME_TRACING_INKS,
  NAME_TRACING_LIMIT,
  NAME_TRACING_ROW_MIN,
  NAME_TRACING_ROW_MAX,
  NAME_TRACING_BLANK_MAX,
  NAME_TRACING_MARGIN_CM,
  nameTracingPaper,
  nameTracingStyle,
  nameTracingRule,
  nameTracingCase,
  nameTracingInkHex,
  nameTracingText,
  nameTracingNames,
  nameTracingSlots,
  nameTracingSheet,
  wordSearchPaper,
  wordSearchGrid,
  wordSearchLevel,
  wordSearchTheme,
  wordSearchCase,
  wordSearchWord,
  wordSearchList,
  wordSearchAutoCells,
  wordSearchBuild,
  wordSearchPath,
  wordSearchSheet,
  wordSearchListColumns,
  WORD_SEARCH_THEMES,
  WORD_SEARCH_LIMIT,
  seededRandom,
  BINGO_THEMES,
  BINGO_COLUMNS,
  BINGO_NUMBER_CEILING,
  BINGO_MAX_CARDS,
  BINGO_WORD_MAX,
  BINGO_WORD_LIMIT,
  BINGO_CARD_ASPECT,
  bingoPaper,
  bingoGrid,
  bingoLayout,
  bingoMode,
  bingoCase,
  bingoTheme,
  bingoEntry,
  bingoCardCount,
  bingoWords,
  bingoNeeded,
  bingoFreeCell,
  bingoNumberGrid,
  bingoWordGrid,
  bingoCardSet,
  bingoSheet,
  bingoPageCount,
  bingoCallList,
  bingoCallColumns,
  CHART_PAPERS,
  CHART_DAYS,
  CHART_STYLES,
  CHART_THEMES,
  CHART_SAMPLE,
  CHART_MAX_ROWS,
  CHART_MIN_ROWS,
  CHART_ROW_LIMIT,
  CHART_CHORE_MAX,
  CHART_MARGIN_CM,
  CHART_TITLE_MAX,
  CHART_NAME_MAX,
  chartPaper,
  chartDays,
  chartStyle,
  chartTheme,
  chartRows,
  chartChores,
  chartText,
  chartSheet,
  CROWN_STYLES,
  CROWN_BANDS,
  CROWN_MARGIN_CM,
  CROWN_NAME_MAX,
  CROWN_PER_SHEET,
  CROWN_TAB_CM,
  CROWN_TOOTH_CM,
  CROWN_MIN_GAP_CM,
  CROWN_SAMPLE,
  crownStyle,
  crownBand,
  crownSheet,
  MUL_TYPES,
  MUL_RANGES,
  MUL_FILLS,
  MUL_SQUARES,
  MUL_ORIENTS,
  MUL_MARGIN_CM,
  MUL_TITLE_MAX,
  MUL_NAME_MAX,
  MUL_TABLES_MAX,
  MUL_MIN_CELL_CM,
  MUL_SAMPLE,
  mulType,
  mulRange,
  mulFill,
  mulSquares,
  mulOrient,
  mulShowsAnswer,
  mulSheet,
  COLORING_PAPERS,
  COLORING_MARGIN_CM,
  COLORING_STYLES,
  COLORING_DETAILS,
  COLORING_WEIGHTS,
  coloringPaper,
  coloringStyle,
  coloringDetail,
  coloringWeight,
  lineWeightPx,
  lineRadiusPx,
  coloringPage,
  fitBox,
  grayscalePlane,
  boxBlurPlane,
  posterizeThresholds,
  posterizePlane,
  boundaryMask,
  differenceOfGaussians,
  quantileThreshold,
  maskAbove,
  dilateMask,
  despeckleMask,
  invertMask,
  maskInkRatio,
} from "../assets/maker-core.mjs";
import fs from "node:fs";

test("the shared engine exposes the twenty-nine distinct maker profiles", () => {
  assert.deepEqual(listProductProfiles().map((profile) => profile.id), ["keychain", "standee", "sticker", "magnet", "photo-keychain", "name-keychain", "ornament", "block", "luggage-tag", "pet-tag", "cake-topper", "cupcake", "bookmark", "coaster", "name-plate", "jigsaw", "sticker-outline", "photo-strip", "table-number", "polaroid", "place-card", "coloring", "gift-tag", "name-tracing", "bingo", "chore-chart", "multiplication-chart", "crown-maker", "word-search"]);
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
  assert.equal(getProductProfile("pet-tag").exportSvg, true);
  assert.equal(getProductProfile("pet-tag").hasHardware, false);
  assert.equal(getProductProfile("pet-tag").hasBase, false);
  assert.equal(getProductProfile("pet-tag").sizes.length, 3);
  assert.equal(getProductProfile("pet-tag").sizeLabels.length, 3);
  assert.equal(getProductProfile("pet-tag").sizeLabels[0], "Small (3 cm)");
  assert.equal(getProductProfile("cake-topper").exportSvg, true);
  assert.equal(getProductProfile("cake-topper").hasHardware, false);
  assert.equal(getProductProfile("cake-topper").hasBase, false);
  assert.equal(getProductProfile("cake-topper").sizes.length, 3);
  assert.equal(getProductProfile("cupcake").exportSvg, false);
  assert.equal(getProductProfile("cupcake").hasHardware, false);
  assert.equal(getProductProfile("cupcake").hasBase, false);
  assert.equal(getProductProfile("cupcake").sizes.length, 3);
  assert.equal(getProductProfile("cupcake").sizeLabels.length, 3);
  assert.equal(getProductProfile("cupcake").sizeLabels[0], "2 inch toppers (5.1 cm)");
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
  assert.equal(getProductProfile("sticker-outline").exportSvg, true);
  assert.equal(getProductProfile("sticker-outline").hasHardware, false);
  assert.equal(getProductProfile("sticker-outline").hasBase, false);
  assert.equal(getProductProfile("sticker-outline").sizes.length, 4);
  assert.equal(getProductProfile("photo-strip").exportSvg, false);
  assert.equal(getProductProfile("photo-strip").hasHardware, false);
  assert.equal(getProductProfile("photo-strip").hasBase, false);
  assert.equal(getProductProfile("photo-strip").sizes.length, 2);
  assert.equal(getProductProfile("photo-strip").sizeLabels.length, 2);
  assert.equal(getProductProfile("polaroid").exportSvg, false);
  assert.equal(getProductProfile("polaroid").hasHardware, false);
  assert.equal(getProductProfile("polaroid").hasBase, false);
  assert.equal(getProductProfile("polaroid").sizes.length, 4);
  assert.equal(getProductProfile("polaroid").sizeLabels.length, 4);
  assert.equal(getProductProfile("polaroid").sizeLabels[0], "Classic Polaroid, 3.5 x 4.2 in");
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
  for (const page of ["pet-keychain-maker.html", "photo-keychain-maker.html", "name-keychain-maker.html", "ornament-maker.html", "acrylic-standee-maker.html", "sticker-cutline-generator.html", "fridge-magnet-maker.html", "acrylic-photo-block-maker.html", "luggage-tag-maker.html", "pet-tag-maker.html", "cake-topper-maker.html", "photo-jigsaw-puzzle-maker.html", "table-number-maker.html", "polaroid-frame-maker.html", "place-card-maker.html"]) {
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

// ---------------------------------------------------------------- pet ID tag silhouette geometry

test("every pet ID tag silhouette fills its box exactly", () => {
  assert.deepEqual([...PET_TAG_SHAPES], ["circle", "oval", "rounded", "tag"]);
  assert.equal(isPetTagShape("circle"), true);
  assert.equal(isPetTagShape("oval"), true);
  assert.equal(isPetTagShape("rounded"), true);
  assert.equal(isPetTagShape("tag"), true);
  assert.equal(isPetTagShape("bone"), false);
  const boxes = { rounded: [0.66, 1], tag: [0.6, 1], circle: [1, 1], oval: [1, 0.72] };
  for (const shape of PET_TAG_SHAPES) {
    const base = 620;
    const w = base * boxes[shape][0];
    const h = base * boxes[shape][1];
    const box = polygonBounds(petTagShapePoints(shape, w, h));
    assert.ok(Math.abs(box.width - w) < 0.5, shape + " width should fill the box, got " + box.width);
    assert.ok(Math.abs(box.height - h) < 0.5, shape + " height should fill the box, got " + box.height);
    assert.ok(Math.abs(box.minX) < 0.5 && Math.abs(box.minY) < 0.5, shape + " should anchor at the top-left of its box");
  }
});

test("an unknown pet ID tag shape falls back to the round disc", () => {
  const box = polygonBounds(petTagShapePoints("bone", 620, 620));
  const circle = polygonBounds(petTagShapePoints("circle", 620, 620));
  assert.ok(Math.abs(box.width - circle.width) < 0.5 && Math.abs(box.height - circle.height) < 0.5);
  assert.deepEqual(polygonBounds(petTagShapePoints(undefined, 620, 620)), circle);
});

test("the collar hole always sits on solid material for every pet ID tag silhouette", () => {
  for (const shape of PET_TAG_SHAPES) {
    const points = petTagShapePoints(shape, 620, 620);
    const hole = luggageTagHole(shape, 620, 620);
    assert.ok(hole.r >= 3, shape + " hole should keep a usable radius");
    assert.equal(circleInsidePolygon(hole.cx, hole.cy, hole.r, points), true, shape + " hole must not cut through the outline");
  }
});

test("pet ID tag sizes print as a 3, 4 and 5 cm disc", () => {
  assert.deepEqual([...PET_TAG_SIZES], [3, 4, 5]);
  assert.equal(physicalPixels(3, PRINT_DPI), 354);
  assert.equal(physicalPixels(4, PRINT_DPI), 472);
  assert.equal(physicalPixels(5, PRINT_DPI), 591);
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

test("sticker border width stays inside one to ten millimetres and snaps to half steps", () => {
  assert.equal(stickerBorderWidth(0.2), 1);
  assert.equal(stickerBorderWidth(4.4), 4.5);
  assert.equal(stickerBorderWidth(99), 10);
  assert.equal(stickerBorderWidth("x"), 2);
  assert.equal(stickerBorderWidth(undefined), 2);
});

test("sticker border colours accept a hex value, a short hex value or a preset name", () => {
  assert.equal(stickerBorderHex("#ABC"), "#aabbcc");
  assert.equal(stickerBorderHex("cream"), "#f7efe1");
  assert.equal(stickerBorderHex("no-such-preset"), "#ffffff");
  assert.equal(stickerBorderHex(undefined), "#ffffff");
  assert.equal(STICKER_BORDER_PRESETS.length, 4);
  assert.equal(STICKER_OUTLINE_SIZES.length, 4);
});

test("photo strip layouts keep the single 2 x 6 in strip apart from the 4 x 6 in sheet", () => {
  assert.equal(PHOTO_STRIP_SIZES.length, 2);
  assert.equal(photoStripSize("5.08").id, "2x6");
  assert.equal(photoStripSize("5.08").cols, 1);
  assert.equal(photoStripSize("10.16").id, "4x6");
  assert.equal(photoStripSize("10.16").cols, 2);
  assert.equal(photoStripSize("999").id, "2x6", "an unknown width should fall back to the single strip");
  assert.equal(physicalPixels(photoStripSize("5.08").heightCm, PRINT_DPI), 1800);
  assert.equal(physicalPixels(photoStripSize("10.16").heightCm, PRINT_DPI), 1800);
});

test("a photo strip holds three or four frames and settles on four for anything else", () => {
  assert.deepEqual([...PHOTO_STRIP_COUNTS], [3, 4]);
  assert.equal(photoStripCount("3"), 3);
  assert.equal(photoStripCount(3), 3);
  assert.equal(photoStripCount("4"), 4);
  assert.equal(photoStripCount(5), 4);
  assert.equal(photoStripCount(undefined), 4);
});

test("photo strip paper colours take a hex value, a short hex value or a preset name", () => {
  assert.equal(photoStripPaperHex("#ABC"), "#aabbcc");
  assert.equal(photoStripPaperHex("#14181a"), "#14181a");
  assert.equal(photoStripPaperHex("cream"), "#f7efe1");
  assert.equal(photoStripPaperHex("blush"), "#f4dede");
  assert.equal(photoStripPaperHex("no-such-paper"), "#ffffff");
  assert.equal(photoStripPaperHex(undefined), "#ffffff");
});

test("the caption ink flips to white on dark paper and stays dark on light paper", () => {
  assert.equal(readableInk("#ffffff"), "#1d2420");
  assert.equal(readableInk("cream"), "#1d2420");
  assert.equal(readableInk("blush"), "#1d2420");
  assert.equal(readableInk("#14181a"), "#ffffff");
  assert.equal(readableInk("#000000"), "#ffffff");
  assert.equal(readableInk(undefined), "#1d2420");
});

test("table number card sizes map inches onto the centimetre print maths", () => {
  assert.equal(TABLE_NUMBER_SIZES.length, 3);
  assert.equal(tableNumberSize("10.16").id, "4x6");
  assert.equal(tableNumberSize("12.7").id, "5x7");
  assert.equal(tableNumberSize("12.7").heightCm, 17.78, "the size picker keys off the width, so 5 x 7 stores 12.7 cm");
  assert.equal(tableNumberSize("12.7").shorter, "5 x 7 in");
  assert.equal(tableNumberSize("14.8").id, "a5");
  assert.equal(tableNumberSize("999").id, "4x6", "an unknown width should fall back to the first card");
  assert.equal(tableNumberSize(undefined).id, "4x6");
  assert.equal(physicalPixels(tableNumberSize("10.16").heightCm, PRINT_DPI), 1800);
  assert.equal(physicalPixels(tableNumberSize("12.7").heightCm, PRINT_DPI), 2100);
  assert.equal(physicalPixels(tableNumberSize("14.8").heightCm, PRINT_DPI), 2480);
  assert.equal(tableNumberSize("10.16").short, "4 x 6 in (10 x 15 cm)");
});

test("table number shapes offer an arch, a rectangle and a rounded card", () => {
  assert.deepEqual([...TABLE_NUMBER_SHAPES], ["arch", "rectangle", "rounded"]);
  assert.equal(tableNumberShape("arch"), "arch");
  assert.equal(tableNumberShape("Rounded"), "rounded");
  assert.equal(tableNumberShape("rectangle"), "rectangle");
  assert.equal(tableNumberShape("junk"), "arch", "an unknown shape should fall back to the arch");
  assert.equal(tableNumberShape(undefined), "arch");
});

test("table number card colours take a hex value, a short hex value or a preset name", () => {
  assert.equal(tableNumberPaperHex("#ABC"), "#aabbcc");
  assert.equal(tableNumberPaperHex("#14181a"), "#14181a");
  assert.equal(tableNumberPaperHex("ivory"), "#f7f1e4");
  assert.equal(tableNumberPaperHex("sage"), "#dce5d8");
  assert.equal(tableNumberPaperHex("blush"), "#f3dede");
  assert.equal(tableNumberPaperHex("no-such-paper"), "#ffffff");
  assert.equal(tableNumberPaperHex(undefined), "#ffffff");
});

test("place card sheets expose US Letter and A4 at print size", () => {
  assert.equal(PLACE_CARD_SHEETS.length, 2);
  assert.equal(placeCardSheet("21.59").id, "letter");
  assert.equal(placeCardSheet(21).id, "a4");
  assert.equal(placeCardSheet("21.59").widthCm, 21.59);
  assert.equal(placeCardSheet("21.59").heightCm, 27.94);
  assert.equal(placeCardSheet(21).heightCm, 29.7);
  assert.equal(physicalPixels(placeCardSheet("21.59").widthCm, PRINT_DPI), 2550);
  assert.equal(physicalPixels(placeCardSheet(21).widthCm, PRINT_DPI), 2480);
  assert.equal(placeCardSheet("999").id, "letter", "an unknown sheet should fall back to US Letter");
  assert.equal(placeCardSheet(undefined).id, "letter");
});

test("place card grids fit 10 flat cards or 4 tent cards on a sheet", () => {
  const flat = placeCardGrid("21.59", "flat");
  assert.equal(flat.cols, 2);
  assert.equal(flat.rows, 5);
  assert.equal(flat.perSheet, 10);
  assert.equal(flat.card.widthCm, 8.89);
  assert.equal(flat.card.heightCm, 5.08);
  const tent = placeCardGrid("21.59", "tent");
  assert.equal(tent.cols, 2);
  assert.equal(tent.rows, 2);
  assert.equal(tent.perSheet, 4);
  assert.equal(tent.card.heightCm, 10.16);
  assert.equal(placeCardGrid(21, "flat").perSheet, 10, "A4 takes the same grid");
  assert.equal(placeCardGrid(21, "tent").perSheet, 4);
  assert.equal(placeCardGrid("21.59", "junk").style, "tent", "an unknown style falls back to the folded tent");
  assert.equal(placeCardGrid("21.59", undefined).style, "tent");
});

test("place card styles and paper colours resolve with safe fallbacks", () => {
  assert.deepEqual([...PLACE_CARD_STYLES], ["tent", "flat"]);
  assert.equal(placeCardStyle("TENT"), "tent");
  assert.equal(placeCardStyle("flat"), "flat");
  assert.equal(placeCardStyle("zzz"), "tent");
  assert.equal(placeCardStyle(undefined), "tent");
  assert.equal(PLACE_CARD_PAPERS.length, 5);
  assert.equal(placeCardPaperHex("#ABC"), "#aabbcc");
  assert.equal(placeCardPaperHex("ivory"), "#f7f1e4");
  assert.equal(placeCardPaperHex("sage"), "#dce5d8");
  assert.equal(placeCardPaperHex("black"), "#14181a");
  assert.equal(placeCardPaperHex("no-such-paper"), "#ffffff");
  assert.equal(placeCardPaperHex(undefined), "#ffffff");
});

test("place card guest parsing splits names from meal choices", () => {
  assert.deepEqual(placeCardGuests("Sarah Chen, chicken\n\nMichael Ross | beef\n  Tom  ,  fish \nGrace, unknown\nx"), [
    { name: "Sarah Chen", meal: "chicken" },
    { name: "Michael Ross", meal: "beef" },
    { name: "Tom", meal: "fish" },
    { name: "Grace", meal: "" },
    { name: "x", meal: "" },
  ]);
  assert.deepEqual(placeCardGuests(""), []);
  assert.equal(placeCardMeal("steak"), "beef");
  assert.equal(placeCardMeal("salmon"), "fish");
  assert.equal(placeCardMeal("veggie"), "veg");
  assert.equal(placeCardMeal("child"), "kids");
  assert.equal(placeCardMeal("nonsense"), "");
  assert.equal(placeCardGuests(Array.from({ length: 130 }, (_, i) => "G" + i).join("\n"), 5).length, 5);
  assert.equal(placeCardGuests(Array.from({ length: 130 }, (_, i) => "G" + i).join("\n")).length, 120);
});

test("polaroid frames offer the four instant film formats at print size", () => {
  assert.equal(POLAROID_FRAMES.length, 4);
  assert.equal(polaroidFrame(8.8).id, "classic");
  assert.equal(polaroidFrame("5.4").id, "mini");
  assert.equal(polaroidFrame(8.6).id, "square");
  assert.equal(polaroidFrame(10.8).id, "wide");
  assert.equal(polaroidFrame("999").id, "classic", "an unknown width should fall back to the classic frame");
  assert.equal(physicalPixels(polaroidFrame(8.8).widthCm, PRINT_DPI), 1039);
  assert.equal(physicalPixels(polaroidFrame(8.8).heightCm, PRINT_DPI), 1264);
  assert.equal(polaroidFrame(8.8).window.w, 7.9, "the photo window stays inside the film border");
});

test("polaroid sheet grids tile the frames with a printable margin", () => {
  assert.equal(POLAROID_SHEETS.length, 2);
  assert.equal(polaroidSheet("letter").widthCm, 21.59);
  assert.equal(polaroidSheet("A4").id, "a4");
  assert.equal(polaroidSheet("single"), null, "a single frame is not a sheet");
  assert.equal(polaroidSheet(undefined), null);
  assert.equal(polaroidSheet("nonsense"), null);
  assert.equal(polaroidGrid("letter", 8.8).perSheet, 4);
  assert.equal(polaroidGrid("a4", 8.8).perSheet, 4);
  assert.equal(polaroidGrid("letter", 5.4).perSheet, 6);
  assert.equal(polaroidGrid("a4", 5.4).perSheet, 9);
  assert.equal(polaroidGrid("letter", 8.6).perSheet, 6);
  assert.equal(polaroidGrid("a4", 8.6).perSheet, 6);
  assert.equal(polaroidGrid("letter", 10.8).perSheet, 2);
  assert.equal(polaroidGrid("a4", 10.8).perSheet, 3);
  assert.equal(polaroidGrid("letter", 8.8).gutterCm, 0.4, "frames leave a gutter so a trimmer can pass between them");
});

test("polaroid film colours and looks resolve with safe fallbacks", () => {
  assert.equal(POLAROID_PAPERS.length, 5);
  assert.equal(polaroidPaperHex("#ABC"), "#aabbcc");
  assert.equal(polaroidPaperHex("cream"), "#f7f1e4");
  assert.equal(polaroidPaperHex("kraft"), "#c9a978");
  assert.equal(polaroidPaperHex("no-such-paper"), "#ffffff");
  assert.equal(POLAROID_FINISHES.length, 4);
  assert.equal(polaroidFinish("warm").id, "warm");
  assert.equal(polaroidFinish("MONO").id, "mono", "lookups are case-insensitive");
  assert.equal(polaroidFinish("nope").id, "original");
  assert.equal(polaroidFinish(undefined).id, "original");
  assert.equal(polaroidFinish("warm").op, "overlay", "each look is one canvas blend so preview and print agree");
});

test("cupcake toppers ship the three printed sizes with matching labels", () => {
  assert.equal(CUPCAKE_TOPPER_SIZES.length, 3);
  assert.equal(cupcakeTopper(5.08).id, "2in");
  assert.equal(cupcakeTopper("6.35").id, "2-5in");
  assert.equal(cupcakeTopper(7.62).id, "3in");
  assert.equal(cupcakeTopper("999").id, "2in", "an unknown size should fall back to the smallest topper");
  assert.equal(cupcakeTopper(undefined).id, "2in");
  assert.ok(CUPCAKE_TOPPER_SIZES.every((size) => size.widthCm === size.heightCm), "toppers are round, so each size stays square");
  assert.equal(CUPCAKE_TOPPER_SIZES[1].label, "2.5 inch toppers (6.4 cm)");
});

test("cupcake shapes and card colours resolve with safe fallbacks", () => {
  assert.deepEqual([...CUPCAKE_SHAPES], ["circle", "scallop", "rounded", "square"]);
  assert.equal(cupcakeShape("SCALLOP"), "scallop");
  assert.equal(cupcakeShape("square"), "square");
  assert.equal(cupcakeShape("zzz"), "circle");
  assert.equal(cupcakeShape(undefined), "circle");
  assert.equal(CUPCAKE_PAPERS.length, 6);
  assert.equal(cupcakePaperHex("#ABC"), "#aabbcc");
  assert.equal(cupcakePaperHex("ivory"), "#f7f1e4");
  assert.equal(cupcakePaperHex("kraft"), "#c9a978");
  assert.equal(cupcakePaperHex("black"), "#14181a");
  assert.equal(cupcakePaperHex("no-such-paper"), "#ffffff");
  assert.equal(cupcakePaperHex(undefined), "#ffffff");
});

test("cupcake sheet grids tile a batch of toppers with a printable margin", () => {
  assert.equal(CUPCAKE_SHEETS.length, 2);
  assert.equal(cupcakeSheet("letter").widthCm, 21.59);
  assert.equal(cupcakeSheet("A4").id, "a4");
  assert.equal(cupcakeSheet("single"), null, "a single topper is not a sheet");
  assert.equal(cupcakeSheet(undefined), null);
  assert.equal(cupcakeSheet("nonsense"), null);
  const small = cupcakeGrid("letter", 5.08);
  assert.equal(small.cols, 3);
  assert.equal(small.rows, 4);
  assert.equal(small.perSheet, 12);
  assert.equal(cupcakeGrid("a4", 5.08).perSheet, 15, "A4 is taller, so it takes one more row");
  assert.equal(cupcakeGrid("letter", 6.35).perSheet, 12);
  assert.equal(cupcakeGrid("a4", 6.35).perSheet, 8);
  assert.equal(cupcakeGrid("letter", 7.62).perSheet, 6);
  assert.equal(cupcakeGrid("a4", 7.62).perSheet, 6);
  assert.equal(cupcakeGrid("letter", 5.08).gutterCm, 0.25, "toppers leave a gutter so scissors can pass between them");
  assert.equal(cupcakeGrid("letter", 5.08).marginCm, 0.8, "the grid stays clear of the unprintable border");
});

test("coloring paper, style, detail and weight lookups resolve with safe fallbacks", () => {
  assert.equal(COLORING_MARGIN_CM, 1.27);
  assert.deepEqual(COLORING_PAPERS.map((paper) => paper.id), ["letter", "a4"]);
  assert.equal(coloringPaper("a4").id, "a4");
  assert.equal(coloringPaper("US-Letter").id, "letter", "the printable aliases should still find their sheet");
  assert.equal(coloringPaper("nonsense").id, "letter", "an unknown sheet falls back to US Letter");
  assert.equal(coloringPaper(undefined).id, "letter");
  assert.deepEqual(COLORING_STYLES.map((style) => style.id), ["outline", "sketch"]);
  assert.equal(coloringStyle("sketch").id, "sketch");
  assert.equal(coloringStyle("pencil").id, "sketch");
  assert.equal(coloringStyle("zzz").id, "outline", "an unknown style falls back to the cleaner outline");
  assert.equal(coloringStyle(undefined).id, "outline");
  assert.deepEqual(COLORING_DETAILS.map((detail) => detail.id), ["simple", "balanced", "detailed"]);
  assert.equal(coloringDetail("simple").id, "simple");
  assert.equal(coloringDetail("high").id, "detailed");
  assert.equal(coloringDetail("nonsense").id, "balanced", "an unknown detail falls back to the balanced mid point");
  assert.equal(coloringDetail(undefined).id, "balanced");
  assert.deepEqual(COLORING_WEIGHTS.map((weight) => weight.id), ["fine", "medium", "bold"]);
  assert.equal(coloringWeight("bold").id, "bold");
  assert.equal(coloringWeight("thick").id, "bold");
  assert.equal(coloringWeight("nonsense").id, "medium");
  assert.equal(coloringWeight(undefined).id, "medium");
});

test("coloring page geometry keeps the printer margin in step with the paper", () => {
  const letter = coloringPage("letter", "portrait");
  assert.equal(letter.orientation, "portrait");
  assert.equal(letter.widthPx, 2550);
  assert.equal(letter.heightPx, 3300);
  assert.equal(letter.artWidthCm, 19.05);
  assert.equal(letter.artWidthPx, 2250);
  assert.equal(letter.marginPx, 150, "the art stays inside a 1.27 cm printer border");
  const flipped = coloringPage("letter", "landscape");
  assert.equal(flipped.orientation, "landscape");
  assert.equal(flipped.widthPx, 3300);
  assert.equal(flipped.heightPx, 2550);
  const a4 = coloringPage("a4", "portrait");
  assert.equal(a4.id, "a4");
  assert.equal(a4.widthCm, 21);
  assert.equal(a4.heightCm, 29.7);
  assert.equal(a4.widthPx, 2480);
  assert.equal(a4.heightPx, 3508);
  assert.equal(coloringPage("a4", "landscape").widthPx, 3508);
  assert.equal(coloringPage("nonsense").id, "letter", "a bad sheet still prints on a real page");
});

test("fitBox contains a photo inside the art box and centres it", () => {
  const wide = fitBox(4000, 3000, 2000, 2000);
  assert.deepEqual(wide, { width: 2000, height: 1500, scale: 0.5, x: 0, y: 250 });
  const tall = fitBox(1000, 4000, 2000, 2000);
  assert.deepEqual(tall, { width: 500, height: 2000, scale: 0.5, x: 750, y: 0 });
  assert.throws(() => fitBox(0, 100, 100, 100));
  assert.throws(() => fitBox(100, 100, 0, 100));
});

test("grayscalePlane weights the channels and lays transparency over white", () => {
  const plane = grayscalePlane(Uint8ClampedArray.from([0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 128]), 4, 1);
  assert.deepEqual([...plane], [0, 255, 255, 127]);
  assert.throws(() => grayscalePlane(Uint8ClampedArray.from([0, 0, 0, 255]), 2, 2));
});

test("boxBlurPlane smooths a plane and clamps the border", () => {
  assert.deepEqual([...boxBlurPlane(Uint8Array.from([0, 0, 255]), 3, 1, 1)], [0, 85, 170]);
  const flat = Uint8Array.from(Array(9).fill(90));
  assert.deepEqual([...boxBlurPlane(flat, 3, 3, 1)], [...flat], "a flat plane survives a blur");
  assert.deepEqual([...boxBlurPlane(Uint8Array.from([1, 2, 3]), 3, 1, 0)], [1, 2, 3]);
});

test("posterizeThresholds and posterizePlane split tones into colouring bands", () => {
  const paper = new Uint8Array(100);
  paper.fill(0, 0, 50);
  paper.fill(255, 50, 100);
  assert.deepEqual(posterizeThresholds(paper, 2), [1]);
  assert.deepEqual(posterizeThresholds(paper, 3), [1, 255]);
  const bands = posterizePlane(paper, 10, 10, 2);
  assert.equal(bands[0], 0);
  assert.equal(bands[50], 1);
  assert.ok([...bands].every((label) => label === 0 || label === 1));
});

test("boundaryMask inks only the seam between two tone bands", () => {
  assert.deepEqual([...boundaryMask(Uint8Array.from([0, 0, 0, 1]), 2, 2)], [0, 1, 1, 1]);
  const solid = Uint8Array.from(Array(9).fill(2));
  assert.deepEqual([...boundaryMask(solid, 3, 3)], [...new Uint8Array(9)], "a flat band has no seam and stays blank");
  assert.throws(() => boundaryMask(Uint8Array.from([0, 1]), 2, 2));
});

test("differenceOfGaussians flattens tone and reacts to an edge", () => {
  const flat = differenceOfGaussians(Uint8Array.from(Array(25).fill(128)), 5, 5);
  assert.ok([...flat].every((value) => Math.abs(value - 1.92) < 0.01), "a flat plane reads as a constant, near-zero response");
  const edge = new Uint8Array(25);
  for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) edge[y * 5 + x] = x < 2 ? 0 : 255;
  const response = differenceOfGaussians(edge, 5, 5);
  assert.ok(Math.max(...[...response].map(Math.abs)) > 5, "a tonal edge survives as pencil line");
});

test("quantileThreshold, maskAbove, dilate and despeckle build a printable line mask", () => {
  assert.equal(quantileThreshold([0, 1, 2, 3], 0.5), 1);
  assert.equal(quantileThreshold([], 0.5), 0);
  assert.equal(quantileThreshold([5, 5, 5], 0.5), 5, "a flat response has no threshold to find");
  assert.deepEqual([...maskAbove(Uint8Array.from([0, 100, 200]), 3, 1, 100)], [0, 1, 1]);
  assert.deepEqual([...dilateMask(Uint8Array.from([0, 1, 0]), 3, 1, 1)], [1, 1, 1], "dilation grows a hairline into a stroke");
  assert.deepEqual([...dilateMask(Uint8Array.from([0, 1, 0]), 3, 1, 0)], [0, 1, 0]);
  const dot = new Uint8Array(9);
  dot[4] = 1;
  assert.deepEqual([...despeckleMask(dot, 3, 3, 2)], [...new Uint8Array(9)], "a lone speck is dropped");
  const hole = Uint8Array.from(Array(9).fill(1));
  hole[4] = 0;
  assert.deepEqual([...despeckleMask(hole, 3, 3, 2)], [...new Uint8Array(9).fill(1)], "a pinhole is filled");
});

test("invertMask, maskInkRatio and line weight describe the printed line", () => {
  assert.deepEqual([...invertMask(Uint8Array.from([0, 1, 1, 0]))], [1, 0, 0, 1]);
  assert.equal(maskInkRatio(Uint8Array.from([1, 0, 1, 0])), 0.5);
  assert.equal(maskInkRatio(new Uint8Array(0)), 0);
  assert.equal(lineWeightPx(0.5), 6);
  assert.equal(lineWeightPx(0.9), 11);
  assert.equal(lineWeightPx(1.4), 17);
  assert.equal(lineWeightPx(0), 1, "a line never disappears entirely");
  assert.equal(lineWeightPx("nonsense"), 1);
  assert.equal(lineRadiusPx(0.5), 3);
  assert.equal(lineRadiusPx(0.9), 5);
  assert.equal(lineRadiusPx(1.4), 8);
  assert.equal(lineRadiusPx(0), 0);
  assert.equal(lineWeightPx(25.4, 150), 150, "the export DPI scales the printed line");
});

test("the gift tag profile carries the three printed sizes with matching labels", () => {
  const profile = getProductProfile("gift-tag");
  assert.equal(profile.name, "Gift Tag Maker");
  assert.equal(profile.product, "Printable gift tag");
  assert.equal(profile.exportSvg, false);
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.hasBase, false);
  assert.equal(profile.sizes.length, 3);
  assert.deepEqual(profile.sizeLabels, [
    "2 x 3 in tag (5.1 x 7.6 cm)",
    "2.5 x 3.5 in tag (6.4 x 8.9 cm)",
    "3 x 4 in tag (7.6 x 10.2 cm)",
  ]);
});

test("gift tag sizes, shapes and card colours resolve with safe fallbacks", () => {
  assert.equal(GIFT_TAG_SIZES.length, 3);
  assert.equal(giftTagSize(5.08).id, "2x3");
  assert.equal(giftTagSize("6.35").id, "2-5x3-5");
  assert.equal(giftTagSize(7.62).id, "3x4");
  assert.equal(giftTagSize("999").id, "2x3", "an unknown size should fall back to the smallest tag");
  assert.equal(giftTagSize(undefined).id, "2x3");
  assert.deepEqual([...GIFT_TAG_SHAPES], ["tag", "rounded", "scallop", "square"]);
  assert.equal(giftTagShape("SCALLOP"), "scallop");
  assert.equal(giftTagShape("square"), "square");
  assert.equal(giftTagShape("zzz"), "tag", "an unknown silhouette falls back to the classic tag");
  assert.equal(giftTagShape(undefined), "tag");
  assert.equal(GIFT_TAG_PAPERS.length, 6);
  assert.equal(giftTagPaperHex("#ABC"), "#aabbcc");
  assert.equal(giftTagPaperHex("kraft"), "#c9a978");
  assert.equal(giftTagPaperHex("no-such-paper"), "#ffffff");
  assert.equal(giftTagPaperHex(undefined), "#ffffff");
});

test("gift tag sheet grids tile a batch of tags with a printable margin", () => {
  assert.equal(GIFT_TAG_SHEETS.length, 2);
  assert.equal(giftTagSheet("letter").widthCm, 21.59);
  assert.equal(giftTagSheet("A4").id, "a4");
  assert.equal(giftTagSheet("single"), null, "a single tag is not a sheet");
  assert.equal(giftTagSheet(undefined), null);
  assert.equal(giftTagSheet("nonsense"), null);
  const small = giftTagGrid("letter", 5.08);
  assert.equal(small.cols, 3);
  assert.equal(small.rows, 3);
  assert.equal(small.perSheet, 9);
  assert.equal(giftTagGrid("a4", 5.08).perSheet, 9, "both papers take the same small tags");
  assert.equal(giftTagGrid("letter", 6.35).perSheet, 6);
  assert.equal(giftTagGrid("a4", 6.35).perSheet, 6);
  assert.equal(giftTagGrid("letter", 7.62).perSheet, 4);
  assert.equal(giftTagGrid("a4", 7.62).perSheet, 4);
  assert.equal(giftTagGrid("letter", 5.08).gutterCm, 0.25, "tags leave a gutter so a trimmer can pass between them");
  assert.equal(giftTagGrid("letter", 5.08).marginCm, 0.8, "the grid stays clear of the unprintable border");
});

test("gift tag punch holes stay on the card and clear of the message", () => {
  const small = giftTagHole(5.08, 7.62);
  assert.equal(small.cx, 2.54, "the hole is centred across the tag");
  assert.equal(small.r, 3, "the punch never shrinks below a real hole punch");
  assert.ok(small.cy > small.r, "the hole never breaks the top edge");
  assert.ok(small.cy + small.r < 7.62, "the hole never falls off the bottom of the tag");
  const big = giftTagHole(7.62, 10.16);
  assert.equal(big.cx, 3.81);
  assert.ok(big.cy > small.cy, "a wider tag seats the hole a little lower");
  assert.ok(big.cy + big.r < 10.16);
  assert.throws(() => giftTagHole(0, 7.62), /positive/);
  assert.throws(() => giftTagHole(5.08, -1), /positive/);
});

test("the name tracing profile carries both papers and no photo controls", () => {
  const profile = getProductProfile("name-tracing");
  assert.equal(profile.name, "Name Tracing Worksheet Maker");
  assert.equal(profile.product, "Name tracing worksheet");
  assert.equal(profile.exportSvg, false);
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.hasBase, false);
  assert.equal(profile.sizes.length, 2);
  assert.deepEqual([...profile.sizeLabels], [
    "US Letter (8.5 x 11 in)",
    "A4 (21 x 29.7 cm)",
  ]);
});

test("name tracing papers, styles, rules, cases and inks resolve with safe fallbacks", () => {
  assert.equal(NAME_TRACING_PAPERS.length, 2);
  assert.equal(NAME_TRACING_MARGIN_CM, 1.27);
  assert.equal(NAME_TRACING_ROW_MIN, 2);
  assert.equal(NAME_TRACING_ROW_MAX, 10);
  assert.equal(NAME_TRACING_BLANK_MAX, 6);
  assert.equal(NAME_TRACING_LIMIT, 40);
  assert.equal(nameTracingPaper(21).id, "a4");
  assert.equal(nameTracingPaper(21.59).id, "letter");
  assert.equal(nameTracingPaper("999").id, "letter", "an unknown paper falls back to US Letter");
  assert.equal(nameTracingPaper(undefined).id, "letter");

  assert.equal(NAME_TRACING_STYLES.length, 5);
  assert.equal(nameTracingStyle("DASHED").id, "dashed");
  assert.equal(nameTracingStyle("solid").id, "solid");
  assert.equal(nameTracingStyle("nope").id, "dotted", "an unknown style falls back to the dotted outline");
  assert.equal(nameTracingStyle(undefined).id, "dotted");

  assert.equal(NAME_TRACING_RULES.length, 4);
  assert.equal(nameTracingRule("grey-ruled").id, "grey-ruled");
  assert.equal(nameTracingRule("none").id, "none");
  assert.equal(nameTracingRule("nope").id, "blue-red-blue", "the blue red blue school paper is the default");
  assert.equal(nameTracingRule(undefined).id, "blue-red-blue");

  assert.equal(NAME_TRACING_CASES.length, 4);
  assert.equal(nameTracingCase("UPPER").id, "upper");
  assert.equal(nameTracingCase("nope").id, "as-typed", "a name prints as typed unless asked otherwise");
  assert.equal(nameTracingCase(undefined).id, "as-typed");

  assert.equal(NAME_TRACING_INKS.length, 5);
  assert.equal(nameTracingInkHex("#ABC"), "#aabbcc");
  assert.equal(nameTracingInkHex("blue"), "#2f6fd0");
  assert.equal(nameTracingInkHex("no-such-ink"), "#4a5250", "an unknown ink falls back to graphite");
  assert.equal(nameTracingInkHex(undefined), "#4a5250");
});

test("name tracing text keeps a family name intact unless a case is chosen", () => {
  assert.equal(nameTracingText("  Amelia   Rose  ", "as-typed"), "Amelia Rose");
  assert.equal(nameTracingText("Amelia", "upper"), "AMELIA");
  assert.equal(nameTracingText("Amelia", "lower"), "amelia");
  assert.equal(nameTracingText("amelia", "title"), "Amelia");
  assert.equal(nameTracingText("amelia"), "amelia", "as-typed is the default");
  assert.equal(nameTracingText("van der berg", "title"), "Van Der Berg");
  assert.equal(nameTracingText("o'neil", "title"), "O'Neil");
  assert.equal(nameTracingText("", "title"), "");
  assert.equal(nameTracingText(undefined, "upper"), "");
});

test("name tracing splits a class list into one name per sheet", () => {
  assert.deepEqual(nameTracingNames("Amelia\n\n Noah \nSophie"), ["Amelia", "Noah", "Sophie"]);
  assert.deepEqual(nameTracingNames(""), []);
  assert.deepEqual(nameTracingNames("   \n  \n"), []);
  assert.deepEqual(nameTracingNames("a\nb\nc", 2), ["a", "b"], "the batch cap is honoured");
  assert.deepEqual(nameTracingNames("a\nb\nc", 0), ["a", "b", "c"], "a zero cap falls back to the full limit");
  assert.equal(nameTracingNames("x".repeat(30))[0].length, 24, "a single name is capped so it still fits a row");
  assert.equal(nameTracingNames("a\nb\nc".repeat(40)).length, 40, "a whole class list still fits the batch limit");
});

test("name tracing rows count how many copies of a name fit the line", () => {
  const three = nameTracingSlots(100, 30, 8);
  assert.equal(three.count, 3);
  assert.ok(Math.abs(three.slotW - 100 / 3) < 1e-9);
  assert.equal(nameTracingSlots(100, 1000).count, 1, "at least one copy always lands on the line");
  assert.equal(nameTracingSlots(100, 10, 3).count, 3, "the visible ceiling is respected");
  assert.equal(nameTracingSlots(100, 10).count, 8, "the default ceiling is respected");
  assert.throws(() => nameTracingSlots(0, 30), /positive/);
  assert.throws(() => nameTracingSlots(100, 0), /positive/);
});

test("name tracing sheets lay the ruled block out inside the printable border", () => {
  const letter = nameTracingSheet({ paper: "letter", rows: 5, blankRows: 1, guide: true });
  assert.equal(letter.paper.id, "letter");
  assert.equal(letter.practiceRows, 5);
  assert.equal(letter.blankRows, 1);
  assert.equal(letter.totalRows, 7, "five practice rows, a blank row and the guide row");
  assert.ok(Math.abs(letter.usableW - 19.05) < 1e-9, "US Letter keeps a 1.27 cm border each side");
  assert.ok(Math.abs(letter.bandCm - 3.4) < 1e-9);
  assert.ok(Math.abs(letter.lineCm - 2.584) < 1e-9);
  assert.ok(Math.abs(letter.midCm - 1.292) < 1e-9);

  const a4 = nameTracingSheet({ paper: 21 });
  assert.equal(a4.paper.id, "a4");
  assert.ok(Math.abs(a4.usableW - 18.46) < 1e-9);

  const clamped = nameTracingSheet({ rows: 100, blankRows: 99 });
  assert.equal(clamped.practiceRows, NAME_TRACING_ROW_MAX);
  assert.equal(clamped.blankRows, NAME_TRACING_BLANK_MAX);
  const floored = nameTracingSheet({ rows: 0, blankRows: 0 });
  assert.equal(floored.practiceRows, NAME_TRACING_ROW_MIN);
  assert.equal(floored.blankRows, 0);

  const bare = nameTracingSheet({ guide: false, header: false });
  assert.equal(bare.guideRows, 0, "the guide row is optional");
  assert.equal(bare.headerCm, 0, "the title row is optional");
  assert.equal(bare.totalRows, 6, "five practice rows and one blank row by default, with no extras");

  const fallback = nameTracingSheet();
  assert.equal(fallback.paper.id, "letter", "no paper choice prints US Letter");
  assert.equal(fallback.practiceRows, 5);
  assert.equal(fallback.blankRows, 1);
  assert.equal(fallback.headerRows, 1);
});

test("the word search tool is profile 25 and keeps both paper sizes", () => {
  const profile = getProductProfile("word-search");
  assert.equal(profile.name, "Word Search Maker");
  assert.equal(profile.product, "Printable word search puzzle");
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.exportSvg, false, "the puzzle is a print, so it ships no cut path");
  assert.deepEqual(profile.sizes, [21.59, 21]);
  assert.equal(wordSearchPaper(21).id, "a4");
  assert.equal(wordSearchPaper(21.59).id, "letter");
  assert.equal(wordSearchPaper("letter").id, "letter");
  assert.equal(wordSearchPaper("999").id, "letter", "an unknown paper falls back to US Letter");
  assert.equal(wordSearchPaper(undefined).id, "letter");
});

test("word search lookups fall back instead of throwing", () => {
  assert.equal(wordSearchGrid("auto").cells, 0, "auto asks the engine to size the grid");
  assert.equal(wordSearchGrid("15").cells, 15);
  assert.equal(wordSearchGrid("nope").id, "auto", "an unknown grid falls back to auto");
  assert.equal(wordSearchGrid(undefined).id, "auto");

  assert.equal(wordSearchLevel("easy").dirs.length, 2, "easy is across and down only");
  assert.equal(wordSearchLevel("medium").dirs.length, 3);
  assert.equal(wordSearchLevel("hard").dirs.length, 8);
  assert.equal(wordSearchLevel("HARD").id, "hard");
  assert.equal(wordSearchLevel("nope").id, "easy", "an unknown level falls back to the beginner set");

  assert.equal(wordSearchCase("UPPER").id, "upper");
  assert.equal(wordSearchCase("lower").id, "lower");
  assert.equal(wordSearchCase("nope").id, "upper", "uppercase is the classroom default");
  assert.equal(wordSearchCase(undefined).id, "upper");

  assert.equal(wordSearchWord("tiger", "lower"), "tiger");
  assert.equal(wordSearchWord("tiger", "upper"), "TIGER");
  assert.equal(wordSearchWord("tiger"), "TIGER", "uppercase is the default");
  assert.equal(wordSearchWord(undefined), "");

  assert.equal(WORD_SEARCH_THEMES.length, 12);
  for (const theme of WORD_SEARCH_THEMES) {
    assert.equal(theme.words.length, 12, theme.id + " should carry twelve ready-made words");
    for (const word of theme.words) {
      assert.match(word, /^[A-Z]{2,20}$/, theme.id + " word " + word + " should be plain uppercase letters");
    }
  }
  assert.equal(wordSearchTheme("ANIMALS").id, "animals");
  assert.equal(wordSearchTheme("nope"), null, "an unknown theme is simply no theme");
  assert.equal(wordSearchTheme(undefined), null);
});

test("the word list is cleaned into something a grid can hold", () => {
  assert.deepEqual(wordSearchList("apple\nBanana, cherry\napple\nTOO-LONG-WORD!!"), ["APPLE", "BANANA", "CHERRY", "TOOLONGWORD"]);
  assert.deepEqual(wordSearchList("a, bb, c, dddd"), ["BB", "DDDD"], "one letter words are dropped");
  assert.deepEqual(wordSearchList("cat; dog\ncat"), ["CAT", "DOG"], "duplicates fold away");
  assert.deepEqual(wordSearchList(""), []);
  assert.deepEqual(wordSearchList(undefined), []);
  assert.equal(wordSearchList("x".repeat(40))[0].length, 20, "a long word is capped so the square survives");
  const uniqueWords = Array.from({ length: 40 }, (value, index) => String.fromCharCode(97 + (index % 26)) + String.fromCharCode(97 + Math.floor(index / 26)) + "zz");
  assert.equal(wordSearchList(uniqueWords.join("\n")).length, WORD_SEARCH_LIMIT, "the list is trimmed to the printable limit");
  assert.equal(wordSearchList("cat\ndog", 1).length, 1, "a smaller cap is honoured");
});

test("the grid sizes itself to the word list", () => {
  assert.equal(wordSearchAutoCells([]), 10, "an empty list still gets a usable square");
  assert.equal(wordSearchAutoCells(["CAT"]), 10);
  assert.ok(wordSearchAutoCells(["ELEPHANT"]) >= 10);
  assert.ok(wordSearchAutoCells(["A".repeat(20)]) >= 20, "the longest word still has to fit");
  assert.ok(wordSearchAutoCells(Array.from({ length: 24 }, (value, index) => "word" + index)) <= 20);
  assert.equal(wordSearchAutoCells(undefined), 10);
});

test("every word the builder places can be read back out of the grid", () => {
  const words = WORD_SEARCH_THEMES.find((theme) => theme.id === "animals").words;
  for (let seed = 1; seed <= 40; seed += 1) {
    for (const level of ["easy", "medium", "hard"]) {
      const build = wordSearchBuild(words, { cells: 15, level, seed });
      assert.equal(build.cells, 15);
      assert.equal(build.grid.length, 15);
      assert.equal(build.level.id, level);
      for (const placement of build.placements) {
        const path = wordSearchPath(placement);
        assert.equal(path.length, placement.word.length);
        const read = path.map(([row, col]) => build.grid[row][col]).join("");
        assert.equal(read, placement.word, "seed " + seed + " " + level + " lost " + placement.word);
      }
      assert.equal(build.placed + build.dropped.length, words.length, "every word is either placed or reported");
      assert.ok(build.placed >= words.length - 1, "a 15 x 15 grid seats a twelve word list");
    }
  }
});

test("the same seed always rebuilds the same puzzle, and a new seed moves the words", () => {
  const words = ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "RABBIT", "TIGER"];
  const a = wordSearchBuild(words, { cells: 12, level: "easy", seed: 7 });
  const b = wordSearchBuild(words, { cells: 12, level: "easy", seed: 7 });
  const c = wordSearchBuild(words, { cells: 12, level: "easy", seed: 8 });
  assert.deepEqual(a.grid, b.grid, "the same seed has to rebuild the same grid");
  assert.notDeepEqual(a.grid, c.grid, "shuffling has to actually move the letters");
  assert.equal(a.placed, words.length, "a 12 x 12 grid seats six animal words");
  assert.deepEqual(a.dropped, []);
});

test("words that cannot fit are reported instead of silently vanishing", () => {
  const words = ["ELEPHANT", "HIPPOPOTAMUS", "BUTTERFLY", "CROCODILE"];
  const build = wordSearchBuild(words, { cells: 6, level: "hard", seed: 3 });
  assert.equal(build.cells, 6);
  assert.ok(build.dropped.includes("HIPPOPOTAMUS"), "a six cell square cannot hide an eleven letter word");
  assert.equal(build.placed + build.dropped.length, words.length);
  assert.deepEqual(wordSearchBuild([], { cells: 10, seed: 1 }).placements, []);
  assert.equal(wordSearchBuild(["CAT"], { cells: 10, seed: 1 }).placements.length, 1);
  assert.equal(wordSearchBuild(["CAT"], { cells: 1, seed: 1 }).cells, 6, "a grid is never smaller than six cells");
  assert.equal(wordSearchBuild(["CAT"], { cells: 99, seed: 1 }).cells, 24, "a grid is never larger than twenty-four cells");
});

test("word search paths walk a placement in the direction it was seated", () => {
  assert.deepEqual(wordSearchPath({ row: 1, col: 2, dx: 0, dy: 1, length: 3 }), [[1, 2], [2, 2], [3, 2]]);
  assert.deepEqual(wordSearchPath({ row: 4, col: 4, dx: -1, dy: -1, length: 2 }), [[4, 4], [3, 3]]);
  assert.deepEqual(wordSearchPath({ row: 0, col: 0, dx: 1, dy: 0, length: 1 }), [[0, 0]]);
  assert.deepEqual(wordSearchPath(null), []);
  assert.deepEqual(wordSearchPath(undefined), []);
});

test("the puzzle sheet keeps the grid inside the printable border", () => {
  const letter = wordSearchSheet({ paper: "letter", cells: 12 });
  assert.equal(letter.paper.id, "letter");
  assert.equal(letter.cells, 12);
  assert.ok(Math.abs(letter.usableW - 19.05) < 1e-9, "US Letter keeps a 1.27 cm border each side");
  assert.ok(Math.abs(letter.gridCm - 19.05) < 1e-9, "the grid is the square the sheet allows");
  assert.ok(Math.abs(letter.cellCm - 1.5875) < 1e-9);
  assert.ok(Math.abs(letter.gridX - 1.27) < 1e-9, "the grid is centred across the paper");
  assert.ok(Math.abs(letter.gridY - 2.87) < 1e-9, "the title band sits above the grid");
  assert.ok(letter.gridY + letter.gridCm + letter.listCm <= letter.paper.heightCm - letter.marginCm + 1e-9, "the list stays above the bottom border");

  const a4 = wordSearchSheet({ paper: 21, cells: 18 });
  assert.equal(a4.paper.id, "a4");
  assert.equal(a4.cells, 18);
  assert.ok(Math.abs(a4.gridCm - 18.46) < 1e-9, "A4 is narrower, so the width decides the square");

  const huge = wordSearchSheet({ paper: "letter", cells: 99 });
  assert.equal(huge.cells, 24, "the cell count is clamped to the printable ceiling");
  const tiny = wordSearchSheet({ cells: 1 });
  assert.equal(tiny.cells, 6, "the cell count is clamped to a usable floor");
  assert.equal(wordSearchSheet().paper.id, "letter", "no paper choice prints US Letter");
  assert.equal(wordSearchSheet({ title: false }).titleCm, 0, "the title band is optional");
  assert.equal(wordSearchSheet({ list: false }).listCm, 0, "the word list band is optional");
});

test("a short word list stays in one column and a long one folds", () => {
  assert.equal(wordSearchListColumns(["A", "B", "C"]), 1);
  assert.equal(wordSearchListColumns(Array.from({ length: 8 }, (value, index) => "w" + index)), 1);
  assert.equal(wordSearchListColumns(Array.from({ length: 9 }, (value, index) => "w" + index)), 2);
  assert.equal(wordSearchListColumns(Array.from({ length: 16 }, (value, index) => "w" + index)), 2);
  assert.equal(wordSearchListColumns(Array.from({ length: 17 }, (value, index) => "w" + index)), 3);
  assert.equal(wordSearchListColumns(Array.from({ length: 24 }, (value, index) => "w" + index)), 3);
  assert.equal(wordSearchListColumns([], 4), 1, "an empty list still needs a column");
  assert.equal(wordSearchListColumns(Array.from({ length: 24 }, (value, index) => "w" + index), 1), 1, "the column ceiling is honoured");
});


test("the bingo maker exposes its papers, grids, layouts, modes and themes", () => {
  assert.equal(bingoPaper("a4").id, "a4");
  assert.equal(bingoPaper(21.59).id, "letter", "the paper is matched by its width too");
  assert.equal(bingoPaper("nonsense").id, "letter", "an unknown paper falls back to US Letter");
  assert.equal(bingoGrid("4").cells, 4);
  assert.equal(bingoGrid("nonsense").cells, 5, "the classic card is the default grid");
  assert.equal(bingoLayout("4").cols, 2);
  assert.equal(bingoLayout("4").rows, 2);
  assert.equal(bingoLayout("nonsense").id, "1", "one card a sheet is the safe default");
  assert.equal(bingoMode("words").id, "words");
  assert.equal(bingoMode("").id, "numbers");
  assert.equal(bingoCase("lower").id, "lower");
  assert.equal(bingoCase("").id, "upper");
  assert.equal(bingoTheme("animals").label, "Animals");
  assert.equal(bingoTheme("nope"), null, "an unknown theme is not a theme");
  assert.equal(bingoEntry("cat", "lower"), "cat");
  assert.equal(bingoEntry("cat", "upper"), "CAT");
  assert.equal(bingoEntry("42", "lower"), "42", "a drawn number is never re-cased");
  assert.equal(bingoEntry("FREE", "lower"), "FREE");

  assert.ok(BINGO_THEMES.length >= 10, "the card maker ships a full shelf of themes");
  for (const theme of BINGO_THEMES) {
    assert.ok(theme.words.length >= 25, theme.id + " needs enough words to fill a 5 x 5 card");
    assert.equal(new Set(theme.words).size, theme.words.length, theme.id + " repeats a word");
    for (const word of theme.words) assert.equal(word, word.toUpperCase(), theme.id + " mixes letter case");
  }
});

test("a bingo word list is cleaned, folded, trimmed and capped", () => {
  assert.deepEqual(bingoWords("cat\nDog, cat; bird"), ["CAT", "DOG", "BIRD"]);
  assert.deepEqual(bingoWords("   "), []);
  assert.deepEqual(bingoWords("elephant!!"), ["ELEPHANT"], "punctuation is dropped");
  assert.equal(bingoWords("a-b c")[0], "ABC", "a stray hyphen is folded into one entry");
  assert.equal(bingoWords("supercalifragilisticexpialidocious")[0].length, BINGO_WORD_MAX, "a long entry is trimmed so the grid stays readable");
  assert.equal(bingoWords(Array.from({ length: 60 }, (value, index) => "w" + index).join("\n")).length, BINGO_WORD_LIMIT);
  assert.equal(bingoWords("a\nb", 1).length, 1, "the caller can ask for a shorter cap");
});

test("a card knows how many entries it needs and where the free square sits", () => {
  assert.equal(bingoNeeded(5, false), 25);
  assert.equal(bingoNeeded(5, true), 24);
  assert.equal(bingoNeeded(4, true), 16, "an even card never gives a square away");
  assert.equal(bingoNeeded(3, true), 8);
  assert.deepEqual(bingoFreeCell(5, true), { row: 2, col: 2 });
  assert.deepEqual(bingoFreeCell(3, true), { row: 1, col: 1 });
  assert.equal(bingoFreeCell(4, true), null);
  assert.equal(bingoFreeCell(5, false), null);
  assert.equal(bingoCardCount(0), 1, "a set always holds at least one card");
  assert.equal(bingoCardCount("nonsense"), 1);
});

test("a classic number card draws every column from its own B I N G O range", () => {
  const grid = bingoNumberGrid(5, 7, true);
  assert.equal(grid.length, 5);
  for (const row of grid) assert.equal(row.length, 5);
  for (let col = 0; col < BINGO_COLUMNS.length; col += 1) {
    const low = col * 15 + 1;
    const high = low + 14;
    const drawn = [];
    for (let row = 0; row < 5; row += 1) {
      if (row === 2 && col === 2) continue;
      const value = Number(grid[row][col]);
      assert.ok(value >= low && value <= high, BINGO_COLUMNS[col] + " holds " + value + ", outside " + low + " to " + high);
      drawn.push(value);
    }
    assert.deepEqual(drawn, drawn.slice().sort((a, b) => a - b), "a column reads upwards like a printed card");
    assert.equal(new Set(drawn).size, drawn.length, "a column never repeats a number");
  }
  assert.equal(grid[2][2], "FREE");
  assert.equal(bingoNumberGrid(5, 7, false)[2][2] !== "FREE", true, "the free square can be switched off");
  const whole = bingoNumberGrid(5, 7, true).flat().filter((entry) => entry !== "FREE");
  assert.equal(new Set(whole).size, 24, "no number appears twice on one card");

  const small = bingoNumberGrid(3, 7, true);
  assert.equal(small.length, 3);
  assert.equal(small[1][1], "FREE");
  for (const entry of small.flat().filter((value) => value !== "FREE")) {
    const value = Number(entry);
    assert.ok(value >= 1 && value <= BINGO_NUMBER_CEILING, "a small card still draws from the 1 to 75 pool");
  }
});

test("a bingo set builds one unique deterministic card per player", () => {
  const set = bingoCardSet({ cells: 5, mode: "numbers", count: 24, free: true, seed: 42 });
  assert.equal(set.length, 24);
  const signatures = set.map((card) => card.map((row) => row.join(",")).join("/"));
  assert.equal(new Set(signatures).size, 24, "no two players should hold the same card");
  assert.deepEqual(bingoCardSet({ cells: 5, mode: "numbers", count: 24, free: true, seed: 42 }), set, "the same seed rebuilds the same set");
  assert.notDeepEqual(bingoCardSet({ cells: 5, mode: "numbers", count: 24, free: true, seed: 43 }), set, "a new seed shuffles the set");
  assert.equal(bingoCardSet({ cells: 5, mode: "numbers", count: 99, free: true, seed: 1 }).length, BINGO_MAX_CARDS, "a set stops at a class of thirty");

  const wordSet = bingoCardSet({ cells: 3, mode: "words", count: 6, free: true, words: BINGO_THEMES[0].words, seed: 3 });
  assert.equal(wordSet.length, 6);
  for (const card of wordSet) {
    assert.equal(card.flat().filter((entry) => entry === "FREE").length, 1, "a card carries one free square");
  }
});

test("the bingo sheet keeps every card inside the printable border", () => {
  for (const layout of ["1", "2", "4"]) {
    for (const paper of ["letter", "a4"]) {
      const sheet = bingoSheet({ paper, layout });
      assert.equal(sheet.paper.id, paper);
      for (const card of sheet.cards) {
        assert.ok(card.x >= sheet.marginCm - 1e-9, "a card starts inside the left border");
        assert.ok(card.y >= sheet.marginCm - 1e-9, "a card starts inside the top border");
        assert.ok(card.x + card.w <= sheet.paper.widthCm - sheet.marginCm + 1e-9, "a card stays inside the right border");
        assert.ok(card.y + card.h <= sheet.paper.heightCm - sheet.marginCm + 1e-9, "a card stays inside the bottom border");
        assert.ok(Math.abs(card.w / card.h - BINGO_CARD_ASPECT) < 1e-9, "every card keeps the printed proportion");
      }
    }
  }
  assert.equal(bingoSheet({ layout: "4" }).cards.length, 4, "a four up sheet really holds four cards");
  assert.equal(bingoSheet({ layout: "2" }).cards.length, 2);
  assert.equal(bingoSheet({ layout: "nonsense" }).cards.length, 1, "an unknown layout falls back to one card");
  assert.equal(bingoSheet().paper.id, "letter", "no paper choice prints US Letter");
});

test("the print run knows its page count and the caller gets a full list", () => {
  assert.equal(bingoPageCount({ layout: "1", count: 6 }), 6);
  assert.equal(bingoPageCount({ layout: "4", count: 6 }), 2);
  assert.equal(bingoPageCount({ layout: "4", count: 8 }), 2);
  assert.equal(bingoPageCount({ layout: "2", count: 8 }), 4);
  assert.equal(bingoPageCount({ layout: "4", count: 8, callList: true }), 3, "the caller sheet is a page of its own");

  const calls = bingoCallList({ mode: "numbers", seed: 11 });
  assert.equal(calls.length, BINGO_NUMBER_CEILING);
  assert.equal(new Set(calls).size, BINGO_NUMBER_CEILING, "a caller never reads the same number twice");
  assert.deepEqual(calls.slice().sort((a, b) => a - b), Array.from({ length: BINGO_NUMBER_CEILING }, (value, index) => index + 1));
  assert.deepEqual(bingoCallList({ mode: "words", words: ["CAT", "DOG"] }), ["CAT", "DOG"]);
  assert.deepEqual(bingoCallList({ mode: "words" }), []);

  assert.equal(bingoCallColumns(24), 3);
  assert.equal(bingoCallColumns(36), 4);
  assert.equal(bingoCallColumns(BINGO_NUMBER_CEILING), 6);
  assert.equal(bingoCallColumns(0), 3);
});

test("the shared shuffle stream is reproducible and a word card uses the whole list", () => {
  const first = seededRandom(21);
  const again = seededRandom(21);
  const run = [first(), first(), first()];
  assert.deepEqual(run, [again(), again(), again()], "the same seed replays the same shuffle");
  for (const value of run) assert.ok(value >= 0 && value < 1, "the stream stays inside the unit interval");

  const words = BINGO_THEMES.find((theme) => theme.id === "animals").words;
  const grid = bingoWordGrid(words, 3, 5, true);
  assert.equal(grid.length, 3);
  assert.equal(grid[1][1], "FREE");
  const filled = grid.flat().filter((entry) => entry !== "FREE" && entry);
  assert.equal(filled.length, 8, "the free square leaves eight squares to fill");
  assert.equal(new Set(filled).size, 8, "a card never repeats an entry");
  for (const entry of filled) assert.ok(words.includes(entry), "the entry comes from the caller's list");
  assert.deepEqual(bingoWordGrid(words, 3, 5, true), grid, "the same seed rebuilds the same board");

  const short = bingoWordGrid(["CAT"], 3, 5, true);
  assert.equal(short.flat().filter((entry) => entry === "").length, 7, "a short list leaves the rest of the card empty");
});

test("the chore chart maker exposes its papers, weeks, styles and colour kits", () => {
  assert.equal(chartPaper("a4").id, "a4");
  assert.equal(chartPaper(21.59).id, "letter", "the paper is matched by its width too");
  assert.equal(chartPaper("nonsense").id, "letter", "an unknown paper falls back to US Letter");
  assert.equal(CHART_PAPERS.length, 2);
  assert.equal(chartDays("school").names.length, 5);
  assert.equal(chartDays("school-sat").names.length, 6);
  assert.equal(chartDays("week").names.length, 7);
  assert.equal(chartDays("nonsense").id, "week", "the full week is the safe default");
  assert.equal(chartStyle("star").id, "star");
  assert.equal(chartStyle("plain").id, "plain");
  assert.equal(chartStyle("nonsense").id, "tick", "tick boxes are the default style");
  assert.equal(chartTheme("ocean").label, "Ocean");
  assert.equal(chartTheme("nonsense").id, CHART_THEMES[0].id, "an unknown colour kit falls back to the first");
  assert.ok(CHART_THEMES.length >= 8, "the chart maker ships a full shelf of colour kits");
  assert.equal(new Set(CHART_THEMES.map((theme) => theme.id)).size, CHART_THEMES.length, "two colour kits share an id");
  for (const theme of CHART_THEMES) {
    for (const key of ["head", "accent", "band", "row"]) {
      assert.match(theme[key], /^#[0-9a-f]{6}$/i, theme.id + " has a malformed " + key + " colour");
    }
  }
  for (const days of CHART_DAYS) {
    assert.ok(days.names.length >= 5 && days.names.length <= 7, days.id + " has an odd number of day columns");
    assert.equal(new Set(days.names).size, days.names.length, days.id + " repeats a day");
  }
});

test("a chore list is tidied, deduplicated and capped at one row per job", () => {
  assert.deepEqual(chartChores("Make my bed\nBrush my teeth; Tidy my room, Feed the pet"), ["Make my bed", "Brush my teeth", "Tidy my room", "Feed the pet"]);
  assert.deepEqual(chartChores("Make   my    bed"), ["Make my bed"], "inner whitespace is collapsed");
  assert.deepEqual(chartChores("   "), []);
  assert.deepEqual(chartChores("Tidy my room\nTidy my room"), ["Tidy my room"], "the same job is only listed once");
  assert.equal(chartChores("w".repeat(80))[0].length, CHART_CHORE_MAX, "a very long job is trimmed so the row stays readable");
  assert.equal(chartChores(Array.from({ length: 60 }, (value, index) => "job " + index).join("\n")).length, CHART_ROW_LIMIT);
  assert.equal(chartChores("a\nb\nc", 2).length, 2, "the caller can ask for a shorter cap");
});

test("the row count is held between the printed minimum and maximum", () => {
  assert.equal(chartRows(8), 8);
  assert.equal(chartRows("12"), 12);
  assert.equal(chartRows(6.7), 6, "a fractional row count is floored");
  assert.equal(chartRows(1), CHART_MIN_ROWS, "a chart never prints fewer than three rows");
  assert.equal(chartRows(99), CHART_MAX_ROWS, "a chart never prints more than fourteen rows");
  assert.equal(chartRows(0), 8, "an empty row box falls back to the eight row default");
  assert.equal(chartRows("nonsense"), 8);
});

test("the printed title, name and reward line are tidied and trimmed", () => {
  assert.equal(chartText("  My   weekly   chores  "), "My weekly chores");
  assert.equal(chartText("x".repeat(60), CHART_TITLE_MAX).length, CHART_TITLE_MAX);
  assert.equal(chartText("Alex", CHART_NAME_MAX), "Alex");
  assert.equal(chartText("a b", 1), "a");
  assert.equal(chartText(null), "");
  assert.ok(CHART_TITLE_MAX <= 40 && CHART_NAME_MAX <= 40, "the printed lines stay short enough for the title band");
});

test("the chore chart sheet keeps every band and every row inside the printable border", () => {
  for (const paper of ["letter", "a4"]) {
    for (const days of ["week", "school", "school-sat"]) {
      const sheet = chartSheet({ paper, days, rows: 8 });
      assert.equal(sheet.paper.id, paper);
      assert.equal(sheet.days.id, days);
      assert.equal(sheet.rows, 8);
      assert.equal(sheet.cols, sheet.days.names.length);
      assert.equal(sheet.marginCm, CHART_MARGIN_CM);
      assert.ok(sheet.marginCm >= 1, "a printed chart keeps a real printer margin");
      const stacked = sheet.titleCm + sheet.headCm + sheet.rewardCm + sheet.gapCm + sheet.bodyCm;
      assert.ok(Math.abs(stacked - sheet.usableH) < 1e-9, "the stacked bands fill the usable height");
      assert.ok(Math.abs(sheet.usableW + sheet.marginCm * 2 - sheet.paper.widthCm) < 1e-9, "the usable width honours the margin");
      assert.ok(Math.abs(sheet.usableH + sheet.marginCm * 2 - sheet.paper.heightCm) < 1e-9, "the usable height honours the margin");
      assert.ok(Math.abs(sheet.bodyCm - sheet.rowCm * sheet.rows) < 1e-9, "the rows divide the body exactly");
      assert.ok(Math.abs(sheet.labelW + sheet.colW * sheet.cols - sheet.usableW) < 1e-9, "the columns fill the usable width");
      assert.ok(sheet.rowCm > 0 && sheet.colW > 0);
    }
  }
  assert.equal(chartSheet().paper.id, "letter", "no paper choice prints US Letter");
  assert.equal(chartSheet({ rows: 1 }).rows, CHART_MIN_ROWS, "the sheet asks chartRows for its row count");
  assert.ok(chartSheet({ rows: 14 }).rowCm < chartSheet({ rows: 3 }).rowCm, "more rows means shallower rows");
});

test("the chart profile carries a paper list and ships a usable sample week", () => {
  const profile = getProductProfile("chore-chart");
  assert.equal(profile.name, "Chore Chart Maker");
  assert.equal(profile.exportSvg, false, "the chart is a printed sheet, so there is no cut path to export");
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.hasBase, false);
  assert.equal(profile.sizes.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels[0], "US Letter (8.5 x 11 in)");
  assert.ok(CHART_SAMPLE.length >= 5, "the sample week is long enough to fill a chart");
  assert.equal(new Set(CHART_SAMPLE).size, CHART_SAMPLE.length, "the sample week repeats a job");
  for (const job of CHART_SAMPLE) assert.ok(job.length <= CHART_CHORE_MAX, "a sample job is longer than one row allows");
});

test("the multiplication chart maker exposes its ranges, fills, squares and orientations", () => {
  assert.equal(mulType("tables").id, "tables");
  assert.equal(mulType("nonsense").id, "grid", "the grid is the default chart");
  assert.deepEqual(MUL_RANGES.map((range) => range.max), [10, 12, 15, 20]);
  assert.equal(mulRange("20").max, 20);
  assert.equal(mulRange(10).max, 10, "a bare number is matched to its range");
  assert.equal(mulRange("nonsense").max, 12, "the 1 to 12 chart is the safe default");
  assert.equal(mulFill("blank").id, "blank");
  assert.equal(mulFill("nonsense").id, "full", "a full answer key is the default");
  assert.equal(mulSquares("off").id, "off");
  assert.equal(mulSquares("nonsense").id, "on", "the square diagonal is highlighted by default");
  assert.equal(mulOrient("landscape").id, "landscape");
  assert.equal(mulOrient("nonsense").id, "portrait", "portrait is the default orientation");
  assert.equal(new Set(MUL_TYPES.map((type) => type.id)).size, MUL_TYPES.length, "two chart types share an id");
  assert.equal(new Set(MUL_FILLS.map((fill) => fill.id)).size, MUL_FILLS.length, "two answer modes share an id");
  assert.ok(MUL_MIN_CELL_CM > 0 && MUL_MIN_CELL_CM <= 1, "a printed cell keeps a readable floor");
});

test("mulShowsAnswer prints the answer key, half of it, or none at all", () => {
  assert.equal(mulShowsAnswer("full", 3, 4, 12), true);
  assert.equal(mulShowsAnswer("blank", 3, 4, 12), false);
  assert.equal(mulShowsAnswer("partial", 4, 4, 12), true, "the square diagonal stays in the half that is printed");
  assert.equal(mulShowsAnswer("partial", 4, 5, 12), true, "every answer above the diagonal is printed");
  assert.equal(mulShowsAnswer("partial", 5, 4, 12), false, "everything below the diagonal is left to fill in");
  assert.equal(mulShowsAnswer("nonsense", 5, 4, 12), true, "an unknown answer mode falls back to the full key");
});

test("the multiplication chart sheet keeps the grid inside the printable border", () => {
  for (const paper of ["letter", "a4"]) {
    for (const max of ["10", "12", "15", "20"]) {
      const sheet = mulSheet({ paper, max, type: "grid" });
      assert.equal(sheet.paper.id, paper);
      assert.equal(sheet.type.id, "grid");
      assert.equal(sheet.max, Number(max));
      assert.equal(sheet.cols, sheet.max + 1, "the factors need a header row and a header column");
      assert.equal(sheet.rows, sheet.max + 1);
      assert.equal(sheet.marginCm, MUL_MARGIN_CM);
      assert.ok(sheet.marginCm >= 1, "a printed sheet keeps a real printer margin");
      assert.ok(Math.abs(sheet.usableW + sheet.marginCm * 2 - sheet.widthCm) < 1e-9, "the usable width honours the margin");
      assert.ok(Math.abs(sheet.usableH + sheet.marginCm * 2 - sheet.heightCm) < 1e-9, "the usable height honours the margin");
      assert.ok(Math.abs(sheet.titleCm + sheet.gapCm + sheet.bodyCm - sheet.usableH) < 1e-9, "the title band and the body fill the usable height");
      assert.ok(Math.abs(sheet.cellW * sheet.cols - sheet.usableW) < 1e-9, "the columns fill the usable width");
      assert.ok(Math.abs(sheet.cellH * sheet.rows - sheet.bodyCm) < 1e-9, "the rows fill the body exactly");
      assert.ok(sheet.cellCm >= MUL_MIN_CELL_CM, "a printed cell never drops below the readable floor");
    }
  }
  assert.equal(mulSheet().paper.id, "letter", "no paper choice prints US Letter");
  assert.equal(mulSheet().max, 12, "no range choice prints the 1 to 12 chart");
});

test("the written-out times tables fall into blocks on the same paper", () => {
  const sheet = mulSheet({ paper: "letter", max: "12", type: "tables" });
  assert.equal(sheet.type.id, "tables");
  assert.equal(sheet.max, 12);
  assert.ok(sheet.blockCols >= 1 && sheet.blockRows >= 1);
  assert.ok(sheet.blockCols * sheet.blockRows >= sheet.max, "every table gets a block");
  assert.ok(Math.abs(sheet.blockW * sheet.blockCols - sheet.usableW) < 1e-9, "the blocks fill the usable width");
  assert.ok(Math.abs(sheet.blockH * sheet.blockRows - sheet.bodyCm) < 1e-9, "the blocks fill the body height");
  assert.ok(Math.abs(sheet.lineCm * (sheet.max + 1) - sheet.blockH) < 1e-9, "every block has one heading line and one line per fact");
  assert.equal(mulSheet({ max: "20", type: "tables" }).max, MUL_TABLES_MAX, "400 facts on one sheet stop being readable, so the written-out tables stop at 1 to 12");
});

test("landscape turns the sheet on its side so a 1 to 20 grid still fits", () => {
  const portrait = mulSheet({ paper: "letter", max: "20", orient: "portrait" });
  const landscape = mulSheet({ paper: "letter", max: "20", orient: "landscape" });
  assert.equal(portrait.orient.id, "portrait");
  assert.equal(landscape.orient.id, "landscape");
  assert.equal(portrait.widthCm, landscape.heightCm, "landscape turns the sheet on its side");
  assert.equal(portrait.heightCm, landscape.widthCm);
  assert.ok(Math.abs(portrait.widthCm * portrait.heightCm - landscape.widthCm * landscape.heightCm) < 1e-9, "the paper keeps its area");
  assert.ok(landscape.usableW > portrait.usableW, "landscape gives the wide 1 to 20 grid more room across");
  assert.ok(landscape.cellCm >= MUL_MIN_CELL_CM && portrait.cellCm >= MUL_MIN_CELL_CM, "the 1 to 20 grid still prints a readable cell either way");
});

test("the multiplication chart profile carries a paper list and ships a usable sample", () => {
  const profile = getProductProfile("multiplication-chart");
  assert.equal(profile.name, "Multiplication Chart Maker");
  assert.equal(profile.exportSvg, false, "the chart is a printed sheet, so there is no cut path to export");
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.hasBase, false);
  assert.equal(profile.sizes.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels[0], "US Letter (8.5 x 11 in)");
  assert.equal(mulRange(MUL_SAMPLE.max).max, 12, "the sample is the 1 to 12 chart a classroom reaches for");
  assert.equal(mulType(MUL_SAMPLE.type).id, "grid");
  assert.equal(mulFill(MUL_SAMPLE.fill).id, "full");
  assert.equal(mulSquares(MUL_SAMPLE.squares).id, "on");
  assert.ok(MUL_SAMPLE.title.length <= MUL_TITLE_MAX && MUL_SAMPLE.name.length <= MUL_NAME_MAX, "the sample fits the printed bands");
});

test("the crown maker exposes its styles and bands", () => {
  assert.equal(crownStyle("king").id, "king");
  assert.equal(crownStyle("nonsense").id, "king", "sharp points are the safe default");
  assert.equal(crownBand("wide").id, "wide");
  assert.equal(crownBand("nonsense").id, "classic", "the classic band is the safe default");
  assert.equal(new Set(CROWN_STYLES.map((style) => style.id)).size, CROWN_STYLES.length, "two crown styles share an id");
  assert.equal(new Set(CROWN_BANDS.map((band) => band.id)).size, CROWN_BANDS.length, "two crown bands share an id");
  assert.ok(CROWN_NAME_MAX > 0 && CROWN_NAME_MAX <= 30, "the printed band holds a real first name, not a sentence");
  assert.ok(CROWN_TOOTH_CM > 0, "a point is never cut narrower than a scissor can turn");
  assert.ok(CROWN_MIN_GAP_CM > 0, "two stacked bands keep a cut line between them");
});

test("the crown band geometry fills the turned page with whole points", () => {
  for (const paper of ["letter", "a4"]) {
    for (const band of ["slim", "classic", "wide"]) {
      const sheet = crownSheet({ paper, style: "queen", band });
      assert.equal(sheet.paper.id, paper);
      assert.equal(sheet.style.id, "queen");
      assert.equal(sheet.band.id, band);
      assert.equal(sheet.perSheet, CROWN_PER_SHEET);
      assert.equal(sheet.marginCm, CROWN_MARGIN_CM);
      assert.equal(sheet.tabCm, CROWN_TAB_CM);
      assert.equal(sheet.widthCm, sheet.paper.heightCm, "the band runs along the long edge, so the page is turned");
      assert.equal(sheet.heightCm, sheet.paper.widthCm);
      assert.ok(Math.abs(sheet.usableW + sheet.marginCm * 2 - sheet.widthCm) < 1e-9, "the usable width honours the margin");
      assert.ok(Math.abs(sheet.usableH + sheet.marginCm * 2 - sheet.heightCm) < 1e-9, "the usable height honours the margin");
      assert.ok(Math.abs(sheet.bandHCm * sheet.perSheet + sheet.gapCm * (sheet.perSheet + 1) - sheet.usableH) < 1e-9, "the two bands and their gaps fill the usable height");
      assert.ok(Math.abs(sheet.bodyWCm + sheet.tabCm - sheet.usableW) < 1e-9, "the band body plus the glue tab fills the usable width");
      assert.ok(Math.abs(sheet.toothWCm * sheet.teeth - sheet.bodyWCm) < 1e-9, "the points divide the band evenly");
      assert.ok(sheet.teeth >= 4, "a crown keeps at least four points");
      assert.ok(sheet.gapCm >= CROWN_MIN_GAP_CM - 1e-9, "the gap never drops below the cut floor");
      assert.ok(Math.abs(sheet.fitCm - (sheet.perSheet * sheet.usableW - sheet.tabCm)) < 1e-9, "one sheet loses exactly one tab to the overlap");
    }
  }
  assert.equal(crownSheet().paper.id, "letter", "no paper choice prints US Letter");
  assert.equal(crownSheet().band.id, "classic", "no band choice prints the classic band");
});

test("a wide band is trimmed so it still prints, and one sheet wraps a child head", () => {
  const slim = crownSheet({ band: "slim" });
  const classic = crownSheet({ band: "classic" });
  const wide = crownSheet({ band: "wide" });
  assert.ok(slim.bandHCm < classic.bandHCm);
  assert.ok(classic.bandHCm < wide.bandHCm);
  assert.ok(Math.abs(slim.bandHCm - (CROWN_BANDS[0].bodyCm + CROWN_BANDS[0].teethCm)) < 1e-9, "a slim band has room, so it prints at its full height");
  assert.ok(wide.bandHCm <= (wide.usableH - CROWN_MIN_GAP_CM * (CROWN_PER_SHEET + 1)) / CROWN_PER_SHEET + 1e-9, "the tall band is scaled down rather than allowed to run off the page");
  assert.ok(slim.fitCm > 40 && classic.fitCm > 40, "one Letter sheet of two bands wraps around a child head");
  const a4 = crownSheet({ paper: "a4" });
  const letter = crownSheet({ paper: "letter" });
  assert.ok(Math.abs(a4.fitCm - (a4.perSheet * a4.usableW - a4.tabCm)) < 1e-9, "the A4 sheet measures from its own paper");
  assert.ok(a4.fitCm > letter.fitCm, "the taller A4 page yields a longer band than US Letter");
});

test("the crown profile carries a paper list and ships a usable sample", () => {
  const profile = getProductProfile("crown-maker");
  assert.equal(profile.name, "Crown Maker");
  assert.equal(profile.exportSvg, false, "a printed crown has no cut path to export");
  assert.equal(profile.hasHardware, false);
  assert.equal(profile.hasBase, false);
  assert.equal(profile.sizes.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels.length, CHART_PAPERS.length);
  assert.equal(profile.sizeLabels[0], "US Letter (8.5 x 11 in)");
  assert.equal(crownStyle(CROWN_SAMPLE.style).id, "queen", "the sample is the arch-and-pearls crown a birthday reaches for");
  assert.equal(crownBand(CROWN_SAMPLE.band).id, "classic");
  assert.ok(CROWN_SAMPLE.name.length <= CROWN_NAME_MAX, "the sample name fits the printed band");
});
