import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { eventText, type SiteEvent } from '../lib/events';

/**
 * The twice-monthly cultural food evening on the home page: a deep forest panel
 * with the photograph, the words and the next dates staff have set.
 */
export default function CulturalFoodDates({ events }: { events: SiteEvent[] }) {
  const { t, lang } = useI18n();
  const c = t.home.culturalFood;
  const dates = events.filter((event) => event.category === 'food').slice(0, 4);
  const partner = dates.find((event) => event.partner)?.partner;

  const day = (iso: string) => new Date(iso).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', { day: 'numeric' });
  const month = (iso: string) => new Date(iso).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', { month: 'short', year: 'numeric' });

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
    <section className="px-2 sm:px-3 py-6">
      <div className="bg-[#E3EBD8] text-[#13261A] rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div data-reveal className="fade-section relative">
            <div className="img-zoom rounded-[1.75rem] overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
              <img src={photos.food} alt={t.photos.food} loading="lazy" className="w-full h-full object-cover" />
            </div>
            {partner && (
              <div className="absolute -bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:max-w-xs rounded-2xl bg-[#F4EFE4] text-[#1E3A29] px-5 py-4 font-bold text-sm shadow-xl">
                {fmt(c.partner, { partner })}
              </div>
            )}
          </div>

          <div data-reveal className="fade-section">
            <span className="eyebrow mb-5">{c.eyebrow}</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] mb-5">{c.title}</h2>
            <p className="text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">{c.desc}</p>

            <div className="text-sm font-bold text-[#0B6E40] mb-4">{c.nextTitle}</div>
            {dates.length === 0 ? (
              <p className="rounded-2xl bg-white border border-[#1E3A29]/12 p-5 text-[#1E3A29]/80 text-sm leading-relaxed mb-8">{c.soon}</p>
            ) : (
              <ul className="space-y-3 mb-8">
                {dates.map((event) => {
                  const full = event.placesLeft === 0 || event.availability === 'full';
                  const few = event.availability === 'limited' || (event.placesLeft !== null && event.placesLeft <= 5);
                  return (
                    <li key={event.id} className="flex items-center gap-4 rounded-2xl bg-white border border-[#1E3A29]/12 p-3 pr-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#F4EFE4] text-[#1E3A29] grid place-items-center text-center leading-none">
                        <div>
                          <div className="font-display text-2xl font-extrabold">{day(event.date)}</div>
                          <div className="text-[10px] font-bold mt-1 opacity-70">{month(event.date)}</div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold leading-tight truncate">{eventText(event, lang).name}</div>
                        {event.time && <div className="text-[#1E3A29]/80 text-sm mt-1">{event.time}</div>}
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                        full ? 'bg-white text-[#1E3A29]/70' : few ? 'bg-[#C4622D] text-[#13261A]' : 'bg-[#86A94F] text-[#13261A]'
                      }`}>
                        {placeLabel(event)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-wrap gap-3">
              <Link to="/events" className="btn-primary">{c.bookCta}</Link>
              <Link to="/events" className="btn-outline text-[#13261A]">{c.allCta}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
