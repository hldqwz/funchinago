# China Travel Go-Live Plan

## Current state

The China travel portal is now live inside the existing Cloudflare Pages project:

- Production site: https://llm-rankings.pages.dev/china-travel/
- Article hub: https://llm-rankings.pages.dev/china-travel/articles/
- Source library: https://llm-rankings.pages.dev/china-travel/sources/

This launch uses the current `llm-rankings` Pages project and publishes the China travel portal under the `/china-travel/` path.

## What was checked before launch

- Local article tests passed.
- Local route tests passed.
- Full Astro build passed.
- The newest production deployment completed successfully in Cloudflare Pages.
- High-priority payment and visa-free article covers were upgraded and verified live.

## Recommended launch phases

### Phase 1: Soft launch

Goal: publish a solid, trustworthy version and keep improving while the site is already live.

Focus:

- Keep improving the most important first-time visitor guides.
- Keep the source library current for policy-sensitive pages.
- Add more strong real-photo or editorial-style covers to reduce visual inconsistency.
- Share the `/china-travel/` section directly instead of the root homepage.

### Phase 2: Traffic foundation

Goal: make the portal easier to discover and easier to trust.

Focus:

- Buy and connect a dedicated domain when ready.
- Update `astro.config.mjs` and `public/robots.txt` to the final domain.
- Submit the final sitemap to Google Search Console.
- Add Bing Webmaster Tools.
- Set up basic analytics review once traffic starts coming in.

### Phase 3: Monetization preparation

Goal: make the site strong enough for future AdSense or service/product monetization.

Focus:

- Expand the article count with more destination and planning pages.
- Keep pages practical and non-thin.
- Add stronger internal linking between preparation, city, and culture guides.
- Keep ad placement light so the site still feels editorial and trustworthy.

## How to publish future updates

This project currently publishes through Cloudflare Pages.

Typical release flow:

1. Update content or design locally.
2. Run local validation:
   - `node tests/chinaTravelArticles.test.mjs`
   - `node tests/chinaStarterPortalRoutes.test.mjs`
   - `npm run build`
3. Deploy to the existing Pages project:
   - `npx wrangler pages deploy dist/ --project-name=llm-rankings --branch=main --commit-dirty=true`

## High-priority next improvements

1. Replace more old-style utility article covers:
   - apps
   - eSIM / internet
   - VPN
   - train booking
   - Alipay / WeChat Pay setup
2. Decide whether to keep the China portal as a subpath or later move it to a dedicated domain / standalone project.
3. Add a clear entry from the root site if you want non-direct visitors to discover the travel portal.
4. Prepare a simple domain-and-Search-Console checklist before bigger promotion starts.
