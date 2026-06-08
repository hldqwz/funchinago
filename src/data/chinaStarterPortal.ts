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

export const featuredCity = {
  city: 'Guangzhou',
  eyebrow: 'This week',
  title: 'Try Guangzhou first if you travel for food.',
  text: 'A warm, great-value tier-1 city with Cantonese breakfast, old neighborhoods, river walks, markets, and an easier pace than Beijing or Shanghai.',
  href: '/china-travel/articles/guangzhou-travel-guide-first-time-visitors/',
  image: '/china-travel/images/article-weekly-guangzhou.jpg',
} as const;
