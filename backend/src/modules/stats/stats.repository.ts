import type { Queryable } from '../../db/database.js';
import type { Device, StatsSummary } from './stats.schema.js';

export type NewView = { day: string; path: string; lang: string; source: string; device: Device; visitor: string };

/** How long single page views are kept: a little over a year, enough to compare with last year */
const KEEP_DAYS = 400;

const num = (value: unknown) => Number(value ?? 0);

/** All SQL for the visitor statistics. A "visitor" is one person on one day (see stats.service.ts). */
export function statsRepository(db: Queryable) {
  return {
    async add(view: NewView): Promise<void> {
      await db.query(
        `INSERT INTO page_views (day, path, lang, source, device, visitor) VALUES ($1, $2, $3, $4, $5, $6)`,
        [view.day, view.path, view.lang, view.source, view.device, view.visitor],
      );
    },

    /** Forget page views older than KEEP_DAYS */
    async prune(today: string): Promise<void> {
      await db.query(`DELETE FROM page_views WHERE day < ($1::date - $2::int)`, [today, KEEP_DAYS]);
    },

    /** The summary for the staff area: the last `days` days up to and including `today` */
    async summary(today: string, days: number): Promise<StatsSummary> {
      const params = [today, days - 1];
      const range = `day BETWEEN ($1::date - $2::int) AND $1::date`;
      // one person counts once per day
      const visitors = `COUNT(DISTINCT (day, visitor))::int`;

      const [totals] = await db.query<{ visitors: number; views: number; tvisitors: number; tviews: number }>(
        `SELECT ${visitors} AS visitors, COUNT(*)::int AS views,
                COUNT(DISTINCT visitor) FILTER (WHERE day = $1::date)::int AS tvisitors,
                COUNT(*) FILTER (WHERE day = $1::date)::int AS tviews
         FROM page_views WHERE ${range}`,
        params,
      );
      const daily = await db.query<{ day: string; visitors: number; views: number }>(
        `SELECT to_char(d.day, 'YYYY-MM-DD') AS day,
                COUNT(DISTINCT v.visitor)::int AS visitors, COUNT(v.id)::int AS views
         FROM generate_series($1::date - $2::int, $1::date, interval '1 day') AS d(day)
         LEFT JOIN page_views v ON v.day = d.day::date
         GROUP BY d.day ORDER BY d.day`,
        params,
      );
      const pages = await db.query<{ path: string; views: number; visitors: number }>(
        `SELECT path, COUNT(*)::int AS views, ${visitors} AS visitors
         FROM page_views WHERE ${range} GROUP BY path ORDER BY views DESC, path LIMIT 12`,
        params,
      );
      const sources = await db.query<{ source: string; visitors: number }>(
        `SELECT source, ${visitors} AS visitors FROM page_views WHERE ${range}
         GROUP BY source ORDER BY visitors DESC, source LIMIT 12`,
        params,
      );
      const languages = await db.query<{ lang: string; visitors: number }>(
        `SELECT lang, ${visitors} AS visitors FROM page_views WHERE ${range} GROUP BY lang ORDER BY visitors DESC`,
        params,
      );
      const devices = await db.query<{ device: Device; visitors: number }>(
        `SELECT device, ${visitors} AS visitors FROM page_views WHERE ${range} GROUP BY device ORDER BY visitors DESC`,
        params,
      );

      return {
        days,
        from: daily[0]?.day ?? today,
        to: today,
        totals: { visitors: num(totals?.visitors), views: num(totals?.views) },
        today: { visitors: num(totals?.tvisitors), views: num(totals?.tviews) },
        daily: daily.map((d) => ({ day: d.day, visitors: num(d.visitors), views: num(d.views) })),
        pages: pages.map((p) => ({ path: p.path, views: num(p.views), visitors: num(p.visitors) })),
        sources: sources.map((s) => ({ source: s.source, visitors: num(s.visitors) })),
        languages: languages.map((l) => ({ lang: l.lang, visitors: num(l.visitors) })),
        devices: devices.map((d) => ({ device: d.device, visitors: num(d.visitors) })),
      };
    },
  };
}
export type StatsRepository = ReturnType<typeof statsRepository>;
