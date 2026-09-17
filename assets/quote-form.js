// Shared quote form for the free-tool pages.
// Posts to the existing Cloudflare Pages inquiry API. No payment is collected here.

const ENDPOINT = "https://leadpilot-ai-6db.pages.dev/api/inquiries";
const STARTED = new WeakSet();

for (const form of document.querySelectorAll(".quote-form")) {
  form.addEventListener("submit", (event) => submit(event, form));
  form.addEventListener("focusin", () => {
    if (STARTED.has(form)) return;
    STARTED.add(form);
    track("quote_started", { source: form.dataset.source || location.pathname });
  });
}

async function submit(event, form) {
  event.preventDefault();
  const note = form.querySelector(".form-note");
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();

  if (!name) return fail(note, "Please add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(note, "Please add a valid email address.");
  if (message.length < 20) return fail(note, "Please describe the job in at least 20 characters.");
  if (!data.consent) return fail(note, "Please accept the privacy notice so we can reply.");

  button.disabled = true;
  note.className = "form-note";
  note.textContent = "Sending...";

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        company: String(data.company || "").trim(),
        service: String(data.service || "Custom quote").trim(),
        budget: String(data.budget || "").trim(),
        timeline: String(data.timeline || "").trim(),
        message: `${message}\n\n-- Page: ${location.pathname}${location.search}`,
        source: form.dataset.source || location.pathname,
        consent: true,
        website_url: String(data.website_url || ""),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`);
    note.className = "form-note ok";
    note.textContent = `Thanks ${name.split(" ")[0]} — your request is saved. Reference ${result.reference || "sent"}.`;
    form.reset();
    track("quote_submitted", { source: form.dataset.source || location.pathname, service: data.service || "" });
  } catch (error) {
    fail(note, `We could not send that: ${error.message}. You can also reply to any email we sent you.`);
  } finally {
    button.disabled = false;
  }
}

function fail(note, text) {
  if (!note) return;
  note.className = "form-note bad";
  note.textContent = text;
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
      metadata,
    }),
  }).catch(() => {});
}