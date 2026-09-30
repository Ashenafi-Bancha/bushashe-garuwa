import { useEffect, useState, type ReactNode } from 'react';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS, STATUSES, STATUS_LABELS, type BookingStatus, type RequestStatus } from '../api/types';

/** Small building blocks shared by the admin views. */

export function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white elev-1 p-4 sm:p-6">
      <div className="flex items-center gap-2 text-[#1E3A29]/60 text-xs sm:text-sm font-semibold mb-3">
        <span className="w-2 h-2 rounded-full bg-[#86A94F] flex-shrink-0" />{label}
      </div>
      <div className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[#1E3A29] leading-none">{value}</div>
      {hint && <div className="text-[#1E3A29]/45 text-xs mt-1.5 sm:mt-2">{hint}</div>}
    </div>
  );
}

const STATUS_STYLES: Record<RequestStatus, string> = {
  new: 'bg-[#C4622D]/12 text-[#9A4A20]',
  in_progress: 'bg-[#1E3A29]/10 text-[#1E3A29]',
  done: 'bg-emerald-500/12 text-emerald-700',
  archived: 'bg-[#13261A]/8 text-[#1E3A29]/55',
};

export function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StatusSelect({
  status,
  busy,
  onChange,
}: {
  status: RequestStatus;
  busy?: boolean;
  onChange: (status: RequestStatus) => void;
}) {
  return (
    <select
      value={status}
      disabled={busy}
      onChange={(e) => onChange(e.target.value as RequestStatus)}
      aria-label="Change status"
      className="rounded-full border border-[#1E3A29]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A29] outline-none focus:border-[#1E3A29] disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-[#C4622D]/12 text-[#9A4A20]',
  confirmed: 'bg-emerald-500/12 text-emerald-700',
  attended: 'bg-[#1E3A29]/10 text-[#1E3A29]',
  cancelled: 'bg-[#13261A]/8 text-[#1E3A29]/50',
};

/** Bookings move pending → confirmed → came, or are cancelled (which frees the places) */
export function BookingStatusSelect({
  status,
  busy,
  onChange,
}: {
  status: BookingStatus;
  busy?: boolean;
  onChange: (status: BookingStatus) => void;
}) {
  return (
    <select
      value={status}
      disabled={busy}
      onChange={(e) => onChange(e.target.value as BookingStatus)}
      aria-label="Change booking status"
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#1E3A29]/30 disabled:opacity-50 ${BOOKING_STATUS_STYLES[status]}`}
    >
      {BOOKING_STATUSES.map((s) => (
        <option key={s} value={s}>
          {BOOKING_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

export function Pager({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between gap-4 pt-5">
      <span className="text-[#1E3A29]/50 text-xs">
        {total} in total, page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className="inline-flex admin-btn-quiet">
          Previous
        </button>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} className="inline-flex admin-btn-quiet">
          Next
        </button>
      </div>
    </div>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl bg-white border border-[#1E3A29]/10 elev-2 p-5 sm:p-7">{children}</div>;
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error'; children: ReactNode }) {
  const styles = kind === 'error' ? 'bg-[#1E3A29]/10 text-[#8c4227]' : 'bg-[#1E3A29]/6 text-[#1E3A29]/70';
  return (
    <p role={kind === 'error' ? 'alert' : undefined} className={`rounded-2xl px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'full' });

/**
 * Search box for the staff lists. It waits until typing pauses before asking
 * the API, so each keystroke does not send a request.
 */
export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E3A29]/35 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7.5" />
        <path d="m20.5 20.5-4.2-4.2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#1E3A29]/12 bg-white pl-11 pr-4 py-3 text-sm text-[#1E3A29] outline-none placeholder:text-[#1E3A29]/35 focus:border-[#1E3A29] transition-colors"
      />
    </label>
  );
}

/** A value that follows another one, but only once it has stopped changing for `delay` ms */
export function useDebounced<T>(value: T, delay = 300): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}
