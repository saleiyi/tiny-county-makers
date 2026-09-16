import { getProductProfile, normalizeCutlineSmoothing, physicalDimensions, stickerOffsetPixels } from "./assets/maker-core.mjs";

const root = document.querySelector("[data-maker]");
const profile = getProductProfile(root.dataset.maker);
const canvas = document.querySelector("#preview");
const ctx = canvas.getContext("2d");
const upload = document.querySelector("#photo");
const size = document.querySelector("#size");
const offset = document.querySelector("#offset");
const sizeLabel = document.querySelector("#sizeLabel");
const offsetLabel = document.querySelector("#offsetLabel");
const smoothing = document.querySelector("#smoothing");
const smoothingLabel = document.querySelector("#smoothingLabel");
const dimensions = document.querySelector("#dimensions");
const svgButton = document.querySelector("#svgDownload");
let image = null, imageDataUrl = "";

document.querySelector("#productName").textContent = profile.product;
document.querySelector("#size").innerHTML = profile.sizes.map(value => `<option value="${value}">${value} cm long side</option>`).join("");
if (!profile.exportSvg && svgButton) svgButton.hidden = true;
if (!profile.exportSvg) document.querySelector("#offsetControl").hidden = true;

upload.addEventListener("change", async () => {
  const file = upload.files[0];
  if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 12 * 1024 * 1024) return;
  imageDataUrl = await fileToDataUrl(file); image = await loadImage(imageDataUrl); render(); track("photo_uploaded");
});
size.addEventListener("input", render); offset?.addEventListener("input", render); smoothing?.addEventListener("input", render);
document.querySelector("#pngDownload").addEventListener("click", () => { if (image) { download(canvas.toDataURL("image/png"), `${profile.id}-preview.png`); track("design_started", { export: "png" }); } });
svgButton?.addEventListener("click", () => { if (image) { const pad = stickerOffsetPixels(Number(offset.value)) / 3, blur = normalizeCutlineSmoothing(smoothing?.value) / 3; const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"><defs><filter id="cutline"><feMorphology in="SourceAlpha" operator="dilate" radius="${pad / 2}" result="expanded"/><feGaussianBlur in="expanded" stdDeviation="${blur}" result="smooth"/><feFlood flood-color="white" result="border"/><feComposite in="border" in2="smooth" operator="in"/></filter></defs><image href="${imageDataUrl}" x="${pad}" y="${pad}" width="${canvas.width-pad*2}" height="${canvas.height-pad*2}" preserveAspectRatio="xMidYMid meet" filter="url(#cutline)"/><image href="${imageDataUrl}" x="${pad}" y="${pad}" width="${canvas.width-pad*2}" height="${canvas.height-pad*2}" preserveAspectRatio="xMidYMid meet"/></svg>`; download(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, "sticker-cutline.svg"); track("design_started", { export: "svg" }); } });

function render() {
  if (!image) return;
  const longSide = Number(size.value); const dims = physicalDimensions(image.naturalWidth, image.naturalHeight, longSide);
  dimensions.textContent = `${dims.widthCm} × ${dims.heightCm} cm finished ${profile.product.toLowerCase()}`;
  sizeLabel.textContent = `${longSide} cm`; if (offset) offsetLabel.textContent = `${offset.value} mm`; if (smoothing) smoothingLabel.textContent = `${normalizeCutlineSmoothing(smoothing.value)}`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const margin = profile.id === "sticker" ? 115 : 70;
  const ratio = Math.min((canvas.width - margin * 2) / image.naturalWidth, (canvas.height - margin * 2) / image.naturalHeight);
  const width = image.naturalWidth * ratio, height = image.naturalHeight * ratio, x = (canvas.width - width) / 2, y = (canvas.height - height) / 2;
  if (profile.id === "sticker") { const cut = Math.max(10, Number(offset.value) * 14), blur = normalizeCutlineSmoothing(smoothing?.value) / 4; ctx.save(); ctx.shadowColor = "white"; ctx.shadowBlur = cut; ctx.filter = `blur(${blur}px) drop-shadow(0 0 1px #c8c8c8)`; ctx.drawImage(image, x, y, width, height); ctx.restore(); }
  else if (profile.id === "magnet") { ctx.save(); ctx.shadowColor = "rgba(30,35,30,.35)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 13; ctx.fillStyle = "#39423b"; roundRect(ctx, x-12, y-12, width+24, height+24, 26); ctx.fill(); ctx.restore(); }
  ctx.drawImage(image, x, y, width, height);
  if (profile.hasBase) { ctx.fillStyle = "#e8d5b5"; roundRect(ctx, canvas.width*.22, y+height+14, canvas.width*.56, 42, 12); ctx.fill(); }
  if (profile.hasHardware) { ctx.strokeStyle = "#8f9694"; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(canvas.width/2, y-31, 25, 0, Math.PI*2); ctx.stroke(); }
}
function roundRect(context, x, y, width, height, radius) { context.beginPath(); context.roundRect(x, y, width, height, radius); }
function loadImage(src) { return new Promise((resolve, reject) => { const value = new Image(); value.onload = () => resolve(value); value.onerror = reject; value.src = src; }); }
function fileToDataUrl(file) { return new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }); }
function download(href, name) { const link = document.createElement("a"); link.href = href; link.download = name; link.click(); }
function track(event, metadata = {}) { const endpoint = window.TCM_CONFIG?.analyticsEndpoint; if (!endpoint || !location.hostname.endsWith("github.io") || navigator.doNotTrack === "1") return; const sessionId = sessionStorage.getItem("tcm-analytics-session") || crypto.randomUUID().replaceAll("-", ""); sessionStorage.setItem("tcm-analytics-session", sessionId); fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, keepalive: true, body: JSON.stringify({ event, sessionId, pagePath: location.pathname, deviceType: /Mobile/i.test(navigator.userAgent) ? "mobile" : "desktop", metadata: { product: profile.id, ...metadata } }) }).catch(() => {}); }
track("page_view", { product: profile.id });
