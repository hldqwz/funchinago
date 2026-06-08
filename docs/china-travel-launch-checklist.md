# China Travel Portal Launch Checklist

This checklist is for the English `China Travel Made Easy` portal under `/china-travel/`.

## Current status

- Homepage, section pages, article archive, article pages, and source library are live in the local build.
- Core visual system is now mostly consistent across:
  - homepage
  - `Start Here`
  - `Travel`
  - `Cities`
  - `Life & Culture`
  - `Tools`
  - article archive
- Source-library entry points are visible in navigation, article pages, and section pages.
- Core tests and production build are passing.

## Before launch

### 1. Content sanity check

- Read the homepage once from top to bottom as if you are a first-time foreign visitor.
- Check that the first answer is clear:
  - where should I start
  - which city should I choose
  - what do I need before flying
- Open 5 to 8 representative articles and check:
  - headline feels natural in English
  - intro is not too long
  - source box appears where expected
  - tool links are relevant

### 2. Trust and accuracy check

- Open `/china-travel/sources/` and confirm the most important official sources are present.
- Spot-check these high-risk topics against source links:
  - visa-free / transit
  - Alipay / WeChat Pay
  - train booking
  - eSIM / internet preparation
- If any article feels too absolute, soften wording and keep the official link visible.

### 3. Visual check

- Review these pages on desktop:
  - `/china-travel/`
  - `/china-travel/travel/`
  - `/china-travel/cities/`
  - `/china-travel/tools/`
  - `/china-travel/articles/`
- Review the same pages on mobile width.
- Check for:
  - broken image crops
  - empty white blocks
  - cards that feel visually out of place
  - text that wraps awkwardly

### 4. SEO basics check

- Confirm each page has:
  - a unique title
  - a useful description
  - a canonical URL
  - a share image
- Confirm article pages are marked as `article`.
- Confirm important pages are linked internally:
  - homepage to sections
  - sections to articles
  - articles to related articles
  - articles to tools
  - articles and sections to source library

### 5. Monetization readiness check

- Keep the site structure feeling editorial, not ad-heavy.
- Make sure there are enough real guide pages before applying to monetization.
- Keep contact and about-style trust signals accessible.
- Avoid thin pages that exist only for keywords.

## Launch steps

### If launching the current GitHub + Cloudflare Pages version

- Make sure the latest local changes are committed.
- Push to the deployment branch used by GitHub.
- Wait for Cloudflare Pages build to finish.
- Check the live URL for:
  - homepage
  - one section page
  - one article page
  - source library

### If attaching a custom domain later

- Add the domain in Cloudflare Pages.
- point DNS correctly
- re-check canonical behavior
- re-check share cards and favicon

## Recommended first post-launch tasks

1. Replace more old-style travel article covers with the newer editorial style.
2. Add 3 to 5 more strong first-trip articles before traffic push.
3. Start collecting more real-photo assets for cities, food, and daily life.
4. Build one lightweight monetization path after traffic starts:
   - China travel tools
   - affiliate-friendly trip prep resources
   - later, China product or service recommendations

## High-priority pages to keep improving

- `/china-travel/`
- `/china-travel/articles/`
- `/china-travel/travel/`
- `/china-travel/articles/china-travel-checklist-before-you-fly/`
- `/china-travel/articles/how-to-pay-in-china-tourist/`
- `/china-travel/articles/best-apps-for-traveling-in-china/`
- `/china-travel/articles/china-visa-free-travel-guide/`

## Quick local review URLs

- `http://127.0.0.1:4321/china-travel/`
- `http://127.0.0.1:4321/china-travel/travel/`
- `http://127.0.0.1:4321/china-travel/cities/`
- `http://127.0.0.1:4321/china-travel/tools/`
- `http://127.0.0.1:4321/china-travel/articles/`
