import type { Database } from '../../db/database.js';
import type { ContentEntry, ContentLang, SaveContentEntry } from './content.schema.js';

type Row = { key: string; lang: ContentLang; value: string; updated_at: string };

const toEntry = (row: Row): ContentEntry => ({
  key: row.key,
  lang: row.lang,
  value: row.value,
  updatedAt: row.updated_at,
});

/** All SQL for edited website content. */
export function contentRepository(db: Database) {
  const save = db.prepare(
    `INSERT INTO content_entries (key, lang, value, updated_at)
     VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     ON CONFLICT (key, lang) DO UPDATE
       SET value = excluded.value, updated_at = excluded.updated_at
     RETURNING *`,
  );

  return {
    /** Everything a visitor's language needs: the shared values plus that language's own */
    forLanguage(lang: Exclude<ContentLang, '*'>): Record<string, string> {
      const rows = db
        .prepare(`SELECT * FROM content_entries WHERE lang = '*' OR lang = ? ORDER BY lang = '*' DESC`)
        .all(lang) as Row[];
      // the language's own value wins over the shared one
      return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    },

    list(filter: { lang?: ContentLang; prefix?: string } = {}): ContentEntry[] {
      const where: string[] = [];
      const values: string[] = [];
      if (filter.lang) {
        where.push('lang = ?');
        values.push(filter.lang);
      }
      if (filter.prefix) {
        where.push('key LIKE ?');
        values.push(`${filter.prefix}%`);
      }
      const sql = `SELECT * FROM content_entries ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY key, lang`;
      return (db.prepare(sql).all(...values) as Row[]).map(toEntry);
    },

    saveMany(entries: SaveContentEntry[]): ContentEntry[] {
      db.exec('BEGIN');
      try {
        const saved = entries.map((entry) => toEntry(save.get(entry.key, entry.lang, entry.value) as Row));
        db.exec('COMMIT');
        return saved;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },

    /** Removing an entry puts the website's built-in text back */
    remove(key: string, lang: ContentLang): boolean {
      const result = db.prepare('DELETE FROM content_entries WHERE key = ? AND lang = ?').run(key, lang);
      return result.changes > 0;
    },

    count(): number {
      return (db.prepare('SELECT COUNT(*) AS total FROM content_entries').get() as { total: number }).total;
    },

    /** Newest change, so the website knows whether its copy is still fresh */
    lastUpdatedAt(): string | null {
      const row = db.prepare('SELECT MAX(updated_at) AS latest FROM content_entries').get() as { latest: string | null };
      return row.latest;
    },
  };
}
export type ContentRepository = ReturnType<typeof contentRepository>;
