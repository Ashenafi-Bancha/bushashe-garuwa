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
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[var(--a-muted)] leading-snug">{label}</span>
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--a-brand-soft)] text-[var(--a-brand)] flex-shrink-0">
          <Icon name={icon} className="w-4 h-4" />
        </span>
      </div>
      <div className="text-[28px] sm:text-[30px] font-bold tracking-[-0.03em] text-[var(--a-ink)] leading-none tabular-nums mt-2">{value}</div>
      {hint && <div className="text-[12px] text-[var(--a-faint)] mt-1.5">{hint}</div>}
    </>
  );
  const card = 'block w-full text-left admin-card !p-4 transition-colors';
  return onClick ? (
    <button type="button" onClick={onClick} className={`${card} hover:border-[#D6D2C6] hover:bg-[#FCFBF8]`}>
      {body}
    </button>
  ) : (
    <div className={card}>{body}</div>
  );
}

/* the brand's own colours: clay for what is waiting, green for what is done */
const STATUS_STYLES: Record<RequestStatus, string> = {
  new: 'bg-[#FBEAE0] text-[#9A4A20]',
  in_progress: 'bg-[#FBF1D6] text-[#7A5A10]',
  done: 'bg-[#E8F2DF] text-[#2E5E17]',
  archived: 'bg-[#EFEDE6] text-[#66706A]',
};

export function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_STYLES[status]}`}>
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
      className={`admin-chip-select ${STATUS_STYLES[status]}`}
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
  pending: 'bg-[#FBEAE0] text-[#9A4A20]',
  confirmed: 'bg-[#E8F2DF] text-[#2E5E17]',
  attended: 'bg-[#E4ECF4] text-[#2B4A66]',
  cancelled: 'bg-[#EFEDE6] text-[#66706A]',
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
      className={`admin-chip-select ${BOOKING_STATUS_STYLES[status]}`}
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
    <div className="flex items-center justify-between gap-4 pt-4">
      <span className="text-[var(--a-muted)] text-[13px]">
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
  return <div className="admin-card">{children}</div>;
}

const NOTICE_STYLES = {
  info: 'bg-white border border-[var(--a-border)] text-[var(--a-muted)]',
  success: 'bg-[#E8F2DF] border border-[#CFE3BE] text-[#2E5E17]',
  error: 'bg-[#FCEDEC] border border-[#F1C4C1] text-[#9B2C25]',
};

export function Notice({ kind = 'info', children }: { kind?: keyof typeof NOTICE_STYLES; children: ReactNode }) {
  const styles = NOTICE_STYLES[kind];
  return (
    <p role={kind === 'error' ? 'alert' : undefined} className={`rounded-xl px-4 py-3 text-[14px] ${styles}`}>
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
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--a-faint)] pointer-events-none"
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
        className="admin-field !pl-10"
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
      <span className="block text-[var(--a-muted)] text-[12.5px] font-semibold mb-1.5">{label}</span>
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
export function ContactActions({ name, phone, email, subject, children }: { name: string; phone?: string | null; email?: string | null; subject: string; children?: ReactNode }) {
  if (!phone && !email && !children) return null;
  const first = name.split(' ')[0] ?? name;
  const greeting = encodeURIComponent(`Hello ${first}, this is Bushaashe Garuwa. `);
  const button = 'inline-flex items-center gap-1.5 rounded-[9px] px-3 h-9 text-[13px] font-semibold transition-colors active:scale-95';
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
      {phone && (
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={`${button} bg-[var(--a-brand)] text-white hover:bg-[var(--a-brand-dark)]`}>
          <Icon name="phone" className="w-4 h-4" />
          Call
        </a>
      )}
      {phone && (
        <a
          href={`https://wa.me/${whatsappNumber(phone)}?text=${greeting}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${button} border border-[var(--a-border)] bg-white text-[#0F7A3A] hover:bg-[var(--a-hover)]`}
        >
          <Icon name="chat" className="w-4 h-4" />
          WhatsApp
        </a>
      )}
      {email && (
        <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} className={`${button} border border-[var(--a-border)] bg-white text-[var(--a-ink)] hover:bg-[var(--a-hover)]`}>
          <Icon name="mail" className="w-4 h-4" />
          Email
        </a>
      )}
      {children}
    </div>
  );
}

/** The card that offers to install the staff app (or explains how on an iPhone) */
export function InstallCard({ canInstall, appleHint, onInstall }: { canInstall: boolean; appleHint: boolean; onInstall: () => void }) {
  if (!canInstall && !appleHint) return null;
  return (
    <div className="admin-card !p-4 sm:!p-5 flex items-center gap-3.5">
      <img src="/staff/icon-192.png" alt="" className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-[var(--a-ink)]">Get the staff app</div>
        <p className="text-[var(--a-muted)] text-[13px] leading-snug mt-0.5">
          {canInstall ? 'On your home screen, full screen, one tap away.' : 'In Safari: tap Share, then "Add to Home Screen".'}
        </p>
      </div>
      {canInstall && (
        <button type="button" onClick={onInstall} className="inline-flex admin-btn !min-h-9 !px-3.5 !text-[13px] flex-shrink-0 !w-auto">
          <Icon name="download" className="w-4 h-4" />
          Install
        </button>
      )}
    </div>
  );
}

/** A row of choices to narrow a list: All, New, In progress… with how many each holds when known */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg h-8 px-3 text-[13px] font-semibold border transition-colors ${
              active ? 'bg-[var(--a-ink)] border-[var(--a-ink)] text-white' : 'bg-white border-[var(--a-border)] text-[var(--a-muted)] hover:text-[var(--a-ink)] hover:bg-[var(--a-hover)]'
            }`}
          >
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span className={`min-w-[18px] h-[18px] rounded-full text-[10.5px] leading-[18px] px-1.5 text-center tabular-nums ${active ? 'bg-white/20' : 'bg-[#C4622D] text-white'}`}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Two choices side by side, like a phone's segmented control */
export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="inline-grid grid-flow-col auto-cols-fr rounded-[10px] bg-[#ECEAE3] p-[3px]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          className={`rounded-[8px] h-[30px] px-3.5 text-[13px] font-semibold transition-all ${option.value === value ? 'bg-white text-[var(--a-ink)] shadow-[0_1px_3px_rgba(19,38,26,0.15)]' : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** A small label with an icon, for the facts of a request (its date, the number of guests…) */
export function Fact({ icon, children, tone = 'plain' }: { icon: IconName; children: ReactNode; tone?: 'plain' | 'strong' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] font-medium ${tone === 'strong' ? 'bg-[var(--a-brand-soft)] text-[#2E5E17]' : 'bg-[#F1EFE9] text-[#4D574F]'}`}>
      <Icon name={icon} className="w-3.5 h-3.5" />
      {children}
    </span>
  );
}

/** Round edit and delete buttons, at the end of a card's row of actions */
export function IconActions({ onEdit, onDelete, busy = false }: { onEdit?: () => void; onDelete: () => void; busy?: boolean }) {
  return (
    <span className="flex gap-1 ml-auto">
      {onEdit && (
        <button type="button" disabled={busy} onClick={onEdit} aria-label="Edit" title="Edit" className="admin-icon-btn">
          <Icon name="pencil" className="w-4 h-4" />
        </button>
      )}
      <button type="button" disabled={busy} onClick={onDelete} aria-label="Delete" title="Delete" className="admin-icon-btn danger">
        <Icon name="trash" className="w-4 h-4" />
      </button>
    </span>
  );
}

/** "today", "tomorrow", "in 3 days", or the date, for a visit or an event */
export function whenLabel(date: string): string {
  const day = new Date(`${date.slice(0, 10)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((day.getTime() - today.getTime()) / 86400000);
  const short = day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  if (days === 0) return `Today · ${short}`;
  if (days === 1) return `Tomorrow · ${short}`;
  if (days > 1 && days < 7) return `In ${days} days · ${short}`;
  return day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/** Grey cards that shimmer while a list loads, in the shape of the cards to come */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="space-y-3" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="admin-card !p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="admin-shimmer w-10 h-10 rounded-full" />
            <span className="flex-1 space-y-2">
              <span className="admin-shimmer block h-3.5 w-2/5 rounded-full" />
              <span className="admin-shimmer block h-3 w-3/5 rounded-full" />
            </span>
          </div>
          <span className="admin-shimmer block h-8 w-full rounded-lg mt-4" />
        </li>
      ))}
    </ul>
  );
}
