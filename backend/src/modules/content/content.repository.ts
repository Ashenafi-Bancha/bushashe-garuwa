import type { Database } from '../../db/database.js';
import type { ContentEntry, ContentLang, SaveContentEntry } from './content.schema.js';

type Row = { key: string; lang: ContentLang; value: string; updated_at: Date };

const toEntry = (row: Row): ContentEntry => ({
  key: row.key,
  lang: row.lang,
  value: row.value,
  updatedAt: row.updated_at.toISOString(),
});

const SAVE = `INSERT INTO content_entries (key, lang, value, updated_at)
  VALUES ($1, $2, $3, now())
  ON CONFLICT (key, lang) DO UPDATE
    SET value = excluded.value, updated_at = excluded.updated_at
  RETURNING *`;

/** All SQL for edited website content. */
export function contentRepository(db: Database) {
  return {
    /** Everything a visitor's language needs: the shared values plus that language's own */
    async forLanguage(lang: Exclude<ContentLang, '*'>): Promise<Record<string, string>> {
      const rows = await db.query<Row>(
        `SELECT * FROM content_entries WHERE lang = '*' OR lang = $1 ORDER BY (lang = '*') DESC`,
        [lang],
      );
      // the language's own value wins over the shared one
      return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    },

    async list(filter: { lang?: ContentLang; prefix?: string } = {}): Promise<ContentEntry[]> {
      const where: string[] = [];
      const values: string[] = [];
      if (filter.lang) {
        values.push(filter.lang);
        where.push(`lang = $${values.length}`);
      }
      if (filter.prefix) {
        values.push(`${filter.prefix}%`);
        where.push(`key LIKE $${values.length}`);
      }
      const sql = `SELECT * FROM content_entries ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY key, lang`;
      return (await db.query<Row>(sql, values)).map(toEntry);
    },

    /** All of the entries are saved, or none */
    saveMany(entries: SaveContentEntry[]): Promise<ContentEntry[]> {
      return db.transaction(async (tx) => {
        const saved: ContentEntry[] = [];
        for (const entry of entries) {
          const [row] = await tx.query<Row>(SAVE, [entry.key, entry.lang, entry.value]);
          saved.push(toEntry(row!));
        }
        return saved;
      });
    },

    /** Removing an entry puts the website's built-in text back */
    async remove(key: string, lang: ContentLang): Promise<boolean> {
      return (await db.execute('DELETE FROM content_entries WHERE key = $1 AND lang = $2', [key, lang])) > 0;
    },

    async count(): Promise<number> {
      const [row] = await db.query<{ total: number }>('SELECT COUNT(*)::int AS total FROM content_entries');
      return row!.total;
    },

    /** Newest change, so the website knows whether its copy is still fresh */
    async lastUpdatedAt(): Promise<string | null> {
      const [row] = await db.query<{ latest: Date | null }>('SELECT MAX(updated_at) AS latest FROM content_entries');
      return row?.latest ? row.latest.toISOString() : null;
    },
  };
}
export type ContentRepository = ReturnType<typeof contentRepository>;
