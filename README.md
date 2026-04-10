# Full Bloom Counseling Group — Website

Static site for [fullbloomcounseling.com](https://fullbloomcounseling.com).  
Built with plain HTML, CSS, and vanilla JavaScript. No build step. No dependencies.

## Structure

```
├── index.html              Homepage
├── services/               21 service pages
├── blog/                   Blog posts
├── team/                   Therapist bio pages
├── therapists/             Team overview page
├── about/                  About page
├── contact/                Contact page
├── faqs/                   FAQs page
├── press/                  Press & media page
├── css/
│   ├── style.css           Main stylesheet
│   └── mobile-service.css  Mobile-first responsive overrides
├── js/
│   └── main.js             Nav, search, FAQ accordion, form spam protection
├── images/                 All photos and graphics
│   └── fbc-photos/         Practice-specific photography
├── fonts/                  Self-hosted Cormorant Garamond + DM Sans
├── robots.txt              Staging: Disallow all (swap at launch)
├── robots.production.txt   Production robots rules — rename to robots.txt at launch
└── sitemap.xml             XML sitemap
```

## Deployment

Hosted on GitHub Pages. Push to `main` branch to deploy.

**At launch:** rename `robots.production.txt` → `robots.txt` to allow indexing.

## Notes

- All fonts are self-hosted (no Google Fonts)
- Contact form uses Formspree (ID: xaqlegaq)
- Mobile menu, FAQ, and search are vanilla JS — no frameworks
- Konami code Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A → opens Contra
