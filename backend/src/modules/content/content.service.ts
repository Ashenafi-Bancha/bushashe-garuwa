import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { ContentRepository } from './content.repository.js';
import type { ContentLang, SaveContentEntry } from './content.schema.js';

/** Rules for edited website content. */
export function contentService(repo: ContentRepository) {
  return {
    /** What the public website asks for: one flat map of key to text */
    published(lang: Exclude<ContentLang, '*'>) {
      return { lang, entries: repo.forLanguage(lang), updatedAt: repo.lastUpdatedAt() };
    },

    list: (filter: { lang?: ContentLang; prefix?: string }) => repo.list(filter),

    save(entries: SaveContentEntry[]) {
      // an empty value means "use the website's built-in text again"
      const toRemove = entries.filter((entry) => entry.value.trim() === '');
      const toSave = entries.filter((entry) => entry.value.trim() !== '');
      for (const entry of toRemove) repo.remove(entry.key, entry.lang);
      const saved = toSave.length > 0 ? repo.saveMany(toSave) : [];
      logger.info('content: saved', { saved: saved.length, reset: toRemove.length });
      return saved;
    },

    reset(key: string, lang: ContentLang) {
      if (!repo.remove(key, lang)) throw HttpError.notFound('That text was not edited, so there is nothing to undo');
    },

    stats: () => ({ edited: repo.count(), lastUpdatedAt: repo.lastUpdatedAt() }),
  };
}
export type ContentService = ReturnType<typeof contentService>;
