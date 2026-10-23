import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import { BOOKING_STATUS_LABELS, type Booking, type BookingStatus } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
import { useAdminList } from '../components/useAdminList';
import {
  BookingStatusSelect,
  ContactActions,
  EditButtons,
  EditField,
  Fact,
  FilterChips,
  IconActions,
  ListSkeleton,
  Notice,
  Pager,
  SearchBox,
  useDebounced,
  whenLabel,
} from '../components/ui';

type Draft = { id: number; name: string; phone: string; email: string; guests: string; message: string };
type StatusFilter = BookingStatus | 'all';

/** Places reserved at events, newest first. */
export default function BookingsView({ pendingCount }: { pendingCount?: number }) {
  const { token } = useAdminSession();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const [draft, setDraft] = useState<Draft | null>(null);
  const { page, setPage, data, error, loading, busyId, changeStatus, act } = useAdminList<Booking>(
    (p) => adminApi.bookings(token, p, query, undefined, status === 'all' ? undefined : status),
    (id, next) => adminApi.setBookingStatus(token, id, next),
    [query, status],
  );

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

  const nothing = query ? `Nothing matches "${query}".` : status !== 'all' ? `No bookings marked "${BOOKING_STATUS_LABELS[status]}".` : 'No bookings yet.';

  return (
    <div className="space-y-4">
      <SearchBox
        value={search}
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        placeholder="Search by booking number (BG-…), name or phone"
      />
      <FilterChips<StatusFilter>
        options={[
          { value: 'all', label: 'All' },
          { value: 'pending', label: BOOKING_STATUS_LABELS.pending, count: pendingCount },
          { value: 'confirmed', label: BOOKING_STATUS_LABELS.confirmed },
          { value: 'attended', label: BOOKING_STATUS_LABELS.attended },
          { value: 'cancelled', label: BOOKING_STATUS_LABELS.cancelled },
        ]}
        value={status}
        onChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />

      {error && <Notice kind="error">{error}</Notice>}
      {loading && !data && <ListSkeleton />}
      {data?.total === 0 && !error && <Notice>{nothing}</Notice>}

      {data && data.total > 0 && (
        <>
          <ul className="space-y-3">
            {data.items.map((booking) => (
              <li key={booking.id} className={`admin-card !p-4 sm:!p-5 ${booking.status === 'pending' ? 'admin-card-new' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={booking.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[16px] text-[#1E3A29] leading-tight truncate">{booking.name}</h3>
                    <div className="text-[13px] text-[#1E3A29]/55 truncate mt-0.5">
                      <span className="font-mono font-semibold text-[#9A4A20]">{booking.reference}</span> · {booking.phone}
                    </div>
                  </div>
                  <BookingStatusSelect status={booking.status} busy={busyId === booking.id} onChange={(next) => changeStatus(booking.id, next)} />
                </div>

                <div className="mt-3.5 rounded-2xl bg-[#3F7D20]/7 px-4 py-3">
                  <div className="text-[11px] font-bold text-[#346A1A] uppercase tracking-wider">Event</div>
                  <div className="font-bold text-[14px] text-[#1E3A29] mt-0.5">{booking.eventName}</div>
                  {booking.eventDate && <div className="text-[13px] text-[#1E3A29]/60">{whenLabel(booking.eventDate)}</div>}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Fact icon="guests" tone="strong">
                    {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                  </Fact>
                  {booking.email && <Fact icon="mail">{booking.email}</Fact>}
                </div>

                {booking.message && <p className="mt-3 rounded-2xl rounded-tl-md bg-[#F4EFE4] px-4 py-3 text-[14px] text-[#1E3A29]/80 leading-relaxed whitespace-pre-line">{booking.message}</p>}
                <div className="text-[11px] text-[#1E3A29]/40 mt-2.5">Booked {timeAgo(booking.createdAt)}</div>

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
                  <ContactActions name={booking.name} phone={booking.phone} email={booking.email} subject={`Your booking at Bushaashe Garuwa (${booking.reference})`}>
                    <IconActions
                      busy={busyId === booking.id}
                      onEdit={() => setDraft({ id: booking.id, name: booking.name, phone: booking.phone, email: booking.email ?? '', guests: String(booking.guests), message: booking.message ?? '' })}
                      onDelete={() => remove(booking)}
                    />
                  </ContactActions>
                )}
              </li>
            ))}
          </ul>
          <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
