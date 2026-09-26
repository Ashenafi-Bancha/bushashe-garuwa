import type { ReactNode } from 'react';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS, STATUSES, STATUS_LABELS, type BookingStatus, type RequestStatus } from '../api/types';

/** Small building blocks shared by the admin views. */

export function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[#17463A]/10 p-4 sm:p-5">
      <div className="text-[#C8963C] text-[11px] font-semibold tracking-[0.16em] uppercase mb-1.5 sm:mb-2">{label}</div>
      <div className="font-display text-3xl sm:text-4xl text-[#0D2A1E] leading-none">{value}</div>
      {hint && <div className="text-[#1F2420]/45 text-xs mt-1.5 sm:mt-2">{hint}</div>}
    </div>
  );
}

const STATUS_STYLES: Record<RequestStatus, string> = {
  new: 'bg-[#C8963C]/15 text-[#8a6620]',
  in_progress: 'bg-[#17463A]/10 text-[#17463A]',
  done: 'bg-emerald-500/12 text-emerald-700',
  archived: 'bg-[#1F2420]/8 text-[#1F2420]/55',
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
      className="rounded-full border border-[#17463A]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#17463A] outline-none focus:border-[#17463A] disabled:opacity-50"
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
  pending: 'bg-[#C8963C]/15 text-[#8a6620]',
  confirmed: 'bg-emerald-500/12 text-emerald-700',
  attended: 'bg-[#17463A]/10 text-[#17463A]',
  cancelled: 'bg-[#1F2420]/8 text-[#1F2420]/50',
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
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#17463A]/30 disabled:opacity-50 ${BOOKING_STATUS_STYLES[status]}`}
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
      <span className="text-[#1F2420]/50 text-xs">
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
  return <div className="rounded-3xl bg-white border border-[#17463A]/10 p-5 sm:p-7">{children}</div>;
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error'; children: ReactNode }) {
  const styles = kind === 'error' ? 'bg-[#A85436]/10 text-[#8c4227]' : 'bg-[#17463A]/6 text-[#17463A]/70';
  return (
    <p role={kind === 'error' ? 'alert' : undefined} className={`rounded-2xl px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'full' });
