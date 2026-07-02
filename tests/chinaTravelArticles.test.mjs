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

function readFrontmatter(file) {
  const text = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
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

console.log('chinaTravel article tests passed');
