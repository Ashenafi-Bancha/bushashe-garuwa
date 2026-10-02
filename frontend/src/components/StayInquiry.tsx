import { useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { en, type Dictionary } from '../i18n/dictionaries/en';
import { sendVisitRequest } from '../lib/api';
import ContactButtons from './ContactButtons';

export type RoomId = keyof Dictionary['stay']['rooms'];
const ROOMS: RoomId[] = ['standard', 'family', 'heritage'];
const GUESTS = ['1', '2', '3–5', '6–10'];
const NIGHTS = [1, 2, 3, 4, 5, 6, 7, 10, 14];

const FIELD = 'w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]';
const LABEL = 'block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2';

type Props = {
  /** The room chosen on the page, if any */
  room: RoomId | '';
  onRoom: (room: RoomId | '') => void;
};

/**
 * A request for a stay at the guesthouse. It reaches the staff area as a visit
 * request marked "Guesthouse", with the nights and the room in its message;
 * staff then call to confirm. Nothing is charged or reserved by the form itself.
 */
export default function StayInquiry({ room, onRoom }: Props) {
  const { t, lang } = useI18n();
  const words = t.stay.inquiry;
  const form = t.visit.form;
  const [fields, setFields] = useState({ name: '', phone: '', email: '', date: '', guests: '2', nights: '1', message: '' });
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields({ ...fields, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    // staff read requests in English, whatever language the visitor uses
    const summary = `Stay request: ${fields.nights} night(s). Room: ${room ? en.stay.rooms[room].name : 'any'}.`;
    try {
      await sendVisitRequest({
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        date: fields.date,
        visitors: fields.guests,
        experiences: ['guesthouse'],
        message: fields.message ? `${summary}\n${fields.message}` : summary,
        language: lang,
        website: honeypot.current?.value,
      });
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="book" className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24 scroll-mt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 lg:items-start">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-5">{words.title}</h2>
          <p className="text-[#1E3A29]/70 leading-relaxed mb-3">{words.desc}</p>
          <p className="text-[#1E3A29]/55 text-sm mb-8">{words.note}</p>
          {/* computers: beside the form. Phones: after it, so the form comes first */}
          <div className="hidden lg:block">
            <div className="text-[#0B6E40] text-xs font-bold tracking-wider uppercase mb-3">{words.or}</div>
            <ContactButtons />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm">
          {sent ? (
            <div className="text-center py-12" role="status">
              <div className="w-12 h-1 rounded-full bg-[#C4622D] mx-auto mb-8" />
              <h3 className="font-display text-2xl font-semibold text-[#1E3A29] mb-3">{words.thanksTitle}</h3>
              <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{words.thanksText}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {/* hidden from people; spam bots fill it in */}
              <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stay-name" className={LABEL}>{form.name}</label>
                  <input id="stay-name" required type="text" autoComplete="name" value={fields.name} onChange={set('name')} className={FIELD} placeholder={form.namePlaceholder} />
                </div>
                <div>
                  <label htmlFor="stay-phone" className={LABEL}>{form.phone}</label>
                  <input id="stay-phone" required type="tel" autoComplete="tel" value={fields.phone} onChange={set('phone')} className={FIELD} placeholder="+251..." />
                </div>
              </div>
              <div>
                <label htmlFor="stay-email" className={LABEL}>{form.email}</label>
                <input id="stay-email" type="email" autoComplete="email" value={fields.email} onChange={set('email')} className={FIELD} placeholder="your@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stay-date" className={LABEL}>{words.arrival}</label>
                  <input id="stay-date" required type="date" min={today} value={fields.date} onChange={set('date')} className={FIELD} />
                </div>
                <div>
                  <label htmlFor="stay-nights" className={LABEL}>{words.nights}</label>
                  <select id="stay-nights" value={fields.nights} onChange={set('nights')} className={`${FIELD} appearance-none`}>
                    {NIGHTS.map((n) => (
                      <option key={n} value={n}>{n === 1 ? words.nightOne : fmt(words.nightMany, { count: n })}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stay-guests" className={LABEL}>{words.guests}</label>
                  <select id="stay-guests" value={fields.guests} onChange={set('guests')} className={`${FIELD} appearance-none`}>
                    {GUESTS.map((n) => (
                      <option key={n} value={n}>{n === '1' ? words.guestOne : fmt(words.guestMany, { count: n })}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="stay-room" className={LABEL}>{words.room}</label>
                  <select id="stay-room" value={room} onChange={(e) => onRoom(e.target.value as RoomId | '')} className={`${FIELD} appearance-none`}>
                    <option value="">{words.anyRoom}</option>
                    {ROOMS.map((id) => (
                      <option key={id} value={id}>{t.stay.rooms[id].name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="stay-message" className={LABEL}>{form.message}</label>
                <textarea id="stay-message" rows={3} value={fields.message} onChange={set('message')} className={`${FIELD} resize-none`} placeholder={form.messagePlaceholder} />
              </div>
              {failed && <p role="alert" className="text-[#9A4A20] text-sm font-semibold">{t.common.formError}</p>}
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? words.sending : words.submit}
              </button>
            </form>
          )}
        </div>

        <div className="lg:hidden">
          <div className="text-[#0B6E40] text-xs font-bold tracking-wider uppercase mb-3">{words.or}</div>
          <ContactButtons />
        </div>
      </div>
    </section>
  );
}
