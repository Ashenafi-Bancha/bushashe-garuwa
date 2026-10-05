import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import type { Booking } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { BookingStatusSelect, EditButtons, EditField, Notice, Pager, Panel, RowActions, SearchBox, formatDate, formatDateTime, useDebounced } from '../components/ui';

type Draft = { id: number; name: string; phone: string; email: string; guests: string; message: string };

/** Places reserved at events, newest first. */
export default function BookingsView() {
  const { token } = useAdminSession();
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const [draft, setDraft] = useState<Draft | null>(null);
  const { page, setPage, data, error, loading, busyId, changeStatus, act } = useAdminList<Booking>(
    (p) => adminApi.bookings(token, p, query),
    (id, status) => adminApi.setBookingStatus(token, id, status),
    [query],
  );

  const box = (
    <SearchBox
      value={search}
      onChange={(value) => {
        setPage(1);
        setSearch(value);
      }}
      placeholder="Search by booking number (BG-…), name or phone"
    />
  );
  const nothing = query ? `Nothing matches "${query}".` : 'No bookings yet.';

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const { id, guests, ...values } = draft;
    if (await act(id, () => adminApi.updateBooking(token, id, { ...values, guests: Number(guests) }), 'Could not save the changes')) setDraft(null);
  };

  const remove = (booking: Booking) => {
    if (!confirm(`Delete booking ${booking.reference} (${booking.name})? Its places go back to the event. This cannot be undone.`)) return;
    void act(booking.id, () => adminApi.deleteBooking(token, booking.id), 'Could not delete the booking');
  };

  // a list that failed to load shows only the error; a failed edit keeps the list and shows the error above it
  if (error && !data) return <div className="space-y-4">{box}<Notice kind="error">{error}</Notice></div>;
  if (loading && !data) return <div className="space-y-4">{box}<Notice>Loading bookings…</Notice></div>;
  if (data && data.total === 0) return <div className="space-y-4">{box}<Notice>{nothing}</Notice></div>;

  return (
    <div className="space-y-4">
    {box}
    {error && <Notice kind="error">{error}</Notice>}
    <Panel>
      <ul className="divide-y divide-[#1E3A29]/10">
        {data?.items.map((booking) => (
          <li key={booking.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-xl text-[#1E3A29]">
                  <span className="text-[#C4622D] text-sm font-sans font-semibold tracking-wide mr-2">{booking.reference}</span>
                  {booking.name}
                  <span className="text-[#C4622D] text-base"> · {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </h3>
                <div className="text-sm text-[#1E3A29]/60 mt-0.5">
                  <a href={`tel:${booking.phone.replace(/\s/g, '')}`} className="hover:text-[#C4622D]">{booking.phone}</a>
                  {booking.email && (
                    <>
                      {' · '}
                      <a href={`mailto:${booking.email}`} className="hover:text-[#C4622D]">{booking.email}</a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#1E3A29]/40">booked {formatDateTime(booking.createdAt)}</span>
                <BookingStatusSelect status={booking.status} busy={busyId === booking.id} onChange={(status) => changeStatus(booking.id, status)} />
              </div>
            </div>

            <div className="text-sm text-[#1E3A29]">
              <span className="text-[#C4622D] text-[11px] uppercase tracking-wider mr-2">Event</span>
              {booking.eventName}
              {booking.eventDate ? ` · ${formatDate(booking.eventDate)}` : ''}
            </div>

            {booking.message && <p className="text-[#1E3A29]/75 leading-relaxed whitespace-pre-line mt-2">{booking.message}</p>}

            {draft?.id === booking.id ? (
              <form onSubmit={save} className="mt-4 rounded-2xl bg-[#F4EFE4] p-4 sm:p-5 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <EditField label="Name">
                    <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="admin-field" />
                  </EditField>
                  <EditField label="Phone">
                    <input required type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="admin-field" />
                  </EditField>
                  <EditField label="Email">
                    <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="admin-field" />
                  </EditField>
                  <EditField label="Guests">
                    <input required type="number" min={1} max={200} value={draft.guests} onChange={(e) => setDraft({ ...draft, guests: e.target.value })} className="admin-field" />
                  </EditField>
                </div>
                <EditField label="Note">
                  <textarea rows={3} value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} className="admin-field resize-y" />
                </EditField>
                <EditButtons busy={busyId === booking.id} onCancel={() => setDraft(null)} />
              </form>
            ) : (
              <RowActions
                busy={busyId === booking.id}
                onEdit={() => setDraft({ id: booking.id, name: booking.name, phone: booking.phone, email: booking.email ?? '', guests: String(booking.guests), message: booking.message ?? '' })}
                onDelete={() => remove(booking)}
              />
            )}
          </li>
        ))}
      </ul>
      {data && <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </Panel>
    </div>
  );
}
