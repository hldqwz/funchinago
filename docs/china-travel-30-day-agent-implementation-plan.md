# China Travel Made Easy 30-Day Agent Implementation Plan

> Purpose: This file is for another implementation agent working in `/Users/apple/ai-webplan`.
> The user wants low-cost early growth for the English China travel portal. Do not add ads, affiliate links, paid backlink tactics, shopping widgets, or unrelated monetization.

## 1. Project Context

Site name: `China Travel Made Easy`

Main route: `/china-travel/`

Tech stack:

- Astro SSG
- Cloudflare Pages
- Markdown content under `src/content/china-travel/`
- China travel layout at `src/layouts/ChinaTravelLayout.astro`
- Tool pages under `src/pages/tools/`
- Tool scripts under `public/tools/`

Current growth strategy:

- First 30 days are for trust, indexing, Search Console signals, practical tools, and small real community exposure.
- Do not chase ads, affiliate links, paid links, or mass guest posting.
- The user will manually handle Search Console, Bing Webmaster Tools, Cloudflare Analytics review, community participation, and local China-experience notes.

What success should look like after this implementation:

- Google can understand the site and article entities through valid JSON-LD.
- The core China travel articles answer first-time visitor questions quickly and cautiously.
- Tool pages are easier to cite in communities because they explain use cases, limitations, and related guides.
- The user has simple weekly tracking documents and a safe external-resource list.
- Existing builds and China travel tests still pass.

---

## 2. Non-Negotiable Rules

Do:

- Keep the site editorial, useful, and source-backed.
- Prefer cautious wording for policy-sensitive content.
- Link policy pages to official sources.
- Keep implementation small and maintainable.
- Validate with local tests and build before reporting completion.

Do not:

- Do not buy links.
- Do not add affiliate links.
- Do not add ads.
- Do not add fake reviews, fake testimonials, or fake traffic.
- Do not create thin city pages just for keywords.
- Do not hide FAQ text only for schema.
- Do not state visa, payment, railway, or entry policies as permanent truth.

---

## 3. Implementation Task 1: Add Structured Data

### Goal

Add reliable JSON-LD support for the China travel portal so Google can understand the organization, breadcrumbs, and article metadata.

### Files To Inspect

- `src/layouts/ChinaTravelLayout.astro`
- `src/pages/china-travel/articles/[slug].astro`
- `src/pages/china-travel.astro`
- `src/pages/china-travel/start-here.astro`
- `src/pages/china-travel/travel.astro`
- `src/pages/china-travel/cities.astro`
- `src/pages/china-travel/life-culture.astro`
- `src/pages/china-travel/tools.astro`
- `src/pages/china-travel/sources.astro`

### What To Build

In `src/layouts/ChinaTravelLayout.astro`:

1. Add an optional prop for JSON-LD, for example:

```ts
jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
```

2. Normalize the prop to an array.

3. Render one `<script type="application/ld+json">` per schema object in the `<head>`.

4. Add default `Organization` schema for the site. It should describe:

- `@context`: `https://schema.org`
- `@type`: `Organization`
- `name`: `China Travel Made Easy`
- `url`: canonical site root or `/china-travel/` absolute URL
- `logo` or `image`: use an existing China travel hero image if no logo exists
- `sameAs`: omit unless real social profiles exist

Important: JSON-LD must be valid JSON. Do not hand-concatenate unsafe strings.

### Breadcrumb Schema

Add `BreadcrumbList` schema for major China travel pages.

Expected breadcrumb examples:

Homepage:

- Home

Article page:

- Home
- Articles
- Current article title

Tools page:

- Home
- Tools

Individual tool page:

- Home
- Tools
- Tool name

Each breadcrumb item should include:

- `@type`: `ListItem`
- `position`
- `name`
- `item` absolute URL, except optionally the current page if following Google examples carefully

### Article Schema

In `src/pages/china-travel/articles/[slug].astro`, build `Article` or `BlogPosting` schema from frontmatter.

Required fields:

- `@context`: `https://schema.org`
- `@type`: `Article`
- `headline`: article title
- `description`: article description
- `image`: absolute image URL
- `datePublished`: article `date`
- `dateModified`: article `updatedAt`
- `author`: `{ "@type": "Organization", "name": "China Travel Made Easy" }`
- `publisher`: organization object
- `mainEntityOfPage`: canonical article URL

Result should match visible page content:

- The visible article title should match schema headline.
- The visible updated date should match `updatedAt`.
- The article image should exist and be absolute in schema.

### FAQ Schema

Do not add FAQ schema unless the page has visible FAQ content.

If you add it later, use only visible question-and-answer pairs from the page. Do not create hidden FAQ text for schema.

### Acceptance Criteria

- Production build succeeds.
- JSON-LD is present in built HTML for:
  - `/china-travel/`
  - `/china-travel/articles/china-240-hour-visa-free-transit/`
  - `/china-travel/tools/`
- Article JSON-LD includes `datePublished`, `dateModified`, and `mainEntityOfPage`.
- Breadcrumb JSON-LD includes correct page hierarchy.
- Rich Results Test should not report invalid Article schema for an article URL.

### Suggested Verification Commands

```bash
npm run build
node tests/chinaTravelArticles.test.mjs
node tests/chinaStarterPortalRoutes.test.mjs
node tests/chinaCityPicker.test.mjs
```

Optional local inspection after build:

```bash
rg -n "application/ld\\+json|BreadcrumbList|Article|Organization" dist/china-travel dist/tools
```

---

## 4. Implementation Task 2: Strengthen 8 Core Articles

### Goal

Make the most valuable early SEO pages more useful, cautious, internally linked, and ready for first-time foreign visitors.

### Core Articles

Update these files:

- `src/content/china-travel/china-240-hour-visa-free-transit.md`
- `src/content/china-travel/china-visa-free-travel-guide.md`
- `src/content/china-travel/how-to-use-alipay-in-china-foreigner.md`
- `src/content/china-travel/how-to-use-wechat-pay-in-china-foreigner.md`
- `src/content/china-travel/how-to-pay-in-china-tourist.md`
- `src/content/china-travel/how-to-book-high-speed-train-tickets-china-foreigner.md`
- `src/content/china-travel/best-esim-for-china-travel-internet-access.md`
- `src/content/china-travel/china-travel-checklist-before-you-fly.md`

### Required Structure For Each Article

Each article should include:

1. A `## Quick Answer` section near the top.
   - 100-150 words is enough.
   - Answer the searcher directly.
   - Avoid sales language.

2. A practical risk section.
   - Use one of these headings:
     - `## Common Mistakes`
     - `## What Can Go Wrong`
     - `## Common Failure Scenarios`
   - Include realistic issues a first-time visitor may face.

3. A source-check section.
   - Use heading: `## Check Official Sources Before You Travel`
   - Tell readers which official source type matters for the topic.
   - Example: visa topics should point to NIA, embassy, consulate, airline document checks as secondary support.

4. At least 3 useful internal links.
   - Link to related article pages.
   - Link to relevant tools where useful.
   - Link to `/china-travel/sources/` when policy or platform accuracy matters.

### Topic-Specific Guidance

#### 240-hour transit article

Focus:

- Third-country or region rule
- Approved ports
- Permitted stay areas
- Onward ticket
- Official confirmation before booking

Avoid:

- Calling it a simple 10-day visa-free tourist rule for everyone

Expected result:

- A reader understands whether they are likely in a transit case and knows to verify route details.

#### Visa-free guide

Focus:

- Difference between unilateral visa-free access, mutual visa-free access, and 240-hour transit
- Passport, purpose, route, stay length
- Why current official source checks matter

Avoid:

- Listing country eligibility unless verified with current official source

Expected result:

- A reader knows which policy category to investigate, not just that "China is visa-free."

#### Alipay article

Focus:

- Setup before arrival
- Supported card uncertainty
- Verification and bank-block issues
- Backup payment plan

Expected result:

- A reader understands Alipay is useful but not guaranteed, and prepares backups.

#### WeChat Pay article

Focus:

- WeChat vs Weixin wording
- Supported cards and limits
- Mini-program usefulness
- Backup with Alipay, card, cash, and internet

Expected result:

- A reader treats WeChat Pay as one important option, not their only payment system.

#### General payment article

Focus:

- Mobile payment first
- Cards and cash as backup
- Real failure scenarios
- Payment depends on mobile data

Expected result:

- A reader leaves with a simple payment stack: Alipay, WeChat Pay if possible, two cards, cash, mobile data.

#### Train booking article

Focus:

- 12306 as official source
- Passport real-name ticketing
- Station size
- Name/passport mismatch
- Multiple stations in one city

Expected result:

- A reader knows how to avoid the most common foreign-passenger station problems.

#### eSIM / internet article

Focus:

- eSIM, roaming, local SIM
- Phone compatibility
- App verification
- Google service uncertainty
- Backup for arrival

Expected result:

- A reader understands that internet is the foundation for payment, translation, maps, and bookings.

#### Pre-flight checklist article

Focus:

- Entry, payment, internet, apps, transport, hotel, backups
- Link strongly to payment, transit, train, eSIM, and city picker

Expected result:

- This becomes the central "start here before flying" checklist.

### Acceptance Criteria

- Each of the 8 articles has a clear Quick Answer.
- Each has a practical risk/failure section.
- Each has a source-check section.
- Each has at least 3 internal links.
- Policy-sensitive articles remain cautious.
- No fake or unverified policy claims are introduced.

---

## 5. Implementation Task 3: Strengthen Tool Pages

### Goal

Make each tool easier to understand, safer to use, and more shareable in travel communities.

### Tool Pages

Update:

- `src/pages/tools/china-transit-checker.astro`
- `src/pages/tools/china-travel-checklist.astro`
- `src/pages/tools/china-city-picker.astro`

### Required Additions For Each Tool Page

Add a visible section titled `Real use cases`.

Each tool should include 3-5 specific examples.

Add visible links to:

- Related main guide
- Related planning article
- `/china-travel/sources/`

Add limitation language:

- Transit checker: "This is a self-check, not an immigration decision."
- Travel checklist: "This is planning guidance, not official policy confirmation."
- City picker: "This is editorial route guidance, not official travel advice."

### Tool-Specific Requirements

#### Transit checker

Related links:

- `/china-travel/articles/china-240-hour-visa-free-transit/`
- `/china-travel/articles/china-visa-free-travel-guide/`
- `/china-travel/sources/`

Use cases:

- Traveler checking a Europe-China-Japan route
- Traveler unsure whether round trip qualifies
- Traveler comparing 144-hour vs 240-hour assumptions
- Traveler checking before buying onward ticket

Expected result:

- User sees it as a cautious pre-screening tool.

#### Travel checklist

Related links:

- `/china-travel/articles/china-travel-checklist-before-you-fly/`
- `/china-travel/articles/how-to-pay-in-china-tourist/`
- `/china-travel/articles/best-esim-for-china-travel-internet-access/`
- `/china-travel/sources/`

Use cases:

- First-time visitor flying in two weeks
- Multi-city traveler using high-speed trains
- Tourist who has not set up payment or internet
- Traveler saving offline hotel details

Expected result:

- User sees it as a practical pre-flight preparation tool.

#### City picker

Related links:

- `/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/`
- `/china-travel/articles/best-places-to-visit-in-china-first-time/`
- `/china-travel/articles/ten-days-in-china-first-time-itinerary/`

Use cases:

- First-time visitor choosing Beijing vs Shanghai
- Food-focused visitor considering Chengdu or Guangzhou
- Nature-focused visitor choosing Guilin or Zhangjiajie
- Short-stay traveler needing a lower-friction city

Expected result:

- User sees it as a first-city decision helper, not a full itinerary planner.

### Acceptance Criteria

- Each tool page has visible "Real use cases".
- Each tool page links to at least one related article.
- Each tool page links to `/china-travel/sources/` if policy or platform accuracy matters.
- Each tool page has limitation/disclaimer wording.
- No hidden FAQ schema is added.

---

## 6. Implementation Task 4: Create Weekly Growth Tracker

### Goal

Create a simple document the user can update weekly without technical knowledge.

### File To Create

`docs/china-travel-weekly-growth-tracker.md`

### Required Sections

1. How to use this tracker
2. Weekly KPI table
3. Search Console notes
4. Top pages table
5. External community traffic table
6. Next 3 page updates
7. 30-day success thresholds

### Required Fields

The weekly KPI table must include:

- Date
- Google indexed pages
- Search Console impressions
- Clicks
- CTR
- Average position
- Top 10 queries
- Top 5 clicked pages
- External community sources
- Next 3 page updates

### Expected Result

The user can fill this out every Sunday night and understand whether the site is gaining early traction.

---

## 7. Implementation Task 5: Create External Resource List

### Goal

Give the user a safe outreach map for real exposure, not link manipulation.

### File To Create

`docs/china-travel-external-resource-list.md`

### Required Structure

Create at least 30 resource rows.

Each row should include:

- Platform name
- URL
- Type
- Link policy / link caution
- New-account suitability
- Best topics
- Risk level
- Recommended action

### Resource Categories To Include

Include examples from:

- Reddit travel communities
- Tripadvisor forums
- Quora
- Facebook travel groups
- Expat communities
- Digital nomad communities
- English China travel blogs
- Study abroad / inbound China communities
- Travel Q&A sites

### Safety Rules To Include

The document must clearly state:

- Do not buy links.
- Do not copy-paste the same answer.
- Do not use optimized anchor text repeatedly.
- Do not post links before helping.
- Do not use fake accounts.
- Do not spam irrelevant communities.

### Expected Result

The user has a curated, low-risk list for slow community participation.

---

## 8. Implementation Task 6: Create User Manual Summary

### Goal

Help the user understand what they need to do manually after implementation.

### File To Create Or Update

Create:

`docs/中国旅游站-30天人工操作清单.txt`

### Required Content

Include:

- Week 1: Search Console, Bing, sitemap, Cloudflare Analytics
- Week 2: local China experience notes
- Week 3: community participation
- Weekly data review checklist
- When to ask an agent for the next round
- 30-day success thresholds

Keep the language non-technical and Chinese-first.

---

## 9. Final Verification Checklist

Before reporting completion, run:

```bash
node tests/chinaTravelArticles.test.mjs
node tests/chinaStarterPortalRoutes.test.mjs
node tests/chinaCityPicker.test.mjs
npm run build
```

If any command fails:

- Fix it before reporting completion.
- If a failure is unrelated and pre-existing, report it clearly with evidence.

Manual checks:

- Open built or local pages for:
  - `/china-travel/`
  - `/china-travel/articles/china-240-hour-visa-free-transit/`
  - `/china-travel/tools/`
  - `/tools/china-transit-checker/`
  - `/tools/china-travel-checklist/`
  - `/tools/china-city-picker/`

Confirm:

- JSON-LD is present.
- Tool pages have use cases.
- Article pages still render normally.
- No layout break appears on mobile width.

---

## 10. Final Report Format For The User

When finished, report in Chinese and include:

1. 改了哪些文件
2. 每个文件解决了什么问题
3. 运行了哪些测试和构建
4. 哪些事情需要用户人工完成
5. 下周最建议做的 3 件事

Keep it practical. The user does not need a long technical essay.
