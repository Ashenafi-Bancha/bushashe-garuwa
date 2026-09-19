import { LANGUAGES, WOLAYTTA_READY } from '../i18n/config';
import { useI18n } from '../i18n/I18nProvider';

/** EN / አማ / WAL selector. `bar` sits in the header; `menu` is the larger full-menu version. */
export default function LanguageSwitcher({ variant }: { variant: 'bar' | 'menu' }) {
  const { lang, setLanguage, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex items-center rounded-full ${variant === 'bar' ? 'bg-white/8 p-1 gap-0.5' : 'bg-white/5 border border-white/10 p-1.5 gap-1 w-fit'}`}
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
            className={`relative rounded-full font-semibold transition-colors duration-200 ${
              variant === 'bar' ? 'text-[11px] px-2.5 py-1.5' : 'text-sm px-4 py-2'
            } ${active ? 'bg-[#C99A45] text-[#0e2820]' : 'text-white/55 hover:text-white'}`}
          >
            {l.short}
            {soon && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#C99A45]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
