import { useEffect, useState, type ReactNode } from 'react';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS, STATUSES, STATUS_LABELS, type BookingStatus, type RequestStatus } from '../api/types';
import { Icon, type IconName } from './icons';

/** Small building blocks shared by the admin views. */

export function StatCard({
  label,
  value,
  hint,
  icon,
  onClick,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: IconName;
  /** makes the card a way into the section its number comes from */
  onClick?: () => void;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-[#1E3A29]/60 text-[13px] font-semibold leading-snug">{label}</span>
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#3F7D20]/10 text-[#3F7D20] flex-shrink-0">
          <Icon name={icon} />
        </span>
      </div>
      <div className="font-display text-4xl font-extrabold tracking-[-0.04em] text-[#1E3A29] leading-none tabular-nums">{value}</div>
      {hint && <div className="text-[#1E3A29]/45 text-xs mt-2">{hint}</div>}
    </>
  );
  const card = 'block w-full text-left rounded-2xl bg-white border border-[#1E3A29]/8 p-5 shadow-[0_1px_2px_rgba(30,58,41,0.04),0_12px_26px_-22px_rgba(30,58,41,0.35)] transition-all duration-300';
  return onClick ? (
    <button type="button" onClick={onClick} className={`${card} hover:border-[#3F7D20]/40 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(30,58,41,0.05),0_20px_34px_-22px_rgba(30,58,41,0.45)]`}>
      {body}
    </button>
  ) : (
    <div className={card}>{body}</div>
  );
}

/* the brand's own colours: clay for what is waiting, green for what is done */
const STATUS_STYLES: Record<RequestStatus, string> = {
  new: 'bg-[#C4622D]/12 text-[#9A4A20]',
  in_progress: 'bg-[#E8B23A]/20 text-[#7A5A10]',
  done: 'bg-[#3F7D20]/12 text-[#346A1A]',
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
  confirmed: 'bg-[#3F7D20]/12 text-[#346A1A]',
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
  return <div className="rounded-2xl bg-white border border-[#1E3A29]/8 p-5 sm:p-7 shadow-[0_1px_2px_rgba(30,58,41,0.04),0_14px_30px_-26px_rgba(30,58,41,0.4)]">{children}</div>;
}

const NOTICE_STYLES = {
  info: 'bg-white border border-[#1E3A29]/8 text-[#1E3A29]/70',
  success: 'bg-[#3F7D20]/10 text-[#346A1A]',
  error: 'bg-[#C4622D]/12 text-[#8c4227]',
};

export function Notice({ kind = 'info', children }: { kind?: keyof typeof NOTICE_STYLES; children: ReactNode }) {
  const styles = NOTICE_STYLES[kind];
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
        className="w-full rounded-full border border-[#1E3A29]/12 bg-white pl-11 pr-4 py-3 text-sm text-[#1E3A29] outline-none placeholder:text-[#1E3A29]/35 focus:border-[#3F7D20] transition-colors"
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

/** The pair of buttons at the foot of a row: Edit (when the row can be edited) and Delete, in red */
export function RowActions({ onEdit, onDelete, busy = false }: { onEdit?: () => void; onDelete: () => void; busy?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {onEdit && (
        <button type="button" disabled={busy} onClick={onEdit} className="inline-flex admin-btn-quiet">
          <Icon name="pencil" className="w-3.5 h-3.5" />
          Edit
        </button>
      )}
      <button type="button" disabled={busy} onClick={onDelete} className="inline-flex admin-btn-quiet danger">
        <Icon name="trash" className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
}

/** One labelled field of a small edit form inside a row */
export function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[#1E3A29]/65 text-[11px] font-bold tracking-[0.12em] uppercase mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/** Save and Cancel under a small edit form */
export function EditButtons({ busy, onCancel }: { busy: boolean; onCancel: () => void }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <button type="submit" disabled={busy} className="admin-btn">
        {busy ? 'Saving…' : 'Save changes'}
      </button>
      <button type="button" disabled={busy} onClick={onCancel} className="inline-flex admin-btn-quiet">
        Cancel
      </button>
    </div>
  );
}

/** A phone number as WhatsApp wants it: digits only, with Ethiopia's code instead of a leading 0 */
export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('251')) return digits;
  if (digits.startsWith('0')) return `251${digits.slice(1)}`;
  if (digits.length === 9) return `251${digits}`;
  return digits;
}

/**
 * One tap to reach the guest: Call, WhatsApp and Email, each shown only when the
 * guest gave that contact. The usual way to answer a request.
 */
export function ContactActions({ name, phone, email, subject }: { name: string; phone?: string | null; email?: string | null; subject: string }) {
  if (!phone && !email) return null;
  const first = name.split(' ')[0] ?? name;
  const greeting = encodeURIComponent(`Hello ${first}, this is Bushaashe Garuwa. `);
  const button = 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5';
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {phone && (
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={`${button} bg-[#3F7D20] text-white hover:bg-[#346A1A]`}>
          <Icon name="phone" className="w-4 h-4" />
          Call
        </a>
      )}
      {phone && (
        <a
          href={`https://wa.me/${whatsappNumber(phone)}?text=${greeting}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button} bg-[#25D366]/12 text-[#0F7A3A] hover:bg-[#25D366]/20`}
        >
          <Icon name="chat" className="w-4 h-4" />
          WhatsApp
        </a>
      )}
      {email && (
        <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} className={`${button} bg-[#1E3A29]/8 text-[#1E3A29] hover:bg-[#1E3A29]/14`}>
          <Icon name="mail" className="w-4 h-4" />
          Email
        </a>
      )}
    </div>
  );
}

/** The card that offers to install the staff app (or explains how on an iPhone) */
export function InstallCard({ canInstall, appleHint, onInstall }: { canInstall: boolean; appleHint: boolean; onInstall: () => void }) {
  if (!canInstall && !appleHint) return null;
  return (
    <div className="rounded-2xl bg-[#3F7D20] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_18px_34px_-24px_rgba(63,125,32,0.9)]">
      <img src="/staff/icon-192.png" alt="" className="w-14 h-14 rounded-2xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg font-extrabold">Install the staff app</div>
        <p className="text-white/85 text-sm mt-1 leading-relaxed">
          {canInstall
            ? 'Open the staff area from your home screen like any app: faster, full screen, one tap away.'
            : 'On iPhone or iPad: tap the Share button in Safari, then "Add to Home Screen".'}
        </p>
      </div>
      {canInstall && (
        <button type="button" onClick={onInstall} className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#346A1A] font-bold text-sm px-5 py-3 hover:bg-[#E3EBD8] transition-colors flex-shrink-0">
          <Icon name="download" className="w-4 h-4" />
          Install
        </button>
      )}
    </div>
  );
}
