import { useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { ApiError } from '../lib/api';
import { bookEvent, eventText, type SiteEvent } from '../lib/events';
import { FieldError, useFormCheck } from '../lib/formCheck';
import { GUESTS_MAX, LIMITS, checkEmail, checkName, checkPhone, checkText, checkWholeNumber } from '../lib/rules';

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

  // at most the places left (and never more than one booking may hold)
  const most = Math.min(GUESTS_MAX, event.placesLeft ?? GUESTS_MAX);
  // the same rules as the API (src/lib/rules.ts)
  const check = useFormCheck('booking', {
    name: () => checkName(form.name),
    phone: () => checkPhone(form.phone),
    email: () => checkEmail(form.email, false),
    guests: () => {
      const problem = checkWholeNumber(form.guests, 1, most);
      return problem && { problem, min: 1, max: most };
    },
    message: () => {
      const problem = checkText(form.message, LIMITS.bookingMessage, false);
      return problem && { problem, max: LIMITS.bookingMessage };
    },
  });
  const change = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [name]: e.target.value }));
    check.changed(name);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed('');
    if (!check.all()) return;
    setSending(true);
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
      if (check.fromServer(err)) return;
      // the API's answers, in the visitor's language
      const left = err instanceof ApiError ? Number(err.details.placesLeft) : NaN;
      if (err instanceof ApiError && err.code === 'event_full') setFailed(b.noPlaces);
      else if (err instanceof ApiError && err.code === 'not_enough_places' && left > 0) setFailed(left === 1 ? b.onePlaceLeft : fmt(b.placesLeft, { count: left }));
      else setFailed(t.common.formError);
      onBooked?.(); // the places left have changed: show the new number
    } finally {
      setSending(false);
    }
  };

  const field = 'w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-sm text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]';
  const label = 'block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2';

  if (done) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <div className="w-12 h-1 rounded-full bg-[#C4622D] mx-auto mb-6" />
        <h3 className="font-display text-2xl text-[#1E3A29] mb-3">{b.thanksTitle}</h3>
        <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{b.thanksText}</p>
        {done.reference && (
          <div className="mt-6 inline-block rounded-2xl bg-[#F4EFE4] px-6 py-4">
            <div className="text-[#C4622D] text-[11px] font-semibold tracking-[0.16em] uppercase mb-1">{b.referenceLabel}</div>
            <div className="font-display text-2xl text-[#1E3A29] tracking-wide">{done.reference}</div>
            <p className="text-[#1E3A29]/50 text-xs mt-2 max-w-xs">{b.referenceNote}</p>
          </div>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="mt-6 text-[#1E3A29] font-sans text-sm font-semibold underline">
            {b.close}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-3xl p-6 sm:p-8 space-y-4">
      <div>
        <h3 className="font-display text-2xl text-[#1E3A29]">{b.title}</h3>
        <p className="text-[#1E3A29]/55 font-sans text-sm mt-1">{eventText(event, lang).name}</p>
        {event.placesLeft !== null && (
          <p className="text-[#1E3A29] font-sans text-sm mt-2">
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
          <input {...check.field('name')} required type="text" autoComplete="name" maxLength={LIMITS.name} value={form.name} onChange={change('name')} className={field} />
          <FieldError check={check} name="name" />
        </div>
        <div>
          <label className={label} htmlFor="booking-phone">{b.phone}</label>
          <input {...check.field('phone')} required type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={form.phone} onChange={change('phone')} className={field} placeholder="0912 345 678" />
          <FieldError check={check} name="phone" />
        </div>
        <div>
          <label className={label} htmlFor="booking-email">{b.email}</label>
          <input {...check.field('email')} type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={form.email} onChange={change('email')} className={field} />
          <FieldError check={check} name="email" />
        </div>
        <div>
          <label className={label} htmlFor="booking-guests">{b.guests}</label>
          <input {...check.field('guests')} required type="number" inputMode="numeric" min={1} max={most} step={1} value={form.guests} onChange={change('guests')} className={field} />
          <FieldError check={check} name="guests" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="booking-message">{b.message}</label>
        <textarea {...check.field('message')} rows={3} maxLength={LIMITS.bookingMessage} value={form.message} onChange={change('message')} className={`${field} resize-none`} placeholder={b.messagePlaceholder} />
        <FieldError check={check} name="message" />
      </div>

      {check.hasErrors && <p className="text-sm font-sans font-semibold text-[#B42318]">{t.common.problems.fixFields}</p>}
      {failed && <p role="alert" className="text-sm font-sans text-[#1E3A29]">{failed}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={sending}
          className="btn-primary flex-1 min-w-[12rem]"
        >
          {sending ? b.sending : b.submit}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn-outline text-[#1E3A29]">
            {b.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
