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

console.log('chinaTravelSources registry tests passed');
