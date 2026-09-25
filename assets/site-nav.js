/* ------------------------------------------------------------------
   Tiny County Makers - shared header, mega menu, drawer, search and
   directory filtering.  Loaded on every page after the markup.
   No dependencies, no build step.
   ------------------------------------------------------------------ */
(function () {
  "use strict";
  var d = document;

  /* ------------------------------------------------ small-screen drawer
     maker-app.js and create.js already build this button on the maker pages;
     this copy covers the directory and category pages, and the duplicate
     guard keeps both from adding a second toggle. */
  (function smallScreenMenu() {
    var header = d.querySelector("header.top");
    var nav = header && header.querySelector("nav");
    if (!header || !nav || header.querySelector(".nav-toggle")) return;
    var toggle = d.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open the tools menu");
    toggle.innerHTML = "<i></i><i></i><i></i>";
    if (!nav.id) nav.id = "site-nav";
    toggle.setAttribute("aria-controls", nav.id);
    header.append(toggle);
    header.classList.add("nav-ready");
    var setOpen = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close the tools menu" : "Open the tools menu");
    };
    toggle.addEventListener("click", function () { setOpen(!header.classList.contains("nav-open")); });
    nav.addEventListener("click", function (event) { if (event.target.closest("a")) setOpen(false); });
    d.addEventListener("click", function (event) {
      if (header.classList.contains("nav-open") && !header.contains(event.target)) setOpen(false);
    });
    d.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (header.classList.contains("nav-open") && window.innerWidth > 860) setOpen(false);
    });
  })();

  /* ------------------------------------------------ sticky header */
  var header = d.getElementById("site-top");
  if (header) {
    var stick = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    stick();
    window.addEventListener("scroll", stick, { passive: true });
  }

  /* ------------------------------------------------ mega menu */
  var groups = [].slice.call(d.querySelectorAll("[data-nav-group]"));
  var wide = window.matchMedia("(min-width: 721px)");

  function setOpen(group, open) {
    group.classList.toggle("open", open);
    var btn = group.querySelector(".nav-drop");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeGroups(except) {
    groups.forEach(function (g) { if (g !== except) setOpen(g, false); });
  }
  groups.forEach(function (group) {
    var btn = group.querySelector(".nav-drop");
    if (!btn) return;
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      var open = !group.classList.contains("open");
      closeGroups(group);
      setOpen(group, open);
    });
    group.addEventListener("mouseenter", function () {
      if (wide.matches) { closeGroups(group); setOpen(group, true); }
    });
    group.addEventListener("mouseleave", function () {
      if (wide.matches) setOpen(group, false);
    });
  });
  d.addEventListener("click", function (event) {
    if (!event.target.closest("[data-nav-group]")) closeGroups(null);
  });

  /* collapse the drawer contents again whenever the menu closes */
  if (header && window.MutationObserver) {
    new MutationObserver(function () {
      if (!header.classList.contains("nav-open")) closeGroups(null);
    }).observe(header, { attributes: true, attributeFilter: ["class"] });
  }

  /* ------------------------------------------------ tool search */
  var search = d.getElementById("site-search");
  var openBtn = d.querySelector(".search-open");
  var input = d.getElementById("site-search-input");
  var list = d.getElementById("site-search-list");
  var count = d.getElementById("site-search-count");
  var empty = d.getElementById("site-search-empty");
  var items = list ? [].slice.call(list.querySelectorAll(".search-item")) : [];
  var lastFocus = null;

  function filterSearch(query) {
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    items.forEach(function (item) {
      var haystack = item.getAttribute("data-keywords") || "";
      var hit = tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
      item.hidden = !hit;
      if (hit) shown++;
    });
    if (count) count.textContent = tokens.length ? shown + " of " + items.length + " tools" : items.length + " tools";
    if (empty) empty.hidden = shown !== 0;
  }

  function openSearch() {
    if (!search) return;
    lastFocus = d.activeElement;
    search.hidden = false;
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    if (input) { input.value = ""; filterSearch(""); input.focus(); }
    d.body.style.overflow = "hidden";
  }
  function closeSearch() {
    if (!search || search.hidden) return;
    search.hidden = true;
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    d.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener("click", openSearch);
  if (search) {
    search.addEventListener("click", function (event) {
      if (event.target.closest("[data-search-close]")) closeSearch();
    });
    if (input) input.addEventListener("input", function () { filterSearch(input.value); });
  }
  d.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeGroups(null);
    closeSearch();
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
  });

  /* ------------------------------------------------ directory filter */
  var dirInput = d.getElementById("dir-search");
  var dirCount = d.getElementById("dir-count");
  var dirGroups = [].slice.call(d.querySelectorAll(".dir-group"));
  var chips = [].slice.call(d.querySelectorAll(".chip[data-filter]"));
  var activeChip = "all";
  var query = "";

  function applyDirectory() {
    if (!dirGroups.length) return;
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    dirGroups.forEach(function (group) {
      var inChip = activeChip === "all" || group.getAttribute("data-group") === activeChip;
      var cards = [].slice.call(group.querySelectorAll(".tool-card"));
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = card.getAttribute("data-keywords") || "";
        var hit = inChip && tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
        card.classList.toggle("is-hidden", !hit);
        if (hit) visible++;
      });
      group.classList.toggle("is-hidden", visible === 0);
      shown += visible;
    });
    if (dirCount) dirCount.textContent = "Showing " + shown + " of " + d.querySelectorAll(".tool-card").length + " tools";
  }
  if (dirInput) {
    dirInput.addEventListener("input", function () { query = dirInput.value; applyDirectory(); });
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeChip = chip.getAttribute("data-filter");
      chips.forEach(function (other) { other.classList.toggle("is-on", other === chip); });
      applyDirectory();
    });
  });
  applyDirectory();
})();
