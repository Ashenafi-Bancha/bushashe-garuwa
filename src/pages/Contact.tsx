import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <span className="eyebrow glass text-white mb-5">{c.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] max-w-xl">{c.hero.title}</h1>
        </div>
      </section>

      {/* Contact content */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Left: info */}
            <div>
              <p className="text-[#1D211E]/65 font-sans text-base leading-relaxed mb-12 max-w-md">
                {c.intro}
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl border border-[#C99A45]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#C99A45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.phone}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">+251 XXX XXX XXX</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.phoneNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl border border-[#C99A45]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#C99A45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.email}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">info@bushashegdestination.et</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.emailNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl border border-[#C99A45]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#C99A45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">{t.common.brand}</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.locationLine1}<br/>{c.locationLine2}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl border border-[#C99A45]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#C99A45]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">{t.common.hoursDaily}</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{t.common.eveningEvents}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-[#173F35]/10">
                <div className="text-[#1D211E]/40 text-xs font-sans tracking-wider uppercase mb-4">{c.social}</div>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'YouTube'].map((s) => (
                    <a key={s} href="#" className="border border-[#173F35]/20 hover:border-[#C99A45] text-[#173F35]/60 hover:text-[#C99A45] text-xs font-sans rounded-full px-4 py-2 transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-6">✉️</div>
                  <h3 className="font-display text-2xl font-semibold text-[#173F35] mb-3">{c.form.sentTitle}</h3>
                  <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">{c.form.sentText}</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-[#173F35] mb-7">{c.form.title}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{c.form.name}</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]"
                        placeholder={c.form.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{c.form.phone}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]"
                        placeholder="+251..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{c.form.email}</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">{c.form.message}</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 font-sans text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0] resize-none"
                        placeholder={c.form.messagePlaceholder}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-sans font-semibold text-sm rounded-full py-4 transition-colors"
                    >
                      {c.form.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
