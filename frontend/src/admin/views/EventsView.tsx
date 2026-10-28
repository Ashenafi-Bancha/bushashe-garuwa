import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { AdminEvent, SaveEventInput } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import EventForm, { emptyEvent } from '../components/EventForm';
import { Icon } from '../components/icons';
import { Notice, formatDate } from '../components/ui';

/** Events staff manage: the cultural food evenings and everything else. */
export default function EventsView() {
  const { token } = useAdminSession();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editing, setEditing] = useState<{ id: number | null; values: SaveEventInput } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEvents((await adminApi.events(token)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the events');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = async (values: SaveEventInput) => {
    if (!editing) return;
    if (editing.id === null) await adminApi.createEvent(token, values);
    else await adminApi.updateEvent(token, editing.id, values);
    setEditing(null);
    await refresh();
  };

  const remove = async (event: AdminEvent) => {
    if (!confirm(`Delete "${event.translations.en.name}"? This cannot be undone.`)) return;
    setBusyId(event.id);
    try {
      await adminApi.deleteEvent(token, event.id);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not remove the event');
    } finally {
      setBusyId(null);
    }
  };

  const toggle = async (event: AdminEvent, change: Partial<SaveEventInput>) => {
    setBusyId(event.id);
    try {
      const { id: _id, createdAt: _c, updatedAt: _u, placesLeft: _p, ...current } = event;
      await adminApi.updateEvent(token, event.id, { ...current, ...change });
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the change');
    } finally {
      setBusyId(null);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  if (editing) {
    return (
      <EventForm
        initial={editing.values}
        heading={editing.id === null ? 'New event' : 'Edit event'}
        onCancel={() => setEditing(null)}
        onSave={save}
      />
    );
  }

  const tag = 'rounded-md px-2 py-0.5 text-[11.5px] font-semibold';
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setEditing({ id: null, values: emptyEvent() })} className="inline-flex admin-btn">
          <Icon name="plus" className="w-4 h-4" />
          Add an event
        </button>
        <button type="button" onClick={refresh} aria-label="Refresh" title="Refresh" className="admin-icon-btn bordered !w-10 !h-10">
          <Icon name="refresh" className="w-4 h-4" />
        </button>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {loading && events.length === 0 && <Notice>Loading events…</Notice>}
      {!loading && events.length === 0 && !error && <Notice>No events yet. Add the next cultural food evening so it shows on the website.</Notice>}

      {events.length > 0 && (
        <ul className="admin-card !p-0 divide-y divide-[var(--a-border)] overflow-hidden">
          {events.map((event) => {
            const day = new Date(`${event.date}T00:00:00`);
            const past = event.date < today;
            const booked = event.capacity === null ? null : event.capacity - (event.placesLeft ?? 0);
            return (
              <li key={event.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 ${past ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* the date, like a page of a calendar */}
                  <span className="flex-shrink-0 w-12 text-center rounded-xl border border-[var(--a-border)] overflow-hidden">
                    <span className="block bg-[var(--a-brand)] text-white text-[10.5px] font-bold uppercase py-0.5">{day.toLocaleDateString('en-GB', { month: 'short' })}</span>
                    <span className="block text-[18px] font-bold text-[var(--a-ink)] leading-tight py-1 tabular-nums">{day.getDate()}</span>
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-[15px] font-semibold text-[var(--a-ink)] mr-1">{event.translations.en.name}</h3>
                      {!event.published && <span className={`${tag} bg-[#EFEDE6] text-[var(--a-muted)]`}>Draft</span>}
                      {event.featured && <span className={`${tag} bg-[#FBEAE0] text-[#9A4A20]`}>On the home page</span>}
                      {past && <span className={`${tag} bg-[#EFEDE6] text-[var(--a-muted)]`}>Past</span>}
                    </div>
                    <div className="text-[13px] text-[var(--a-muted)] mt-0.5">
                      {formatDate(event.date)}
                      {event.time ? ` · ${event.time}` : ''}
                      {event.partner ? ` · with ${event.partner}` : ''}
                    </div>
                    {event.bookable && (
                      <div className="text-[13px] text-[var(--a-ink)] mt-1">
                        {booked === null ? 'Bookings open, no limit' : `${booked} of ${event.capacity} places booked${event.placesLeft === 0 ? ' · full' : ` · ${event.placesLeft} left`}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:flex-shrink-0 pl-[62px] sm:pl-0">
                  <button type="button" disabled={busyId === event.id} onClick={() => toggle(event, { published: !event.published })} className="inline-flex admin-btn-quiet !min-h-9">
                    <Icon name={event.published ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                    {event.published ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === event.id}
                    onClick={() => toggle(event, { featured: !event.featured })}
                    aria-label={event.featured ? 'Take off the home page' : 'Show on the home page'}
                    title={event.featured ? 'Take off the home page' : 'Show on the home page'}
                    className={`admin-icon-btn ${event.featured ? '!text-[#C4622D]' : ''}`}
                  >
                    <Icon name={event.featured ? 'starFilled' : 'star'} className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const { id: _id, createdAt: _c, updatedAt: _u, placesLeft: _p, ...values } = event;
                      setEditing({ id: event.id, values });
                    }}
                    aria-label="Edit"
                    title="Edit"
                    className="admin-icon-btn"
                  >
                    <Icon name="pencil" className="w-[18px] h-[18px]" />
                  </button>
                  <button type="button" disabled={busyId === event.id} onClick={() => remove(event)} aria-label="Delete" title="Delete" className="admin-icon-btn danger">
                    <Icon name="trash" className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
