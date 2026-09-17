import {
  getProductProfile,
  normalizeCutlineSmoothing,
  stickerOffsetPixels,
  physicalPixels,
  workDpi,
  alphaToMask,
  stripFlatBackground,
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
  luggageTagShapePoints,
  luggageTagHole,
  petTagShapePoints,
  bookmarkShapePoints,
  bookmarkHole,
  coasterShapePoints,
  jigsawCutPaths,
  stickerBorderWidth,
  stickerBorderHex,
  STICKER_BORDER_PRESETS,
  photoStripSize,
  photoStripCount,
  photoStripPaperHex,
  tableNumberSize,
  tableNumberShape,
  tableNumberPaperHex,
  placeCardSheet,
  placeCardStyle,
  placeCardPaperHex,
  placeCardGrid,
  placeCardGuests,
  PLACE_CARD_LIMIT,
  polaroidFrame,
  polaroidGrid,
  polaroidPaperHex,
  polaroidFinish,
  polaroidSheet,
  cupcakeTopper,
  cupcakeShape,
  cupcakeSheet,
  cupcakePaperHex,
  cupcakeGrid,
  readableInk,
  jigsawGrid,
  polylineToPathD,
  deskNamePlatePoints,
  deskNamePlateSize,
  isNamePlateFinish,
  widthAtY,
  cakeTopperBarRect,
  cakeTopperPlaque,
  isCakeTopperStyle,
  photoBlockSize,
  sizeOptionLabel,
  PRINT_DPI,
} from "./assets/maker-core.mjs";

const CANVAS = 900;
const WORK_LONG_SIDE = 620;
const LIFT_LONG_SIDE = 2400;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const DEFAULT_NAME_FONT = "'Playfair Display', Georgia, serif";
const DEFAULT_TOPPER_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const TOPPER_MAX_CHARS = 24;
const TOPPER_INK = "#1d2420";
const DEFAULT_STRIP_FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";
const STRIP_MAX_PHOTOS = 4;
const DEFAULT_TABLE_NUMBER_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const DEFAULT_PLACE_CARD_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const DEFAULT_POLAROID_FONT = "'Brush Script MT', 'Segoe Script', cursive";
const DEFAULT_CUPCAKE_FONT = "'Playfair Display', Georgia, 'Times New Roman', serif";
const CUPCAKE_MAX_CHARS = 40;

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
const contactInput = document.querySelector("#contact");
const topperText = document.querySelector("#topperText");
const topperFont = document.querySelector("#topperFont");
const topperStyle = document.querySelector("#topperStyle");
const plateName = document.querySelector("#plaqueName");
const plateTitle = document.querySelector("#plaqueTitle");
const plateCompany = document.querySelector("#plaqueCompany");
const finishSelect = document.querySelector("#finish");
const borderColorInput = document.querySelector("#borderColor");
const stripCountSelect = document.querySelector("#stripCount");
const stripCaptionInput = document.querySelector("#stripCaption");
const stripFontSelect = document.querySelector("#stripFont");
const stripPaperInput = document.querySelector("#stripPaper");
const stripClearButton = document.querySelector("#stripClear");
const tableNumberText = document.querySelector("#tableNumber");
const tableNumberNames = document.querySelector("#tableName");
const tableNumberFont = document.querySelector("#tableFont");
const tableNumberPaper = document.querySelector("#tablePaper");
const tableNumberClear = document.querySelector("#tableClear");
const placeCardList = document.querySelector("#placeList");
const placeCardFont = document.querySelector("#placeFont");
const placeCardPaper = document.querySelector("#placePaper");
const placeCardPager = document.querySelector("#placePager");
const placeCardPagePrev = document.querySelector("#placePagePrev");
const placeCardPageNext = document.querySelector("#placePageNext");
const placeCardPageLabel = document.querySelector("#placePageLabel");
const polaroidCaption = document.querySelector("#polaroidCaption");
const polaroidFontSelect = document.querySelector("#polaroidFont");
const polaroidPaper = document.querySelector("#polaroidPaper");
const polaroidFinishSelect = document.querySelector("#polaroidFinish");
const cupcakeText = document.querySelector("#cupcakeText");
const cupcakeFontSelect = document.querySelector("#cupcakeFont");
const cupcakePaper = document.querySelector("#cupcakePaper");
const cupcakeSheetSelect = document.querySelector("#cupcakeSheet");

let image = null;
let imageDataUrl = "";
let namePhoto = null;
let topperPhoto = null;
let plateLogo = null;
let stripPhotos = [];
let tablePhoto = null;
let placeCardPage = 0;
// A polaroid can be downloaded as a blank film frame, so the upload lives beside the shared
// artwork slot instead of replacing the placeholder the shared export path expects.
let polaroidPhoto = null;
// A cupcake topper can be printed blank, so the upload lives beside the placeholder artwork.
let cupcakePhoto = null;
let rawContours = null;
let backgroundLifted = false;
let liftedCanvas = null;
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
  upload?.addEventListener("change", onUpload);
  sizeSelect.addEventListener("change", schedule);
  shapeSelect?.addEventListener("change", schedule);
  if (profile.id === "name-keychain") {
    nameInput?.addEventListener("input", onNameInput);
    nameFont?.addEventListener("change", onNameInput);
    generateNameArtwork();
  }
  if (profile.id === "cake-topper") {
    topperText?.addEventListener("input", onTopperInput);
    topperFont?.addEventListener("change", onTopperInput);
    topperStyle?.addEventListener("change", onTopperInput);
    generateTopperArtwork();
  }
  if (profile.id === "name-plate") {
    [plateName, plateTitle, plateCompany].forEach((input) => input?.addEventListener("input", schedule));
    finishSelect?.addEventListener("change", schedule);
    // The plate is built from type plus an optional logo, so finished artwork exists the
    // moment the page opens and the downloads never have to wait for an upload.
    image = namePlateBlank();
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "photo-strip") {
    stripCountSelect?.addEventListener("change", schedule);
    stripCaptionInput?.addEventListener("input", schedule);
    stripFontSelect?.addEventListener("change", schedule);
    stripPaperInput?.addEventListener("input", schedule);
    stripClearButton?.addEventListener("click", clearStripPhotos);
    // A strip is laid out from the product size rather than from an upload, so a blank canvas
    // stands in for the artwork and the shared preview and download plumbing keeps working.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "table-number") {
    tableNumberText?.addEventListener("input", schedule);
    tableNumberNames?.addEventListener("input", schedule);
    tableNumberFont?.addEventListener("change", schedule);
    tableNumberPaper?.addEventListener("input", schedule);
    tableNumberClear?.addEventListener("click", clearTableNumberPhoto);
    // The card is typed rather than uploaded, so a blank canvas stands in for the artwork and
    // the shared preview and download plumbing works before any photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "place-card") {
    placeCardList?.addEventListener("input", () => { placeCardPage = 0; schedule(); });
    placeCardFont?.addEventListener("change", schedule);
    placeCardPaper?.addEventListener("input", schedule);
    placeCardPagePrev?.addEventListener("click", () => { placeCardPage -= 1; render(); });
    placeCardPageNext?.addEventListener("click", () => { placeCardPage += 1; render(); });
    // A place card is typed rather than uploaded, so a blank canvas stands in for the artwork and
    // the shared preview and download plumbing works before a single name is typed.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "polaroid") {
    polaroidCaption?.addEventListener("input", schedule);
    polaroidFontSelect?.addEventListener("change", schedule);
    polaroidPaper?.addEventListener("input", schedule);
    polaroidFinishSelect?.addEventListener("change", schedule);
    // The film frame is a fixed shape, so a blank placeholder stands in for the artwork and the
    // shared preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  if (profile.id === "cupcake") {
    cupcakeText?.addEventListener("input", () => schedule());
    cupcakeFontSelect?.addEventListener("change", schedule);
    cupcakePaper?.addEventListener("input", schedule);
    cupcakeSheetSelect?.addEventListener("change", schedule);
    // A topper is cut from card stock, so a blank placeholder stands in for the artwork and
    // the shared preview and download plumbing works before a single photo is added.
    image = document.createElement("canvas");
    image.width = WORK_LONG_SIDE;
    image.height = WORK_LONG_SIDE;
    setDownloadsEnabled(true);
    render();
    document.fonts?.ready?.then?.(() => schedule());
  }
  offsetInput?.addEventListener("input", schedule);
  borderColorInput?.addEventListener("input", schedule);
  wireHexPresets(borderColorInput, "#borderPresets", "data-border", schedule);
  wireHexPresets(stripPaperInput, "#stripPaperPresets", "data-paper", schedule);
  wireHexPresets(tableNumberPaper, "#tableNumberPaperPresets", "data-paper", schedule);
  wireHexPresets(placeCardPaper, "#placePaperPresets", "data-paper", schedule);
  wireHexPresets(polaroidPaper, "#polaroidPaperPresets", "data-paper", schedule);
  wireHexPresets(cupcakePaper, "#cupcakePaperPresets", "data-paper", schedule);
  smoothingInput?.addEventListener("input", schedule);
  engravingInput?.addEventListener("input", schedule);
  contactInput?.addEventListener("input", schedule);
  document.querySelector("#sampleArtwork")?.addEventListener("click", loadSample);
  pngButton.addEventListener("click", () => { if (image) exportPng(); });
  svgButton?.addEventListener("click", () => { if (image) exportSvg(); });
  track("page_view", { product: profile.id });
  if (new URLSearchParams(location.search).get("sample") === "1") loadSample();
}

/**
 * The one-shot colour buttons shared by the sticker border and the strip paper. A click fills
 * the real colour input, so the swatch and the picker can never disagree about the value.
 */
function wireHexPresets(input, containerSelector, attribute, onChange) {
  const buttons = document.querySelectorAll(containerSelector + " button[" + attribute + "]");
  if (!buttons.length) return;
  const sync = () => {
    const current = String((input && input.value) || "").toLowerCase();
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", button.getAttribute(attribute).toLowerCase() === current ? "true" : "false");
    });
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!input) return;
      input.value = button.getAttribute(attribute);
      sync();
      onChange();
    });
  });
  input?.addEventListener("input", sync);
  sync();
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

// ------------------------------------------------------------------ cake topper artwork

let topperTimer = 0;

/** The selected lettering style, falling back to the safest cut shape. */
function topperStyleName() {
  const value = topperStyle?.value;
  return isCakeTopperStyle(value) ? value : "cutout";
}

function topperTextValue() {
  return (topperText?.value || "").trim().slice(0, TOPPER_MAX_CHARS);
}

function onTopperInput() {
  clearTimeout(topperTimer);
  topperTimer = setTimeout(generateTopperArtwork, 180);
}

async function generateTopperArtwork() {
  const text = topperTextValue();
  if (!text) {
    image = null;
    setDownloadsEnabled(false);
    return note("Type a name or a short message to see the acrylic cake topper shape.");
  }
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (error) { /* fall back to the installed face */ }
  const ok = await adoptImage(topperArtworkCanvas(text, topperFont?.value || DEFAULT_TOPPER_FONT, topperStyleName()).toDataURL("image/png"));
  if (ok) track("topper_rendered", { characters: text.length, style: topperStyleName() });
}

/**
 * The ink the cut path is traced from. Three shapes are sold:
 *   cutout - bare letters, best for a single word in a connected face;
 *   bar    - letters welded onto one horizontal band, so "Happy Birthday" ships as one piece;
 *   plaque - a solid disc with the wording cut through it as a stencil.
 * The offered faces deliberately avoid very heavy display fonts such as Arial Black or
 * Impact, whose tight counters trace into unreadable slivers at cutting size.
 */
function topperArtworkCanvas(text, family, style) {
  const SIZE = 340;
  const WEIGHT = 700;
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = WEIGHT + " " + SIZE + "px " + family;
  const metrics = probe.measureText(text);
  const ascent = Math.max(1, metrics.actualBoundingBoxAscent || SIZE * 0.74);
  const descent = Math.max(0, metrics.actualBoundingBoxDescent || SIZE * 0.2);
  const textW = Math.max(60, Math.ceil(metrics.width));

  if (style === "plaque") {
    // A round plaque is sized from the wording so a short name and a long message both keep
    // a readable margin between the letters and the outside edge.
    const size = Math.round(Math.max(textW * 1.75, (ascent + descent) * 2.6, 720));
    const disc = document.createElement("canvas");
    disc.width = size;
    disc.height = size;
    const d = disc.getContext("2d");
    const plaque = cakeTopperPlaque(size, size);
    d.fillStyle = TOPPER_INK;
    d.beginPath();
    d.arc(plaque.cx, plaque.cy, plaque.r, 0, Math.PI * 2);
    d.fill();
    // Punching the wording out of the disc leaves a stencil that still cuts as one piece.
    d.globalCompositeOperation = "destination-out";
    d.textAlign = "center";
    d.textBaseline = "middle";
    const inner = fitFont(d, text, plaque.r * 1.3, plaque.r * 0.6, family, WEIGHT);
    d.font = WEIGHT + " " + inner + "px " + family;
    d.fillText(text, plaque.cx, plaque.cy);
    d.globalCompositeOperation = "source-over";
    return disc;
  }

  const padX = Math.max(28, Math.round(textW * 0.06));
  const padTop = Math.round((ascent + descent) * 0.12);
  const baseline = padTop + ascent;
  const width = textW + padX * 2;
  const bar = style === "bar" ? cakeTopperBarRect(width, baseline, ascent, descent) : null;
  const inkBottom = bar ? bar.y + bar.h : baseline + descent;
  const height = Math.ceil(inkBottom + Math.round((ascent + descent) * 0.08));

  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const g = c.getContext("2d");
  g.fillStyle = TOPPER_INK;
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.font = WEIGHT + " " + SIZE + "px " + family;
  if (bar) g.fillRect(bar.x, bar.y, bar.w, bar.h);
  g.fillText(text, width / 2, baseline);
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

  if (profile.id === "cake-topper") {
    // A photo is optional ink: it fills the letters, the welding bar or the round plaque.
    note("Loading your photo...");
    const topperDataUrl = await fileToDataUrl(file);
    try {
      topperPhoto = await loadImage(topperDataUrl);
    } catch (error) {
      topperPhoto = null;
      return note("We could not read that photo. Please try another file.");
    }
    track("photo_uploaded", { tool: "cake-topper", width: topperPhoto.naturalWidth, height: topperPhoto.naturalHeight });
    await generateTopperArtwork();
    return;
  }
  if (profile.id === "name-plate") {
    // The upload is the optional logo mark, not the plate itself; the plate keeps its type.
    note("Loading your logo...");
    const logoDataUrl = await fileToDataUrl(file);
    try {
      plateLogo = await loadImage(logoDataUrl);
    } catch (error) {
      plateLogo = null;
      return note("We could not read that image. Please try another file.");
    }
    track("photo_uploaded", { tool: "name-plate", width: plateLogo.naturalWidth, height: plateLogo.naturalHeight });
    render();
    return;
  }

  if (profile.id === "photo-strip") {
    // A strip takes a small set of photos instead of one, so every file is read and the first
    // four become the frames. Uploading again adds to the strip rather than replacing it.
    const files = Array.from(upload.files || []).filter((entry) => /^image\/(png|jpeg|webp)$/.test(entry.type));
    if (!files.length) return note("Use PNG, JPG or WebP photos.");
    note("Loading your photos...");
    for (const entry of files) {
      if (stripPhotos.length >= STRIP_MAX_PHOTOS) break;
      if (entry.size > MAX_UPLOAD_BYTES) continue;
      try {
        stripPhotos.push(await loadImage(await fileToDataUrl(entry)));
      } catch (error) {
        // One unreadable file must not throw away the photos that did load.
      }
    }
    if (!stripPhotos.length) return note("We could not read those photos. Please try another set.");
    setDownloadsEnabled(true);
    adoptSource("upload");
    render();
    track("photo_uploaded", { tool: "photo-strip", photos: stripPhotos.length });
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
    if (profile.id === "table-number") tablePhoto = null;
    if (profile.id === "cupcake") cupcakePhoto = null;
    setDownloadsEnabled(false);
    note("We could not read that image. Please try another file.");
    return false;
  }
  // A polaroid can be downloaded blank, so the photo is kept beside the placeholder artwork.
  if (profile.id === "polaroid") polaroidPhoto = image;
  // A cupcake topper can be printed blank, so the photo is kept beside the placeholder artwork.
  if (profile.id === "cupcake") cupcakePhoto = image;
  // A table number keeps its photo beside the typed number, so it is remembered here rather
  // than read back off the shared artwork slot.
  if (profile.id === "table-number") tablePhoto = image;
  rawContours = null;
  backgroundLifted = false;
  liftedCanvas = null;
  // Only the cutline tool traces the picture itself, so only it re-keys a flat backdrop.
  if (profile.id === "sticker" || profile.id === "sticker-outline") liftFlatArtwork();
  // Only the two tools whose cut line follows the picture itself trace contours.
  if (profile.id === "sticker" || profile.id === "sticker-outline" || profile.id === "cake-topper") extractContours();
  setDownloadsEnabled(true);
  adoptSource("upload");
  render();
  return true;
}

/**
 * A JPEG carries no transparency, so an opaque upload would trace back as one big rectangle.
 * When the picture is fully opaque and framed by an even backdrop, that backdrop is lifted out
 * first: the tracer then has a real silhouette to follow, and because the painter draws this
 * lifted canvas the downloaded white border is not painted over by the photo's own background.
 * A busy border is left alone, and the work is capped so a phone photo stays quick.
 */
function liftFlatArtwork() {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = Math.min(1, LIFT_LONG_SIDE / longest);
  const lw = Math.max(2, Math.round(image.naturalWidth * ratio));
  const lh = Math.max(2, Math.round(image.naturalHeight * ratio));
  const work = document.createElement("canvas");
  work.width = lw;
  work.height = lh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(image, 0, 0, lw, lh);
  const pixels = wctx.getImageData(0, 0, lw, lh).data;
  let opaque = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 18) opaque++;
  if (opaque < lw * lh * 0.96) return;
  const stripped = stripFlatBackground(pixels, lw, lh);
  if (!stripped.applied) return;
  wctx.putImageData(new ImageData(stripped.pixels, lw, lh), 0, 0);
  liftedCanvas = work;
  backgroundLifted = true;
}

/** The picture the tracer and the sticker painter should work from. */
function artworkSource() {
  return liftedCanvas || image;
}

/** Trace the artwork outline once per upload; parameter changes reuse this cache. */
function extractContours() {
  // Lettering traces into a cleaner cut line than a photo outline does, so the topper tool
  // works at a finer resolution and scales the finished path back down for the preview.
  const traceLongSide = profile.id === "cake-topper" ? 1400 : WORK_LONG_SIDE;
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = Math.min(1, traceLongSide / longest);
  const sw = Math.max(2, Math.round(image.naturalWidth * ratio));
  const sh = Math.max(2, Math.round(image.naturalHeight * ratio));
  const work = document.createElement("canvas");
  work.width = sw;
  work.height = sh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(artworkSource(), 0, 0, sw, sh);
  const pixels = wctx.getImageData(0, 0, sw, sh).data;
  const mask = alphaToMask(pixels, sw, sh, 18);
  const minArea = Math.max(16, sw * sh * 0.000015);
  const maxContours = profile.id === "cake-topper" ? 80 : 24;
  rawContours = cleanContours(traceContours(mask, sw, sh), minArea, maxContours);
  rawSource = { width: sw, height: sh };
  if (!rawContours.length) note("This image is fully transparent, so there is nothing to trace. Try a PNG with visible artwork.");
}

// ------------------------------------------------------------------ layout + render

function layout() {
  if (profile.id === "polaroid") {
    // A polaroid is bought as film, so the frame decides the shape of the box and the sheet
    // only decides how many of them are tiled onto one printable page.
    const frame = polaroidFrame(sizeSelect.value);
    const sheet = polaroidSheet(shapeSelect?.value);
    const spec = sheet || frame;
    const longCm = Math.max(spec.widthCm, spec.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(spec.widthCm * scale);
    const h = Math.round(spec.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), frame, sheet };
  }
  if (profile.id === "cupcake") {
    // A topper is cut from card stock, so the disc decides the box and the sheet only decides
    // how many of them are tiled onto one printable page.
    const topper = cupcakeTopper(sizeSelect.value);
    const sheet = cupcakeSheet(cupcakeSheetSelect?.value);
    const spec = sheet || topper;
    const longCm = Math.max(spec.widthCm, spec.heightCm);
    const scale = WORK_LONG_SIDE / longCm;
    const w = Math.round(spec.widthCm * scale);
    const h = Math.round(spec.heightCm * scale);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: longCm, dpi: workDpi(WORK_LONG_SIDE, longCm), topper, sheet };
  }
  if (profile.id === "photo-strip") {
    // A strip is a fixed 2 in wide column of photos, so the product size decides the box
    // instead of the uploads. The scene carries the strip height as its print long side.
    const spec = photoStripSize(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec };
  }
  if (profile.id === "table-number") {
    // A table number is sold as a print size, so the card decides the box instead of an upload
    // and the number and the optional photo simply follow the stock.
    const spec = tableNumberSize(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec, shape: tableNumberShape(shapeSelect?.value) };
  }
  if (profile.id === "place-card") {
    // A place card is sold as a sheet the couple prints themselves, so the paper decides the box
    // and the card grid is worked out from the sheet and the chosen card style.
    const spec = placeCardSheet(sizeSelect.value);
    const h = WORK_LONG_SIDE;
    const w = Math.round(h * (spec.widthCm / spec.heightCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm: spec.heightCm, dpi: workDpi(h, spec.heightCm), spec };
  }
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = WORK_LONG_SIDE / longest;
  let w = image.naturalWidth * ratio;
  let h = image.naturalHeight * ratio;
  const longSideCm = Number(sizeSelect.value);
  const shape = profile.id === "photo-keychain"
    ? (shapeSelect?.value || "rounded")
    : profile.id === "ornament"
      ? (shapeSelect?.value || "round")
      : profile.id === "luggage-tag"
        ? (shapeSelect?.value || "rounded")
      : profile.id === "pet-tag"
        ? (shapeSelect?.value || "circle")
      : profile.id === "bookmark"
        ? (shapeSelect?.value || "classic")
      : profile.id === "coaster"
        ? (shapeSelect?.value || "square")
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

  if (profile.id === "luggage-tag" || profile.id === "pet-tag") {
    // A tag is a portrait slab, so the silhouette aspect is fixed here instead of by the
    // uploaded photo. That keeps a 7/9/11 cm tag looking like a tag for every upload.
    const box = shape === "circle" ? [1, 1]
      : shape === "oval" ? [1, 0.72]
      : shape === "tag" ? [0.6, 1]
      : [0.66, 1];
    const w = Math.round(WORK_LONG_SIDE * box[0]);
    const h = Math.round(WORK_LONG_SIDE * box[1]);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(Math.max(w, h), longSideCm), shape };
  }

  if (profile.id === "bookmark") {
    // A bookmark is a tall narrow slab, so the silhouette aspect is fixed here instead of
    // by the uploaded photo. That keeps a 15, 18 or 20 cm bookmark looking like a bookmark.
    const w = Math.round(WORK_LONG_SIDE * 0.29);
    const h = WORK_LONG_SIDE;
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2 + 26;
    return { x, y, w, h, longSideCm, dpi: workDpi(h, longSideCm), shape };
  }

  if (profile.id === "coaster") {
    // A coaster is a fixed 1:1 blank, so the photo is cover-fitted into the footprint
    // instead of setting the silhouette the way a keychain upload does.
    const side = WORK_LONG_SIDE;
    const x = (CANVAS - side) / 2;
    const y = (CANVAS - side) / 2 + 26;
    return { x, y, w: side, h: side, longSideCm, dpi: workDpi(side, longSideCm), shape };
  }

  if (profile.id === "jigsaw") {
    // The board follows the photo so the pieces stay close to square whatever the crop is.
    // The aspect is clamped so a panorama does not collapse into a letterbox strip.
    const w = WORK_LONG_SIDE;
    const ratio = Math.min(1.5, Math.max(0.66, image.naturalHeight / image.naturalWidth));
    const h = Math.round(w * ratio);
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2;
    return { x, y, w, h, longSideCm, dpi: workDpi(w, longSideCm), shape: shapeSelect?.value || "4x4" };
  }

  if (profile.id === "name-plate") {
    // A desk plate is a fixed long slab, so the inch size decides the box instead of the
    // uploaded file. The 4:1 preview keeps the real proportions of a 2 inch tall plate.
    const spec = deskNamePlateSize(longSideCm);
    const w = WORK_LONG_SIDE;
    const h = Math.round(w * (spec.heightCm / spec.widthCm));
    const x = (CANVAS - w) / 2;
    const y = (CANVAS - h) / 2;
    return { x, y, w, h, longSideCm, dpi: workDpi(w, spec.widthCm), spec, finish: plateFinish() };
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

  if (profile.id === "sticker" || profile.id === "sticker-outline") {
    const base = buildStickerContours(L);
    // The border is measured against the artwork's own DPI, not the padded canvas,
    // otherwise a 2 mm border grows into a 3.3 mm one on a shape that floats inside the frame.
    const baseBounds = boundsOfContours(base);
    const artDpi = baseBounds ? Math.max(baseBounds.width, baseBounds.height) / (L.longSideCm / 2.54) : L.dpi;
    const borderMm = stickerBorderWidth(offsetInput.value);
    const offsetPx = stickerOffsetPixels(borderMm, artDpi);
    const outline = offsetContours(base, offsetPx);
    const kind = profile.id === "sticker" ? "sticker" : "sticker-outline";
    scene = {
      kind,
      base,
      outline,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      image: artworkSource(),
      offsetPx,
      borderMm,
      dpi: artDpi,
      longSideCm: L.longSideCm,
      border: kind === "sticker-outline" ? stickerBorderHex(borderColorInput && borderColorInput.value) : "#ffffff",
    };
    if (kind === "sticker") drawSticker(ctx, scene, true);
    else drawStickerOutline(ctx, scene, true);
  } else if (profile.id === "photo-strip") {
    const stripCount = photoStripCount(stripCountSelect?.value);
    scene = {
      kind: "photo-strip",
      spec: L.spec,
      count: stripCount,
      photos: stripPhotos.slice(0, stripCount),
      paper: photoStripPaperHex(stripPaperInput?.value),
      caption: (stripCaptionInput?.value || "").trim().replace(/\s+/g, " ").slice(0, 40),
      font: stripFontSelect?.value || DEFAULT_STRIP_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPhotoStrip(ctx, scene, true);
  } else if (profile.id === "table-number") {
    scene = {
      kind: "table-number",
      spec: L.spec,
      shape: L.shape,
      number: (tableNumberText?.value || "").trim().slice(0, 4),
      names: (tableNumberNames?.value || "").trim().replace(/\s+/g, " ").slice(0, 40),
      photo: tablePhoto,
      paper: tableNumberPaperHex(tableNumberPaper?.value),
      font: tableNumberFont?.value || DEFAULT_TABLE_NUMBER_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawTableNumber(ctx, scene, true);
  } else if (profile.id === "place-card") {
    const guests = placeCardGuests(placeCardList?.value || "", PLACE_CARD_LIMIT);
    const grid = placeCardGrid(sizeSelect.value, shapeSelect?.value);
    const pages = Math.max(1, Math.ceil(guests.length / grid.perSheet));
    if (placeCardPage > pages - 1) placeCardPage = pages - 1;
    if (placeCardPage < 0) placeCardPage = 0;
    scene = {
      kind: "place-card",
      spec: L.spec,
      grid,
      guests,
      page: placeCardPage,
      pages,
      paper: placeCardPaperHex(placeCardPaper?.value),
      font: placeCardFont?.value || DEFAULT_PLACE_CARD_FONT,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPlaceCardSheet(ctx, scene, true);
  } else if (profile.id === "polaroid") {
    scene = {
      kind: "polaroid",
      frame: L.frame,
      spec: L.frame,
      sheet: L.sheet,
      grid: L.sheet ? polaroidGrid(L.sheet.id, sizeSelect.value) : null,
      paper: polaroidPaperHex(polaroidPaper?.value),
      finish: polaroidFinish(polaroidFinishSelect?.value),
      caption: (polaroidCaption?.value || "").trim().replace(/\s+/g, " ").slice(0, 48),
      font: polaroidFontSelect?.value || DEFAULT_POLAROID_FONT,
      image: polaroidPhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawPolaroid(ctx, scene, true);
  } else if (profile.id === "cupcake") {
    scene = {
      kind: "cupcake",
      topper: L.topper,
      spec: L.topper,
      sheet: L.sheet,
      grid: L.sheet ? cupcakeGrid(L.sheet.id, sizeSelect.value) : null,
      shape: cupcakeShape(shapeSelect?.value),
      paper: cupcakePaperHex(cupcakePaper?.value),
      text: (cupcakeText?.value || "").trim().replace(/\s+/g, " ").slice(0, CUPCAKE_MAX_CHARS),
      font: cupcakeFontSelect?.value || DEFAULT_CUPCAKE_FONT,
      image: cupcakePhoto,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCupcake(ctx, scene, true);
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
  } else if (profile.id === "cake-topper") {
    scene = {
      kind: "cake-topper",
      style: topperStyleName(),
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: topperOutline(L),
      image: topperPhoto,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCakeTopper(ctx, scene, true);
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
  } else if (profile.id === "luggage-tag" || profile.id === "pet-tag") {
    // A pet tag is the same slab as a bag tag, so it shares the painter and only swaps the
    // outline builder, which defaults to a collar-friendly circle.
    const tagPoints = profile.id === "pet-tag" ? petTagShapePoints : luggageTagShapePoints;
    const outline = tagPoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = luggageTagHole(L.shape, L.w, L.h);
    scene = {
      kind: "luggage-tag",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      lines: luggageTagLines(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawLuggageTag(ctx, scene, true);
  } else if (profile.id === "bookmark") {
    const outline = bookmarkShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]);
    const local = bookmarkHole(L.shape, L.w, L.h);
    scene = {
      kind: "bookmark",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline,
      hole: { cx: local.cx + L.x, cy: local.cy + L.y, r: local.r },
      lines: bookmarkLines(),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawBookmark(ctx, scene, true);
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
  } else if (profile.id === "coaster") {
    scene = {
      kind: "coaster",
      shape: L.shape,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: coasterShapePoints(L.shape, L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawCoaster(ctx, scene, true);
  } else if (profile.id === "jigsaw") {
    const grid = jigsawGrid(shapeSelect?.value);
    const paths = jigsawCutPaths(L.w, L.h, grid.cols, grid.rows);
    const shift = (points) => points.map(([px, py]) => [px + L.x, py + L.y]);
    scene = {
      kind: "jigsaw",
      grid,
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: shift(paths.outline),
      cuts: paths.cuts.map(shift),
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
    };
    drawJigsaw(ctx, scene, true);
  } else if (profile.id === "name-plate") {
    scene = {
      kind: "name-plate",
      finish: plateFinish(),
      rect: { x: L.x, y: L.y, w: L.w, h: L.h },
      outline: deskNamePlatePoints(L.w, L.h).map(([px, py]) => [px + L.x, py + L.y]),
      lines: namePlateLines(),
      logo: plateLogo,
      image,
      dpi: L.dpi,
      longSideCm: L.longSideCm,
      spec: L.spec,
    };
    drawNamePlate(ctx, scene, true);
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
  sizeLabel.textContent = scene.spec
    ? (profile.id === "table-number" || profile.id === "place-card" || profile.id === "polaroid" || profile.id === "cupcake") && scene.spec.short
      ? scene.spec.short
      : scene.spec.id.split("x").join(" x ") + " in"
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

  if (profile.id === "name-plate") {
    // Desk plates are bought in inches, so the readout leads with the inch size and keeps 300 DPI honest.
    const spec = scene.spec;
    const inches = (cm) => round2(cm / 2.54);
    dimensions.textContent = inches(spec.widthCm) + " x " + inches(spec.heightCm)
      + " in acrylic desk name plate at " + PRINT_DPI + " DPI ("
      + physicalPixels(spec.widthCm, PRINT_DPI) + " px wide) - a transparent PNG plus an SVG cut path;"
      + " the stand in the preview is decoration only.";
    return;
  }

  if (profile.id === "photo-strip") {
    // The printed width is what a strip is sold as and the frame count is what makes it a booth
    // strip rather than a plain print, so the readout leads with both.
    const spec = scene.spec;
    const sheet = (spec.cols || 1) > 1
      ? " Two identical strips share the sheet, so one 4 x 6 in photo print gives you two - cut straight down the middle."
      : "";
    const missing = scene.count - scene.photos.length;
    dimensions.textContent = spec.id.split("x").join(" x ") + " in photo strip with " + scene.count
      + " photos at " + PRINT_DPI + " DPI (" + physicalPixels(spec.heightCm, PRINT_DPI) + " px long side)." + sheet
      + (scene.caption ? " Your caption prints under the frames." : "")
      + (missing > 0
        ? " Add " + missing + " more photo" + (missing === 1 ? "" : "s") + " to fill every frame."
        : " Every frame is filled, so the download is ready to print.")
      + " No watermark, and the photos never leave your device.";
    return;
  }

  if (profile.id === "table-number") {
    // The card is a print, so the readout leads with the stock and says what is actually on it.
    const spec = scene.spec;
    const shapeName = scene.shape === "arch" ? "arch" : scene.shape === "rounded" ? "rounded corner" : "straight edge";
    dimensions.textContent = spec.short + " " + shapeName + " table number at " + PRINT_DPI + " DPI ("
      + physicalPixels(spec.heightCm, PRINT_DPI) + " px tall) - a print-ready PNG of the whole card, paper and all."
      + (scene.photo
        ? " Your photo runs across the card with the number on a band of paper, so it stays readable."
        : " Add a photo when you want the picture to run across the card behind the number.")
      + (scene.names ? " The names print under the number." : "")
      + (scene.number ? "" : " Type a table number to put it on the card.")
      + " No watermark, and the photos never leave your device.";
    return;
  }

  if (profile.id === "place-card") {
    // The sheet is the product, so the readout leads with the paper and then says what is on it.
    const grid = scene.grid;
    if (placeCardPager) placeCardPager.hidden = !scene.guests.length;
    if (placeCardPageLabel) placeCardPageLabel.textContent = "Sheet " + (scene.page + 1) + " of " + scene.pages;
    if (placeCardPagePrev) placeCardPagePrev.disabled = scene.page <= 0;
    if (placeCardPageNext) placeCardPageNext.disabled = scene.page >= scene.pages - 1;
    const filled = Math.min(grid.perSheet, Math.max(0, scene.guests.length - scene.page * grid.perSheet));
    dimensions.textContent = scene.spec.short + " sheet of " + (grid.style === "tent" ? "folded tent" : "flat")
      + " place cards at " + PRINT_DPI + " DPI (" + physicalPixels(scene.spec.widthCm, PRINT_DPI) + " x "
      + physicalPixels(scene.spec.heightCm, PRINT_DPI) + " px) - " + grid.perSheet + " cards a sheet, "
      + filled + " filled on this one" + (scene.pages > 1 ? " of " + scene.pages + " sheets" : "") + "."
      + " The download is a print-ready PNG of the whole sheet, light cut lines and all."
      + (scene.guests.length ? "" : " Type a guest list on the left to fill the first card.")
      + " No watermark, and nothing you type leaves your device.";
    return;
  }
  if (profile.id === "cupcake") {
    // A topper is a round print, so the readout leads with the diameter and the batch count.
    const topper = scene.topper;
    const inches = (cm) => round2(cm / 2.54);
    const shapeName = { circle: "round", scallop: "scalloped", rounded: "rounded corner", square: "square" }[scene.shape] || "round";
    sizeLabel.textContent = topper.short;
    if (scene.sheet) {
      const grid = scene.grid;
      dimensions.textContent = topper.short + " " + shapeName + " toppers tiled " + grid.cols + " across and "
        + grid.rows + " down on " + (scene.sheet.short === "A4" ? "an " : "a ") + scene.sheet.short + " sheet at "
        + PRINT_DPI + " DPI (" + physicalPixels(scene.sheet.widthCm, PRINT_DPI) + " x "
        + physicalPixels(scene.sheet.heightCm, PRINT_DPI) + " px) - " + grid.perSheet
        + " toppers a sheet, with light cut lines you can trim along."
        + (scene.image ? " Your photo is cover-fitted into every disc." : " Upload a photo to fill the discs.")
        + (scene.text ? " The message prints on a band across the foot of each one." : "")
        + " No watermark, and your photo never leaves your device.";
      return;
    }
    dimensions.textContent = topper.short + " " + shapeName + " topper at " + PRINT_DPI + " DPI ("
      + physicalPixels(topper.widthCm, PRINT_DPI) + " x " + physicalPixels(topper.heightCm, PRINT_DPI)
      + " px, " + inches(topper.widthCm) + " x " + inches(topper.heightCm)
      + " in) - a print-ready PNG of the whole topper, card and cut line included."
      + (scene.image ? " Your photo is cover-fitted into the disc." : " Upload a photo to fill the disc, or print the blank card as a template.")
      + (scene.text ? " The message prints on a band across the foot." : "")
      + " No watermark, and your photo never leaves your device.";
    return;
  }
  if (profile.id === "polaroid") {
    // The film is the product, so the readout leads with the frame and then says whether the
    // download is one frame or a whole sheet of them.
    const frame = scene.frame;
    const inches = (cm) => round2(cm / 2.54);
    const finishNote = scene.finish && scene.finish.id !== "original" ? " with a " + scene.finish.label.toLowerCase() + " over it" : "";
    if (scene.sheet) {
      const grid = scene.grid;
      dimensions.textContent = frame.short + " frames tiled " + grid.cols + " across and " + grid.rows
        + " down on " + (scene.sheet.short === "A4" ? "an " : "a ") + scene.sheet.short + " sheet at " + PRINT_DPI + " DPI ("
        + physicalPixels(scene.sheet.widthCm, PRINT_DPI) + " x " + physicalPixels(scene.sheet.heightCm, PRINT_DPI)
        + " px) - " + grid.perSheet + " frames a sheet with light trim lines."
        + (scene.image ? " Your photo is cover-fitted into every frame" + finishNote + "." : " Upload a photo to fill the frames.")
        + (scene.caption ? " The caption prints in the bottom border of each one." : "")
        + " No watermark, and your photo never leaves your device.";
      return;
    }
    dimensions.textContent = frame.short + " frame at " + PRINT_DPI + " DPI (" + physicalPixels(frame.widthCm, PRINT_DPI)
      + " x " + physicalPixels(frame.heightCm, PRINT_DPI) + " px, " + inches(frame.widthCm) + " x " + inches(frame.heightCm)
      + " in) - a print-ready PNG of the whole film frame, border and all."
      + (scene.image ? " Your photo is cover-fitted into the window" + finishNote + "." : " Upload a photo to fill the window, or download the blank frame as a template.")
      + (scene.caption ? " The caption prints in the bottom border." : "")
      + " No watermark, and your photo never leaves your device.";
    return;
  }
  if (profile.id === "jigsaw") {
    // The puzzle is the only tool whose readout is about the piece count as much as the size.
    const grid = scene.grid;
    dimensions.textContent = scene.longSideCm + " cm long side, " + grid.pieces + " pieces (" + grid.cols + " x " + grid.rows
      + ") at " + PRINT_DPI + " DPI (" + physicalPixels(scene.longSideCm, PRINT_DPI) + " px long side) - the PNG is ready to print and already shows the cut lines;"
      + " the SVG is a separate cut file with the outline and every interior cut. Ask us for a quote when you want it made in acrylic.";
    return;
  }

  if (profile.id === "sticker-outline") {
    // The keyline is the product here, so the readout leads with the border that was chosen.
    const preset = STICKER_BORDER_PRESETS.find((entry) => entry.hex === scene.border);
    const named = preset ? preset.label : scene.border;
    const box = pieceBox();
    const cmPerWorkPx = (exportScale() * 2.54) / PRINT_DPI;
    dimensions.textContent = round2(box.width * cmPerWorkPx) + " x " + round2(box.height * cmPerWorkPx)
      + " cm sticker at " + PRINT_DPI + " DPI (" + physicalPixels(scene.longSideCm, PRINT_DPI) + " px long side) - a "
      + scene.borderMm + " mm " + named + " border around your artwork, on a transparent background, so it prints clean"
      + " and drops straight into Canva, Procreate or a print queue."
      + (backgroundLifted ? " The flat background behind your picture was removed first, so the border hugs the subject." : "");
    return;
  }

  const piece = pieceBox();
  const cmPerWorkPx = (exportScale() * 2.54) / PRINT_DPI;
  const exportLong = physicalPixels(L.longSideCm, PRINT_DPI);
  const suffix = profile.id === "sticker"
    ? "the download is the cut shape, offset included"
    : profile.id === "ornament"
      ? "transparent PNG at 300 DPI plus an SVG cut path; the hanging loop is a preview only"
    : profile.id === "luggage-tag"
      ? "transparent PNG at 300 DPI plus an SVG cut path with the strap hole; the strap is a preview only"
    : profile.id === "pet-tag"
      ? "transparent PNG at 300 DPI plus an SVG cut path with the collar hole; the loop is a preview only"
      : profile.id === "bookmark"
        ? "transparent PNG at 300 DPI plus an SVG cut path with the tassel hole; the tassel is a preview only"
      : profile.id === "coaster"
        ? "transparent PNG at 300 DPI plus an SVG cut path; the coaster rim in the preview is decoration only"
      : profile.id === "photo-keychain"
      ? "transparent PNG at 300 DPI; the keyring is a preview only"
      : profile.id === "name-keychain"
        ? "transparent PNG at 300 DPI; the hanging hole and ring are preview only"
      : profile.id === "cake-topper"
        ? "transparent PNG at 300 DPI plus an SVG cut path; the cake stick in the preview is decoration only"
        : "transparent PNG, no watermark";
  const lifted = backgroundLifted && profile.id === "sticker"
    ? " The flat background behind your picture was removed, so the cut line follows the subject."
    : "";
  dimensions.textContent = `${round2(piece.width * cmPerWorkPx)} x ${round2(piece.height * cmPerWorkPx)} cm finished piece at ${PRINT_DPI} DPI (${exportLong} px long side) - ${suffix}.${lifted}`;
}

function note(text) {
  dimensions.textContent = text;
}

// ------------------------------------------------------------------ painters

/**
 * A photo jigsaw board. The picture is cover-fitted into the board and the cut lines are
 * painted on top, because for this product the cut lines are the thing the visitor came for:
 * they have to be in the printed PNG as well as in the preview. The preview adds a drop
 * shadow and a sheen so the board reads as a real object; neither is in the export.
 */
function drawJigsaw(c, s, guides) {
  const r = s.rect;
  if (guides) {
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
  }
  c.save();
  c.beginPath();
  c.rect(r.x, r.y, r.w, r.h);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  if (guides) {
    const sheen = c.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
    sheen.addColorStop(0, "rgba(255,255,255,.18)");
    sheen.addColorStop(0.45, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(29,36,32,.10)");
    c.fillStyle = sheen;
    c.fillRect(r.x, r.y, r.w, r.h);
  }
  c.restore();
  c.save();
  c.lineJoin = "round";
  c.lineCap = "round";
  c.strokeStyle = "rgba(29,36,32,.60)";
  c.lineWidth = 2.2;
  c.beginPath();
  c.moveTo(s.outline[0][0], s.outline[0][1]);
  for (let i = 1; i < s.outline.length; i++) c.lineTo(s.outline[i][0], s.outline[i][1]);
  c.closePath();
  for (const cut of s.cuts) {
    c.moveTo(cut[0][0], cut[0][1]);
    for (let i = 1; i < cut.length; i++) c.lineTo(cut[i][0], cut[i][1]);
  }
  c.stroke();
  c.restore();
}

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

/**
 * The sticker a visitor actually prints. Same traced silhouette as the cutline tool, but the
 * fill is the border colour they chose, and the preview adds a soft drop shadow so a
 * transparent-background sticker still reads as an object sitting on the page. The shadow is
 * preview-only: the exported PNG keeps clean edges and its transparency.
 */
function drawStickerOutline(c, s, guides) {
  if (!s.outline.length) return;
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.28)";
    c.shadowBlur = 24;
    c.shadowOffsetY = 11;
  }
  c.fillStyle = s.border;
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.fill("evenodd");
  c.restore();
  c.drawImage(s.image, s.rect.x, s.rect.y, s.rect.w, s.rect.h);
  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.55)";
    c.beginPath();
    for (const pts of s.base) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

function clearStripPhotos() {
  stripPhotos = [];
  if (upload) upload.value = "";
  setDownloadsEnabled(false);
  adoptSource("upload");
  render();
}

/** Drops the optional photo but keeps the finished card, which stands on its own. */
function clearTableNumberPhoto() {
  tablePhoto = null;
  if (upload) upload.value = "";
  adoptSource("upload");
  render();
}

/** The card silhouette as a path: an arch, a soft-cornered card, or a plain rectangle. */
function tableNumberPath(c, r, shape) {
  c.beginPath();
  if (shape === "arch") {
    // A full semicircle on top, so the card reads as the arch sign people search for.
    const radius = r.w / 2;
    c.moveTo(r.x, r.y + r.h);
    c.lineTo(r.x, r.y + radius);
    c.quadraticCurveTo(r.x, r.y, r.x + radius, r.y);
    c.quadraticCurveTo(r.x + r.w, r.y, r.x + r.w, r.y + radius);
    c.lineTo(r.x + r.w, r.y + r.h);
    c.closePath();
    return;
  }
  const radius = shape === "rounded" ? Math.min(r.w, r.h) * 0.1 : Math.min(r.w, r.h) * 0.012;
  if (typeof c.roundRect === "function") c.roundRect(r.x, r.y, r.w, r.h, radius);
  else c.rect(r.x, r.y, r.w, r.h);
}

/**
 * A wedding table number. The card stock, the silhouette and the two lines of type all follow
 * the chosen size, so the same painter draws every combination. With a photo the picture runs
 * edge to edge and the number sits on a band of card stock; without one the number is centred on
 * plain stock. The preview adds a drop shadow; the export never does.
 */
function drawTableNumber(c, s, guides) {
  const r = s.rect;
  const ink = readableInk(s.paper);
  const family = s.font || DEFAULT_TABLE_NUMBER_FONT;
  const pad = Math.min(r.w, r.h) * 0.09;
  const number = (s.number || "").trim();
  const names = (s.names || "").trim();

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 28;
    c.shadowOffsetY = 12;
  }
  tableNumberPath(c, r, s.shape);
  c.fillStyle = s.paper;
  c.fill();
  c.restore();

  c.save();
  tableNumberPath(c, r, s.shape);
  c.clip();

  if (s.photo) {
    drawCover(c, s.photo, r.x, r.y, r.w, r.h);
    // A solid band of card stock at the foot is what keeps the number readable over any photo.
    const bandH = Math.round(r.h * (names ? 0.34 : 0.26));
    const bandY = r.y + r.h - bandH;
    c.fillStyle = s.paper;
    c.fillRect(r.x, bandY, r.w, bandH);
    c.save();
    c.strokeStyle = "rgba(29,36,32,.14)";
    c.lineWidth = Math.max(1, r.w * 0.003);
    c.beginPath();
    c.moveTo(r.x, bandY);
    c.lineTo(r.x + r.w, bandY);
    c.stroke();
    c.restore();
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const wanted = bandH * (names ? 0.62 : 0.7);
    const numberSize = Math.min(bandH * (names ? 0.62 : 0.72), fitFont(c, number, r.w * 0.68, wanted, family, 700));
    c.font = "700 " + numberSize + "px " + family;
    c.fillText(number, r.x + r.w / 2, bandY + (names ? bandH * 0.36 : bandH * 0.5), r.w * 0.8);
    if (names) {
      const nameSize = fitFont(c, names, r.w * 0.76, bandH * 0.2, family, 600);
      c.font = "600 " + nameSize + "px " + family;
      c.fillText(names, r.x + r.w / 2, bandY + bandH * 0.74, r.w * 0.8);
    }
    c.restore();
  } else {
    // Plain stock: the arch pushes the number down so it never rides into the curved shoulder.
    const top = s.shape === "arch" ? r.y + r.w * 0.42 : r.y + pad;
    const bottom = r.y + r.h - pad;
    const namesH = names ? Math.min((bottom - top) * 0.2, r.w * 0.16) : 0;
    const numberBottom = bottom - namesH;
    const numberSize = fitFont(c, number, r.w - pad * 2, (numberBottom - top) * 0.82, family, 700);
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 " + numberSize + "px " + family;
    c.fillText(number, r.x + r.w / 2, (top + numberBottom) / 2, r.w - pad * 2);
    if (names) {
      const ruleY = bottom - namesH * 0.72;
      const ruleW = Math.min(r.w * 0.22, (r.w - pad * 2) * 0.4);
      c.globalAlpha = 0.5;
      c.strokeStyle = ink;
      c.lineWidth = Math.max(1, r.w * 0.006);
      c.beginPath();
      c.moveTo(r.x + r.w / 2 - ruleW / 2, ruleY);
      c.lineTo(r.x + r.w / 2 + ruleW / 2, ruleY);
      c.stroke();
      c.globalAlpha = 1;
      const nameSize = fitFont(c, names, r.w - pad * 2, namesH * 0.8, family, 600);
      c.font = "600 " + nameSize + "px " + family;
      c.fillText(names, r.x + r.w / 2, bottom - namesH * 0.28, r.w - pad * 2);
    }
    c.restore();
  }
  c.restore();
}

/**
 * A printable sheet of place cards. The sheet size sets the paper, the card style decides how
 * many cards fit and whether each one folds, and the guest list fills them in the order it was
 * typed. The preview adds a drop shadow; the export never does.
 */
function drawPlaceCardSheet(c, s, guides) {
  const r = s.rect;
  const grid = s.grid;
  const pxPerCm = r.w / grid.sheet.widthCm;
  const margin = grid.marginCm * pxPerCm;
  const cardW = grid.card.widthCm * pxPerCm;
  const cardH = grid.card.heightCm * pxPerCm;
  const ink = readableInk(s.paper);
  const family = s.font || DEFAULT_PLACE_CARD_FONT;
  const hair = ink === "#ffffff" ? "rgba(255,255,255,.24)" : "rgba(29,36,32,.16)";
  const fold = ink === "#ffffff" ? "rgba(255,255,255,.38)" : "rgba(29,36,32,.3)";

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = 28;
    c.shadowOffsetY = 12;
  }
  c.fillStyle = s.paper;
  c.fillRect(r.x, r.y, r.w, r.h);
  c.restore();

  // Cut lines. Every card shares an edge with its neighbour, so one trimmer pass down each line
  // separates the whole sheet.
  c.save();
  c.strokeStyle = hair;
  c.lineWidth = Math.max(1, r.w * 0.0016);
  for (let col = 0; col <= grid.cols; col += 1) {
    const x = r.x + margin + col * cardW;
    c.beginPath();
    c.moveTo(x, r.y + margin);
    c.lineTo(x, r.y + margin + grid.rows * cardH);
    c.stroke();
  }
  for (let row = 0; row <= grid.rows; row += 1) {
    const y = r.y + margin + row * cardH;
    c.beginPath();
    c.moveTo(r.x + margin, y);
    c.lineTo(r.x + margin + grid.cols * cardW, y);
    c.stroke();
  }
  c.restore();

  const start = s.page * grid.perSheet;
  let printed = 0;
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const guest = s.guests[start + row * grid.cols + col];
      if (!guest) continue;
      printed += 1;
      const x = r.x + margin + col * cardW;
      const y = r.y + margin + row * cardH;
      if (grid.style === "tent") {
        // A tent card prints both halves of the fold, the lower one turned a half turn, so the
        // name reads the right way up from either side of the table once it is folded.
        const halfH = cardH / 2;
        drawPlaceCardFace(c, x + cardW / 2, y + halfH / 2, cardW, halfH, guest, family, ink, false);
        drawPlaceCardFace(c, x + cardW / 2, y + halfH * 1.5, cardW, halfH, guest, family, ink, true);
        c.save();
        c.strokeStyle = fold;
        c.lineWidth = Math.max(1, cardW * 0.006);
        c.setLineDash([cardW * 0.05, cardW * 0.04]);
        c.beginPath();
        c.moveTo(x + cardW * 0.07, y + halfH);
        c.lineTo(x + cardW * 0.93, y + halfH);
        c.stroke();
        c.restore();
      } else {
        drawPlaceCardFace(c, x + cardW / 2, y + cardH / 2, cardW, cardH, guest, family, ink, false);
      }
    }
  }

  if (!printed) {
    // An empty sheet still shows the stock and the cut lines, so the first thing a visitor sees
    // is the paper they picked rather than a blank canvas.
    const head = s.guests.length
      ? "Every card on this sheet is full"
      : "Type a guest name to fill the first card";
    c.save();
    c.fillStyle = ink;
    c.globalAlpha = 0.42;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(11, Math.min(r.w, r.h) * 0.032) + "px " + family;
    c.fillText(head, r.x + r.w / 2, r.y + r.h / 2);
    c.restore();
  }
}

/** One side of a place card: the guest's name, with the meal mark underneath when asked for. */
function drawPlaceCardFace(c, cx, cy, w, h, guest, family, ink, rotated) {
  const name = guest && guest.name ? guest.name.trim() : "";
  if (!name) return;
  const meal = guest.meal || "";
  const inner = w * 0.86;
  c.save();
  c.translate(cx, cy);
  if (rotated) c.rotate(Math.PI);
  c.fillStyle = ink;
  c.textAlign = "center";
  c.textBaseline = "middle";
  const size = fitFont(c, name, inner, h * (meal ? 0.44 : 0.54), family, 600);
  c.font = "600 " + size + "px " + family;
  c.fillText(name, 0, meal ? -h * 0.12 : 0, inner);
  if (meal) drawMealGlyph(c, meal, 0, h * 0.26, Math.min(w * 0.13, h * 0.22), ink);
  c.restore();
}

/**
 * The line-art meal mark printed under a guest's name. Five simple drawings cover the choices
 * couples actually offer, and they stay legible at the size a 3.5 in card can carry.
 */
function drawMealGlyph(c, meal, cx, cy, size, ink) {
  const radius = size / 2;
  const u = size * 0.62;
  c.save();
  c.translate(cx, cy);
  c.strokeStyle = ink;
  c.lineWidth = Math.max(1, size * 0.09);
  c.lineCap = "round";
  c.lineJoin = "round";
  c.globalAlpha = 0.34;
  c.beginPath();
  c.arc(0, 0, radius, 0, Math.PI * 2);
  c.stroke();
  c.globalAlpha = 1;
  if (meal === "beef") {
    roundRect(c, -u * 0.5, -u * 0.28, u, u * 0.56, u * 0.2);
    c.stroke();
    c.beginPath();
    c.moveTo(-u * 0.18, 0);
    c.quadraticCurveTo(0, -u * 0.15, u * 0.18, 0);
    c.stroke();
  } else if (meal === "chicken") {
    // A drumstick, not a magnifier: the meat sits up and to the left, the bone points away.
    c.beginPath();
    c.arc(-u * 0.24, -u * 0.22, u * 0.34, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.02, u * 0.04);
    c.lineTo(u * 0.38, u * 0.36);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.38, u * 0.36);
    c.lineTo(u * 0.54, u * 0.24);
    c.moveTo(u * 0.38, u * 0.36);
    c.lineTo(u * 0.5, u * 0.5);
    c.stroke();
  } else if (meal === "fish") {
    c.beginPath();
    c.moveTo(-u * 0.5, 0);
    c.quadraticCurveTo(-u * 0.05, -u * 0.46, u * 0.28, 0);
    c.quadraticCurveTo(-u * 0.05, u * 0.46, -u * 0.5, 0);
    c.stroke();
    c.beginPath();
    c.moveTo(u * 0.24, 0);
    c.lineTo(u * 0.52, -u * 0.26);
    c.lineTo(u * 0.52, u * 0.26);
    c.closePath();
    c.stroke();
  } else if (meal === "veg") {
    c.beginPath();
    c.moveTo(0, -u * 0.48);
    c.quadraticCurveTo(u * 0.5, -u * 0.08, 0, u * 0.48);
    c.quadraticCurveTo(-u * 0.5, -u * 0.08, 0, -u * 0.48);
    c.stroke();
    c.beginPath();
    c.moveTo(0, -u * 0.4);
    c.lineTo(0, u * 0.4);
    c.stroke();
  } else {
    // Anything else the list asks for, kids included, gets the star a venue would print.
    c.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const step = i % 2 ? u * 0.2 : u * 0.5;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = Math.cos(angle) * step;
      const py = Math.sin(angle) * step;
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.closePath();
    c.stroke();
  }
  c.restore();
}
/**
 * An instant-film frame. The film footprint and the photo window are fixed, so the photo is
 * cover-fitted into a window instead of setting the shape of the piece the way an upload does.
 * A single frame and a whole tiled sheet share the same card painter, so the preview and the
 * download can never disagree about where the border falls.
 */
function drawPolaroid(c, s, guides) {
  const r = s.rect;
  if (s.sheet) {
    // A print sheet of frames: the paper is blank stock and the frames are seated in a grid with
    // a small gutter, so a trimmer pass down each gutter separates the whole run.
    const grid = s.grid;
    const pxPerCm = r.w / grid.sheet.widthCm;
    const frameW = grid.frame.widthCm * pxPerCm;
    const frameH = grid.frame.heightCm * pxPerCm;
    const gutter = grid.gutterCm * pxPerCm;
    const blockW = grid.cols * frameW + (grid.cols - 1) * gutter;
    const blockH = grid.rows * frameH + (grid.rows - 1) * gutter;
    const originX = r.x + (r.w - blockW) / 2;
    const originY = r.y + (r.h - blockH) / 2;
    c.save();
    if (guides) {
      c.shadowColor = "rgba(29,36,32,.22)";
      c.shadowBlur = 28;
      c.shadowOffsetY = 12;
    }
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
    c.save();
    c.strokeStyle = "rgba(29,36,32,.16)";
    c.lineWidth = Math.max(1, r.w * 0.0016);
    c.setLineDash([Math.max(2, gutter * 0.34), Math.max(2, gutter * 0.3)]);
    for (let col = 1; col < grid.cols; col += 1) {
      const x = originX + col * frameW + (col - 0.5) * gutter;
      c.beginPath();
      c.moveTo(x, originY - gutter * 0.45);
      c.lineTo(x, originY + blockH + gutter * 0.45);
      c.stroke();
    }
    for (let row = 1; row < grid.rows; row += 1) {
      const y = originY + row * frameH + (row - 0.5) * gutter;
      c.beginPath();
      c.moveTo(originX - gutter * 0.45, y);
      c.lineTo(originX + blockW + gutter * 0.45, y);
      c.stroke();
    }
    c.restore();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const x = originX + col * (frameW + gutter);
        const y = originY + row * (frameH + gutter);
        drawPolaroidCard(c, x, y, frameW, frameH, s, guides);
      }
    }
    return;
  }
  drawPolaroidCard(c, r.x, r.y, r.w, r.h, s, guides);
}

/** One instant photo: the film border, the window, the graded photo and the caption. */
function drawPolaroidCard(c, x, y, w, h, s, guides) {
  const frame = s.frame;
  const ink = readableInk(s.paper);
  const pxPerCm = w / frame.widthCm;
  const radius = Math.max(2, Math.min(w, h) * 0.02);
  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.26)";
    c.shadowBlur = Math.max(6, w * 0.03);
    c.shadowOffsetY = Math.max(2, h * 0.012);
  }
  c.fillStyle = s.paper;
  roundRect(c, x, y, w, h, radius);
  c.fill();
  c.restore();

  const win = frame.window;
  const wx = x + win.x * pxPerCm;
  const wy = y + win.y * pxPerCm;
  const ww = win.w * pxPerCm;
  const wh = win.h * pxPerCm;

  c.save();
  roundRect(c, wx, wy, ww, wh, Math.max(1, radius * 0.5));
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(wx, wy, ww, wh);
  if (s.image) {
    drawCover(c, s.image, wx, wy, ww, wh);
    drawPolaroidFinish(c, s.finish, wx, wy, ww, wh);
  } else {
    // The blank frame is a real download, so the empty window has to look deliberate.
    c.fillStyle = "rgba(29,36,32,.32)";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(9, ww * 0.08) + "px " + (s.font || DEFAULT_POLAROID_FONT);
    c.fillText("Add your photo", wx + ww / 2, wy + wh / 2);
  }
  c.restore();

  // A hairline keeps the window reading as film, even against a white sheet.
  c.save();
  c.strokeStyle = "rgba(29,36,32,.2)";
  c.lineWidth = Math.max(1, w * 0.004);
  roundRect(c, wx, wy, ww, wh, Math.max(1, radius * 0.5));
  c.stroke();
  c.restore();

  const caption = (s.caption || "").trim();
  const bandTop = wy + wh;
  const bandH = y + h - bandTop;
  if (caption && bandH > 4) {
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const family = s.font || DEFAULT_POLAROID_FONT;
    const size = fitFont(c, caption, ww, Math.min(bandH * 0.6, ww * 0.26), family, 600);
    c.font = "600 " + size + "px " + family;
    c.fillText(caption, x + w / 2, bandTop + bandH * 0.52, ww);
    c.restore();
  }
}

/** The one blend that gives a photo its instant-film look. */
function drawPolaroidFinish(c, finish, x, y, w, h) {
  if (!finish || !finish.op || !(finish.alpha > 0)) return;
  c.save();
  c.globalCompositeOperation = finish.op;
  c.globalAlpha = finish.alpha;
  c.fillStyle = finish.hex;
  c.fillRect(x, y, w, h);
  c.restore();
}

/**
 * A printed cupcake topper. The disc is cut from card stock, so the silhouette decides the
 * shape, the card colour shows around the photo, and the message sits on a band at the foot.
 * A single topper and a whole tiled sheet share the same disc painter, so the preview and the
 * download can never disagree about where the cut line falls.
 */
function drawCupcake(c, s, guides) {
  const r = s.rect;
  if (s.sheet) {
    // A print sheet of toppers: the paper is blank stock and the discs are seated in a grid with
    // a small gutter, so a trimmer pass down each gutter separates the whole run.
    const grid = s.grid;
    const pxPerCm = r.w / grid.sheet.widthCm;
    const disc = grid.topper.widthCm * pxPerCm;
    const gutter = grid.gutterCm * pxPerCm;
    const blockW = grid.cols * disc + (grid.cols - 1) * gutter;
    const blockH = grid.rows * disc + (grid.rows - 1) * gutter;
    const originX = r.x + (r.w - blockW) / 2;
    const originY = r.y + (r.h - blockH) / 2;
    c.save();
    if (guides) {
      c.shadowColor = "rgba(29,36,32,.22)";
      c.shadowBlur = 28;
      c.shadowOffsetY = 12;
    }
    c.fillStyle = "#ffffff";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.restore();
    c.save();
    c.strokeStyle = "rgba(29,36,32,.18)";
    c.lineWidth = Math.max(1, r.w * 0.0016);
    c.setLineDash([Math.max(2, gutter * 0.34), Math.max(2, gutter * 0.3)]);
    for (let col = 1; col < grid.cols; col += 1) {
      const x = originX + col * disc + (col - 0.5) * gutter;
      c.beginPath();
      c.moveTo(x, originY - gutter * 0.5);
      c.lineTo(x, originY + blockH + gutter * 0.5);
      c.stroke();
    }
    for (let row = 1; row < grid.rows; row += 1) {
      const y = originY + row * disc + (row - 0.5) * gutter;
      c.beginPath();
      c.moveTo(originX - gutter * 0.5, y);
      c.lineTo(originX + blockW + gutter * 0.5, y);
      c.stroke();
    }
    c.restore();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const x = originX + col * (disc + gutter);
        const y = originY + row * (disc + gutter);
        drawCupcakeTopper(c, x, y, disc, disc, s, guides);
      }
    }
    return;
  }
  drawCupcakeTopper(c, r.x, r.y, r.w, r.h, s, guides);
}

/** One topper: the card silhouette, the photo inside it, the message band and the cut line. */
function drawCupcakeTopper(c, x, y, w, h, s, guides) {
  const ink = readableInk(s.paper);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const family = s.font || DEFAULT_CUPCAKE_FONT;
  const pad = Math.min(w, h) * 0.035;
  const inner = Math.min(w, h) - pad * 2;
  const round = s.shape === "circle" || s.shape === "scallop";
  const message = (s.text || "").trim();
  // A round card narrows as it falls away from its waist, so the message band sitting at the
  // foot can only be as wide as the card is there. The type is sized against that chord, which
  // keeps every glyph on the card instead of running past the cut line.
  const radius = inner * (s.shape === "scallop" ? 0.475 : 0.5);
  const bandH = message ? inner * (round ? 0.3 : 0.34) : 0;
  const bandTop = y + pad + inner - bandH;
  const bandMid = bandTop + bandH * 0.54;
  const chordHalf = (dy) => (round
    ? Math.sqrt(Math.max(0, radius * radius - Math.min(Math.abs(dy), radius) * Math.min(Math.abs(dy), radius)))
    : inner / 2);
  const messageW = (size) => chordHalf(Math.abs(bandMid - cy) + size * 0.42) * 1.7;

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.26)";
    c.shadowBlur = Math.max(6, w * 0.03);
    c.shadowOffsetY = Math.max(2, h * 0.012);
  }
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.fillStyle = s.paper;
  c.fill();
  c.restore();

  c.save();
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.clip();
  if (s.image) {
    drawCover(c, s.image, x + pad, y + pad, inner, inner);
  } else {
    c.fillStyle = "rgba(29,36,32,.05)";
    c.fillRect(x, y, w, h);
    c.fillStyle = "rgba(29,36,32,.34)";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 " + Math.max(9, inner * 0.075) + "px " + family;
    c.fillText("Add your photo", cx, cy - inner * 0.12);
  }
  if (message) {
    // The band is the card showing through, so the message stays readable over any photo.
    c.save();
    c.fillStyle = s.paper;
    c.globalAlpha = 0.9;
    c.fillRect(x + pad - 1, bandTop, inner + 2, bandH + 1);
    c.restore();
    c.save();
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = Math.min(bandH * 0.62, inner * 0.26);
    for (; size > 8; size -= 1) {
      c.font = "600 " + size + "px " + family;
      if (c.measureText(message).width <= messageW(size)) break;
    }
    c.font = "600 " + size + "px " + family;
    c.fillText(message, cx, bandMid, messageW(size));
    c.restore();
  }
  c.restore();

  // A hairline keeps the silhouette reading as card stock; the dashed ring is the cut line.
  c.save();
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = Math.max(0.8, inner * 0.004);
  cupcakeShapePath(c, s.shape, x + pad, y + pad, inner, inner);
  c.stroke();
  c.setLineDash([Math.max(2, inner * 0.055), Math.max(2, inner * 0.04)]);
  c.strokeStyle = "rgba(29,36,32,.34)";
  c.lineWidth = Math.max(0.9, inner * 0.005);
  cupcakeShapePath(c, s.shape, x + pad * 0.5, y + pad * 0.5, inner + pad, inner + pad);
  c.stroke();
  c.restore();
}

/** Builds one of the four topper silhouettes inside the given square box. */
function cupcakeShapePath(c, shape, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  if (shape === "square") {
    c.beginPath();
    c.rect(x, y, w, h);
    return;
  }
  if (shape === "rounded") {
    roundRect(c, x, y, w, h, Math.min(w, h) * 0.16);
    return;
  }
  const radius = Math.min(w, h) / 2;
  c.beginPath();
  if (shape === "scallop") {
    // Sixteen shallow lobes give the edge a frilled look without changing the cut size.
    const lobes = 16;
    const steps = lobes * 12;
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * Math.PI * 2 - Math.PI / 2;
      const rr = radius * 0.955 + radius * 0.045 * Math.cos(lobes * t);
      const px = cx + Math.cos(t) * rr;
      const py = cy + Math.sin(t) * rr;
      if (i) c.lineTo(px, py);
      else c.moveTo(px, py);
    }
    c.closePath();
    return;
  }
  // The classic circle is also the fallback for an unknown value.
  c.arc(cx, cy, radius, 0, Math.PI * 2);
  c.closePath();
}

/**
 * A printed photo booth strip. The paper, the frame gutters and the caption band all move with
 * the product size, so the same painter draws a single 2 x 6 in strip and the 4 x 6 in sheet
 * that carries two of them. The preview adds a drop shadow; the export never does.
 */
function drawPhotoStrip(c, s, guides) {
  const r = s.rect;
  const cols = Math.max(1, Number(s.spec.cols) || 1);
  const colW = r.w / cols;
  const radius = Math.min(colW * 0.1, r.h * 0.022);
  const ink = readableInk(s.paper);
  const quiet = ink === "#ffffff" ? "rgba(255,255,255," : "rgba(29,36,32,";
  const padX = colW * 0.085;
  const padY = colW * 0.075;
  const gutter = colW * 0.045;
  const captionH = s.caption ? colW * 0.3 : 0;
  const frameW = Math.max(8, colW - padX * 2);
  const framesH = Math.max(8, r.h - padY * 2 - captionH);
  const cellH = Math.max(8, (framesH - gutter * (s.count - 1)) / s.count);

  c.save();
  if (guides) {
    c.shadowColor = "rgba(29,36,32,.2)";
    c.shadowBlur = 26;
    c.shadowOffsetY = 12;
  }
  c.fillStyle = s.paper;
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fill();
  c.restore();

  for (let col = 0; col < cols; col += 1) {
    const cx = r.x + colW * col + padX;
    for (let i = 0; i < s.count; i += 1) {
      const cy = r.y + padY + i * (cellH + gutter);
      const photo = s.photos[i];
      c.save();
      roundRect(c, cx, cy, frameW, cellH, Math.min(frameW, cellH) * 0.045);
      c.clip();
      if (photo) {
        drawCover(c, photo, cx, cy, frameW, cellH);
      } else {
        c.fillStyle = quiet + ".07)";
        c.fillRect(cx, cy, frameW, cellH);
        c.fillStyle = quiet + ".5)";
        c.font = "600 " + Math.max(9, Math.round(cellH * 0.17)) + "px " + DEFAULT_STRIP_FONT;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("Photo " + (i + 1), cx + frameW / 2, cy + cellH / 2);
      }
      c.restore();
    }

    if (s.caption) {
      const maxW = frameW * 0.98;
      let size = Math.max(9, Math.round(captionH * 0.46));
      c.save();
      c.fillStyle = ink;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "600 " + size + "px " + s.font;
      while (size > 8 && c.measureText(s.caption).width > maxW) {
        size -= 1;
        c.font = "600 " + size + "px " + s.font;
      }
      c.fillText(s.caption, cx + frameW / 2, r.y + r.h - padY - captionH / 2, maxW);
      c.restore();
    }
  }

  if (guides && cols > 1) {
    // Preview only: where the two strips are cut apart. The printed sheet stays clean.
    c.save();
    c.strokeStyle = "rgba(29,36,32,.35)";
    c.setLineDash([9, 7]);
    c.lineWidth = Math.max(1, colW * 0.008);
    c.beginPath();
    c.moveTo(r.x + colW, r.y + r.h * 0.012);
    c.lineTo(r.x + colW, r.y + r.h * 0.988);
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

/** The chosen acrylic finish, falling back to the clearest blank. */
function plateFinish() {
  const value = finishSelect?.value;
  return isNamePlateFinish(value) ? value : "clear";
}

/** The three etched lines on the plate, each clipped so a pasted essay cannot break the layout. */
function namePlateLines() {
  const clip = (input, max) => (input?.value || "").trim().slice(0, max);
  return { name: clip(plateName, 28), title: clip(plateTitle, 32), company: clip(plateCompany, 40) };
}

/**
 * The desk plate carries type and an optional logo rather than a traced photo. A blank
 * canvas stands in for the artwork so the shared upload, preview and download plumbing
 * keeps working; the painter never reads it.
 */
function namePlateBlank() {
  const c = document.createElement("canvas");
  c.width = WORK_LONG_SIDE;
  c.height = Math.round(WORK_LONG_SIDE * 0.2);
  return c;
}

/** A desk name plate: a long acrylic slab etched with a name over a title and a company line. */
function drawNamePlate(c, s, guides) {
  const r = s.rect;
  const radius = Math.min(r.w, r.h) * 0.14;
  const bevel = Math.max(3, Math.min(r.w, r.h) * 0.055);
  const dark = s.finish === "black";

  if (guides) {
    // The wedge a desk name plate actually stands in. Preview only: it never enters a file.
    const baseH = Math.max(14, r.h * 0.3);
    const bx = r.x + r.w * 0.02;
    const bw = r.w * 0.96;
    const by = r.y + r.h + bevel * 1.4;
    c.save();
    c.shadowColor = "rgba(29,36,32,.28)";
    c.shadowBlur = bevel * 1.4;
    c.shadowOffsetY = bevel * 0.6;
    const metal = c.createLinearGradient(bx, by, bx, by + baseH);
    metal.addColorStop(0, "#d3d8d5");
    metal.addColorStop(0.42, "#939b96");
    metal.addColorStop(1, "#6a716d");
    c.fillStyle = metal;
    roundRect(c, bx, by, bw, baseH, baseH * 0.42);
    c.fill();
    c.restore();
    c.save();
    c.globalAlpha = 0.16;
    c.fillStyle = dark ? "#0f1211" : "#7c8681";
    roundRect(c, bx, by, bw, baseH * 0.52, baseH * 0.3);
    c.fill();
    c.restore();

    // A soft contact shadow so the slab sits on the stand instead of floating over it.
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = bevel * 1.6;
    c.shadowOffsetY = bevel * 0.8;
    c.fillStyle = dark ? "#171b1a" : "#ffffff";
    roundRect(c, r.x, r.y, r.w, r.h, radius);
    c.fill();
    c.restore();
  }

  // The acrylic body: a vertical gradient so the slab reads as material, not a flat swatch.
  const body = c.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  if (dark) {
    body.addColorStop(0, "#343b38");
    body.addColorStop(0.44, "#1c211f");
    body.addColorStop(1, "#0d1110");
  } else if (s.finish === "frosted") {
    body.addColorStop(0, "#fdfdfb");
    body.addColorStop(0.5, "#ecefeb");
    body.addColorStop(1, "#d6dcd7");
  } else {
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.5, "#f3f6f4");
    body.addColorStop(1, "#dbe4df");
  }
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.fillStyle = body;
  c.fill();
  c.restore();

  // A glass sheen across the face, the way a polished acrylic plate catches the light.
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.clip();
  const sheen = c.createLinearGradient(r.x, r.y + r.h, r.x + r.w * 0.7, r.y);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.4, "rgba(255,255,255,0)");
  sheen.addColorStop(0.47, dark ? "rgba(255,255,255,.13)" : "rgba(255,255,255,.5)");
  sheen.addColorStop(0.56, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = sheen;
  c.fillRect(r.x, r.y, r.w, r.h);
  c.restore();

  // The etched frame and the inner bevel that a laser-cut acrylic plate carries.
  c.save();
  roundRect(c, r.x, r.y, r.w, r.h, radius);
  c.strokeStyle = dark ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.9)";
  c.lineWidth = Math.max(1.4, bevel * 0.24);
  c.stroke();
  roundRect(c, r.x + bevel * 0.5, r.y + bevel * 0.5, r.w - bevel, r.h - bevel, radius * 0.86);
  c.strokeStyle = dark ? "rgba(0,0,0,.5)" : "rgba(29,36,32,.14)";
  c.lineWidth = 1.2;
  c.stroke();
  c.restore();

  drawNamePlateText(c, s, r.x, r.y, r.w, r.h, guides);
  if (markSize(s.logo).w) drawNamePlateLogo(c, s, r.x, r.y, r.w, r.h);
}

/**
 * The etched copy: a name in the chosen face, a smaller title under it and an optional
 * company line. The lines centre as one block, so a plate with no title still sits level.
 * An empty name shows a light placeholder in the preview and nothing at all in a download.
 */
function drawNamePlateText(c, s, x, y, w, h, guides) {
  const lines = s.lines || {};
  const ghost = !lines.name;
  const name = lines.name || (guides ? "Your Name" : "");
  if (!name) return;
  const family = nameFont?.value || DEFAULT_NAME_FONT;
  const dark = s.finish === "black";
  const ink = dark ? "#f4f1ea" : "#1d2420";
  const halo = dark ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.8)";
  const padX = w * 0.05;
  const logoRoom = markSize(s.logo).w ? w * 0.21 : 0;
  const maxWidth = w - padX * 2 - logoRoom;
  const nameSize = fitFont(c, name, maxWidth, h * 0.36, family, 700);
  const titleSize = lines.title ? fitFont(c, lines.title, maxWidth, h * 0.18, family, 600) : 0;
  const companySize = lines.company ? fitFont(c, lines.company, maxWidth, h * 0.155, family, 600) : 0;
  const gap = h * 0.045;
  const blockH = nameSize + (titleSize ? gap + titleSize : 0) + (companySize ? gap + companySize : 0);
  let cursor = y + (h - blockH) / 2;

  const drawLine = (text, size, weight, opacity) => {
    const cy = cursor + size / 2;
    c.save();
    c.font = weight + " " + size + "px " + family;
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.globalAlpha = opacity;
    c.lineWidth = Math.max(2.5, size * 0.16);
    c.strokeStyle = halo;
    c.strokeText(text, x + padX, cy);
    c.fillStyle = ink;
    c.fillText(text, x + padX, cy);
    c.restore();
    cursor += size + gap;
  };

  drawLine(name, nameSize, 700, ghost ? 0.4 : 1);
  if (titleSize) drawLine(lines.title, titleSize, 600, 0.92);
  if (companySize) drawLine(lines.company, companySize, 600, 0.78);
}

/** Optional logo mark, pinned right of the plate and fitted whole inside its own tile. */
function drawNamePlateLogo(c, s, x, y, w, h) {
  const img = s.logo;
  const size = markSize(img);
  const tile = Math.min(h * 0.62, w * 0.16);
  const bx = x + w - w * 0.05 - tile;
  const by = y + (h - tile) / 2;
  const scale = Math.min(tile / size.w, tile / size.h);
  const dw = size.w * scale;
  const dh = size.h * scale;
  c.save();
  c.beginPath();
  roundRect(c, bx, by, tile, tile, tile * 0.2);
  c.clip();
  c.fillStyle = "rgba(255,255,255,.92)";
  c.fillRect(bx, by, tile, tile);
  c.drawImage(img, bx + (tile - dw) / 2, by + (tile - dh) / 2, dw, dh);
  c.restore();
  c.save();
  roundRect(c, bx, by, tile, tile, tile * 0.2);
  c.strokeStyle = "rgba(29,36,32,.16)";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

/** A coaster blank: square or round acrylic with the photo cover-fitted and a clear rim. */
function drawCoaster(c, s, guides) {
  const r = s.rect;
  const round = s.shape === "round";
  const rim = Math.max(6, Math.min(r.w, r.h) * 0.035);
  const trace = (x, y, w, h) => {
    c.beginPath();
    if (round) c.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    else roundRect(c, x, y, w, h, Math.min(w, h) * 0.08);
  };
  if (guides) {
    // The drop shadow sells the acrylic thickness on screen and stays out of the export.
    c.save();
    c.shadowColor = "rgba(29,36,32,.22)";
    c.shadowBlur = rim * 1.5;
    c.shadowOffsetY = rim * 0.7;
    trace(r.x + rim * 0.5, r.y + rim * 0.5, r.w - rim, r.h - rim);
    c.fillStyle = "#f7f5ef";
    c.fill();
    c.restore();
  }
  trace(r.x, r.y, r.w, r.h);
  c.save();
  c.fillStyle = "#fffdf8";
  c.fill();
  c.strokeStyle = "rgba(29,36,32,.18)";
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();
  c.save();
  trace(r.x + rim, r.y + rim, r.w - rim * 2, r.h - rim * 2);
  c.clip();
  drawCover(c, s.image, r.x + rim, r.y + rim, r.w - rim * 2, r.h - rim * 2);
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

// ------------------------------------------------------------------ luggage tag

/** Up to two engraved lines: a name on top and one contact line under it. */
function luggageTagLines() {
  const name = (engravingInput?.value || "").trim().slice(0, 24);
  const contact = (contactInput?.value || "").trim().slice(0, 30);
  return [name, contact].filter(Boolean);
}

/**
 * Etched contact block. The lines climb from the base of the tag, shrinking to fit the
 * width at each band, with a soft dark halo so the text survives a busy photo and a print.
 */
function drawTagText(c, lines, x, y, w, h) {
  if (!lines || !lines.length) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const base = Math.min(w, h);
  const maxWidth = w * 0.78;
  let cursor = y + h * 0.9;
  for (let i = lines.length - 1; i >= 0; i--) {
    const text = lines[i];
    const startSize = base * (i === 0 ? 0.12 : 0.085);
    const size = fitFont(c, text, maxWidth, startSize, family, 700);
    cursor -= size * 0.72;
    c.save();
    c.font = "700 " + size + "px " + family;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.lineWidth = Math.max(3, size * 0.17);
    c.strokeStyle = "rgba(29,36,32,.5)";
    c.strokeText(text, x + w / 2, cursor);
    c.fillStyle = "#ffffff";
    c.fillText(text, x + w / 2, cursor);
    c.restore();
    cursor -= size * 0.6;
  }
}

function drawLuggageTag(c, s, guides) {
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

  // Clear acrylic tag face with the photo behind it and the contact block etched on top.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawTagText(c, s.lines, r.x, r.y, r.w, r.h);
  c.restore();

  // The strap hole is punched out, so the exported file can be printed and cut as-is.
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
    drawTagStrap(c, hole);
  }
}

/** Preview-only strap loop, so the mockup reads as a tag tied to a bag handle. */
function drawTagStrap(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(4, r * 0.42);
  c.strokeStyle = "#8a6a45";
  c.beginPath();
  c.arc(hole.cx, hole.cy - r * 1.7, r * 1.6, Math.PI * 1.15, Math.PI * 1.85);
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.35)";
  c.lineWidth = Math.max(1, r * 0.1);
  c.stroke();
  c.restore();
}

// ------------------------------------------------------------------ bookmark

/** Up to two engraved lines: a title on top and a note or a date under it. */
function bookmarkLines() {
  const title = (engravingInput?.value || "").trim().slice(0, 28);
  const note = (contactInput?.value || "").trim().slice(0, 32);
  return [title, note].filter(Boolean);
}

/**
 * Etched caption for a bookmark. A bookmark slab is narrow, so the type is measured against
 * the width of the slab rather than its height, and the lines sit low on the face so the
 * photo keeps the top two thirds of the piece. The ribbon notch and the tapered tip both eat
 * into the bottom of the silhouette, so those shapes lift the caption clear of the cut line.
 */
function drawBookmarkText(c, lines, x, y, w, h, shape) {
  if (!lines || !lines.length) return;
  const family = "Inter, 'Segoe UI', system-ui, sans-serif";
  const maxWidth = w * 0.84;
  const taper = shape === "notch" ? h * 0.16 : shape === "pointed" ? h * 0.2 : 0;
  let cursor = y + h - taper - w * 0.12;
  for (let i = lines.length - 1; i >= 0; i--) {
    const text = lines[i];
    const startSize = w * (i === 0 ? 0.24 : 0.15);
    const size = fitFont(c, text, maxWidth, startSize, family, 700);
    cursor -= size * 0.75;
    c.save();
    c.font = "700 " + size + "px " + family;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.lineWidth = Math.max(3, size * 0.2);
    c.strokeStyle = "rgba(29,36,32,.5)";
    c.strokeText(text, x + w / 2, cursor);
    c.fillStyle = "#ffffff";
    c.fillText(text, x + w / 2, cursor);
    c.restore();
    cursor -= size * 0.62;
  }
}

function drawBookmark(c, s, guides) {
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

  // Acrylic bookmark face: the photo fills the slab and the caption is etched on top.
  c.save();
  c.beginPath();
  addPolygon(c, s.outline);
  c.clip();
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  drawCover(c, s.image, r.x, r.y, r.w, r.h);
  drawBookmarkText(c, s.lines, r.x, r.y, r.w, r.h, s.shape);
  c.restore();

  // The tassel hole is punched out, so the exported file can be printed and cut as-is.
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
    drawTassel(c, hole);
  }
}

/** Preview-only tassel, so the mockup reads as a bookmark with a cord through the hole. */
function drawTassel(c, hole) {
  const r = hole.r;
  c.save();
  c.lineCap = "round";
  c.lineWidth = Math.max(3, r * 0.34);
  c.strokeStyle = "#b8894f";
  c.beginPath();
  c.moveTo(hole.cx, hole.cy);
  c.quadraticCurveTo(hole.cx + r * 1.1, hole.cy - r * 4, hole.cx + r * 2, hole.cy - r * 6.4);
  c.stroke();
  const bx = hole.cx + r * 2;
  const by = hole.cy - r * 6.4;
  for (let i = -2; i <= 2; i++) {
    c.strokeStyle = i % 2 ? "#a9762f" : "#d0a05c";
    c.lineWidth = Math.max(2, r * 0.2);
    c.beginPath();
    c.moveTo(bx, by);
    c.quadraticCurveTo(bx + i * r * 0.5, by + r * 3.2, bx + i * r * 0.95, by + r * 6.4);
    c.stroke();
  }
  c.restore();
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

// ------------------------------------------------------------------ cake topper

/** The traced letters, scaled from the traced source into the live preview box. */
function topperOutline(L) {
  if (!rawContours || !rawContours.length) return [];
  const sx = L.w / rawSource.width;
  const sy = L.h / rawSource.height;
  const tolerance = Math.max(0.4, Math.min(L.w, L.h) / 520);
  return rawContours.map((contour) => {
    const simplified = simplifyPath(contour, tolerance);
    return scalePath(simplified, sx, sy).map(([x, y]) => [x + L.x, y + L.y]);
  });
}

function drawCakeTopper(c, s, guides) {
  const r = s.rect;
  if (!s.outline.length) return;
  const depth = Math.max(3, Math.min(r.w, r.h) * 0.014);

  if (guides) {
    // The dowel is decoration: it sits behind the acrylic and never reaches the export.
    drawTopperStick(c, r);
    c.save();
    c.globalAlpha = 0.16;
    c.translate(depth * 1.4, depth * 2.2);
    c.fillStyle = "#1d2420";
    c.beginPath();
    for (const pts of s.outline) addPolygon(c, pts);
    c.fill("evenodd");
    c.restore();
  }

  // Acrylic face: a white sheet with the optional photo floated inside the cut shape.
  c.save();
  c.beginPath();
  for (const pts of s.outline) addPolygon(c, pts);
  c.clip("evenodd");
  c.fillStyle = "#ffffff";
  c.fillRect(r.x, r.y, r.w, r.h);
  if (s.image && s.image.naturalWidth) drawCover(c, s.image, r.x, r.y, r.w, r.h);
  c.restore();

  if (guides) {
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = 1.6;
    c.strokeStyle = "rgba(239,105,76,.9)";
    c.beginPath();
    for (const pts of s.outline) addPolygon(c, pts);
    c.stroke();
    c.restore();
  }
}

/** Preview-only dowel, so the mockup reads as a topper standing in a cake. */
function drawTopperStick(c, r) {
  const width = Math.max(7, Math.min(r.w, r.h) * 0.055);
  const cx = r.x + r.w / 2;
  const top = r.y + r.h * 0.6;
  const bottom = r.y + r.h + Math.max(90, r.h * 0.8);
  c.save();
  c.fillStyle = "#f1e7d4";
  c.strokeStyle = "rgba(122,104,76,.45)";
  c.lineWidth = 1.2;
  roundRect(c, cx - width / 2, top, width, bottom - top, width * 0.4);
  c.fill();
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

/** Natural pixel size of a loaded image, or zeroes when there is nothing to place. */
function markSize(img) {
  if (!img) return { w: 0, h: 0 };
  return { w: img.naturalWidth || img.width || 0, h: img.naturalHeight || img.height || 0 };
}
function roundRect(c, x, y, w, h, radius) {
  c.beginPath();
  if (typeof c.roundRect === "function") c.roundRect(x, y, w, h, radius);
  else c.rect(x, y, w, h);
}

// ------------------------------------------------------------------ export

function sceneBox() {
  if (scene.kind === "sticker" || scene.kind === "sticker-outline") {
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
  if (scene.kind === "cake-topper") {
    // The traced letters decide the export box, so the empty artboard around them is dropped.
    const b = boundsOfContours(scene.outline);
    if (!b) return null;
    const pad = 2;
    return { x: b.minX - pad, y: b.minY - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
  }
  if (scene.kind === "coaster" || scene.kind === "name-plate" || scene.kind === "jigsaw" || scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark" || scene.kind === "photo-strip" || scene.kind === "table-number" || scene.kind === "place-card" || scene.kind === "polaroid" || scene.kind === "cupcake") {
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
  else if (scene.kind === "sticker-outline") drawStickerOutline(c, scene, false);
  else if (scene.kind === "photo-keychain") drawPhotoKeychain(c, scene, false);
  else if (scene.kind === "name-keychain") drawNameKeychain(c, scene, false);
  else if (scene.kind === "coaster") drawCoaster(c, scene, false);
  else if (scene.kind === "name-plate") drawNamePlate(c, scene, false);
  else if (scene.kind === "magnet") drawMagnet(c, scene);
  else if (scene.kind === "ornament") drawOrnament(c, scene, false);
  else if (scene.kind === "luggage-tag") drawLuggageTag(c, scene, false);
  else if (scene.kind === "bookmark") drawBookmark(c, scene, false);
  else if (scene.kind === "cake-topper") drawCakeTopper(c, scene, false);
  else if (scene.kind === "block") drawBlock(c, scene, false);
  else if (scene.kind === "jigsaw") drawJigsaw(c, scene, false);
  else if (scene.kind === "photo-strip") drawPhotoStrip(c, scene, false);
  else if (scene.kind === "table-number") drawTableNumber(c, scene, false);
  else if (scene.kind === "place-card") drawPlaceCardSheet(c, scene, false);
  else if (scene.kind === "polaroid") drawPolaroid(c, scene, false);
  else if (scene.kind === "cupcake") drawCupcake(c, scene, false);
  else drawStandee(c, scene);
  return { canvas: out, box };
}

/**
 * The printable outline of the finished object, in work pixels. It is deliberately not the
 * 620 px artboard: a die-cut star inside a square frame is only as wide as the star.
 */
function pieceBox() {
  if (scene.kind === "sticker" || scene.kind === "sticker-outline") {
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
  if (scene.kind === "cake-topper") {
    const b = boundsOfContours(scene.outline);
    return b ? { width: b.width, height: b.height, x: b.minX, y: b.minY } : { width: WORK_LONG_SIDE, height: WORK_LONG_SIDE, x: 0, y: 0 };
  }
  if (scene.kind === "coaster" || scene.kind === "name-plate" || scene.kind === "jigsaw" || scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark" || scene.kind === "photo-strip" || scene.kind === "table-number" || scene.kind === "place-card" || scene.kind === "polaroid" || scene.kind === "cupcake") {
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
  const stem = scene.kind === "cupcake" && scene.topper
    ? "cupcake-topper-" + scene.topper.id + (scene.sheet ? "-" + scene.sheet.id + "-sheet" : "")
    : scene.kind === "polaroid" && scene.frame
    ? "polaroid-" + scene.frame.id + (scene.sheet ? "-" + scene.sheet.id + "-sheet" : "")
    : scene.kind === "table-number" && scene.spec
    ? "table-number-" + scene.spec.id
    : scene.kind === "place-card" && scene.spec
      ? "place-cards-" + scene.spec.id + "-sheet-" + (scene.page + 1)
      : scene.spec
        ? scene.spec.id + "in-" + profile.id
      : scene.kind === "jigsaw" && scene.grid
        ? profile.id + "-" + scene.grid.id + "-" + scene.longSideCm + "cm"
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
  if (scene.kind === "cake-topper") return exportTopperSvg();
  if (scene.kind === "coaster") return exportCoasterSvg();
  if (scene.kind === "name-plate") return exportNamePlateSvg();
  if (scene.kind === "jigsaw") return exportJigsawSvg();
  if (scene.kind === "sticker-outline") return exportStickerOutlineSvg();
  if (scene.kind === "ornament" || scene.kind === "luggage-tag" || scene.kind === "bookmark") return exportOrnamentSvg();
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

/**
 * Border layer plus the artwork, drawn in the same order the canvas uses. The extra hairline
 * edge marks where the artwork stops and the border starts, which is handy when the sticker is
 * placed on a light page and a white border would otherwise be invisible.
 */
function exportStickerOutlineSvg() {
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
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '" role="img">',
    "<title>" + profile.product + " - " + scene.borderMm + " mm border, " + scene.longSideCm + " cm long side, " + PRINT_DPI + " DPI</title>",
    '<g id="StickerOutline">',
    '<path id="Border" d="' + contoursToPathD(scene.outline.map(tx), 2) + '" fill="' + scene.border + '" fill-rule="evenodd"/>',
    '<image id="Artwork" x="' + (r.x - box.x) * scale + '" y="' + (r.y - box.y) * scale + '" width="' + art.width + '" height="' + art.height + '" href="' + art.toDataURL("image/png") + '"/>',
    '<path id="Edge" d="' + contoursToPathD(scene.base.map(tx), 2) + '" fill="none" stroke="rgba(0,0,0,.10)" stroke-width="1"/>',
    "</g>",
    "</svg>",
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/**
 * A five-petal bloom on a transparent background: solid, clean-edged shapes that trace into a
 * tidy silhouette, so the border is the first thing a visitor sees before they upload anything.
 */
function stickerOutlineSampleArtwork() {
  const c = document.createElement("canvas");
  c.width = 880;
  c.height = 880;
  const x = c.getContext("2d");
  x.translate(440, 430);
  const leaf = (angle, length, wide) => {
    x.save();
    x.rotate(angle);
    x.beginPath();
    x.moveTo(0, 30);
    x.quadraticCurveTo(wide, -length * 0.4, 0, -length);
    x.quadraticCurveTo(-wide, -length * 0.4, 0, 30);
    x.closePath();
    x.fillStyle = "#5f9463";
    x.fill();
    x.restore();
  };
  leaf(0.42, 300, 104);
  leaf(-0.42, 300, 104);
  for (let i = 0; i < 5; i++) {
    x.save();
    x.rotate((i / 5) * Math.PI * 2);
    x.beginPath();
    x.ellipse(0, -168, 106, 162, 0, 0, Math.PI * 2);
    x.fillStyle = i % 2 ? "#f2a0bd" : "#ec7ba3";
    x.fill();
    x.restore();
  }
  x.beginPath();
  x.arc(0, 0, 92, 0, Math.PI * 2);
  x.fillStyle = "#f6c351";
  x.fill();
  x.beginPath();
  x.arc(0, 0, 92, 0, Math.PI * 2);
  x.strokeStyle = "rgba(180,124,20,.35)";
  x.lineWidth = 6;
  x.stroke();
  return c;
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
  if (scene.kind === "bookmark") drawBookmarkText(ax, scene.lines, 0, 0, art.width, art.height, scene.shape);
  else if (scene.kind === "luggage-tag") drawTagText(ax, scene.lines, 0, 0, art.width, art.height);
  else drawOrnamentEngraving(ax, scene.text, 0, 0, art.width, art.height, localOutline);
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

/** Cut path plus a printable artwork layer for the square and round coaster blanks. */
function exportCoasterSvg() {
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
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm wide, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="CoasterShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#CoasterShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/** The plate face plus a real cut path, the same artwork/cutline split the other SVG tools ship. */
function exportNamePlateSvg() {
  const scale = exportScale();
  const box = sceneBox();
  if (!box) return note("The plate could not be measured. Please reload the page and try again.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const shape = contoursToPathD([scene.outline.map(tx)], 2);
  const art = document.createElement("canvas");
  art.width = Math.max(1, width);
  art.height = Math.max(1, height);
  const ax = art.getContext("2d");
  ax.scale(scale, scale);
  ax.translate(-box.x, -box.y);
  drawNamePlate(ax, scene, false);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.spec.id.replace("x", " x ")} in, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="PlateShape"><path d="${shape}"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#PlateShape)">`,
    `<image x="0" y="0" width="${width}" height="${height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

/**
 * The puzzle export is deliberately two layers: a printable artwork layer and one magenta
 * cut layer. The outline is closed and every interior cut is open, so a laser cutter reads
 * the grid as one shared cut per edge instead of two cuts that drift apart at the knobs.
 */
function exportJigsawSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box) return note("Upload a photo before exporting the puzzle.");
  const tx = ([x, y]) => [(x - box.x) * scale, (y - box.y) * scale];
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const outline = contoursToPathD([scene.outline.map(tx)], 2);
  const cuts = scene.cuts.map((cut) => '<path d="' + polylineToPathD(cut.map(tx), 2) + '"/>');
  const lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '" role="img">',
    '<title>Photo jigsaw puzzle cut file - ' + scene.grid.pieces + ' pieces, ' + scene.longSideCm + ' cm long side, ' + PRINT_DPI + " DPI</title>",
    '<g id="Artwork">',
    '<image x="0" y="0" width="' + art.width + '" height="' + art.height + '" href="' + art.toDataURL("image/png") + '"/>',
    "</g>",
    '<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">',
    '<path d="' + outline + '"/>',
    ...cuts,
    "</g>",
    "</svg>",
  ];
  downloadBlob(lines.join("\n"), exportName("svg"), "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm, pieces: scene.grid.pieces });
}

/** Cut path plus a printable artwork layer, the same split the sticker and ornament tools ship. */
function exportTopperSvg() {
  const scale = exportScale();
  const box = sceneBox();
  const r = scene.rect;
  if (!box || !scene.outline.length) return note("Type a name or a short message before exporting.");
  const tx = (points) => points.map(([x, y]) => [(x - box.x) * scale, (y - box.y) * scale]);
  const shape = contoursToPathD(scene.outline.map(tx), 2);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const art = document.createElement("canvas");
  art.width = Math.max(1, Math.round(r.w * scale));
  art.height = Math.max(1, Math.round(r.h * scale));
  const ax = art.getContext("2d");
  ax.fillStyle = "#ffffff";
  ax.fillRect(0, 0, art.width, art.height);
  if (scene.image) drawCover(ax, scene.image, 0, 0, art.width, art.height);
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">`,
    `<title>${profile.product} cutline - ${scene.longSideCm} cm wide, ${PRINT_DPI} DPI</title>`,
    `<defs><clipPath id="TopperShape"><path d="${shape}" clip-rule="evenodd"/></clipPath></defs>`,
    `<g id="Artwork" clip-path="url(#TopperShape)">`,
    `<image x="${round2((r.x - box.x) * scale)}" y="${round2((r.y - box.y) * scale)}" width="${art.width}" height="${art.height}" href="${art.toDataURL("image/png")}"/>`,
    `</g>`,
    `<g id="Cutline" fill="none" stroke="#ff00ff" stroke-width="1">`,
    `<path d="${shape}" fill-rule="evenodd"/>`,
    `</g>`,
    `</svg>`,
  ];
  downloadBlob(lines.join("\n"), `${profile.id}-${scene.longSideCm}cm-${PRINT_DPI}dpi.svg`, "image/svg+xml;charset=utf-8");
  track("design_downloaded", { format: "svg", dpi: PRINT_DPI, longSideCm: scene.longSideCm });
}

// ------------------------------------------------------------------ sample artwork

function sampleArtwork() {
  if (profile.id === "photo-keychain" || profile.id === "block" || profile.id === "luggage-tag" || profile.id === "pet-tag" || profile.id === "bookmark" || profile.id === "coaster" || profile.id === "jigsaw" || profile.id === "polaroid" || profile.id === "cupcake") return photoSampleArtwork();
  if (profile.id === "table-number") return photoSampleArtwork();
  if (profile.id === "sticker-outline") return stickerOutlineSampleArtwork();
  if (profile.id === "ornament") return ornamentSampleArtwork();
  if (profile.id === "name-keychain") return nameArtworkCanvas((nameInput?.value || "").trim() || "Tiny", nameFont?.value || "'Playfair Display', Georgia, serif");
  if (profile.id === "cake-topper") return topperArtworkCanvas(topperTextValue() || "Happy Birthday", topperFont?.value || DEFAULT_TOPPER_FONT, topperStyleName());
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
  // Centred, so a very narrow crop (a bookmark slab) still shows the whole sun instead of a sliver.
  x.arc(360, 170, 62, 0, Math.PI * 2);
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
  // Kept in the sky rather than along the base, so it never sits under the engraved caption.
  x.fillText("SAMPLE PHOTO", 360, 300);
  return c;
}

/** Four simple stand-in frames so the strip tool is worth trying before any upload. */
function photoStripSamplePhotos() {
  const scenes = [
    ["#f8dcbd", "#e39a63", "#1d2420"],
    ["#d3e6f1", "#84aecb", "#1d2420"],
    ["#e5ead4", "#a3b98a", "#1d2420"],
    ["#f1d8e2", "#c287a6", "#1d2420"],
  ];
  return scenes.map((entry, index) => {
    const c = document.createElement("canvas");
    c.width = 900;
    c.height = 900;
    const x = c.getContext("2d");
    const sky = x.createLinearGradient(0, 0, 0, 900);
    sky.addColorStop(0, entry[0]);
    sky.addColorStop(1, entry[1]);
    x.fillStyle = sky;
    x.fillRect(0, 0, 900, 900);
    x.fillStyle = "rgba(255,255,255,.72)";
    x.beginPath();
    x.arc(300 + index * 90, 240 + index * 46, 104 + index * 14, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "rgba(29,36,32,.18)";
    x.beginPath();
    x.moveTo(0, 640);
    x.quadraticCurveTo(450, 545 + index * 26, 900, 660);
    x.lineTo(900, 900);
    x.lineTo(0, 900);
    x.closePath();
    x.fill();
    x.fillStyle = "rgba(29,36,32,.5)";
    x.textAlign = "center";
    x.font = "600 44px 'Trebuchet MS', 'Segoe UI', sans-serif";
    x.fillText("SAMPLE " + (index + 1), 450, 830);
    return c;
  });
}

async function loadSample() {
  if (profile.id === "photo-strip") {
    // The strip sample is four frames plus a caption, which is what a finished strip looks like.
    note("Loading a sample strip so you can try the tool...");
    const frames = photoStripSamplePhotos();
    stripPhotos = [];
    for (const frame of frames) {
      try {
        stripPhotos.push(await loadImage(frame.toDataURL("image/png")));
      } catch (error) {
        // Skip a frame that will not decode rather than dropping the whole sample.
      }
    }
    if (!stripPhotos.length) return note("The sample could not load. Please upload photos instead.");
    if (stripCaptionInput && !stripCaptionInput.value.trim()) stripCaptionInput.value = "Tiny County Makers";
    setDownloadsEnabled(true);
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "place-card") {
    // The sample is a short guest list with the meal choices filled in, which is what a finished
    // sheet of place cards looks like once it is printed and cut.
    if (placeCardList && !placeCardList.value.trim()) {
      placeCardList.value = [
        "Sarah Chen, chicken",
        "Michael Ross, beef",
        "Priya Raman, vegetarian",
        "Tom Whitfield, fish",
        "Grace Okafor, kids",
        "Daniel & Elise Moreau, beef",
        "Hannah Blake, chicken",
        "Omar Haddad, vegetarian",
      ].join("\n");
    }
    placeCardPage = 0;
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "cupcake") {
    // A finished topper is the best demo, so the sample fills the disc and leaves a message.
    note("Loading a sample photo so you can try the tool...");
    if (cupcakeText && !cupcakeText.value.trim()) cupcakeText.value = "Happy Birthday";
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "polaroid") {
    // A finished frame is the best demo, so the sample fills the window and leaves a caption in
    // the border the way a real instant photo would.
    note("Loading a sample photo so you can try the tool...");
    if (polaroidCaption && !polaroidCaption.value.trim()) polaroidCaption.value = "Summer, 2026";
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "table-number") {
    // The sample is a finished card, so the number and the names are filled in the way a real
    // visitor would fill them and the shared sample photo stands in for their picture.
    if (tableNumberText && !tableNumberText.value.trim()) tableNumberText.value = "12";
    if (tableNumberNames && !tableNumberNames.value.trim()) tableNumberNames.value = "Sarah & James";
    note("Loading a sample photo so you can try the tool...");
    const ok = await adoptImage(sampleArtwork().toDataURL("image/png"));
    if (!ok) return note("The sample could not load. Please upload a photo instead.");
    adoptSource("sample");
    track("sample_loaded", { product: profile.id });
    return;
  }
  if (profile.id === "name-plate") {
    // The plate sample is typed copy plus a logo mark, so the shared sample canvas stands in
    // for the logo and the fields are filled the way a real visitor would fill them.
    if (plateName) plateName.value = "Eleanor Whitfield";
    if (plateTitle) plateTitle.value = "Principal Designer";
    if (plateCompany) plateCompany.value = "Whitfield Studio";
    if (finishSelect) finishSelect.value = "black";
    try {
      plateLogo = await loadImage(sampleArtwork().toDataURL("image/png"));
    } catch (error) {
      plateLogo = null;
    }
    adoptSource("sample");
    render();
    track("sample_loaded", { product: profile.id });
    return;
  }
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
  const params = new URLSearchParams(location.search);
  const qaMode = params.has("qa") ? params.get("qa") : null;
  if (!endpoint || !location.hostname.endsWith("github.io") || navigator.doNotTrack === "1") return;
  if (qaMode !== null && qaMode !== "track") return;
  const sessionId = sessionStorage.getItem("tcm-analytics-session") || (qaMode === "track" ? "qa_" : "") + crypto.randomUUID().replaceAll("-", "");
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

/* Privacy-first engagement signals: how long a visitor actually spends on a tool. */
(() => {
  let activeSeconds = 0;
  let scrolledHalfway = false;
  setInterval(() => {
    if (document.visibilityState !== "visible" || !document.hasFocus()) return;
    activeSeconds += 1;
    if (activeSeconds === 10) track("engaged_10s");
    if (activeSeconds === 30) track("engaged_30s");
  }, 1000);
  document.addEventListener("scroll", () => {
    if (scrolledHalfway) return;
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    if (scrollable > 0 && scrollY / scrollable >= 0.5) {
      scrolledHalfway = true;
      track("scroll_50");
    }
  }, { passive: true });
})();

/* Mobile tools menu: the long nav collapses behind one button on small screens. */
(() => {
  const header = document.querySelector("header.top");
  const nav = header && header.querySelector("nav");
  if (!header || !nav || header.querySelector(".nav-toggle")) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open the tools menu");
  toggle.innerHTML = "<i></i><i></i><i></i>";
  if (!nav.id) nav.id = "site-nav";
  toggle.setAttribute("aria-controls", nav.id);
  header.append(toggle);
  header.classList.add("nav-ready");

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close the tools menu" : "Open the tools menu");
  };
  const isOpen = () => header.classList.contains("nav-open");

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  addEventListener("resize", () => {
    if (isOpen() && innerWidth > 860) setOpen(false);
  });
})();
