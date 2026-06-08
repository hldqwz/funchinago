# China Travel GitHub + Cloudflare Runbook

This is the practical release path for the current `China Travel Made Easy` project.

## Simple answer

You do **not** need to buy a traditional server right now.

What you need is:

- a GitHub repository
- the existing Cloudflare Pages project
- a domain

That is enough to keep the site live, update content, and attach a branded domain.

## Current setup

- GitHub repository:
  - `https://github.com/hldqwz/llm-rankings`
- Current production site:
  - `https://llm-rankings.pages.dev/`
- Current China travel section:
  - `https://llm-rankings.pages.dev/china-travel/`

## Why GitHub still matters

GitHub is the source of truth for the project.

Use it to:

- store the site code safely
- keep a history of article and design changes
- make Cloudflare Pages deployment easier and more stable
- recover the site if the local machine changes later

## Why you do not need a server yet

This site is currently a static site.

That means:

- pages are built ahead of time
- users just open HTML, CSS, images, and static assets
- Cloudflare Pages handles delivery

You only need a server later if you add things like:

- user accounts
- a database
- a custom backend
- heavy crawling or scheduled processing that cannot stay local or move to serverless tools

## Recommended release model

Use this model for now:

1. edit locally
2. test locally
3. build locally
4. push to GitHub
5. deploy to Cloudflare Pages
6. verify the live site

## Local validation before any release

Run these checks before pushing or deploying:

- `node tests/chinaTravelArticles.test.mjs`
- `node tests/chinaStarterPortalRoutes.test.mjs`
- `npm run build`

## Current deployment method

The project is already deployable to the current Pages project with:

- `npx wrangler pages deploy dist/ --project-name=llm-rankings --branch=main --commit-dirty=true`

## Best practice from now on

For safety, aim to keep both of these true:

- local workspace has the latest changes
- GitHub also has the latest stable version

That way:

- Cloudflare deployment is reproducible
- tomorrow's domain switch is lower risk
- the project is safer even if the local machine changes

## What to do after the domain is purchased

### Step 1: attach the domain in Cloudflare Pages

Inside the existing `llm-rankings` Pages project:

- add the custom domain
- wait for SSL and DNS provisioning

### Step 2: switch the site URL in project files

Update:

- `astro.config.mjs`
- `public/robots.txt`

You will replace:

- `https://llm-rankings.pages.dev`

with your final domain.

### Step 3: rebuild and redeploy

After the domain is attached and the config is updated:

- run the local checks
- rebuild
- redeploy to Cloudflare Pages

### Step 4: verify the live domain

Check:

- homepage
- China travel homepage
- article hub
- source library
- 2 to 3 key articles

Confirm:

- canonical uses the new domain
- sitemap uses the new domain
- images load correctly
- no old `pages.dev` references remain where they should not

### Step 5: submit search signals

After the final domain is live:

- add the site to Google Search Console
- submit the sitemap
- optionally add Bing Webmaster Tools

## What you can ignore for now

You do not need to buy or configure:

- a VPS
- a Linux server
- a database server
- Nginx
- Docker
- BaoTa

Those would add cost and complexity without helping this phase much.

## Tomorrow's fastest path

Once the domain payment succeeds, the fastest safe path is:

1. add domain in Cloudflare
2. update `astro.config.mjs`
3. update `public/robots.txt`
4. build and redeploy
5. live-check the new domain
6. submit sitemap

## Recommendation

For this project stage:

- keep GitHub
- keep Cloudflare Pages
- buy only the domain
- delay server purchase until the site has real traffic or backend needs
