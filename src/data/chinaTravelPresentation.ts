export const travelStageLabels = {
  discover: 'Explore',
  before: 'Before You Go',
  'in-china': 'While You Are in China',
} as const;

export type TravelStage = keyof typeof travelStageLabels;

export function formatTravelStage(stage: TravelStage) {
  return travelStageLabels[stage];
}

export const travelArticleGroups = [
  {
    id: 'payments',
    title: 'Payments in China',
    description: 'Set up a primary payment app, understand cards and cash, and keep a checkout backup ready.',
    primarySlug: 'how-to-pay-in-china-tourist',
    slugs: [
      'how-to-pay-in-china-tourist',
      'how-to-use-alipay-in-china-foreigner',
      'how-to-use-wechat-pay-in-china-foreigner',
      'wechat-pay-vs-alipay-for-tourists-china',
      'can-you-use-apple-pay-or-google-pay-in-china',
      'can-foreign-credit-cards-work-in-china',
      'do-you-need-cash-in-china-as-a-tourist',
      'alipay-not-working-in-china-foreign-tourists',
      'wechat-pay-not-working-in-china-foreigners',
    ],
  },
  {
    id: 'internet-apps',
    title: 'Internet and Essential Apps',
    description: 'Prepare mobile data, maps, translation, communication, and the apps that keep the trip moving.',
    primarySlug: 'best-apps-for-traveling-in-china',
    slugs: [
      'best-apps-for-traveling-in-china',
      'best-esim-for-china-travel-internet-access',
      'do-you-need-a-vpn-in-china-travel',
    ],
  },
  {
    id: 'entry-documents',
    title: 'Entry and Documents',
    description: 'Check entry rules, transit eligibility, documents, and the practical setup to finish before departure.',
    primarySlug: 'china-travel-checklist-before-you-fly',
    slugs: [
      'china-travel-checklist-before-you-fly',
      'china-visa-free-travel-guide',
      'china-240-hour-visa-free-transit',
      'china-travel-mistakes-first-trip',
    ],
  },
  {
    id: 'trains-routes',
    title: 'Trains and Routes',
    description: 'Book high-speed trains and turn city ideas into a realistic first-trip route.',
    primarySlug: 'how-to-book-high-speed-train-tickets-china-foreigner',
    slugs: [
      'how-to-book-high-speed-train-tickets-china-foreigner',
      'ten-days-in-china-first-time-itinerary',
    ],
  },
] as const;
