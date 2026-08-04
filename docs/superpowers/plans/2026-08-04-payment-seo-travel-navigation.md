# FunChinaGo Payment SEO and Travel Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the existing FunChinaGo payment cluster and Travel navigation, verify the production build, deploy the tested result, and validate it live on August 4, 2026.

**Architecture:** Extend the existing Astro content model with an optional search title, keep article headings and structured-data headlines independent, centralize visitor-facing stage labels, and rebuild the Travel page from explicit existing-article groups. Add source-backed content through the current Markdown pipeline and reusable semantic CSS patterns, without new routes or client-side dependencies.

**Tech Stack:** Astro 5, TypeScript content collections, Markdown content, Node `assert` tests, GitHub Actions, Cloudflare Pages, Google Search Console.

**Execution:** Inline execution in the current task, as requested. Create one final commit only after the complete verification suite passes.

---

## File Map

- Create `docs/seo/payment-cluster-baseline-2026-08-04.md`: pre-change Search Console evidence and follow-up measurement plan.
- Create `src/data/chinaTravelPresentation.ts`: stage labels and explicit Travel article groups.
- Modify `src/content.config.ts`: optional `seoTitle` schema field.
- Modify `src/layouts/ChinaTravelLayout.astro`: inclusive shared copy and reusable payment-content styles.
- Modify `src/pages/china-travel/articles/[slug].astro`: metadata title fallback and stage-label usage.
- Modify `src/pages/china-travel/articles/index.astro`: stage-label usage.
- Modify `src/pages/china-travel/travel.astro`: SEO metadata and four-section information architecture.
- Modify `src/pages/china-travel.astro`: homepage SEO metadata and international-audience description.
- Modify the five named payment Markdown files: metadata, requested content modules, sources, and links.
- Modify `src/content/china-travel/china-travel-checklist-before-you-fly.md`: Payment Hub backlink.
- Modify `src/content/china-travel/best-apps-for-traveling-in-china.md`: Payment Hub, Alipay, and WeChat links if any are missing.
- Modify `src/data/chinaTravelSources.json`: current first-party source records and August 4 check dates.
- Modify `tests/chinaTravelArticles.test.mjs`: schema, source, and stage-presentation coverage.
- Modify `tests/chinaTravelPaymentCluster.test.mjs`: metadata, Travel grouping, content modules, and internal-link coverage.

### Task 1: Preserve the Search Console baseline

**Files:**
- Create: `docs/seo/payment-cluster-baseline-2026-08-04.md`

- [ ] **Step 1: Read the three-month Search Console totals and page/query tables**

Capture the authoritative date range and the available Clicks, Impressions, CTR, Average position, Countries, and Devices data for the site and named pages. Do not estimate missing cells.

- [ ] **Step 2: Write the baseline document**

Use these fixed sections:

```markdown
# Payment Cluster Baseline — August 4, 2026

## Measurement window
## Site totals
## Page performance
## Query × page observations
## Countries and devices
## Ranking-band interpretation
## August 18 follow-up
## Data limitations
```

Record `Not available in the captured Search Console view` for requested data that cannot be verified.

- [ ] **Step 3: Verify that the baseline contains no unsupported numbers**

Run:

```powershell
rg -n "estimated|approximately|assumed" docs/seo/payment-cluster-baseline-2026-08-04.md
```

Expected: no output.

### Task 2: Add failing tests for metadata and stage presentation

**Files:**
- Modify: `tests/chinaTravelArticles.test.mjs`
- Modify: `tests/chinaTravelPaymentCluster.test.mjs`

- [ ] **Step 1: Add schema and route assertions**

Add assertions equivalent to:

```js
const contentSchema = fs.readFileSync(path.resolve('src/content.config.ts'), 'utf8');
const articleRoute = fs.readFileSync(path.resolve('src/pages/china-travel/articles/[slug].astro'), 'utf8');
assert.ok(contentSchema.includes('seoTitle: z.string().optional()'));
assert.ok(articleRoute.includes('article.data.seoTitle ?? article.data.title'));
assert.ok(articleRoute.includes('"headline": article.data.title'));
```

- [ ] **Step 2: Add visitor-facing stage assertions**

Require `src/data/chinaTravelPresentation.ts` to contain all three labels and require article/listing templates to call `formatTravelStage(...)`. Assert that no template displays `data.stage.replace(...)`.

- [ ] **Step 3: Add target metadata assertions**

Assert the exact approved `seoTitle` and `description` frontmatter values for the five payment pages. Assert the homepage and Travel layout titles and descriptions contain the approved intent phrases.

- [ ] **Step 4: Run the focused tests and verify RED**

Run:

```powershell
node tests/chinaTravelArticles.test.mjs
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: both fail for the newly required `seoTitle`, stage helper, or metadata behavior.

### Task 3: Implement SEO title separation and stage labels

**Files:**
- Create: `src/data/chinaTravelPresentation.ts`
- Modify: `src/content.config.ts`
- Modify: `src/pages/china-travel/articles/[slug].astro`
- Modify: `src/pages/china-travel/articles/index.astro`
- Modify: `src/pages/china-travel/travel.astro`

- [ ] **Step 1: Add the optional schema field**

Insert:

```ts
seoTitle: z.string().optional(),
```

immediately after `title` in the content schema.

- [ ] **Step 2: Create the shared presentation mapping**

Create:

```ts
export const travelStageLabels = {
  discover: 'Explore',
  before: 'Before You Go',
  'in-china': 'While You Are in China',
} as const;

export function formatTravelStage(stage: keyof typeof travelStageLabels) {
  return travelStageLabels[stage];
}
```

- [ ] **Step 3: Wire article metadata without changing the H1 or schema headline**

Pass `article.data.seoTitle ?? article.data.title` to `Layout`. Keep `<h1>{article.data.title}</h1>` and `"headline": article.data.title` unchanged. Replace all raw stage replacements with `formatTravelStage`.

- [ ] **Step 4: Update article archive and Travel card labels**

Import `formatTravelStage` and use it for every visitor-facing stage badge.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run:

```powershell
node tests/chinaTravelArticles.test.mjs
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: metadata/stage assertions pass; remaining planned content assertions may still fail only when already added for later tasks.

### Task 4: Rebuild the Travel page and inclusive shared metadata

**Files:**
- Modify: `src/data/chinaTravelPresentation.ts`
- Modify: `src/pages/china-travel/travel.astro`
- Modify: `src/pages/china-travel.astro`
- Modify: `src/layouts/ChinaTravelLayout.astro`
- Modify: `tests/chinaTravelPaymentCluster.test.mjs`

- [ ] **Step 1: Add failing Travel grouping and audience tests**

Require the exact headings `Payments in China`, `Internet and Essential Apps`, `Entry and Documents`, and `Trains and Routes`. Assert the nine payment slugs exist in the payment group, explicitly grouped IDs are excluded from residual cards, and scoped shared text contains `international first-time visitors` rather than `Western visitors`.

- [ ] **Step 2: Run the payment-cluster test and verify RED**

Run:

```powershell
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: failure for missing Travel groups or inclusive wording.

- [ ] **Step 3: Define explicit Travel groups**

Export a typed configuration from `chinaTravelPresentation.ts` containing existing slugs only. Use these group IDs:

```ts
payments
internet-apps
entry-documents
trains-routes
```

Filter `getCollection('china-travel')` by those IDs, sort deterministically, and exclude every grouped article from any remaining list.

- [ ] **Step 4: Update page metadata and copy**

Set the Travel title to `China Travel Essentials: Payments, Apps, Trains & Entry`. Set the homepage title to `China Travel Guide for First-Time Visitors (2026)`. Use 140–165-character descriptions that cover the requested intent. Replace the shared header subtitle and scoped organization/footer copy with international-visitor wording.

- [ ] **Step 5: Implement responsive grouped cards**

Reuse current color, radius, spacing, and card tokens. Make the Payment Hub visually primary without adding a new visual system. Ensure the grouped grids collapse to one column at the existing mobile breakpoint.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run:

```powershell
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: Travel grouping, no-duplicate, and audience assertions pass.

### Task 5: Verify current first-party payment sources

**Files:**
- Modify: `src/data/chinaTravelSources.json`
- Create or modify: `docs/seo/payment-cluster-baseline-2026-08-04.md`

- [ ] **Step 1: Verify Alipay claims using official Alipay or Ant sources**

Confirm international-card linking, merchant-payment scope, excluded person-to-person or financial functions, exchange-rate handling language, and official support contact details. Preserve only claims directly supported by the source.

- [ ] **Step 2: Verify Weixin Pay claims using Tencent or Weixin Pay sources**

Confirm international-card linking, visitor guidance, current fee-promotion wording, supported scope, customer support, language-guide claims, and PayPal World rollout status. Label announced, rolling out, region-limited, and generally available states exactly.

- [ ] **Step 3: Verify Apple Pay and Google Wallet claims using Apple and Google sources**

Confirm merchant acceptance, NFC/contactless requirements, card-network acceptance, supported wallet/card context, and the distinction between tap-to-pay wallets and local QR payments.

- [ ] **Step 4: Update source registry records**

For every source actually used, set `lastChecked` to `2026-08-04`. Add a source record only when a necessary current first-party page is not already represented. Keep existing IDs stable when they still describe the same official page.

- [ ] **Step 5: Record unsupported requests**

Add every requested but unverified fact to the baseline/report limitations rather than placing it in public content.

### Task 6: Add failing content and internal-link tests

**Files:**
- Modify: `tests/chinaTravelPaymentCluster.test.mjs`

- [ ] **Step 1: Require payment content modules**

Assert exact public headings or class markers for:

```text
60-Second Payment Plan
Payment decision guide
Before You Fly
At Checkout
If It Fails
Merchant scans you
You scan the merchant
What an international card can and cannot do
2026 visitor payment update
PayPal payments through Weixin Pay: current availability
Apple Pay in China
Google Wallet in China
Only time for one app?
```

- [ ] **Step 2: Require trust-module and duplicate-section cleanup**

Assert each of the five core articles contains `Last checked: August 4, 2026` and the caution about changing payment features. Assert Payment Hub no longer contains both a manual source block and the shared source-box heading, and that filtered related links do not duplicate manually curated payment links.

- [ ] **Step 3: Require the internal-link graph**

Assert:

- Payment Hub links every named payment child page and the checklist.
- Every payment child page links Payment Hub.
- Alipay and WeChat link each other and the checklist.
- Apple/Google links Foreign Credit Cards.
- Checklist links Payment Hub.
- Best Apps links Payment Hub, Alipay, and WeChat.

- [ ] **Step 4: Run the focused test and verify RED**

Run:

```powershell
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: failure for at least one missing content module or trust marker.

### Task 7: Implement the five payment-page enhancements

**Files:**
- Modify: `src/content/china-travel/how-to-pay-in-china-tourist.md`
- Modify: `src/content/china-travel/how-to-use-alipay-in-china-foreigner.md`
- Modify: `src/content/china-travel/how-to-use-wechat-pay-in-china-foreigner.md`
- Modify: `src/content/china-travel/can-you-use-apple-pay-or-google-pay-in-china.md`
- Modify: `src/content/china-travel/wechat-pay-vs-alipay-for-tourists-china.md`
- Modify: `src/content/china-travel/china-travel-checklist-before-you-fly.md`
- Modify: `src/content/china-travel/best-apps-for-traveling-in-china.md`
- Modify: `src/layouts/ChinaTravelLayout.astro`

- [ ] **Step 1: Apply the approved metadata**

Add the exact `seoTitle` values from the task. Use the approved descriptions unless verified GSC intent requires a minor wording adjustment. Keep SEO titles approximately 50–65 characters and descriptions approximately 140–165 characters.

- [ ] **Step 2: Enhance Payment Hub**

Place a semantic five-step `60-Second Payment Plan` immediately after Quick Answer. Add the five-row decision guide and the `Before You Fly`, `At Checkout`, and `If It Fails` sequence. Remove duplicate manual source and related-link sections when the shared template already supplies them.

- [ ] **Step 3: Enhance Alipay guide**

Make Quick Answer directly address all five requested questions. Add the two checkout directions, official-scope table, six real-use settings, support information, and 4–6 visible FAQs. Avoid unsupported third-party limits.

- [ ] **Step 4: Enhance WeChat Pay guide**

Make Quick Answer directly address all five requested questions. Add the setup sequence, current source-backed visitor update, payment limitations, support information, and precise PayPal rollout wording. Omit unverified numeric promotions.

- [ ] **Step 5: Separate Apple Pay and Google Wallet intent**

Add the comparison table, distinct Apple Pay and Google Wallet sections, and the five-step failure order. Keep `Google Pay` in search-facing language while using `Google Wallet` for the current product name in explanatory copy.

- [ ] **Step 6: Enhance the comparison guide**

Add the seven-factor decision table and the three-question decision flow. Phrase recommendations as travel-planning guidance rather than permanent platform rules.

- [ ] **Step 7: Complete the internal-link audit**

Add only contextual links that are missing. Do not add `click here`, repeat one URL in the same paragraph, or create new slugs.

- [ ] **Step 8: Add shared responsive styles**

Style `.payment-steps`, `.payment-step`, `.payment-flow`, `.payment-comparison`, `.payment-table`, and `.trust-module` within the existing article layout. At the narrow breakpoint, stack multi-column rows and allow table cells to wrap without horizontal overflow.

- [ ] **Step 9: Run the focused test and verify GREEN**

Run:

```powershell
node tests/chinaTravelPaymentCluster.test.mjs
```

Expected: `chinaTravel payment cluster tests passed`.

### Task 8: Run complete local verification

**Files:**
- Modify only if verification exposes an in-scope defect.

- [ ] **Step 1: Run all automated tests**

Run:

```powershell
npm test
```

Expected: exit code 0 and all seven test scripts pass.

- [ ] **Step 2: Build the production site**

Run:

```powershell
npm run build
```

Expected: exit code 0 with generated routes and sitemap.

- [ ] **Step 3: Verify configured production URLs**

Run:

```powershell
npm run verify-site-url -- https://funchinago.com
```

Expected: exit code 0.

- [ ] **Step 4: Inspect generated metadata and schema**

For the homepage, Travel page, and five core articles, verify one `<title>`, a unique description, canonical non-www HTTPS, matching Open Graph/Twitter title, and article JSON-LD headline equal to the H1 rather than `seoTitle`.

- [ ] **Step 5: Verify links, assets, sources, and sitemap**

Check that local internal hrefs resolve to generated files, official source IDs exist in the registry, hero images exist, no new article file was created, and the sitemap route count did not change unexpectedly.

- [ ] **Step 6: Verify 390-pixel rendering**

Run the built site locally and inspect the homepage, Travel page, and five core articles at 390 pixels. Confirm no horizontal scroll; readable tables; intact H1; early Quick Answer; non-overflowing step modules; and usable card targets.

### Task 9: Review, commit, deploy, and verify production

**Files:**
- No additional files unless deployment verification exposes an in-scope defect.

- [ ] **Step 1: Review final scope**

Run:

```powershell
git status --short
git diff --stat
git diff --check
```

Expected: only planned files, no temporary screenshots, caches, or unrelated changes, and no whitespace errors.

- [ ] **Step 2: Create the final commit**

Stage only planned files and commit with:

```text
Improve payment search intent and travel navigation
```

- [ ] **Step 3: Push `main`**

Push the tested commit to `origin/main`.

- [ ] **Step 4: Wait for deployment**

Inspect the matching GitHub Actions run and Cloudflare Pages deployment until it succeeds or returns an actionable failure.

- [ ] **Step 5: Verify production pages**

Check the eleven named URLs and sitemap. Confirm metadata, stage labels, Travel groups, payment modules, canonical host, www-to-non-www redirect, and deployed commit.

- [ ] **Step 6: Request Search Console reindexing**

Request indexing for the homepage, Travel, Payment Hub, Alipay, WeChat Pay, Apple Pay / Google Wallet, and Alipay vs WeChat Pay URLs. Confirm the existing sitemap remains successful; do not submit the sitemap through URL Inspection.

- [ ] **Step 7: Produce the final report**

Report sections A–H from the user task: baseline, changed files, page optimizations, information architecture, technical verification, deployment, GSC actions, and explicitly incomplete items.
