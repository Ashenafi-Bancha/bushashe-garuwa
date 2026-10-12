import { Link } from 'react-router-dom';
import { photos, picture, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

/** One thing a visitor finds on a page: its name, and the photograph beside it */
type Detail = { label: string; photo: PhotoKey };

/** The parts of the site shown in full: a large photograph, a line about the place, what is found there, and the way in */
function details(t: Dictionary): { key: string; to: string; photo: PhotoKey; title: string; desc: string; list: Detail[] }[] {
  const q = t.home.quick.items;
  const heritage = t.heritage.categories;
  const doing = t.home.experiences.items;
  const captions = t.photoCaptions;
  const vip = t.vip.features;
  const [wolaitaCuisine, , , specialEvents] = t.home.restaurant.categories;

  return [
    {
      key: 'heritage',
      to: '/heritage',
      photo: 'meeshsho',
      title: t.nav.links.heritage,
      desc: q.heritage,
      list: [
        { label: heritage.houses.label, photo: 'house' },
        { label: heritage.trees.label, photo: 'zigba' },
        { label: heritage.animals.label, photo: 'bird' },
        { label: heritage.clothing.label, photo: 'gifaataa2' },
        { label: heritage.food.label, photo: 'food' },
        { label: heritage.stories.label, photo: 'eventElders' },
      ],
    },
    {
      key: 'experiences',
      to: '/experiences',
      photo: 'gifaataa2',
      title: t.nav.links.experiences,
      desc: q.experiences,
      list: [
        { label: doing.food.title, photo: 'food' },
        { label: doing.performance.title, photo: 'gifaataa3' },
        { label: doing.tour.title, photo: 'pavilions' },
        { label: doing.photography.title, photo: 'gardens' },
      ],
    },
    {
      key: 'events',
      to: '/events',
      photo: 'gifaataa1',
      title: t.nav.links.events,
      desc: q.events,
      list: [
        { label: captions.gifaataa1.title, photo: 'gifaataa1' },
        { label: captions.eventGathering.title, photo: 'eventGathering' },
        { label: captions.eventCelebration.title, photo: 'eventCelebration' },
        { label: captions.eventGames.title, photo: 'eventGames' },
      ],
    },
    {
      key: 'vip',
      to: '/vip',
      photo: 'vipDining',
      title: t.nav.links.vip,
      desc: t.vip.hero.desc,
      list: [
        { label: vip.dining.title, photo: 'vipDining' },
        { label: vip.kitchen.title, photo: 'vipKitchen' },
        { label: vip.rooms.title, photo: 'vipRoom' },
        { label: vip.restrooms.title, photo: 'vipShower' },
      ],
    },
    {
      key: 'dine',
      to: '/dine',
      photo: 'food',
      title: t.nav.links.dine,
      desc: q.dine,
      list: [
        { label: wolaitaCuisine ?? captions.food.title, photo: 'food' },
        { label: captions.enset.title, photo: 'enset' },
        { label: specialEvents ?? captions.eventCelebration.title, photo: 'eventCelebration' },
      ],
    },
  ];
}

/** The remaining pages, as three smaller cards */
const MORE: { key: 'gallery' | 'visit' | 'about'; to: string; photo: PhotoKey }[] = [
  { key: 'gallery', to: '/gallery', photo: 'zigba' },
  { key: 'visit', to: '/visit', photo: 'gate' },
  { key: 'about', to: '/about', photo: 'home' },
];

/**
 * The way into every part of the site, in order: the main pages each with a
 * large photograph and a list of what is found there (a small photograph beside
 * every item), then three smaller cards, and last the Guest House, which is not
 * open yet and says so across its photograph.
 */
export default function QuickLinks() {
  const { t } = useI18n();
  const q = t.home.quick;
  const rows = details(t);

  return (
    <section className="py-16 sm:py-24" aria-labelledby="quick-title">
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

        {/* the main pages, one below the other; the photograph changes side from row to row on computers */}
        <div className="space-y-6 sm:space-y-8">
          {rows.map((row, i) => (
            <article key={row.key} data-reveal className="fade-section grid lg:grid-cols-2 bg-white rounded-[2rem] p-2.5 elev-1">
              <Link to={row.to} className={`group relative block img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2] lg:aspect-auto lg:min-h-[440px] ${i % 2 ? 'lg:order-2' : ''}`}>
                <img {...picture(photos[row.photo], '(max-width: 1023px) 100vw, 50vw')} alt={t.photos[row.photo]} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-[#1E3A29] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>

              <div className="flex flex-col items-start p-5 sm:p-8 lg:p-10">
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] leading-[1.02] tracking-[-0.03em] mb-3">{row.title}</h3>
                <p className="text-[#1E3A29]/65 leading-relaxed mb-6">{row.desc}</p>

                {/* what is found there: each item with its own small photograph */}
                <ul className="w-full grid sm:grid-cols-2 gap-2.5 sm:gap-3 mb-7">
                  {row.list.map((item) => (
                    <li key={item.label} className="flex items-center gap-3 rounded-2xl bg-[#F4EFE4] p-2 pr-4">
                      <img
                        {...picture(photos[item.photo], '64px')}
                        alt=""
                        loading="lazy"
                        className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl object-cover"
                      />
                      <span className="flex items-center gap-2 min-w-0 text-sm sm:text-[15px] font-semibold text-[#1E3A29] leading-snug">
                        <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#0E8A50]" aria-hidden="true" />
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={row.to} className="btn-primary mt-auto">
                  {t.common.explore}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* the other pages */}
        <ul data-wave className="grid sm:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8">
          {MORE.map(({ key, to, photo }, i) => (
            <li key={key} className="flex">
              <Link to={to} className="group flex w-full flex-col bg-white rounded-[2rem] p-2.5 elev-1">
                <span className="relative block img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[photo], '(max-width: 639px) 100vw, 33vw')} alt={t.photos[photo]} loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-[#1E3A29] tabular-nums">
                    {String(rows.length + i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="flex flex-1 flex-col items-start p-4 sm:p-5">
                  <span className="font-display text-2xl font-bold text-[#1E3A29] leading-tight tracking-tight">{t.nav.links[key]}</span>
                  <span className="text-[#1E3A29]/65 text-sm leading-relaxed mt-2 mb-5">{q.items[key]}</span>
                  <span className="btn-primary btn-sm mt-auto">{t.common.explore}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* last: the Guest House, not open yet, said large across its photograph */}
        <Link to="/stay" data-reveal className="fade-section group relative mt-6 sm:mt-8 flex min-h-[340px] sm:min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] text-center">
          <img {...picture(photos.pavilions)} alt={t.photos.pavilions} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-[#13261A]/60" />
          <span className="relative flex flex-col items-center px-6 py-12">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-[#1E3A29] mb-5">{t.nav.links.stay}</span>
            <span className="coming-soon-word on-photo font-display font-extrabold uppercase leading-[0.95]">{t.stay.comingSoon.badge}</span>
            <span className="text-white/90 text-base sm:text-lg leading-relaxed max-w-md mt-5">{t.stay.comingSoon.lead}</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
