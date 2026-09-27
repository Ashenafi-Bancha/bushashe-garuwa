import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { eventText, type SiteEvent } from '../lib/events';

/**
 * The twice-monthly cultural food evening on the home page: the photograph on
 * one side, the dates staff set on the other, on white like every other section.
 */
export default function CulturalFoodDates({ events }: { events: SiteEvent[] }) {
  const { t, lang } = useI18n();
  const c = t.home.culturalFood;
  const dates = events.filter((event) => event.category === 'food').slice(0, 4);
  const partner = dates.find((event) => event.partner)?.partner;

  const dayLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const placeLabel = (event: SiteEvent) =>
    event.placesLeft === 0 || event.availability === 'full'
      ? t.events.live.full
      : event.placesLeft !== null
        ? event.placesLeft === 1
          ? t.events.live.onePlaceLeft
          : fmt(t.events.live.placesLeft, { count: event.placesLeft })
        : event.availability === 'limited'
          ? t.events.live.limited
          : t.events.live.open;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="img-zoom rounded-[1.25rem] overflow-hidden elev-1 aspect-[4/3] lg:aspect-[5/4]">
          <img src={photos.food} alt={t.photos.food} loading="lazy" className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="block w-10 h-px bg-[#B8863B] mb-4" />
          <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#35723A] mb-4">{c.eyebrow}</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#12150F] leading-[1.05] mb-5">{c.title}</h2>
          <p className="text-[#12150F]/60 text-base sm:text-lg leading-relaxed mb-5 max-w-lg">{c.desc}</p>
          {partner && <p className="text-[#35723A] font-semibold mb-7">{fmt(c.partner, { partner })}</p>}

          <div className="rounded-[1.25rem] border border-[#12150F]/10 p-5 sm:p-6 mb-8">
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#35723A] mb-4">{c.nextTitle}</div>
            {dates.length === 0 ? (
              <p className="text-[#12150F]/55 text-sm leading-relaxed">{c.soon}</p>
            ) : (
              <ul className="divide-y divide-[#12150F]/8">
                {dates.map((event) => (
                  <li key={event.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-lg font-bold text-[#12150F] leading-tight">{dayLabel(event.date)}</div>
                      <div className="text-[#12150F]/55 text-sm mt-0.5">
                        {eventText(event, lang).name}
                        {event.time ? ` · ${event.time}` : ''}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        event.placesLeft === 0 || event.availability === 'full'
                          ? 'bg-[#12150F]/6 text-[#12150F]/45'
                          : event.availability === 'limited' || (event.placesLeft !== null && event.placesLeft <= 5)
                            ? 'bg-[#B8863B]/15 text-[#8A6428]'
                            : 'bg-[#35723A]/10 text-[#35723A]'
                      }`}
                    >
                      {placeLabel(event)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn-primary">{c.bookCta}</Link>
            <Link to="/events" className="btn-outline text-[#35723A] border-[#12150F]/20">{c.allCta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
