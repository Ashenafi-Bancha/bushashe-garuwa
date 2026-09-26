import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { eventText, type SiteEvent } from '../lib/events';

/**
 * The twice-monthly cultural food evening on the home page: the dates staff
 * set in the admin area, with a link to reserve a place. When no dates are
 * published yet, it says they are coming.
 */
export default function CulturalFoodDates({ events }: { events: SiteEvent[] }) {
  const { t, lang } = useI18n();
  const c = t.home.culturalFood;
  const dates = events.filter((event) => event.category === 'food').slice(0, 4);
  const partner = dates.find((event) => event.partner)?.partner;

  const dayLabel = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="relative mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
      <img src={photos.food} alt={t.photos.food} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-[#0a1f19]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f19] via-[#0a1f19]/85 to-[#0a1f19]/45" />

      <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="eyebrow bg-[#C99A45]/20 text-[#E3B866] mb-5">{c.eyebrow}</span>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-[1.05] mb-5">{c.title}</h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6 max-w-lg">{c.desc}</p>
          {partner && <p className="text-[#E3B866] font-medium mb-8">{fmt(c.partner, { partner })}</p>}
          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn-primary">{c.bookCta}</Link>
            <Link to="/events" className="btn-outline text-white border-white/30">{c.allCta}</Link>
          </div>
        </div>

        <div className="rounded-3xl bg-[#0a1f19]/70 border border-white/12 backdrop-blur-md p-6 sm:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="text-[#C99A45] text-xs font-semibold tracking-[0.16em] uppercase mb-5">{c.nextTitle}</div>
          {dates.length === 0 ? (
            <p className="text-white/60 text-sm leading-relaxed">{c.soon}</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {dates.map((event) => {
                const text = eventText(event, lang);
                return (
                  <li key={event.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-xl text-white leading-tight">{dayLabel(event.date)}</div>
                      <div className="text-white/55 text-sm mt-1">
                        {text.name}
                        {event.time ? ` · ${event.time}` : ''}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        event.placesLeft === 0 || event.availability === 'full'
                          ? 'bg-white/10 text-white/50'
                          : event.availability === 'limited' || (event.placesLeft !== null && event.placesLeft <= 5)
                            ? 'bg-[#A65A3A]/30 text-[#f0a584]'
                            : 'bg-emerald-400/15 text-emerald-300'
                      }`}
                    >
                      {event.placesLeft === 0 || event.availability === 'full'
                        ? t.events.live.full
                        : event.placesLeft !== null
                          ? event.placesLeft === 1
                            ? t.events.live.onePlaceLeft
                            : fmt(t.events.live.placesLeft, { count: event.placesLeft })
                          : event.availability === 'limited'
                            ? t.events.live.limited
                            : t.events.live.open}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
