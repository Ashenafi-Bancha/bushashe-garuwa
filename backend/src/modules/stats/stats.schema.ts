import { z } from 'zod';

/** Body of POST /api/v1/stats/view: the website telling us a page was opened */
export const PageView = z.object({
  /** the page, e.g. /heritage (no query string, no #part) */
  path: z
    .string()
    .trim()
    .max(200)
    .regex(/^\/[A-Za-z0-9/_-]*$/, 'A page of the website'),
  lang: z.enum(['en', 'am', 'wol']).default('en'),
  /** the address the visit began from (document.referrer of its first page), sent with each page of the visit */
  ref: z.string().trim().max(500).optional(),
  /** a campaign mark in the link they followed: ?ref=qr, ?utm_source=facebook */
  src: z
    .string()
    .trim()
    .max(40)
    .regex(/^[A-Za-z0-9_.-]*$/)
    .optional(),
});
export type PageView = z.infer<typeof PageView>;

/** Query of GET /api/v1/stats/admin */
export const StatsQuery = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export type Device = 'phone' | 'tablet' | 'computer';

export type StatsSummary = {
  days: number;
  from: string;
  to: string;
  /** people (each counted once a day) and pages they opened, over the period */
  totals: { visitors: number; views: number };
  today: { visitors: number; views: number };
  /** one entry per day, oldest first, days without visitors included */
  daily: { day: string; visitors: number; views: number }[];
  pages: { path: string; views: number; visitors: number }[];
  /** where visitors came from: direct, google, facebook, telegram, qr… or another site's name */
  sources: { source: string; visitors: number }[];
  languages: { lang: string; visitors: number }[];
  devices: { device: Device; visitors: number }[];
};
