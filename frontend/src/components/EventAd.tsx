import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { eventText, type SiteEvent } from '../lib/events';
import { eventStart, useCountdown } from '../lib/eventTime';
import { wol } from '../lib/wolaitaWords';
import Photo from './Photo';

/**
 * One event drawn like an advertisement: the photograph with a date stub, then
 * on a deep forest panel the name, the date, time and place, a live countdown
 * to the start, how many places are left, and a bright button to reserve.
 *
 * `onBook` opens the booking form on the same page (the Events page); without
 * it the button goes to the Events page and opens the form there.
 */
export default function EventAd({ event, onBook }: { event: SiteEvent; onBook?: () => void }) {
  const { t, lang } = useI18n();
  const e = t.events;
  const ad = e.ad;
  const text = eventText(event, lang);
  const start = eventStart(event);
  const left = useCountdown(start);
  const locale = lang === 'am' ? 'am-ET' : 'en-GB';
  const inAddis = { timeZone: 'Africa/Addis_Ababa' } as const;
  const date = (options: Intl.DateTimeFormatOptions) => start.toLocaleDateString(locale, { ...inAddis, ...options });

  const full = event.placesLeft === 0 || event.availability === 'full';
  const photoKey = event.photo ?? (event.category === 'food' ? 'food' : undefined);
  const photo = photoKey && photoKey in photos ? photos[photoKey as PhotoKey] : undefined;
  const taken = event.capacity && event.placesLeft !== null ? Math.min(1, Math.max(0, (event.capacity - event.placesLeft) / event.capacity)) : null;
  const places = full
    ? e.live.full
    : event.placesLeft !== null && event.capacity
      ? fmt(ad.placesOf, { left: event.placesLeft, total: event.capacity })
      : event.availability === 'limited'
        ? e.live.limited
        : e.live.open;

  const cta = event.bookable && !full;
  const button = (
    <>
      {cta ? e.live.bookCta : t.common.contactUs}
      <span aria-hidden="true" className="btn-explore-arrow">→</span>
    </>
  );

  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [
    { value: left.days, label: ad.days },
    { value: left.hours, label: ad.hours },
    { value: left.minutes, label: ad.minutes },
    { value: left.seconds, label: ad.seconds },
  ];

  return (
    <article className="event-ad group relative grid lg:grid-cols-[minmax(0,44%)_1fr] overflow-hidden rounded-[2rem] bg-[#13261A] text-white shadow-[0_30px_60px_-30px_rgba(19,38,26,0.65)]">
      {/* the photograph, with the date like a ticket stub */}
      <div className="relative img-zoom aspect-[16/10] lg:aspect-auto lg:min-h-full">
        <Photo src={photo} alt={text.name} label={text.name} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,38,26,0)_45%,rgba(19,38,26,0.75)_100%)] lg:bg-[linear-gradient(90deg,rgba(19,38,26,0)_60%,rgba(19,38,26,0.9)_100%)]" />
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 w-[84px] rounded-2xl bg-white text-[#13261A] text-center overflow-hidden shadow-xl">
          <div className="bg-[#E2571C] text-white text-[11px] font-extrabold uppercase tracking-[0.14em] py-1.5">{date({ month: 'short' })}</div>
          <div className="font-display text-4xl font-extrabold leading-none pt-2">{date({ day: 'numeric' })}</div>
          <div className="text-[11px] font-bold text-[#13261A]/60 pb-2 pt-1">{date({ weekday: 'short' })}</div>
        </div>
        <span className="event-ad-ribbon absolute top-4 right-4 sm:top-5 sm:right-5">{event.featured ? ad.featured : ad.dontMiss}</span>
      </div>

      {/* the words, the countdown and the button */}
      <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/12 border border-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#B9D38A]">{e.categories[event.category]}</span>
          {event.partner && <span className="text-sm text-white/75">{fmt(e.live.partnerWith, { partner: event.partner })}</span>}
        </div>

        <div>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold leading-[1.02] tracking-tight">{wol(text.name)}</h3>
          {text.desc && <p className="mt-3 text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">{wol(text.desc)}</p>}
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
          <li className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF9A2E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></svg>
            {date({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </li>
          {event.time && (
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF9A2E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {event.time}
            </li>
          )}
          <li className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF9A2E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
            {wol(ad.where)}
          </li>
        </ul>

        {/* the countdown to the start */}
        {left.started ? (
          <div className="inline-flex items-center gap-3 self-start rounded-full bg-[#E2571C] px-5 py-2.5 font-extrabold">
            <span className="event-live-dot" aria-hidden="true" />
            {ad.live}
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF9A2E] mb-2">{ad.startsIn}</div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md" role="timer" aria-label={`${ad.startsIn} ${left.days} ${ad.days}, ${left.hours} ${ad.hours}, ${left.minutes} ${ad.minutes}`}>
              {units.map((unit) => (
                <div key={unit.label} className="rounded-2xl bg-white/[0.08] border border-white/15 py-3 text-center" aria-hidden="true">
                  <div className="font-display text-3xl sm:text-4xl font-extrabold tabular-nums leading-none">{pad(unit.value)}</div>
                  <div className="mt-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* the places, and the button */}
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
          {cta && onBook ? (
            <button type="button" onClick={onBook} className="btn-event">{button}</button>
          ) : (
            <Link to={cta ? `/events?book=${event.id}` : '/contact'} className="btn-event">{button}</Link>
          )}
          <div className="flex-1 min-w-0 sm:max-w-[15rem]">
            <div className="text-sm font-bold text-white">{places}</div>
            {/* how full it is, once someone has booked */}
            {taken !== null && taken > 0 && !full && (
              <div className="mt-2 h-2 rounded-full bg-white/15 overflow-hidden" aria-hidden="true">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FF9A2E] to-[#E2571C]" style={{ width: `${Math.max(6, taken * 100)}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
