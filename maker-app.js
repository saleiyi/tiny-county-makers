import {
  getProductProfile,
  normalizeCutlineSmoothing,
  stickerOffsetPixels,
  physicalPixels,
  workDpi,
  alphaToMask,
  traceContours,
  cleanContours,
  simplifyPath,
  smoothPath,
  offsetContours,
  scalePath,
  boundsOfContours,
  contoursToPathD,
  ornamentShapePoints,
  ornamentHole,
  widthAtY,
  photoBlockSize,
  sizeOptionLabel,
  PRINT_DPI,
} from "./assets/maker-core.mjs";

const CANVAS = 900;
const WORK_LONG_SIDE = 620;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const DEFAULT_NAME_FONT = "'Playfair Display', Georgia, serif";

const root = document.querySelector("[data-maker]");
const profile = getProductProfile(root.dataset.maker);
const canvas = document.querySelector("#preview");
const ctx = canvas.getContext("2d");
const upload = document.querySelector("#photo");
const sizeSelect = document.querySelector("#size");
const sizeLabel = document.querySelector("#sizeLabel");
const shapeSelect = document.querySelector("#shape");
const nameInput = document.querySelector("#nameText");
const nameFont = document.querySelector("#nameFont");
const offsetInput = document.querySelector("#offset");
const offsetLabel = document.querySelector("#offsetLabel");
const offsetControl = document.querySelector("#offsetControl");
const smoothingInput = document.querySelector("#smoothing");
const smoothingControl = document.querySelector("#smoothingControl");
const smoothingLabel = document.querySelector("#smoothingLabel");
const dimensions = document.querySelector("#dimensions");
const pngButton = document.querySelector("#pngDownload");
const svgButton = document.querySelector("#svgDownload");
const engravingInput = document.querySelector("#engraving");

let image = null;
let imageDataUrl = "";
let namePhoto = null;
let rawContours = null;
let rawSource = { width: 0, height: 0 };
let scene = null;
let raf = 0;

boot();

function boot() {
  document.querySelector("#productName").textContent = profile.product;
  sizeSelect.innerHTML = profile.sizes
    .map((cm) => '<option value="' + cm + '">' + sizeOptionLabel(profile, cm) + "</option>")
    .join("");
  if (!profile.exportSvg) {
    if (svgButton) svgButton.hidden = true;
    if (offsetControl) offsetControl.hidden = true;
    if (smoothingControl) smoothingControl.hidden = true;
  }
  setDownloadsEnabled(false);
  upload.addEventListener("change", onUpload);
  sizeSelect.addEventListener("change", schedule);
  shapeSelect?.addEventListener("change", schedule);
  if (profile.id === "name-keychain") {
    nameInput?.addEventListener("input", onNameInput);
    nameFont?.addEventListener("change", onNameInput);
    generateNameArtwork();
  }
  offsetInput?.addEventListener("input", schedule);
  smoothingInput?.addEventListener("input", schedule);
  engravingInput?.addEventListener("input", schedule);
  document.querySelector("#sampleArtwork")?.addEventListener("click", loadSample);
  pngButton.addEventListener("click", () => { if (image) exportPng(); });
  svgButton?.addEventListener("click", () => { if (image) exportSvg(); });
  track("page_view", { product: profile.id });
  if (new URLSearchParams(location.search).get("sample") === "1") loadSample();
}

function setDownloadsEnabled(enabled) {
  pngButton.disabled = !enabled;
  if (svgButton) svgButton.disabled = !enabled;
  root.classList.toggle("has-image", enabled);
}

function schedule() {
  if (!image || raf) return;
  raf = requestAnimationFrame(() => { raf = 0; render(); });
}

// ------------------------------------------------------------------ name artwork

let nameTimer = 0;

function onNameInput() {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(generateNameArtwork, 200);
}

async function generateNameArtwork() {
  const text = (nameInput?.value || "").trim().slice(0, 16);
  if (!text) {
    image = null;
    setDownloadsEnabled(false);
    return note("Type a name to see the acrylic keychain shape.");
  }
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (error) { /* fall back to the system face */ }
  const ok = await adoptImage(nameArtworkCanvas(text, nameFont?.value || DEFAULT_NAME_FONT, namePhoto).toDataURL("image/png"));
  if (ok) track("name_rendered", { characters: text.length, photo: !!namePhoto });
}

/**
 * Draws the name as solid artwork with a welded hanging tab on top.
 * The tab keeps the drilled hole on real material for every letter combination,
 * which a hole punched straight into a letter would not.
 */
function nameArtworkCanvas(text, family, photo) {
  const FONT_SIZE = 260;
  const INK = "#1d2420";
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = `700 ${FONT_SIZE}px ${family}`;
  const metrics = probe.measureText(text);
  const textW = Math.max(96, Math.ceil(metrics.width));
  const textH = Math.ceil(FONT_SIZE * 1.06);
  const padX = Math.max(30, Math.round(textW * 0.05));
  const tabH = Math.round(textH * 0.34);
  const W = textW + padX * 2;
  const H = textH + tabH;
  const baseline = tabH + textH / 2 + FONT_SIZE * 0.015;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.clearRect(0, 0, W, H);

  // The welded hanging tab always stays solid ink so the drilled hole sits on real material,
  // whichever letters follow underneath.
  const tabW = Math.max(58, Math.round(Math.min(W * 0.17, textH * 0.36)));
  g.fillStyle = INK;
  g.beginPath();
  roundRect(g, W / 2 - tabW / 2, 0, tabW, tabH + textH * 0.42, tabW * 0.42);
  g.fill();

  if (photo && photo.naturalWidth) {
    // Photo lettering: draw the glyphs on a scratch layer, then clip the photo into them.
    const glyphs = document.createElement("canvas");
    glyphs.width = W;
    glyphs.height = H;
    const gg = glyphs.getContext("2d");
    gg.fillStyle = "#000";
    gg.textAlign = "center";
    gg.textBaseline = "middle";
    gg.font = `700 ${FONT_SIZE}px ${family}`;
    gg.fillText(text, W / 2, baseline);
    gg.globalCompositeOperation = "source-in";
    const cover = Math.max(W / photo.naturalWidth, (textH * 1.45) / photo.naturalHeight);
    const dw = photo.naturalWidth * cover;
    const dh = photo.naturalHeight * cover;
    gg.drawImage(photo, (W - dw) / 2, baseline - dh / 2, dw, dh);
    g.drawImage(glyphs, 0, 0);
  } else {
    g.fillStyle = INK;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `700 ${FONT_SIZE}px ${family}`;
    g.fillText(text, W / 2, baseline);
  }
  return c;
}

// ------------------------------------------------------------------ upload

async function onUpload() {
  const file = upload.files && upload.files[0];
  if (!file) return;
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return note("That file type is not supported. Use PNG, JPG or WEBP.");
  if (file.size > MAX_UPLOAD_BYTES) return note("That image is larger than 12 MB. Please resize it first.");

  if (profile.id === "name-keychain") {
    // Optional photo ink: the letters keep their shape and the photo fills them.
    note("Loading your photo...");
    const nameDataUrl = await fileToDataUrl(file);
    try {
      namePhoto = await loadImage(nameDataUrl);
    } catch (error) {
      namePhoto = null;
      return note("We could not read that photo. Please try another file.");
    }
    track("photo_uploaded", { tool: "name-keychain", width: namePhoto.naturalWidth, height: namePhoto.naturalHeight });
    await generateNameArtwork();
    return;
  }

  note("Loading your image...");
  const dataUrl = await fileToDataUrl(file);
  const ok = await adoptImage(dataUrl);
  if (!ok) return;
  track("photo_uploaded", { width: image.naturalWidth, height: image.naturalHeight });
}

/** Single place where a data URL becomes the active artwork. */
async function adoptImage(dataUrl) {
  try {
    imageDataUrl = dataUrl;
    image = await loadImage(dataUrl);
  } catch (error) {
    image = null;
    setDownloadsEnabled(false);
    note("We could not read that image. Please try another file.");
    return false;
  }
  rawContours = null;
  if (profile.exportSvg) extractContours();
  setDownloadsEnabled(true);
  adoptSource("upload");
  render();
  return true;
}

/** Trace the artwork outline once per upload; parameter changes reuse this cache. */
function extractContours() {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = Math.min(1, WORK_LONG_SIDE / longest);
  const sw = Math.max(2, Math.round(image.naturalWidth * ratio));
  const sh = Math.max(2, Math.round(image.naturalHeight * ratio));
  const work = document.createElement("canvas");
  work.width = sw;
  work.height = sh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(image, 0, 0, sw, sh);
  const pixels = wctx.getImageData(0, 0, sw, sh).data;
  const mask = alphaToMask(pixels, sw, sh, 18);
  const minArea = Math.max(16, sw * sh * 0.000015);
  rawContours = cleanContours(traceContours(mask, sw, sh), minArea, 24);
  rawSource = { width: sw, height: sh };
  if (!rawContours.length) note("This image is fully transparent, so there is nothing to trace. Try a PNG with visible artwork.");
}

// ------------------------------------------------------------------ layout + render

function layout() {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = WORK_LONG_SIDE / longest;
  let w = image.naturalWidth * ratio;
  let h = image.naturalHeight * ratio;
  const longSideCm = Number(sizeSelect.value);
  const shape = profile.id === "photo-keychain"
    ? (shapeSelect?.value || "rounded")
    : profile.id === "ornament"
      ? (shapeSelect?.value || "round")
      : "";
  let topBand = 0;
  let pad = 0;

  if (profile.id === "photo-keychain" && shape !== "rounded") {
    const side = Math.max(w, h);
    w = side;
    h = side;
  }

  if (profile.id === "photo-keychain") {
    topBand = Math.max(46, Math.min(w, h) * 0.13);
    pad = Math.max(14, Math.min(w, h) * 0.075);
    const outerW = w + pad * 2;
    const outerH = h + pad * 2 + topBand;
    const x = (CANVAS - outerW) / 2 + pad;
    const y = (CANVAS - outerH) / 2 + topBand + pad;
    return { x, y, w, h, longSideCm, dpi: workDpi(WORK_LONG_SIDE, longSideCm), shape, topBand, pad };
  }

  if (profile.id === "name-keychain") {
    const nx = (CANVAS - w) / 2;
    const ny = (CANVAS - h) / 2;
    return { x: nx, y: ny, w, h, longSideCm, dpi: workDpi(WORK_LONG_SIDE, longSideCm) };
  }

  if (profile.id === "ornament") {
    // The silhouette decides the box; the photo is cover-fitted into whatever shape it is.
    const w = WORK_LONG_SIDE;
    const h = shape === "oval" ? Math.round(WORK_LONG_SIDE * 0.78) : WORK_LONG_SIDE;
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(Math.max(w, h), longSideCm), shape };
  }

  if (profile.id === "block") {
    // A photo block is sold by its face size, so the product size decides the box and the
    // photo is cover-fitted into the front face instead of setting the shape itself.
    const spec = photoBlockSize(longSideCm);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const depth = Math.round(Math.min(w, h) * 0.075);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 12;
    return { x, y, w, h, longSideCm, dpi: workDpi(h, longSideCm), spec, depth };
  }

  const baseRoom = profile.hasBase ? 76 : 0;
  const x = (CANVAS - w) / 2;
  const y = (CANVAS - h - baseRoom) / 2;
  return {
    x,
    y,
    w,
    h,
    longSideCm,
    dpi: workDpi(WORK_LONG_SIDE, longSideCm),
  };
}

function render() {
  const L = layout();
  ctx.clearRect(0, 0, CANVAS, CANVAS);

  if (profile.id === "sticker") {
    const base = buildStickerContours(L);
    // The border is measured against the artwork's own DPI, not the padded canvas,
    // otherwise a 2 mm border grows into a 3.3 mm one on a shape that floats inside the frame.
    const baseBounds = boundsOfContours(base);
    const artDpi = baseBounds ? Math.max(baseBounds.width, baseBounds.height) / (L.longSideCm / 2.54) : L.dpi;
    const offsetPx = stickerOffsetPixels(Number(offsetInput.value), artDpi);
    const outline = offsetContours(base, offsetPx);
    scene = { kind: "sticker", base, outline, rect: { x: L.x, y: L.y, w: L.w, h: L.h }, image, offsetPx, dpi: artDpi, longSideCm: L.longSideCm };
    drawSticker(ctx, scene, true);
  } else if (profile.id === "photo-keychain") {
    const geometry = photoKeychainGeometry(L);
    scene = {
      kind: "photo-keychain",
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outer: geometry.outer,
      hole: geometry.hole,
      shape: L.shape,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPhotoKeychain(ctx, scene, true);
  } else if (profile.id === "name-keychain") {
    scene = { kind: "name-keychain", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, hole: nameHole(L), image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawNameKeychain(ctx, scene, true);
  } else if (profile.id === "ornament") {
    const outline = ornamentShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = ornamentHole(L.shape, L.w, L.h);
    scene = {
      kind: "ornament",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      text: ornamentText(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawOrnament(ctx, scene, true);
  } else if (profile.id === "block") {
    scene = {
      kind: "block",
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      spec: L.spec,
      depth: L.depth,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawBlock(ctx, scene, true);
  } else if (profile.id === "magnet") {
    scene = { kind: "magnet", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawMagnet(ctx, scene);
  } else {
    scene = { kind: "standee", rect: { x: L.x, y: L.y, w: L.w, h: L.h }, image, dpi: L.dpi, longSideCm: L.longSideCm };
    drawStandee(ctx, scene);
  }
  readout(L);
}

function buildStickerContours(L) {
  if (!rawContours || !rawContours.length) return [];
  const strength = normalizeCutlineSmoothing(smoothingInput?.value);
  const sx = L.w / rawSource.width;
  const sy = L.h / rawSource.height;
  const tolerance = Math.max(0.6, Math.min(L.w, L.h) / 420);
  return rawContours.map((contour) => {
    const simplified = simplifyPath(contour, tolerance);
    const smoothed = smoothPath(simplified, strength);
    return scalePath(smoothed, sx, sy).map(([x, y]) => [x + L.x, y + L.y]);
  });
}

function readout(L) {
  sizeLabel.textContent = profile.id === "block" && scene.spec
    ? scene.spec.id.split("x").join(" x ") + " in"
    : L.longSideCm + " cm";
  if (offsetLabel) offsetLabel.textContent = `${Number(offsetInput.value)} mm`;
  if (smoothingLabel) smoothingLabel.textContent = String(normalizeCutlineSmoothing(smoothingInput?.value));
  if (profile.id === "block") {
    // Photo blocks are bought in inches, so the readout leads with inches and keeps 300 DPI honest.
    const spec = scene.spec;
    const inches = (cm) => round2(cm / 2.54);
    dimensions.textContent = inches(spec.widthCm) + " x " + inches(spec.heightCm)
      + " in acrylic photo block at " + PRINT_DPI + " DPI ("
      + physicalPixels(L.longSideCm, PRINT_DPI) + " px long side) - transparent PNG, no watermark;"
      + " the block edge and drop shadow are a 3D preview only.";
    return;
  }

  const piece = pieceBox();
  const cmPerWorkPx = (exportScale() * 2.54) / PRINT_DPI;
  const exportLong = physicalPixels(L.longSideCm, PRINT_DPI);
  const suffix = profile.id === "sticker"
    ? "the download is the cut shape, offset included"
    : profile.id === "ornament"
      ? "transparent PNG at 300 DPI plus an SVG cut path; the hanging loop is a preview only"
      : profile.id === "photo-keychain"
      ? "transparent PNG at 300 DPI; the keyring is a preview only"
      : profile.id === "name-keychain"
        ? "transparent PNG at 300 DPI; the hanging hole and ring are preview only"
        : "transparent PNG, no watermark";
  dimensions.textContent = `${round2(piece.width * cmPerWorkPx)} x ${round2(piece.height * cmPerWorkPx)} cm finished piece at ${PRINT_DPI} DPI (${exportLong} px long side) - ${suffix}.`;
}

function note(text) {
  dimensions.textContent = text;
}

// ------------------------------------------------------------------ painters

function drawSticker(c, s, guides) {
  if (!s.outline.length) return;
  c.save();
  c.fillStyle = "#ffffff";
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.fill("evenodd");
  c.restore();
  c.drawImage(s.image, s.rect.x, s.rect.y, s.rect.w, s.rect.h);
  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.9)";
    c.beginPath();
    for (const pts of s.base) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

function drawMagnet(c, s) {
  const r = s.rect;
  const pad = Math.max(10, Math.min(r.w, r.h) * 0.055);
  const radius = Math.min(r.w, r.h) * 0.1;
  c.save();
  c.fillStyle = "#ffffff";
  roundRect(c, r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2, radius);
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.14)";
  c.lineWidth = 1.4;
  c.stroke();
  c.restore();
  c.save();
  c.beginPath();
  roundRect(c, r.x, r.y, r.w, r.h, radius * 0.7);
  c.clip();
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  c.restore();
}

/** A solid acrylic block: the photo sits on the front face, with the depth showing right and bottom. */
function drawBlock(c, s, guides) {
  const r = s.rect;
  const d = s.depth;
  const face = { x: r.x, y: r.y, w: r.w - d, h: r.h - d };
  const radius = Math.min(face.w, face.h) * 0.045;

  if (guides) {
    // The contact shadow sells the depth on screen but would only add stray pixels to an export.
    c.save();
    c.shadowColor = "rgba(29,36,32,.3)";
    c.shadowBlur = d * 1.1;
    c.shadowOffsetX = d * 0.16;
    c.shadowOffsetY = d * 0.72;
    c.fillStyle = "#eef3f1";
    roundRect(c, r.x, r.y, r.w, r.h, radius);
    c.fill();
    c.restore();
  }

  // The acrylic body: the exposed strip along the right and bottom is the block's thickness.
  const body = c.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
  body.addColorStop(0, "#fdfefd");
  body.addColorStop(0.42, "#e9f0ed");
  body.addColorStop(1, "#c8d7d2");
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fillStyle = body;
  c.fill();
  c.strokeStyle = "rgba(255,255,255,.95)";
  c.lineWidth = Math.max(1, d * 0.08);
  c.stroke();
  c.restore();

  // The printed face, inset by the depth so the thickness reads as real material.
  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.clip();
  drawCover(c, s.image, face.x, face.y, face.w, face.h);
  c.restore();

  // A glass sheen across the face, then the inner bevel that frames the photo.
  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.clip();
  const sheen = c.createLinearGradient(face.x, face.y + face.h, face.x + face.w, face.y);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.36, "rgba(255,255,255,0)");
  sheen.addColorStop(0.46, "rgba(255,255,255,.22)");
  sheen.addColorStop(0.56, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = sheen;
  c.fillRect(face.x, face.y, face.w, face.h);
  c.restore();

  c.save();
  roundRect(c, face.x, face.y, face.w, face.h, radius * 0.8);
  c.strokeStyle = "rgba(255,255,255,.7)";
  c.lineWidth = Math.max(1, Math.min(face.w, face.h) * 0.009);
  c.stroke();
  c.restore();
}

function photoKeychainGeometry(L) {
  const r = { x: L.x, y: L.y, w: L.w, h: L.h };
  const pad = L.pad || Math.max(14, Math.min(r.w, r.h) * 0.075);
  const topBand = L.topBand || Math.max(46, Math.min(r.w, r.h) * 0.13);
  const outer = { x: r.x - pad, y: r.y - pad - topBand, w: r.w + pad * 2, h: r.h + pad * 2 + topBand };
  const holeR = Math.max(9, Math.min(outer.w, outer.h) * 0.045);
  const hole = { cx: outer.x + outer.w / 2, cy: outer.y + topBand * 0.62, r: holeR };
  return { outer, hole };
}

function drawPhotoKeychain(c, s, guides) {
  const r = s.rect;
  const o = s.outer;
  const h = s.hole;
  const shape = s.shape || "rounded";

  if (guides) {
    const ringRadius = h.r * 1.8;
    c.save();
    c.strokeStyle = "#98a09b";
    c.lineWidth = Math.max(3, h.r * 0.28);
    c.beginPath();
    c.arc(h.cx, h.cy, ringRadius, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  c.save();
  pathForKeychain(c, o.x, o.y, o.w, o.h, shape, Math.min(o.w, o.h) * 0.14);
  c.fillStyle = "#fffdf8";
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.18)";
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();

  c.save();
  if (shape === "circle") {
    c.beginPath();
    c.arc(r.x + r.w / 2, r.y + r.h / 2, Math.min(r.w, r.h) / 2, 0, Math.PI * 2);
    c.clip();
  } else {
    pathForKeychain(c, r.x, r.y, r.w, r.h, shape, Math.min(r.w, r.h) * 0.08);
    c.clip();
  }
  if (shape === "rounded") c.drawImage(s.image, r.x, r.y, r.w, r.h);
  else drawCover(c, s.image, r.x, r.y, r.w, r.h);
  c.restore();

  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(h.cx, h.cy, h.r, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function nameHole(L) {
  // The welded tab sits at the top centre, so its hole is a fixed ratio of the artwork box.
  return { cx: L.x + L.w / 2, cy: L.y + L.h * 0.121, r: Math.max(8, L.h * 0.071) };
}

function drawNameKeychain(c, s, guides) {
  const r = s.rect;
  const h = s.hole;
  const depth = Math.max(3, Math.min(r.w, r.h) * 0.014);

  c.save();
  c.globalAlpha = 0.16;
  c.save();
  c.translate(depth * 1.1, depth * 1.7);
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  c.restore();
  c.restore();

  c.drawImage(s.image, r.x, r.y, r.w, r.h);

  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(h.cx, h.cy, h.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.strokeStyle = "#98a09b";
    c.lineWidth = Math.max(3, h.r * 0.3);
    c.beginPath();
    c.arc(h.cx, h.cy - h.r * 1.15, h.r * 1.75, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }
}

// ------------------------------------------------------------------ ornament

function ornamentText() {
  return (engravingInput?.value || "").trim().slice(0, 24);
}

/** Largest font size (down to 8px) at which `text` still fits `maxWidth`. */
function fitFont(c, text, maxWidth, startSize, family, weight) {
  let size = Math.max(8, startSize);
  for (; size > 8; size -= 1) {
    c.font = `${weight} ${size}px ${family}`;
    if (c.measureText(text).width <= maxWidth) break;
  }
  return size;
}

/**
 * Etched-looking caption. White face plus a soft dark halo so the name stays readable
 * over a dark or a light photo, and survives being printed.
 */
function drawOrnamentEngraving(c, text, x, y, w, h, outline) {
  if (!text) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const size = fitFont(c, text, w * 0.72, Math.min(w, h) * 0.11, family, 800);
  c.save();
  c.font = `800 ${size}px ${family}`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  const textWidth = c.measureText(text).width;
  const margin = Math.max(6, size * 0.45);
  // Start near the base and climb until the silhouette is wide enough to hold the caption,
  // so a heart or star never slices the engraved name in half.
  let baseline = y + h * 0.855;
  if (outline && outline.length) {
    for (let f = 0.855; f >= 0.6; f -= 0.015) {
      const ty = y + h * f;
      const span = widthAtY(outline, ty);
      if (span && span.width >= textWidth + margin * 2) { baseline = ty; break; }
    }
  }
  c.lineJoin = "round";
  c.lineWidth = Math.max(3, size * 0.16);
  c.strokeStyle = "rgba(29,36,32,.45)";
  c.strokeText(text, x + w / 2, baseline);
  c.fillStyle = "#ffffff";
  c.fillText(text, x + w / 2, baseline);
  c.restore();
}

function drawOrnament(c, s, guides) {
  const r = s.rect;
  const hole = s.hole;

  if (guides) {
    c.save();
    c.globalAlpha = 0.18;
    c.filter = "blur(8px)";
    c.fillStyle = "#1d2420";
    c.beginPath();
    addPolygon(c, s.outline.map(([x, y]) => [x + 4, y + 10]));
    c.fill();
    c.restore();
  }

  // Clear acrylic disc with the photo floated behind it.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawOrnamentEngraving(c, s.text, r.x, r.y, r.w, r.h, s.outline);
  c.restore();

  // The hole is punched out, so the exported file can be printed, cut and drilled as-is.
  c.save();
  c.globalCompositeOperation = "destination-out";
  c.beginPath();
  c.arc(hole.cx, hole.cy, hole.r, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (guides) {
    c.save();
    c.beginPath();
    addPolygon(c, s.outline);
    c.strokeStyle = "rgba(255,255,255,.8)";
    c.lineWidth = 6;
    c.stroke();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = 1.6;
    c.stroke();
    c.restore();
    drawHanger(c, hole);
  }
}

/** Preview-only ribbon loop, so the mockup reads as a hanging ornament. */
function drawHanger(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(3, r * 0.3);
  c.strokeStyle = "#c0472f";
  c.beginPath();
  c.arc(hole.cx, hole.cy - r * 1.9, r * 1.7, Math.PI * 1.12, Math.PI * 1.88);
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.45)";
  c.lineWidth = Math.max(1, r * 0.09);
  c.stroke();
  c.restore();
}

function pathForKeychain(c, x, y, w, h, shape, radius) {
  if (shape === "circle") {
    c.beginPath();
    c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    return;
  }
  roundRect(c, x, y, w, h, radius || Math.min(w, h) * 0.12);
}

function drawCover(c, img, x, y, w, h) {
  const sourceRatio = img.naturalWidth / img.naturalHeight;
  const destRatio = w / h;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (sourceRatio > destRatio) {
    sw = sh * destRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / destRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawStandee(c, s) {
  const r = s.rect;
  const margin = 9;
  c.save();
  c.fillStyle = "rgba(29,36,32,.15)";
  roundRect(c, r.x - margin, r.y - margin, r.w + margin * 2, r.h + margin * 2, 14);
  c.fill();
  c.restore();
  c.drawImage(s.image, r.x, r.y, r.w, r.h);
  const baseH = Math.max(28, r.h * 0.14);
  const baseW = r.w * 0.74;
  const baseX = r.x + (r.w - baseW) / 2;
  const baseY = r.y + r.h + 13;
  const gradient = c.createLinearGradient(baseX, baseY, baseX, baseY + baseH);
  gradient.addColorStop(0, "#f6e9d4");
  gradient.addColorStop(1, "#d6bd97");
  c.save();
  c.fillStyle = gradient;
  roundRect(c, baseX, baseY, baseW, baseH, 9);
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

function addPolygon(c, points) {
  c.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
  c.closePath();
}

function roundRect(c, x, y, w, h, radius) {
  c.beginPath();
  if (typeof c.roundRect === "function") c.roundRect(x, y, w, h, radius);
  else c.rect(x, y, w, h);
}

// ------------------------------------------------------------------ export

function sceneBox() {
  if (scene.kind === "sticker") {
    const b = boundsOfContours(scene.outline) || boundsOfContours(scene.base);
    if (!b) return null;
    const pad = 2;
    return { x: b.minX - pad, y: b.minY - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
  }
  if (scene.kind === "photo-keychain") {
    const o = scene.outer;
    const pad = 2;
    return { x: o.x - pad, y: o.y - pad, width: o.w + pad * 2, height: o.h + pad * 2 };
  }
  if (scene.kind === "name-keychain") {
    // The name artwork already contains its own hanging tab and drill hole, so the export
    // canvas is exactly the finished piece: 300 DPI long side with no hidden padding.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  if (scene.kind === "ornament") {
    // The silhouette fills its box exactly, so the export canvas is the finished piece.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  if (scene.kind === "block") {
    // The export is exactly the finished block: no preview shadow, no hidden padding.
    const r = scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  }
  const r = scene.rect;
  if (scene.kind === "magnet") {
    const pad = Math.max(10, Math.min(r.w, r.h) * 0.055) + 2;
    return { x: r.x - pad, y: r.y - pad, width: r.w + pad * 2, height: r.h + pad * 2 };
  }
  const baseH = Math.max(28, r.h * 0.14);
  const top = r.y - 16;
  const bottom = r.y + r.h + 13 + baseH + 16;
  return { x: r.x - 20, y: top, width: r.w + 40, height: bottom - top };
}

function renderScene(scale) {
  const box = sceneBox();
  if (!box) return null;
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(box.width * scale));
  out.height = Math.max(1, Math.round(box.height * scale));
  const c = out.getContext("2d");
  c.scale(scale, scale);
  c.translate(-box.x, -box.y);
  if (scene.kind === "sticker") drawSticker(c, scene, false);
  else if (scene.kind === "photo-keychain") drawPhotoKeychain(c, scene, false);
  else if (scene.kind === "name-keychain") drawNameKeychain(c, scene, false);
  else if (scene.kind === "magnet") drawMagnet(c, scene);
  else if (scene.kind === "ornament") drawOrnament(c, scene, false);
  else if (scene.kind === "block") drawBlock(c, scene, false);
  else drawStandee(c, scene);
  return { canvas: out, box };
}

/**
 * The printable outline of the finished object, in work pixels. It is deliberately not the
 * 620 px artboard: a die-cut star inside a square frame is only as wide as the star.
 */
function pieceBox() {
  if (scene.kind === "sticker") {
    const b = boundsOfContours(scene.outline) || boundsOfContours(scene.base);
    return b ? { width: b.width, height: b.height, x: b.minX, y: b.minY } : { width: WORK_LONG_SIDE, height: WORK_LONG_SIDE, x: 0, y: 0 };
  }
  if (scene.kind === "photo-keychain") {
    const o = scene.outer;
    return { width: o.w, height: o.h, x: o.x, y: o.y };
  }
  if (scene.kind === "name-keychain") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  if (scene.kind === "ornament") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  if (scene.kind === "block") {
    const r = scene.rect;
    return { width: r.w, height: r.h, x: r.x, y: r.y };
  }
  const r = scene.rect;
  if (scene.kind === "magnet") {
    const pad = Math.max(10, Math.min(r.w, r.h) * 0.055);
    return { width: r.w + pad * 2, height: r.h + pad * 2, x: r.x - pad, y: r.y - pad };
  }
  return { width: r.w, height: r.h, x: r.x, y: r.y };
}

/** Scale that puts the finished piece, not the artboard, on the selected physical size. */
function exportScale() {
  const piece = pieceBox();
  return physicalPixels(scene.longSideCm, PRINT_DPI) / Math.max(piece.width, piece.height);
}

/** Download name: photo blocks read as inches, everything else as a long side in cm. */
function exportName(extension) {
  const stem = scene.kind === "block"
    ? scene.spec.id + "in-" + profile.id
    : profile.id + "-" + scene.longSideCm + "cm";
  return stem + "-" + PRINT_DPI + "dpi." + extension;
}

function exportPng() {
  const rendered = renderScene(exportScale());
  if (!rendered) return note("Upload an image with visible artwork first.");
  const name = exportName("png");
  download(rendered.canvas.toDataURL("image/png"), name);
  track("design_downloaded", { format: "png", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

function exportSvg() {
  if (scene.kind === "ornament") return exportOrnamentSvg();
  if (scene.kind !== "sticker") return;
  const scale = exportScale();
  const box = sceneBox();
  if (!box || !scene.base.length) return note("Upload an image with visible artwork first.");
  const tx = (points) => points.map(([x, y]) => [(x - box.x) * scale, (y - box.y) * scale]);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const r = scene.rect;
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  art.getContext("2d").drawImage(scene.image, 0, 0, art.width, art.height);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm long side, ${PRINT_DPI} DPI</title>`,
    `<g id="Sticker">`,
    `<path id="WhiteBorder" d="${contoursToPathD(scene.outline.map(tx), 2)}" fill="#ffffff" fill-rule="evenodd"/>`,
    `<image id="Artwork" x="${(r.x - box.x) * scale}" y="${(r.y - box.y) * scale}" width="${art.width}" height="${art.height}" href="${art.toDataURL("image/png")}"/>`,
    `<path id="Cutline" d="${contoursToPathD(scene.base.map(tx), 2)}" fill="none" stroke="#ff00ff" stroke-width="1" stroke-dasharray="6 4"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/** Cut path plus a printable artwork layer, the same split the sticker tool ships. */
function exportOrnamentSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box) return note("Add a photo before exporting.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const shape = contoursToPathD([scene.outline.map(tx)], 2);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const localOutline = scene.outline.map(([px, py]) => [(px - box.x) * scale, (py - box.y) * scale]);
  drawOrnamentEngraving(ax, scene.text, 0, 0, art.width, art.height, localOutline);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm long side, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="OrnamentShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#OrnamentShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `<circle cx="${round2((scene.hole.cx - box.x) * scale)}" cy="${round2((scene.hole.cy - box.y) * scale)}" r="${round2(scene.hole.r * scale)}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

// ------------------------------------------------------------------ sample artwork

function sampleArtwork() {
  if (profile.id === "photo-keychain" || profile.id === "block") return photoSampleArtwork();
  if (profile.id === "ornament") return ornamentSampleArtwork();
  if (profile.id === "name-keychain") return nameArtworkCanvas((nameInput?.value || "").trim() || "Tiny", nameFont?.value || "'Playfair Display', Georgia, serif");
  const c = document.createElement("canvas");
  c.width = 600;
  c.height = 600;
  const x = c.getContext("2d");
  x.translate(300, 300);
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 ? 150 : 280;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i) x.lineTo(px, py); else x.moveTo(px, py);
  }
  x.closePath();
  const gradient = x.createLinearGradient(-280, -280, 280, 280);
  gradient.addColorStop(0, "#ef694c");
  gradient.addColorStop(1, "#4c8fef");
  x.fillStyle = gradient;
  x.fill();
  x.beginPath();
  x.arc(0, 0, 120, 0, Math.PI * 2);
  x.fillStyle = "#fffdf8";
  x.fill();
  x.fillStyle = "#1d2420";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = "800 92px Inter, Segoe UI, sans-serif";
  x.fillText("TC", 0, 6);
  return c;
}

/** A warm Christmas-night scene, so the tool is worth trying before any upload. */
function ornamentSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 900;
  c.height = 900;
  const x = c.getContext("2d");
  const sky = x.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#152a3d");
  sky.addColorStop(0.55, "#2f5f6f");
  sky.addColorStop(1, "#e6a866");
  x.fillStyle = sky;
  x.fillRect(0, 0, 900, 900);

  x.fillStyle = "rgba(255,255,255,.9)";
  x.beginPath();
  x.arc(690, 190, 66, 0, Math.PI * 2);
  x.fill();

  for (let i = 0; i < 90; i++) {
    const sx = (i * 137.508) % 900;
    const sy = ((i * 271.3) % 640);
    const sr = 1.5 + ((i * 7) % 5);
    x.fillStyle = `rgba(255,255,255,${0.35 + ((i % 5) / 10)})`;
    x.beginPath();
    x.arc(sx, sy, sr, 0, Math.PI * 2);
    x.fill();
  }

  x.fillStyle = "#2f5d43";
  x.beginPath();
  x.moveTo(450, 300);
  x.lineTo(360, 520);
  x.lineTo(540, 520);
  x.closePath();
  x.fill();
  x.beginPath();
  x.moveTo(450, 430);
  x.lineTo(330, 640);
  x.lineTo(570, 640);
  x.closePath();
  x.fill();
  x.beginPath();
  x.moveTo(450, 570);
  x.lineTo(300, 760);
  x.lineTo(600, 760);
  x.closePath();
  x.fill();
  x.fillStyle = "#6b4a2c";
  x.fillRect(432, 750, 36, 60);

  x.fillStyle = "rgba(255,255,255,.95)";
  x.beginPath();
  x.moveTo(0, 780);
  x.quadraticCurveTo(450, 700, 900, 780);
  x.lineTo(900, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();

  x.fillStyle = "rgba(29,36,32,.42)";
  x.font = "800 34px Inter, Segoe UI, sans-serif";
  x.textAlign = "center";
  x.fillText("SAMPLE PHOTO", 450, 862);
  return c;
}

function photoSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 720;
  c.height = 900;
  const x = c.getContext("2d");
  const sky = x.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, "#9bc9e8");
  sky.addColorStop(0.55, "#f3d6a7");
  sky.addColorStop(1, "#d98c68");
  x.fillStyle = sky;
  x.fillRect(0, 0, 720, 900);
  x.fillStyle = "rgba(255,255,255,.78)";
  x.beginPath();
  x.arc(540, 170, 62, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = "#7898a8";
  x.beginPath();
  x.moveTo(0, 640);
  x.lineTo(190, 390);
  x.lineTo(340, 600);
  x.lineTo(475, 430);
  x.lineTo(720, 690);
  x.lineTo(720, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();
  x.fillStyle = "#425f68";
  x.beginPath();
  x.moveTo(0, 760);
  x.lineTo(210, 570);
  x.lineTo(390, 745);
  x.lineTo(580, 555);
  x.lineTo(720, 680);
  x.lineTo(720, 900);
  x.lineTo(0, 900);
  x.closePath();
  x.fill();
  x.fillStyle = "rgba(255,255,255,.75)";
  x.font = "700 34px Inter, Segoe UI, sans-serif";
  x.textAlign = "center";
  x.fillText("SAMPLE PHOTO", 360, 845);
  return c;
}

async function loadSample() {
  note("Loading a sample image so you can try the tool...");
  const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
  if (!ok) return note("The sample could not load. Please upload an image instead.");
  adoptSource("sample");
  track("sample_loaded", { product: profile.id });
}

function adoptSource(label) {
  const badge = document.querySelector("#sourceBadge");
  if (badge) badge.textContent = label === "sample" ? "Sample image - replace with your own file anytime" : "";
}

// ------------------------------------------------------------------ helpers

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const value = new Image();
    value.onload = () => resolve(value);
    value.onerror = reject;
    value.src = src;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function download(href, name) {
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadBlob(text, name, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  download(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function track(event, metadata = {}) {
  const endpoint = window.TCM_CONFIG?.analyticsEndpoint;
  if (!endpoint || !location.hostname.endsWith("github.io") || navigator.doNotTrack === "1") return;
  const sessionId = sessionStorage.getItem("tcm-analytics-session") || crypto.randomUUID().replaceAll("-", "");
  sessionStorage.setItem("tcm-analytics-session", sessionId);
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    body: JSON.stringify({
      event,
      sessionId,
      pagePath: location.pathname,
      deviceType: /Mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
      metadata: { product: profile.id, ...metadata },
    }),
  }).catch(() => {});
}