import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

type ExperienceType = keyof Dictionary['visit']['types'];

/* Icons per option — labels live in the translations (t.visit.types) */
const experienceTypes: { id: ExperienceType; icon: string }[] = [
  { id: 'heritage', icon: '🏛' },
  { id: 'cultural', icon: '🎭' },
  { id: 'food', icon: '🍲' },
  { id: 'restaurant', icon: '🍽' },
  { id: 'guesthouse', icon: '🏡' },
  { id: 'group', icon: '👥' },
  { id: 'education', icon: '📚' },
];

export default function Visit() {
  const { t } = useI18n();
  const v = t.visit;
  const [selectedExp, setSelectedExp] = useState<ExperienceType[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', visitors: '1', message: '' });

  const toggleExp = (id: ExperienceType) => {
    setSelectedExp((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <img src={photos.lawn} alt={t.photos.lawn} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{v.hero.eyebrow}</div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">{v.hero.title}</h1>
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-[#173F35] py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <svg className="w-5 h-5 text-[#C99A45] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <div>
                <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                <div className="text-white font-sans text-sm">{t.common.addressLine1}</div>
                <div className="text-white/50 font-sans text-xs">{t.common.addressLine2}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <svg className="w-5 h-5 text-[#C99A45] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                <div className="text-white font-sans text-sm">{t.common.hoursDaily}</div>
                <div className="text-white/50 font-sans text-xs">{t.common.eveningEvents}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <svg className="w-5 h-5 text-[#C99A45] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div>
                <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.contact}</div>
                <div className="text-white font-sans text-sm">+251 XXX XXX XXX</div>
                <div className="text-white/50 font-sans text-xs">info@bushashegdestination.et</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{v.booking.eyebrow}</div>
              <h2 className="font-serif text-4xl font-light text-[#173F35] leading-tight mb-6">{v.booking.title}</h2>
              <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed mb-8">{v.booking.desc}</p>

              {/* Experience selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {experienceTypes.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    aria-pressed={selectedExp.includes(exp.id)}
                    onClick={() => toggleExp(exp.id)}
                    className={`p-4 text-left border transition-all duration-200 ${
                      selectedExp.includes(exp.id)
                        ? 'border-[#173F35] bg-[#173F35] text-white'
                        : 'border-[#173F35]/20 bg-white hover:border-[#173F35]/50 text-[#173F35]'
                    }`}
                  >
                    <div className="text-2xl mb-2">{exp.icon}</div>
                    <div className="font-sans font-semibold text-xs mb-1">{v.types[exp.id].label}</div>
                    <div className={`font-sans text-[10px] ${selectedExp.includes(exp.id) ? 'text-white/60' : 'text-[#1D211E]/45'}`}>{v.types[exp.id].desc}</div>
                  </button>
                ))}
              </div>

              {/* Getting here */}
              <div>
                <h3 className="font-serif text-2xl font-light text-[#173F35] mb-5">{v.gettingHere.title}</h3>
                <div className="space-y-4">
                  {v.gettingHere.routes.map((route, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 bg-[#C99A45] mt-2 flex-shrink-0"/>
                      <div>
                        <div className="font-sans font-semibold text-sm text-[#173F35] mb-1">{route.from}</div>
                        <div className="font-sans text-xs text-[#1D211E]/60 leading-relaxed">{route.dir}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="bg-white p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-6">✓</div>
                    <h3 className="font-serif text-2xl font-light text-[#173F35] mb-3">{v.form.thanksTitle}</h3>
                    <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">{v.form.thanksText}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-2xl font-light text-[#173F35] mb-6">{v.form.title}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.name}</label>
                          <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7]"
                            placeholder={v.form.namePlaceholder}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.phone}</label>
                          <input
                            required
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7]"
                            placeholder="+251..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.email}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7]"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.date}</label>
                          <input
                            required
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.visitors}</label>
                          <select
                            value={form.visitors}
                            onChange={(e) => setForm({ ...form, visitors: e.target.value })}
                            className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7] appearance-none"
                          >
                            {['1', '2', '3–5', '6–10', '11–20', '21–50', '50+'].map((n) => <option key={n} value={n}>{n === '1' ? v.form.visitorOne : fmt(v.form.visitorMany, { count: n })}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{v.form.message}</label>
                        <textarea
                          rows={3}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-base text-[#1D211E] outline-none transition-colors bg-[#F6F1E7] resize-none"
                          placeholder={v.form.messagePlaceholder}
                        />
                      </div>
                      {selectedExp.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedExp.map((id) => (
                            <span key={id} className="bg-[#173F35]/10 text-[#173F35] text-xs font-sans px-3 py-1">{v.types[id].label}</span>
                          ))}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-sans font-semibold text-sm tracking-widest uppercase py-4 transition-colors"
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
    </main>
  );
}
