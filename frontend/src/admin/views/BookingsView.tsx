import { adminApi } from '../api/adminClient';
import type { Booking } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { BookingStatusSelect, Notice, Pager, Panel, formatDate, formatDateTime } from '../components/ui';

/** Places reserved at events, newest first. */
export default function BookingsView() {
  const { key } = useAdminSession();
  const { page, setPage, data, error, loading, busyId, changeStatus } = useAdminList<Booking>(
    (p) => adminApi.bookings(key, p),
    (id, status) => adminApi.setBookingStatus(key, id, status),
  );

  if (error) return <Notice kind="error">{error}</Notice>;
  if (loading && !data) return <Notice>Loading bookings…</Notice>;
  if (data && data.total === 0) return <Notice>No bookings yet.</Notice>;

  return (
    <Panel>
      <ul className="divide-y divide-[#173F35]/10">
        {data?.items.map((booking) => (
          <li key={booking.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-xl text-[#0e2820]">
                  <span className="text-[#C99A45] text-sm font-sans font-semibold tracking-wide mr-2">{booking.reference}</span>
                  {booking.name}
                  <span className="text-[#C99A45] text-base"> · {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </h3>
                <div className="text-sm text-[#1D211E]/60 mt-0.5">
                  <a href={`tel:${booking.phone.replace(/\s/g, '')}`} className="hover:text-[#C99A45]">{booking.phone}</a>
                  {booking.email && (
                    <>
                      {' · '}
                      <a href={`mailto:${booking.email}`} className="hover:text-[#C99A45]">{booking.email}</a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#1D211E]/40">booked {formatDateTime(booking.createdAt)}</span>
                <BookingStatusSelect status={booking.status} busy={busyId === booking.id} onChange={(status) => changeStatus(booking.id, status)} />
              </div>
            </div>

            <div className="text-sm text-[#173F35]">
              <span className="text-[#C99A45] text-[11px] uppercase tracking-wider mr-2">Event</span>
              {booking.eventName}
              {booking.eventDate ? ` · ${formatDate(booking.eventDate)}` : ''}
            </div>

            {booking.message && <p className="text-[#1D211E]/75 leading-relaxed whitespace-pre-line mt-2">{booking.message}</p>}
          </li>
        ))}
      </ul>
      {data && <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </Panel>
  );
}
