import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const portalDataPath = path.resolve('src/data/chinaStarterPortal.ts');
const homepagePath = path.resolve('src/pages/china-travel.astro');
const portalData = fs.readFileSync(portalDataPath, 'utf8');
const homepage = fs.readFileSync(homepagePath, 'utf8');

function readExportedArray(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*as const;`));
  assert.ok(match, `${exportName} must be exported as a const array`);
  return Function(`"use strict"; return (${match[1]});`)();
}

function readExportedObject(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName}\\s*=\\s*(\\{[\\s\\S]*?\\})\\s*as const;`));
  assert.ok(match, `${exportName} must be exported as a const object`);
  return Function(`"use strict"; return (${match[1]});`)();
}

function assertRealRoute(href, label) {
  assert.equal(typeof href, 'string', `${label} href must be a string`);

  if (href.startsWith('/china-travel/articles/') && href !== '/china-travel/articles/') {
    const slug = href.replace('/china-travel/articles/', '').replace(/\/$/, '');
    assert.ok(fs.existsSync(path.resolve('src/content/china-travel', `${slug}.md`)), `${label} points to a missing article: ${href}`);
    return;
  }

  const knownRoutes = new Set([
    '/china-travel/',
    '/china-travel/start-here/',
    '/china-travel/travel/',
    '/china-travel/cities/',
    '/china-travel/life-culture/',
    '/china-travel/tools/',
    '/china-travel/#start-here',
    '/china-travel/#cities',
    '/china-travel/articles/',
    '/tools/china-transit-checker/',
    '/tools/china-travel-checklist/',
    '/tools/china-city-picker/',
  ]);
  assert.ok(knownRoutes.has(href), `${label} must point to a current route or homepage section anchor: ${href}`);
}

function assertImageExists(src, label) {
  assert.equal(typeof src, 'string', `${label} image must be a string`);
  assert.ok(src.startsWith('/china-travel/images/'), `${label} image must live under the China Travel image folder`);
  assert.ok(fs.existsSync(path.resolve('public', src.replace(/^\//, ''))), `${label} image file is missing: ${src}`);
}

const homepagePortalOrder = readExportedArray(portalData, 'homepagePortalOrder');
assert.deepEqual(
  homepagePortalOrder,
  ['hero', 'start-here', 'cities', 'life-culture', 'tools', 'featured-city'],
  'homepage must keep the approved portal-first section order',
);

let previousIndex = -1;
for (const sectionId of homepagePortalOrder) {
  const marker = sectionId === 'hero' ? 'data-portal-section="hero"' : `id="${sectionId}"`;
  const index = homepage.indexOf(marker);
  assert.ok(index > previousIndex, `homepage section ${sectionId} must appear in portal order`);
  previousIndex = index;
}

const startHereCards = readExportedArray(portalData, 'startHereCards');
assert.equal(startHereCards.length, 3, 'homepage Start Here must have exactly three large entry cards');
assert.deepEqual(
  startHereCards.map((card) => card.title),
  ['Plan your first trip', 'Choose your first city', 'Understand modern China'],
  'Start Here cards must route the three approved first-time visitor intents',
);
for (const card of startHereCards) {
  assertRealRoute(card.href, `start-here card ${card.title}`);
  assert.ok(card.text.length <= 150, `start-here card ${card.title} should stay low-density`);
  assert.equal(typeof card.label, 'string', `start-here card ${card.title} must include a label`);
  assert.ok(card.label.length > 0, `start-here card ${card.title} label must not be empty`);
  assert.equal(typeof card.image, 'string', `start-here card ${card.title} must include an image`);
  assert.equal(typeof card.alt, 'string', `start-here card ${card.title} must include alt text`);
  assert.ok(card.alt.length > 0, `start-here card ${card.title} alt text must not be empty`);
  assertImageExists(card.image, `start-here card ${card.title}`);
}

const cityComparisonCards = readExportedArray(portalData, 'cityComparisonCards');
assert.ok(cityComparisonCards.length >= 4, 'cities module must compare at least four first-time city choices');
for (const city of cityComparisonCards) {
  for (const key of ['city', 'bestFor', 'pace', 'href', 'image']) {
    assert.ok(city[key], `city card must include ${key}`);
  }
  assertRealRoute(city.href, `city card ${city.city}`);
  assertImageExists(city.image, `city card ${city.city}`);
  assert.ok(city.bestFor.length <= 80, `city card ${city.city} should use short comparison copy`);
}

const lifeCultureDoorways = readExportedArray(portalData, 'lifeCultureDoorways');
assert.equal(lifeCultureDoorways.length, 3, 'life and culture must have exactly three curated doorways');
assert.deepEqual(
  lifeCultureDoorways.map((doorway) => doorway.theme),
  ['Food', 'Daily Life', 'Modern China'],
  'life and culture doorways must cover food, daily life, and modern China',
);
for (const doorway of lifeCultureDoorways) {
  assertRealRoute(doorway.href, `life doorway ${doorway.theme}`);
  assertImageExists(doorway.image, `life doorway ${doorway.theme}`);
}

const homepageTools = readExportedArray(portalData, 'homepageTools');
assert.equal(homepageTools.length, 3, 'tools module should show the three current China travel tools');
for (const tool of homepageTools) {
  assertRealRoute(tool.href, `tool ${tool.title}`);
  assert.ok(tool.text.length <= 140, `tool ${tool.title} should not dominate the homepage with long copy`);
}

const featuredCity = readExportedObject(portalData, 'featuredCity');
assert.equal(featuredCity.city, 'Chengdu', 'featured city should show Chengdu as the current weekly visual highlight');
assertRealRoute(featuredCity.href, 'featured city');
assertImageExists(featuredCity.image, 'featured city');
assert.match(featuredCity.href, /chengdu-travel-guide-first-time-visitors\/$/, 'featured city should link to the current Chengdu guide');
assert.ok(featuredCity.title.includes('Chengdu'), 'featured city title should name Chengdu');
assert.ok(featuredCity.alt.includes('Chengdu'), 'featured city image alt text should name Chengdu');

console.log('chinaStarterPortalRoutes tests passed');
