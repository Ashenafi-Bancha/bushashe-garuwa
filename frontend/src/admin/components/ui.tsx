import type { ReactNode } from 'react';
import { STATUSES, STATUS_LABELS, type RequestStatus } from '../api/types';

/** Small building blocks shared by the admin views. */

export function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[#173F35]/10 p-5">
      <div className="text-[#C99A45] text-[11px] font-semibold tracking-[0.16em] uppercase mb-2">{label}</div>
      <div className="font-display text-4xl text-[#0e2820] leading-none">{value}</div>
      {hint && <div className="text-[#1D211E]/45 text-xs mt-2">{hint}</div>}
    </div>
  );
}

const STATUS_STYLES: Record<RequestStatus, string> = {
  new: 'bg-[#C99A45]/15 text-[#8a6620]',
  in_progress: 'bg-[#173F35]/10 text-[#173F35]',
  done: 'bg-emerald-500/12 text-emerald-700',
  archived: 'bg-[#1D211E]/8 text-[#1D211E]/55',
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
      className="rounded-full border border-[#173F35]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#173F35] outline-none focus:border-[#173F35] disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
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
      <span className="text-[#1D211E]/50 text-xs">
        {total} in total, page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className="admin-btn-quiet">
          Previous
        </button>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} className="admin-btn-quiet">
          Next
        </button>
      </div>
    </div>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl bg-white border border-[#173F35]/10 p-5 sm:p-7">{children}</div>;
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error'; children: ReactNode }) {
  const styles = kind === 'error' ? 'bg-[#A65A3A]/10 text-[#8c4227]' : 'bg-[#173F35]/6 text-[#173F35]/70';
  return (
    <p role={kind === 'error' ? 'alert' : undefined} className={`rounded-2xl px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'full' });
