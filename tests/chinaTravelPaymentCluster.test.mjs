import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlesDir = path.resolve('src/content/china-travel');

function readArticle(slug) {
  return fs.readFileSync(path.join(articlesDir, `${slug}.md`), 'utf8');
}

function assertIncludes(text, pattern, label) {
  assert.ok(text.includes(pattern), `${label} missing: ${pattern}`);
}

function assertFrontmatterValue(article, key, expected, label) {
  const match = article.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  assert.ok(match, `${label} missing frontmatter field: ${key}`);
  assert.equal(match[1], expected, `${label} has unexpected ${key}`);
}

const wechat = readArticle('how-to-use-wechat-pay-in-china-foreigner');
assertFrontmatterValue(
  wechat,
  'title',
  'WeChat Pay in China for Foreigners: Setup, Limits & Backup Tips',
  'wechat article',
);
assertFrontmatterValue(
  wechat,
  'description',
  'Learn how foreign visitors can use WeChat Pay in China, what to prepare before arrival, what to do if payment fails, and when to use Alipay or cash as backup.',
  'wechat article',
);
for (const heading of [
  '## Can Foreigners Use WeChat Pay in China?',
  '## WeChat Pay Not Working in China: What to Do',
  '## WeChat Pay vs Alipay for Tourists',
  '## Do You Still Need Cash in China?',
  '## FAQ for Foreign Visitors',
]) {
  assertIncludes(wechat, heading, 'wechat article');
}
for (const href of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
  '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
]) {
  assertIncludes(wechat, href, 'wechat article links');
}

const alipay = readArticle('how-to-use-alipay-in-china-foreigner');
assertFrontmatterValue(
  alipay,
  'title',
  'How to Use Alipay in China as a Foreigner: Setup & Backup Tips',
  'alipay article',
);
assertFrontmatterValue(
  alipay,
  'description',
  'A practical guide for foreign visitors using Alipay in China, including setup before arrival, foreign card payments, common failures, and backup options.',
  'alipay article',
);
for (const heading of [
  '## Is Alipay Easier Than WeChat Pay for Foreign Tourists?',
  '## Alipay Not Working in China: Common Reasons',
  '## What to Do If Alipay Fails at a Shop or Restaurant',
  '## Should You Set Up Alipay Before Arriving in China?',
  '## FAQ for Foreign Visitors',
]) {
  assertIncludes(alipay, heading, 'alipay article');
}
for (const href of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
  '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
]) {
  assertIncludes(alipay, href, 'alipay article links');
}

const checklist = readArticle('china-travel-checklist-before-you-fly');
assertFrontmatterValue(
  checklist,
  'title',
  'China Travel Checklist Before You Fly: Apps, Payments, Internet & Documents',
  'checklist article',
);
assertFrontmatterValue(
  checklist,
  'description',
  'A practical China travel checklist for first-time visitors, covering payment apps, internet access, documents, transport, hotels, and arrival-day backups.',
  'checklist article',
);
for (const heading of [
  '## China Travel Checklist: 7 Things to Set Up Before You Fly',
  '## Arrival Day Checklist',
  '## Payment Backup Plan',
  '## Internet and Translation Setup',
  '## Hotel and Transport Preparation',
]) {
  assertIncludes(checklist, heading, 'checklist article');
}
for (const href of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
  '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
]) {
  assertIncludes(checklist, href, 'checklist article links');
}

for (const [slug, expectedTitle, mustLink] of [
  [
    'alipay-not-working-in-china-foreign-tourists',
    'Alipay Not Working in China for Foreign Tourists: What to Do',
    '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  ],
  [
    'wechat-pay-not-working-in-china-foreigners',
    'WeChat Pay Not Working in China for Foreigners: What to Do',
    '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  ],
]) {
  const article = readArticle(slug);
  assertFrontmatterValue(article, 'title', expectedTitle, `${slug} article`);
  for (const heading of [
    '## Quick Answer',
    '## Common Reasons',
    '## What to Do Immediately',
    '## Backup Options',
    '## Before You Arrive Checklist',
    '## Check Official Sources Before You Travel',
  ]) {
    assertIncludes(article, heading, `${slug} article`);
  }
  for (const href of [
    '/china-travel/articles/how-to-pay-in-china-tourist/',
    '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
    '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
    '/china-travel/articles/china-travel-checklist-before-you-fly/',
    mustLink,
  ]) {
    assertIncludes(article, href, `${slug} article links`);
  }
}

const paymentHub = readArticle('how-to-pay-in-china-tourist');
assertIncludes(paymentHub, 'If payment fails', 'payment hub');
assertIncludes(paymentHub, 'Compare Alipay and WeChat Pay', 'payment hub');
for (const href of [
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
  '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
]) {
  assertIncludes(paymentHub, href, 'payment hub links');
}

for (const [slug, expectedTitle, requiredHrefs] of [
  [
    'do-you-need-cash-in-china-as-a-tourist',
    'Do You Need Cash in China as a Tourist? Where Cash Still Helps',
    [
      '/china-travel/articles/how-to-pay-in-china-tourist/',
      '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
      '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
      '/china-travel/articles/china-travel-checklist-before-you-fly/',
    ],
  ],
  [
    'can-foreign-credit-cards-work-in-china',
    'Can Foreign Credit Cards Work in China? What Tourists Should Expect',
    [
      '/china-travel/articles/how-to-pay-in-china-tourist/',
      '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
      '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
      '/china-travel/articles/do-you-need-cash-in-china-as-a-tourist/',
    ],
  ],
  [
    'can-you-use-apple-pay-or-google-pay-in-china',
    'Can You Use Apple Pay or Google Pay in China? What Travelers Should Know',
    [
      '/china-travel/articles/how-to-pay-in-china-tourist/',
      '/china-travel/articles/can-foreign-credit-cards-work-in-china/',
      '/china-travel/articles/do-you-need-cash-in-china-as-a-tourist/',
      '/china-travel/articles/china-travel-checklist-before-you-fly/',
    ],
  ],
]) {
  const article = readArticle(slug);
  assertFrontmatterValue(article, 'title', expectedTitle, `${slug} article`);
  for (const heading of [
    '## Quick Answer',
    '## What Travelers Usually Expect',
    '## Practical Backup Plan',
    '## Check Official Sources Before You Travel',
  ]) {
    assertIncludes(article, heading, `${slug} article`);
  }
  for (const href of requiredHrefs) {
    assertIncludes(article, href, `${slug} article links`);
  }
}

const homepage = fs.readFileSync(path.resolve('src/pages/china-travel.astro'), 'utf8');
const portalData = fs.readFileSync(path.resolve('src/data/chinaStarterPortal.ts'), 'utf8');
for (const marker of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/do-you-need-cash-in-china-as-a-tourist/',
]) {
  assert.ok(
    homepage.includes(marker) || portalData.includes(marker),
    `homepage payment entry missing: ${marker}`,
  );
}

const travelPage = fs.readFileSync(path.resolve('src/pages/china-travel/travel.astro'), 'utf8');
for (const marker of [
  'Payment planning',
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/can-foreign-credit-cards-work-in-china/',
  '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
]) {
  assert.ok(
    travelPage.includes(marker) || portalData.includes(marker),
    `travel page payment spotlight missing: ${marker}`,
  );
}

console.log('chinaTravel payment cluster tests passed');
