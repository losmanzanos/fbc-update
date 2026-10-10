#!/usr/bin/env python3
"""Rebuild every list of blog posts from the post pages themselves.

Each post page (blog/<slug>/index.html) is the single source of truth. This
script reads them and regenerates:

  - the card grid on blog/index.html
  - the "From the Blog" section on the homepage (newest 3)
  - feed.xml (newest 15)
  - the blog entries in sitemap.xml
  - the Blog list in llms.txt
  - the blog entries in the site search index (js/main.js)

Scheduling: a post whose datePublished is later than today (Denver time) is
left out of every list. During a Netlify build (NETLIFY=true) its folder is
also removed from the deploy, so the URL does not exist until publish day.

Existing cards and search entries are kept exactly as written; only posts
that are missing get a generated card or entry. Standard library only.

Usage:  python3 scripts/build_blog.py          (writes changes)
        python3 scripts/build_blog.py --check  (exit 1 if anything would change)
"""
import datetime
import glob
import html
import json
import os
import re
import shutil
import sys
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://fullbloomcounseling.com"
TODAY = datetime.datetime.now(ZoneInfo("America/Denver")).date().isoformat()
DEFAULT_CAT = "Mental Health & Wellness"


def path(*p):
    return os.path.join(ROOT, *p)


def read(p):
    with open(path(p), encoding="utf-8") as f:
        return f.read()


def plain(s):
    """HTML fragment to plain text with real characters."""
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def xml_escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def js_escape(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


# ── 1. Read every post ────────────────────────────────────────────────────────
def load_posts():
    posts = []
    for f in sorted(glob.glob(path("blog", "*", "index.html"))):
        slug = os.path.basename(os.path.dirname(f))
        h = open(f, encoding="utf-8").read()
        ld = None
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
            try:
                d = json.loads(m.group(1))
            except ValueError:
                continue
            if d.get("@type") == "BlogPosting":
                ld = d
                break
        if not ld or "datePublished" not in ld:
            print(f"  ! skipping {slug}: no BlogPosting datePublished")
            continue
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
        desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', h) or \
            re.search(r'<meta\s+content="([^"]*)"\s+name="description"', h)
        cat = re.search(r"letter-spacing:\.22em;[^>]*>([^<]+)<", h)
        img = re.search(r'<img src="\.\./\.\./images/([^"]+)\.jpg" alt="([^"]*)"', h)
        author = ld.get("author") or {}
        posts.append({
            "slug": slug,
            "date": ld["datePublished"][:10],
            "modified": (ld.get("dateModified") or ld["datePublished"])[:10],
            "h1": h1.group(1).strip() if h1 else html.escape(ld.get("headline", slug)),
            "desc": desc.group(1) if desc else "",
            "cat": cat.group(1).strip() if cat else DEFAULT_CAT,
            "img": img.group(1) if img else None,
            "alt": img.group(2) if img else "",
            "author": author.get("name", "Full Bloom Counseling") if isinstance(author, dict) else "Full Bloom Counseling",
        })
    return posts


# ── 2. Blog index cards ───────────────────────────────────────────────────────
CARD_RE = re.compile(r'      <div class="blog-card fade-in" data-date="[^"]*">\n.*?\n      </div>\n', re.S)


def card_slug(card):
    m = re.search(r'href="(?:\.\./)?blog/([^/"]+)/"', card)
    return m.group(1) if m else None


def make_card(p):
    month = datetime.date.fromisoformat(p["date"]).strftime("%B %Y").upper()
    cat = p["cat"].upper().replace("&AMP;", "&amp;")
    pic = ""
    if p["img"]:
        pic = (f'<picture><source srcset="../images/{p["img"]}.webp" type="image/webp">'
               f'<img src="../images/{p["img"]}.jpg" alt="{p["alt"]}" loading="lazy" decoding="async" '
               f'width="1920" height="1080"></picture>')
    return f'''      <div class="blog-card fade-in" data-date="{p["date"]}">
        <a href="../blog/{p["slug"]}/" class="blog-card-img-link">
          <div class="blog-card-img">{pic}</div>
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-card-date">{month}</span>
            <span class="blog-card-sep">&middot;</span>
            <span class="blog-card-cat">{cat}</span>
          </div>
          <h3 class="blog-card-title"><a href="../blog/{p["slug"]}/">{p["h1"]}</a></h3>
          <p class="blog-card-excerpt">{p["desc"]}</p>
          <a href="../blog/{p["slug"]}/" class="blog-card-link">Read More &#8594;</a>
        </div>
      </div>
'''


def replace_between(text, start, end, new, label):
    i, j = text.find(start), text.find(end)
    if i < 0 or j < 0:
        sys.exit(f"Missing {label} markers ({start} / {end})")
    return text[: i + len(start)] + "\n" + new + text[j:]


def build_cards(live):
    bi = read("blog/index.html")
    start, end = "<!-- BLOG-CARDS:START -->", "<!-- BLOG-CARDS:END -->"
    block = bi[bi.find(start):bi.find(end)]
    existing = {card_slug(c): c for c in CARD_RE.findall(block)}
    order = {s: i for i, s in enumerate(existing)}
    cards = []
    for p in live:
        c = existing.get(p["slug"]) or make_card(p)
        c = re.sub(r'data-date="[^"]*"', f'data-date="{p["date"]}"', c, count=1)
        cards.append((p, c))
    # newest first; on the same day, posts without a card yet go first, then existing order
    cards.sort(key=lambda pc: (pc[0]["date"], -order.get(pc[0]["slug"], -1)), reverse=True)
    for p, c in cards:
        p["excerpt"] = re.search(r'blog-card-excerpt">(.*?)</p>', c, re.S).group(1)
    bi = replace_between(bi, start, end, "".join(c for _, c in cards) + "      ", "blog index")
    return bi, cards


def build_home(cards):
    home = read("index.html")
    top = "".join(c.replace('href="../blog/', 'href="blog/').replace('"../images/', '"images/')
                  for _, c in cards[:3])
    return replace_between(home, "<!-- LATEST-POSTS:START -->", "<!-- LATEST-POSTS:END -->",
                           top + "    ", "homepage")


# ── 3. RSS feed ───────────────────────────────────────────────────────────────
def rfc822(d):
    return datetime.datetime.fromisoformat(d).strftime("%a, %d %b %Y 09:00:00 +0000")


def build_feed(cards):
    feed = read("feed.xml")
    items = ""
    for p, _ in cards[:15]:
        url = f"{SITE}/blog/{p['slug']}/"
        items += f"""    <item>
      <title>{xml_escape(plain(p['h1']))}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{rfc822(p['date'])}</pubDate>
      <description>{xml_escape(plain(p['excerpt']))}</description>
    </item>
"""
    head = feed[: feed.find("    <item>")] if "<item>" in feed else feed[: feed.find("  </channel>")]
    head = re.sub(r"<lastBuildDate>[^<]*", f"<lastBuildDate>{rfc822(cards[0][0]['date'])}", head, count=1)
    return head + items + "  </channel>\n</rss>\n"


# ── 4. Sitemap ────────────────────────────────────────────────────────────────
def build_sitemap(live):
    sm = read("sitemap.xml")
    sm = re.sub(r"\s*<url>\s*<loc>" + re.escape(SITE) + r"/blog/[^/<]+/</loc>.*?</url>", "", sm, flags=re.S)
    entries = "".join(f"""  <url>
    <loc>{SITE}/blog/{p['slug']}/</loc>
    <lastmod>{max(p['modified'], p['date'])}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
""" for p in sorted(live, key=lambda p: p["date"]))
    newest = max(p["date"] for p in live)
    sm = re.sub(r"(<loc>" + re.escape(SITE) + r"/blog/</loc>\s*<lastmod>)([^<]*)",
                lambda m: m.group(1) + max(m.group(2), newest), sm)
    sm = re.sub(r"(<loc>" + re.escape(SITE) + r"/</loc>\s*<lastmod>)([^<]*)",
                lambda m: m.group(1) + max(m.group(2), newest), sm)
    return sm.replace("</urlset>", "\n" + entries + "</urlset>").replace("\n\n\n", "\n\n")


# ── 5. llms.txt ───────────────────────────────────────────────────────────────
def build_llms(cards):
    ll = read("llms.txt")
    lines = "".join(f"- [{plain(p['h1'])}]({SITE}/blog/{p['slug']}/)\n" for p, _ in cards)
    m = re.search(r"## Blog\n\n(?:- .*\n)*", ll)
    if not m:
        return ll
    return ll[: m.start()] + "## Blog\n\n" + lines + ll[m.end():]


# ── 6. Site search index ──────────────────────────────────────────────────────
def build_search(live, future):
    js = read("js/main.js")
    for p in future:  # never let search reveal a scheduled post
        js = re.sub(r"  \{url:'/blog/" + re.escape(p["slug"]) + r"/'.*\n", "", js)
    anchor = re.search(r"  \{url:'/blog/',.*\n", js)
    add = ""
    for p, _ in sorted(((p, None) for p in live), key=lambda x: x[0]["date"], reverse=True):
        if f"{{url:'/blog/{p['slug']}/'" not in js:
            add += (f"  {{url:'/blog/{p['slug']}/',title:'{js_escape(plain(p['h1']))}',"
                    f"desc:'{js_escape(plain(p['desc']))}',cat:'Blog',author:'{js_escape(p['author'])}'}},\n")
    if add and anchor:
        js = js[: anchor.end()] + add + js[anchor.end():]
    return js


# ── main ──────────────────────────────────────────────────────────────────────
def main():
    check = "--check" in sys.argv
    posts = load_posts()
    live = [p for p in posts if p["date"] <= TODAY]
    future = [p for p in posts if p["date"] > TODAY]
    bi, cards = build_cards(live)
    outputs = {
        "blog/index.html": bi,
        "index.html": build_home(cards),
        "feed.xml": build_feed(cards),
        "sitemap.xml": build_sitemap(live),
        "llms.txt": build_llms(cards),
        "js/main.js": build_search(live, future),
    }
    changed = [k for k, v in outputs.items() if read(k) != v]
    print(f"{len(live)} live posts, {len(future)} scheduled"
          + (": " + ", ".join(f"{p['slug']} ({p['date']})" for p in future) if future else ""))
    if check:
        print("would change:", ", ".join(changed) or "nothing")
        sys.exit(1 if changed else 0)
    for k in changed:
        with open(path(k), "w", encoding="utf-8") as f:
            f.write(outputs[k])
    print("updated:", ", ".join(changed) or "nothing")
    if os.environ.get("NETLIFY") == "true":
        for p in future:
            shutil.rmtree(path("blog", p["slug"]), ignore_errors=True)
            print(f"held back from deploy: blog/{p['slug']}/")


if __name__ == "__main__":
    main()
