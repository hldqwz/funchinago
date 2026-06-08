# Project Memory

> Last updated: 2026-06-08
> This file consolidates all project context, decisions, and progress across both sub-projects. Read this first before making any changes.

---

## 1. Project Identity: Dual-Project Repository

This repository serves **two independent projects** on the same Astro SSG site:

### Project A: Global LLM Usage Rankings (`llm-rankings`)
- **Status**: 🟡 DORMANT — Code and crawler infrastructure exist but project is on hold
- **Data source**: OpenRouter REST API (`/api/v1/models`) + OpenRouter `/rankings` page (Next.js SPA, needs headless Playwright)
- **Crawler**: 5-source Python pipeline in `crawler/` (OpenRouter, Groq, SiliconFlow, Bailian, Fireworks)
- **Crawl schedule**: `daily.yml` (rankings only) + `weekly.yml` (full crawl) — GitHub Actions cron
- **Data file**: `src/data/models.json` (14,421 lines, 602 models, last updated 2026-05-31)
- **Blog**: 11 weekly ranking recap posts in `src/content/blog/`
- **CI/CD**: `.github/workflows/weekly.yml` and `.github/workflows/daily.yml` — both target `llm-rankings` Cloudflare Pages project
- **Current blocking**: Scrapling installation times out (network issue, try `pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple scrapling`); OpenRouter has no usage/ranking data via REST API

### Project B: China Travel Made Easy (`funchinago.com`)
- **Status**: 🟢 ACTIVE — Deployed, SEO-optimized, awaiting indexing
- **Tech stack**: Astro SSG + Cloudflare Pages, zero-cost deployment
- **Domain**: `funchinago.com` + `www.funchinago.com` (Cloudflare Pages custom domain)
- **Git**: `https://github.com/hldqwz/funchinago.git`, branch `main`, latest commit `9a54e53`
- **CI/CD**: `.github/workflows/deploy.yml` — pushes to main → `npm ci` → `npm run build` → `wrangler pages deploy dist/ --project-name=funchinago`
- **LLM Rankings page isolation**: All LLM pages use `noindex,nofollow` and are excluded from sitemap

---

## 2. China Travel Made Easy — Site Architecture

### Config
- `astro.config.mjs`: site URL `https://funchinago.com`, sitemap filter only `/china-travel/` and `/tools/china-*`, static output, directory build format
- `public/robots.txt`: Allow all, sitemap at `https://funchinago.com/sitemap-index.xml`
- `public/_routes.json`: Cloudflare SPA fallback config `{ include: [], exclude: ["/*"] }` — fixes tool page routing
- `public/_redirects`: `/zh/*` 301 → `/:splat`
- `public/googlebbae3f612288e128.html`: Google Search Console verification file

### Layout
- `src/layouts/ChinaTravelLayout.astro` (704 lines): Main portal layout
  - 8 nav items: Home, Start Here, Travel, Cities, Life & Culture, Tools, Sources
  - JSON-LD support: Organization schema (`@id`, `logo`, `image`, `name`, `url`, `description`, `foundingDate`) + BreadcrumbList schema (auto-built from currentPath, supports 2-level and 3-level hierarchies)
  - Dynamic `jsonLd` prop for page-specific schemas
  - Dark/light mode with CSS custom properties and localStorage persistence
  - Cloudflare Web Analytics with token `53776ca23b6448c6a4527a04a6b1b66a`
  - Mobile responsive, radial gradient backgrounds, glassmorphism surfaces
- `src/layouts/Layout.astro` (608 lines): Original LLM rankings layout — uses `noindex,nofollow`

### Pages (China Travel)
| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | 302 redirect to `/china-travel/` |
| `/china-travel/` | `china-travel.astro` | Portal homepage, 6 modules: hero → Start Here → Cities → Life & Culture → Tools → Featured City (Guangzhou) |
| `/china-travel/articles/` | `articles/index.astro` | Article archive with category filtering |
| `/china-travel/articles/[slug]/` | `articles/[slug].astro` | Dynamic article page with Article JSON-LD, source box, 3 related articles, accuracy note |
| `/china-travel/start-here/` | `start-here.astro` | Landing page: 3 path cards (Plan, Choose City, Understand China) |
| `/china-travel/travel/` | `travel.astro` | Landing page: filter by category (Visa, Payment, Transport, Internet) |
| `/china-travel/cities/` | `cities.astro` | Landing page: 4 comparison cards (Beijing, Shanghai, Chengdu, Guangzhou) |
| `/china-travel/life-culture/` | `life-culture.astro` | Landing page: 3 doorways (Food, Daily Life, Modern China) |
| `/china-travel/tools/` | `tools.astro` | Landing page: gateway to 3 tools |
| `/china-travel/sources/` | `sources.astro` | Source library: all official sources with trust level, category, URL |
| `/tools/china-transit-checker/` | `tools/china-transit-checker.astro` | Transit self-check tool (4 use cases, limitation disclaimer, real JS logic from `public/tools/china-transit-checker.js`) |
| `/tools/china-travel-checklist/` | `tools/china-travel-checklist.astro` | Checklist generator (4 use cases, limitation disclaimer, JS from `public/tools/china-travel-checklist.js`) |
| `/tools/china-city-picker/` | `tools/china-city-picker.astro` | City recommendation tool (4 use cases, limitation disclaimer, JS from `public/tools/china-city-picker.js`) |

### Core Data Files
| File | Content |
|------|---------|
| `src/data/chinaStarterPortal.ts` (166 lines) | 7 exported constants: portalSections, startHereCards (3), homepagePortalOrder (6 steps), cityComparisonCards (4), lifeCultureDoorways (3), homepageTools (3), featuredCity (Guangzhou) |
| `src/data/chinaCities.json` (489 lines) | ~44 cities with id, name, pinyin, province, tagline, description, bestFor, articles, tags (41 valid tags) |
| `src/data/chinaTravelSources.json` (195 lines) | 8+ official sources with id, title, url, authority, category, trustLevel, useFor, lastChecked |
| `src/content.config.ts` | Astro content collections: `blog` (LLM) + `chinaTravel` (adds updatedAt, stage, section, officialSources, relatedTools) |

### Content: 20 China Travel Articles (18 written + 2 in queue)

All articles have: `## Quick Answer` + `## Common Mistakes` (or equivalent risk section) + `## Check Official Sources Before You Travel` + 3+ internal links.

| Article | Section | Risk Heading | Bullets |
|---------|---------|-------------|---------|
| china-240-hour-visa-free-transit.md | travel | `## Common Mistakes` (line 82) | 7 |
| china-visa-free-travel-guide.md | travel | `## Common Mistakes` (line 93) | 6 |
| how-to-use-alipay-in-china-foreigner.md | travel | `## Common Mistakes` (line 71) | 7 |
| how-to-use-wechat-pay-in-china-foreigner.md | travel | `## Common Mistakes` (line 64) | 7 |
| how-to-pay-in-china-tourist.md | travel | `## Common Failure Scenarios` (line 68) | 7 |
| how-to-book-high-speed-train-tickets-china-foreigner.md | travel | `## Common Mistakes` (line 77) | 6 |
| best-esim-for-china-travel-internet-access.md | travel | `## What Travelers Get Wrong` (line 81) | 7 |
| china-travel-checklist-before-you-fly.md | travel | `## Common Mistakes` (line 140) | 7 |
| best-places-to-visit-in-china-first-time.md | start-here | `## Common Mistakes` | 7 |
| beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first.md | cities | `## Quick Answer` only | — |
| what-to-eat-in-china.md | life-culture | `## Quick Answer` only | — |
| how-to-order-food-in-china-without-speaking-chinese.md | life-culture | `## Quick Answer` only | — |
| what-china-is-really-like-for-first-time-visitors.md | life-culture | `## Quick Answer` only | — |
| best-apps-for-traveling-in-china.md | travel | `## Quick Answer` only | — |
| do-you-need-a-vpn-in-china-travel.md | travel | `## Quick Answer` only | — |
| best-china-itineraries-by-travel-style.md | travel | `## Quick Answer` only | — |
| ten-days-in-china-first-time-itinerary.md | travel | `## Quick Answer` only | — |
| why-visit-china-in-2026.md | start-here | `## Quick Answer` only | — |
| china-travel-mistakes-first-trip.md | travel | `## Common Mistakes` | 8 |
| guangzhou-travel-guide-first-time-visitors.md | cities | `## Quick Answer` only | — |

Note: The 8 core SEO articles (identified in the 30-day plan) all have risk sections. The remaining 12 articles either have them or are supplementary content where risk sections are less critical.

### Image Assets (`public/china-travel/images/`)
- ~50 images: hero images, article covers (22), city cards (4), life-culture cards (8), tool icons
- 6 Guangzhou real photos from Xiaohongshu (processed with `scripts/overlay_english_v3.py` — pixel-precise English overlay with white label panels)
- Logo at `public/images/logo.svg` (compass-style "C" logo, used by Organization JSON-LD schema)

### Visual Design Direction
- Chosen: Option B (clean map-utility style) with touches of Option C (modern East-meets-global)
- Warm editorial-travel foundation with China-inspired decorative accents
- Color system: CSS custom properties, warm browns/oranges (accent: `#b14f33`), teal (utility: `#2f5d62`), light green background (`#eef1eb`)
- Design system: feature accent panels with gradient backgrounds, chip-style navigation, glassmorphism headers, card-based layouts with consistent border radius (10-24px)

### LLM Rankings Pages (Dormant)
- `/about`, `/privacy`, `/contact`, `/discuss`, `/compare`, `/blog/*`, `/models/*`
- All use `noindex,nofollow` — excluded from sitemap
- Giscus comments on blog posts (repo: `hldqwz/llm-rankings`)

---

## 3. Test Suite

6 test files in `tests/`, all currently passing:

| Test | What it validates |
|------|-------------------|
| `chinaTravelArticles.test.mjs` | All articles have required frontmatter (title, description, stage, section, updatedAt, hero_image, officialSources). Section values valid. Image files exist. Source IDs match registry. ≥12 articles. |
| `chinaStarterPortalRoutes.test.mjs` | portalSections, startHereCards (3 correct titles), cityCards (4 cities), lifeCulture (3 topics), tools (3 entries), featuredCity (Guangzhou). All images exist. All hrefs resolve. |
| `chinaCityPicker.test.mjs` | JSON has 30+ cities with required fields. 7 key cities exist. Tags valid. recommendCities() returns correct expectations (culture→Beijing, spicy→Chengdu/Chongqing, nature→Guilin, short→Shanghai). |
| `chinaTravelChecklist.test.mjs` | generateChecklist() adapts to profiles: booked→15+ items, no-payment→no Alipay/WeChat, no-internet→no eSIM/VPN, no-train→no train items, transit→transit items, flying-soon→screenshots, thinking→fewer items. |
| `chinaTravelSources.test.mjs` | sources.sources is array with 8+ entries. Each has all required fields. 3 key sources must exist: NIA 240h transit, gov payment guide, 12306 railway. |
| `chinaTransitPolicy.test.mjs` | normalizeCountry(), eligibleCountries (Indonesia extended 2025-06-12). evaluateTransitEligibility(): eligible→"Likely", same-country round-trip→"Not likely", over 240h→"Not likely", non-listed nationality→"Check official". |

---

## 4. Infrastructure & DevOps

### Cloudflare Pages
- Two projects: `llm-rankings` (dormant) and `funchinago` (active)
- `funchinago` build config: `build_command: npm run build`, `destination_dir: dist`, `root_dir: ""`
- Custom domains: `funchinago.com` + `www.funchinago.com`
- Web Analytics token for China Travel: `53776ca23b6448c6a4527a04a6b1b66a`

### GitHub Actions
| Workflow | File | Trigger | Action |
|----------|------|---------|--------|
| Deploy China Travel | `.github/workflows/deploy.yml` | Push to main + manual | `npm ci` → `npm run build` → `wrangler pages deploy dist/ --project-name=funchinago` |
| Daily Rankings | `.github/workflows/daily.yml` | Cron 00:00 UTC | Crawl → build → deploy to `llm-rankings` |
| Weekly Full Crawl | `.github/workflows/weekly.yml` | Cron Mon 00:00 UTC | Full crawl → build → deploy to `llm-rankings` |

### Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Astro dev server |
| `npm run build` | Production build (652 pages) |
| `npm run preview` | Preview build |
| `npm run crawl` | Run LLM crawler (full) |
| `npm run set-site-url -- https://domain` | One-command domain switcher — updates `astro.config.mjs` + `robots.txt` |
| `npm run verify-site-url -- https://domain` | Post-cutover validator — curl 10 pages + sitemap, checks HTTP 200, canonical tags, title tags |
| `scripts/xhs_scrape.py` | Xiaohongshu Playwright crawler (5 Guangzhou queries, --prime-login for cookie setup) |
| `scripts/overlay_english_v3.py` | Latest image processing — pixel-precise English overlay on Xiaohongshu photos |
| `scripts/scrapling_env.sh` | Set up Scrapling Python venv in `.cache/scrapling-venv/` |

### Domain Cutover (Completed)
- Documented in `docs/中国旅游站-域名切换操作手册-中文.md`
- Process: add domain in Cloudflare Pages → update astro.config.mjs → rebuild → redeploy → Search Console → verify
- Successful: funchinago.com live

---

## 5. SEO & Growth Infrastructure

### Structured Data (JSON-LD)
- Organization schema on all China Travel pages: `@id: /china-travel/`, `name`, `url`, `logo` (SVG), `image` (SVG), `description`, `foundingDate: 2025`
- BreadcrumbList schema on all China Travel pages: auto-built from URL path (2-level for sections, 3-level for articles/tools)
- Article schema on all article pages: headline, description, image, datePublished, dateModified, author (references org via `@id`), publisher (references org via `@id`), mainEntityOfPage
- No FAQ schema (no hidden FAQ content)

### Sitemap
- Generated by `@astrojs/sitemap` v3
- Filter: only `/china-travel/` and `/tools/china-*` pages included
- 31 URLs total (28 china-travel + 3 tools)
- Submitted to Google Search Console ✅ and Bing Webmaster Tools ✅

### Search Console Status
- Property verified via DNS/HTML file (`googlebbae3f612288e128.html`)
- Sitemap `https://funchinago.com/sitemap-index.xml` submitted successfully
- Currently: 34 URLs discovered, only `/china-travel/` indexed (normal for new sites, 1-7 days)
- User needs to use "URL Inspection" → "Request Indexing" for remaining URLs

### Bing Webmaster Tools Status
- Site added, sitemap submitted: 31 URLs discovered
- Same wait period as Google

### IndexNow
- 9 URLs submitted to Bing IndexNow API, all returned HTTP 202 Accepted

### Cloudflare SPA Fallback
- `_routes.json`: `{ "include": [], "exclude": ["/*"] }` — tool pages served correctly, root-level files may still return index.html. Needs rebuild + deploy to confirm fix.

---

## 6. Project Documentation (docs/)

| File | Purpose |
|------|---------|
| `china-travel-30-day-agent-implementation-plan.md` | Master implementation plan with 6 tasks + final verification. Contains the complete Appendix with acceptance report. **Read this before implementing anything new.** |
| `china-travel-external-resource-list.md` | Curated list of 32 external promotion platforms across 10 categories. Each entry: URL, type, link policy, risk level, recommended action. Safety rules included. |
| `china-travel-weekly-growth-tracker.md` | Fillable weekly KPI tracking template. Columns: indexed pages, impressions, clicks, CTR, avg position, top 10 queries, top 5 pages, community sources. 30-day thresholds. |
| `中国旅游站-30天人工操作清单.txt` | Chinese-language user manual: Week 1 (Search Console/Bing), Week 2 (local experience notes), Week 3 (community participation), weekly review template. |
| `中国旅游站-域名切换操作手册-中文.md` | Domain cutover runbook — step-by-step Cloudflare Pages custom domain setup. |
| `中国旅游站-当前进度报告-中文-2026-06-05.md` | Pre-cutover status report. "Biggest obstacle is no longer the site itself, but buying the domain." |
| `china-travel-github-cloudflare-runbook.md` | Deployment runbook explaining GitHub + Cloudflare Pages deployment model. |
| `china-travel-prelaunch-status-2026-06-05.md` | Pre-launch status: portal publicly accessible, structure/content/visual/SEO/build health all confirmed. |
| `china-travel-domain-cutover-checklist.md` | 6-step domain cutover checklist. Options considered: subpath vs root vs subdomain. |
| `china-travel-go-live-plan.md` | 3-phase go-live plan: soft launch, traffic foundation, monetization prep. |
| `china-travel-launch-checklist.md` | 5-area launch checklist: content, trust/accuracy, visual, SEO basics, monetization prep. |
| `china-travel-image-batch-01.md` | P0 image replacements: hero image, 3 Start Here cards, 4 city cards. AI prompt templates included. |
| `china-travel-image-replacement-checklist.md` | Full image replacement priority system (P0/P1/P2). 4 image buckets: hero, city anchors, daily life, food. |

### Strategy Documents (memory/)

| File | Purpose |
|------|---------|
| `china_travel_strategy_research.md` (770 lines) | Complete strategy: upgrade from "guide" to "China travel concierge". 3 phases: Wanting/Before/After. Competitor analysis. SEO keyword gaps. 20-article content map. |
| `china_travel_20_article_outlines_v2.md` (577 lines) | Full outlines for 20 articles across 3 stages. Each: target keyword, search intent, reader anxiety, quick answer section, sources needed, local experience points, section structure, internal links. |
| `china_travel_first_8_briefs.md` | Creation briefs for first 8 core articles. |
| `china_travel_article_brief_template.md` | Reusable brief template. |
| `china_travel_next_execution_plan.md` (227 lines) | Priority: content production → tool expansion → visual upgrade → SEO → launch. Articles scored by usefulness. |
| `china_travel_image_and_article_asset_plan.md` (306 lines) | Site-wide image style guide. File naming convention. AI prompts per article. Source risk analysis. Internal link map. |
| `china_travel_monetization_and_content_thinking.md` | Monetization strategy and ad preparation notes. |
| `china_travel_remaining_12_briefs.md` | Briefs for remaining 12 articles. |
| `content_plan_china_travel.md` (174 lines) | 20-article keyword map. Homepage SEO title: "China Travel Guide for First-Time Visitors 2026". |

### Research Base (_knowledge_base/)

| File | Purpose |
|------|---------|
| `research-china-travel-foreign-visitor-needs-20260602.md` (112 lines) | Foreign visitor needs research: trends (150M inbound 2025, +17% YoY), pain points (payment, visa, internet, apps, transport), "life experience" opportunity, competitor reference. |
| `research-china-travel-foreign-visitors-20260602.md` | Competitor site research. Framework: 3 phases (Wanting/Before/After). |
| `research-china-travel-keywords-20260602.md` (38 lines) | Keyword research: competition in payment, visa, HSR, eSIM. Inbound: 21.33M Q1 2026 foreign entries, +22.3% YoY. 7 sources cited. |
| `xiaohongshu_guangzhou.json` | Xiaohongshu scrape results — empty arrays (blocked by login wall). |

---

## 7. What Each Agent Has Done (Chronological)

### Agent 1 — Foundation Builder
- Created the dual-project Astro setup (LLM rankings + China Travel)
- Built LLM crawler pipeline (5 sources: OpenRouter REST API, Groq, SiliconFlow, Bailian, Fireworks)
- Created the original `Layout.astro` (LLM rankings)
- Set up GitHub Actions workflows (daily.yml, weekly.yml)

### Agent 2 — Portal Architect
- Created China Travel content collection schema and data files
- Built `ChinaTravelLayout.astro` (themed navigation, JSON-LD, dark mode)
- Built all portal landing pages (start-here, travel, cities, life-culture, tools, sources)
- Created `chinaStarterPortal.ts` data constants
- Designed and implemented visual identity (warm editorial, radial gradients, glassmorphism)
- Created hero images and article cover placeholders
- Implemented Chinese→English image processing pipeline (Xiaohongshu photos)

### Agent 3 — Content & Tools Builder
- Wrote first 8+ articles with full SEO structure
- Built 3 interactive tools (city picker, transit checker, checklist generator)
- Created test suite (6 test files)
- Implemented `chinaCities.json` with 44 cities and scoring system

### Agent 4 — SEO & Growth Implementer (opencode, 2026-06-08)
- Added JSON-LD structured data (Organization with `@id`/`logo`/`image`, BreadcrumbList, Article with org reference)
- Created logo at `public/images/logo.svg`
- Added risk sections to 5 articles (`## Common Mistakes` with 6-7 specific points each)
- Added "Real use cases" + limitation disclaimers to 3 tool pages
- Created weekly growth tracker doc
- Created external resource list (32 platforms)
- Created user manual in Chinese
- Fixed `.gitignore` (`tools/` → `/tools/`) to track tool page source files
- Fixed Cloudflare build config via API
- Deployed and verified online (652 pages)
- Submitted IndexNow (9 URLs, 202 Accepted)
- Created `deploy.yml` GitHub Actions workflow
- Responded to reviewer: 7 corrections applied to the Appendix report
- Wrote comprehensive MEMORY.md

---

## 8. Key Decisions & Rules

### Content Rules
- Keep the site editorial, useful, and source-backed
- Prefer cautious wording for policy-sensitive content
- Link policy pages to official sources
- Do NOT buy links, add affiliate links, or add ads
- Do NOT add fake reviews, testmonials, or fake traffic
- Do NOT create thin city pages just for keywords
- Do NOT hide FAQ text only for schema
- Do NOT state visa, payment, railway, or entry policies as permanent truth

### Technical Decisions
- Static site generation (Astro SSG) — no server needed
- Cloudflare Pages for free hosting + CDN + analytics
- Purposely excluded LLM rankings from sitemap and used noindex to avoid SEO confusion
- Tool pages at `src/pages/tools/` (not inside `china-travel/` subdirectory)
- Interactive JS tools in `public/tools/` (plain JS, no framework overhead)
- `/@astrojs/sitemap` v3 with manual filter function

---

## 9. Current Status Summary

### ✅ Completed
- Domain purchased and configured (funchinago.com)
- Site deployed and accessible (652 pages)
- All 3 interactive tools working (city picker, transit checker, checklist generator)
- 18 of 20 planned articles published
- JSON-LD structured data active on all pages
- 8 core articles have risk sections + quick answers + source checks + internal links
- 3 tool pages have use cases + disclaimers + article links
- Test suite: 6 files, all passing
- External resource list: 32 platforms
- Weekly growth tracker: created
- User manual (Chinese): created
- Google Search Console: sitemap submitted
- Bing Webmaster Tools: sitemap submitted (31 URLs discovered)
- IndexNow: 9 URLs submitted
- GitHub auto-deploy workflow: created

### 🔄 In Progress (Wait Period)
- Google indexing: 34 URLs discovered, only `/china-travel/` indexed — 1-7 days
- Bing indexing: 31 URLs discovered — 1-7 days
- Cloudflare SPA fallback `_routes.json` — needs rebuild + deploy to confirm fix on root-level files

### 📋 User Action Items
1. Request Indexing for 12 URLs in Search Console (URL Inspection → Request Indexing)
2. Monitor Search Console + Bing over next 1-7 days for indexing progress
3. Week 2: Write local China experience notes (payment failures, city choice, train stations, ordering food, apps, misconceptions)
4. Week 3: Start low-intensity community participation (r/ChinaTravel, Quora, Tripadvisor)
5. Fill weekly growth tracker every Sunday

### 🔮 Next Agent Round Candidates
1. Add deeper risk/experience content to supplementary articles (12 non-core articles)
2. Expand tool functionality based on user feedback
3. Create more articles around payment failure scenarios, city comparison, transport tips
4. Strengthen best-performing pages based on early Search Console data
5. Prepare for AdSense (after stable traffic achieved)
