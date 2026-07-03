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
  'How to Use WeChat Pay in China as a Foreigner: Setup, Cards and Common Problems',
  'wechat article',
);
assertFrontmatterValue(
  wechat,
  'description',
  'Foreign tourists can often use WeChat Pay in China with an international card, but setup, verification, card support, and QR-code payments can still fail. Here is what to prepare and what to do when it does not work.',
  'wechat article',
);
for (const heading of [
  '## Can Foreigners Use WeChat Pay in China?',
  '## How to Set Up WeChat Pay Before You Travel',
  '## WeChat Pay Not Working in China: What to Do',
  '## WeChat Pay vs Alipay for Foreign Tourists',
  '## Do You Still Need Cash If You Have WeChat Pay?',
  '## FAQ',
]) {
  assertIncludes(wechat, heading, 'wechat article');
}
for (const href of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
  '/china-travel/articles/best-apps-for-traveling-in-china/',
  '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
]) {
  assertIncludes(wechat, href, 'wechat article links');
}

const alipay = readArticle('how-to-use-alipay-in-china-foreigner');
assertFrontmatterValue(
  alipay,
  'title',
  'How to Use Alipay in China as a Foreigner: Setup, Cards and Tourist Tips',
  'alipay article',
);
assertFrontmatterValue(
  alipay,
  'description',
  'Alipay is often the easiest payment app for foreign tourists in China. Learn how to set it up, link an international card, avoid common failures, and prepare backup payment options.',
  'alipay article',
);
for (const heading of [
  '## Is Alipay Easier Than WeChat Pay for Foreign Tourists?',
  '## Should You Set Up Alipay Before Arriving in China?',
  '## Alipay Not Working in China: Common Reasons',
  '## What to Do If Alipay Fails at a Shop or Restaurant',
  '## FAQ',
]) {
  assertIncludes(alipay, heading, 'alipay article');
}
for (const href of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
  '/china-travel/sources/',
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
    'Alipay Not Working in China for Foreign Tourists: Common Fixes and Backup Options',
    '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  ],
  [
    'wechat-pay-not-working-in-china-foreigners',
    'WeChat Pay Not Working in China for Foreigners: What to Try First',
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

const alipayFail = readArticle('alipay-not-working-in-china-foreign-tourists');
for (const heading of [
  '## If Alipay Fails at a Restaurant',
  '## If Alipay Fails in a Convenience Store',
  '## If Alipay Fails When Taking a Taxi or Didi',
  '## What a Local Would Usually Do',
]) {
  assertIncludes(alipayFail, heading, 'alipay fail article');
}

const wechatFail = readArticle('wechat-pay-not-working-in-china-foreigners');
for (const heading of [
  '## If WeChat Pay Fails at a Shop Counter',
  '## If WeChat Pay Fails in a Restaurant QR Menu',
  '## If WeChat Pay Fails When Using a Mini Program',
  '## What a Local Would Usually Do',
]) {
  assertIncludes(wechatFail, heading, 'wechat fail article');
}

const paymentHub = readArticle('how-to-pay-in-china-tourist');
assertFrontmatterValue(
  paymentHub,
  'title',
  'How to Pay in China as a Tourist: Alipay, WeChat Pay, Cards and Cash',
  'payment hub',
);
assertFrontmatterValue(
  paymentHub,
  'description',
  'Most tourists in China should prepare Alipay first, WeChat Pay as backup, one physical card, and a small amount of cash. Learn what works, what fails, and what to do when payment apps do not work.',
  'payment hub',
);
assertIncludes(paymentHub, 'If payment fails', 'payment hub');
assertIncludes(paymentHub, 'Compare Alipay and WeChat Pay', 'payment hub');
for (const heading of [
  '## Quick Answer',
  '## The Safest Payment Setup Before You Fly',
  '## Alipay vs WeChat Pay: Which One Should Tourists Prepare First?',
  '## Can You Use Apple Pay or Google Pay in China?',
  '## Can Foreign Credit Cards Work in China?',
  '## When Cash Still Helps',
  '## What to Do When Payment Fails',
  '## Common Mistakes',
  '## Official Sources to Check Before You Travel',
  '## Related Payment Guides',
]) {
  assertIncludes(paymentHub, heading, 'payment hub structure');
}
for (const href of [
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  '/china-travel/articles/best-apps-for-traveling-in-china/',
  '/china-travel/articles/china-travel-mistakes-first-trip/',
  '/china-travel/sources/',
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
    'Does Apple Pay or Google Pay Work in China? What Tourists Should Know',
    [
      '/china-travel/articles/how-to-pay-in-china-tourist/',
      '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
      '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
      '/china-travel/articles/can-foreign-credit-cards-work-in-china/',
      '/china-travel/articles/do-you-need-cash-in-china-as-a-tourist/',
      '/china-travel/articles/china-travel-checklist-before-you-fly/',
    ],
  ],
  [
    'wechat-pay-vs-alipay-for-tourists-china',
    'WeChat Pay vs Alipay for Tourists in China: Which Should You Set Up First?',
    [
      '/china-travel/articles/how-to-pay-in-china-tourist/',
      '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
      '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
      '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
      '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
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

const apps = readArticle('best-apps-for-traveling-in-china');
const mistakes = readArticle('china-travel-mistakes-first-trip');
const vpn = readArticle('do-you-need-a-vpn-in-china-travel');
const esim = readArticle('best-esim-for-china-travel-internet-access');
for (const [article, label] of [
  [apps, 'best apps article'],
  [mistakes, 'travel mistakes article'],
  [vpn, 'vpn article'],
  [esim, 'esim article'],
]) {
  assertIncludes(article, '## Quick Answer', label);
  for (const href of [
    '/china-travel/articles/how-to-pay-in-china-tourist/',
    '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
    '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  ]) {
    assertIncludes(article, href, `${label} payment links`);
  }
}

const homepage = fs.readFileSync(path.resolve('src/pages/china-travel.astro'), 'utf8');
const portalData = fs.readFileSync(path.resolve('src/data/chinaStarterPortal.ts'), 'utf8');
for (const marker of [
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
  '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
  '/china-travel/articles/wechat-pay-vs-alipay-for-tourists-china/',
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
  '/china-travel/articles/wechat-pay-vs-alipay-for-tourists-china/',
]) {
  assert.ok(
    travelPage.includes(marker) || portalData.includes(marker),
    `travel page payment spotlight missing: ${marker}`,
  );
}

const redirects = fs.readFileSync(path.resolve('public/_redirects'), 'utf8');
for (const rule of [
  '/ /china-travel/ 301',
  'http://funchinago.com/* https://funchinago.com/:splat 301',
  'https://www.funchinago.com/* https://funchinago.com/:splat 301',
]) {
  assertIncludes(redirects, rule, 'redirect rules');
}

const pageFiles = [
  'src/pages/china-travel.astro',
  'src/pages/china-travel/travel.astro',
  'src/pages/china-travel/start-here.astro',
  'src/pages/china-travel/tools.astro',
  'src/pages/china-travel/articles/[slug].astro',
  'src/pages/china-travel/articles/index.astro',
  'src/pages/china-travel/cities.astro',
  'src/pages/china-travel/life-culture.astro',
  'src/pages/china-travel/sources.astro',
  'src/layouts/ChinaTravelLayout.astro',
];
for (const file of pageFiles) {
  const source = fs.readFileSync(path.resolve(file), 'utf8');
  assert.ok(!/letter-spacing:\s*-\d/.test(source), `${file} should not use negative letter spacing`);
}

for (const forbidden of [
  'Search Console',
  'SEO',
  'ranking',
  'trust tests for FunChinaGo',
  'trust test for FunChinaGo',
]) {
  assert.ok(!travelPage.includes(forbidden), `travel page should not include internal ops phrase: ${forbidden}`);
}

console.log('chinaTravel payment cluster tests passed');
