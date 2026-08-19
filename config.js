// Replace this before public deployment. Keep business settings in this one file.
window.TCM_CONFIG = {
  // Local Python uses /api/orders. GitHub Pages uses the existing D1 + Resend inquiry API.
  orderMode: "auto",
  inquiryEndpoint: "https://leadpilot-ai-6db.pages.dev/api/inquiries",
  // Keep false on free static hosting. Change to true when /api/cutout is online.
  automaticCutoutEnabled: false,
};
