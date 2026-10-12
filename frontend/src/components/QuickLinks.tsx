import { Link } from 'react-router-dom';
import { photos, picture, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

/** One thing a visitor finds on a page: its name, the photograph beside it (when there is one yet), and whether it is still to come */
type Detail = { label: string; photo?: PhotoKey; soon?: boolean };

/** The parts of the site shown in full: a large photograph, a line about the place, what is found there, and the way in */
function details(t: Dictionary): { key: string; to: string; photo: PhotoKey; title: string; desc: string; list: Detail[] }[] {
  const q = t.home.quick.items;
  const heritage = t.heritage.categories;
  const doing = t.experiences.items;
  const held = t.events.kinds.items;
  const captions = t.photoCaptions;
  const vip = t.vip.features;
  const hall = t.meeting.uses;
  const visit = t.visit.types;
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
        { label: heritage.spices.label },
        { label: heritage.animals.label, photo: 'bird' },
        { label: heritage.crocodile.label },
        { label: heritage.artifacts.label },
        { label: heritage.food.label, photo: 'food' },
        { label: heritage.clothing.label, photo: 'gifaataa2' },
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
        { label: doing.coffee.title },
        { label: doing.performance.title, soon: true },
        { label: doing.workshop.title, soon: true },
        { label: doing.tour.title, photo: 'pavilions' },
        { label: doing.horse.title, photo: 'lawn' },
      ],
    },
    {
      key: 'events',
      to: '/events',
      photo: 'gifaataa1',
      title: t.nav.links.events,
      desc: q.events,
      list: [
        { label: `${held.food.title} · ${held.food.when}`, photo: 'food' },
        { label: `${held.gifaataa.title} · ${held.gifaataa.when}`, photo: 'gifaataa3' },
        { label: held.private.title, photo: 'eventCelebration' },
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
      key: 'meeting',
      to: '/meeting-hall',
      photo: 'meetingHall',
      title: t.nav.links.meeting,
      desc: q.meeting,
      list: [
        { label: hall.meetings.title, photo: 'meetingHall' },
        { label: hall.trainings.title, photo: 'eventGathering' },
        { label: hall.education.title },
        { label: hall.weddings.title },
        { label: hall.family.title, photo: 'eventElders' },
        { label: hall.anniversaries.title, photo: 'eventCelebration' },
        { label: hall.visitors.title, photo: 'gifaataa3' },
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
    {
      key: 'visit',
      to: '/visit',
      photo: 'gate',
      title: t.nav.links.visit,
      desc: q.visit,
      list: [
        { label: t.common.openingHours, photo: 'home' },
        { label: t.visit.gettingHere.title, photo: 'gate' },
        { label: visit.heritage.label, photo: 'meeshsho' },
        { label: visit.group.label, photo: 'gifaataa1' },
        { label: visit.education.label },
        { label: visit.meeting.label, photo: 'meetingHall' },
      ],
    },
  ];
}

/** The remaining pages, as three smaller cards */
const MORE: { key: 'stories' | 'gallery' | 'about'; to: string; photo: PhotoKey }[] = [
  { key: 'stories', to: '/heritage/stories', photo: 'eventElders' },
  { key: 'gallery', to: '/gallery', photo: 'zigba' },
  { key: 'about', to: '/about', photo: 'home' },
];

/**
 * The way into every part of the site, in order: the main pages each with a
 * large photograph and a list of what is found there (a small photograph beside
 * every item that has one), then three smaller cards. The Guest House, not open yet, comes
 * last on the home page: `GuestHouseSoon` below.
 */
export default function QuickLinks() {
  const { t } = useI18n();
  const q = t.home.quick;
  const rows = details(t);

  return (
    <section className="pt-16 sm:pt-24 pb-10 sm:pb-14" aria-labelledby="quick-title">
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
                      {item.photo ? (
                        <img
                          {...picture(photos[item.photo], '64px')}
                          alt=""
                          loading="lazy"
                          className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        /* no photograph of this yet: a quiet tile holds its place */
                        <span className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl bg-[#E3EBD8] grid place-items-center text-[#1E3A29]/35" aria-hidden="true">
                          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 20c0-9 5-15 16-16-1 11-7 16-16 16z" />
                            <path d="M4 20 13 11" />
                          </svg>
                        </span>
                      )}
                      <span className="min-w-0 text-sm sm:text-[15px] font-semibold text-[#1E3A29] leading-snug">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#0E8A50]" aria-hidden="true" />
                          {item.label}
                        </span>
                        {item.soon && <span className="mt-1 ml-3.5 inline-block rounded-full bg-[#FFF4E6] text-[#C4530F] text-[11px] font-bold px-2 py-0.5">{t.experiences.soon}</span>}
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
      </div>
    </section>
  );
}

/** The Guest House, not open yet: "Coming soon" said large across its photograph */
export function GuestHouseSoon() {
  const { t } = useI18n();
  return (
    <section className="pt-10 sm:pt-14 pb-16 sm:pb-24">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
    <Link to="/stay" data-reveal className="fade-section group relative flex min-h-[340px] sm:min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] text-center">
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
