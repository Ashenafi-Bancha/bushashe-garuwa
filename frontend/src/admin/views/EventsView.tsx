import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { AdminEvent, SaveEventInput } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import EventForm, { emptyEvent } from '../components/EventForm';
import { Notice, Panel, formatDate } from '../components/ui';

/** Events staff manage: the cultural food evenings and everything else. */
export default function EventsView() {
  const { key } = useAdminSession();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editing, setEditing] = useState<{ id: number | null; values: SaveEventInput } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEvents((await adminApi.events(key)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the events');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = async (values: SaveEventInput) => {
    if (!editing) return;
    if (editing.id === null) await adminApi.createEvent(key, values);
    else await adminApi.updateEvent(key, editing.id, values);
    setEditing(null);
    await refresh();
  };

  const remove = async (event: AdminEvent) => {
    if (!confirm(`Remove "${event.translations.en.name}"? This cannot be undone.`)) return;
    setBusyId(event.id);
    try {
      await adminApi.deleteEvent(key, event.id);
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
      await adminApi.updateEvent(key, event.id, { ...current, ...change });
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing({ id: null, values: emptyEvent() })}
          className="rounded-full bg-[#0e2820] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#1e5447] transition-colors"
        >
          Add an event
        </button>
        <button type="button" onClick={refresh} className="admin-btn-quiet">
          Refresh
        </button>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {loading && events.length === 0 && <Notice>Loading events…</Notice>}
      {!loading && events.length === 0 && !error && (
        <Notice>No events yet. Add the next cultural food evening so it shows on the website.</Notice>
      )}

      {events.length > 0 && (
        <Panel>
          <ul className="divide-y divide-[#173F35]/10">
            {events.map((event) => (
              <li key={event.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display text-xl text-[#0e2820]">{event.translations.en.name}</h3>
                      {!event.published && <span className="rounded-full bg-[#1D211E]/8 text-[#1D211E]/55 text-xs font-semibold px-2.5 py-0.5">Draft</span>}
                      {event.featured && <span className="rounded-full bg-[#C99A45]/15 text-[#8a6620] text-xs font-semibold px-2.5 py-0.5">On the home page</span>}
                      {event.date < today && <span className="rounded-full bg-[#1D211E]/8 text-[#1D211E]/55 text-xs font-semibold px-2.5 py-0.5">Past</span>}
                    </div>
                    <div className="text-sm text-[#1D211E]/60">
                      {formatDate(event.date)}
                      {event.time ? ` · ${event.time}` : ''} · {event.category}
                      {event.partner ? ` · with ${event.partner}` : ''}
                    </div>
                    {event.bookable && (
                      <div className="text-sm mt-1">
                        {event.capacity === null ? (
                          <span className="text-[#1D211E]/50">Open bookings, no limit</span>
                        ) : (
                          <span className={event.placesLeft === 0 ? 'text-[#A65A3A] font-semibold' : 'text-[#173F35]'}>
                            {event.capacity - (event.placesLeft ?? 0)} of {event.capacity} places booked
                            {event.placesLeft === 0 ? ' · full' : ` · ${event.placesLeft} left`}
                          </span>
                        )}
                      </div>
                    )}
                    {event.translations.en.desc && (
                      <p className="text-[#1D211E]/70 text-sm mt-2 max-w-2xl">{event.translations.en.desc}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === event.id}
                      onClick={() => toggle(event, { published: !event.published })}
                      className="admin-btn-quiet"
                    >
                      {event.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === event.id}
                      onClick={() => toggle(event, { featured: !event.featured })}
                      className="admin-btn-quiet"
                    >
                      {event.featured ? 'Remove from home' : 'Show on home'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const { id: _id, createdAt: _c, updatedAt: _u, placesLeft: _p, ...values } = event;
                        setEditing({ id: event.id, values });
                      }}
                      className="admin-btn-quiet"
                    >
                      Edit
                    </button>
                    <button type="button" disabled={busyId === event.id} onClick={() => remove(event)} className="admin-btn-quiet">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
