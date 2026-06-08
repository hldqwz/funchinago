# China Starter Portal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the China section from a travel-blog homepage into a Western-friendly China starter portal with clearer top-level navigation, stronger image-led hierarchy, and dedicated first-level entry pages.

**Architecture:** Keep the existing Astro content collections and article pages, but introduce a new portal taxonomy and route structure around them. Use small shared data objects for homepage and first-level section cards, refresh the China layout theme tokens, and preserve trust/tooling by routing existing articles and tools into clearer category entry points instead of listing everything flat on the homepage.

**Tech Stack:** Astro 5, Astro content collections, static markdown content, JSON data, Node test runner, CSS in `.astro` files

---

## File Structure

### Existing files to modify

- `src/layouts/ChinaTravelLayout.astro`
  - Update the visual token system, navigation labels, and shared shell to support the new portal identity.
- `src/pages/china-travel.astro`
  - Replace the current article-heavy homepage with the new module order: hero, start here, cities, life and culture, tools, featured city.
- `src/pages/china-travel/articles/index.astro`
  - Keep article archive behavior, but align language and visual treatment with the new portal hierarchy.
- `src/content.config.ts`
  - Extend the China content schema with a first-level section field so articles can be routed under the new taxonomy.
- `tests/chinaTravelArticles.test.mjs`
  - Validate new section metadata and homepage assumptions.

### New files to create

- `src/data/chinaStarterPortal.ts`
  - Shared homepage and category-card data for first-level sections, featured paths, and highlighted cards.
- `src/pages/china-travel/start-here.astro`
  - Landing page for beginners, showing guided entry paths instead of a flat archive.
- `src/pages/china-travel/travel.astro`
  - Landing page for visas, payments, apps, transport, and practical trip prep.
- `src/pages/china-travel/cities.astro`
  - Landing page for city discovery and destination comparisons.
- `src/pages/china-travel/life-culture.astro`
  - Landing page for food, daily life, and practical culture-facing content.
- `src/pages/china-travel/tools.astro`
  - Landing page that groups the existing tool pages into a coherent portal module.
- `tests/chinaStarterPortalRoutes.test.mjs`
  - Assert that the new portal data and route grouping are internally consistent.

## Task 1: Lock taxonomy and shared portal data

**Files:**
- Create: `src/data/chinaStarterPortal.ts`
- Modify: `src/content.config.ts`
- Modify: `src/content/china-travel/*.md`
- Test: `tests/chinaTravelArticles.test.mjs`

- [ ] **Step 1: Extend the China content schema with a first-level section field**

```ts
const chinaTravel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/china-travel' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updatedAt: z.coerce.date(),
    description: z.string(),
    stage: z.enum(['discover', 'before', 'in-china']),
    section: z.enum(['start-here', 'travel', 'cities', 'life-culture', 'tools']),
    tags: z.array(z.string()).default([]),
    hero_image: z.string().optional(),
    officialSources: z.array(z.string()).default([]),
    relatedTools: z.array(z.object({
      title: z.string(),
      href: z.string(),
    })).default([]),
  }),
});
```

- [ ] **Step 2: Add `section` frontmatter to every China markdown file**

```md
---
title: "How to Pay in China as a Tourist"
date: 2026-06-01
updatedAt: 2026-06-04
description: "A simple guide to paying in China as a tourist."
stage: before
section: travel
tags:
  - payment
  - alipay
  - wechat pay
---
```

- [ ] **Step 3: Create shared portal data for homepage modules and section cards**

```ts
export const portalSections = [
  {
    slug: 'start-here',
    title: 'Start Here',
    href: '/china-travel/start-here/',
    eyebrow: 'First time in China?',
    description: 'Choose the easiest path to begin: planning a trip, choosing a city, or understanding modern China.',
    image: '/china-travel/images/hero-china-travel-made-easy.png',
  },
  {
    slug: 'cities',
    title: 'Cities',
    href: '/china-travel/cities/',
    eyebrow: 'Explore destinations',
    description: 'Compare major cities and find the best fit for food, pace, views, and first-time comfort.',
    image: '/china-travel/images/article-weekly-guangzhou.jpg',
  },
];

export const startHereCards = [
  {
    title: 'Plan your first trip',
    href: '/china-travel/travel/',
    text: 'Visas, payments, apps, trains, and the prep work that matters most.',
  },
  {
    title: 'Choose your first city',
    href: '/china-travel/cities/',
    text: 'Start with a city that matches your travel style, budget, and pace.',
  },
  {
    title: 'Understand everyday China',
    href: '/china-travel/life-culture/',
    text: 'Food, daily life, etiquette, and what modern China actually feels like.',
  },
];
```

- [ ] **Step 4: Write a failing test that enforces valid section metadata**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { getCollection } from 'astro:content';

test('china travel articles use the new first-level section taxonomy', async () => {
  const articles = await getCollection('chinaTravel');
  const allowed = new Set(['start-here', 'travel', 'cities', 'life-culture', 'tools']);

  assert.ok(articles.length >= 20);
  for (const article of articles) {
    assert.ok(allowed.has(article.data.section), `${article.id} is missing a valid section`);
  }
});
```

- [ ] **Step 5: Run the targeted test to verify it fails before content is updated**

Run: `node --test tests/chinaTravelArticles.test.mjs`
Expected: FAIL with one or more article entries missing `section`

- [ ] **Step 6: Update schema, content, and shared data with the minimal implementation**

```ts
const articles = (await getCollection('chinaTravel'))
  .filter((article) => article.data.section === 'travel')
  .sort((a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime());
```

- [ ] **Step 7: Run the targeted test to verify it passes**

Run: `node --test tests/chinaTravelArticles.test.mjs`
Expected: PASS with the section taxonomy check green

- [ ] **Step 8: Commit**

```bash
git add src/content.config.ts src/content/china-travel src/data/chinaStarterPortal.ts tests/chinaTravelArticles.test.mjs
git commit -m "feat: add china starter portal taxonomy"
```

## Task 2: Refresh the shared layout and navigation shell

**Files:**
- Modify: `src/layouts/ChinaTravelLayout.astro`
- Test: `npm run build`

- [ ] **Step 1: Write a failing assertion by building against the old navigation labels**

Run: `npm run build`
Expected: PASS initially, but note that the rendered shell still exposes the old `Articles` and `Sources` emphasis instead of the new portal navigation.

- [ ] **Step 2: Replace the old nav model with the new first-level navigation**

```astro
<nav class="site-nav">
  <a href="/china-travel/" class:list={{ active: currentPath === "/china-travel/" }}>Home</a>
  <a href="/china-travel/start-here/" class:list={{ active: currentPath.includes("/china-travel/start-here/") }}>Start Here</a>
  <a href="/china-travel/travel/" class:list={{ active: currentPath.includes("/china-travel/travel/") }}>Travel</a>
  <a href="/china-travel/cities/" class:list={{ active: currentPath.includes("/china-travel/cities/") }}>Cities</a>
  <a href="/china-travel/life-culture/" class:list={{ active: currentPath.includes("/china-travel/life-culture/") }}>Life & Culture</a>
  <a href="/china-travel/tools/" class:list={{ active: currentPath.includes("/china-travel/tools/") }}>Tools</a>
</nav>
```

- [ ] **Step 3: Replace the current warm-heavy token set with the new base system**

```astro
<style is:global>
  :root {
    --bg: #f3f7f8;
    --surface: #ffffff;
    --surface-alt: #eef5f5;
    --text: #152126;
    --text-secondary: #5c6b70;
    --border: #d8e4e6;
    --accent: #2d6f73;
    --accent-hover: #245b5f;
    --accent-light: rgba(45, 111, 115, 0.1);
    --feature-red: #8f3434;
    --feature-gold: #c7953c;
  }
</style>
```

- [ ] **Step 4: Add a reusable highlight treatment for featured-city blocks**

```astro
.feature-accent {
  background: linear-gradient(135deg, rgba(143, 52, 52, 0.08), rgba(199, 149, 60, 0.14));
  border: 1px solid rgba(143, 52, 52, 0.12);
}
```

- [ ] **Step 5: Run the full build to verify the shell still compiles**

Run: `npm run build`
Expected: PASS and the China pages build with the new navigation and token system

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ChinaTravelLayout.astro
git commit -m "feat: refresh china portal layout shell"
```

## Task 3: Rebuild the homepage around the new portal hierarchy

**Files:**
- Modify: `src/pages/china-travel.astro`
- Modify: `src/data/chinaStarterPortal.ts`
- Test: `tests/chinaStarterPortalRoutes.test.mjs`

- [ ] **Step 1: Write a failing test for the homepage module order data**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { portalSections, startHereCards } from '../src/data/chinaStarterPortal.ts';

test('homepage portal data exposes the required modules', () => {
  assert.equal(startHereCards.length, 3);
  assert.deepEqual(
    portalSections.map((section) => section.slug),
    ['start-here', 'travel', 'cities', 'life-culture', 'tools']
  );
});
```

- [ ] **Step 2: Run the test to verify it fails before the data is finalized**

Run: `node --test tests/chinaStarterPortalRoutes.test.mjs`
Expected: FAIL because the current shared data does not yet contain the full ordered section list

- [ ] **Step 3: Replace the current homepage structure with the new module order**

```astro
<main class="portal-page">
  <section class="hero-shell">
    <div class="hero-copy">
      <p class="eyebrow">China starter portal</p>
      <h1>Start understanding China before you even book the flight.</h1>
      <p class="hero-summary">Explore cities, plan your trip, learn how everyday China works, and use practical tools built for first-time visitors.</p>
      <div class="hero-actions">
        <a class="primary" href="/china-travel/start-here/">Start here</a>
        <a href="/china-travel/cities/">Explore cities</a>
      </div>
    </div>
    <a class="hero-visual feature-accent" href="/china-travel/cities/">
      <img src="/china-travel/images/article-weekly-guangzhou.jpg" alt="Guangzhou skyline at sunset" />
      <div class="hero-visual-copy">
        <span>Weekly city pick</span>
        <h2>Guangzhou</h2>
        <p>Food, slower pace, warm weather, and a softer first step into China.</p>
      </div>
    </a>
  </section>

  <section class="start-here-grid">
    {startHereCards.map((card) => (
      <a class="path-card" href={card.href}>
        <h2>{card.title}</h2>
        <p>{card.text}</p>
      </a>
    ))}
  </section>
</main>
```

- [ ] **Step 4: Add dedicated modules for cities, life and culture, and tools rather than a flat article grid**

```astro
<section class="module-block">
  <div class="module-head">
    <p class="eyebrow">Cities</p>
    <h2>Find a first city that matches how you like to travel.</h2>
  </div>
  <div class="city-card-grid">
    {cityHighlights.map((city) => (
      <a class="city-card" href={city.href}>
        <img src={city.image} alt={city.alt} />
        <div>
          <h3>{city.title}</h3>
          <p>{city.text}</p>
        </div>
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 5: Run the new homepage data test**

Run: `node --test tests/chinaStarterPortalRoutes.test.mjs`
Expected: PASS with the ordered homepage module data check green

- [ ] **Step 6: Run a production build to verify the redesigned homepage compiles**

Run: `npm run build`
Expected: PASS and `/china-travel/` renders with the new portal-first structure

- [ ] **Step 7: Commit**

```bash
git add src/pages/china-travel.astro src/data/chinaStarterPortal.ts tests/chinaStarterPortalRoutes.test.mjs
git commit -m "feat: rebuild china homepage as starter portal"
```

## Task 4: Add first-level landing pages for the new portal sections

**Files:**
- Create: `src/pages/china-travel/start-here.astro`
- Create: `src/pages/china-travel/travel.astro`
- Create: `src/pages/china-travel/cities.astro`
- Create: `src/pages/china-travel/life-culture.astro`
- Create: `src/pages/china-travel/tools.astro`
- Modify: `src/pages/china-travel/articles/index.astro`
- Test: `npm run build`

- [ ] **Step 1: Create the `Start Here` landing page with guided entry cards**

```astro
---
import Layout from "../../layouts/ChinaTravelLayout.astro";
import { startHereCards } from "../../data/chinaStarterPortal";
---

<Layout title="Start Here" description="The easiest way to begin understanding travel and everyday life in China.">
  <main class="portal-section">
    <section class="section-hero">
      <p class="eyebrow">Start Here</p>
      <h1>The easiest first steps for understanding China.</h1>
      <p>Choose a path: planning a trip, choosing a city, or learning how modern China works day to day.</p>
    </section>
    <section class="path-grid">
      {startHereCards.map((card) => (
        <a class="path-card" href={card.href}>
          <h2>{card.title}</h2>
          <p>{card.text}</p>
        </a>
      ))}
    </section>
  </main>
</Layout>
```

- [ ] **Step 2: Create the `Travel`, `Cities`, `Life & Culture`, and `Tools` landing pages by filtering the shared taxonomy**

```astro
---
import Layout from "../../layouts/ChinaTravelLayout.astro";
import { getCollection } from "astro:content";

const travelArticles = (await getCollection("chinaTravel"))
  .filter((article) => article.data.section === "travel")
  .sort((a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime());
---
```

- [ ] **Step 3: Update the existing article index page so it behaves as a full archive instead of pretending to be a first-level section**

```astro
<Layout title="All China Articles" description="The full archive of China starter portal articles, grouped by topic and travel stage.">
  <main class="ct-articles">
    <section class="hero">
      <a class="back-link" href="/china-travel/">← Back to the portal</a>
      <p class="kicker">Full article archive</p>
      <h1>Browse every China guide in one place.</h1>
    </section>
  </main>
</Layout>
```

- [ ] **Step 4: Run the full build to verify all first-level routes render**

Run: `npm run build`
Expected: PASS with new routes for `/china-travel/start-here/`, `/travel/`, `/cities/`, `/life-culture/`, and `/tools/`

- [ ] **Step 5: Commit**

```bash
git add src/pages/china-travel/start-here.astro src/pages/china-travel/travel.astro src/pages/china-travel/cities.astro src/pages/china-travel/life-culture.astro src/pages/china-travel/tools.astro src/pages/china-travel/articles/index.astro
git commit -m "feat: add first-level china portal landing pages"
```

## Task 5: Tighten imagery, archive language, and verification

**Files:**
- Modify: `src/pages/china-travel.astro`
- Modify: `src/pages/china-travel/articles/index.astro`
- Modify: `src/pages/china-travel/articles/[slug].astro`
- Modify: `tests/chinaTravelArticles.test.mjs`
- Modify: `tests/chinaStarterPortalRoutes.test.mjs`

- [ ] **Step 1: Add route-level assertions that every first-level page and homepage card points to a real destination**

```js
test('portal navigation hrefs are unique and China-scoped', () => {
  const hrefs = portalSections.map((section) => section.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  hrefs.forEach((href) => assert.ok(href.startsWith('/china-travel/')));
});
```

- [ ] **Step 2: Update article and archive copy so they refer to the portal instead of a narrow travel blog identity**

```astro
<aside class="accuracy-note">
  <strong>Accuracy note:</strong> This portal uses official Chinese government or platform sources as the backbone for policy-sensitive topics. Use the linked source for final confirmation before you travel.
</aside>
```

- [ ] **Step 3: Replace any leftover article-grid-first homepage remnants with curated cards or image-led groupings**

```astro
{lifeCultureHighlights.map((item) => (
  <a class="culture-card" href={item.href}>
    <img src={item.image} alt={item.alt} />
    <div>
      <span>{item.eyebrow}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </div>
  </a>
))}
```

- [ ] **Step 4: Run the test suite**

Run: `node --test tests/*.mjs`
Expected: PASS with the updated taxonomy, route, and portal assertions all green

- [ ] **Step 5: Run the final production build**

Run: `npm run build`
Expected: PASS with all China starter portal routes generated successfully

- [ ] **Step 6: Commit**

```bash
git add src/pages/china-travel.astro src/pages/china-travel/articles/index.astro src/pages/china-travel/articles/[slug].astro tests/chinaTravelArticles.test.mjs tests/chinaStarterPortalRoutes.test.mjs
git commit -m "feat: finalize china starter portal polish"
```

## Self-Review

### Spec coverage

- Product repositioning is covered by Tasks 2 through 5.
- New first-level taxonomy is covered by Task 1.
- Homepage order and routing are covered by Task 3.
- New landing pages are covered by Task 4.
- Visual-system refresh and image-led hierarchy are covered by Tasks 2, 3, and 5.
- Guardrails around tools, cities, and life and culture are reflected in Tasks 1, 3, and 4.

### Placeholder scan

- No `TBD`, `TODO`, or "implement later" placeholders remain.
- Each code-bearing step includes concrete code, not only descriptions.

### Type consistency

- The shared taxonomy uses `start-here`, `travel`, `cities`, `life-culture`, and `tools` consistently across schema, data, tests, and page filters.
- Shared data names used later in the plan (`portalSections`, `startHereCards`) are defined in Task 1 before use in later tasks.
