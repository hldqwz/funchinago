import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlesDir = path.resolve('src/content/china-travel');
const sourcePath = path.resolve('src/data/chinaTravelSources.json');
const portalDataPath = path.resolve('src/data/chinaStarterPortal.ts');
const sources = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const sourceIds = new Set(sources.sources.map((source) => source.id));
const validSections = new Set(['start-here', 'travel', 'cities', 'life-culture', 'tools']);
const portalData = fs.readFileSync(portalDataPath, 'utf8');
const expectedPortalSlugs = ['start-here', 'travel', 'cities', 'life-culture', 'tools'];
const beijingGuideFile = 'beijing-travel-guide-first-time-visitors.md';
const beijingGuidePath = path.join(articlesDir, beijingGuideFile);
const beijingGuideHref = '/china-travel/articles/beijing-travel-guide-first-time-visitors/';
const xianGuideFile = 'xian-travel-guide-first-time-visitors.md';
const xianGuidePath = path.join(articlesDir, xianGuideFile);
const xianGuideHref = '/china-travel/articles/xian-travel-guide-first-time-visitors/';
const knownPortalHrefs = new Set([
  '/china-travel/',
  '/china-travel/start-here/',
  '/china-travel/travel/',
  '/china-travel/cities/',
  '/china-travel/life-culture/',
  '/china-travel/tools/',
  '/china-travel/sources/',
  '/tools/china-transit-checker/',
  '/tools/china-travel-checklist/',
  '/tools/china-city-picker/',
]);

function readExportedArray(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*as const;`));
  assert.ok(match, `${exportName} must be exported as a const array`);
  return Function(`"use strict"; return (${match[1]});`)();
}

const portalSections = readExportedArray(portalData, 'portalSections');
assert.deepEqual(
  portalSections.map((section) => section.slug),
  expectedPortalSlugs,
  'china starter portal data must expose all ordered portal section slugs',
);

for (const section of portalSections) {
  assert.equal(typeof section.title, 'string', `portal section ${section.slug} must include a title`);
  assert.ok(section.title.length > 0, `portal section ${section.slug} title must not be empty`);
  assert.equal(typeof section.href, 'string', `portal section ${section.slug} must include an href`);
  assert.ok(knownPortalHrefs.has(section.href), `portal section ${section.slug} href must point to a real current route`);
  assert.equal(typeof section.eyebrow, 'string', `portal section ${section.slug} must include an eyebrow`);
  assert.ok(section.eyebrow.length > 0, `portal section ${section.slug} eyebrow must not be empty`);
  assert.equal(typeof section.description, 'string', `portal section ${section.slug} must include a description`);
  assert.ok(section.description.length > 0, `portal section ${section.slug} description must not be empty`);
  assert.equal(typeof section.image, 'string', `portal section ${section.slug} must include an image`);
  assert.ok(section.image.startsWith('/'), `portal section ${section.slug} image must be an absolute site path`);
}

const startHereCards = readExportedArray(portalData, 'startHereCards');
assert.ok(startHereCards.length >= 2, 'china starter portal data should define at least two start-here cards');

for (const card of startHereCards) {
  assert.equal(typeof card.title, 'string', 'start-here card title must be a string');
  assert.ok(card.title.length > 0, 'start-here card title must not be empty');
  assert.equal(typeof card.text, 'string', 'start-here card text must be a string');
  assert.ok(card.text.length > 0, 'start-here card text must not be empty');
  assert.equal(typeof card.href, 'string', 'start-here card href must be a string');
  assert.match(
    card.href,
    /^\/china-travel\/articles\/[a-z0-9-]+\/$/,
    'article-based start-here cards must point to current article routes',
  );
  if ('label' in card) {
    assert.equal(typeof card.label, 'string', 'start-here card label must be a string');
    assert.ok(card.label.length > 0, 'start-here card label must not be empty');
  }
  if ('image' in card) {
    assert.equal(typeof card.image, 'string', 'start-here card image must be a string');
    assert.ok(card.image.startsWith('/'), 'start-here card image must be a site path');
  }
  if ('alt' in card) {
    assert.equal(typeof card.alt, 'string', 'start-here card alt must be a string');
    assert.ok(card.alt.length > 0, 'start-here card alt must not be empty');
  }
}

const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
assert.ok(files.length >= 12, 'China Travel should have at least 12 starter articles after the second batch');
assert.ok(files.includes(beijingGuideFile), 'China Travel must include the Beijing first-time visitor guide');
assert.ok(files.includes(xianGuideFile), "China Travel must include the Xi'an first-time visitor guide");

function readFrontmatter(file) {
  const text = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${file} must include frontmatter`);
  return match[1];
}

function extractInlineArray(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`));
  if (!match) return null;
  return match[1]
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function extractYamlList(frontmatter, key) {
  const inlineItems = extractInlineArray(frontmatter, key);
  if (inlineItems) return inlineItems;

  const match = frontmatter.match(new RegExp(`${key}:\\s*\\n((?:\\s+-\\s+.*\\n?)*)`));
  if (!match) return null;

  return match[1]
    .split('\n')
    .map((line) => line.match(/^\s+-\s+(.*)$/)?.[1] ?? '')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

for (const file of files) {
  const frontmatter = readFrontmatter(file);
  for (const required of ['title:', 'description:', 'stage:', 'section:', 'updatedAt:', 'hero_image:', 'officialSources:']) {
    assert.ok(frontmatter.includes(required), `${file} missing ${required}`);
  }

  const sectionMatch = frontmatter.match(/section:\s*"([^"]+)"/);
  assert.ok(sectionMatch, `${file} must include a quoted section`);
  assert.ok(validSections.has(sectionMatch[1]), `${file} has invalid section: ${sectionMatch[1]}`);

  const heroMatch = frontmatter.match(/hero_image:\s*"([^"]+)"/);
  assert.ok(heroMatch, `${file} must include a quoted hero_image`);
  const heroPath = path.resolve('public', heroMatch[1].replace(/^\//, ''));
  assert.ok(fs.existsSync(heroPath), `${file} hero image does not exist: ${heroMatch[1]}`);

  if (file === 'shanghai-travel-guide-first-time-visitors.md') {
    assert.ok(
      frontmatter.includes('hero_alt: "Shanghai skyline seen from the Bund across the Huangpu River"'),
      'Shanghai guide should use a specific hero image alt text',
    );
  }

  const officialSources = extractYamlList(frontmatter, 'officialSources');
  if (officialSources) {
    assert.ok(officialSources.length > 0, `${file} should cite at least one source id`);
    for (const id of officialSources) {
      assert.ok(sourceIds.has(id), `${file} cites unknown source id: ${id}`);
    }
  }
}

const beijingGuide = fs.readFileSync(beijingGuidePath, 'utf8');
const beijingBody = beijingGuide.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const beijingWords = beijingBody
  .replace(/<[^>]+>/g, ' ')
  .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
  .match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
assert.ok(
  beijingWords.length >= 2300 && beijingWords.length <= 3000,
  `Beijing guide should contain 2,300-3,000 English words; found ${beijingWords.length}`,
);

for (const heading of [
  '## Quick Answer',
  '## Why Beijing Matters on a First China Trip',
  '## Who Should Visit Beijing?',
  '## How Many Days Do You Need in Beijing?',
  '## Best Time to Visit Beijing',
  '## Best Things to Do in Beijing',
  '## A Realistic Four-Day Beijing Itinerary',
  '## What to Eat in Beijing',
  '## Where to Stay in Beijing',
  '## Practical Tips: Reservations, Passport, Metro, Payment and Language',
  '## Common Mistakes First-Time Visitors Make in Beijing',
  '## Beijing vs Shanghai, Chengdu and Guangzhou',
  '## What Visitors Often Miss About Beijing',
  '## Check Official Sources Before You Travel',
  '## Final Thoughts',
]) {
  assert.ok(beijingGuide.includes(heading), `Beijing guide missing required heading: ${heading}`);
}

for (const image of [
  'beijing-forbidden-city-hero.jpg',
  'beijing-great-wall-mutianyu.jpg',
  'beijing-hutong.jpg',
  'beijing-temple-of-heaven.jpg',
  'beijing-jingshan-view.jpg',
]) {
  assert.ok(
    fs.existsSync(path.resolve('public/china-travel/images', image)),
    `Beijing guide image is missing: ${image}`,
  );
}

const bodyImages = [...beijingGuide.matchAll(/<img\s+[^>]*src="(\/china-travel\/images\/beijing-[^"]+)"[^>]*>/g)];
assert.ok(bodyImages.length >= 4, 'Beijing guide must include at least four real body images');
for (const [, src] of bodyImages) {
  const tag = bodyImages.find((match) => match[1] === src)?.[0] ?? '';
  assert.match(tag, /\balt="[^"]+"/, `${src} must include descriptive alt text`);
  assert.match(tag, /\bloading="lazy"/, `${src} must lazy-load in the article body`);
  assert.match(tag, /\bwidth="\d+"/, `${src} must include a width attribute`);
  assert.match(tag, /\bheight="\d+"/, `${src} must include a height attribute`);
}

for (const href of [
  '/tools/china-city-picker/',
  '/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/',
  '/china-travel/articles/best-places-to-visit-in-china-first-time/',
  '/china-travel/articles/china-travel-checklist-before-you-fly/',
  '/china-travel/articles/how-to-pay-in-china-tourist/',
  '/china-travel/articles/best-apps-for-traveling-in-china/',
  '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  '/china-travel/articles/china-240-hour-visa-free-transit/',
]) {
  assert.ok(beijingGuide.includes(`](${href})`), `Beijing guide must link to ${href}`);
}

for (const referringFile of [
  'beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first.md',
  'best-places-to-visit-in-china-first-time.md',
  'ten-days-in-china-first-time-itinerary.md',
]) {
  const referringContent = fs.readFileSync(path.join(articlesDir, referringFile), 'utf8');
  assert.ok(
    referringContent.includes(beijingGuideHref),
    `${referringFile} must link back to the Beijing guide`,
  );
}

const xianGuide = fs.readFileSync(xianGuidePath, 'utf8');
const xianBody = xianGuide.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const xianWords = xianBody
  .replace(/<[^>]+>/g, ' ')
  .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
  .match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
assert.ok(
  xianWords.length >= 2300 && xianWords.length <= 3200,
  `Xi'an guide should contain 2,300-3,200 English words; found ${xianWords.length}`,
);

for (const heading of [
  '## Quick Answer',
  "## Why Xi'an Belongs on a First China Trip",
  "## Who Should Visit Xi'an?",
  "## How Many Days Do You Need in Xi'an?",
  "## Best Time to Visit Xi'an",
  "## Best Things to Do in Xi'an",
  "## A Realistic Three-Day Xi'an Itinerary",
  "## What to Eat in Xi'an",
  "## Where to Stay in Xi'an",
  '## Practical Tips: Reservations, Transport, Payment and Language',
  "## Common Mistakes First-Time Visitors Make in Xi'an",
  "## Xi'an vs Beijing, Shanghai, Chengdu and Guangzhou",
  "## What Visitors Often Miss About Xi'an",
  '## Check Official Sources Before You Travel',
  '## Final Thoughts',
]) {
  assert.ok(xianGuide.includes(heading), `Xi'an guide missing required heading: ${heading}`);
}

for (const image of [
  'xian-bell-tower-night.jpg',
  'xian-terracotta-warriors.jpg',
  'xian-city-wall.jpg',
  'xian-muslim-quarter.jpg',
  'xian-giant-wild-goose-pagoda.jpg',
]) {
  assert.ok(
    fs.existsSync(path.resolve('public/china-travel/images', image)),
    `Xi'an guide image is missing: ${image}`,
  );
}

const xianBodyImages = [...xianGuide.matchAll(/<img\s+[^>]*src="(\/china-travel\/images\/xian-[^"]+)"[^>]*>/g)];
assert.ok(xianBodyImages.length >= 4, "Xi'an guide must include at least four real body images");
for (const match of xianBodyImages) {
  const tag = match[0];
  assert.match(tag, /\balt="[^"]+"/, `${match[1]} must include descriptive alt text`);
  assert.match(tag, /\bloading="lazy"/, `${match[1]} must lazy-load in the article body`);
  assert.match(tag, /\bwidth="\d+"/, `${match[1]} must include a width attribute`);
  assert.match(tag, /\bheight="\d+"/, `${match[1]} must include a height attribute`);
}

for (const referringFile of [
  'beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first.md',
  'best-places-to-visit-in-china-first-time.md',
  'ten-days-in-china-first-time-itinerary.md',
]) {
  const referringContent = fs.readFileSync(path.join(articlesDir, referringFile), 'utf8');
  assert.ok(referringContent.includes(xianGuideHref), `${referringFile} must link back to the Xi'an guide`);
}

console.log('chinaTravel article tests passed');
