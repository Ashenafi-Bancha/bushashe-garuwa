import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from '../components/SocialLinks';
import PageHero from '../components/PageHero';
import LocationMap from '../components/LocationMap';
import { sendContactMessage } from '../lib/api';

export default function Contact() {
  const { t, lang } = useI18n();
  const c = t.contact;
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    try {
      await sendContactMessage({ ...form, language: lang, website: honeypot.current?.value });
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
      <PageHero photo="gardens" eyebrow={c.hero.eyebrow} title={c.hero.title} desc={c.intro} />

      {/* Contact content */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Left: info */}
            <div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.phone}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">+251 XXX XXX XXX</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.phoneNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.email}</div>
                    <a href="mailto:info@bushaashegaruwa.com" className="block text-[#173F35] font-sans text-base font-medium hover:text-[#C99A45] transition-colors">info@bushaashegaruwa.com</a>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.emailNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                    <a href="#map" className="block text-[#173F35] font-sans text-base font-medium hover:text-[#C99A45] transition-colors">{t.common.brand}</a>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{c.locationLine1}<br/>{c.locationLine2}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                    <div className="text-[#173F35] font-sans text-base font-medium">{t.common.hoursDaily}</div>
                    <div className="text-[#1D211E]/45 font-sans text-sm mt-0.5">{t.common.eveningEvents}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-[#173F35]/10">
                <div className="text-[#1D211E]/40 text-xs font-sans tracking-wider uppercase mb-4">{c.social}</div>
                <SocialLinks dark={false} />
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-12 h-1 rounded-full bg-[#C99A45] mx-auto mb-8" />
                  <h3 className="font-display text-2xl font-semibold text-[#173F35] mb-3">{c.form.sentTitle}</h3>
                  <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">{c.form.sentText}</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-[#173F35] mb-7">{c.form.title}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* hidden from people; spam bots fill it in */}
                    <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
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
                    {failed && <p role="alert" className="text-sm font-sans text-[#A65A3A]">{t.common.formError}</p>}
                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      className="w-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-sans font-semibold text-sm rounded-full py-4 transition-colors disabled:opacity-60"
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

      {/* Map */}
      <LocationMap />
    </main>
  );
}
