import assert from 'node:assert/strict';
import {
  eligibleCountries,
  evaluateTransitEligibility,
  normalizeCountry,
} from '../public/tools/china-transit-checker.js';

assert.equal(normalizeCountry('United States'), 'united states');
assert.equal(eligibleCountries.includes('Indonesia'), true, 'Indonesia should be included after the June 12, 2025 official expansion');

const eligible = evaluateTransitEligibility({
  nationality: 'United States',
  routeType: 'third-region',
  onwardTicket: 'yes',
  stayHours: 144,
  passportValidity: 'yes',
  purpose: 'transit-tourism',
  portEligible: 'yes',
});
assert.equal(eligible.status, 'likely');
assert.equal(eligible.blockers.length, 0);

const sameCountry = evaluateTransitEligibility({
  nationality: 'United States',
  routeType: 'round-trip',
  onwardTicket: 'yes',
  stayHours: 120,
  passportValidity: 'yes',
  purpose: 'transit-tourism',
  portEligible: 'yes',
});
assert.equal(sameCountry.status, 'not-likely');
assert.ok(sameCountry.blockers.some((item) => item.includes('third country or region')));

const overLimit = evaluateTransitEligibility({
  nationality: 'Japan',
  routeType: 'third-region',
  onwardTicket: 'yes',
  stayHours: 241,
  passportValidity: 'yes',
  purpose: 'transit-tourism',
  portEligible: 'yes',
});
assert.equal(overLimit.status, 'not-likely');
assert.ok(overLimit.blockers.some((item) => item.includes('240 hours')));

const unsure = evaluateTransitEligibility({
  nationality: 'Peru',
  routeType: 'third-region',
  onwardTicket: 'yes',
  stayHours: 72,
  passportValidity: 'yes',
  purpose: 'transit-tourism',
  portEligible: 'yes',
});
assert.equal(unsure.status, 'check-official');
assert.ok(unsure.blockers.some((item) => item.includes('eligible-country list')));

console.log('chinaTransitPolicy tests passed');
