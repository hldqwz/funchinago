# China Travel Prelaunch Status - 2026-06-05

## What is already ready

The portal is already live and publicly reachable inside the existing Cloudflare Pages project.

Current main URLs:

- https://llm-rankings.pages.dev/china-travel/
- https://llm-rankings.pages.dev/china-travel/articles/
- https://llm-rankings.pages.dev/china-travel/sources/

## Ready areas

### Structure

- portal homepage is live
- first-level landing pages are live
- article archive is live
- source library is live
- tool pages are live

### Content foundation

High-value first-trip topics already covered:

- visa-free and transit
- travel checklist
- payment overview
- Alipay
- WeChat Pay
- apps
- eSIM and internet
- VPN preparation
- high-speed train booking
- first-city comparison
- first-time itinerary
- food and daily-life orientation

### Visual quality

- major travel-prep articles now use stronger editorial covers
- homepage has a visible China Travel entry from the root site
- article pages now include related reading cards
- tools on the portal homepage now feel like visual entry points instead of plain text blocks

### SEO and crawl basics

Confirmed working:

- `robots.txt`
- `sitemap-index.xml`
- sitemap includes the China Travel pages
- sitemap includes the China travel tools
- article pages use article metadata
- canonical URLs are present

### Build and release health

Confirmed in the latest round:

- article tests passed
- route tests passed
- full build passed
- production deploy passed
- temporary duplicate-id warnings are currently gone

## What still depends on buying the domain

These are the only major launch-adjacent tasks blocked by domain purchase:

- add the custom domain in Cloudflare Pages
- switch final site URL in `astro.config.mjs`
- switch final sitemap URL in `public/robots.txt`
- redeploy after the final domain is attached
- submit the final sitemap in Google Search Console

## Best next move after purchase

Follow:

- `docs/china-travel-domain-cutover-checklist.md`

## Recommendation

The project is already strong enough for a soft launch and continued improvement.

Once the domain is purchased, the priority should be:

1. attach domain
2. switch config
3. redeploy
4. verify live pages
5. submit sitemap
6. start promotion
