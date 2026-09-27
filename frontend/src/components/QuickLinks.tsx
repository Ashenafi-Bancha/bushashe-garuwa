import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

type NavKey = keyof Dictionary['nav']['links'];

/** Where a phone visitor is most likely to want to go, in the order they usually ask */
const LINKS: { key: NavKey; to: string }[] = [
  { key: 'visit', to: '/visit' },
  { key: 'events', to: '/events' },
  { key: 'heritage', to: '/heritage' },
  { key: 'experiences', to: '/experiences' },
  { key: 'stay', to: '/stay' },
  { key: 'dine', to: '/dine' },
  { key: 'gallery', to: '/gallery' },
  { key: 'discover', to: '/discover' },
  { key: 'about', to: '/about' },
  { key: 'contact', to: '/contact' },
];

/**
 * A short way into every part of the site, for phones: the menu is behind a
 * button up in the header, so this puts the same places a thumb's reach away,
 * right after the opening figures.
 */
export default function QuickLinks() {
  const { t } = useI18n();
  const q = t.home.quick;

  return (
    <section className="lg:hidden py-10 sm:py-12">
      <div className="px-5 sm:px-8">
        <span className="eyebrow bg-[#35723A]/10 text-[#35723A] mb-4">{q.eyebrow}</span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#12150F] leading-tight mb-6">{q.title}</h2>

        <ul className="grid grid-cols-2 gap-3">
          {LINKS.map(({ key, to }, i) => (
            <li key={key}>
              <Link
                to={to}
                className="group flex items-center justify-between gap-2 rounded-2xl bg-white border border-[#12150F]/8 elev-1 px-4 py-4 min-h-[60px] active:scale-[0.98] transition-transform"
              >
                <span className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-[#B8863B] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-lg text-[#12150F] leading-tight">{t.nav.links[key]}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2F4A2B]/5 text-[#35723A] grid place-items-center transition-colors group-hover:bg-[#B8863B] group-hover:text-[#12150F]"
                >
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
