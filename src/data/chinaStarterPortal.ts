export const portalSections = [
  {
    slug: 'start-here',
    title: 'Start Here',
    href: '/china-travel/start-here/',
    eyebrow: 'First step',
    description: 'Begin with the big-picture guides that explain why China is worth the effort and how to choose your first route.',
    image: '/china-travel/images/hero-china-portal-editorial.png',
  },
  {
    slug: 'travel',
    title: 'Travel Basics',
    href: '/china-travel/travel/',
    eyebrow: 'Plan the trip',
    description: 'Handle visas, payments, trains, apps, internet, and the practical setup that makes the trip run smoothly.',
    image: '/china-travel/images/article-checklist-editorial.png',
  },
  {
    slug: 'cities',
    title: 'Cities',
    href: '/china-travel/cities/',
    eyebrow: 'Pick your stops',
    description: 'Compare major China destinations and decide which city mix fits your first visit best.',
    image: '/china-travel/images/article-best-places-editorial.png',
  },
  {
    slug: 'life-culture',
    title: 'Life And Culture',
    href: '/china-travel/life-culture/',
    eyebrow: 'Feel the rhythm',
    description: 'Understand food, daily habits, and the on-the-ground experience that first-time visitors usually notice most.',
    image: '/china-travel/images/start-modern-china-editorial.png',
  },
  {
    slug: 'tools',
    title: 'Tools',
    href: '/china-travel/tools/',
    eyebrow: 'Use the helpers',
    description: 'Jump into the current planning tools for checklists, city picking, and transit screening when you are ready to act.',
    image: '/china-travel/images/article-city-comparison-editorial.png',
  },
] as const;

export const startHereCards = [
  {
    title: 'Plan your first trip',
    href: '/china-travel/articles/china-travel-checklist-before-you-fly/',
    text: 'Entry, payments, apps, internet, trains, and documents in one clean setup guide.',
    label: 'Trip setup',
    image: '/china-travel/images/article-checklist-editorial.png',
    alt: 'Illustrated China travel checklist with documents, apps, and train planning',
  },
  {
    title: 'Choose your first city',
    href: '/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/',
    text: 'Compare the most first-time-friendly cities before you lock your route.',
    label: 'City match',
    image: '/china-travel/images/article-city-comparison-editorial.png',
    alt: 'Illustrated China city picker card with first-time destination choices',
  },
  {
    title: 'Understand modern China',
    href: '/china-travel/articles/what-china-is-really-like-for-first-time-visitors/',
    text: 'Get a quick feel for daily life, speed, food, apps, and city rhythm.',
    label: 'On the ground',
    image: '/china-travel/images/start-modern-china-editorial.png',
    alt: 'Illustrated modern China street scene for first-time visitors',
  },
] as const;

export const homepagePortalOrder = [
  'hero',
  'start-here',
  'cities',
  'life-culture',
  'tools',
  'featured-city',
] as const;

export const cityComparisonCards = [
  {
    city: 'Beijing',
    bestFor: 'History, hutongs, museums, and a classic first China route.',
    pace: 'Big, structured, culture-heavy',
    href: '/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/',
    image: '/china-travel/images/city-beijing-editorial.png',
  },
  {
    city: 'Shanghai',
    bestFor: 'Skylines, design, cafes, easy metro days, and a soft landing.',
    pace: 'Fast, polished, international',
    href: '/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/',
    image: '/china-travel/images/city-shanghai-editorial.png',
  },
  {
    city: 'Chengdu',
    bestFor: 'Pandas, spicy food, tea houses, and slower daily life.',
    pace: 'Relaxed, food-first, local',
    href: '/china-travel/articles/beijing-shanghai-chengdu-or-chongqing-which-city-to-visit-first/',
    image: '/china-travel/images/city-chengdu-editorial.png',
  },
  {
    city: 'Guangzhou',
    bestFor: 'Cantonese food, warm weather, value, markets, and river nights.',
    pace: 'Practical, tropical, delicious',
    href: '/china-travel/articles/guangzhou-travel-guide-first-time-visitors/',
    image: '/china-travel/images/article-weekly-guangzhou.jpg',
  },
] as const;

export const lifeCultureDoorways = [
  {
    theme: 'Food',
    title: 'Eat your way into the culture',
    text: 'Learn what to order, how meals work, and why every city tastes different.',
    href: '/china-travel/articles/what-to-eat-in-china/',
    image: '/china-travel/images/life-food-editorial.png',
  },
  {
    theme: 'Daily Life',
    title: 'Move through China with less friction',
    text: 'Payments, apps, delivery, and transit shape the trip as much as landmarks do.',
    href: '/china-travel/articles/how-to-order-food-in-china-without-speaking-chinese/',
    image: '/china-travel/images/life-daily-editorial.png',
  },
  {
    theme: 'Modern China',
    title: 'Know what will feel different',
    text: 'A practical orientation to the speed, convenience, and surprises visitors notice first.',
    href: '/china-travel/articles/what-china-is-really-like-for-first-time-visitors/',
    image: '/china-travel/images/start-modern-china-editorial.png',
  },
] as const;

export const homepageTools = [
  {
    title: 'Transit self-check',
    href: '/tools/china-transit-checker/',
    text: 'Screen a 240-hour visa-free transit route before you rely on it.',
    image: '/china-travel/images/article-08-240-hour-transit.png',
    label: 'Transit',
  },
  {
    title: 'Travel checklist',
    href: '/tools/china-travel-checklist/',
    text: 'Generate a prep list for your trip stage, cities, payments, internet, and trains.',
    image: '/china-travel/images/article-checklist-editorial.png',
    label: 'Prep',
  },
  {
    title: 'City picker',
    href: '/tools/china-city-picker/',
    text: 'Answer a few questions and get a first-city recommendation.',
    image: '/china-travel/images/article-city-comparison-editorial.png',
    label: 'Cities',
  },
] as const;

export const paymentQuickLinks = [
  {
    eyebrow: 'Payment hub',
    title: 'Start with the full China payment guide',
    text: 'See the safest tourist setup across Alipay, WeChat Pay, cards, and cash before you choose one method.',
    href: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    eyebrow: 'Most searched',
    title: 'Set up Alipay first',
    text: 'For many visitors, Alipay is the easiest first payment app to prepare before arrival.',
    href: '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  },
  {
    eyebrow: 'Backup route',
    title: 'Prepare WeChat Pay too',
    text: 'WeChat often matters when local service flows and mini programs enter the picture.',
    href: '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  },
  {
    eyebrow: 'Arrival safety',
    title: 'Know when cash still helps',
    text: 'A little cash can still save your first day when data, cards, or app linking gets messy.',
    href: '/china-travel/articles/do-you-need-cash-in-china-as-a-tourist/',
  },
  {
    eyebrow: 'Compare apps',
    title: 'Alipay vs WeChat Pay',
    text: 'Decide which payment app to set up first and why most tourists should prepare both.',
    href: '/china-travel/articles/wechat-pay-vs-alipay-for-tourists-china/',
  },
  {
    eyebrow: 'Troubleshooting',
    title: 'Payment not working?',
    text: 'Jump to practical fixes for Alipay or WeChat Pay failures at counters, taxis, and QR menus.',
    href: '/china-travel/articles/alipay-not-working-in-china-foreign-tourists/',
  },
] as const;

export const travelPaymentSpotlight = [
  {
    title: 'How to pay in China as a tourist',
    text: 'Use this as the main decision page before choosing any single payment method.',
    href: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    title: 'Can foreign credit cards work in China?',
    text: 'Set realistic expectations for hotels, malls, contactless terminals, and smaller merchants.',
    href: '/china-travel/articles/can-foreign-credit-cards-work-in-china/',
  },
  {
    title: 'Can you use Apple Pay or Google Pay in China?',
    text: 'Helpful for long-tail searchers comparing contactless wallets with local QR payment apps.',
    href: '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  },
  {
    title: 'WeChat Pay vs Alipay for tourists',
    text: 'Use this comparison when deciding whether to set up Alipay, WeChat Pay, or both before flying.',
    href: '/china-travel/articles/wechat-pay-vs-alipay-for-tourists-china/',
  },
] as const;

export const paymentGuideLinks = [
  {
    title: 'How to Pay in China as a Tourist',
    text: 'The hub for Alipay, WeChat Pay, cards, cash, and payment failures.',
    href: '/china-travel/articles/how-to-pay-in-china-tourist/',
  },
  {
    title: 'Alipay Guide',
    text: 'Set up Alipay first and know where it can still fail.',
    href: '/china-travel/articles/how-to-use-alipay-in-china-foreigner/',
  },
  {
    title: 'WeChat Pay Guide',
    text: 'Prepare WeChat Pay as backup and for mini-program flows.',
    href: '/china-travel/articles/how-to-use-wechat-pay-in-china-foreigner/',
  },
  {
    title: 'Apple Pay / Google Pay Guide',
    text: 'Understand why phone wallets are not enough for daily payments.',
    href: '/china-travel/articles/can-you-use-apple-pay-or-google-pay-in-china/',
  },
  {
    title: 'Payment Not Working Guides',
    text: 'Quick fixes for Alipay and WeChat Pay failures in real checkout situations.',
    href: '/china-travel/articles/wechat-pay-not-working-in-china-foreigners/',
  },
  {
    title: 'Alipay vs WeChat Pay',
    text: 'Choose the first app to set up and prepare the right backup.',
    href: '/china-travel/articles/wechat-pay-vs-alipay-for-tourists-china/',
  },
] as const;

export const featuredCity = {
  city: "Xi'an",
  eyebrow: 'This week',
  title: "This Week's City Pick: Xi'an",
  text: "Xi'an turns ancient China into a walkable first trip: Terracotta Warriors, a complete city wall, noodle shops, mosque lanes, and history that stays alive after dark.",
  href: '/china-travel/articles/xian-travel-guide-first-time-visitors/',
  image: '/china-travel/images/xian-bell-tower-night.jpg',
  alt: "Xi'an Bell Tower glowing at night amid the modern city",
  cta: "Read the Xi'an guide",
} as const;
