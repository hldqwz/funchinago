// China Travel Countdown Checklist
// Builds a deadline-aware preparation list from your departure date.
//
// Each item carries `dueDays`: how many days before departure the task should
// be finished. Some are hard deadlines (rail tickets open 15 days ahead on
// 12306); others are buffer for processes that take days (passport renewal,
// card binding, prescription refills).

export const checklistItems = [
  // ── Documents & Entry ──
  {
    id: 'passport-validity',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 90,
    dueNote: 'Renewing a passport takes weeks, and China requires six months of validity beyond your stay.',
    text: 'Check your passport has at least 6 months of validity beyond your planned stay.',
    show: () => true,
    article: null,
  },
  {
    id: 'visa-free-check',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 45,
    dueNote: 'If you need a visa rather than visa-free entry, allow time for the application.',
    text: 'Check whether your passport qualifies for visa-free entry or 240-hour visa-free transit.',
    show: () => true,
    article: '/china-travel/articles/china-visa-free-travel-guide/',
  },
  {
    id: 'arrival-card',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 1,
    dueNote: 'The NIA arrival card can be filed online before you board.',
    text: 'Fill out the online arrival card before departure (NIA official channel).',
    show: () => true,
    article: null,
    sourceUrl: 'https://s.nia.gov.cn/ArrivalCardFillingPC/',
  },
  {
    id: 'hotel-foreigner',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 21,
    dueNote: 'Some properties cannot register foreign guests; you may need to rebook.',
    text: 'Confirm your hotel or accommodation can register foreign guests.',
    show: () => true,
    article: null,
  },
  {
    id: 'passport-copies',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 2,
    text: 'Keep printed and digital copies of your passport, visa (if applicable), and hotel bookings.',
    show: () => true,
    article: null,
  },

  // ── Payment ──
  {
    id: 'alipay-setup',
    category: 'Payment',
    priority: 'must',
    dueDays: 14,
    dueNote: 'Card binding and identity verification are not always instant.',
    text: 'Download Alipay, register with your phone number, and link an international bank card.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  },
  {
    id: 'wechat-setup',
    category: 'Payment',
    priority: 'must',
    dueDays: 14,
    dueNote: 'WeChat Pay sometimes flags new accounts; you want time to retry.',
    text: 'Download WeChat, set up WeChat Pay, and link a card as a backup payment method.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  },
  {
    id: 'payment-test',
    category: 'Payment',
    priority: 'must',
    dueDays: 7,
    dueNote: 'A test transaction that fails leaves you a week to fix it at home, not at a Beijing checkout.',
    text: 'Test mobile payment with a small transaction before you fly. Do not wait until arrival.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    id: 'cash-backup',
    category: 'Payment',
    priority: 'must',
    dueDays: 3,
    text: 'Bring some RMB cash or exchange at the airport as a backup. Not everywhere accepts foreign cards.',
    show: () => true,
    article: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    id: 'bank-notify',
    category: 'Payment',
    priority: 'nice',
    dueDays: 7,
    text: 'Notify your bank of travel to China so your cards are not blocked.',
    show: () => true,
    article: null,
  },

  // ── Internet & Apps ──
  {
    id: 'esim',
    category: 'Internet & Apps',
    priority: 'must',
    dueDays: 5,
    text: 'Buy and activate an eSIM for China before departure, or plan to get a SIM at the airport.',
    show: ({ internetReady }) => internetReady !== 'yes',
    article: '/china-travel/articles/best-esim-for-china-travel-internet-access/',
  },
  {
    id: 'vpn',
    category: 'Internet & Apps',
    priority: 'must',
    dueDays: 7,
    dueNote: 'Install this before you land. App stores for Google services do not work once you are in China.',
    text: 'Install a VPN before departure if you need to access Google, WhatsApp, Instagram, or Gmail.',
    show: ({ internetReady }) => internetReady !== 'yes',
    article: '/china-travel/articles/do-you-need-a-vpn-in-china-travel/',
  },
  {
    id: 'essential-apps',
    category: 'Internet & Apps',
    priority: 'must',
    dueDays: 7,
    text: 'Download these apps: Alipay, WeChat, a map app, a translation app (or your preferred tool), and Didi or a ride-hailing alternative.',
    show: () => true,
    article: '/china-travel/articles/best-apps-for-traveling-in-china/',
  },
  {
    id: 'offline-maps',
    category: 'Internet & Apps',
    priority: 'must',
    dueDays: 2,
    text: 'Download offline maps and save your hotel address in Chinese characters.',
    show: () => true,
    article: '/china-travel/articles/best-apps-for-traveling-in-china/',
  },
  {
    id: 'screenshot-confirmations',
    category: 'Internet & Apps',
    priority: 'must',
    dueDays: 1,
    text: 'Screenshot hotel confirmations, visa or transit documents, and key QR codes before travel.',
    show: ({ tripStage }) => tripStage === 'flying-soon',
    article: null,
  },

  // ── Transport ──
  {
    id: 'train-tickets',
    category: 'Transport',
    priority: 'must',
    dueDays: 15,
    dueNote: 'This is a hard deadline. China Railway opens sales 15 days ahead including the travel day, and popular trains sell out in minutes.',
    text: 'Book high-speed train tickets in advance via Trip.com or 12306. Enter passport details carefully.',
    show: ({ trainTravel }) => trainTravel === 'yes',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },
  {
    id: 'train-app',
    category: 'Transport',
    priority: 'nice',
    dueDays: 16,
    dueNote: 'A day before tickets go on sale, so passport verification does not eat your booking window.',
    text: 'Download the 12306 or Trip.com app and save your ticket confirmation.',
    show: ({ trainTravel }) => trainTravel === 'yes' || trainTravel === 'maybe',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },
  {
    id: 'airport-transfer',
    category: 'Transport',
    priority: 'must',
    dueDays: 3,
    text: 'Research how to get from the airport to your hotel: metro, airport express, Didi, or hotel shuttle.',
    show: () => true,
    article: null,
  },
  {
    id: 'station-time',
    category: 'Transport',
    priority: 'must',
    dueDays: 0,
    dueNote: 'On the travel day itself.',
    text: 'For high-speed trains: arrive at the station at least 45–60 minutes before departure. Stations are large and security takes time.',
    show: ({ trainTravel }) => trainTravel === 'yes',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },

  // ── Packing ──
  {
    id: 'power-adapter',
    category: 'Packing',
    priority: 'must',
    dueDays: 5,
    text: 'Bring a universal power adapter. China uses Type A, C, and I sockets (220V).',
    show: () => true,
    article: null,
  },
  {
    id: 'medication',
    category: 'Packing',
    priority: 'must',
    dueDays: 10,
    dueNote: 'Getting a prescription refilled takes time, and some medicines are restricted on entry.',
    text: 'Pack any personal medication in original packaging with a prescription note if possible.',
    show: () => true,
    article: null,
  },
  {
    id: 'walking-shoes',
    category: 'Packing',
    priority: 'nice',
    dueDays: 3,
    text: 'Pack comfortable walking shoes. Chinese cities involve a lot of walking and long station corridors.',
    show: () => true,
    article: null,
  },
  {
    id: 'toilet-paper',
    category: 'Packing',
    priority: 'nice',
    dueDays: 3,
    text: 'Carry a small pack of tissues when out — not all public restrooms provide toilet paper.',
    show: () => true,
    article: null,
  },

  // ── Before departure ──
  {
    id: 'emergency-contacts',
    category: 'Before Departure',
    priority: 'must',
    dueDays: 2,
    text: 'Save emergency contacts: your country\'s embassy in China, China emergency numbers (Police 110, Ambulance 120, Fire 119), and China Immigration Service Hotline 12367.',
    show: () => true,
    article: null,
  },
  {
    id: 'entry-requirements',
    category: 'Before Departure',
    priority: 'must',
    dueDays: 7,
    text: 'Double-check the latest China entry requirements: customs declaration, health declaration (if any), and arrival card.',
    show: ({ tripStage }) => tripStage === 'flying-soon' || tripStage === 'booked',
    article: null,
    sourceUrl: 'https://en.nia.gov.cn/',
  },
  {
    id: 'holiday-check',
    category: 'Before Departure',
    priority: 'nice',
    dueDays: 45,
    dueNote: 'Hotel prices climb well ahead of Golden Week and Spring Festival.',
    text: 'Check whether your travel dates overlap with major Chinese holidays. Train stations, attractions, and hotels will be extremely crowded.',
    show: ({ tripStage }) => tripStage !== 'thinking',
    article: null,
  },
  {
    id: 'itinerary',
    category: 'Before Departure',
    priority: 'must',
    dueDays: 30,
    text: 'Plan a realistic itinerary. One city per 3–4 days is better than rushing through 4 cities in a week.',
    show: ({ routeType }) => routeType === 'multi-city',
    article: null,
  },

  // ── Transit-specific ──
  {
    id: 'transit-route',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 45,
    dueNote: 'You may need to change your flights if the routing does not qualify.',
    text: 'Confirm your route meets the third-country/region rule: Country A → China → Country B. Round trips are usually not covered.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
  {
    id: 'transit-ticket',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 21,
    text: 'Have a confirmed onward ticket with a departure date within 240 hours. Print it or save it offline.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
  {
    id: 'transit-port',
    category: 'Documents & Entry',
    priority: 'must',
    dueDays: 45,
    text: 'Check your entry port is on the official 65-port list and you stay within the permitted area for that port.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
];

// ── Date helpers ──

function toDateValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysUntil(departureDateStr) {
  if (!departureDateStr) return null;
  const target = new Date(`${departureDateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  return Math.round((target - startOfToday()) / 86400000);
}

// Derive the planning stage from how close departure is, so the date input
// replaces the old stage question without losing its effect on the list.
function stageFromDays(days) {
  if (days === null) return 'booked';
  if (days <= 14) return 'flying-soon';
  if (days <= 120) return 'booked';
  return 'thinking';
}

// ── Core generator ──

export function generateChecklist(profile, departureDateStr) {
  const daysLeft = daysUntil(departureDateStr);

  const effectiveProfile = departureDateStr
    ? { ...profile, tripStage: stageFromDays(daysLeft) }
    : profile;

  const triaged = {
    must: [],
    nice: [],
    'official-check': [],
  };

  const sources = [];

  for (const item of checklistItems) {
    if (!item.show(effectiveProfile)) continue;

    triaged[item.priority].push({
      id: item.id,
      category: item.category,
      priority: item.priority,
      text: item.text,
      article: item.article || null,
      sourceUrl: item.sourceUrl || null,
      dueDays: item.dueDays ?? null,
      dueNote: item.dueNote || null,
    });

    if (item.sourceUrl) {
      const exists = sources.find((s) => s.url === item.sourceUrl);
      if (!exists) {
        sources.push({
          label: item.text,
          url: item.sourceUrl,
        });
      }
    }
  }

  const relatedGuides = [
    ...new Set(
      triaged.must.concat(triaged.nice).concat(triaged['official-check'])
        .filter((item) => item.article)
        .map((item) => item.article)
    ),
  ];

  const counts = {
    must: triaged.must.length,
    nice: triaged.nice.length,
    officialCheck: triaged['official-check'].length,
    total: triaged.must.length + triaged.nice.length + triaged['official-check'].length,
  };

  const result = {
    profile: effectiveProfile,
    triaged,
    relatedGuides,
    sources,
    counts,
  };

  if (daysLeft !== null) {
    result.countdown = buildCountdown(triaged.must.concat(triaged.nice), daysLeft, departureDateStr);
  }

  return result;
}

// Split items into what is already due, what opens soon, and what can wait.
// Sorted by the tightest deadline first, so the list reads top-down as a queue.
function buildCountdown(items, daysLeft, departureDateStr) {
  const decorated = items.map((item) => {
    const slack = (item.dueDays ?? 0) - daysLeft;
    return {
      ...item,
      slack,
      status: slack >= 0 ? 'now' : slack >= -14 ? 'soon' : 'later',
    };
  });

  const pick = (status) =>
    decorated
      .filter((item) => item.status === status)
      .sort((a, b) => a.slack - b.slack);

  return {
    departureDate: departureDateStr,
    daysLeft,
    hasDeparted: daysLeft < 0,
    now: pick('now'),
    soon: pick('soon'),
    later: pick('later'),
  };
}

// ── Render ──

function itemMarkup(item) {
  const parts = [];
  if (item.sourceUrl) {
    parts.push(`<a href="${item.sourceUrl}" target="_blank" rel="noreferrer" class="cl-source-link">Official source</a>`);
  }
  if (item.article) {
    parts.push(`<a href="${item.article}" class="cl-guide-link">Read guide</a>`);
  }
  return parts.join('');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The actual calendar date a task should be finished by, worked back from
// departure. A deadline is easier to act on than a day count.
function dueDateLabel(departureDateStr, dueDays) {
  const d = new Date(`${departureDateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() - (dueDays ?? 0));
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function countdownItemMarkup(item, daysLeft, departureDate) {
  const slack = item.slack;
  const dueLabel = dueDateLabel(departureDate, item.dueDays);

  let badge;
  if (slack === 0) {
    badge = '<span class="cl-due-tag is-now">Due today</span>';
  } else if (slack > 0) {
    badge = dueLabel
      ? `<span class="cl-due-tag is-overdue">Was due ${dueLabel}</span>`
      : '<span class="cl-due-tag is-overdue">Overdue</span>';
  } else if (dueLabel) {
    badge = `<span class="cl-due-tag">Due ${dueLabel}</span>`;
  } else {
    badge = `<span class="cl-due-tag">T-${item.dueDays ?? 0}</span>`;
  }

  return `
    <li>
      <div class="cl-item-head">
        <span class="cl-cat">${item.category}</span>
        ${badge}
      </div>
      <p>${item.text}</p>
      ${item.dueNote ? `<p class="cl-due-note">${item.dueNote}</p>` : ''}
      ${itemMarkup(item) ? `<div class="cl-links">${itemMarkup(item)}</div>` : ''}
    </li>
  `;
}

function countdownSection(label, items, daysLeft, departureDate, className, hint) {
  if (!items.length) return '';
  return `
    <section class="cl-section ${className}">
      <h2>${label} <span>${items.length}</span></h2>
      ${hint ? `<p class="cl-section-hint">${hint}</p>` : ''}
      <ul>
        ${items.map((item) => countdownItemMarkup(item, daysLeft, departureDate)).join('')}
      </ul>
    </section>
  `;
}

function renderCountdown(countdown, counts, sources) {
  const { daysLeft, now, soon, later, hasDeparted, departureDate } = countdown;

  let header;
  if (hasDeparted) {
    header = `
      <p class="eyebrow">Your checklist</p>
      <h2>Your departure date has passed</h2>
      <p class="cl-summary">Set a new date to restart the countdown. Everything below still applies.</p>
    `;
  } else if (daysLeft === 0) {
    header = `
      <p class="eyebrow">Departing today</p>
      <h2 class="cl-countdown-number">Today</h2>
      <p class="cl-summary"><span class="cl-badge must">${counts.total} item${counts.total === 1 ? '' : 's'} to prepare</span></p>
    `;
  } else {
    header = `
      <p class="eyebrow">Days until departure</p>
      <h2 class="cl-countdown-number">${daysLeft}</h2>
      <p class="cl-summary">
        <span class="cl-badge must">${now.length} need attention now</span>
        <span class="cl-badge nice">${soon.length} within two weeks</span>
        <span class="cl-badge pending">${later.length} scheduled later</span>
      </p>
    `;
  }

  return `
    <div class="cl-result-header ${hasDeparted ? '' : 'has-count'}">
      ${header}
      <p class="cl-departure-line">Departure date: <strong>${departureDate}</strong></p>
      <p class="cl-disclaimer">Deadlines are practical buffers, except where a hard rule applies — such as rail tickets, which open 15 days ahead. This is preparation guidance, not official travel advice; verify entry, visa, and payment details with the linked official sources.</p>
    </div>
    ${countdownSection('Overdue or due today', now, daysLeft, departureDate, 'cl-must', 'These deadlines have already arrived. Do them first.')}
    ${countdownSection('Due within two weeks', soon, daysLeft, departureDate, 'cl-soon', 'Not urgent yet, but their window opens soon.')}
    ${countdownSection('Scheduled later', later, daysLeft, departureDate, 'cl-later', 'Early-stage tasks you can leave for now.')}

    ${sources.length ? `
      <section class="cl-related">
        <h2>Check official sources</h2>
        <ul>
          ${sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer">${s.label}</a></li>`).join('')}
        </ul>
      </section>
    ` : ''}
  `;
}

function flatItemMarkup(item) {
  return `
    <li>
      <span class="cl-cat">${item.category}</span>
      <p>${item.text}</p>
      ${itemMarkup(item) ? `<div class="cl-links">${itemMarkup(item)}</div>` : ''}
    </li>
  `;
}

function renderFlat(result) {
  const { triaged, relatedGuides, sources, counts } = result;

  const section = (label, items, className) => {
    if (!items.length) return '';
    return `
      <section class="cl-section ${className}">
        <h2>${label} <span>${items.length} item${items.length > 1 ? 's' : ''}</span></h2>
        <ul>${items.map(flatItemMarkup).join('')}</ul>
      </section>
    `;
  };

  return `
    <div class="cl-result-header">
      <p class="eyebrow">Your personalized checklist</p>
      <h2>${counts.total} things to prepare</h2>
      <p class="cl-summary">
        <span class="cl-badge must">${counts.must} must-do</span>
        <span class="cl-badge nice">${counts.nice} nice-to-have</span>
      </p>
      <p class="cl-disclaimer">This is a preparation guide, not official travel advice. Always verify entry, visa, and payment details with the linked official sources before you travel.</p>
    </div>
    ${section('Must do before you fly', triaged.must, 'cl-must')}
    ${section('Nice to prepare', triaged.nice, 'cl-nice')}

    ${relatedGuides.length ? `
      <section class="cl-related">
        <h2>Related guides</h2>
        <ul>
          ${relatedGuides.map((href) => {
            const label = href.replace(/\/china-travel\/articles\//, '').replace(/\/$/, '').replace(/-/g, ' ');
            return `<li><a href="${href}">${label}</a></li>`;
          }).join('')}
        </ul>
      </section>
    ` : ''}

    ${sources.length ? `
      <section class="cl-related">
        <h2>Check official sources</h2>
        <ul>
          ${sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer">${s.label}</a></li>`).join('')}
        </ul>
      </section>
    ` : ''}
  `;
}

function renderChecklist(result) {
  const target = document.querySelector('[data-checklist-result]');
  if (!target) return;

  target.innerHTML = result.countdown
    ? renderCountdown(result.countdown, result.counts, result.sources)
    : renderFlat(result);
}

// ── Form binding ──

function readForm(form) {
  const fd = new FormData(form);
  return {
    departureDate: fd.get('departureDate') || '',
    tripStage: fd.get('tripStage') || 'booked',
    stayLength: fd.get('stayLength'),
    routeType: fd.get('routeType'),
    paymentReady: fd.get('paymentReady'),
    internetReady: fd.get('internetReady'),
    trainTravel: fd.get('trainTravel'),
  };
}

export function initChecklistGenerator() {
  const form = document.querySelector('[data-checklist-form]');
  if (!form) return;

  const dateInput = form.querySelector('[data-departure-input]');
  if (dateInput) {
    const today = startOfToday();
    if (!dateInput.min || dateInput.min === '2026-01-01') {
      dateInput.min = toDateValue(today);
    }
    if (!dateInput.value) {
      const suggested = new Date(today);
      suggested.setDate(suggested.getDate() + 30);
      dateInput.value = toDateValue(suggested);
    }
  }

  const submit = () => {
    const values = readForm(form);
    const profile = {
      tripStage: values.tripStage,
      stayLength: values.stayLength,
      routeType: values.routeType,
      paymentReady: values.paymentReady,
      internetReady: values.internetReady,
      trainTravel: values.trainTravel,
    };
    const result = generateChecklist(profile, values.departureDate);
    renderChecklist(result);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });

  form.addEventListener('change', submit);

  submit();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initChecklistGenerator);
}
