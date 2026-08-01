# Next Deploy — Queued Changes

## CSS fix: mobile line spacing — DONE LOCALLY, ships with next push
Homepage hero H1 sub-line "Therapy in Denver & Online Across Colorado"
(index.html, inside the <h1>) was inheriting the H1's tight heading
line-height when wrapping to two lines on mobile. Added line-height:1.55 to
the span's inline style. Verify on a mobile-width preview before pushing.

## Content queued
1. Therapy for Women in Denver blog post (service page has zero blog support;
   men's page has two posts). Build for the next weekly deploy.
2. Young Adults / quarter-life post the week after.
3. Regenerate feed.xml whenever posts are added (script pattern: newest 15
   cards from blog/index.html).

## Reminders
- One Netlify build per push — batch everything into one commit.
- GBP posts for the two July posts (copy already drafted in chat) if not
  posted yet.
