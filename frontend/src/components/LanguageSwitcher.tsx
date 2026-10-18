import { useEffect, useRef, useState } from 'react';
import { HTML_LANG, LANGUAGES, WOLAYTTA_READY } from '../i18n/config';
import { useI18n } from '../i18n/I18nProvider';
import LanguageIcon from './LanguageIcon';

/**
 * Globe menu listing the three languages. English is the default.
 * Wolayttatto doonaa (WOL) is marked "coming soon" until its translation is published.
 */
export default function LanguageSwitcher({ variant, onDark = true }: { variant: 'bar' | 'menu'; /** white type for a clear header over a photograph */ onDark?: boolean }) {
  const { lang, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    // the list closes when the page scrolls, as on other sites
    const onScroll = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
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
            ? `text-[13px] px-3 max-[359px]:px-1.5 max-[359px]:gap-1.5 py-2 ${
                onDark
                  ? 'text-white/85 hover:text-white hover:bg-white/12'
                  : 'text-[#1E3A29]/70 hover:text-[#1E3A29] hover:bg-[#1E3A29]/8'
              }`
            : 'text-sm px-4 py-2.5 text-white/80 bg-white/5 border border-white/10 hover:text-white'
        } ${open ? (onDark ? 'bg-white/15 text-white' : 'bg-[#1E3A29]/10 text-[#1E3A29]') : ''}`}
      >
        {/* the chosen language's mark */}
        <LanguageIcon lang={current.code} className="w-[20px] h-[20px]" />
        <span lang={HTML_LANG[current.code]}>{current.short}</span>
        <svg
          className={`max-[359px]:hidden w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label={t.nav.language}
        inert={!open}
        className={`absolute right-0 top-full mt-2.5 w-[15.25rem] sm:w-[16.5rem] rounded-2xl bg-white border border-[#1E3A29]/10 shadow-[0_18px_40px_-16px_rgba(30,58,41,0.4)] p-1.5 origin-top-right transition-all duration-200 z-50 ${
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
      >
        {/* a small point toward the button, so the list reads as its own */}
        <span aria-hidden="true" className="absolute -top-[7px] right-6 w-3.5 h-3.5 rotate-45 bg-white border-l border-t border-[#1E3A29]/10 rounded-tl-[3px]" />
        {LANGUAGES.map((l) => {
          const active = lang === l.code;
          const soon = l.code === 'wol' && !WOLAYTTA_READY;
          return (
            <button
              key={l.code}
              role="option"
              aria-selected={active}
              lang={HTML_LANG[l.code]}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`relative w-full flex items-center justify-between gap-2 rounded-xl px-3 py-3 sm:py-2.5 text-left transition-colors duration-200 ${
                active ? 'bg-[#E3EBD8] text-[#13261A]' : 'text-[#13261A] hover:bg-[#F4EFE4]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <LanguageIcon lang={l.code} className="w-[22px] h-[22px]" />
                <span className={`text-sm truncate ${active ? 'font-bold' : 'font-medium'}`}>{l.name}</span>
              </span>
              {active && (
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 text-[#3F7D20]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              )}
              {soon && (
                <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 flex-shrink-0 bg-[#E3EBD8] text-[#346A1A]">
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
