export type Lang = 'en' | 'am' | 'wal';

/**
 * Wolaytta switch.
 * While `false`, choosing WAL shows the "coming soon" notice and visitors stay in English or Amharic.
 * When the translation in `dictionaries/wal.ts` is finished, set this to `true` to publish it.
 * Any line left untranslated in wal.ts falls back to English automatically.
 */
export const WOLAYTTA_READY = false;

export const LANGUAGES: { code: Lang; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'am', short: 'አማ', name: 'አማርኛ' },
  { code: 'wal', short: 'WAL', name: 'Wolayttatto' },
];

export const DEFAULT_LANG: Lang = 'en';
