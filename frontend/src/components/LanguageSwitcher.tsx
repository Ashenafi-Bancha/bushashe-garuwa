import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, WOLAYTTA_READY } from '../i18n/config';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Globe menu listing the three languages. English is the default.
 * Wolayttatto doonaa (WOL) is marked "coming soon" until its translation is published.
 */
export default function LanguageSwitcher({ variant }: { variant: 'bar' | 'menu' }) {
  const { lang, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${current.name}`}
        className={`flex items-center gap-2 rounded-full font-semibold transition-colors duration-300 ${
          variant === 'bar'
            ? 'text-[13px] px-3 py-2 text-white/80 hover:text-white hover:bg-white/10'
            : 'text-sm px-4 py-2.5 text-white/80 bg-white/5 border border-white/10 hover:text-white'
        } ${open ? 'bg-white/12 text-white' : ''}`}
      >
        {/* globe */}
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8" strokeLinecap="round" />
          <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
        </svg>
        <span lang={current.code}>{current.short}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label={t.nav.language}
        inert={!open}
        className={`absolute right-0 top-full mt-2 w-[21rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0e2820]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.6)] p-1.5 origin-top-right transition-all duration-300 z-50 ${
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
      >
        {LANGUAGES.map((l) => {
          const active = lang === l.code;
          const soon = l.code === 'wal' && !WOLAYTTA_READY;
          return (
            <button
              key={l.code}
              role="option"
              aria-selected={active}
              lang={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-200 ${
                active ? 'bg-[#C99A45] text-[#0e2820]' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-baseline gap-2.5 min-w-0">
                <span className={`text-[11px] font-bold w-8 flex-shrink-0 ${active ? 'text-[#0e2820]/70' : 'text-white/40'}`}>{l.short}</span>
                <span className="text-sm font-medium">{l.name}</span>
              </span>
              {soon && (
                <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 flex-shrink-0 ${
                  active ? 'bg-[#0e2820]/15 text-[#0e2820]' : 'bg-[#C99A45]/20 text-[#C99A45]'
                }`}>
                  {t.nav.wolayttaSoon}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
