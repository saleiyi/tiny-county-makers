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
const PROFILES = Object.freeze([
  { id: "keychain", name: "Pet Keychain Maker", product: "Acrylic keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "standee", name: "Acrylic Standee Maker", product: "Acrylic standee", hasHardware: false, hasBase: true, exportSvg: false, sizes: [8, 10, 15] },
  { id: "sticker", name: "Sticker Cutline Generator", product: "Die-cut sticker", hasHardware: false, hasBase: false, exportSvg: true, sizes: [5, 7, 10] },
  { id: "magnet", name: "Fridge Magnet Maker", product: "Fridge magnet", hasHardware: false, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "photo-keychain", name: "Photo Keychain Maker", product: "Acrylic photo keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "name-keychain", name: "Name Keychain Maker", product: "Acrylic name keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
  { id: "ornament", name: "Photo Ornament Maker", product: "Photo ornament", hasHardware: true, hasBase: false, exportSvg: true, sizes: [6, 8, 10] },
  { id: "block", name: "Acrylic Photo Block Maker", product: "Acrylic photo block", hasHardware: false, hasBase: false, exportSvg: false, sizes: PHOTO_BLOCK_SIZES.map((size) => size.heightCm), sizeLabels: PHOTO_BLOCK_SIZES.map((size) => size.label) },
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
  const stride = 2 * w + 1;
  const key = (px, py) => py * stride + px;
  const edges = new Map();
  const link = (ax, ay, bx, by) => {
    const ka = key(ax, ay), kb = key(bx, by);
    let la = edges.get(ka); if (!la) { la = []; edges.set(ka, la); }
    let lb = edges.get(kb); if (!lb) { lb = []; edges.set(kb, lb); }
    la.push(kb); lb.push(ka);
  };
  const on = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x]) ? 1 : 0;

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
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
        loop.push([nx / 2, ny / 2]);
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