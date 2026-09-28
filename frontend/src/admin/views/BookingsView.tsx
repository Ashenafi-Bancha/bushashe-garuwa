import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import type { Booking } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { BookingStatusSelect, Notice, Pager, Panel, SearchBox, formatDate, formatDateTime, useDebounced } from '../components/ui';

/** Places reserved at events, newest first. */
export default function BookingsView() {
  const { key } = useAdminSession();
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const { page, setPage, data, error, loading, busyId, changeStatus } = useAdminList<Booking>(
    (p) => adminApi.bookings(key, p, query),
    (id, status) => adminApi.setBookingStatus(key, id, status),
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

  if (error) return <div className="space-y-4">{box}<Notice kind="error">{error}</Notice></div>;
  if (loading && !data) return <div className="space-y-4">{box}<Notice>Loading bookings…</Notice></div>;
  if (data && data.total === 0) return <div className="space-y-4">{box}<Notice>{nothing}</Notice></div>;

  return (
    <div className="space-y-4">
    {box}
    <Panel>
      <ul className="divide-y divide-[#35723A]/10">
        {data?.items.map((booking) => (
          <li key={booking.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-xl text-[#12150F]">
                  <span className="text-[#B8863B] text-sm font-sans font-semibold tracking-wide mr-2">{booking.reference}</span>
                  {booking.name}
                  <span className="text-[#B8863B] text-base"> · {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </h3>
                <div className="text-sm text-[#12150F]/60 mt-0.5">
                  <a href={`tel:${booking.phone.replace(/\s/g, '')}`} className="hover:text-[#B8863B]">{booking.phone}</a>
                  {booking.email && (
                    <>
                      {' · '}
                      <a href={`mailto:${booking.email}`} className="hover:text-[#B8863B]">{booking.email}</a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#12150F]/40">booked {formatDateTime(booking.createdAt)}</span>
                <BookingStatusSelect status={booking.status} busy={busyId === booking.id} onChange={(status) => changeStatus(booking.id, status)} />
              </div>
            </div>

            <div className="text-sm text-[#35723A]">
              <span className="text-[#B8863B] text-[11px] uppercase tracking-wider mr-2">Event</span>
              {booking.eventName}
              {booking.eventDate ? ` · ${formatDate(booking.eventDate)}` : ''}
            </div>

            {booking.message && <p className="text-[#12150F]/75 leading-relaxed whitespace-pre-line mt-2">{booking.message}</p>}
          </li>
        ))}
      </ul>
      {data && <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </Panel>
    </div>
  );
}
