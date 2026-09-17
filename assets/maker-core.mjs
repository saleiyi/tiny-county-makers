// Tiny County Makers - shared maker engine.
// Pure product config + cutline geometry. Imported by the browser app and by Node tests.

// The acrylic photo block is sold in imperial sizes, so the engine keeps the centimetre
// value it needs for print maths next to the inch label shoppers actually search for.
export const PHOTO_BLOCK_SIZES = Object.freeze([
  { id: "2x2", widthCm: 5.08, heightCm: 5.08, label: "2 x 2 in (5 x 5 cm)" },
  { id: "4x4", widthCm: 10.16, heightCm: 10.16, label: "4 x 4 in (10 x 10 cm)" },
  { id: "5x7", widthCm: 12.7, heightCm: 17.78, label: "5 x 7 in (13 x 18 cm)" },
  { id: "8x10", widthCm: 20.32, heightCm: 25.4, label: "8 x 10 in (20 x 25 cm)" },
]);
/** Long sides an acrylic luggage tag is sold in, in centimetres. */
export const LUGGAGE_TAG_SIZES = Object.freeze([7, 9, 11]);

/** Long sides an acrylic cake topper is sold in, in centimetres. */
export const CAKE_TOPPER_SIZES = Object.freeze([10, 12, 15]);

/** How a cake topper is built: bare letters, letters welded to a bar, or a drilled plaque. */
export const CAKE_TOPPER_STYLES = Object.freeze(["cutout", "bar", "plaque"]);

/** Long sides an acrylic bookmark is sold in, in centimetres. */
export const BOOKMARK_SIZES = Object.freeze([15, 18, 20]);

/** Every silhouette the acrylic bookmark tool can draw, in the order the UI offers them. */
export const BOOKMARK_SHAPES = Object.freeze(["classic", "arch", "notch", "pointed"]);
/** Footprint an acrylic coaster is sold in, in centimetres. */
export const COASTER_SIZES = Object.freeze([9, 10, 11]);

/** Every silhouette the acrylic coaster tool can draw, in the order the UI offers them. */
export const COASTER_SHAPES = Object.freeze(["square", "round"]);

const PROFILES = Object.freeze([
  { id: "keychain", name: "Pet Keychain Maker", product: "Acrylic keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "standee", name: "Acrylic Standee Maker", product: "Acrylic standee", hasHardware: false, hasBase: true, exportSvg: false, sizes: [8, 10, 15] },
  { id: "sticker", name: "Sticker Cutline Generator", product: "Die-cut sticker", hasHardware: false, hasBase: false, exportSvg: true, sizes: [5, 7, 10] },
  { id: "magnet", name: "Fridge Magnet Maker", product: "Fridge magnet", hasHardware: false, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "photo-keychain", name: "Photo Keychain Maker", product: "Acrylic photo keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "name-keychain", name: "Name Keychain Maker", product: "Acrylic name keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "ornament", name: "Photo Ornament Maker", product: "Photo ornament", hasHardware: true, hasBase: false, exportSvg: true, sizes: [6, 8, 10] },
  { id: "block", name: "Acrylic Photo Block Maker", product: "Acrylic photo block", hasHardware: false, hasBase: false, exportSvg: false, sizes: PHOTO_BLOCK_SIZES.map((size) => size.heightCm), sizeLabels: PHOTO_BLOCK_SIZES.map((size) => size.label) },
  { id: "luggage-tag", name: "Luggage Tag Maker", product: "Acrylic luggage tag", hasHardware: false, hasBase: false, exportSvg: true, sizes: LUGGAGE_TAG_SIZES },
  { id: "cake-topper", name: "Cake Topper Maker", product: "Acrylic cake topper", hasHardware: false, hasBase: false, exportSvg: true, sizes: CAKE_TOPPER_SIZES },
  { id: "bookmark", name: "Bookmark Maker", product: "Acrylic bookmark", hasHardware: false, hasBase: false, exportSvg: true, sizes: BOOKMARK_SIZES },
  { id: "coaster", name: "Acrylic Coaster Maker", product: "Acrylic coaster", hasHardware: false, hasBase: false, exportSvg: true, sizes: COASTER_SIZES },
]);

export const PRINT_DPI = 300;

// ---------------------------------------------------------------- product config

export function listProductProfiles() {
  return PROFILES;
}

export function getProductProfile(id) {
  const profile = PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown product profile: ${id}`);
  return profile;
}

/** The photo block product sizes, looked up by the long side the size picker stores. */
export function photoBlockSize(value) {
  const cm = Number(value);
  return PHOTO_BLOCK_SIZES.find((size) => Math.abs(size.heightCm - cm) < 0.02) || PHOTO_BLOCK_SIZES[0];
}

/** Size dropdown label: photo blocks read in inches, every other product reads in cm. */
export function sizeOptionLabel(profile, longSideCm) {
  const index = profile.sizes.indexOf(Number(longSideCm));
  const labels = profile.sizeLabels;
  if (index >= 0 && labels && labels[index]) return labels[index];
  return longSideCm + " cm long side";
}
export function physicalDimensions(width, height, longSideCm) {
  const safeWidth = Number(width), safeHeight = Number(height), longSide = Number(longSideCm);
  if (!(safeWidth > 0 && safeHeight > 0 && longSide > 0)) throw new Error("Image dimensions and long side must be positive.");
  const ratio = longSide / Math.max(safeWidth, safeHeight);
  return { widthCm: round(safeWidth * ratio), heightCm: round(safeHeight * ratio) };
}

export function stickerOffsetPixels(millimeters, dpi = PRINT_DPI) {
  const value = Number(millimeters), safeDpi = Number(dpi);
  if (!(value >= 0 && safeDpi > 0)) throw new Error("Offset and DPI must be valid.");
  return Math.round(value / 25.4 * safeDpi);
}

export function normalizeCutlineSmoothing(value) {
  return Math.max(0, Math.min(10, Math.round(Number(value) || 0)));
}

/** Physical longest side in centimetres -> whole pixels at a print DPI. */
export function physicalPixels(longSideCm, dpi = PRINT_DPI) {
  const cm = Number(longSideCm), safeDpi = Number(dpi);
  if (!(cm > 0 && safeDpi > 0)) throw new Error("Long side and DPI must be positive.");
  return Math.max(1, Math.round(cm / 2.54 * safeDpi));
}

/** Effective DPI of a canvas that draws `pixelLongSide` pixels across `longSideCm`. */
export function workDpi(pixelLongSide, longSideCm) {
  const px = Number(pixelLongSide), cm = Number(longSideCm);
  if (!(px > 0 && cm > 0)) throw new Error("Pixel long side and physical long side must be positive.");
  return px / (cm / 2.54);
}

// ---------------------------------------------------------------- alpha -> mask

/** RGBA buffer -> binary alpha mask. 1 means "opaque enough to cut". */
export function alphaToMask(pixels, width, height, alphaThreshold = 24) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 0 && h > 0)) throw new Error("Mask dimensions must be positive.");
  if (!pixels || pixels.length < w * h * 4) throw new Error("Pixel buffer is smaller than the mask dimensions.");
  const threshold = Math.max(0, Math.min(255, Math.floor(Number(alphaThreshold) || 0)));
  const mask = new Uint8Array(w * h);
  for (let i = 0, p = 3; i < mask.length; i++, p += 4) mask[i] = pixels[p] > threshold ? 1 : 0;
  return mask;
}

// ------------------------------------------------------------- flat background lift

/** Largest per-channel difference between one pixel and a reference colour. */
function channelSpread(pixels, p, color) {
  return Math.max(
    Math.abs(pixels[p] - color[0]),
    Math.abs(pixels[p + 1] - color[1]),
    Math.abs(pixels[p + 2] - color[2]),
  );
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

/** Median colour of the outer one-pixel frame, and how much of that frame agrees with it. */
function backdropSample(pixels, w, h, tolerance) {
  const ring = [];
  for (let x = 0; x < w; x++) { ring.push(x); ring.push((h - 1) * w + x); }
  for (let y = 1; y < h - 1; y++) { ring.push(y * w); ring.push(y * w + w - 1); }
  const lists = [[], [], []];
  let clear = 0;
  for (const index of ring) {
    const p = index * 4;
    if (pixels[p + 3] <= 8) clear++;
    lists[0].push(pixels[p]);
    lists[1].push(pixels[p + 1]);
    lists[2].push(pixels[p + 2]);
  }
  const color = lists.map((list) => {
    list.sort((a, b) => a - b);
    return list[list.length >> 1];
  });
  let matches = 0;
  for (const index of ring) if (channelSpread(pixels, index * 4, color) <= tolerance) matches++;
  return { color, share: matches / ring.length, clearShare: clear / ring.length };
}

/**
 * Lifts a flat, evenly lit backdrop out of an otherwise opaque picture by writing zeros into the
 * alpha channel. A photo saved as JPEG has no transparency at all, so without this its outline
 * traces back as one big rectangle and the cut line never follows the subject. The untouched
 * buffer comes back when the border is too busy to be a backdrop (a real scene runs to every
 * edge), when the picture already carries transparency, or when the backdrop would swallow it.
 */
export function stripFlatBackground(pixels, width, height, options = {}) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  const untouched = { pixels, applied: false, removedRatio: 0, color: null };
  if (!pixels || !(w > 7 && h > 7) || pixels.length < w * h * 4) return untouched;
  const tolerance = clampNumber(options.tolerance, 8, 120, 30);
  const uniformShare = clampNumber(options.uniformShare, 0.5, 1, 0.9);
  const sample = backdropSample(pixels, w, h, tolerance);
  if (sample.clearShare > 0.02 || sample.share < uniformShare) return untouched;

  const total = w * h;
  const isBackdrop = new Uint8Array(total);
  const stack = new Int32Array(total);
  let top = 0;
  const seed = (index) => {
    if (isBackdrop[index]) return;
    if (channelSpread(pixels, index * 4, sample.color) > tolerance) return;
    isBackdrop[index] = 1;
    stack[top++] = index;
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 1; y < h - 1; y++) { seed(y * w); seed(y * w + w - 1); }
  let removed = 0;
  while (top > 0) {
    const index = stack[--top];
    removed++;
    const x = index % w;
    const y = (index - x) / w;
    if (x > 0) seed(index - 1);
    if (x < w - 1) seed(index + 1);
    if (y > 0) seed(index - w);
    if (y < h - 1) seed(index + w);
  }
  const removedRatio = removed / total;
  // A backdrop that swallows the whole picture is a blank upload, not a subject to cut around.
  if (removedRatio < 0.02 || removedRatio > 0.97) return untouched;

  const out = new Uint8ClampedArray(pixels);
  for (let index = 0; index < total; index++) if (isBackdrop[index]) out[index * 4 + 3] = 0;
  // Soften the single ring of pixels touching the backdrop so the traced edge does not stair-step.
  for (let index = 0; index < total; index++) {
    if (isBackdrop[index]) continue;
    const x = index % w;
    const y = (index - x) / w;
    const touches = (x > 0 && isBackdrop[index - 1]) || (x < w - 1 && isBackdrop[index + 1])
      || (y > 0 && isBackdrop[index - w]) || (y < h - 1 && isBackdrop[index + w]);
    if (!touches) continue;
    const p = index * 4;
    const spread = channelSpread(pixels, p, sample.color);
    const graded = Math.max(0, Math.min(255, Math.round((255 * (spread - tolerance)) / (tolerance * 1.2))));
    if (graded < out[p + 3]) out[p + 3] = graded;
  }
  return { pixels: out, applied: true, removedRatio, color: sample.color };
}

// ---------------------------------------------------------------- contour tracing

/**
 * Marching-squares boundary tracing over a binary mask.
 * Returns one polygon (array of [x, y] points in mask pixel space) per closed loop,
 * every polygon wound clockwise in screen space so that a positive offsetPath() grows it.
 * Outer boundaries and holes are traced with the same winding, so the two are told
 * apart by containment depth (see contourDepths) rather than by direction.
 */
export function traceContours(mask, width, height) {
  const w = Math.floor(Number(width)), h = Math.floor(Number(height));
  if (!(w > 1 && h > 1) || !mask) return [];
  // One transparent pixel of padding, so a shape that runs right up to the edge of the mask
  // still has a boundary to follow there. Without it the outer loop is left open at the edge
  // and the trace breaks into slivers. The frame shifts every coordinate by one, which is
  // undone again as the loops are read out below.
  const pw = w + 2, ph = h + 2;
  const stride = 2 * pw + 1;
  const key = (px, py) => py * stride + px;
  const edges = new Map();
  const link = (ax, ay, bx, by) => {
    const ka = key(ax, ay), kb = key(bx, by);
    let la = edges.get(ka); if (!la) { la = []; edges.set(ka, la); }
    let lb = edges.get(kb); if (!lb) { lb = []; edges.set(kb, lb); }
    la.push(kb); lb.push(ka);
  };
  const on = (x, y) => (x >= 1 && y >= 1 && x <= w && y <= h && mask[(y - 1) * w + (x - 1)]) ? 1 : 0;

  for (let y = 0; y < ph - 1; y++) {
    for (let x = 0; x < pw - 1; x++) {
      const idx = (on(x, y) << 3) | (on(x + 1, y) << 2) | (on(x + 1, y + 1) << 1) | on(x, y + 1);
      if (idx === 0 || idx === 15) continue;
      const tx = 2 * x + 1, ty = 2 * y;       // top edge midpoint
      const rx = 2 * x + 2, ry = 2 * y + 1;   // right edge midpoint
      const bx = 2 * x + 1, by = 2 * y + 2;   // bottom edge midpoint
      const lx = 2 * x, ly = 2 * y + 1;       // left edge midpoint
      switch (idx) {
        case 1: case 14: link(lx, ly, bx, by); break;
        case 2: case 13: link(bx, by, rx, ry); break;
        case 3: case 12: link(lx, ly, rx, ry); break;
        case 4: case 11: link(tx, ty, rx, ry); break;
        case 6: case 9: link(tx, ty, bx, by); break;
        case 7: case 8: link(lx, ly, tx, ty); break;
        case 5: link(lx, ly, tx, ty); link(bx, by, rx, ry); break;
        case 10: link(lx, ly, bx, by); link(tx, ty, rx, ry); break;
      }
    }
  }

  const contours = [];
  const used = new Set();
  for (const [startKey, list] of edges) {
    for (const nextKey of list) {
      const seedId = startKey < nextKey ? `${startKey}:${nextKey}` : `${nextKey}:${startKey}`;
      if (used.has(seedId)) continue;
      const loop = [];
      let cur = startKey, nxt = nextKey, guard = 0;
      while (guard++ < 4000000) {
        const a = Math.min(cur, nxt), b = Math.max(cur, nxt);
        const segId = `${a}:${b}`;
        if (used.has(segId)) break;
        used.add(segId);
        const nx = nxt % stride, ny = (nxt - nx) / stride;
        loop.push([nx / 2 - 1, ny / 2 - 1]);
        const around = edges.get(nxt);
        let follow = -1;
        for (let i = 0; i < around.length; i++) {
          if (around[i] !== cur) { follow = around[i]; break; }
        }
        if (follow === -1) break;
        cur = nxt; nxt = follow;
      }
      if (loop.length >= 3) contours.push(orientClockwise(loop));
    }
  }
  return contours;
}

function orientClockwise(points) {
  let signed = 0;
  for (let i = 0, n = points.length; i < n; i++) {
    const p = points[i], q = points[(i + 1) % n];
    signed += p[0] * q[1] - q[0] * p[1];
  }
  return signed < 0 ? points.slice().reverse() : points;
}

/**
 * Signed area of a closed polygon. Positive means clockwise in screen space (y grows
 * downwards), which is the winding traceContours() normalises every loop to.
 */
export function signedArea(points) {
  let signed = 0;
  for (let i = 0, n = points.length; i < n; i++) {
    const p = points[i], q = points[(i + 1) % n];
    signed += p[0] * q[1] - q[0] * p[1];
  }
  return signed / 2;
}

/** Even-odd ray casting. Points exactly on an edge are undefined but rare in practice. */
export function pointInPolygon(point, polygon) {
  const x = Number(point[0]), y = Number(point[1]);
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = Number(polygon[i][0]), yi = Number(polygon[i][1]);
    const xj = Number(polygon[j][0]), yj = Number(polygon[j][1]);
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Evenly spaced sample vertices used to decide whether one loop sits inside another. */
function samplePoints(points, count = 9) {
  const n = points.length;
  if (n <= count) return points.slice();
  const step = n / count;
  const out = [];
  for (let i = 0; i < count; i++) out.push(points[Math.floor(i * step)]);
  return out;
}

/**
 * Nesting depth per contour: 0 is an outer boundary, 1 is a hole, 2 is an island
 * inside a hole, and so on. Even depth is material, odd depth is a cut-out.
 */
export function contourDepths(contours) {
  const list = Array.isArray(contours) ? contours : [];
  const depths = new Array(list.length).fill(0);
  for (let i = 0; i < list.length; i++) {
    if (!list[i] || list[i].length < 3) continue;
    const samples = samplePoints(list[i], 9);
    for (let j = 0; j < list.length; j++) {
      if (i === j || !list[j] || list[j].length < 3) continue;
      let hits = 0;
      for (const point of samples) if (pointInPolygon(point, list[j])) hits++;
      if (hits * 2 > samples.length) depths[i] += 1;
    }
  }
  return depths;
}

/**
 * Offset every contour of a shape by the same physical distance, in the direction that
 * grows the material: outer boundaries move outwards, holes shrink by the same amount.
 * Passing the plain `+distance` to every loop would seal holes shut.
 */
export function offsetContours(contours, distancePx) {
  const list = Array.isArray(contours) ? contours : [];
  const distance = Number(distancePx);
  if (!Number.isFinite(distance) || distance === 0) return list.map((points) => points);
  const depths = contourDepths(list);
  return list.map((points, index) => {
    if (!points || points.length < 3) return points;
    const outward = depths[index] % 2 === 0 ? distance : -distance;
    return offsetPath(orientClockwise(points), outward);
  });
}
export function polygonArea(points) {
  return Math.abs(signedArea(points));
}

/** Keep meaningful loops, biggest first, so noise never reaches the exporter. */
export function cleanContours(contours, minAreaPx = 24, maxContours = 40) {
  if (!Array.isArray(contours)) return [];
  const kept = contours
    .filter((points) => Array.isArray(points) && points.length >= 3 && polygonArea(points) >= minAreaPx)
    .sort((a, b) => polygonArea(b) - polygonArea(a));
  return kept.slice(0, maxContours);
}

// ---------------------------------------------------------------- path cleanup

/** Douglas-Peucker simplification that also works on a closed polygon. */
export function simplifyPath(points, tolerance) {
  const n = points.length;
  const tol = Number(tolerance);
  if (n < 4 || !(tol > 0)) return points;
  let far = 1, farD = -1;
  const x0 = points[0][0], y0 = points[0][1];
  for (let i = 1; i < n; i++) {
    const dx = points[i][0] - x0, dy = points[i][1] - y0;
    const d = dx * dx + dy * dy;
    if (d > farD) { farD = d; far = i; }
  }
  if (far <= 1 || far >= n - 1) return points;
  const head = douglasPeucker(points.slice(0, far + 1), tol);
  const tail = douglasPeucker(points.slice(far).concat([points[0]]), tol);
  const out = head.slice(0, -1).concat(tail.slice(0, -1));
  return out.length >= 3 ? out : points;
}

function douglasPeucker(points, tolerance) {
  const n = points.length;
  if (n < 3) return points.slice();
  const tol2 = tolerance * tolerance;
  const keep = new Uint8Array(n);
  keep[0] = 1; keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    if (last <= first + 1) continue;
    const ax = points[first][0], ay = points[first][1];
    const dx = points[last][0] - ax, dy = points[last][1] - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1, idx = -1;
    for (let i = first + 1; i < last; i++) {
      const px = points[i][0] - ax, py = points[i][1] - ay;
      let d;
      if (len2 === 0) {
        d = px * px + py * py;
      } else {
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
        const ex = px - t * dx, ey = py - t * dy;
        d = ex * ex + ey * ey;
      }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol2 && idx > 0) {
      keep[idx] = 1;
      stack.push([first, idx], [idx, last]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[i]);
  return out;
}

/** Closed-polygon smoothing via repeated weighted moving average (no shrinkage artifacts). */
export function smoothPath(points, strength) {
  const iterations = Math.min(8, normalizeCutlineSmoothing(strength));
  let pts = points;
  for (let pass = 0; pass < iterations; pass++) {
    const n = pts.length;
    if (n < 5) break;
    const next = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
      next[i] = [(a[0] + 2 * b[0] + c[0]) / 4, (a[1] + 2 * b[1] + c[1]) / 4];
    }
    pts = next;
  }
  return pts;
}

/**
 * Uniform outward offset of a clockwise polygon using a miter joint.
 * Positive `distancePx` grows the shape; the miter is clamped so spikes cannot explode.
 */
export function offsetPath(points, distancePx) {
  const n = points.length;
  const distance = Number(distancePx);
  if (n < 3 || !Number.isFinite(distance) || distance === 0) return points;
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n], cur = points[i], next = points[(i + 1) % n];
    const inx = cur[0] - prev[0], iny = cur[1] - prev[1];
    const outx = next[0] - cur[0], outy = next[1] - cur[1];
    const l1 = Math.hypot(inx, iny) || 1, l2 = Math.hypot(outx, outy) || 1;
    const n1x = iny / l1, n1y = -inx / l1;
    const n2x = outy / l2, n2y = -outx / l2;
    let mx = n1x + n2x, my = n1y + n2y;
    const ml = Math.hypot(mx, my);
    if (ml < 1e-6) { out[i] = [cur[0] + n2x * distance, cur[1] + n2y * distance]; continue; }
    mx /= ml; my /= ml;
    const cos = mx * n1x + my * n1y;
    const scale = cos > 1 / 6 ? 1 / cos : 6;
    out[i] = [cur[0] + mx * distance * scale, cur[1] + my * distance * scale];
  }
  return out;
}

export function scalePath(points, sx, sy = sx) {
  return points.map(([x, y]) => [x * sx, y * sy]);
}

export function translatePath(points, dx, dy) {
  return points.map(([x, y]) => [x + dx, y + dy]);
}

export function boundsOfContours(contours) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pts of contours) {
    for (const [x, y] of pts) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

// ---------------------------------------------------------------- ornament geometry

/** Every hanging shape the ornament tool can draw, in the order the UI offers them. */
export const ORNAMENT_SHAPES = Object.freeze(["round", "oval", "hexagon", "star", "heart", "arch"]);

export function isOrnamentShape(shape) {
  return ORNAMENT_SHAPES.includes(shape);
}

/**
 * Closed polygon for a hanging ornament, in a local box of width x height.
 * The shape is scaled so its own bounding box fills the box exactly, which keeps
 * "longest side" meaning the same thing for every silhouette.
 */
export function ornamentShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Ornament width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isOrnamentShape(shape) ? shape : "round";
  const raw = rawOrnamentPolygon(id, count);
  return fitPolygonToBox(raw, w, h);
}

function rawOrnamentPolygon(shape, samples) {
  const pts = [];
  if (shape === "heart") {
    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 2;
      const s = Math.sin(t);
      const x = 16 * s * s * s;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push([x, -y]);
    }
    return pts;
  }
  if (shape === "star") {
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? 1 : 0.44;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    return pts;
  }
  if (shape === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      pts.push([Math.cos(angle), Math.sin(angle)]);
    }
    return pts;
  }
  if (shape === "arch") {
    // Semicircular top, straight sides, flat bottom: the classic acrylic plaque.
    const half = Math.floor(samples / 2);
    for (let i = 0; i <= half; i++) {
      const angle = Math.PI + (i / half) * Math.PI;
      pts.push([0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle)]);
    }
    pts.push([1, 1], [0, 1]);
    return pts;
  }
  // round and oval share one ellipse; the box decides which one you actually get.
  for (let i = 0; i < samples; i++) {
    const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
    pts.push([Math.cos(angle), Math.sin(angle)]);
  }
  return pts;
}

/** Translate and scale a polygon so its own bounding box becomes exactly 0,0 -> w,h. */
export function fitPolygonToBox(points, width, height) {
  const w = Number(width), h = Number(height);
  const box = boundsOfContours([points]);
  if (!box || box.width <= 0 || box.height <= 0) throw new Error("Cannot fit a degenerate polygon to a box.");
  const sx = w / box.width, sy = h / box.height;
  return points.map(([x, y]) => [(x - box.minX) * sx, (y - box.minY) * sy]);
}

/** Smallest y where the outline crosses the vertical line at `x`. */
export function topEdgeAtX(points, x) {
  let best = Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    if (x1 === x2) {
      if (Math.abs(x1 - x) < 1e-9) best = Math.min(best, y1, y2);
      continue;
    }
    const lo = Math.min(x1, x2), hi = Math.max(x1, x2);
    if (x < lo - 1e-9 || x > hi + 1e-9) continue;
    best = Math.min(best, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1));
  }
  return Number.isFinite(best) ? best : 0;
}

/**
 * Horizontal extent of the outline along the scan line \`y\`. Returns null when the line
 * misses the shape, so callers can probe for a band wide enough to hold a caption.
 */
export function widthAtY(points, y) {
  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
    if (y1 === y2) {
      if (Math.abs(y1 - y) < 1e-9) { minX = Math.min(minX, x1, x2); maxX = Math.max(maxX, x1, x2); }
      continue;
    }
    const lo = Math.min(y1, y2), hi = Math.max(y1, y2);
    if (y < lo - 1e-9 || y > hi + 1e-9) continue;
    const x = x1 + ((y - y1) / (y2 - y1)) * (x2 - x1);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, maxX, width: maxX - minX };
}

export function circleInsidePolygon(cx, cy, r, points, samples = 32) {
  if (!pointInPolygon([cx, cy], points)) return false;
  for (let i = 0; i < samples; i++) {
    const angle = (i / samples) * Math.PI * 2;
    if (!pointInPolygon([cx + r * Math.cos(angle), cy + r * Math.sin(angle)], points)) return false;
  }
  return true;
}

/**
 * Drill hole for the hanging cord. The hole starts just under the top of the outline and
 * slides down, shrinking if it must, until the whole circle sits on solid material.
 * That keeps every silhouette - including the heart's centre notch and the star's narrow
 * point - safe to cut on real acrylic.
 */
export function ornamentHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = ornamentShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(6, Math.min(w, h) * 0.03);
  for (let r = nominal; r >= 4; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.7 + (step / 48) * r * 3.2;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.7, r: Math.round(Math.max(3, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- luggage tag geometry

/** Every silhouette the luggage tag tool can draw, in the order the UI offers them. */
export const LUGGAGE_TAG_SHAPES = Object.freeze(["rounded", "tag", "circle", "oval"]);


export function isLuggageTagShape(shape) {
  return LUGGAGE_TAG_SHAPES.includes(shape);
}

/**
 * Closed polygon for a travel tag, in a local box of width x height.
 * Every silhouette is flat-bottomed so the printed name and contact line sit on a straight
 * edge, and every one is fitted to the box so "longest side" means the same thing.
 */
export function luggageTagShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Luggage tag width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isLuggageTagShape(shape) ? shape : "rounded";
  return fitPolygonToBox(rawLuggageTagPolygon(id, count), w, h);
}

function rawLuggageTagPolygon(shape, samples) {
  if (shape === "tag") {
    // Flat strap point, chamfered shoulders, straight sides: the classic shipping tag.
    const top = 0.56;
    const shoulder = 0.19;
    const left = (1 - top) / 2;
    return [[left, 0], [left + top, 0], [1, shoulder], [1, 1], [0, 1], [0, shoulder]];
  }
  if (shape === "circle" || shape === "oval") {
    const pts = [];
    for (let i = 0; i < samples; i++) {
      const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
      pts.push([Math.cos(angle), Math.sin(angle)]);
    }
    return pts;
  }
  // Rounded rectangle: the default shop-bought acrylic tag.
  const r = 0.15;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/**
 * Drill hole for the bag strap. Same search the ornament hole uses: start near the top of
 * the outline and slide down, shrinking if needed, until the whole circle is on material.
 * A fused strap point therefore keeps its hole safely inside the flat top.
 */
export function luggageTagHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = luggageTagShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(6, Math.min(w, h) * 0.055);
  for (let r = nominal; r >= 4; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.55 + (step / 48) * r * 3.4;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.55, r: Math.round(Math.max(3, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- cake topper geometry

export function isCakeTopperStyle(style) {
  return CAKE_TOPPER_STYLES.includes(style);
}

/**
 * The welding bar that keeps a two-word topper in one piece. It is measured from the type
 * itself rather than from a fixed fraction of the box, because it has to overlap the lowest
 * ink: a word with descenders such as "Happy Birthday" needs a taller band than an all-caps
 * word, and a bar that missed the letters would ship as loose acrylic.
 *
 * @param {number} width    canvas width the bar spans
 * @param {number} baseline y of the text baseline in the same coordinate space
 * @param {number} ascent   distance from the baseline up to the tallest ink
 * @param {number} descent  distance from the baseline down to the lowest ink
 */
export function cakeTopperBarRect(width, baseline, ascent, descent) {
  const safeW = Math.max(1, Number(width));
  const cap = Math.max(1, Number(ascent));
  const drop = Math.max(0, Number(descent));
  const top = Number(baseline) - cap * 0.16;
  const bottom = Number(baseline) + Math.max(drop, cap * 0.06) + cap * 0.08;
  return { x: 0, y: top, w: safeW, h: bottom - top };
}

/** The circle a plaque-style topper is cut from, inset so the text always has a margin. */
export function cakeTopperPlaque(width, height) {
  const safeW = Math.max(1, Number(width));
  const safeH = Math.max(1, Number(height));
  const size = Math.min(safeW, safeH);
  return { cx: safeW / 2, cy: safeH / 2, r: size * 0.5 };
}

// ---------------------------------------------------------------- bookmark geometry

export function isBookmarkShape(shape) {
  return BOOKMARK_SHAPES.includes(shape);
}

/**
 * Closed polygon for an acrylic bookmark, in a local box of width x height.
 * Every silhouette is a tall slab rather than a square, because a bookmark that is not
 * tall stops reading as a bookmark, and every one is fitted to the box so "longest side"
 * means the same thing whatever the shape and whatever the photo behind it.
 */
export function bookmarkShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Bookmark width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isBookmarkShape(shape) ? shape : "classic";
  return fitPolygonToBox(rawBookmarkPolygon(id, count), w, h);
}

function rawBookmarkPolygon(shape, samples) {
  if (shape === "arch") {
    // Rounded top, straight sides, flat bottom: the reading-app bookmark silhouette.
    const half = Math.floor(samples / 2);
    const pts = [];
    for (let i = 0; i <= half; i++) {
      const angle = Math.PI + (i / half) * Math.PI;
      pts.push([0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle)]);
    }
    pts.push([1, 1], [0, 1]);
    return pts;
  }
  if (shape === "notch") {
    // Straight slab with a V cut out of the bottom edge, like a ribbon bookmark.
    return [[0, 0], [1, 0], [1, 1], [0.64, 1], [0.5, 0.84], [0.36, 1], [0, 1]];
  }
  if (shape === "pointed") {
    // Straight slab that tapers to a single point, so it slips between two pages.
    return [[0, 0], [1, 0], [1, 0.8], [0.5, 1], [0, 0.8]];
  }
  // Classic: a plain rounded slab, the shape of a shop-bought acrylic blank.
  const r = 0.09;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/**
 * Drill hole for the tassel. Same search the tag and ornament holes use: start just under
 * the top of the outline and slide down, shrinking if it must, until the whole circle sits
 * on solid material, so a narrow bookmark slab still keeps a clean hole.
 */
export function bookmarkHole(shape, width, height) {
  const w = Number(width), h = Number(height);
  const points = bookmarkShapePoints(shape, w, h);
  const cx = w / 2;
  const top = topEdgeAtX(points, cx);
  const nominal = Math.max(5, Math.min(w, h) * 0.05);
  for (let r = nominal; r >= 3.5; r -= nominal / 24) {
    for (let step = 0; step <= 48; step++) {
      const cy = top + r * 1.7 + (step / 48) * r * 3.4;
      if (circleInsidePolygon(cx, cy, r, points)) return { cx, cy, r: Math.round(r * 100) / 100 };
    }
  }
  return { cx, cy: top + nominal * 1.7, r: Math.round(Math.max(2.5, nominal * 0.4) * 100) / 100 };
}

// ---------------------------------------------------------------- coaster geometry

export function isCoasterShape(shape) {
  return COASTER_SHAPES.includes(shape);
}

/**
 * Closed polygon for an acrylic coaster inside a square box. A coaster is sold as a square
 * blank or a round one, so the footprint is always 1:1 and the uploaded photo is
 * cover-fitted into it instead of setting the silhouette.
 */
export function coasterShapePoints(shape, width, height, samples = 160) {
  const w = Number(width), h = Number(height);
  if (!(w > 0 && h > 0)) throw new Error("Coaster width and height must be positive.");
  const count = Math.max(24, Math.floor(Number(samples) || 160));
  const id = isCoasterShape(shape) ? shape : "square";
  return fitPolygonToBox(rawCoasterPolygon(id, count), w, h);
}

function rawCoasterPolygon(shape, samples) {
  if (shape === "round") {
    const pts = [];
    for (let i = 0; i < samples; i++) {
      const a = (i / samples) * Math.PI * 2;
      pts.push([0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)]);
    }
    return pts;
  }
  // Square: a rounded square blank, the shape a laser-cut coaster ships in.
  const r = 0.07;
  const pts = [];
  const steps = Math.max(3, Math.floor(samples / 4) - 1);
  const corners = [
    [1 - r, r, -Math.PI / 2, 0],
    [1 - r, 1 - r, 0, Math.PI / 2],
    [r, 1 - r, Math.PI / 2, Math.PI],
    [r, r, Math.PI, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

// ---------------------------------------------------------------- SVG output

/** Straight-segment path data for one or many contours (used for exact cut geometry). */
export function contoursToPathD(contours, precision = 2) {
  const parts = [];
  for (const pts of contours || []) {
    if (!pts || pts.length < 3) continue;
    parts.push(contourToPathD(pts, precision));
  }
  return parts.join("");
}

export function contourToPathD(points, precision = 2) {
  const f = (value) => String(Number(value.toFixed(precision)));
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length; i++) d += `L${f(points[i][0])} ${f(points[i][1])}`;
  return `${d}Z`;
}

/** Quadratic-Bezier path data for a visually smooth contour (used for the SVG outline layer). */
export function contourToSmoothD(points, precision = 2) {
  const n = points.length;
  if (n < 3) return "";
  const f = (value) => String(Number(value.toFixed(precision)));
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const cur = points[i];
    const m = mid(cur, points[(i + 1) % n]);
    d += `Q${f(cur[0])} ${f(cur[1])} ${f(m[0])} ${f(m[1])}`;
  }
  return `${d}Z`;
}

export function contoursToSmoothD(contours, precision = 2) {
  return (contours || []).map((pts) => contourToSmoothD(pts, precision)).join("");
}

function round(value) {
  return Math.round(value * 100) / 100;
}