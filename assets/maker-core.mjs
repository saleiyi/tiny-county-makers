const PROFILES = Object.freeze([
  { id: "keychain", name: "Pet Keychain Maker", product: "Acrylic keychain", hasHardware: true, hasBase: false, exportSvg: false, sizes: [4, 5, 6] },
  { id: "standee", name: "Acrylic Standee Maker", product: "Acrylic standee", hasHardware: false, hasBase: true, exportSvg: false, sizes: [8, 10, 15] },
  { id: "sticker", name: "Sticker Cutline Generator", product: "Die-cut sticker", hasHardware: false, hasBase: false, exportSvg: true, sizes: [5, 7, 10] },
  { id: "magnet", name: "Fridge Magnet Maker", product: "Fridge magnet", hasHardware: false, hasBase: false, exportSvg: false, sizes: [5, 7, 9] },
]);

export function listProductProfiles() {
  return PROFILES;
}

export function getProductProfile(id) {
  const profile = PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown product profile: ${id}`);
  return profile;
}

export function physicalDimensions(width, height, longSideCm) {
  const safeWidth = Number(width), safeHeight = Number(height), longSide = Number(longSideCm);
  if (!(safeWidth > 0 && safeHeight > 0 && longSide > 0)) throw new Error("Image dimensions and long side must be positive.");
  const ratio = longSide / Math.max(safeWidth, safeHeight);
  return { widthCm: round(safeWidth * ratio), heightCm: round(safeHeight * ratio) };
}

export function stickerOffsetPixels(millimeters, dpi = 300) {
  const value = Number(millimeters), safeDpi = Number(dpi);
  if (!(value >= 0 && safeDpi > 0)) throw new Error("Offset and DPI must be valid.");
  return Math.round(value / 25.4 * safeDpi);
}

export function normalizeCutlineSmoothing(value) {
  return Math.max(0, Math.min(10, Math.round(Number(value) || 0)));
}

function round(value) {
  return Math.round(value * 100) / 100;
}
