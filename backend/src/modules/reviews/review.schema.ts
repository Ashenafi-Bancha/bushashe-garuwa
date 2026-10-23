import { z } from 'zod';
import { optionalText, text } from '../shared/schemas.js';

/** A guest's words in each language: English is required, the others fall back to it */
export const ReviewWords = z.object({
  en: text(1200),
  am: optionalText(1200),
  wol: optionalText(1200),
});

/** Body of POST /api/v1/reviews/admin and PUT /api/v1/reviews/admin/:id */
export const SaveReview = z.object({
  name: text(80),
  /** where the guest came from: a town, a country, a school… */
  origin: optionalText(80),
  words: ReviewWords,
  /** stars, 1 to 5, or none */
  rating: z.number().int().min(1).max(5).nullable().default(null),
  published: z.boolean().default(true),
});
export type SaveReview = z.infer<typeof SaveReview>;

export type Review = {
  id: number;
  name: string;
  origin: string | null;
  words: { en: string; am?: string; wol?: string };
  rating: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};
