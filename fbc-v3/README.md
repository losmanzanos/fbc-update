# Full Bloom Counseling v3

Static GitHub Pages site for fullbloomcounseling.com.

## Deploy

```bash
git init
git remote add origin git@github.com:losmanzanos/fullbloomcounseling.com.git
git add .
git commit -m "v3 launch"
git push -u origin main
```

**GitHub Pages:** Settings → Pages → Source: GitHub Actions

## DNS (Porkbun)

| Type  | Host | Value                 |
|-------|------|-----------------------|
| A     | @    | 185.199.108.153       |
| A     | @    | 185.199.109.153       |
| A     | @    | 185.199.110.153       |
| A     | @    | 185.199.111.153       |
| CNAME | www  | losmanzanos.github.io |

## Formspree

Replace `YOUR_FORM_ID` in `contact/index.html` after creating account at formspree.io.

## One-time credential note

Rotate Google Client Secret and Supabase service role key if not already done (committed to README previously).
