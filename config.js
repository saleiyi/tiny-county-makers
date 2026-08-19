// Replace this before public deployment. Keep business settings in this one file.
window.TCM_CONFIG = {
  // Local Python uses /api/orders. GitHub Pages uploads the production ZIP to the Cloudflare order API.
  orderMode: "auto",
  orderEndpoint: "https://leadpilot-ai-6db.pages.dev/api/keychain-orders",
  // Keep false on free static hosting. Change to true when /api/cutout is online.
  automaticCutoutEnabled: false,
};
