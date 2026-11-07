import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import EventBooking from '../components/EventBooking';
import PageHero from '../components/PageHero';
import ContactButtons from '../components/ContactButtons';
import EventAd from '../components/EventAd';
import TypeHeading from '../components/TypeHeading';
import { scrollToHash } from '../lib/motion';
import { useI18n } from '../i18n/I18nProvider';
import { useSiteEvents, type SiteEvent } from '../lib/events';
import Band from '../components/Band';
import { wol } from '../lib/wolaitaWords';

type Category = 'all' | 'food' | 'culture' | 'education' | 'music' | 'community';

const categories: Category[] = ['all', 'food', 'culture', 'education', 'music', 'community'];

export default function Events() {
  const { t } = useI18n();
  const e = t.events;
  const [activeCat, setActiveCat] = useState<Category>('all');
  const [booking, setBooking] = useState<SiteEvent | null>(null);
  const { events, reload } = useSiteEvents();
  const [params, setParams] = useSearchParams();

  // only the events staff have published in the admin area, each drawn as an advertisement
  const filtered = activeCat === 'all' ? events : events.filter((event) => event.category === activeCat);

  const openBooking = (event: SiteEvent) => {
    setBooking(event);
    setTimeout(() => scrollToHash('#book'), 80);
  };

  // arriving from the home page's "Reserve your place" (/events?book=ID): open that event's form
  const wanted = Number(params.get('book'));
  useEffect(() => {
    if (!wanted || events.length === 0) return;
    const event = events.find((item) => item.id === wanted);
    if (event?.bookable) {
      setBooking(event);
      setTimeout(() => scrollToHash('#book'), 450);
    }
    setParams({}, { replace: true });
  }, [wanted, events, setParams]);

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
            <h2 id="kinds-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A29] leading-[1.05]">{wol(e.kinds.title)}</h2>
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
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-[#1E3A29]">{wol(e.kinds.items[id].when)}</span>
                </div>
                <div className="flex flex-1 flex-col items-start px-4 py-5 sm:px-5">
                  <h3 className="font-display text-2xl font-bold text-[#1E3A29] tracking-tight mb-2">{wol(e.kinds.items[id].title)}</h3>
                  <p className="text-[#1E3A29]/65 text-sm sm:text-base leading-relaxed">{wol(e.kinds.items[id].desc)}</p>
                  {id === 'private' && <Link to="/contact" className="btn-primary btn-sm mt-5">{e.kinds.ask}</Link>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* All events: the heading types itself, each event an advertisement with a countdown */}
      <section id="upcoming" className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 mb-10 flex-wrap">
            <TypeHeading text={e.upcoming} className="font-display text-4xl sm:text-5xl font-extrabold text-[#13261A]" />
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

          <div className="space-y-6">
            {filtered.length === 0 && (
              <div className="bg-white heritage-card p-6 sm:p-8 text-center">
                <p className="text-[#1E3A29]/75 font-sans text-base leading-relaxed max-w-2xl mx-auto">{events.length === 0 ? e.noneYet : e.noneInCategory}</p>
                {events.length === 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <ContactButtons className="justify-center" />
                  </div>
                )}
              </div>
            )}
            {filtered.map((event) => (
              <EventAd key={event.id} event={event} onBook={() => openBooking(event)} />
            ))}
          </div>
        </div>
      </section>

      {/* Moments from gatherings held on the grounds */}
      <Band aria-labelledby="moments-title" outer="mb-3" className="py-6 sm:py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <span className="eyebrow mb-5">{e.moments.eyebrow}</span>
              <h2 id="moments-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#13261A] leading-[1.05] mb-3">{wol(e.moments.title)}</h2>
              <p className="text-[#1E3A29]/70 leading-relaxed">{wol(e.moments.desc)}</p>
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
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{wol(t.photoCaptions[key].title)}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{wol(t.photoCaptions[key].desc)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Band>
    </main>
  );
}
