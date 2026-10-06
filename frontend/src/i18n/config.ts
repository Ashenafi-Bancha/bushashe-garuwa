export type Lang = 'en' | 'am' | 'wol';

/**
 * What browsers and screen readers are told a page is written in. The site's own
 * code for Wolaytta is 'wol', but the international code for the language is
 * 'wal' ('wol' would say Wolof), so that one is used for the page itself.
 */
export const HTML_LANG: Record<Lang, string> = { en: 'en', am: 'am', wol: 'wal' };

/**
 * Wolaytta switch.
 * While `false`, choosing WOL shows the "coming soon" notice and visitors stay in English or Amharic.
 * When the translation in `dictionaries/wol/` is finished, set this to `true` to publish it.
 * Any line left untranslated there falls back to English automatically.
 */
export const WOLAYTTA_READY = false;

export const LANGUAGES: { code: Lang; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'am', short: 'አማ', name: 'አማርኛ' },
  { code: 'wol', short: 'WOL', name: 'Wolayttatto doonaa' },
];

export const DEFAULT_LANG: Lang = 'en';
