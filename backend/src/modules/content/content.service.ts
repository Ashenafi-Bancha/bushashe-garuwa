import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { ContentRepository } from './content.repository.js';
import type { ContentLang, SaveContentEntry } from './content.schema.js';

/** Rules for edited website content. */
export function contentService(repo: ContentRepository) {
  return {
    /** What the public website asks for: one flat map of key to text */
    async published(lang: Exclude<ContentLang, '*'>) {
      return { lang, entries: await repo.forLanguage(lang), updatedAt: await repo.lastUpdatedAt() };
    },

    list: (filter: { lang?: ContentLang; prefix?: string }) => repo.list(filter),

    async save(entries: SaveContentEntry[]) {
      // an empty value means "use the website's built-in text again"
      const toRemove = entries.filter((entry) => entry.value.trim() === '');
      const toSave = entries.filter((entry) => entry.value.trim() !== '');
      for (const entry of toRemove) await repo.remove(entry.key, entry.lang);
      const saved = toSave.length > 0 ? await repo.saveMany(toSave) : [];
      logger.info('content: saved', { saved: saved.length, reset: toRemove.length });
      return saved;
    },

    async reset(key: string, lang: ContentLang) {
      if (!(await repo.remove(key, lang))) throw HttpError.notFound('That text was not edited, so there is nothing to undo');
    },

    stats: async () => ({ edited: await repo.count(), lastUpdatedAt: await repo.lastUpdatedAt() }),
  };
}
export type ContentService = ReturnType<typeof contentService>;
