import { Link } from 'react-router-dom';
import { photos, picture, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import { Tilt } from '../lib/motion';

type QuickKey = 'heritage' | 'experiences' | 'events' | 'stay' | 'dine' | 'visit' | 'gallery' | 'about';

/* order and size on the grid; on computers the first card is the large one */
const LINKS: { key: QuickKey; to: string; photo: PhotoKey; span: string }[] = [
  { key: 'heritage', to: '/heritage', photo: 'house', span: 'md:col-span-2 md:row-span-2' },
  { key: 'experiences', to: '/experiences', photo: 'gifaataa2', span: '' },
  { key: 'events', to: '/events', photo: 'gifaataa1', span: '' },
  { key: 'stay', to: '/stay', photo: 'pavilions', span: '' },
  { key: 'dine', to: '/dine', photo: 'food', span: '' },
  { key: 'visit', to: '/visit', photo: 'gate', span: 'md:col-span-2' },
  { key: 'gallery', to: '/gallery', photo: 'zigba', span: '' },
  { key: 'about', to: '/about', photo: 'home', span: '' },
];

/**
 * A way into every part of the site: photo cards on a bento grid (one below
 * the other on phones), each with a line about the place and an "Explore" button.
 */
export default function QuickLinks() {
  const { t } = useI18n();
  const q = t.home.quick;

  return (
    <section className="py-20 sm:py-28" aria-labelledby="quick-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div data-reveal className="fade-section flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div>
            <span className="eyebrow mb-5">{q.eyebrow}</span>
            <h2 id="quick-title" className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[0.98] max-w-2xl">
              {q.title}
            </h2>
          </div>
          <p className="text-[#1E3A29]/60 text-base sm:text-lg max-w-sm">{q.desc}</p>
        </div>
      </div>

      {/* phones: one card below the other, nothing to swipe sideways; tablets and computers: the bento grid */}
      <div className="px-5 sm:px-8 max-w-screen-xl mx-auto">
        <ul data-wave className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[250px] lg:auto-rows-[270px] gap-5">
          {LINKS.map(({ key, to, photo, span }, i) => (
            <li
              key={key}
              data-reveal
              className={`fade-section flex min-w-0 sm:h-[360px] md:h-auto ${span}`}
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <Tilt className="w-full h-full rounded-[1.75rem]" max={4}>
                <Link to={to} className="group relative flex h-full flex-col sm:justify-end overflow-hidden rounded-[1.75rem] img-zoom bg-white sm:bg-transparent elev-1 sm:shadow-none">
                  <img {...picture(photos[photo])} alt={t.photos[photo]} loading="lazy" className="sm:absolute sm:inset-0 w-full aspect-[3/2] sm:aspect-auto sm:h-full object-cover" />
                  {/* phones: the whole photograph, the words beneath it; wider screens: the words on the photograph */}
                  <span className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 via-45% to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[11px] font-bold text-[#1E3A29] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex flex-1 flex-col sm:block sm:flex-none p-5 sm:p-6">
                    <span className={`block font-display font-bold text-[#1E3A29] sm:text-white leading-tight tracking-tight ${i === 0 ? 'text-2xl sm:text-4xl' : 'text-2xl'}`}>
                      {t.nav.links[key]}
                    </span>
                    <span className={`block text-[#1E3A29]/65 sm:text-white/75 text-sm leading-relaxed mt-2 mb-4 sm:mb-0 ${i === 0 ? 'max-w-sm' : 'sm:line-clamp-2'}`}>{q.items[key]}</span>
                    <span className="btn-primary btn-sm mt-auto sm:mt-4">{t.common.explore}</span>
                  </span>
                </Link>
              </Tilt>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
