# China Travel Domain Cutover Checklist

Use this after the domain purchase is complete.

## Goal

Move from the current Pages subpath launch to a cleaner branded domain setup without losing indexing signals or breaking the portal.

## Current live paths

- https://llm-rankings.pages.dev/china-travel/
- https://llm-rankings.pages.dev/china-travel/articles/
- https://llm-rankings.pages.dev/china-travel/sources/

## After the domain is purchased

### Step 1: Add the domain in Cloudflare Pages

- Open the existing `llm-rankings` Pages project.
- Add the new custom domain.
- Wait until SSL and DNS provisioning finish.

### Step 2: Decide the final URL structure

Pick one and keep it stable:

- Option A: full site on the new domain
  - Example: `https://yourdomain.com/`
- Option B: China travel section on the new domain root later, while the LLM rankings project stays separate
- Option C: keep this current project and use a clean subdomain
  - Example: `https://china.yourdomain.com/`

Recommendation:

- If China travel becomes the real business direction, move it toward its own clean root or subdomain instead of keeping it hidden under `/china-travel/` forever.

### Step 3: Update site config

Update these files to the final domain:

- `astro.config.mjs`
- `public/robots.txt`

Need to confirm:

- canonical URLs point to the new domain
- sitemap points to the new domain
- article and section pages still resolve correctly

### Step 4: Rebuild and redeploy

Run:

- `node tests/chinaTravelArticles.test.mjs`
- `node tests/chinaStarterPortalRoutes.test.mjs`
- `npm run build`
- `npx wrangler pages deploy dist/ --project-name=llm-rankings --branch=main --commit-dirty=true`

### Step 5: Search console setup

After the domain resolves correctly:

- add the final domain to Google Search Console
- submit the sitemap
- optionally add Bing Webmaster Tools

### Step 6: First post-domain checks

Open and verify:

- homepage
- travel landing page
- article hub
- 2 to 3 key article pages
- source library

Confirm:

- title and description are correct
- canonical is correct
- images load normally
- no mixed old-domain references remain in page source

## Suggested release order

1. Domain connected
2. Config switched
3. Build and deploy
4. Verify live pages
5. Submit sitemap
6. Start wider promotion
