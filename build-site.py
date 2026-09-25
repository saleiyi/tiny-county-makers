#!/usr/bin/env python3
"""Regenerate the shared navigation, tool directory, category pages and the
sitemap from tools.json, so every page agrees on the same 30 tools.

Usage:  python build-site.py
"""
import json, os, re, shutil, sys, html as H

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = json.load(open(os.path.join(ROOT, "tools.json"), encoding="utf-8"))
BRAND, CATS, TOOLS = DATA["brand"], DATA["categories"], DATA["tools"]
CAT_BY = {c["slug"]: c for c in CATS}
TOOLS_BY_CAT = {c["slug"]: [t for t in TOOLS if t["category"] == c["slug"]] for c in CATS}
SITE = "https://saleiyi.github.io/tiny-county-makers/"
TODAY = "2026-09-19"
TOTAL = len(TOOLS)


def e(s):
    return H.escape(str(s), quote=True)


def url(t):
    return "./" + t["file"]


def thumb(t):
    return "./assets/thumbs/" + os.path.basename(t["image"])


def photo(t):
    return "./" + t["image"]


CAT_ICON = {
    "photo-gifts": '<path d="M3 8.5h18V12H3z"/><path d="M5 12h14v8.5H5z"/><path d="M12 8.5v12"/><path d="M12 8.5S10.6 3.5 8.2 3.5a2.5 2.5 0 000 5h3.8z"/><path d="M12 8.5s1.4-5 3.8-5a2.5 2.5 0 010 5H12z"/>',
    "stickers-cutting": '<circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M8.4 15.7L20 4.5"/><path d="M15.6 15.7L4 4.5"/>',
    "events-printables": '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 14.5h8"/>',
    "names-accessories": '<path d="M20.4 12.6l-7.8 7.8a2 2 0 01-2.8 0l-6.4-6.4V4h10l7 7a2 2 0 010 1.6z"/><circle cx="7.6" cy="7.6" r="1.4"/>',
    "kids-learning": '<path d="M4 5.5A2.5 2.5 0 016.5 3H17v18H6.5A2.5 2.5 0 014 18.5z"/><path d="M17 3h1.5A2.5 2.5 0 0121 5.5v13a2.5 2.5 0 01-2.5 2.5H17"/>',
}


def icon(slug, cls="cat-ico"):
    return '<svg class="%s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % (cls, CAT_ICON[slug])


# ---------------------------------------------------------------- header

def mega_item(t):
    return ('        <li><a href="%s"><img src="%s" alt="" width="36" height="36" loading="lazy" decoding="async">'
            '<span>%s</span></a></li>') % (e(url(t)), e(thumb(t)), e(t["short"]))


def mega_column(c):
    items = TOOLS_BY_CAT[c["slug"]]
    shown = items[:8]
    extra = ""
    if len(items) > len(shown):
        extra = '\n        <li class="mega-more"><a href="./%s.html">+ %d more %s</a></li>' % (
            c["slug"], len(items) - len(shown), e(c["name"].lower()))
    return (
        '      <div class="mega-col">\n'
        '        <a class="mega-cat" href="./%s.html">%s<span class="mega-cat-name">%s</span><span class="mega-count">%d</span></a>\n'
        '        <ul class="mega-list">\n%s%s\n        </ul>\n'
        '        <a class="mega-viewall" href="./%s.html">View all %d %s tools</a>\n'
        '      </div>'
    ) % (c["slug"], icon(c["slug"]), e(c["name"]), len(items),
         "\n".join(mega_item(t) for t in shown), extra,
         c["slug"], len(items), e(c["name"].split(" & ")[0].lower()))


def render_header(active="", bare=False):
    prefix = "" if bare else "./"
    return (
        '<!-- site:header -->\n'
        '<header class="top site-top" id="site-top">\n'
        '  <a class="brand" href="./" aria-label="%s home"><i aria-hidden="true">%s</i>'
        '<span class="brand-text">%s<small>%s</small></span></a>\n'
        '  <nav id="site-nav" class="site-nav" aria-label="Main">\n'
        '    <div class="nav-group" data-nav-group>\n'
        '      <button class="nav-link nav-drop" type="button" aria-expanded="false" aria-controls="mega-tools">'
        'Explore tools<svg class="chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>\n'
        '      <div class="mega" id="mega-tools">\n'
        '        <div class="mega-cols">\n%s\n        </div>\n'
        '        <div class="mega-foot"><a class="mega-all" href="./tools.html">All %d free tools</a>'
        '<span class="mega-note">No signup. Every file is made in your browser.</span></div>\n'
        '      </div>\n'
        '    </div>\n'
        '    <a class="nav-link" href="./how-it-works.html">How it works</a>\n'
        '    <a class="nav-link" href="./inspiration.html">Inspiration</a>\n'
        '    <a class="nav-link" href="./index.html#checkout">Custom orders</a>\n'
        '  </nav>\n'
        '  <div class="top-actions">\n'
        '    <button class="search-open" type="button" aria-expanded="false" aria-controls="site-search">'
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">'
        '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="sr-only">Search tools</span></button>\n'
        '    <a class="pill" href="./create.html"><span class="pill-long">Start creating</span><span class="pill-short">Create</span></a>\n'
        '  </div>\n'
        '</header>\n'
        '<!-- /site:header -->'
    ) % (e(BRAND["name"]), e(BRAND["logoText"]), e(BRAND["name"]), e(BRAND["slogan"]),
         "\n".join(mega_column(c) for c in CATS), TOTAL)


# ---------------------------------------------------------------- search

def search_item(t):
    keys = " ".join([t["name"], t["short"], CAT_BY[t["category"]]["name"], t["blurb"]] + t["keywords"]).lower()
    return ('      <li class="search-item" data-keywords="%s"><a href="%s">'
            '<img src="%s" alt="" width="44" height="44" loading="lazy" decoding="async">'
            '<span class="search-item-text"><b>%s</b><em>%s</em></span></a></li>') % (
        e(keys), e(url(t)), e(thumb(t)), e(t["name"]), e(CAT_BY[t["category"]]["name"]))


def render_search():
    return (
        '<!-- site:search -->\n'
        '<div class="site-search" id="site-search" hidden>\n'
        '  <div class="search-backdrop" data-search-close></div>\n'
        '  <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">\n'
        '    <h2 class="sr-only" id="search-title">Search the free tools</h2>\n'
        '    <div class="search-bar">\n'
        '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>\n'
        '      <input id="site-search-input" type="search" placeholder="Search %d tools - try &quot;sticker&quot; or &quot;name&quot;" autocomplete="off" aria-describedby="site-search-count">\n'
        '      <button class="search-close" type="button" data-search-close aria-label="Close search">&times;</button>\n'
        '    </div>\n'
        '    <p class="search-count" id="site-search-count" role="status">%d tools</p>\n'
        '    <ul class="search-list" id="site-search-list">\n%s\n    </ul>\n'
        '    <p class="search-empty" id="site-search-empty" hidden>No tool matches that word yet. <a href="./tools.html">Browse all %d tools</a>.</p>\n'
        '    <p class="search-foot"><a href="./tools.html">See every tool on one page</a></p>\n'
        '  </div>\n'
        '</div>\n'
        '<!-- /site:search -->'
    ) % (TOTAL, TOTAL, "\n".join(search_item(t) for t in TOOLS), TOTAL)


# ---------------------------------------------------------------- footer

def foot_col(c):
    items = TOOLS_BY_CAT[c["slug"]]
    links = "\n".join('        <li><a href="%s">%s</a></li>' % (e(url(t)), e(t["short"])) for t in items[:6])
    more = ""
    if len(items) > 6:
        more = '\n        <li><a href="./%s.html">All %d %s tools</a></li>' % (c["slug"], len(items), e(c["name"].lower()))
    return ('      <nav class="foot-col" aria-label="%s">\n'
            '        <h2><a href="./%s.html">%s</a></h2>\n'
            '        <ul>\n%s%s\n        </ul>\n      </nav>') % (e(c["name"]), c["slug"], e(c["name"]), links, more)


def render_footer():
    return (
        '<!-- site:footer -->\n'
        '<footer class="site-foot">\n'
        '  <div class="shell">\n'
        '    <div class="foot-top">\n'
        '      <div class="foot-brand">\n'
        '        <a class="brand" href="./"><i aria-hidden="true">%s</i><span class="brand-text">%s<small>%s</small></span></a>\n'
        '        <p>Free browser tools for photo gifts, stickers, printables and name keepsakes. Nothing is uploaded: every file is made on your own device.</p>\n'
        '      </div>\n'
        '      <div class="foot-links">\n'
        '        <a class="button ghost" href="./tools.html">Browse all %d tools</a>\n'
        '        <a class="button ghost" href="./how-it-works.html">How it works</a>\n'
        '        <a class="button ghost" href="./inspiration.html">Inspiration</a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="foot-grid">\n%s\n    </div>\n'
        '    <p class="foot-note">%s &middot; %s &middot; Free to use, no signup, no watermark.</p>\n'
        '  </div>\n'
        '</footer>\n'
        '<!-- /site:footer -->'
    ) % (e(BRAND["logoText"]), e(BRAND["name"]), e(BRAND["slogan"]), TOTAL,
         "\n".join(foot_col(c) for c in CATS), e(BRAND["name"]), e(BRAND["slogan"]))


# ---------------------------------------------------------------- related tools

def tool_card(t):
    keys = " ".join([t["name"], t["short"], CAT_BY[t["category"]]["name"], t["blurb"]] + t["keywords"]).lower()
    return ('      <a class="tool-card" href="%s" data-keywords="%s" data-category="%s">\n'
            '        <img src="%s" alt="" width="%d" height="%d" loading="lazy" decoding="async">\n'
            '        <span class="tool-card-body"><b>%s</b><span>%s</span></span>\n'
            '      </a>') % (e(url(t)), e(keys), e(t["category"]), e(t["card"]), t["cw"], t["ch"],
                              e(t["name"]), e(t["blurb"]))




def render_related(current_file):
    t = next((x for x in TOOLS if x["file"] == current_file), None)
    if t is None:
        return None
    cat = CAT_BY[t["category"]]
    others = [x for x in TOOLS_BY_CAT[cat["slug"]] if x["file"] != current_file]
    others = others + [x for x in TOOLS if x["category"] != cat["slug"]][: max(0, 3 - len(others))]
    return (
        '<!-- site:related -->\n'
        '<section class="more-tools" id="related-tools">\n'
        '  <div class="shell">\n'
        '    <p class="eyebrow">More from %s</p>\n'
        '    <h2>%s tools that work the same way</h2>\n'
        '    <div class="tool-cards">\n%s\n    </div>\n'
        '    <p class="browse-all"><a class="button ghost" href="./tools.html">Browse all %d tools</a></p>\n'
        '  </div>\n'
        '</section>\n'
        '<!-- /site:related -->'
    ) % (e(cat["name"]), e(cat["name"]), "\n".join(tool_card(x) for x in others), TOTAL)


# ---------------------------------------------------------------- page shell

def render_page(path_from_root, title, description, body, canonical, extra_head="", current=""):
    return (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<link rel="icon" href="./favicon.svg" type="image/svg+xml">\n'
        '<link rel="apple-touch-icon" href="./favicon.svg">\n'
        '<meta name="theme-color" content="%s">\n'
        '<title>%s</title>\n<meta name="description" content="%s">\n'
        '<link rel="canonical" href="%s">\n'
        '<meta property="og:type" content="website">\n<meta property="og:site_name" content="%s">\n'
        '<meta property="og:title" content="%s">\n<meta property="og:description" content="%s">\n'
        '<meta property="og:url" content="%s">\n'
        '<meta property="og:image" content="%sassets/photos/photo-keychain.jpg">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        '<meta name="twitter:title" content="%s">\n<meta name="twitter:description" content="%s">\n'
        '<meta name="twitter:image" content="%sassets/photos/photo-keychain.jpg">\n'
        '<link rel="stylesheet" href="./maker.css">\n<link rel="stylesheet" href="./site.css">\n%s</head>\n<body>\n%s\n%s\n<main>\n%s\n</main>\n%s\n'
        '<script src="./config.js"></script>\n<script src="./assets/site-nav.js" defer></script>\n'
        '</body>\n</html>\n'
    ) % (e(BRAND["ink"]), e(title), e(description), e(canonical), e(BRAND["name"]),
         e(title), e(description), e(canonical), SITE, e(title), e(description), SITE,
         extra_head, render_header(), render_search(), body, render_footer())


# ---------------------------------------------------------------- new pages

def breadcrumb(items):
    parts = []
    for i, (label, href) in enumerate(items):
        if href:
            parts.append('<a href="%s">%s</a>' % (e(href), e(label)))
        else:
            parts.append('<span aria-current="page">%s</span>' % e(label))
    return '<nav class="crumbs" aria-label="Breadcrumb">%s</nav>' % '<i aria-hidden="true">/</i>'.join(parts)


def crumb_schema(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": label,
         **({"item": SITE + href.lstrip("./")} if href else {})} for i, (label, href) in enumerate(items)]}


def write_page(name, title, description, body, jsonld, extra_head=""):
    canonical = SITE + name
    ld = '<script type="application/ld+json">\n%s\n</script>\n' % json.dumps(jsonld, ensure_ascii=False, indent=1)
    html = render_page(name, title, description, body, canonical, ld + extra_head)
    open(os.path.join(ROOT, name), "w", encoding="utf-8", newline="\n").write(html)
    return html


def build_tools_page():
    cards = "\n".join(tool_card(t) for t in TOOLS)
    chips = " ".join('<button class="chip" type="button" data-filter="%s">%s <span>%d</span></button>'
                     % (c["slug"], e(c["name"]), len(TOOLS_BY_CAT[c["slug"]])) for c in CATS)
    groups = []
    for c in CATS:
        items = TOOLS_BY_CAT[c["slug"]]
        groups.append(
            '<section class="dir-group" id="%s" data-group="%s">\n'
            '  <div class="dir-head">%s<h2>%s</h2><p>%s</p></div>\n'
            '  <div class="tool-cards">\n%s\n  </div>\n'
            '<p class="browse-all"><a class="button ghost" href="./%s.html">Open the %s page</a></p>\n</section>'
            % (c["slug"], c["slug"], icon(c["slug"]), e(c["name"]), e(c["blurb"]),
               "\n".join(tool_card(t) for t in items), c["slug"], e(c["name"])))
    body = (
        '<section class="band band-hero">\n  <div class="shell">\n    %s\n'
        '    <h1>Every free maker, on one page</h1>\n'
        '    <p class="lede">%d tools in five families. Each one runs in your browser, needs no account and leaves no watermark. Search the list, or jump straight to a category.</p>\n'
        '    <div class="dir-search">\n'
        '      <label class="sr-only" for="dir-search">Search the tools</label>\n'
        '      <input id="dir-search" type="search" placeholder="Search %d tools - try &quot;sticker&quot;, &quot;name&quot; or &quot;printable&quot;" autocomplete="off">\n'
        '      <p class="dir-count" id="dir-count" role="status">Showing all %d tools</p>\n'
        '    </div>\n'
        '    <div class="chip-row">%s<button class="chip is-on" type="button" data-filter="all">All <span>%d</span></button></div>\n'
        '  </div>\n</section>\n'
        '<section class="band">\n  <div class="shell">\n%s\n  </div>\n</section>\n'
        '<section class="band band-quiet">\n  <div class="shell">\n    <h2>Not sure which one to pick?</h2>\n'
        '    <p class="lede">Start with the tool closest to the object you want, design it free, then decide whether to print at home or ask for it made.</p>\n'
        '    <p class="browse-all"><a class="button coral" href="./how-it-works.html">See how the tools work</a> <a class="button ghost" href="./create.html">Open the keychain maker</a></p>\n'
        '  </div>\n</section>'
    ) % (breadcrumb([("Home", "./"), ("Tools", None)]), TOTAL, TOTAL, TOTAL, chips, TOTAL, "\n".join(groups))
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "name": "Free creative tool directory",
         "description": "All %d free Tiny County Makers tools in five categories." % TOTAL,
         "url": SITE + "tools.html",
         "hasPart": [{"@type": "SoftwareApplication", "name": t["name"], "url": SITE + t["file"],
                      "applicationCategory": "DesignApplication", "operatingSystem": "Any browser"}
                     for t in TOOLS]},
        crumb_schema([("Home", "./"), ("Tools", "tools.html")]),
        {"@type": "ItemList", "name": "Free tools",
         "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": t["name"], "url": SITE + t["file"]}
                             for i, t in enumerate(TOOLS)]},
    ]}
    write_page("tools.html", "All 30 Free Tools - Photo, Sticker and Print Makers",
               "Browse all 30 free Tiny County Makers tools: photo gifts, stickers and cutting, event printables, name accessories and kids worksheets. No signup.",
               body, ld)


def build_category_page(c):
    items = TOOLS_BY_CAT[c["slug"]]
    others = [x for x in CATS if x["slug"] != c["slug"]]
    intros = {
        "photo-gifts": ("Turn favorite memories into objects you can keep.", "Browse photo gifts"),
        "stickers-cutting": ("Little designs, ready to stick and share.", "Browse stickers and cut lines"),
        "events-printables": ("Make the little details feel personal.", "Browse printables"),
        "names-accessories": ("Put their name on something special.", "Browse name makers"),
        "kids-learning": ("Make learning a little more playful.", "Browse learning tools"),
    }
    headline, cta = intros[c["slug"]]
    body = (
        '<section class="band band-hero category-feature" style="--category-photo: url(\'./%s\')">\n  <div class="shell">\n    %s\n'
        '    <div class="cat-hero">\n      <div>\n'
        '        <p class="eyebrow">%s · %d free tools</p>\n'
        '        <h1>%s</h1>\n        <p class="lede">%s Create and download your design for free, right in your browser.</p>\n'
        '        <p class="browse-all"><a class="button coral" href="#category-tools">%s →</a> <a class="button ghost" href="./how-it-works.html">How it works</a></p>\n'
        '      </div>\n      <img src="./%s" alt="%s" width="720" height="540" fetchpriority="high" decoding="async">\n    </div>\n'
        '  </div>\n</section>\n'
        '<section class="band category-list" id="category-tools">\n  <div class="shell">\n    <p class="eyebrow">%s tools</p><h2>Choose what to create</h2>\n    <div class="tool-cards">\n%s\n    </div>\n  </div>\n</section>\n'
        '<section class="band band-quiet">\n  <div class="shell">\n    <h2>Other families</h2>\n    <div class="cat-cards">\n%s\n    </div>\n  </div>\n</section>'
    ) % (e(c["image"]), breadcrumb([("Home", "./"), ("Tools", "./tools.html"), (c["name"], None)]), e(c["name"]), len(items), e(headline),
         e(c["blurb"]), e(cta), e(c["image"]), e(c["name"]),
         e(c["name"]), "\n".join(tool_card(t) for t in items),
         "\n".join(cat_card(x) for x in others))
    title = "%s - %d Free Makers" % (c["name"], len(items))
    desc = "Free %s tools: %s. Design in the browser, download the file, no signup." % (
        c["name"].lower(), ", ".join(t["short"] for t in items[:4]))
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "name": c["name"], "description": c["blurb"], "url": SITE + c["slug"] + ".html"},
        crumb_schema([("Home", "./"), ("Tools", "tools.html"), (c["name"], c["slug"] + ".html")]),
        {"@type": "ItemList", "name": c["name"] + " tools",
         "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": t["name"], "url": SITE + t["file"]}
                             for i, t in enumerate(items)]},
    ]}
    write_page(c["slug"] + ".html", title, desc, body, ld)


def cat_card(c):
    return ('<a class="cat-card" href="./%s.html"><img src="./%s" alt="" width="560" height="420" loading="lazy" decoding="async">'
            '<span><b>%s</b><em>%d tools</em></span></a>') % (c["slug"], e(c["image"]), e(c["name"]), len(TOOLS_BY_CAT[c["slug"]]))


def build_how_page():
    steps = [
        ("1", "Pick the tool for the object you want", "Thirty makers cover photo gifts, stickers and cut lines, event printables, name accessories and children's worksheets. Every one of them opens with no account and no install.", "./tools.html", "Browse the tools"),
        ("2", "Design it free, in your browser", "Upload a photo or type the words, then change size, shape, colours and messages. The file is rendered on your own device, so your photo is never uploaded to a server.", "./create.html", "Try the keychain maker"),
        ("3", "Download the file, or ask for it made", "Take the PNG (and the SVG cut line where the tool offers one) and print it yourself, or send the job to the workshop for an acrylic or card version. Proof first, payment only after you approve it.", "./index.html#checkout", "See custom orders"),
    ]
    cards = "\n".join(
        '<article class="step-card"><span class="step-num">%s</span><h3>%s</h3><p>%s</p>'
        '<a class="text-link" href="%s">%s</a></article>' % (n, e(h), e(p), e(href), e(link))
        for n, h, p, href, link in steps)
    body = (
        '<section class="band band-hero">\n  <div class="shell">\n    %s\n'
        '    <h1>How the free tools work</h1>\n'
        '    <p class="lede">Three steps: choose a maker, design it in the browser, then download the file or ask the workshop to make the real object. No signup, no watermark, and no photo leaves your device.</p>\n'
        '  </div>\n</section>\n'
        '<section class="band">\n  <div class="shell">\n    <div class="step-cards">%s</div>\n  </div>\n</section>\n'
        '<section class="band band-quiet">\n  <div class="shell">\n    <h2>What you get, and what you do not pay for</h2>\n'
        '    <div class="fact-grid">\n'
        '      <div><b>Free downloads</b><p>Every maker exports a print-ready file at no cost. The sticker, keychain and tag tools export a PNG, and the cutting tools also export an SVG cut line.</p></div>\n'
        '      <div><b>Made on your device</b><p>Photos are read in the browser with the canvas API. Nothing is uploaded while you design, which is also why the tools keep working offline once the page has loaded.</p></div>\n'
        '      <div><b>Optional workshop orders</b><p>If you would rather not print or cut it yourself, the same files can be made in acrylic or card by the workshop. You get a proof and a price before anything is paid.</p></div>\n'
        '    </div>\n'
        '    <p class="browse-all"><a class="button coral" href="./tools.html">Find your tool</a></p>\n  </div>\n</section>'
    ) % (breadcrumb([("Home", "./"), ("How it works", None)]), cards)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "HowTo", "name": "How to make a personalised design with the free tools",
         "totalTime": "PT5M",
         "step": [{"@type": "HowToStep", "position": i + 1, "name": h, "text": p, "url": SITE + href.lstrip("./").lstrip("#")}
                  for i, (n, h, p, href, link) in enumerate(steps)]},
        crumb_schema([("Home", "./"), ("How it works", "how-it-works.html")]),
        {"@type": "WebPage", "name": "How the free tools work", "url": SITE + "how-it-works.html"},
    ]}
    write_page("how-it-works.html", "How the Free Tools Work - Design, Download, Order",
               "How Tiny County Makers works in three steps: choose a free maker, design in your browser, then download the file or ask the workshop to make the real object.",
               body, ld)


def build_inspiration_page():
    cards = "\n".join(
        '<figure class="insp-card"><img src="%s" alt="%s" width="%d" height="%d" loading="lazy" decoding="async">'
        '<figcaption><b>%s</b><span>%s</span><a class="text-link" href="%s">Open the maker</a></figcaption></figure>'
        % (e(t["card"]), e(t["short"] + " product photo"), t["cw"], t["ch"], e(t["name"]), e(t["blurb"]), e(url(t))) for t in TOOLS)
    body = (
        '<section class="band band-hero">\n  <div class="shell">\n    %s\n'
        '    <h1>What each tool is built to make</h1>\n'
        '    <p class="lede">One photo per tool, so you can see the object before you start. These are studio product shots of what each maker is designed to produce - your own photo and words go into the design, and the tool renders the file on your device.</p>\n'
        '    <p class="browse-all"><a class="button coral" href="./tools.html">Open the tool directory</a> <a class="button ghost" href="./how-it-works.html">How it works</a></p>\n'
        '  </div>\n</section>\n'
        '<section class="band">\n  <div class="shell">\n    <h2>%d tools, %d products</h2>\n    <div class="insp-grid">%s</div>\n  </div>\n</section>\n'
        '<section class="band band-quiet">\n  <div class="shell">\n    <h2>About these pictures</h2>\n'
        '    <p class="lede">Each photo illustrates the product its tool produces. They are not customer submissions and no ratings, sales figures or reviews are published here. When you use a maker, the preview you see on screen is generated from your own photo.</p>\n'
        '  </div>\n</section>'
    ) % (breadcrumb([("Home", "./"), ("Inspiration", None)]), TOTAL, TOTAL, cards)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "ImageGallery", "name": "What each free tool makes", "url": SITE + "inspiration.html",
         "image": [SITE + t["image"] for t in TOOLS]},
        crumb_schema([("Home", "./"), ("Inspiration", "inspiration.html")]),
        {"@type": "WebPage", "name": "What each tool is built to make", "url": SITE + "inspiration.html"},
    ]}
    write_page("inspiration.html", "What Each Free Tool Makes - Product Gallery",
               "See the product each free Tiny County Makers tool is built for, from photo keychains and acrylic coasters to gift tags, worksheets and name plates.",
               body, ld)


# ---------------------------------------------------------------- sitemap

def build_sitemap():
    pages = [("", "1.0", "weekly"), ("tools.html", "0.9", "weekly")]
    pages += [(c["slug"] + ".html", "0.8", "monthly") for c in CATS]
    pages += [("how-it-works.html", "0.7", "monthly"), ("inspiration.html", "0.7", "monthly")]
    pages += [(t["file"], "0.8", "monthly") for t in TOOLS]
    pages += [("custom-acrylic-keychains.html", "0.8", "monthly")]
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pri, freq in pages:
        out += ["  <url>", "    <loc>%s%s</loc>" % (SITE, p),
                "    <lastmod>%s</lastmod>" % TODAY,
                "    <changefreq>%s</changefreq>" % freq,
                "    <priority>%s</priority>" % pri, "  </url>"]
    out.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
    txt = [SITE] + [SITE + p for p, _, _ in pages if p]
    open(os.path.join(ROOT, "sitemap.txt"), "w", encoding="utf-8", newline="\n").write("\n".join(txt) + "\n")
    return len(pages)


# ---------------------------------------------------------------- injection

def replace_between(html, start, end, block):
    pattern = re.compile(re.escape(start) + r"[\s\S]*?" + re.escape(end))
    if pattern.search(html):
        return pattern.sub(lambda m: block, html, count=1)
    return None


def ensure_asset_links(html, name):
    if 'href="./site.css"' not in html:
        styles = list(re.finditer(r'<link rel="stylesheet"[^>]*>', html))
        if styles:
            last = styles[-1]
            html = html[: last.end()] + '\n<link rel="stylesheet" href="./site.css">' + html[last.end():]
        else:
            html = html.replace("</head>", '<link rel="stylesheet" href="./maker.css">\n<link rel="stylesheet" href="./site.css">\n</head>', 1)
    if 'src="./assets/site-nav.js"' not in html:
        html = html.replace("</body>", '<script src="./assets/site-nav.js" defer></script>\n</body>', 1) \
            if "</body>" in html else html + '\n<script src="./assets/site-nav.js" defer></script>\n'
    return html


def inject_shell(name, html):
    """Put the shared header, search dialog and footer on a page once.

    Markers win, so a second run is a no-op; the fallback patterns only run on
    a page that still carries the original hand-written shell.
    """
    header, footer, search = render_header(), render_footer(), render_search()
    got = replace_between(html, "<!-- site:header -->", "<!-- /site:header -->", header)
    if got is None:
        m = re.search(r'<header\b[^>]*class="[^"]*\btop\b[^"]*"[^>]*>[\s\S]*?</header>', html)
        if m is None:
            m = re.search(r"<header\b[^>]*>[\s\S]*?</header>", html)
        html = html[: m.start()] + header + html[m.end():] if m else html.replace("<body>", "<body>\n" + header, 1)
    else:
        html = got

    got = replace_between(html, "<!-- site:footer -->", "<!-- /site:footer -->", footer)
    if got is None:
        m = re.search(r"<footer\b[\s\S]*?</footer>", html)
        html = html[: m.start()] + footer + html[m.end():] if m else html.replace("</body>", footer + "\n</body>", 1)
    else:
        html = got

    got = replace_between(html, "<!-- site:search -->", "<!-- /site:search -->", search)
    if got is not None:
        html = got
    elif 'id="site-search"' not in html:
        html = html.replace("</body>", search + "\n</body>", 1)

    html = ensure_asset_links(html, name)
    if html.count("<header") != 1 or html.count("</header>") != 1:
        raise SystemExit("%s has %d headers" % (name, html.count("<header")))
    if html.count('id="site-top"') != 1 or html.count('id="site-search"') != 1:
        raise SystemExit("%s duplicated a shared shell id" % name)
    return html


def inject_related(name, html):
    """Swap the per-page related-tools list for the generated one."""
    block = render_related(name)
    if block is None:
        return html
    got = replace_between(html, "<!-- site:related -->", "<!-- /site:related -->", block)
    if got:
        return got
    m = re.search(r'<section class="more-tools">[\s\S]*?</section>', html)
    if m:
        return html[: m.start()] + block + html[m.end():]
    m = re.search(r'<section class="tools-band" id="more-tools">[\s\S]*?</section>', html)
    if m:
        band = block.replace('<!-- site:related -->', '<!-- site:related -->\n<!-- homepage band -->') \
                   .replace('class="more-tools"', 'class="tools-band"', 1)
        return html[: m.start()] + band + html[m.end():]
    return html


def inject_maker_intro(name, html):
    """Use concise copy above the editor; the full instructions remain below it."""
    t = next((item for item in TOOLS if item["file"] == name), None)
    if t is None:
        return html
    summary = e(t["blurb"] + " Create and download it free in your browser.")
    pattern = re.compile(r'(<main\s+data-maker="[^"]+">\s*<section class="hero">[\s\S]*?<h1>[\s\S]*?</h1>\s*)<p>[\s\S]*?</p>')
    return pattern.sub(lambda m: m.group(1) + "<p>" + summary + "</p>", html, count=1)


def main():
    pages = sorted(f for f in os.listdir(ROOT) if f.endswith(".html") and f != "googled29f145cd217092d.html")
    changed = []
    for name in pages:
        p = os.path.join(ROOT, name)
        html = open(p, encoding="utf-8").read()
        before = html
        html = inject_shell(name, html)
        html = inject_related(name, html)
        html = inject_maker_intro(name, html)
        if html != before:
            open(p, "w", encoding="utf-8", newline="\n").write(html)
            changed.append(name)
    # index.html and create.html are byte-identical by design
    create = os.path.join(ROOT, "create.html")
    if os.path.exists(create):
        shutil.copyfile(os.path.join(ROOT, "index.html"), create)
        if "create.html" not in changed:
            changed.append("create.html (copied from index.html)")
    build_tools_page()
    for c in CATS:
        build_category_page(c)
    build_how_page()
    build_inspiration_page()
    n = build_sitemap()
    print("tools:", TOTAL, "categories:", len(CATS), "sitemap entries:", n)
    print("rewritten:", ", ".join(changed))


if __name__ == "__main__":
    main()
