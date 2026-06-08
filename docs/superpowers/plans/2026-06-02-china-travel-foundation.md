# China Travel Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable foundation for the China Travel Made Easy site before writing full articles.

**Architecture:** Keep policy-sensitive facts in a structured source registry, render them on a dedicated source library page, and use article brief templates to make every article cite official or platform-authoritative sources. The current LLM site remains intact while China Travel pages live under `/china-travel/` and tools live under `/tools/`.

**Tech Stack:** Astro SSG, JSON data files, plain JavaScript validation tests, Markdown planning documents.

---

## File Structure

- Create: `src/data/chinaTravelSources.json` — structured official/platform/community source registry.
- Create: `tests/chinaTravelSources.test.mjs` — validates source registry shape and critical official links.
- Create: `src/pages/china-travel/sources.astro` — public source library page.
- Modify: `src/pages/china-travel.astro` — link to the source library.
- Create: `memory/china_travel_article_brief_template.md` — reusable article writing template.
- Create: `memory/china_travel_first_8_briefs.md` — brief scaffolds for first 8 articles.

---

### Task 1: Official Source Registry

**Files:**
- Create: `tests/chinaTravelSources.test.mjs`
- Create: `src/data/chinaTravelSources.json`

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sourcePath = new URL('../src/data/chinaTravelSources.json', import.meta.url);
const sources = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

assert.ok(Array.isArray(sources.sources), 'sources.sources must be an array');
assert.ok(sources.sources.length >= 8, 'source registry should start with at least 8 sources');

for (const source of sources.sources) {
  assert.equal(typeof source.id, 'string');
  assert.equal(typeof source.title, 'string');
  assert.equal(typeof source.url, 'string');
  assert.ok(source.url.startsWith('https://'), `${source.id} must use https`);
  assert.equal(typeof source.authority, 'string');
  assert.equal(typeof source.category, 'string');
  assert.equal(typeof source.trustLevel, 'string');
  assert.ok(['official', 'platform-official', 'community-signal', 'media-context'].includes(source.trustLevel));
  assert.equal(typeof source.useFor, 'string');
  assert.equal(typeof source.lastChecked, 'string');
}

const ids = new Set(sources.sources.map((source) => source.id));
assert.ok(ids.has('nia-240h-transit-2025'), 'must include NIA 240-hour transit official source');
assert.ok(ids.has('gov-payment-guide-2024'), 'must include Chinese Government payment guide');
assert.ok(ids.has('railway-12306-en'), 'must include China Railway 12306 English source');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/chinaTravelSources.test.mjs`

Expected: FAIL because `src/data/chinaTravelSources.json` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create a JSON file with at least 8 sources covering immigration, government payment guidance, Alipay, railway, official tourism, and community/media signal sources.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/chinaTravelSources.test.mjs`

Expected: PASS.

---

### Task 2: Public Source Library Page

**Files:**
- Create: `src/pages/china-travel/sources.astro`
- Modify: `src/pages/china-travel.astro`

- [ ] **Step 1: Create page rendering source registry**

The page imports `src/data/chinaTravelSources.json`, groups official and platform sources first, and explains that policy-sensitive articles use official Chinese or platform sources as the fact backbone.

- [ ] **Step 2: Link from China Travel architecture page**

Add a visible link to `/china-travel/sources/` in the source strategy section.

- [ ] **Step 3: Build and inspect generated HTML**

Run: `npm run build`

Expected: build succeeds and `dist/china-travel/sources/index.html` contains `National Immigration Administration` and `Payment guide for visitors to China`.

---

### Task 3: Article Brief System

**Files:**
- Create: `memory/china_travel_article_brief_template.md`
- Create: `memory/china_travel_first_8_briefs.md`

- [ ] **Step 1: Create article brief template**

The template must include title, target keyword, search intent, reader anxiety, quick answer, required official sources, local-experience slots, sections, FAQ, internal links, image idea, and accuracy checklist.

- [ ] **Step 2: Create first 8 article brief scaffolds**

Create brief scaffolds for:

1. Best Places to Visit in China for First-Time Visitors
2. China Travel Checklist: What to Prepare Before You Fly
3. China Visa-Free Travel Guide 2026
4. China 240-Hour Visa-Free Transit Explained
5. How to Pay in China as a Tourist
6. How to Use Alipay in China as a Foreigner
7. How to Book High-Speed Train Tickets in China as a Foreigner
8. China Travel Mistakes to Avoid on Your First Trip

- [ ] **Step 3: Verify files contain no empty placeholder sections**

Run: `rg -n "TBD|TODO|待补|placeholder" memory/china_travel_article_brief_template.md memory/china_travel_first_8_briefs.md`

Expected: no matches.

---
