// WeChat Pay foreign-card failure diagnosis.
// Deterministic, browser-only: no network calls, no storage, no card data.
// Policy numbers verified against site guides citing People's Bank of China guidance
// and Tencent's 2026 inbound-payment announcement. Confirm live numbers in the app.

const MESSAGE_CAUSE = {
  unsupported: 'unsupported-card',
  identity: 'verification',
  limit: 'limit',
  bank: 'bank',
  silent: 'silent',
};

const CAUSE_PRIORITY = [
  'not-linked',
  'unsupported-card',
  'verification',
  'limit',
  'bank',
  'silent',
  'flow',
];

const LIMITED_NETWORKS = ['amex', 'unionpay', 'unsure'];
const QR_DIRECTION_STEP =
  'Ask the cashier to try the other QR direction — scan their code or let them scan yours. Stop after one change if people are waiting.';

function networkNote(card) {
  if (card === 'visa' || card === 'mastercard') {
    return 'Your card is on the usual app-linking path, so the issuer or this specific flow is the more likely blocker.';
  }
  if (card === 'unsure') {
    return 'You are not sure which network the card uses, so check the card front before assuming it is supported.';
  }
  return `${card === 'amex' ? 'Amex' : 'UnionPay'} is not a guaranteed app-linking route — the network itself may be the blocker.`;
}

function flowNote(where) {
  if (where === 'miniapp') {
    return 'Mini-program checkouts and QR menus mix ordering, identity, and payment in one flow, so a failure can come from any step.';
  }
  if (where === 'app') {
    return 'Ride-hailing and delivery apps settle through their own merchant account, not the shop QR you just used.';
  }
  if (where === 'all') {
    return 'Failing in every flow points to the account or issuer, not one merchant QR.';
  }
  return 'This merchant’s QR path may not suit your linked account, even though the same card works elsewhere.';
}

const CAUSES = {
  'not-linked': {
    title: 'No active card is linked to WeChat Pay',
    summary: 'Setup comes before any counter fix.',
    detail: () =>
      'You selected “not linked yet”. A visitor needs a working card route for almost every WeChat Pay purchase, so the failure happens before the network is even tested. Link a supported card and finish the identity checks first.',
  },
  'unsupported-card': {
    title: 'The card is not accepted in this payment flow',
    summary: 'This is a support or flow problem, not necessarily a bad card.',
    detail: (a) =>
      `A “card not supported” message points to issuer, country, network, or current app rules. ${networkNote(a.card)} Visa and Mastercard are the usual app-linking routes, Amex and UnionPay are more often terminal-first, and JCB depends on the issuer. A card that clears a counter can still fail in a mini program.`,
  },
  verification: {
    title: 'A verification step is still unfinished',
    summary: 'An identity check is the most likely blocker.',
    detail: () =>
      'Real-name verification and card linking are separate checks. A card can be visible in your wallet while a passport, SMS, or bank approval step is still open. Finish those steps at home, where your phone number and bank app still work.',
  },
  limit: {
    title: 'A spending limit was reached',
    summary: 'A ceiling or fee tier is the most likely blocker.',
    detail: () =>
      'People’s Bank of China guidance sets USD 5,000 per transaction and USD 50,000 per year for foreign-card payments through WeChat Pay and Alipay, and your bank’s daily cap usually binds first. Separately, roughly 3% applies above ¥200. Confirm the live limits and fee notice in the app and with your bank.',
  },
  bank: {
    title: 'Your bank declined the transaction',
    summary: 'The issuer is the most likely point of refusal.',
    detail: () =>
      'Your card issuer controls final approval. An overseas payment can be flagged as fraud, need a one-time SMS or app approval, or hit a daily cap. Check your bank alerts and approve the transaction before you retry the same QR code.',
  },
  silent: {
    title: 'No clear error: a stale code or weak connection',
    summary: 'A stale payment code or weak data is the most likely cause.',
    detail: () =>
      'When WeChat shows nothing specific, the failure is often a payment code that expired before the scanner read it, weak mobile data, or a page that did not refresh. This is the cheapest problem to fix: switch source and refresh once.',
  },
  flow: {
    title: 'The payment flow is the blocker',
    summary: 'The payment path, not the card, is the most likely problem.',
    detail: (a) =>
      `${flowNote(a.where)} Scanning a merchant code, being scanned by the cashier, and paying inside a mini program are different paths. Switching the path often clears a payment without changing anything about the card.`,
  },
};

const FALLBACKS = {
  scan: [
    ['Alipay', 'Usually the fastest switch at a shop counter — link a card there before you travel too.'],
    ['Physical card', 'Works at hotels, malls, and international terminals, but not at QR-only stalls.'],
    ['Cash', 'Covers street food, markets, and moments when both apps fail.'],
  ],
  scanned: [
    ['Alipay', 'A separate app and issuer check may clear the same purchase quickly.'],
    ['Physical card', 'Useful for larger purchases and anywhere a card terminal is available.'],
    ['Cash', 'The last resort when neither app clears and the queue is moving.'],
  ],
  miniapp: [
    ['Pay at the counter', 'Ask staff to move the order out of the mini program — faster than retrying the same flow.'],
    ['Alipay', 'An independent app and merchant route may clear the same order.'],
    ['Cash', 'A small backup for a small order when neither app works.'],
  ],
  app: [
    ['Confirm the order first', 'Check the ride or delivery status before paying again, so you do not pay twice.'],
    ['Switch the method in-app', 'Use Alipay or a second linked card inside the ride-hailing or delivery app.'],
    ['Settle at a desk', 'For hotels and large tickets, pay with a physical card at the front desk.'],
  ],
  all: [
    ['Alipay', 'Independent app and issuer checks — try it once before giving up on app payments.'],
    ['Physical card', 'Your reliable route at hotels, airports, malls, and card terminals.'],
    ['Cash', 'The only method that depends on no app, signal, or issuer approval.'],
  ],
};

const LINKS = [
  {
    label: 'Tencent — Weixin Pay guide for overseas users',
    href: 'https://pay.weixin.qq.com/index.php/public/wechat_guide/overseas_users',
    external: true,
  },
  {
    label: 'Tencent — inbound payment updates (APEC 2026)',
    href: 'https://www.tencent.com/en-us/articles/2202338.html',
    external: true,
  },
  {
    label: 'Chinese Government — Guide to Payment Services in China',
    href: 'https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html',
    external: true,
  },
  {
    label: 'WeChat Pay setup guide',
    href: '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  },
  {
    label: 'When WeChat Pay fails',
    href: '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
  },
  { label: 'Official source library', href: '/china-travel/sources/' },
];

export function diagnoseWeChatPay(answers = {}) {
  const a = {
    card: answers.card || 'unsure',
    linked: answers.linked || 'not-linked',
    where: answers.where || 'all',
    message: answers.message || 'silent',
  };

  const found = [];
  const add = (id) => {
    if (!found.includes(id)) found.push(id);
  };

  if (a.linked === 'not-linked') add('not-linked');
  if (a.linked === 'rejected') add('unsupported-card');
  add(MESSAGE_CAUSE[a.message] || 'unsupported-card');
  if (LIMITED_NETWORKS.includes(a.card)) add('unsupported-card');
  if (a.where === 'miniapp' || a.where === 'app' || a.where === 'all') add('flow');
  if ((a.where === 'scan' || a.where === 'scanned') && (a.message === 'silent' || a.message === 'bank')) {
    add('silent');
  }
  if (a.message === 'limit') add('bank');

  found.sort((x, y) => CAUSE_PRIORITY.indexOf(x) - CAUSE_PRIORITY.indexOf(y));
  const causes = found.slice(0, 2);
  const primary = causes[0];

  const steps = [];
  const step = (text) => {
    if (!steps.includes(text)) steps.push(text);
  };

  if (primary === 'not-linked') {
    step('Open your wallet or payment settings in WeChat and link a supported international card — Visa and Mastercard are the usual app-linking routes.');
    step('Finish every passport, SMS, and bank approval step the app asks for while your home number and bank app still work.');
  } else if (primary === 'unsupported-card') {
    step('Check the card-support notice inside WeChat Pay, then try a second card — preferably Visa or Mastercard — before concluding that all foreign cards are blocked.');
    step(
      causes.includes('verification')
        ? 'Finish the passport or SMS verification the app requests, then re-link the card once.'
        : 'Ask your issuer whether it allows card-linked payments in China; one phone call beats repeated QR attempts.'
    );
  } else if (primary === 'verification') {
    step('Complete the passport and SMS verification the app requests, using a phone number that can still receive codes.');
    step('Re-check that the card is still listed in your wallet after verification; re-link it once if the app dropped it.');
  } else if (primary === 'limit') {
    step('Check the cap shown in the app and your bank daily limit; split the purchase or use the physical card if you are near either ceiling.');
    step('Keep one small test payment to confirm the card still clears at the lower, typically fee-free tier.');
  } else if (primary === 'bank') {
    step('Check your bank alerts and approve the overseas transaction in your bank app or by phone before retrying.');
    step('Tell the issuer you are traveling in China so the next attempt is not flagged as fraud.');
  } else {
    step('Switch from Wi-Fi to mobile data (or the reverse), reopen WeChat, and refresh the payment code once.');
    step(QR_DIRECTION_STEP);
  }

  if (a.where === 'miniapp') {
    step('Leave and reopen the mini program once; if payment still fails, ask staff to move the order to a cashier checkout.');
  }
  if (a.where === 'app') {
    step('Confirm the order status before retrying, then switch the payment method inside the ride-hailing or delivery app.');
  }
  if (a.where === 'scan' || a.where === 'scanned') step(QR_DIRECTION_STEP);
  if (a.where === 'all') {
    step('Stop retrying WeChat Pay this session — an account-wide or issuer-wide block needs your bank or app support, not another QR code.');
  }

  step('Run one small test payment of ¥200 or less at a QR merchant; it isolates the issuer approval from the purchase amount and the fee tier.');
  step('If the queue is moving, stop debugging and use the backup order below.');

  return {
    answers: a,
    causes,
    summary: CAUSES[primary].summary,
    steps: steps.slice(0, 5),
    fallbacks: FALLBACKS[a.where] || FALLBACKS.all,
    links: LINKS,
  };
}

function renderResult(result) {
  const box = document.querySelector('[data-wechat-result]');
  if (!box) return;

  const causesHTML = result.causes
    .map((id, index) => {
      const cause = CAUSES[id];
      return `<li class="dx-item${index === 0 ? ' is-primary' : ''}">
        <p class="dx-item-title">${cause.title}</p>
        <p class="dx-item-detail">${cause.detail(result.answers)}</p>
      </li>`;
    })
    .join('');

  const stepsHTML = result.steps
    .map((text, index) => `<li class="dx-step"><span class="dx-step-num">${index + 1}</span><span>${text}</span></li>`)
    .join('');

  const fallbacksHTML = result.fallbacks
    .map(
      ([title, note]) => `<li class="dx-fallback">
        <span class="dx-fallback-title">${title}</span>
        <span class="dx-fallback-note">${note}</span>
      </li>`
    )
    .join('');

  const linksHTML = result.links
    .map(
      (link) =>
        `<a href="${link.href}"${link.external ? ' target="_blank" rel="noreferrer"' : ''}>${link.label}</a>`
    )
    .join('');

  box.classList.remove('result-placeholder');
  box.classList.add('result-diagnosis');
  box.innerHTML = `
    <p class="eyebrow">Your diagnosis</p>
    <h2 class="result-heading">${result.summary}</h2>
    <p class="result-summary">Ranked from the four symptoms you selected. Your bank and the notices inside WeChat remain the final authority.</p>
    <div class="dx-block">
      <p class="dx-label">Most likely causes</p>
      <ul class="dx-list">${causesHTML}</ul>
    </div>
    <div class="dx-block">
      <p class="dx-label">Try in this order</p>
      <ul class="dx-list">${stepsHTML}</ul>
    </div>
    <div class="dx-block">
      <p class="dx-label">If it still fails</p>
      <ul class="dx-list">${fallbacksHTML}</ul>
    </div>
    <div class="dx-block">
      <p class="dx-label">Check before you travel</p>
      <div class="dx-links">${linksHTML}</div>
    </div>
    <button type="button" class="button-ghost" data-reset>Start over</button>
    <p class="dx-note">Policy figures are verified from published guidance; confirm current limits, fees, and card support on official channels.</p>
  `;
}

export function initChinaWeChatPayFixer() {
  const form = document.querySelector('[data-wechat-form]');
  const box = document.querySelector('[data-wechat-result]');
  if (!form || !box) return;

  const placeholderHTML = box.innerHTML;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    renderResult(
      diagnoseWeChatPay({
        card: data.get('card'),
        linked: data.get('linked'),
        where: data.get('where'),
        message: data.get('message'),
      })
    );
  });

  box.addEventListener('click', (event) => {
    if (!event.target || !event.target.closest('[data-reset]')) return;
    form.reset();
    box.classList.add('result-placeholder');
    box.classList.remove('result-diagnosis');
    box.innerHTML = placeholderHTML;
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initChinaWeChatPayFixer);
}
