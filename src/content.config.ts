import { defineCollection, z } from 'astro:content';

const chinaTravelCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updatedAt: z.coerce.date(),
    description: z.string(),
    stage: z.enum(['discover', 'before', 'in-china']),
    section: z.enum(['start-here', 'travel', 'cities', 'life-culture', 'tools']),
    tags: z.array(z.string()).default([]),
    hero_image: z.string().optional(),
    hero_alt: z.string().optional(),
    hero_width: z.number().int().positive().optional(),
    hero_height: z.number().int().positive().optional(),
    officialSources: z.array(z.string()).default([]),
    relatedTools: z.array(z.object({
      title: z.string(),
      href: z.string(),
    })).default([]),
  }),
});

export const collections = {
  'china-travel': chinaTravelCollection,
};
