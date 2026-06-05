# Full Bloom Counseling — Blog Guide

## The Fastest Way to Publish a Post

1. **Open** `create-post.html` in any browser (double-click it or open with Chrome/Firefox)
2. **Fill in** the form fields
3. **Click** Generate HTML
4. **Follow** the step-by-step instructions that appear — takes about 2 minutes

That's it. The tool handles SEO schema, meta tags, hero layout, author box, sidebar, and blog card automatically.

---

## What the Tool Does For You

- Generates a complete, properly formatted `index.html` file
- Writes the BlogPosting JSON-LD schema (Google uses this for rich results)
- Inserts your hero image into the correct dark-overlay layout
- Formats inline images — single images full-width, pairs side-by-side
- Generates the blog index card HTML (correct date order)
- Counts meta description length and warns if it's too short/long
- Creates the SEO-friendly URL slug automatically from the title

---

## Manual Process (if you prefer not to use the tool)

### Step 1: Create the folder

Inside `fbc-site/blog/`, create a new folder. The folder name becomes the URL:

```
fbc-site/
  blog/
    your-post-slug-here/   ← new folder
      index.html           ← your post file
```

**Good slug examples:**
- `anxiety-in-the-body-denver`
- `what-is-the-enneagram`
- `setting-boundaries-relationships`

**Slug rules:** lowercase, hyphens only, no spaces or special characters, descriptive and keyword-rich.

### Step 2: Copy an existing post

Copy any existing post's `index.html` as your starting point:
```
blog/safe-sound-protocol-denver/index.html
```

### Step 3: Update these fields

| Field | Where to find it | What to change |
|---|---|---|
| `<title>` | `<head>` | Your post title + \| Full Bloom Counseling Denver |
| `meta description` | `<head>` | 120–155 char SEO description |
| `canonical` link | `<head>` | `/blog/your-slug/` |
| `og:image` | `<head>` | Your hero image path |
| `datePublished` | JSON-LD schema | ISO format: `2025-10-14` |
| Hero image `src` | Hero div | Your image path |
| Hero `h1` | Hero div | Your post title |
| Display date | Hero div | e.g. `October 2025` |
| Category label | Hero div | e.g. `Trauma & Healing` |
| Post body | `<article>` | Your content |
| Author name | `author-box` | Correct therapist |
| Author photo | `author-box` | `/images/team/NAME-square.jpg` |
| Author credentials | `author-box` | Correct creds |

### Step 4: Write the content

Structure every post the same way:

```html
<p class="lead" style="font-size:1.1rem;line-height:1.85;margin-bottom:1.5rem;">
  Opening paragraph — your hook. No heading needed here.
</p>

<h2>First Section Heading</h2>
<p>Content...</p>

<h2>Second Section Heading</h2>
<p>Content...</p>

<!-- Pull quote (optional but recommended) -->
<div class="svc-pullquote">
  <p>"The actual quote goes here."</p>
  <cite>— Attribution</cite>
</div>

<p>More content after the quote...</p>

<h2>Final Section</h2>
<p>End with a call to action linking to /contact/ ...</p>
```

### Step 5: Insert images

**Single image:**
```html
<figure style="margin:28px 0;">
  <img src="/images/fbc-photos/your-image.jpg" 
       alt="Descriptive alt text"
       loading="lazy" decoding="async"
       style="width:100%;border-radius:6px;box-shadow:0 4px 20px rgba(58,46,36,.12);">
  <figcaption style="text-align:center;font-size:.78rem;color:#5C4A38;margin-top:8px;">
    Optional caption text
  </figcaption>
</figure>
```

**Two images side by side:**
```html
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0;">
  <figure style="margin:0;">
    <img src="/images/fbc-photos/image-one.jpg" alt="Alt text" 
         loading="lazy" decoding="async"
         style="width:100%;height:220px;object-fit:cover;border-radius:6px;">
    <figcaption style="text-align:center;font-size:.75rem;margin-top:6px;">Caption 1</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="/images/fbc-photos/image-two.jpg" alt="Alt text"
         loading="lazy" decoding="async"
         style="width:100%;height:220px;object-fit:cover;border-radius:6px;">
    <figcaption style="text-align:center;font-size:.75rem;margin-top:6px;">Caption 2</figcaption>
  </figure>
</div>
```

### Step 6: Add to the blog index

Open `blog/index.html` and find `<div class="grid-3">`.

Paste your new card **in the correct date order** (newest post first):

```html
<div class="blog-card fade-in">
  <a href="/blog/your-slug/" class="blog-card-img-link">
    <div class="blog-card-img">
      <img src="/images/fbc-photos/your-hero.jpg" 
           alt="Your hero alt text" loading="lazy" decoding="async">
    </div>
  </a>
  <div class="blog-card-body">
    <div class="blog-card-meta">
      <span class="blog-card-date">OCTOBER 2025</span>
      <span class="blog-card-sep">&middot;</span>
      <span class="blog-card-cat">TRAUMA &amp; HEALING</span>
    </div>
    <h3 class="blog-card-title">
      <a href="/blog/your-slug/">Your Post Title Here</a>
    </h3>
    <p class="blog-card-excerpt">
      Your 1–2 sentence excerpt. Make it compelling — this is what shows in Google.
    </p>
    <a href="/blog/your-slug/" class="blog-card-link">Read More &#8594;</a>
  </div>
</div>
```

### Step 7: Update sitemap.xml

Add your new URL to `sitemap.xml` before `</urlset>`:

```xml
<url>
  <loc>https://fullbloomcounseling.com/blog/your-slug/</loc>
  <lastmod>2025-10-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

### Step 8: Push to GitHub

```bash
git add .
git commit -m "Add blog post: Your Post Title"
git push
```

Your post goes live on GitHub Pages within about 30 seconds.

---

## SEO Checklist for Every Post

- [ ] Title contains the main keyword naturally
- [ ] Meta description is 120–155 characters and includes a keyword
- [ ] Hero image has descriptive alt text with "Denver" or "Colorado" where appropriate
- [ ] Post has at least 2–3 H2 headings
- [ ] Post is 600–1,200 words (1,000+ preferred)
- [ ] At least one internal link to a relevant service page
- [ ] Author credentials match what's on their team page
- [ ] `datePublished` in schema matches actual publish date
- [ ] Card added to blog/index.html in correct date order
- [ ] Sitemap updated

---

## Available Team Photos

These are the exact filenames to use in the author box:

| Therapist | Photo path |
|---|---|
| Rebecca Moravec | `/images/team/rebecca-square.jpg` |
| Mark Whitney | `/images/team/mark-square.jpg` |
| Jillian Corpora | `/images/team/jillian-square.jpg` |
| Natalie Siegel | `/images/team/natalie-square.jpg` |
| Kelsey Bennett | `/images/team/kelsey-square.jpg` |
| Kelli Ruhl | `/images/team/kelli-square.jpg` |
| Kirsten Adorno | `/images/team/kirsten-square.jpg` |
| Myldha Verdelus | `/images/team/myldha-square.jpg` |

---

## Available Blog Images

Check `images/fbc-photos/` for available images. Some good ones for blogs:

- `individual-therapy-denver-session-healing.jpg` — person in therapy, warm
- `individual-therapy-denver-personal-growth.jpg` — outdoors, aspirational
- `ptsd-therapy-denver-full-bloom-counseling.jpg` — moody, introspective
- `couples-therapy-connection-denver.jpg` — couple together
- `intuitive-eating-therapy-denver-colorado.jpg` — food freedom
- `mental-health-therapy-denver.jpg` — clean, editorial
- `emdr-therapy-denver-trauma-healing.jpg` — therapy, healing

---

## Category Options

Use exactly one of these in the `blog-card-cat` span (uppercase) and category display:

- `MENTAL HEALTH & WELLNESS`
- `TRAUMA & HEALING`
- `COUPLES & RELATIONSHIPS`
- `HEALTH AT EVERY SIZE`
- `ENNEAGRAM THERAPY`
- `THERAPY PROCESS`
- `SELF-CARE & WELLNESS`
- `GROWTH`
- `ANXIETY`
- `DEPRESSION`

---

## Troubleshooting

**Post not showing up after pushing to GitHub?**
GitHub Pages can take 1–3 minutes to rebuild. Hard-refresh the page (Cmd+Shift+R / Ctrl+Shift+R).

**Image not loading?**
Double-check the path. It should start with `/images/` and be an exact filename match (case-sensitive on GitHub).

**Card appearing in the wrong order on the blog?**
Cards are manually ordered in blog/index.html. Find your card and move it to the right position — newest post first.

**Schema showing errors in Google's Rich Results Test?**
Most common issue: quotes inside the headline field. Make sure the title doesn't contain quotation marks, or escape them with `&quot;`.


---

## How to Delete a Blog Post

Deleting a post takes 4 steps. Do all four or the post will partially disappear (broken links, ghost sitemap entries, orphaned files).

### Step 1: Delete the folder

In your local repo, delete the entire post folder:

```
fbc-site/
  blog/
    your-post-slug/   ← delete this entire folder
```

In Finder: right-click → Move to Trash.  
In terminal:
```bash
rm -rf blog/your-post-slug/
```

### Step 2: Remove the card from the blog index

Open `blog/index.html`. Find the `<div class="blog-card fade-in" data-date="...">` block for this post and delete it entirely — from the opening `<div>` to its matching `</div>`. The card will look like this:

```html
<div class="blog-card fade-in" data-date="2025-10-14">
  <a href="/blog/your-post-slug/" class="blog-card-img-link">
    ...
  </a>
  <div class="blog-card-body">
    ...
  </div>
</div>
```

Delete the whole block. Save the file.

### Step 3: Remove from sitemap.xml

Open `sitemap.xml`. Find the `<url>` entry for this post and delete it:

```xml
<url>
  <loc>https://fullbloomcounseling.com/blog/your-post-slug/</loc>
  ...
</url>
```

Delete from `<url>` to `</url>` inclusive. Save the file.

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Remove blog post: Your Post Title"
git push
```

The post goes offline within ~60 seconds of the GitHub Pages rebuild.

---

### Optional: Set up a redirect (if the post had traffic)

If the post was getting Google traffic and you don't want to lose it, you can redirect visitors to a relevant service page instead of letting them hit a 404. Add a redirect HTML file at the old path:

Create `blog/your-post-slug/index.html` with just this content:

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/services/relevant-service/">
  <link rel="canonical" href="https://fullbloomcounseling.com/services/relevant-service/">
  <title>Redirecting…</title>
</head>
<body>
  <p><a href="/services/relevant-service/">Click here if not redirected</a></p>
</body>
</html>
```

Replace `/services/relevant-service/` with the most relevant page. This prevents the 404 and passes any lingering link equity to a page that still exists.

---

### Checklist

- [ ] Deleted the post folder from `blog/`
- [ ] Removed the card from `blog/index.html`
- [ ] Removed the `<url>` from `sitemap.xml`
- [ ] Committed and pushed to GitHub
- [ ] (Optional) Added a redirect if the post had Google traffic

---

*Last updated: March 2026*
