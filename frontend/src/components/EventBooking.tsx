import { useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { bookEvent, eventText, type SiteEvent } from '../lib/events';

/** Reserve places at an event, for example the cultural food evening. */
export default function EventBooking({
  event,
  onClose,
  onBooked,
}: {
  event: SiteEvent;
  onClose?: () => void;
  /** lets the page show the new number of places left */
  onBooked?: () => void;
}) {
  const { t, lang } = useI18n();
  const b = t.events.booking;
  const [form, setForm] = useState({ name: '', phone: '', email: '', guests: '2', message: '' });
  const [done, setDone] = useState<{ reference: string | null } | null>(null);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState('');
  const honeypot = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed('');
    try {
      const result = await bookEvent(event.id, {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        guests: Number(form.guests),
        message: form.message || undefined,
        language: lang,
        website: honeypot.current?.value,
      });
      setDone({ reference: result?.reference ?? null });
      onBooked?.();
    } catch (err) {
      setFailed((err as Error).message || t.common.formError);
    } finally {
      setSending(false);
    }
  };

  const field = 'w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]';
  const label = 'block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2';

  if (done) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <div className="w-12 h-1 rounded-full bg-[#C99A45] mx-auto mb-6" />
        <h3 className="font-display text-2xl text-[#173F35] mb-3">{b.thanksTitle}</h3>
        <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">{b.thanksText}</p>
        {done.reference && (
          <div className="mt-6 inline-block rounded-2xl bg-[#F7F5F0] px-6 py-4">
            <div className="text-[#C99A45] text-[11px] font-semibold tracking-[0.16em] uppercase mb-1">{b.referenceLabel}</div>
            <div className="font-display text-2xl text-[#173F35] tracking-wide">{done.reference}</div>
            <p className="text-[#1D211E]/50 text-xs mt-2 max-w-xs">{b.referenceNote}</p>
          </div>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="mt-6 text-[#173F35] font-sans text-sm font-semibold underline">
            {b.close}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl p-6 sm:p-8 space-y-4">
      <div>
        <h3 className="font-display text-2xl text-[#173F35]">{b.title}</h3>
        <p className="text-[#1D211E]/55 font-sans text-sm mt-1">{eventText(event, lang).name}</p>
        {event.placesLeft !== null && (
          <p className="text-[#A65A3A] font-sans text-sm mt-2">
            {event.placesLeft === 0
              ? b.noPlaces
              : event.placesLeft === 1
                ? b.onePlaceLeft
                : fmt(b.placesLeft, { count: event.placesLeft })}
          </p>
        )}
      </div>

      <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="booking-name">{b.name}</label>
          <input id="booking-name" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="booking-phone">{b.phone}</label>
          <input id="booking-phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="+251..." />
        </div>
        <div>
          <label className={label} htmlFor="booking-email">{b.email}</label>
          <input id="booking-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="booking-guests">{b.guests}</label>
          <input
            id="booking-guests"
            required
            type="number"
            min={1}
            max={event.placesLeft ?? 200}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="booking-message">{b.message}</label>
        <textarea id="booking-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${field} resize-none`} placeholder={b.messagePlaceholder} />
      </div>

      {failed && <p role="alert" className="text-sm font-sans text-[#A65A3A]">{failed}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 min-w-[12rem] bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-sans font-semibold text-sm rounded-full py-4 transition-colors disabled:opacity-60"
        >
          {sending ? b.sending : b.submit}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-full border border-[#173F35]/20 px-6 py-4 text-sm font-sans font-semibold text-[#173F35] hover:border-[#173F35]/50 transition-colors">
            {b.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
