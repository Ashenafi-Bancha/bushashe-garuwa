import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';
import LocationMap from '../components/LocationMap';
import { sendVisitRequest } from '../lib/api';

type ExperienceType = keyof Dictionary['visit']['types'];

/* Icons per option — labels live in the translations (t.visit.types) */
const experienceTypes: { id: ExperienceType }[] = [
  { id: 'heritage' },
  { id: 'cultural' },
  { id: 'food' },
  { id: 'restaurant' },
  { id: 'guesthouse' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    try {
      await sendVisitRequest({ ...form, experiences: selectedExp, language: lang, website: honeypot.current?.value });
      setSubmitted(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <PageHero photo="lawn" pos="object-[center_62%]" eyebrow={v.hero.eyebrow} title={v.hero.title} desc={t.common.locationLine} />

      {/* Info strip */}
      <section className="bg-[#1E3A29] mx-2 sm:mx-3 rounded-[2rem] py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                <a href="#map" className="block text-white font-sans text-sm hover:text-[#C4622D] transition-colors">{t.common.addressLine1}</a>
                <div className="text-white/50 font-sans text-xs">{t.common.addressLine2}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                <div className="text-white font-sans text-sm">{t.common.hoursDaily}</div>
                <div className="text-white/50 font-sans text-xs">{t.common.eveningEvents}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="text-[#B9D38A] text-xs font-sans tracking-wider uppercase mb-1">{t.common.contact}</div>
                <a href="tel:+251932196502" className="block text-white font-sans text-sm hover:text-[#B9D38A] transition-colors">+251 932 196 502</a>
                <a href="mailto:info@bushaashegaruwa.com" className="block text-white/60 font-sans text-xs hover:text-[#B9D38A] transition-colors">info@bushaashegaruwa.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <div className="text-[#1E3A29] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{v.booking.eyebrow}</div>
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
                        ? 'border-[#1E3A29] bg-[#1E3A29] text-white'
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* hidden from people; spam bots fill it in */}
                      <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.name}</label>
                          <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]"
                            placeholder={v.form.namePlaceholder}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.phone}</label>
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]"
                            placeholder="+251..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.email}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.date}</label>
                          <input
                            required
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.visitors}</label>
                          <select
                            value={form.visitors}
                            onChange={(e) => setForm({ ...form, visitors: e.target.value })}
                            className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4] appearance-none"
                          >
                            {['1', '2', '3–5', '6–10', '11–20', '21–50', '50+'].map((n) => <option key={n} value={n}>{n === '1' ? v.form.visitorOne : fmt(v.form.visitorMany, { count: n })}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2">{v.form.message}</label>
                        <textarea
                          rows={3}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-base text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4] resize-none"
                          placeholder={v.form.messagePlaceholder}
                        />
                      </div>
                      {selectedExp.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedExp.map((id) => (
                            <span key={id} className="bg-[#1E3A29]/10 text-[#1E3A29] text-xs font-sans rounded-full px-3 py-1">{v.types[id].label}</span>
                          ))}
                        </div>
                      )}
                      {failed && <p role="alert" className="text-sm font-sans text-[#1E3A29]">{t.common.formError}</p>}
                      <button
                        type="submit"
                        disabled={sending}
                        aria-busy={sending}
                        className="w-full bg-[#1E3A29] hover:bg-[#2D5239] text-[#F4EFE4] font-sans font-semibold text-sm rounded-full py-4 transition-colors disabled:opacity-60"
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
