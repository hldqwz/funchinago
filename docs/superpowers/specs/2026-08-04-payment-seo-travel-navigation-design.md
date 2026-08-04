# FunChinaGo Payment SEO and Travel Navigation Design

## Goal

Complete a same-day, production-ready enhancement of the existing payment content cluster and Travel information architecture. Improve search-intent alignment, metadata, scanability, trustworthy sourcing, internal navigation, and mobile presentation without adding articles, changing URLs, or redesigning the site.

## Scope

The change covers:

- A Search Console baseline document for the pre-change period.
- Optional article `seoTitle` support with fallback to `title`.
- SEO metadata updates for the homepage, Travel page, Payment Hub, Alipay, WeChat Pay, Apple Pay / Google Wallet, and Alipay vs WeChat Pay pages.
- Focused content enhancements to the five existing payment pages.
- A four-section Travel page: Payments in China; Internet and Essential Apps; Entry and Documents; Trains and Routes.
- Human-readable stage labels everywhere the internal values are displayed.
- Inclusive audience wording for first-time international visitors.
- Official-source and internal-link audits for the payment cluster.
- Automated tests, production build, URL verification, mobile checks, deployment, live verification, and Search Console reindex requests.

The change does not include new articles, new slugs, redirects, canonical-host middleware changes, sitemap-scope changes, FAQ schema, affiliate links, AI imagery, broad visual redesign, or unrelated refactoring.

## Architecture

### Search baseline

Store the pre-change Search Console evidence in `docs/seo/payment-cluster-baseline-2026-08-04.md`. Record the available site, page, query, country, and device metrics with their date range. Mark data that cannot be confirmed from Search Console as unavailable instead of estimating it. Include the August 18 comparison plan and ranking-band interpretation.

### SEO title separation

Add optional `seoTitle` validation to the China Travel content schema. Article routes pass `article.data.seoTitle ?? article.data.title` to the shared layout for HTML, Open Graph, and Twitter titles. The visible H1 and Article JSON-LD headline continue to use `article.data.title`. Existing articles without `seoTitle` remain valid and retain current behavior.

The homepage and Travel page supply their dedicated SEO titles directly to the layout because their visible H1 values are already independent page content.

### Presentation mapping

Create one presentation helper that maps stored stage values to visitor-facing labels:

- `discover` to `Explore`
- `before` to `Before You Go`
- `in-china` to `While You Are in China`

Article pages, article listings, and Travel cards use the helper. No stored frontmatter values change.

### Travel information architecture

Build four explicit Travel groups from the existing `travel` collection by slug. The Payment Hub is the lead payment card; the remaining payment pages are supporting cards. Articles shown in explicit groups are excluded from any residual list, preventing immediate duplicate cards. The layout and visual tokens remain consistent with the current site.

### Reusable payment presentation

Use semantic HTML patterns in Markdown with shared article-layout CSS for:

- Step sequences.
- Checkout-direction comparisons.
- Decision tables that become stacked, readable blocks at narrow widths.
- Source and last-checked notes.

These patterns have visible text, do not depend on color alone, require no client JavaScript, and must not create horizontal scrolling at 390 pixels.

### Content and evidence

Keep each existing article's core structure and add only the requested decision support, setup steps, limitations, failure actions, official support details, and contextual links. Government, Alipay, Tencent / Weixin Pay, Apple, and Google claims must be supported by current first-party sources checked on August 4, 2026. Announced, rolling-out, region-limited, and generally available features must be described distinctly. Unsupported limits, fees, card lists, or rollout claims are omitted and reported.

Each substantially checked payment article has one visible trust module and one official-source area. Existing duplicate manual source or related-link sections are removed when the shared article template already supplies the same function.

## Testing Strategy

Follow test-first implementation for behavior changes:

1. Add failing assertions for optional `seoTitle`, fallback behavior, metadata wiring, and JSON-LD headline independence.
2. Add failing assertions for human-readable stage labels and the absence of raw values in display templates.
3. Add failing assertions for the four Travel groups, required slugs, and duplicate exclusion.
4. Add failing assertions for payment-page metadata, requested content modules, official-source identifiers, and internal links.
5. Implement the minimum changes needed to pass each group.

Final verification includes `npm test`, `npm run build`, `npm run verify-site-url -- https://funchinago.com`, generated-page metadata inspection, internal-link checks, canonical and sitemap checks, and 390-pixel browser checks of the seven named pages.

## Deployment and Live Verification

After all local verification passes, inspect the final diff for scope and temporary files, create one intentional commit with the requested message, and push `main`. Wait for GitHub Actions and Cloudflare Pages to complete, confirm the deployed commit, and verify the named production pages, canonical redirect, and sitemap. Only then request reindexing for the seven approved URLs in Search Console.

## Failure Handling

- If a current official source does not support a requested factual claim, omit the claim and list it as incomplete.
- If a new test exposes unrelated existing behavior, keep the task scoped and report the conflict before expanding changes.
- If deployment fails, inspect the action or platform output, fix only task-related failures, rerun the full verification suite, and redeploy.
- If Search Console or deployment authentication requires user interaction, preserve the relevant browser page and request that interaction without switching accounts or bypassing authentication.

## Acceptance Criteria

- No new content article or URL is created.
- `seoTitle` is optional, used for search/social metadata, and never replaces the article H1 or schema headline.
- Raw `before` and `in china` labels are absent from visitor-facing article and listing UI.
- Travel content appears in the four approved groups without duplicate cards.
- The five payment pages contain the approved, source-backed enhancements and required internal links.
- Inclusive international-visitor wording replaces the scoped Western-visitor wording.
- Core metadata, canonical URLs, Open Graph, Twitter, structured data, internal links, sources, images, and sitemap pass verification.
- The seven required pages render without horizontal overflow at 390 pixels.
- The verified build is deployed from `main`, confirmed live, and followed by the approved Search Console reindex requests.
