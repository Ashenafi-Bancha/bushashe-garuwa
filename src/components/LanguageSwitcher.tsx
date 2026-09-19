import { LANGUAGES, WOLAYTTA_READY } from '../i18n/config';
import { useI18n } from '../i18n/I18nProvider';

/** EN / አማ / WAL selector. `bar` sits in the header; `menu` is the larger mobile-menu version. */
export default function LanguageSwitcher({ variant }: { variant: 'bar' | 'menu' }) {
  const { lang, setLanguage, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={variant === 'bar' ? 'flex items-center border border-white/15 divide-x divide-white/15' : 'flex items-center gap-1'}
    >
      {LANGUAGES.map((l) => {
        const active = lang === l.code;
        const soon = l.code === 'wal' && !WOLAYTTA_READY;
        return (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            lang={l.code}
            aria-pressed={active}
            title={soon ? `${l.name} — ${t.nav.wolayttaSoon}` : l.name}
            className={
              variant === 'bar'
                ? `relative text-[10px] tracking-widest px-2.5 py-1.5 font-sans font-medium transition-colors duration-200 ${
                    active ? 'text-[#C99A45] bg-white/5' : 'text-white/40 hover:text-white/70'
                  }`
                : `relative text-sm tracking-wider px-3 py-1.5 font-sans transition-colors border ${
                    active ? 'text-[#C99A45] border-[#C99A45]/40 bg-[#C99A45]/8' : 'text-white/35 border-white/10 hover:text-white/60'
                  }`
            }
          >
            {l.short}
            {soon && <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#C99A45]/70" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
