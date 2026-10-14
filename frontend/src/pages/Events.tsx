import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture, type PhotoKey } from '../assets/photos';
import EventBooking from '../components/EventBooking';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import { eventText, useSiteEvents, type SiteEvent } from '../lib/events';

type Category = 'all' | 'food' | 'culture' | 'education' | 'music' | 'community';
type AvailKind = 'limited' | 'open' | 'group' | 'full';

const categories: Category[] = ['all', 'food', 'culture', 'education', 'music', 'community'];

/* Shown until staff publish events in the admin area; the words live in the translations (t.events.items) */
const fallbackEvents: { id: keyof Dictionary['events']['items']; time: string; cat: Exclude<Category, 'all'>; availKind: AvailKind; featured: boolean }[] = [
  { id: 'foodOct', time: '17:00 – 21:00', cat: 'food', availKind: 'limited', featured: true },
  { id: 'oralHistory', time: '16:00 – 18:30', cat: 'culture', availKind: 'open', featured: false },
  { id: 'harvest', time: '17:00 – 20:00', cat: 'community', availKind: 'open', featured: true },
  { id: 'schoolDay', time: '08:30 – 14:00', cat: 'education', availKind: 'group', featured: false },
  { id: 'foodNov', time: '17:00 – 21:00', cat: 'food', availKind: 'open', featured: false },
  { id: 'music', time: '10:00 – 13:00', cat: 'music', availKind: 'open', featured: false },
];

/** One event as the page shows it, whether it came from the admin area or from the translations */
type Shown = {
  key: string;
  dateLabel: string;
  time: string;
  cat: Exclude<Category, 'all'>;
  availKind: AvailKind;
  avail: string;
  name: string;
  desc: string;
  photo?: string;
  partner?: string;
  /** set only for events from the admin area, which can be booked here */
  live?: SiteEvent;
};

export default function Events() {
  const { t, lang } = useI18n();
  const e = t.events;
  const [activeCat, setActiveCat] = useState<Category>('all');
  const [booking, setBooking] = useState<SiteEvent | null>(null);
  const { events: liveEvents, reload } = useSiteEvents();

  const availLabel = (kind: AvailKind) =>
    kind === 'full' ? e.live.full : kind === 'limited' ? e.live.limited : e.live.open;
  const placesLeftLabel = (count: number) => (count === 1 ? e.live.onePlaceLeft : fmt(e.live.placesLeft, { count }));

  const fromApi: Shown[] = liveEvents.map((event) => {
    const text = eventText(event, lang);
    return {
      key: `live-${event.id}`,
      dateLabel: new Date(event.date).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: event.time ?? '',
      cat: event.category,
      availKind: event.placesLeft === 0 ? 'full' : event.availability,
      avail:
        event.placesLeft === 0
          ? e.live.full
          : event.placesLeft !== null
            ? placesLeftLabel(event.placesLeft)
            : availLabel(event.availability),
      name: text.name,
      desc: text.desc,
      photo: event.photo ?? (event.category === 'food' ? 'food' : undefined),
      partner: event.partner ?? undefined,
      live: event,
    };
  });

  const fromText: Shown[] = fallbackEvents.map((event) => {
    const text = e.items[event.id];
    return {
      key: event.id,
      dateLabel: text.dateLabel,
      time: event.time,
      cat: event.cat,
      availKind: event.availKind,
      avail: text.avail,
      name: text.name,
      desc: text.desc,
      photo: event.cat === 'food' ? 'food' : undefined,
    };
  });

  const shown = fromApi.length > 0 ? fromApi : fromText;
  const featured = fromApi.length > 0 ? fromApi.filter((event) => event.live?.featured) : fromText.filter((_, i) => [0, 2].includes(i));
  const filtered = activeCat === 'all' ? shown : shown.filter((event) => event.cat === activeCat);

  const photoOf = (key?: string) => (key && key in photos ? photos[key as PhotoKey] : undefined);
  const availStyle = (kind: AvailKind, dark: boolean) =>
    kind === 'limited'
      ? dark ? 'bg-[#1E3A29]/20 text-[#f0a584]' : 'bg-[#1E3A29]/10 text-[#1E3A29]'
      : kind === 'full'
        ? dark ? 'bg-white/10 text-white/50' : 'bg-[#1E3A29]/8 text-[#1E3A29]/60'
        : kind === 'group'
          ? 'bg-[#1E3A29]/10 text-[#1E3A29]'
          : dark ? 'bg-white/10 text-[#B9D38A]' : 'bg-[#C4622D]/10 text-[#C4622D]';

  const bookButton = (event: Shown) =>
    event.live?.bookable && event.availKind !== 'full' ? (
      <button
        type="button"
        onClick={() => setBooking(event.live ?? null)}
        className="btn-primary btn-sm"
      >
        {e.live.bookCta}
      </button>
    ) : (
      <Link
        to="/contact"
        className="btn-primary btn-sm"
      >
        {t.common.reserveYourPlace}
      </Link>
    );

  return (
    <main>
      {/* Hero */}
      <PageHero slot="events" eyebrow={e.hero.eyebrow} title={<>{e.hero.titleA}<br />{e.hero.titleB}</>} />

      {/* Booking form, opened from any bookable event */}
      {booking && (
        <section id="book" className="bg-[#F4EFE4] pt-12 sm:pt-16">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6">
            <EventBooking
              event={booking}
              onBooked={async () => {
                const items = await reload();
                const fresh = items.find((item) => item.id === booking.id);
                if (fresh) setBooking(fresh);
              }}
              onClose={() => setBooking(null)}
            />
          </div>
        </section>
      )}

      {/* The three kinds of events held here */}
      <section className="py-12 sm:py-16" aria-labelledby="kinds-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="eyebrow mb-5">{e.kinds.eyebrow}</span>
            <h2 id="kinds-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A29] leading-[1.05]">{e.kinds.title}</h2>
          </div>
          <ul data-wave className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {([
              { id: 'food', photo: 'food' },
              { id: 'gifaataa', photo: 'gifaataa1' },
              { id: 'private', photo: 'eventCelebration' },
            ] as const).map(({ id, photo }) => (
              <li key={id} className="flex flex-col bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="relative img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[photo], '(max-width: 767px) 100vw, 33vw')} alt={t.photos[photo]} loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-[#1E3A29]">{e.kinds.items[id].when}</span>
                </div>
                <div className="flex flex-1 flex-col items-start px-4 py-5 sm:px-5">
                  <h3 className="font-display text-2xl font-bold text-[#1E3A29] tracking-tight mb-2">{e.kinds.items[id].title}</h3>
                  <p className="text-[#1E3A29]/65 text-sm sm:text-base leading-relaxed">{e.kinds.items[id].desc}</p>
                  {id === 'private' && <Link to="/contact" className="btn-primary btn-sm mt-5">{e.kinds.ask}</Link>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured events */}
      {featured.length > 0 && (
        <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-[#346A1A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-10">{e.featured}</div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((event) => (
                <div key={event.key} className="group relative overflow-hidden flex flex-col rounded-3xl bg-white border border-[#1E3A29]/12 hover:border-[#C4622D]/30 transition-all duration-300">
                  <div className="img-zoom aspect-[16/9] bg-[#E3EBD8]">
                    <Photo src={photoOf(event.photo)} alt={event.name} label={event.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 sm:p-7 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <div>
                        <span className="text-[#346A1A] text-xs font-sans tracking-wider">{event.dateLabel}</span>
                        {event.time && <span className="text-[#1E3A29]/70 text-xs font-sans ml-3">· {event.time}</span>}
                      </div>
                      <span className={`text-xs font-sans rounded-full px-3 py-1 flex-shrink-0 ${availStyle(event.availKind, false)}`}>{event.avail}</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#13261A] mb-3">{event.name}</h2>
                    {event.partner && <p className="text-[#346A1A] text-sm mb-3">{fmt(e.live.partnerWith, { partner: event.partner })}</p>}
                    <p className="text-[#1E3A29]/80 font-sans text-sm leading-relaxed mb-5 flex-1">{event.desc}</p>
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1E3A29]/12">{bookButton(event)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All events */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 mb-10 flex-wrap">
            <h2 className="font-display text-3xl font-semibold text-[#1E3A29]">{e.upcoming}</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`text-xs font-sans font-semibold rounded-full px-4 py-2 transition-colors border ${
                    activeCat === cat
                      ? 'bg-[#3F7D20] text-white border-[#3F7D20]'
                      : 'border-[#1E3A29]/20 text-[#1E3A29]/60 hover:border-[#1E3A29]/50 hover:text-[#1E3A29]'
                  }`}
                >
                  {e.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((event) => (
              <div key={event.key} className="bg-white heritage-card flex flex-col sm:flex-row overflow-hidden">
                <div className="img-zoom sm:w-48 flex-shrink-0 aspect-video sm:aspect-auto bg-[#1E3A29]/10">
                  <Photo src={photoOf(event.photo)} alt={event.name} label={event.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[#C4622D] text-xs font-sans tracking-wider">{event.dateLabel}</span>
                      {event.time && <span className="text-[#1E3A29]/65 text-xs font-sans">{event.time}</span>}
                      <span className="bg-[#F4EFE4] text-[#1E3A29] text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5">{e.categories[event.cat]}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#1E3A29] mb-2">{event.name}</h3>
                    {event.partner && <p className="text-[#1E3A29] text-sm mb-2">{fmt(e.live.partnerWith, { partner: event.partner })}</p>}
                    <p className="text-[#1E3A29]/55 text-sm font-sans leading-relaxed">{event.desc}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 flex-shrink-0">
                    <span className={`text-xs font-sans rounded-full px-3 py-1 ${availStyle(event.availKind, false)}`}>{event.avail}</span>
                    {bookButton(event)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments from gatherings held on the grounds */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 mb-3 rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 lg:py-20" aria-labelledby="moments-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <span className="eyebrow mb-5">{e.moments.eyebrow}</span>
              <h2 id="moments-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#13261A] leading-[1.05] mb-3">{e.moments.title}</h2>
              <p className="text-[#1E3A29]/70 leading-relaxed">{e.moments.desc}</p>
            </div>
            <Link to="/gallery" className="btn-outline text-[#1E3A29] self-start md:self-auto flex-shrink-0">{e.moments.cta}</Link>
          </div>
          <div data-wave className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {(['eventElders', 'eventGathering', 'eventCelebration', 'eventGames'] as const).map((key) => (
              <figure key={key} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[key], '(max-width: 767px) 100vw, 50vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5">
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{t.photoCaptions[key].title}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{t.photoCaptions[key].desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
