# Full Bloom Counseling — SEO Strategy Report
*Prepared May 2026*

---

## What Was Fixed (Already Deployed to `/fbc-update`)

### 🔴 Critical Bugs — Fixed

**1. Double `<!DOCTYPE html>` in 11 blog posts**
This was your biggest technical SEO problem. Eleven blog posts had an entire second page's `<head>` block embedded inside them — meaning Google was parsing conflicting canonical URLs, wrong OG tags, and duplicate scripts on every one of those pages. Posts affected:
- brainspotting-therapy-denver
- couples-therapy-denver-gottman-method
- culturally-responsive-therapy-denver
- emdr-therapy-what-to-expect
- enneagram-relationships-communication-denver
- feeling-stuck-in-life-therapy-denver
- intuitive-eating-beginners-guide-denver
- narrative-therapy-couples-families-denver
- therapy-for-men-denver
- therapy-parents-young-adults-postpartum-colorado
- what-is-complex-ptsd-denver

All fixed. Each post now has exactly one clean `<head>`.

**2. Duplicate `<script src="main.js">` on every blog post**
All 19 blog posts were loading your JS file twice. Fixed across the board.

**3. Non-ISO datePublished in structured data**
Schema.org requires `YYYY-MM-DD` format. Six posts had dates like `"August 19, 2025"` which Google's Rich Results validator rejects, meaning those posts got zero structured data credit. Fixed:
- anti-diet-therapy-body-trust
- enneagram-therapy-denver
- safe-sound-protocol-denver
- the-power-of-pausing
- the-unspoken-truth-about-starting-therapy
- therapy-for-growth-denver

### 🟡 Schema Improvements — Added

**FAQPage schema on `/faqs/`**
Your FAQs page had no FAQPage structured data. Added a complete schema with 6 Q&A pairs. This can generate rich results (expanded FAQ display) directly in Google SERPs — free real estate that increases CTR significantly without ranking higher.

**All service pages already had MedicalBusiness schema** ✓  
**Sitemap was already complete** ✓  
**Robots.txt is well-configured** ✓

---

## 3 New Blog Posts Added

All three target high-volume keyword gaps where competitors rank and you had zero content.

| Post | Target Keywords | Date | Author |
|------|----------------|------|--------|
| `somatic-therapy-denver` | "somatic therapy Denver", "body-based therapy Denver", "somatic therapist Colorado" | March 2025 | Natalie Siegel |
| `life-transitions-therapy-denver` | "life transitions therapy Denver", "therapist for life changes Denver", "therapy for big life changes Colorado" | November 2025 | Jillian Corpora |
| `attachment-styles-therapy-denver` | "attachment styles therapy Denver", "attachment-based therapy Colorado", "anxious attachment therapist Denver" | February 2026 | Kelli Ruhl |

Each post:
- Matches the exact HTML structure, tone, and style of existing posts
- Has proper structured data (BlogPosting schema with correct ISO dates)
- Has breadcrumb schema
- Links internally to relevant service pages and other blog posts
- Has sidebar with related posts and services
- Is added to the sitemap and blog index

---

## The Keyword Gap Problem (Your 95 vs. Their 20,000)

The keyword count gap is almost entirely a **content volume problem**. Here's what's happening:

A site with 20,000 keywords has almost certainly been publishing 2–4 blog posts per month for years, covering every variation of every therapy topic imaginable. Each post ranks for its primary keyword plus dozens of long-tail variations. That math compounds quickly.

You currently have 22 blog posts. To close this gap meaningfully, you need **consistent volume** — not perfection, just regularity.

**Realistic target:** 2 posts per month, every month, for 12–18 months. That's 24–36 new posts. At an average of 50–100 keyword variations per post (primary + long-tail), you'd go from ~95 to 1,200–3,500 keywords. That's the realistic organic ceiling without paid amplification.

---

## Keyword Strategy: What to Write Next

Your site is strong on modality-specific content (EMDR, Brainspotting, Enneagram, EMDR readiness). The gaps are in **population/demographic keywords** and **condition-specific keywords** that have very high search volume.

### Highest-Priority Gaps to Fill (in order)

**Condition-Specific (high volume, you have the service pages but no blog depth):**
1. `anxiety therapy for women Denver` — huge search volume, gender-specific content ranks well
2. `depression therapy Denver` — you have the service page, need a blog post
3. `grief counseling Denver` — service page exists, no blog
4. `ADHD therapy Denver adults` — service page exists, no blog
5. `postpartum depression therapy Denver` / `therapy after baby Denver` — very high intent
6. `OCD therapist Denver` — if any of your therapists treat it, this is high volume
7. `relationship anxiety therapy Denver` — bridges anxiety + relationship content

**Modality/Approach (trending searches):**
8. `IFS therapy Denver` (Internal Family Systems) — very trendy, high volume
9. `DBT skills therapy Denver` — popular search term
10. `polyvagal therapy Denver` — rising rapidly with trauma-informed audience

**Population-Specific:**
11. `therapy for new mothers Denver`
12. `therapy for college students Denver`
13. `therapy for high-achieving women Denver` / `therapy for perfectionists Denver`
14. `interracial couples therapy Denver` — aligns with your culturally responsive focus
15. `LGBTQ+ affirming therapist Denver` — if applicable to your practice

**Practical/Decision-Stage:**
16. `how much does therapy cost in Denver`
17. `how to find a therapist in Denver`
18. `out-of-network therapy Denver reimbursement`
19. `therapy vs psychiatry Denver what's the difference`
20. `when to see a therapist vs counselor Denver`

These last five are **bottom-of-funnel** — people searching them are *about to book*. They're lower volume but higher conversion.

---

## Sitemap: Does It Auto-Update?

**No.** Your site is a static HTML site hosted on GitHub Pages. The sitemap (`sitemap.xml`) is a manually maintained file. Every time you add a new blog post or page, you must add it to `sitemap.xml` manually.

**How to keep up with it:**
1. When you create a new post, add a `<url>` block to `sitemap.xml` before deploying
2. Use the `lastmod` date matching the post's `datePublished`
3. Set `priority` to `0.7` for blog posts, `0.8` for service pages
4. After deploying, submit the sitemap URL to Google Search Console: `https://fullbloomcounseling.com/sitemap.xml`

**Pro tip:** Create a BLOG-CHECKLIST.md in your repo with a step-by-step for every new post (sitemap update, blog index card, structured data, etc.). This prevents these bugs from recurring.

---

## Robots.txt — You're in Good Shape

Your current `robots.txt` is well-configured:
- Allows all major search bots (Google, Bing, DuckDuckBot)
- Allows AI bots (GPTBot, ClaudeBot, PerplexityBot) — smart for AI search visibility
- Blocks scraper bots (Ahrefs, Semrush, DotBot) — protects your data from competitors
- Points to your sitemap ✓

One note: blocking Ahrefs/Semrush bots means your site won't appear in *their indexes*, which affects the keyword count tools like the one showing you "95 keywords." Your actual indexed keywords in Google are likely higher than what those tools report. To get accurate numbers, use **Google Search Console** (free, direct from Google).

---

## Backlinks: How to Get Them

Backlinks are inbound links from other websites to yours. They're one of Google's top 3 ranking factors. You need them. Here's how to realistically get them:

### Free / DIY Strategies

**1. Psychology Today, TherapyDen, Zencare — Claim and optimize your profiles**
These directories rank on page 1 for nearly every therapy keyword in Denver. They pass SEO value to your site through their profile links. If you're not fully optimized on all three with your website URL prominently linked, do this today. It takes 30 minutes and is probably the highest ROI action on this list.

**2. HARO / Quoted.io (Help A Reporter Out)**
Journalists and bloggers constantly need therapist quotes for mental health articles. Sign up for HARO (now Connectively) or Quoted.io, respond to relevant queries, and when you're quoted, you get a link from a news site or publication. These are high-authority links. One good placement can be worth more than 50 directory links.

**3. Guest posts on mental health blogs**
Write a 600–800 word post for a mental health blog, wellness publication, or local Denver site and ask for a bio link back to fullbloomcounseling.com. Targets: Psychology Today's blog, Therapy Brand blogs, local Denver lifestyle/wellness publications, Colorado parenting blogs.

**4. Podcast appearances**
Mental health podcasts, Denver lifestyle podcasts, parenting podcasts — they almost always link to guests' websites in show notes. A 30-minute conversation = a permanent backlink from a domain that Google trusts.

**5. Local business partnerships**
Partner with aligned local businesses (yoga studios, OB/GYNs, pediatricians, fertility clinics, dietitians) and ask to be listed on their "resources" or "referrals" page. A link from a local medical or wellness practice is valuable both for SEO and for new client referrals.

**6. College/university resource pages**
University counseling centers sometimes maintain off-campus therapy referral lists. Reach out to DU, CU Denver, Metro State, and similar schools about being included.

**7. Write something shareable**
Create one genuinely useful free resource — a PDF guide ("How to Find the Right Therapist in Denver"), an infographic on therapy modalities, a quiz — and promote it. If it gets shared by mental health educators, therapists in other states, or wellness bloggers, those are natural backlinks.

---

## Internal Linking: Yes, You Need More

Internal links (links between your own pages) help Google understand your site structure and distribute "authority" from your stronger pages to your weaker ones. Right now, your blog posts have decent internal linking in the sidebar, but the body text could be more aggressive.

**The standard you should aim for:** Every blog post should link to:
- At least 2–3 relevant service pages (in the body text, not just the sidebar)
- At least 1–2 other blog posts
- The contact page (CTA in the closing paragraph)

**Your service pages** should link to related blog posts. Right now they mostly don't. For example, `/services/trauma-therapy/` should link to your EMDR post, your brainspotting post, your C-PTSD post, and the new somatic therapy post. This sends people deeper into your site *and* tells Google those posts are relevant to that service.

**Quick win:** Go through your top 5 service pages and add 2–3 internal links to blog posts within the body copy. This takes an hour and has immediate SEO value.

---

## Google Business Profile — Do Not Neglect This

If you haven't claimed and fully optimized your Google Business Profile for Full Bloom Counseling, this is urgent. The map pack (the 3 local results that show up above organic results) is driven almost entirely by GBP signals, not your website. To appear there:

1. Claim your profile at business.google.com
2. Add all services with descriptions (use your keyword list above)
3. Upload 10+ photos of your actual office space
4. Get clients to leave Google reviews (ask at end of sessions, send a follow-up email with the direct review link)
5. Post to your GBP weekly (short updates, links back to new blog posts)
6. Add your Boulder location as a second location if applicable

**Reviews matter enormously.** A practice with 50 reviews at 4.8 stars will outrank a practice with better website SEO but 8 reviews. Prioritize getting reviews.

---

## What Else Can/Should Be Done

### On Your Website (No New Content Required)
- **Page speed:** Run your homepage through PageSpeed Insights (pagespeed.web.dev). If mobile score is below 70, that's a ranking factor issue worth fixing.
- **Image alt text audit:** Check that all images have descriptive, keyword-relevant alt text (not just "image" or blank). This helps with both SEO and accessibility.
- **Title tag optimization:** Some of your service pages could use location keywords more prominently. `"Anxiety Therapy in Denver, CO | Full Bloom Counseling"` is good; make sure all service pages follow this pattern.
- **Meta description length:** Google displays ~155–160 characters. A few of yours cut off with `…` — worth rewriting to complete thoughts within that limit.

### Off Your Website
- **Social signals:** Consistent Instagram and Facebook posting that links back to blog posts signals freshness to Google and drives direct traffic that reinforces ranking signals.
- **Email list:** A newsletter that links to new posts creates consistent traffic spikes when posts publish, which Google interprets as engagement signals.
- **Psychology Today profile optimization:** PT profiles rank on their own for local therapist searches. Treat yours like a separate SEO asset.

---

## Realistic Traffic Expectations

SEO timelines are slow. Here's honest guidance:

- **0–3 months:** Technical fixes (already done) improve crawlability. New posts get indexed. No dramatic traffic change yet.
- **3–6 months:** New posts start ranking for long-tail keywords. You'll see the keyword count in tools start climbing.
- **6–12 months:** Consistent posting + backlink building starts compounding. If you publish 2x/month and build even 5–10 backlinks, you'll likely see 30–60% organic traffic growth.
- **12–24 months:** This is where the gap with competitors closes meaningfully, assuming consistent content production.

The single most impactful thing you can do right now: **commit to 2 blog posts per month, every month.** Nothing else compounds as reliably for a therapy private practice site.

---

## Summary Checklist — What's Done vs. What's Next

### Done ✅
- [x] Fixed 11 blog posts with double DOCTYPE/head bugs
- [x] Fixed duplicate main.js on 19 blog posts
- [x] Fixed 6 non-ISO datePublished dates in structured data
- [x] Added FAQPage schema to /faqs/
- [x] Created 3 new SEO blog posts (somatic, life transitions, attachment styles)
- [x] Added all 3 posts to sitemap.xml
- [x] Added all 3 posts to blog index

### Your Next Actions 🎯
- [ ] Deploy this branch to production (push to GitHub)
- [ ] Submit sitemap to Google Search Console
- [ ] Claim/optimize Google Business Profile
- [ ] Claim/optimize Psychology Today, TherapyDen, Zencare profiles
- [ ] Sign up for HARO/Connectively and respond to 1 query per week
- [ ] Write 2 blog posts per month going forward (use keyword list above)
- [ ] Add internal links from service pages to relevant blog posts
- [ ] Ask 5–10 current clients for a Google review
- [ ] Run PageSpeed Insights on homepage and fix any sub-70 mobile scores
