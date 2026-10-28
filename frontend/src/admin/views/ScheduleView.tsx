import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import { BOOKING_STATUS_LABELS, type Schedule, type ScheduleDay, type ScheduledEvent, type ScheduledVisit } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar from '../components/Avatar';
import { Icon } from '../components/icons';
import { ContactActions, Fact, ListSkeleton, Notice, StatusSelect, whatsappNumber } from '../components/ui';

const DAYS = 14;

/** Today's date in Ethiopia, as YYYY-MM-DD */
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Addis_Ababa' }).format(new Date());

const addDays = (date: string, n: number) => {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + n);
  return day.toISOString().slice(0, 10);
};

const asDate = (date: string) => new Date(`${date}T00:00:00`);

/** "Today", "Tomorrow", or "Saturday 24 October" */
export function dayTitle(date: string): string {
  if (date === today()) return 'Today';
  if (date === addDays(today(), 1)) return 'Tomorrow';
  return asDate(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** The guests booked for an event, against the places it has */
function EventCard({ event }: { event: ScheduledEvent }) {
  const share = event.capacity ? Math.min(100, Math.round((event.guests / event.capacity) * 100)) : null;
  return (
    <div className="admin-card !p-4 sm:!p-5">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-[#C4622D]/12 text-[#9A4A20] flex-shrink-0">
          <Icon name="events" />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-[16px] text-[var(--a-ink)] leading-tight">{event.name || 'Event'}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {event.time && <Fact icon="clock">{event.time}</Fact>}
            <Fact icon="guests" tone="strong">
              {event.guests} {event.guests === 1 ? 'guest' : 'guests'}
              {event.capacity ? ` of ${event.capacity}` : ''}
            </Fact>
            {!event.published && <Fact icon="eyeOff">Not on the website</Fact>}
          </div>
        </div>
      </div>
      {share !== null && (
        <div className="mt-3.5 h-2 rounded-full bg-[#1E3A29]/8 overflow-hidden" aria-hidden="true">
          <div className={`h-full rounded-full ${share >= 90 ? 'bg-[#C4622D]' : 'bg-[#3F7D20]'}`} style={{ width: `${share}%` }} />
        </div>
      )}
      {event.bookings.length > 0 ? (
        <ul className="mt-3.5 divide-y divide-[var(--a-border)] rounded-2xl bg-[var(--a-bg)] overflow-hidden">
          {event.bookings.map((booking) => (
            <li key={booking.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <Avatar name={booking.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-[var(--a-ink)] truncate">{booking.name}</span>
                <span className="block text-[12px] text-[var(--a-muted)]">
                  {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'} · {BOOKING_STATUS_LABELS[booking.status]} · <span className="font-mono">{booking.reference}</span>
                </span>
              </span>
              <a href={`tel:${booking.phone.replace(/[^\d+]/g, '')}`} aria-label={`Call ${booking.name}`} className="grid place-items-center w-9 h-9 rounded-full bg-[#3F7D20] text-white active:scale-90 transition-transform">
                <Icon name="phone" className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${whatsappNumber(booking.phone)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${booking.name}`} className="grid place-items-center w-9 h-9 rounded-full bg-[#25D366]/15 text-[#0F7A3A] active:scale-90 transition-transform">
                <Icon name="chat" className="w-4 h-4" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[13px] text-[var(--a-faint)]">No bookings yet.</p>
      )}
    </div>
  );
}

/** A group expected for a visit */
function VisitCard({ visit, busy, onStatus }: { visit: ScheduledVisit; busy: boolean; onStatus: (status: ScheduledVisit['status']) => void }) {
  return (
    <div className={`admin-card !p-4 sm:!p-5 ${visit.status === 'new' ? 'admin-card-new' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar name={visit.name} />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-[16px] text-[var(--a-ink)] leading-tight truncate">{visit.name}</h4>
          <div className="text-[13px] text-[var(--a-muted)] truncate mt-0.5">{visit.phone}</div>
        </div>
        <StatusSelect status={visit.status} busy={busy} onChange={onStatus} />
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <Fact icon="guests" tone="strong">
          {visit.visitors} {visit.visitors === '1' ? 'guest' : 'guests'}
        </Fact>
        {visit.experiences.length > 0 && <Fact icon="sparkle">{visit.experiences.length} {visit.experiences.length === 1 ? 'wish' : 'wishes'}</Fact>}
      </div>
      {visit.message && <p className="mt-3 border-l-2 border-[var(--a-border)] pl-3 text-[13.5px] text-[#3C4740] leading-relaxed line-clamp-3">{visit.message}</p>}
      <ContactActions name={visit.name} phone={visit.phone} email={visit.email} subject="Your visit to Bushaashe Garuwa" />
    </div>
  );
}

/** How much is planned on a day */
const sizeOf = (day: ScheduleDay | undefined) => ({
  visits: day?.visits.length ?? 0,
  events: day?.events.length ?? 0,
  guests: day?.events.reduce((sum, e) => sum + e.guests, 0) ?? 0,
});

/** Who is coming, day by day: a strip of days to choose from, and that day's visits and events. */
export default function ScheduleView() {
  const { token } = useAdminSession();
  const [from, setFrom] = useState(today);
  const [chosen, setChosen] = useState(today);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setSchedule(await adminApi.schedule(token, from, DAYS));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the schedule');
    }
  }, [token, from]);
  useEffect(() => void load(), [load]);

  const byDate = useMemo(() => new Map(schedule?.days.map((d) => [d.date, d]) ?? []), [schedule]);
  const strip = Array.from({ length: DAYS }, (_, i) => addDays(from, i));
  const day = byDate.get(chosen);
  const size = sizeOf(day);

  const move = (n: number) => {
    const next = addDays(from, n);
    setFrom(next);
    setChosen(next);
  };

  const setVisitStatus = async (visit: ScheduledVisit, status: ScheduledVisit['status']) => {
    setBusyId(visit.id);
    try {
      await adminApi.setVisitStatus(token, visit.id, status);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the status');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* the days, to swipe through */}
      <div className="admin-card !p-3 sm:!p-4">
        <div className="flex items-center justify-between gap-2 px-1 mb-2.5">
          <button type="button" onClick={() => move(-DAYS)} aria-label="Two weeks earlier" className="grid place-items-center w-9 h-9 rounded-full hover:bg-[#1E3A29]/6 active:scale-90 text-[var(--a-muted)]">
            <Icon name="arrowLeft" className="w-4 h-4" />
          </button>
          <div className="text-center">
            <div className="font-display font-bold text-[15px] text-[var(--a-ink)]">
              {asDate(from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {asDate(addDays(from, DAYS - 1)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            {from !== today() && (
              <button type="button" onClick={() => { setFrom(today()); setChosen(today()); }} className="text-[12px] font-bold text-[#346A1A]">
                Back to today
              </button>
            )}
          </div>
          <button type="button" onClick={() => move(DAYS)} aria-label="Two weeks later" className="grid place-items-center w-9 h-9 rounded-full hover:bg-[#1E3A29]/6 active:scale-90 text-[var(--a-muted)]">
            <Icon name="arrowRight" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar snap-x pb-1">
          {strip.map((date) => {
            const d = asDate(date);
            const s = sizeOf(byDate.get(date));
            const active = date === chosen;
            const isToday = date === today();
            return (
              <button
                key={date}
                type="button"
                onClick={() => setChosen(date)}
                aria-pressed={active}
                aria-label={`${dayTitle(date)}: ${s.visits} visits, ${s.events} events`}
                className={`snap-start flex-shrink-0 w-[52px] rounded-2xl py-2.5 flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                  active ? 'bg-[#3F7D20] text-white shadow-[0_10px_20px_-10px_rgba(63,125,32,0.9)]' : isToday ? 'bg-[var(--a-brand-soft)] text-[var(--a-ink)]' : 'text-[#3C4740] hover:bg-[#1E3A29]/5'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase ${active ? 'text-white/80' : 'text-[var(--a-faint)]'}`}>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                <span className="font-display text-[19px] font-extrabold leading-none tabular-nums">{d.getDate()}</span>
                <span className="flex gap-1 h-1.5 mt-1">
                  {s.visits > 0 && <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-[#3F7D20]'}`} />}
                  {s.events > 0 && <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#F5C59F]' : 'bg-[#C4622D]'}`} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {!schedule && !error && <ListSkeleton rows={2} />}

      {schedule && (
        <div key={chosen} className="admin-enter space-y-5">
          <div className="flex items-end justify-between gap-3 px-1">
            <div>
              <h3 className="text-[20px] font-bold text-[var(--a-ink)] tracking-[-0.01em]">{dayTitle(chosen)}</h3>
              <p className="text-[13px] text-[var(--a-muted)] mt-0.5">
                {size.visits || size.events
                  ? [size.visits && `${size.visits} ${size.visits === 1 ? 'visit' : 'visits'}`, size.events && `${size.events} ${size.events === 1 ? 'event' : 'events'}`, size.guests && `${size.guests} booked guests`].filter(Boolean).join(' · ')
                  : 'Nothing planned yet'}
              </p>
            </div>
            <span className="flex items-center gap-3 text-[11px] font-semibold text-[var(--a-faint)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3F7D20]" />Visits</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C4622D]" />Events</span>
            </span>
          </div>

          {size.visits === 0 && size.events === 0 && (
            <div className="admin-card text-center !py-10">
              <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-[var(--a-brand-soft)] text-[var(--a-brand)] mb-3">
                <Icon name="schedule" className="w-7 h-7" />
              </span>
              <p className="font-bold text-[var(--a-ink)]">A quiet day</p>
              <p className="text-[13px] text-[var(--a-muted)] mt-1">No visits or events on this day yet.</p>
            </div>
          )}

          {day && day.events.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9A4A20] px-1">Events</h4>
              {day.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          )}

          {day && day.visits.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#346A1A] px-1">Visits</h4>
              {day.visits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} busy={busyId === visit.id} onStatus={(status) => setVisitStatus(visit, status)} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/** The Home screen's look at today and tomorrow, with the way into the schedule */
export function TodayAgenda({ onOpen }: { onOpen: () => void }) {
  const { token } = useAdminSession();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  useEffect(() => {
    adminApi.schedule(token, today(), 2).then(setSchedule).catch(() => undefined);
  }, [token]);

  const days = [today(), addDays(today(), 1)].map((date) => ({ date, day: schedule?.days.find((d) => d.date === date) }));
  return (
    <section className="admin-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <h2 className="admin-h3">Today & tomorrow</h2>
        <button type="button" onClick={onOpen} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--a-brand)]">
          Schedule
          <Icon name="chevronRight" className="w-4 h-4" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--a-border)] border-t border-[var(--a-border)]">
        {days.map(({ date, day }) => {
          const people = [...(day?.events.map((e) => ({ key: `e${e.id}`, label: `${e.name} · ${e.guests} guests`, event: true })) ?? []), ...(day?.visits.map((v) => ({ key: `v${v.id}`, label: `${v.name} · ${v.visitors}`, event: false })) ?? [])];
          return (
            <button key={date} type="button" onClick={onOpen} className="text-left px-5 py-4 hover:bg-[var(--a-bg)]/60 active:bg-[var(--a-bg)] transition-colors">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--a-faint)]">{dayTitle(date)}</div>
              {!schedule ? (
                <span className="admin-shimmer block h-3.5 w-2/3 rounded-full mt-2.5" />
              ) : people.length === 0 ? (
                <div className="text-[14px] text-[var(--a-muted)] mt-1.5">Nothing planned</div>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {people.slice(0, 3).map((p) => (
                    <li key={p.key} className="flex items-center gap-2 text-[14px] text-[var(--a-ink)] truncate">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.event ? 'bg-[#C4622D]' : 'bg-[#3F7D20]'}`} />
                      <span className="truncate">{p.label}</span>
                    </li>
                  ))}
                  {people.length > 3 && <li className="text-[12px] font-bold text-[#346A1A]">+{people.length - 3} more</li>}
                </ul>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
