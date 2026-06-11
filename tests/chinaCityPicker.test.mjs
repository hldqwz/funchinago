import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { recommendCities } from '../public/tools/china-city-picker.js';

const raw = JSON.parse(readFileSync(new URL('../src/data/chinaCities.json', import.meta.url), 'utf8'));
const cities = raw.cities;
assert.ok(Array.isArray(cities), 'cities must be an array');
assert.ok(cities.length >= 30, `Expected >=30 cities, got ${cities.length}`);

const requiredFields = ['id', 'name', 'pinyin', 'province', 'tagline', 'description', 'bestFor', 'articles', 'tags'];
for (const city of cities) {
  for (const field of requiredFields) {
    assert.ok(city[field] !== undefined, `${city.id} must have field: ${field}`);
  }
  assert.ok(Array.isArray(city.tags), `${city.id} tags must be array`);
  assert.ok(city.tags.length >= 3, `${city.id} needs >=3 tags`);
  assert.ok(Array.isArray(city.bestFor), `${city.id} bestFor must be array`);
  assert.ok(Array.isArray(city.articles), `${city.id} articles must be array`);
}

const ids = new Set(cities.map((c) => c.id));
assert.ok(ids.has('beijing'), 'must include Beijing');
assert.ok(ids.has('shanghai'), 'must include Shanghai');
assert.ok(ids.has('chengdu'), 'must include Chengdu');
assert.ok(ids.has('chongqing'), 'must include Chongqing');
assert.ok(ids.has('xian'), 'must include Xi\'an');
assert.ok(ids.has('guilin'), 'must include Guilin');
assert.ok(ids.has('guangzhou'), 'must include Guangzhou');

// No duplicate IDs
assert.strictEqual(ids.size, cities.length, 'All city IDs must be unique');
// All tags must be from the known set
const validTags = new Set([
  'history', 'culture', 'modern', 'nature', 'food',
  'ancient', 'unesco', 'skyline', 'mountain', 'coastal',
  'tropical', 'water-town', 'ethnic', 'winter', 'summer', 'beach',
  'first-trip-friendly', 'english-friendly', 'easy-nav', 'international',
  'spicy-food', 'mild-food', 'seafood', 'street-food', 'vegetarian-friendly',
  'pandas', 'tea', 'ski', 'hot-spring', 'nightlife', 'shopping',
  'family', 'romantic', 'photography', 'budget', 'luxury', 'spring', 'autumn',
]);
for (const city of cities) {
  for (const tag of city.tags) {
    assert.ok(validTags.has(tag), `${city.id} has unknown tag: ${tag}`);
  }
}

console.log(`Data: ${cities.length} cities, all valid`);

// ── recommendCities with tag-based scoring ──

const cultureFirst = recommendCities({
  interests: ['culture'],
  firstTrip: 'yes',
  englishComfort: 'english-friendly',
  foodPref: 'any',
  vibePreference: 'urban',
  stayLength: 'medium',
});

assert.ok(Array.isArray(cultureFirst), 'recommendCities must return array');
assert.ok(cultureFirst.length >= 3, `Expected >=3 results, got ${cultureFirst.length}`);
assert.ok(cultureFirst[0].score >= cultureFirst[1].score, 'Sorted by score desc');
assert.ok(cultureFirst[0].score >= cultureFirst[2].score, 'Sorted by score desc');
for (const rec of cultureFirst.slice(0, 5)) {
  assert.ok(typeof rec.score === 'number', `${rec.id} score must be number`);
  assert.ok(typeof rec.match === 'string', `${rec.id} must have match`);
}

// Culture + history interest → Beijing should rank very high
const cultureIds = cultureFirst.slice(0, 3).map((r) => r.id);
const hasBeijing = cultureIds.includes('beijing');
assert.ok(hasBeijing, `Culture-first should rank Beijing in top 3, got: ${cultureIds}`);

// Food + spicy → Chengdu or Chongqing high
const foodSpicy = recommendCities({
  interests: ['food'],
  firstTrip: 'no',
  englishComfort: 'comfortable',
  foodPref: 'spicy',
  vibePreference: 'mixed',
  stayLength: 'long',
});
const foodTop = foodSpicy.slice(0, 3).map((r) => r.id);
assert.ok(foodTop.includes('chengdu') || foodTop.includes('chongqing'),
  `Food+spicy should include Chengdu/Chongqing, got: ${foodTop}`);

// Nature → Guilin or Zhangjiajie high
const natureLover = recommendCities({
  interests: ['nature'],
  firstTrip: 'yes',
  englishComfort: 'apps',
  foodPref: 'mild',
  vibePreference: 'nature',
  stayLength: 'medium',
});
const natureTop = natureLover.slice(0, 2).map((r) => r.id);
assert.ok(natureTop.some((id) => ['guilin', 'zhangjiajie'].includes(id)),
  `Nature should include Guilin/Zhangjiajie, got: ${natureTop}`);

// Short stay + English-friendly → Shanghai #1
const shortStay = recommendCities({
  interests: ['modern'],
  firstTrip: 'yes',
  englishComfort: 'english-friendly',
  foodPref: 'mild',
  vibePreference: 'urban',
  stayLength: 'short',
});
const shortTop = shortStay[0].id;
assert.ok(['shanghai', 'beijing'].includes(shortTop),
  `Short+English-friendly should rank Shanghai or Beijing #1, got: ${shortTop}`);

// Modern interest → modern cities top
const modern = recommendCities({
  interests: ['modern'],
  firstTrip: 'yes',
  englishComfort: 'comfortable',
  foodPref: 'any',
  vibePreference: 'urban',
  stayLength: 'medium',
});
const modernTop3 = modern.slice(0, 3).map((r) => r.id);
const modernCities = ['shanghai', 'shenzhen', 'chongqing', 'guangzhou', 'hangzhou'];
assert.ok(modernTop3.some((id) => modernCities.includes(id)),
  `Modern should include a modern city, got: ${modernTop3}`);

// All interests → diverse top 3
const allIn = recommendCities({
  interests: ['culture', 'modern', 'food', 'nature'],
  firstTrip: 'yes',
  englishComfort: 'apps',
  foodPref: 'any',
  vibePreference: 'mixed',
  stayLength: 'medium',
});
const allTopIds = allIn.slice(0, 3).map((r) => r.id);
assert.ok(new Set(allTopIds).size >= 2, `Top 3 should have >=2 different cities, got: ${allTopIds}`);

// No results should have same score but be truncated — all should appear
const empty = recommendCities({
  interests: ['culture'],
  firstTrip: 'yes',
  englishComfort: 'comfortable',
  foodPref: 'any',
  vibePreference: 'mixed',
  stayLength: 'medium',
});
assert.ok(empty.length >= 10, `Should return many results, got ${empty.length}`);

console.log('chinaCityPicker tests passed');
