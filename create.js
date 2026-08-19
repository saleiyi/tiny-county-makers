const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const canvas = $("#canvas");
const ctx = canvas.getContext("2d");
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const automaticCutoutEnabled = window.TCM_CONFIG?.automaticCutoutEnabled === true;
const templateImages = { 800: new Image(), standard: new Image() };
// Relative paths preserve the original single-file workflow when create.html is
// opened directly from disk, while also working on localhost and static hosts.
templateImages[800].src = "./assets/keychain-template-800.png";
templateImages.standard.src = "./assets/keychain-template.png";

const state = {
  sourceFile: null,
  sourceBlob: null,
  cutoutBlob: null,
  art: null,
  shape: "rectangular",
  step: 1,
  reference: "",
  metrics: null,
  cutlineCanvas: null,
  productionCanvas: null,
  manualTool: "erase",
  manualOriginal: null,
  manualBase: null,
  manualHistory: [],
  cart: [],
  currentCartCopies: 0,
};
const manualCanvas = $("#manualCanvas");
const manualCtx = manualCanvas.getContext("2d", { willReadFrequently: true });
let manualDrawing = false;
let manualLastPoint = null;
const demoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720"><rect width="600" height="720" fill="#fff"/><path fill="#ef694c" d="M300 75c55 0 96 65 77 121 53-27 124 5 136 59 12 56-39 111-97 109 45 40 41 115-6 150-47 35-116 8-136-48-20 56-89 83-136 48-47-35-51-110-6-150-58 2-109-53-97-109 12-54 83-86 136-59-19-56 22-121 77-121Z"/><circle cx="300" cy="320" r="104" fill="#ffd35a"/><circle cx="266" cy="300" r="10" fill="#282c29"/><circle cx="334" cy="300" r="10" fill="#282c29"/><path d="M255 345q45 45 90 0" fill="none" stroke="#282c29" stroke-width="12" stroke-linecap="round"/><path d="M300 520v130" stroke="#4f9b68" stroke-width="35" stroke-linecap="round"/><path d="M300 585q-90-70-118 20 65 55 118 18M300 585q90-70 118 20-65 55-118 18" fill="#68b57f"/></svg>`;

function loadImageFromBlob(blob, name = "design") {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      state.art = trimImage(image);
      state.reference = `TCM-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      URL.revokeObjectURL(url);
      $("#status").textContent = `${name.replace(/\.[^.]+$/, "")} · preview ready`;
      render();
      resolve();
    };
    image.onerror = reject;
    image.src = url;
  });
}

function imageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob), image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = reject; image.src = url;
  });
}

async function setupManualEditor(cutoutBlob, originalBlob) {
  if (!cutoutBlob || !originalBlob) return;
  const [cutout, original] = await Promise.all([imageFromBlob(cutoutBlob), imageFromBlob(originalBlob)]);
  const editorScale = Math.min(1, 1600 / Math.max(cutout.naturalWidth, cutout.naturalHeight));
  manualCanvas.width = Math.max(1, Math.round(cutout.naturalWidth * editorScale));
  manualCanvas.height = Math.max(1, Math.round(cutout.naturalHeight * editorScale));
  manualCtx.clearRect(0, 0, manualCanvas.width, manualCanvas.height); manualCtx.drawImage(cutout, 0, 0);
  const originalCanvas = document.createElement("canvas"); originalCanvas.width = manualCanvas.width; originalCanvas.height = manualCanvas.height;
  originalCanvas.getContext("2d").drawImage(original, 0, 0, manualCanvas.width, manualCanvas.height);
  const baseCanvas = document.createElement("canvas"); baseCanvas.width = manualCanvas.width; baseCanvas.height = manualCanvas.height; baseCanvas.getContext("2d").drawImage(cutout, 0, 0);
  state.manualOriginal = originalCanvas; state.manualBase = baseCanvas; state.manualHistory = [];
  $("#manualEditor").hidden = false; $("#undoManual").disabled = true;
}

function manualPoint(event) {
  const rect = manualCanvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * manualCanvas.width / rect.width, y: (event.clientY - rect.top) * manualCanvas.height / rect.height };
}

function paintManual(from, to) {
  const width = Number($("#brushSize").value);
  manualCtx.save(); manualCtx.lineCap = "round"; manualCtx.lineJoin = "round"; manualCtx.lineWidth = width;
  manualCtx.beginPath(); manualCtx.moveTo(from.x, from.y); manualCtx.lineTo(to.x, to.y);
  if (state.manualTool === "erase") { manualCtx.globalCompositeOperation = "destination-out"; manualCtx.strokeStyle = "rgba(0,0,0,1)"; }
  else { manualCtx.globalCompositeOperation = "source-over"; manualCtx.strokeStyle = manualCtx.createPattern(state.manualOriginal, "no-repeat"); }
  manualCtx.stroke(); manualCtx.restore();
}

manualCanvas.addEventListener("pointerdown", event => {
  if (!state.manualOriginal) return; event.preventDefault(); manualCanvas.setPointerCapture(event.pointerId);
  state.manualHistory.push(manualCtx.getImageData(0, 0, manualCanvas.width, manualCanvas.height)); if (state.manualHistory.length > 6) state.manualHistory.shift();
  $("#undoManual").disabled = false; manualDrawing = true; manualLastPoint = manualPoint(event); paintManual(manualLastPoint, { x: manualLastPoint.x + .01, y: manualLastPoint.y + .01 });
});
manualCanvas.addEventListener("pointermove", event => { if (!manualDrawing) return; const point = manualPoint(event); paintManual(manualLastPoint, point); manualLastPoint = point; });
manualCanvas.addEventListener("pointerup", () => { manualDrawing = false; manualLastPoint = null; });
manualCanvas.addEventListener("pointercancel", () => { manualDrawing = false; manualLastPoint = null; });

function trimImage(image) {
  const source = document.createElement("canvas");
  const sourceCtx = source.getContext("2d", { willReadFrequently: true });
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  sourceCtx.drawImage(image, 0, 0);
  const pixels = sourceCtx.getImageData(0, 0, source.width, source.height).data;
  let left = source.width, top = source.height, right = -1, bottom = -1;
  for (let y = 0; y < source.height; y += 1) for (let x = 0; x < source.width; x += 1) {
    if (pixels[(y * source.width + x) * 4 + 3] > 8) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) return source;
  const output = document.createElement("canvas");
  output.width = right - left + 1; output.height = bottom - top + 1;
  output.getContext("2d").drawImage(source, left, top, output.width, output.height, 0, 0, output.width, output.height);
  return output;
}

function fillBackground() {
  const key = $("#background").value;
  if (key === "white") ctx.fillStyle = "#fff";
  else {
    const colors = { lavender: ["#fbf9ff", "#e8dcf7", "#f4effc"], sky: ["#f8fcff", "#d9ecfb", "#eef7ff"], peach: ["#fffaf7", "#f8dfd5", "#fff2eb"], mint: ["#f9fffd", "#d9f1e8", "#effaf6"] }[key];
    const gradient = ctx.createLinearGradient(80, 20, 920, 1380);
    gradient.addColorStop(0, colors[0]); gradient.addColorStop(.55, colors[1]); gradient.addColorStop(1, colors[2]); ctx.fillStyle = gradient;
  }
  ctx.fillRect(0, 0, 1000, 1400);
}

function drawTemplate() {
  const key = $("#template").value;
  const image = templateImages[key];
  const is800 = key === "800";
  const metalOffset = Number($("#metalY").value);
  if (!image.complete || !image.naturalWidth) return { x: 500, y: 755, front: null, metalShift: 0, metalOffset };
  const baseScale = Math.min(450 / image.naturalWidth, 750 / image.naturalHeight);
  const scale = baseScale * (Number($("#metalScale").value) / 100);
  const baseW = image.naturalWidth * baseScale, baseH = image.naturalHeight * baseScale;
  const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
  const metalShift = is800 ? 6 : 0;
  const mark = is800 ? { x: .507, y: .972 } : { x: .507, y: .974 };
  const anchorX = (1000 - baseW) / 2 + baseW * mark.x;
  const anchorY = 24 + baseH * mark.y;
  const x = anchorX - width * mark.x + metalShift, y = anchorY - height * mark.y + metalOffset;
  ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.drawImage(image, x, y, width, height); ctx.restore();
  const front = document.createElement("canvas"); front.width = 110; front.height = 105;
  front.getContext("2d").drawImage(image, mark.x * image.naturalWidth - 55 / scale, mark.y * image.naturalHeight - 85 / scale, 110 / scale, 105 / scale, 0, 0, 110, 105);
  return { x: anchorX, y: anchorY, front, metalShift, metalOffset };
}

function drawAcrylic(anchor) {
  const amount = (Number($("#size").value) - 34) / 24;
  const targetH = 390 + amount * 240, targetW = 360 + amount * 220, lugR = 38, artDrop = 18;
  const availableH = 1370 - (anchor.y + artDrop);
  const scale = Math.min(targetW / state.art.width, targetH / state.art.height, availableH / state.art.height);
  const width = Math.round(state.art.width * scale), height = Math.round(state.art.height * scale);
  const edge = Number($("#edge").value), padding = edge * 2 + 8;
  const pieceX = Math.round(anchor.x - width / 2 - padding), pieceY = Math.round(anchor.y - lugR - 8);
  const artY = Math.round(anchor.y + artDrop - pieceY), pieceW = width + padding * 2, pieceH = artY + height + padding;
  const holeX = padding + width / 2, holeY = anchor.y - pieceY;
  function mask(radius) {
    const c = document.createElement("canvas"), m = c.getContext("2d"); c.width = pieceW; c.height = pieceH;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 32) m.drawImage(state.art, padding + Math.cos(a) * radius, artY + Math.sin(a) * radius, width, height);
    m.globalCompositeOperation = "source-in"; m.fillStyle = "#fff"; m.fillRect(0, 0, pieceW, pieceH); m.globalCompositeOperation = "source-over";
    const rr = Math.max(20, lugR - (edge - radius)); m.beginPath(); m.arc(holeX, holeY, rr, 0, Math.PI * 2); m.fill(); return c;
  }
  const outer = mask(edge), inner = mask(Math.max(1, edge - 5));
  const piece = document.createElement("canvas"), pc = piece.getContext("2d"); piece.width = pieceW; piece.height = pieceH;
  pc.drawImage(outer, 0, 0); pc.globalCompositeOperation = "source-in"; pc.fillStyle = "rgba(255,255,255,.78)"; pc.fillRect(0, 0, pieceW, pieceH); pc.globalCompositeOperation = "source-over";
  const rim = document.createElement("canvas"), rc = rim.getContext("2d"); rim.width = pieceW; rim.height = pieceH; rc.drawImage(outer, 0, 0); rc.globalCompositeOperation = "destination-out"; rc.drawImage(inner, 0, 0); rc.globalCompositeOperation = "source-in"; const bevel = rc.createLinearGradient(0, 0, pieceW, pieceH); bevel.addColorStop(0, "rgba(255,255,255,.95)"); bevel.addColorStop(1, "rgba(75,82,91,.38)"); rc.fillStyle = bevel; rc.fillRect(0, 0, pieceW, pieceH); pc.globalCompositeOperation = "source-over"; pc.drawImage(rim, 0, 0);
  pc.drawImage(state.art, padding, artY, width, height);
  pc.globalCompositeOperation = "destination-out"; pc.beginPath(); pc.arc(holeX, holeY, 10, 0, Math.PI * 2); pc.fill(); pc.globalCompositeOperation = "source-over"; pc.beginPath(); pc.arc(holeX, holeY, 15, 0, Math.PI * 2); pc.lineWidth = 3; pc.strokeStyle = "rgba(86,92,102,.35)"; pc.stroke();
  ctx.save(); ctx.shadowColor = "rgba(35,40,37,.25)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 10; ctx.drawImage(piece, pieceX, pieceY); ctx.restore();
  if (anchor.front) { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.drawImage(anchor.front, anchor.x - 55 + anchor.metalShift, anchor.y - 85 + anchor.metalOffset); ctx.restore(); }
  const cutline = document.createElement("canvas"); cutline.width = pieceW; cutline.height = pieceH; const cutCtx = cutline.getContext("2d"); cutCtx.fillStyle = "#000"; cutCtx.fillRect(0, 0, pieceW, pieceH); cutCtx.drawImage(outer, 0, 0); cutCtx.globalCompositeOperation = "destination-out"; cutCtx.beginPath(); cutCtx.arc(holeX, holeY, 10, 0, Math.PI * 2); cutCtx.fill();
  state.cutlineCanvas = cutline;
  const production = document.createElement("canvas"); production.width = pieceW; production.height = pieceH; production.getContext("2d").drawImage(state.art, padding, artY, width, height); state.productionCanvas = production;
  const longSide = Number($("#physicalSize").value), ratio = pieceW / pieceH;
  const widthCm = ratio >= 1 ? longSide : longSide * ratio, heightCm = ratio >= 1 ? longSide / ratio : longSide;
  state.metrics = { widthCm, heightCm, pieceW, pieceH };
}

function render() {
  $("#sizeOut").value = `${$("#size").value}%`; $("#edgeOut").value = `${$("#edge").value} px`; $("#metalScaleOut").value = `${$("#metalScale").value}%`;
  const offset = Number($("#metalY").value); $("#metalYOut").value = offset === 0 ? "Centered" : `${Math.abs(offset)} px ${offset < 0 ? "up" : "down"}`;
  ctx.globalCompositeOperation = "source-over"; ctx.filter = "none"; ctx.shadowColor = "transparent"; fillBackground();
  if (!state.art) return;
  drawAcrylic(drawTemplate()); updateSizeCard();
}

function updateSizeCard() {
  if (!state.metrics) return;
  const { widthCm, heightCm } = state.metrics;
  $("#finishedSize").textContent = `${widthCm.toFixed(1)} × ${heightCm.toFixed(1)} cm / ${(widthCm / 2.54).toFixed(2)} × ${(heightCm / 2.54).toFixed(2)} in`;
  $("#shapeLabel").textContent = state.shape === "custom-shaped" ? "Custom-shaped around your subject" : "Rectangular acrylic piece";
  $("#shapeBadge").textContent = state.shape === "custom-shaped" ? "CUSTOM SHAPE" : "RECTANGLE";
}

async function processFile(file, { automatic = false } = {}) {
  if (!file || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) return;
  if (file.size > MAX_IMAGE_BYTES) { $("#status").textContent = "Please choose an image no larger than 12 MB."; return; }
  state.sourceFile = file; state.sourceBlob = file; state.currentCartCopies = 0; $("#addToCart").textContent = "Add this design to cart"; $("#busy").hidden = !automatic; $("#toDesign").disabled = true;
  try {
    if (state.shape === "rectangular") { state.cutoutBlob = file; $("#manualEditor").hidden = true; }
    else if (automatic) {
      if (!automaticCutoutEnabled) throw new Error("Automatic OpenCV cutout is not available on the free server.");
      const body = new FormData(); body.append("image", file); body.append("edgeShrink", String($("#edgeShrink").value));
      const response = await fetch("/api/cutout", { method: "POST", body });
      if (!response.ok) throw new Error((await response.json()).error || "Automatic OpenCV cutout failed");
      state.cutoutBlob = await response.blob();
    } else state.cutoutBlob = file;
    await loadImageFromBlob(state.cutoutBlob, file.name);
    if (state.shape === "custom-shaped") {
      await setupManualEditor(state.cutoutBlob, file);
      if (!automatic) $("#status").textContent = "Manual editor ready · erase the background, then apply it to the keychain";
    }
    $("#toDesign").disabled = false; $("#rerun").disabled = !automaticCutoutEnabled || state.shape !== "custom-shaped";
  } catch (error) {
    if (state.shape === "custom-shaped") {
      state.cutoutBlob = file; await loadImageFromBlob(file, file.name); await setupManualEditor(file, file); $("#toDesign").disabled = false;
      $("#status").textContent = `${error.message} Use the manual eraser instead.`;
    } else $("#status").textContent = error.message;
  }
  finally { $("#busy").hidden = true; }
}

function setShape(shape) {
  state.shape = shape; $("#customShape").classList.toggle("active", shape === "custom-shaped"); $("#rectangleShape").classList.toggle("active", shape === "rectangular"); $("#advanced").hidden = shape !== "custom-shaped"; $("#sizeConfirmed").checked = false;
  if (shape === "custom-shaped") $("#advanced").open = true;
  if (state.sourceFile) processFile(state.sourceFile); else render();
}

function showStep(step) { state.step = step; $$(".flow").forEach(section => section.classList.toggle("active", Number(section.dataset.step) === step)); $$(".steps button").forEach(button => button.classList.toggle("active", Number(button.dataset.jump) === step)); $(".workspace").classList.toggle("checkout-open", state.cart.length > 0 && step === 3); document.querySelector("#create").scrollIntoView({ behavior: "smooth", block: "start" }); }
function canvasBlob(sourceCanvas = canvas) { return new Promise(resolve => sourceCanvas.toBlob(resolve, "image/png", .96)); }
function downloadBlob(blob, name) { const url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function bundlePrice(count) { return count === 1 ? 14.99 : count === 2 ? 24.99 : count === 3 ? 32.99 : null; }
function bundleLabel(count) { return count === 1 ? "Single" : count === 2 ? "Two-keychain bundle" : count === 3 ? "Three-keychain bundle" : "Quantity quote"; }

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let value = n;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[n] = value >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zipHeader(size) { return new Uint8Array(size); }
function zipWrite16(bytes, offset, value) { new DataView(bytes.buffer).setUint16(offset, value, true); }
function zipWrite32(bytes, offset, value) { new DataView(bytes.buffer).setUint32(offset, value >>> 0, true); }
function safeZipName(value) { return String(value || "file").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "file"; }

async function createStoredZip(entries) {
  const encoder = new TextEncoder(), localParts = [], centralParts = [];
  let localOffset = 0, centralSize = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name), content = entry.blob instanceof Blob ? new Uint8Array(await entry.blob.arrayBuffer()) : encoder.encode(String(entry.blob));
    const checksum = crc32(content), local = zipHeader(30);
    zipWrite32(local, 0, 0x04034b50); zipWrite16(local, 4, 20); zipWrite16(local, 6, 0); zipWrite16(local, 8, 0);
    zipWrite32(local, 14, checksum); zipWrite32(local, 18, content.length); zipWrite32(local, 22, content.length); zipWrite16(local, 26, name.length);
    localParts.push(local, name, content);
    const central = zipHeader(46);
    zipWrite32(central, 0, 0x02014b50); zipWrite16(central, 4, 20); zipWrite16(central, 6, 20); zipWrite16(central, 8, 0); zipWrite16(central, 10, 0);
    zipWrite32(central, 16, checksum); zipWrite32(central, 20, content.length); zipWrite32(central, 24, content.length); zipWrite16(central, 28, name.length); zipWrite32(central, 42, localOffset);
    centralParts.push(central, name); centralSize += central.length + name.length; localOffset += local.length + name.length + content.length;
  }
  const end = zipHeader(22);
  zipWrite32(end, 0, 0x06054b50); zipWrite16(end, 8, entries.length); zipWrite16(end, 10, entries.length); zipWrite32(end, 12, centralSize); zipWrite32(end, 16, localOffset);
  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

async function buildBrowserOrderPackage(orderSummary) {
  const entries = [{ name: "order.json", blob: JSON.stringify(orderSummary, null, 2) }];
  state.cart.forEach((item, index) => {
    const folder = `design-${index + 1}`;
    entries.push({ name: `${folder}/${safeZipName(item.name)}`, blob: item.source || item.cutout });
    if (item.service === "diy") {
      entries.push({ name: `${folder}/transparent-artwork.png`, blob: item.cutout });
      entries.push({ name: `${folder}/production.png`, blob: item.production });
      entries.push({ name: `${folder}/keychain-preview.png`, blob: item.preview });
      entries.push({ name: `${folder}/cutline.png`, blob: item.cutline });
    }
  });
  return createStoredZip(entries);
}

function usesStaticOrderFlow() {
  const mode = window.TCM_CONFIG?.orderMode || "auto";
  return mode === "inquiry" || (mode === "auto" && (location.hostname.endsWith("github.io") || new URLSearchParams(location.search).has("static-order")));
}

function renderCart() {
  const designCount = state.cart.length, count = state.cart.reduce((sum, item) => sum + item.quantity, 0), price = bundlePrice(count), cart = $("#cart"), checkout = $("#checkout");
  $(".workspace").classList.toggle("checkout-open", count > 0 && state.step === 3);
  $("#cartNav").hidden = count === 0; $("#cartNav").textContent = `Cart · ${count}`;
  cart.hidden = count === 0; checkout.hidden = count === 0; $("#cartCount").textContent = `${count} keychain${count === 1 ? "" : "s"} · ${designCount} design${designCount === 1 ? "" : "s"}`;
  $("#cartItems").innerHTML = state.cart.map((item, index) => `<div class="cart-item"><img src="${item.previewUrl}" alt="Design ${index + 1}"><div class="cart-item-info"><strong>Design ${index + 1} · ${item.name}</strong><small>${item.service === "assisted" ? `${item.requestedLongSideCm} cm long side · workshop-assisted` : `${item.widthCm.toFixed(1)} × ${item.heightCm.toFixed(1)} cm · ${item.shape === "custom-shaped" ? "custom shape" : "rectangle"}`}</small></div><div class="cart-item-actions"><div class="quantity-control"><button type="button" data-cart-minus="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-cart-plus="${item.id}" aria-label="Increase quantity">＋</button></div><button type="button" data-remove-cart="${item.id}" aria-label="Remove design ${index + 1}">Remove</button></div></div>`).join("");
  $$('[data-cart-minus]').forEach(button => button.onclick = () => { const item = state.cart.find(entry => entry.id === button.dataset.cartMinus); if (!item) return; if (item.quantity > 1) item.quantity -= 1; else { URL.revokeObjectURL(item.previewUrl); state.cart = state.cart.filter(entry => entry.id !== item.id); } renderCart(); });
  $$('[data-cart-plus]').forEach(button => button.onclick = () => { const item = state.cart.find(entry => entry.id === button.dataset.cartPlus); if (!item || count >= 20) return; item.quantity += 1; renderCart(); });
  $$('[data-remove-cart]').forEach(button => button.onclick = () => {
    const index = state.cart.findIndex(item => item.id === button.dataset.removeCart); if (index < 0) return;
    URL.revokeObjectURL(state.cart[index].previewUrl); state.cart.splice(index, 1); renderCart();
  });
  const display = price === null ? "Custom quote" : `$${price.toFixed(2)}`;
  $("#checkoutTotal").textContent = display; $("#summaryTotal").textContent = display; $("#summaryItems").textContent = `${count} keychain${count === 1 ? "" : "s"} · ${designCount} design${designCount === 1 ? "" : "s"} · ${bundleLabel(count)}`;
}

$("#photo").onchange = () => processFile($("#photo").files[0]);
$("#drop").ondragover = event => { event.preventDefault(); };
$("#drop").ondrop = event => { event.preventDefault(); processFile(event.dataTransfer.files[0]); };
$("#customShape").onclick = () => setShape("custom-shaped"); $("#rectangleShape").onclick = () => setShape("rectangular"); $("#rerun").onclick = () => processFile(state.sourceFile, { automatic: true });
const shrinkNames = ["Preserve details", "Gentle", "Balanced", "Clean", "Strong"];
$("#edgeShrink").oninput = event => { $("#edgeShrinkOut").value = shrinkNames[Number(event.target.value)]; };
$("#brushSize").oninput = event => { $("#brushOut").value = `${event.target.value} px`; };
$("#eraseTool").onclick = () => { state.manualTool = "erase"; $("#eraseTool").classList.add("active"); $("#restoreTool").classList.remove("active"); };
$("#restoreTool").onclick = () => { state.manualTool = "restore"; $("#restoreTool").classList.add("active"); $("#eraseTool").classList.remove("active"); };
$("#undoManual").onclick = () => { const previous = state.manualHistory.pop(); if (previous) manualCtx.putImageData(previous, 0, 0); $("#undoManual").disabled = state.manualHistory.length === 0; };
$("#resetManual").onclick = () => { if (!state.manualBase) return; manualCtx.clearRect(0, 0, manualCanvas.width, manualCanvas.height); manualCtx.drawImage(state.manualBase, 0, 0); state.manualHistory = []; $("#undoManual").disabled = true; };
$("#applyManual").onclick = async () => { state.cutoutBlob = await canvasBlob(manualCanvas); state.shape = "custom-shaped"; await loadImageFromBlob(state.cutoutBlob, state.sourceFile?.name || "manually-edited.png"); $("#customShape").classList.add("active"); $("#rectangleShape").classList.remove("active"); $("#status").textContent = "Manual cleanup applied · preview ready"; };
$("#toDesign").onclick = () => showStep(2); $("#toFinish").onclick = () => showStep(3); $$('[data-back]').forEach(button => button.onclick = () => showStep(Number(button.dataset.back))); $$(".steps button").forEach(button => button.onclick = () => { if (state.art || Number(button.dataset.jump) === 1) showStep(Number(button.dataset.jump)); });
[$("#size"), $("#edge"), $("#physicalSize"), $("#background"), $("#template"), $("#metalScale"), $("#metalY")].forEach(control => control.oninput = () => { $("#sizeConfirmed").checked = false; state.currentCartCopies = 0; $("#addToCart").textContent = "Add this updated design to cart"; render(); });
$("#downloadArt").onclick = () => state.cutoutBlob && downloadBlob(state.cutoutBlob, `${state.reference}-transparent.png`);
$("#downloadMockup").onclick = async () => downloadBlob(await canvasBlob(), `${state.reference}-keychain-mockup.png`);

$("#assistedPhotos").onchange = () => {
  const existingQuantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const files = [...$("#assistedPhotos").files].filter(file => ["image/png", "image/jpeg", "image/webp"].includes(file.type) && file.size <= MAX_IMAGE_BYTES).slice(0, Math.max(0, 20 - existingQuantity));
  if (!files.length) { $("#emailWorkshopHelp").textContent = "Please select a JPG, PNG, or WEBP photo."; return; }
  const requestedLongSideCm = Number($("#assistedSize").value), shape = $("#assistedShape").value;
  files.forEach(file => state.cart.push({ id: crypto.randomUUID(), service: "assisted", quantity: 1, name: file.name, source: file, previewUrl: URL.createObjectURL(file), requestedLongSideCm, shape }));
  $("#emailWorkshopHelp").textContent = `${files.length} photo${files.length === 1 ? "" : "s"} added for workshop-assisted design.`;
  $("#assistedPhotos").value = ""; showStep(3); renderCart(); $("#cart").scrollIntoView({ behavior: "smooth", block: "start" });
};

$("#addToCart").onclick = async () => {
  const result = $("#orderResult"); result.className = "result"; result.textContent = "";
  if (!$("#sizeConfirmed").checked) { result.className = "result error"; result.textContent = "Please confirm the finished dimensions before adding this design."; return; }
  if (!state.cutoutBlob || !state.productionCanvas || !state.cutlineCanvas || !state.metrics) return;
  const preview = await canvasBlob(), production = await canvasBlob(state.productionCanvas), cutline = await canvasBlob(state.cutlineCanvas);
  state.cart.push({ id: crypto.randomUUID(), service: "diy", quantity: 1, name: state.sourceFile?.name || `design-${state.cart.length + 1}.png`, source: state.sourceFile || state.cutoutBlob, cutout: state.cutoutBlob, production, preview, previewUrl: URL.createObjectURL(preview), cutline, shape: state.shape, widthCm: state.metrics.widthCm, heightCm: state.metrics.heightCm });
  state.currentCartCopies += 1; $("#addToCart").textContent = state.currentCartCopies === 1 ? "Add another copy of this design" : `Add another copy · ${state.currentCartCopies} added`; $("#sizeConfirmed").checked = false; renderCart(); result.className = "result success"; result.textContent = "Design added. Use the +/− controls in your cart for extra copies.";
};

$("#createAnother").onclick = () => { state.currentCartCopies = 0; $("#addToCart").textContent = "Add this design to cart"; showStep(1); renderCart(); $("#photo").value = ""; $("#status").textContent = "Upload another photo for the next keychain"; };
$("#cartNav").onclick = () => { showStep(3); renderCart(); $("#cart").scrollIntoView({ behavior: "smooth", block: "start" }); };

$("#order").onclick = async () => {
  const result = $("#orderResult"); result.className = "result"; result.textContent = "";
  $("#checkout").classList.add("validation-active");
  if (!state.cart.length) { result.className = "result error"; result.textContent = "Add at least one design to your cart."; return; }
  if (!$("#rightsConfirmed").checked || !$("#reviewConfirmed").checked) { result.className = "result error"; result.textContent = "Please accept both order confirmations."; return; }
  const required = ["customerName", "customerEmail", "shippingCountry", "shippingAddress1", "shippingCity", "shippingRegion", "shippingPostal"];
  for (const id of required) { const field = $("#" + id); if (!field.value.trim() || !field.checkValidity()) { result.className = "result error"; result.textContent = "Please complete a valid contact and delivery address."; field.reportValidity(); field.focus(); return; } }
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0), price = bundlePrice(count), packageName = count === 1 ? "single" : count === 2 ? "pair" : count === 3 ? "trio" : "quote";
  const items = state.cart.map(item => item.service === "assisted" ? { name: item.name, service: "assisted", quantity: item.quantity, shape: item.shape, requestedLongSideCm: item.requestedLongSideCm } : { name: item.name, service: "diy", quantity: item.quantity, shape: item.shape, finishedAcrylicWidthCm: item.widthCm.toFixed(2), finishedAcrylicHeightCm: item.heightCm.toFixed(2) });
  const orderSummary = {
    localReference: state.reference || `TCM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(), quantity: count, package: packageName,
    estimatedPriceUsd: price === null ? "custom quote" : price.toFixed(2), items,
    customer: { name: $("#customerName").value, email: $("#customerEmail").value, phone: $("#customerPhone").value },
    shipping: { country: $("#shippingCountry").value, address1: $("#shippingAddress1").value, address2: $("#shippingAddress2").value, city: $("#shippingCity").value, region: $("#shippingRegion").value, postalCode: $("#shippingPostal").value },
    notes: $("#orderNotes").value,
    confirmations: { imageRights: true, workshopReview: true },
  };
  const data = new FormData(); data.append("name", $("#customerName").value); data.append("email", $("#customerEmail").value); data.append("phone", $("#customerPhone").value); data.append("country", $("#shippingCountry").value); data.append("address1", $("#shippingAddress1").value); data.append("address2", $("#shippingAddress2").value); data.append("city", $("#shippingCity").value); data.append("region", $("#shippingRegion").value); data.append("postalCode", $("#shippingPostal").value); data.append("notes", $("#orderNotes").value); data.append("package", packageName); data.append("quantity", String(count)); data.append("estimatedPriceUsd", price === null ? "" : price.toFixed(2)); data.append("rightsConfirmed", "true"); data.append("reviewConfirmed", "true"); data.append("itemsJson", JSON.stringify(items));
  state.cart.forEach((item, index) => { data.append(`item${index}Source`, item.source || item.cutout, item.name); if (item.service === "diy") { data.append(`item${index}Cutout`, item.cutout, "artwork.png"); data.append(`item${index}Production`, item.production, "production.png"); data.append(`item${index}Preview`, item.preview, "preview.png"); data.append(`item${index}Cutline`, item.cutline, "cutline.png"); } });
  $("#order").disabled = true; $("#order").textContent = "Building production package…";
  let browserPackage = null, browserPackageUrl = "";
  try {
    if (usesStaticOrderFlow()) {
      browserPackage = await buildBrowserOrderPackage(orderSummary); browserPackageUrl = URL.createObjectURL(browserPackage);
      const lines = [
        `Keychain order ${orderSummary.localReference}`,
        `Quantity: ${count}`,
        `Estimated price: ${price === null ? "custom quote" : `$${price.toFixed(2)}`}`,
        `Phone: ${orderSummary.customer.phone || "Not provided"}`,
        `Ship to: ${[orderSummary.shipping.address1, orderSummary.shipping.address2, orderSummary.shipping.city, orderSummary.shipping.region, orderSummary.shipping.postalCode, orderSummary.shipping.country].filter(Boolean).join(", ")}`,
        `Items: ${items.map((item, index) => `${index + 1}. ${item.name} × ${item.quantity} (${item.shape || item.service})`).join(" | ")}`,
        `Notes: ${orderSummary.notes || "None"}`,
        "The customer has downloaded the browser-generated order ZIP. Reply and ask them to attach it before production.",
      ];
      const endpoint = window.TCM_CONFIG?.inquiryEndpoint;
      if (!endpoint) throw new Error("The workshop notification endpoint is not configured.");
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: orderSummary.customer.name, email: orderSummary.customer.email, company: "", service: "Custom acrylic keychain order", budget: price === null ? "Quantity quote" : `$${price.toFixed(2)}`, timeline: "Workshop confirmation required", message: lines.join("\n"), source: "tiny-county-makers-keychain", consent: true }) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "The workshop notification could not be sent.");
      downloadBlob(browserPackage, `${orderSummary.localReference}-order-package.zip`);
      result.className = "result success"; result.innerHTML = `<strong>Request received: ${payload.reference || orderSummary.localReference}</strong><br>${count} keychain${count === 1 ? "" : "s"} · ${price === null ? "custom quote" : `$${price.toFixed(2)}`}<br><a href="${browserPackageUrl}" download="${orderSummary.localReference}-order-package.zip">Download the order ZIP again</a><br>Keep this ZIP. When the workshop replies, attach it so production can inspect every file.`;
    } else {
      const response = await fetch("/api/orders", { method: "POST", body: data }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Order request failed"); result.className = "result success"; result.innerHTML = `<strong>Request saved: ${payload.reference}</strong><br>${payload.quantity} keychain${payload.quantity === 1 ? "" : "s"} · ${payload.estimatedPrice || "custom quote"}<br><a href="${payload.packageUrl}">Download the production ZIP</a><br>Workshop notification: ${payload.notification.replaceAll("_", " ")}.`;
    }
  }
  catch (error) { result.className = "result error"; result.textContent = error.message; }
  finally { $("#order").disabled = false; $("#order").textContent = "Send order request"; }
};

Object.values(templateImages).forEach(image => image.onload = render);
$("#automaticServerTools").hidden = !automaticCutoutEnabled;
$("#advanced").hidden = true;
const demoBlob = new Blob([demoSvg], { type: "image/svg+xml" }); state.sourceBlob = demoBlob; state.cutoutBlob = demoBlob; loadImageFromBlob(demoBlob, "Shared flower demo").then(async () => { state.cutoutBlob = await canvasBlob(state.art); $("#toDesign").disabled = false; });
