import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANG, WOLAYTTA_READY, type Lang } from './config';
import { en, type Dictionary } from './dictionaries/en';
import { am } from './dictionaries/am';
import { wal } from './dictionaries/wal';
import WolayttaNotice from '../components/WolayttaNotice';
import { applyOverrides, cachedContent, fetchContent, type ContentOverrides } from '../lib/content';

const STORAGE_KEY = 'bg-lang';

type I18nContextValue = {
  lang: Lang;
  t: Dictionary;
  /** Switch language. Choosing Wolaytta before it is ready opens the notice instead. */
  setLanguage: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/** Replace `{name}` placeholders: fmt('{count} items', { count: 8 }) → '8 items'. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

/** Overlay a (possibly incomplete) translation on the English base; missing or empty lines stay English. */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (typeof base === 'string') return (typeof over === 'string' && over.trim() ? over : base) as T;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return base.map((item, i) => merge(item, over[i])) as T;
  }
  if (base && typeof base === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base)) {
      out[key] = merge((base as Record<string, unknown>)[key], (over as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return base;
}

const walResolved = merge(en, wal);
const dictionaries: Record<Lang, Dictionary> = { en, am, wal: walResolved };

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'am') return stored;
    if (stored === 'wal' && (WOLAYTTA_READY || import.meta.env.DEV)) return stored;
  } catch {
    /* storage unavailable — use default */
  }
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const [noticeOpen, setNoticeOpen] = useState(false);
  // text the staff edited in the admin area; empty until the API answers
  const [overrides, setOverrides] = useState<ContentOverrides>(() => cachedContent(readStoredLang()));

  const applyLang = useCallback((next: Lang) => {
    setLang(next);
    setNoticeOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setLanguage = useCallback(
    (next: Lang) => {
      if (next === 'wal' && !WOLAYTTA_READY) {
        setNoticeOpen(true);
        return;
      }
      applyLang(next);
    },
    [applyLang],
  );

  useEffect(() => {
    let current = true;
    setOverrides(cachedContent(lang));
    void fetchContent(lang).then((entries) => {
      if (current) setOverrides(entries);
    });
    return () => {
      current = false;
    };
  }, [lang]);

  const t = useMemo(() => applyOverrides(dictionaries[lang], overrides), [lang, overrides]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
  }, [lang, t]);

  const value = useMemo(() => ({ lang, t, setLanguage }), [lang, t, setLanguage]);

  return (
    <I18nContext.Provider value={value}>
      {children}
      <WolayttaNotice
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        onChoose={applyLang}
        texts={{ en: en.notice, am: am.notice }}
      />
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
