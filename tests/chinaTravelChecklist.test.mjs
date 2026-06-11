import assert from 'node:assert/strict';
import { generateChecklist } from '../public/tools/china-travel-checklist.js';

// Full profile — should get many must-dos
const full = generateChecklist({
  tripStage: 'booked',
  stayLength: 'medium',
  routeType: 'multi-city',
  paymentReady: 'no',
  internetReady: 'no',
  trainTravel: 'yes',
});

assert.ok(full.counts.total > 15, `Expected >15 items, got ${full.counts.total}`);
assert.ok(full.counts.must > 10, `Expected >10 must items, got ${full.counts.must}`);
assert.ok(full.triaged.must.length > 0, 'Should have must-do items');
assert.ok(full.relatedGuides.length >= 3, `Expected >=3 related guides, got ${full.relatedGuides.length}`);

// Payment-ready profile — no payment setup items
const paymentReady = generateChecklist({
  tripStage: 'booked',
  stayLength: 'medium',
  routeType: 'multi-city',
  paymentReady: 'yes',
  internetReady: 'no',
  trainTravel: 'yes',
});

const hasPaymentSetup = paymentReady.triaged.must.concat(paymentReady.triaged.nice)
  .some((item) => item.id === 'alipay-setup' || item.id === 'wechat-setup');
assert.equal(hasPaymentSetup, false, 'Payment-ready profile should not include payment setup items');

// Internet-ready profile — no internet items
const internetReady = generateChecklist({
  tripStage: 'booked',
  stayLength: 'medium',
  routeType: 'multi-city',
  paymentReady: 'no',
  internetReady: 'yes',
  trainTravel: 'yes',
});

const hasInternetSetup = internetReady.triaged.must.concat(internetReady.triaged.nice)
  .some((item) => item.id === 'esim' || item.id === 'vpn');
assert.equal(hasInternetSetup, false, 'Internet-ready profile should not include eSIM or VPN items');

// No train travel — no train items
const noTrain = generateChecklist({
  tripStage: 'booked',
  stayLength: 'medium',
  routeType: 'one-city',
  paymentReady: 'yes',
  internetReady: 'yes',
  trainTravel: 'no',
});

const hasTrainItems = noTrain.triaged.must.concat(noTrain.triaged.nice)
  .some((item) => item.category === 'Transport' && (item.id === 'train-tickets' || item.id === 'station-time'));
assert.equal(hasTrainItems, false, 'No-train profile should not include train ticket or station items');

// Transit profile — should have transit-specific items
const transit = generateChecklist({
  tripStage: 'flying-soon',
  stayLength: 'short',
  routeType: 'transit',
  paymentReady: 'yes',
  internetReady: 'yes',
  trainTravel: 'no',
});

const hasTransit = transit.triaged.must
  .some((item) => item.id === 'transit-route' || item.id === 'transit-ticket' || item.id === 'transit-port');
assert.ok(hasTransit, 'Transit profile should include transit-specific items');

// Flying-soon profile — should have screenshot confirmations
const flyingSoon = generateChecklist({
  tripStage: 'flying-soon',
  stayLength: 'medium',
  routeType: 'multi-city',
  paymentReady: 'yes',
  internetReady: 'yes',
  trainTravel: 'no',
});

const hasScreenshots = flyingSoon.triaged.must
  .some((item) => item.id === 'screenshot-confirmations');
assert.ok(hasScreenshots, 'Flying-soon profile should include screenshot-confirmations item');

// Thinking stage — fewer items overall
const thinking = generateChecklist({
  tripStage: 'thinking',
  stayLength: 'medium',
  routeType: 'multi-city',
  paymentReady: 'no',
  internetReady: 'no',
  trainTravel: 'maybe',
});

assert.ok(thinking.counts.total < full.counts.total, 'Thinking stage should have fewer items than booked stage');

console.log('chinaTravelChecklist tests passed');
