// China Travel Checklist Generator
// Generates a personalized pre-travel checklist based on trip profile.

export const checklistItems = [
  // ── Documents & Entry ──
  {
    id: 'passport-validity',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Check your passport has at least 6 months of validity beyond your planned stay.',
    show: () => true,
    article: null,
  },
  {
    id: 'visa-free-check',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Check whether your passport qualifies for visa-free entry or 240-hour visa-free transit.',
    show: () => true,
    article: '/china-travel/articles/china-visa-free-travel-guide/',
  },
  {
    id: 'arrival-card',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Fill out the online arrival card before departure (NIA official channel).',
    show: () => true,
    article: null,
    sourceUrl: 'https://s.nia.gov.cn/ArrivalCardFillingPC/',
  },
  {
    id: 'hotel-foreigner',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Confirm your hotel or accommodation can register foreign guests.',
    show: () => true,
    article: null,
  },
  {
    id: 'passport-copies',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Keep printed and digital copies of your passport, visa (if applicable), and hotel bookings.',
    show: () => true,
    article: null,
  },

  // ── Payment ──
  {
    id: 'alipay-setup',
    category: 'Payment',
    priority: 'must',
    text: 'Download Alipay, register with your phone number, and link an international bank card.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  },
  {
    id: 'wechat-setup',
    category: 'Payment',
    priority: 'must',
    text: 'Download WeChat, set up WeChat Pay, and link a card as a backup payment method.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  },
  {
    id: 'payment-test',
    category: 'Payment',
    priority: 'must',
    text: 'Test mobile payment with a small transaction before you fly. Do not wait until arrival.',
    show: ({ paymentReady }) => paymentReady !== 'yes',
    article: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    id: 'cash-backup',
    category: 'Payment',
    priority: 'must',
    text: 'Bring some RMB cash or exchange at the airport as a backup. Not everywhere accepts foreign cards.',
    show: () => true,
    article: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    id: 'bank-notify',
    category: 'Payment',
    priority: 'nice',
    text: 'Notify your bank of travel to China so your cards are not blocked.',
    show: () => true,
    article: null,
  },

  // ── Internet & Apps ──
  {
    id: 'esim',
    category: 'Internet & Apps',
    priority: 'must',
    text: 'Buy and activate an eSIM for China before departure, or plan to get a SIM at the airport.',
    show: ({ internetReady }) => internetReady !== 'yes',
    article: '/china-travel/articles/best-esim-for-china-travel-internet-access/',
  },
  {
    id: 'vpn',
    category: 'Internet & Apps',
    priority: 'must',
    text: 'Install a VPN before departure if you need to access Google, WhatsApp, Instagram, or Gmail.',
    show: ({ internetReady }) => internetReady !== 'yes',
    article: '/china-travel/articles/do-you-need-a-vpn-in-china-travel/',
  },
  {
    id: 'essential-apps',
    category: 'Internet & Apps',
    priority: 'must',
    text: 'Download these apps: Alipay, WeChat, a map app, a translation app (or your preferred tool), and Didi or a ride-hailing alternative.',
    show: () => true,
    article: '/china-travel/articles/best-apps-for-traveling-in-china/',
  },
  {
    id: 'offline-maps',
    category: 'Internet & Apps',
    priority: 'must',
    text: 'Download offline maps and save your hotel address in Chinese characters.',
    show: () => true,
    article: '/china-travel/articles/best-apps-for-traveling-in-china/',
  },
  {
    id: 'screenshot-confirmations',
    category: 'Internet & Apps',
    priority: 'must',
    text: 'Screenshot hotel confirmations, visa or transit documents, and key QR codes before travel.',
    show: ({ tripStage }) => tripStage === 'flying-soon',
    article: null,
  },

  // ── Transport ──
  {
    id: 'train-tickets',
    category: 'Transport',
    priority: 'must',
    text: 'Book high-speed train tickets in advance via Trip.com or 12306. Enter passport details carefully.',
    show: ({ trainTravel }) => trainTravel === 'yes',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },
  {
    id: 'train-app',
    category: 'Transport',
    priority: 'nice',
    text: 'Download the 12306 or Trip.com app and save your ticket confirmation.',
    show: ({ trainTravel }) => trainTravel === 'yes' || trainTravel === 'maybe',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },
  {
    id: 'airport-transfer',
    category: 'Transport',
    priority: 'must',
    text: 'Research how to get from the airport to your hotel: metro, airport express, Didi, or hotel shuttle.',
    show: () => true,
    article: null,
  },
  {
    id: 'station-time',
    category: 'Transport',
    priority: 'must',
    text: 'For high-speed trains: arrive at the station at least 45–60 minutes before departure. Stations are large and security takes time.',
    show: ({ trainTravel }) => trainTravel === 'yes',
    article: '/china-travel/articles/how-to-book-high-speed-train-tickets-china-foreigner/',
  },

  // ── Packing ──
  {
    id: 'power-adapter',
    category: 'Packing',
    priority: 'must',
    text: 'Bring a universal power adapter. China uses Type A, C, and I sockets (220V).',
    show: () => true,
    article: null,
  },
  {
    id: 'medication',
    category: 'Packing',
    priority: 'must',
    text: 'Pack any personal medication in original packaging with a prescription note if possible.',
    show: () => true,
    article: null,
  },
  {
    id: 'walking-shoes',
    category: 'Packing',
    priority: 'nice',
    text: 'Pack comfortable walking shoes. Chinese cities involve a lot of walking and long station corridors.',
    show: () => true,
    article: null,
  },
  {
    id: 'toilet-paper',
    category: 'Packing',
    priority: 'nice',
    text: 'Carry a small pack of tissues when out — not all public restrooms provide toilet paper.',
    show: () => true,
    article: null,
  },

  // ── Before departure ──
  {
    id: 'emergency-contacts',
    category: 'Before Departure',
    priority: 'must',
    text: 'Save emergency contacts: your country\'s embassy in China, China emergency numbers (Police 110, Ambulance 120, Fire 119), and China Immigration Service Hotline 12367.',
    show: () => true,
    article: null,
  },
  {
    id: 'entry-requirements',
    category: 'Before Departure',
    priority: 'must',
    text: 'Double-check the latest China entry requirements: customs declaration, health declaration (if any), and arrival card.',
    show: ({ tripStage }) => tripStage === 'flying-soon' || tripStage === 'booked',
    article: null,
    sourceUrl: 'https://en.nia.gov.cn/',
  },
  {
    id: 'holiday-check',
    category: 'Before Departure',
    priority: 'nice',
    text: 'Check whether your travel dates overlap with major Chinese holidays. Train stations, attractions, and hotels will be extremely crowded.',
    show: ({ tripStage }) => tripStage !== 'thinking',
    article: null,
  },
  {
    id: 'itinerary',
    category: 'Before Departure',
    priority: 'must',
    text: 'Plan a realistic itinerary. One city per 3–4 days is better than rushing through 4 cities in a week.',
    show: ({ routeType }) => routeType === 'multi-city',
    article: null,
  },

  // ── Transit-specific ──
  {
    id: 'transit-route',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Confirm your route meets the third-country/region rule: Country A → China → Country B. Round trips are usually not covered.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
  {
    id: 'transit-ticket',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Have a confirmed onward ticket with a departure date within 240 hours. Print it or save it offline.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
  {
    id: 'transit-port',
    category: 'Documents & Entry',
    priority: 'must',
    text: 'Check your entry port is on the official 65-port list and you stay within the permitted area for that port.',
    show: ({ routeType }) => routeType === 'transit',
    article: '/china-travel/articles/china-240-hour-visa-free-transit/',
  },
];

export function generateChecklist(profile) {
  const triaged = {
    must: [],
    nice: [],
    'official-check': [],
  };

  const sources = [];

  for (const item of checklistItems) {
    if (!item.show(profile)) continue;

    triaged[item.priority].push({
      id: item.id,
      category: item.category,
      text: item.text,
      article: item.article || null,
      sourceUrl: item.sourceUrl || null,
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

  return {
    profile,
    triaged,
    relatedGuides,
    sources,
    counts,
  };
}

// ── Render ──

function renderChecklist(result) {
  const target = document.querySelector('[data-checklist-result]');
  if (!target) return;

  const { triaged, relatedGuides, sources, counts } = result;

  const section = (label, items, className) => {
    if (!items.length) return '';
    return `
      <section class="cl-section ${className}">
        <h2>${label} <span>${items.length} item${items.length > 1 ? 's' : ''}</span></h2>
        <ul>
          ${items.map((item) => `
            <li>
              <span class="cl-cat">${item.category}</span>
              <p>${item.text}</p>
              <div class="cl-links">
                ${item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" rel="noreferrer" class="cl-source-link">Official source</a>` : ''}
                ${item.article ? `<a href="${item.article}" class="cl-guide-link">Read guide</a>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  };

  target.innerHTML = `
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

// ── Form binding ──

function readForm(form) {
  const fd = new FormData(form);
  return {
    tripStage: fd.get('tripStage'),
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const profile = readForm(form);
    const result = generateChecklist(profile);
    renderChecklist(result);
  });

  // Show initial state
  const profile = readForm(form);
  const result = generateChecklist(profile);
  renderChecklist(result);
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initChecklistGenerator);
}
