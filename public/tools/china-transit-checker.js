// 240-hour China visa-free transit self-check logic.
// Source basis: National Immigration Administration (Exit and Entry Administration of P.R. China), Nov. 3, 2025 notice.

export const officialSources = [
  {
    label: 'National Immigration Administration: 240-hour visa-free transit conditions and eligible ports',
    url: 'https://en.nia.gov.cn/n147418/n147468/c187308/content.html',
    authority: 'National Immigration Administration, Exit and Entry Administration of P.R. China',
    lastChecked: '2026-06-02',
  },
  {
    label: 'Chinese Government Portal: China widens visa-free access in latest opening-up move',
    url: 'https://english.www.gov.cn/news/202511/04/content_WS69094ae0c6d00ca5f9a07472.html',
    authority: 'The State Council, The People\'s Republic of China',
    lastChecked: '2026-06-02',
  },
];

export const eligibleCountries = [
  'Albania', 'Argentina', 'Australia', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
  'Brazil', 'Brunei', 'Bulgaria', 'Canada', 'Chile', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
  'Indonesia', 'Ireland', 'Italy', 'Japan', 'Latvia', 'Lithuania',
  'Luxembourg', 'Malta', 'Mexico', 'Monaco', 'Montenegro', 'Netherlands', 'New Zealand',
  'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
];

export function normalizeCountry(country) {
  return String(country || '')
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ');
}

const countryAliases = new Map([
  ['usa', 'united states'],
  ['us', 'united states'],
  ['u.s.', 'united states'],
  ['u.s.a.', 'united states'],
  ['america', 'united states'],
  ['uk', 'united kingdom'],
  ['u.k.', 'united kingdom'],
  ['britain', 'united kingdom'],
  ['great britain', 'united kingdom'],
  ['uae', 'united arab emirates'],
  ['south korea', 'south korea'],
  ['korea', 'south korea'],
  ['the netherlands', 'netherlands'],
]);

export function isEligibleCountry(country) {
  const normalized = normalizeCountry(country);
  const canonical = countryAliases.get(normalized) || normalized;
  return eligibleCountries.some((item) => normalizeCountry(item) === canonical);
}

export function evaluateTransitEligibility(input = {}) {
  const blockers = [];
  const warnings = [];
  const positives = [];

  if (!isEligibleCountry(input.nationality)) {
    blockers.push('Your passport country is not on the official 55-country eligible-country list in this MVP. Check the official NIA page before making plans.');
  } else {
    positives.push('Your passport country appears on the official 55-country list for the 240-hour visa-free transit policy.');
  }

  if (input.passportValidity !== 'yes') {
    blockers.push('The official rule requires a valid international travel document with at least 3 months of validity.');
  } else {
    positives.push('You selected that your travel document has at least 3 months of validity.');
  }

  if (input.routeType !== 'third-region') {
    blockers.push('The route must be transit to a third country or region. Simple round trips such as Country A → China → Country A usually do not meet this transit condition.');
  } else {
    positives.push('Your route is marked as transit to a third country or region.');
  }

  if (input.onwardTicket !== 'yes') {
    blockers.push('The official rule requires interline tickets or other proof documents with confirmed arrangements and departure dates within 240 hours.');
  } else {
    positives.push('You selected that you have a confirmed onward ticket or proof document.');
  }

  const stayHours = Number(input.stayHours);
  if (!Number.isFinite(stayHours) || stayHours <= 0) {
    warnings.push('Enter your planned stay length in hours. The official stay period is no more than 240 hours and is calculated from 0:00 on the day after entry.');
  } else if (stayHours > 240) {
    blockers.push('Your planned stay is over 240 hours. The official policy says no more than 240 hours.');
  } else {
    positives.push('Your planned stay is within 240 hours. Remember the official calculation starts from 0:00 on the day after entry.');
  }

  if (input.portEligible !== 'yes') {
    blockers.push('You must apply at one of the official eligible ports and stay within the permitted area. This MVP does not replace the official port and area list.');
  } else {
    positives.push('You selected that your entry port and stay area match the official eligible port and permitted-area list.');
  }

  if (input.purpose !== 'transit-tourism') {
    blockers.push('Tourism, business, visits, and family visits are generally covered; work, study, and news reporting require the appropriate visa or prior approval.');
  } else {
    positives.push('Your stated purpose is within the ordinary transit/tourism/business/visit use cases described by the official notice.');
  }

  let status = 'likely';
  if (blockers.length > 0) {
    status = blockers.some((item) => item.includes('eligible-country list')) ? 'check-official' : 'not-likely';
  } else if (warnings.length > 0) {
    status = 'check-official';
  }

  return { status, positives, blockers, warnings };
}

function renderResult(result) {
  const resultBox = document.querySelector('[data-result]');
  if (!resultBox) return;

  const labels = {
    likely: {
      title: 'Likely meets the core official conditions',
      className: 'result-card result-likely',
      note: 'This is not a final immigration decision. Print or save the official NIA page and confirm your route, port, and permitted stay area before booking.',
    },
    'check-official': {
      title: 'Needs official confirmation',
      className: 'result-card result-check',
      note: 'Some inputs are missing or not clearly covered by this MVP. Use the official links below as the final source of truth.',
    },
    'not-likely': {
      title: 'Not likely based on the selected answers',
      className: 'result-card result-not',
      note: 'Based on your answers, at least one core condition is not met. Check whether another China visa-free policy or a regular visa applies to you.',
    },
  };

  const meta = labels[result.status] || labels['check-official'];
  const list = (title, items, className) => items.length
    ? `<div class="result-list ${className}"><strong>${title}</strong><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul></div>`
    : '';

  resultBox.className = meta.className;
  resultBox.innerHTML = `
    <p class="eyebrow">Self-check result</p>
    <h2>${meta.title}</h2>
    <p>${meta.note}</p>
    ${list('What looks good', result.positives, 'positive')}
    ${list('What needs attention', [...result.blockers, ...result.warnings], 'attention')}
  `;
}

function readForm(form) {
  const data = new FormData(form);
  return {
    nationality: data.get('nationality'),
    routeType: data.get('routeType'),
    onwardTicket: data.get('onwardTicket'),
    stayHours: data.get('stayHours'),
    passportValidity: data.get('passportValidity'),
    portEligible: data.get('portEligible'),
    purpose: data.get('purpose'),
  };
}

export function initChinaTransitChecker() {
  const form = document.querySelector('[data-transit-form]');
  const countrySelect = document.querySelector('[data-country-select]');
  if (!form || !countrySelect) return;

  countrySelect.innerHTML = '<option value="">Select your passport country</option>' + eligibleCountries
    .map((country) => `<option value="${country}">${country}</option>`)
    .join('');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderResult(evaluateTransitEligibility(readForm(form)));
  });

  renderResult({
    status: 'check-official',
    positives: [],
    blockers: [],
    warnings: ['Fill out the form to run a cautious self-check against the official core conditions.'],
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initChinaTransitChecker);
}
