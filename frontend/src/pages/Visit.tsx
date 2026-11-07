import { useRef, useState } from 'react';
import { FieldError, useFormCheck } from '../lib/formCheck';
import { LIMITS, VISIT_DAYS_AHEAD, addDays, checkEmail, checkName, checkPhone, checkText, checkVisitDate, todayInEthiopia } from '../lib/rules';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';
import LocationMap from '../components/LocationMap';
import { sendVisitRequest } from '../lib/api';
import Band from '../components/Band';

type ExperienceType = keyof Dictionary['visit']['types'];

/* Icons per option — labels live in the translations (t.visit.types) */
const experienceTypes: { id: ExperienceType }[] = [
  { id: 'heritage' },
  { id: 'cultural' },
  { id: 'food' },
  { id: 'restaurant' },
  { id: 'group' },
  { id: 'education' },
  { id: 'meeting' },
];

export default function Visit() {
  const { t, lang } = useI18n();
  const v = t.visit;
  const [selectedExp, setSelectedExp] = useState<ExperienceType[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', visitors: '1', message: '' });

  const toggleExp = (id: ExperienceType) => {
    setSelectedExp((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  // the same rules as the API (src/lib/rules.ts)
  const check = useFormCheck('visit', {
    name: () => checkName(form.name),
    phone: () => checkPhone(form.phone),
    email: () => checkEmail(form.email, false),
    date: () => checkVisitDate(form.date),
    message: () => {
      const problem = checkText(form.message, LIMITS.visitMessage, false);
      return problem && { problem, max: LIMITS.visitMessage };
    },
  });
  const change = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [name]: e.target.value }));
    if (name !== 'visitors') check.changed(name);
  };
  // the calendar offers today (in Ethiopia) up to two years ahead
  const today = todayInEthiopia();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);
    if (!check.all()) return;
    setSending(true);
    try {
      await sendVisitRequest({ ...form, experiences: selectedExp, language: lang, website: honeypot.current?.value });
      setSubmitted(true);
    } catch (err) {
      if (!check.fromServer(err)) setFailed(true);
    } finally {
      setSending(false);
    }
  };
  const input = 'w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]';
  const label = 'block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2';

  return (
    <main>
      {/* Hero */}
      <PageHero slot="visit" eyebrow={v.hero.eyebrow} title={v.hero.title} desc={t.common.locationLine} />

      {/* Info strip */}
      <Band className="py-4">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#346A1A] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                <a href="#map" className="block text-[#13261A] font-sans text-sm hover:text-[#346A1A] transition-colors">{t.common.addressLine1}</a>
                <div className="text-[#1E3A29]/70 font-sans text-xs">{t.common.addressLine2}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#346A1A] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                <div className="text-[#13261A] font-sans text-sm">{t.common.hoursDaily}</div>
                <div className="text-[#1E3A29]/70 font-sans text-xs">{t.common.eveningEvents}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#346A1A] text-xs font-sans tracking-wider uppercase mb-1">{t.common.contact}</div>
                <a href="tel:+251932196502" className="block text-[#13261A] font-sans text-sm hover:text-[#346A1A] transition-colors">+251 932 196 502</a>
                <a href="mailto:bushaashegaruwa@gmail.com" className="block text-[#1E3A29]/80 font-sans text-xs hover:text-[#346A1A] transition-colors">bushaashegaruwa@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* Booking form */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <span className="eyebrow mb-5">{v.booking.eyebrow}</span>
              <h2 className="font-display text-4xl font-semibold text-[#1E3A29] leading-tight mb-6">{v.booking.title}</h2>
              <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed mb-8">{v.booking.desc}</p>

              {/* Experience selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {experienceTypes.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    aria-pressed={selectedExp.includes(exp.id)}
                    onClick={() => toggleExp(exp.id)}
                    className={`p-4 text-left rounded-2xl border transition-all duration-200 ${
                      selectedExp.includes(exp.id)
                        ? 'border-[#3F7D20] bg-[#3F7D20] text-white'
                        : 'border-[#1E3A29]/20 bg-white hover:border-[#1E3A29]/50 text-[#1E3A29]'
                    }`}
                  >
                    <div className="font-sans font-semibold text-xs mb-1">{v.types[exp.id].label}</div>
                    <div className={`font-sans text-[10px] ${selectedExp.includes(exp.id) ? 'text-white/60' : 'text-[#1E3A29]/45'}`}>{v.types[exp.id].desc}</div>
                  </button>
                ))}
              </div>

              {/* Getting here */}
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#1E3A29] mb-5">{v.gettingHere.title}</h3>
                <div className="space-y-4">
                  {v.gettingHere.routes.map((route, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 bg-[#C4622D] mt-2 flex-shrink-0"/>
                      <div>
                        <div className="font-sans font-semibold text-sm text-[#1E3A29] mb-1">{route.from}</div>
                        <div className="font-sans text-xs text-[#1E3A29]/60 leading-relaxed">{route.dir}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-1 rounded-full bg-[#C4622D] mx-auto mb-8" />
                    <h3 className="font-display text-2xl font-semibold text-[#1E3A29] mb-3">{v.form.thanksTitle}</h3>
                    <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{v.form.thanksText}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-2xl font-semibold text-[#1E3A29] mb-6">{v.form.title}</h3>
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {/* hidden from people; spam bots fill it in */}
                      <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={label} htmlFor="visit-name">{v.form.name}</label>
                          <input {...check.field('name')} required type="text" autoComplete="name" maxLength={LIMITS.name} value={form.name} onChange={change('name')} className={input} placeholder={v.form.namePlaceholder} />
                          <FieldError check={check} name="name" />
                        </div>
                        <div>
                          <label className={label} htmlFor="visit-phone">{v.form.phone}</label>
                          <input {...check.field('phone')} required type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={form.phone} onChange={change('phone')} className={input} placeholder="0912 345 678" />
                          <FieldError check={check} name="phone" />
                        </div>
                      </div>
                      <div>
                        <label className={label} htmlFor="visit-email">{v.form.email}</label>
                        <input {...check.field('email')} type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={form.email} onChange={change('email')} className={input} placeholder="your@email.com" />
                        <FieldError check={check} name="email" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={label} htmlFor="visit-date">{v.form.date}</label>
                          <input {...check.field('date')} required type="date" min={today} max={addDays(today, VISIT_DAYS_AHEAD)} value={form.date} onChange={change('date')} className={input} />
                          <FieldError check={check} name="date" />
                        </div>
                        <div>
                          <label className={label} htmlFor="visit-visitors">{v.form.visitors}</label>
                          <select id="visit-visitors" value={form.visitors} onChange={change('visitors')} className={`${input} appearance-none`}>
                            {['1', '2', '3–5', '6–10', '11–20', '21–50', '50+'].map((n) => <option key={n} value={n}>{n === '1' ? v.form.visitorOne : fmt(v.form.visitorMany, { count: n })}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={label} htmlFor="visit-message">{v.form.message}</label>
                        <textarea {...check.field('message')} rows={3} maxLength={LIMITS.visitMessage} value={form.message} onChange={change('message')} className={`${input} resize-none`} placeholder={v.form.messagePlaceholder} />
                        <FieldError check={check} name="message" />
                      </div>
                      {selectedExp.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedExp.map((id) => (
                            <span key={id} className="bg-[#1E3A29]/10 text-[#1E3A29] text-xs font-sans rounded-full px-3 py-1">{v.types[id].label}</span>
                          ))}
                        </div>
                      )}
                      {check.hasErrors && <p className="text-sm font-sans font-semibold text-[#B42318]">{t.common.problems.fixFields}</p>}
                      {failed && <p role="alert" className="text-sm font-sans text-[#1E3A29]">{t.common.formError}</p>}
                      <button
                        type="submit"
                        disabled={sending}
                        aria-busy={sending}
                        className="btn-primary w-full"
                      >
                        {v.form.submit}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <LocationMap />
    </main>
  );
}
