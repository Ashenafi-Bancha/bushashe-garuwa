import { z } from 'zod';

/**
 * A content entry is one edited piece of the website: a heading, a paragraph,
 * a phone number, a link. The key is the path in the website's text files,
 * for example `home.hero.title` or `settings.phone`.
 *
 * `lang` is 'en', 'am' or 'wal' for text that differs per language, and '*'
 * for values that are the same in every language (phone number, links, hours).
 */
export const ContentLang = z.enum(['en', 'am', 'wal', '*']);
export type ContentLang = z.infer<typeof ContentLang>;

export const ContentKey = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9_-]+)*$/, 'Use dots between names, for example home.hero.title');

export const SaveContentEntry = z.object({
  key: ContentKey,
  lang: ContentLang,
  value: z.string().max(8000),
});
export type SaveContentEntry = z.infer<typeof SaveContentEntry>;

/** Saving several fields of one page in a single request */
export const SaveContentBatch = z.object({
  entries: z.array(SaveContentEntry).min(1).max(200),
});

export const ContentQuery = z.object({
  lang: ContentLang.optional(),
  /** only keys starting with this, e.g. `?prefix=home.` */
  prefix: z.string().trim().max(120).optional(),
});

export type ContentEntry = {
  key: string;
  lang: ContentLang;
  value: string;
  updatedAt: string;
};
