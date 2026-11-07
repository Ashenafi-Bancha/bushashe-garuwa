import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from '../components/SocialLinks';
import PageHero from '../components/PageHero';
import LocationMap from '../components/LocationMap';
import { sendContactMessage } from '../lib/api';
import { FieldError, useFormCheck } from '../lib/formCheck';
import { LIMITS, checkEmail, checkName, checkPhone, checkText } from '../lib/rules';

export default function Contact() {
  const { t, lang } = useI18n();
  const c = t.contact;
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  // the same rules as the API (src/lib/rules.ts)
  const check = useFormCheck('contact', {
    name: () => checkName(form.name),
    phone: () => checkPhone(form.phone, false),
    email: () => checkEmail(form.email),
    message: () => {
      const problem = checkText(form.message, LIMITS.contactMessage);
      return problem && { problem, max: LIMITS.contactMessage };
    },
  });
  const change = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [name]: e.target.value }));
    check.changed(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);
    if (!check.all()) return;
    setSending(true);
    try {
      await sendContactMessage({ ...form, language: lang, website: honeypot.current?.value });
      setSubmitted(true);
    } catch (err) {
      if (!check.fromServer(err)) setFailed(true);
    } finally {
      setSending(false);
    }
  };
  const input = (name: string) =>
    `w-full rounded-xl border border-[#1E3A29]/20 focus:border-[#1E3A29] px-4 py-3 font-sans text-sm text-[#1E3A29] outline-none transition-colors bg-[#F4EFE4] ${name === 'message' ? 'resize-none' : ''}`;
  const label = 'block text-xs font-sans font-semibold text-[#1E3A29]/70 tracking-wider uppercase mb-2';

  return (
    <main>
      {/* Hero */}
      <PageHero slot="contact" eyebrow={c.hero.eyebrow} title={c.hero.title} desc={c.intro} />

      {/* Contact content */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Left: info */}
            <div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.phone}</div>
                    <a href="tel:+251932196502" className="block text-[#1E3A29] font-sans text-base font-medium hover:text-[#C4622D] transition-colors">+251 932 196 502</a>
                    <div className="text-[#1E3A29]/45 font-sans text-sm mt-0.5">{c.phoneNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.email}</div>
                    <a href="mailto:bushaashegaruwa@gmail.com" className="block text-[#1E3A29] font-sans text-base font-medium hover:text-[#C4622D] transition-colors">bushaashegaruwa@gmail.com</a>
                    <div className="text-[#1E3A29]/45 font-sans text-sm mt-0.5">{c.emailNote}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.location}</div>
                    <a href="#map" className="block text-[#1E3A29] font-sans text-base font-medium hover:text-[#C4622D] transition-colors">{t.common.brand}</a>
                    <div className="text-[#1E3A29]/45 font-sans text-sm mt-0.5">{c.locationLine1}<br/>{c.locationLine2}</div>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-1">{t.common.openingHours}</div>
                    <div className="text-[#1E3A29] font-sans text-base font-medium">{t.common.hoursDaily}</div>
                    <div className="text-[#1E3A29]/45 font-sans text-sm mt-0.5">{t.common.eveningEvents}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-[#1E3A29]/10">
                <div className="text-[#1E3A29]/40 text-xs font-sans tracking-wider uppercase mb-4">{c.social}</div>
                <SocialLinks dark={false} />
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-12 h-1 rounded-full bg-[#C4622D] mx-auto mb-8" />
                  <h3 className="font-display text-2xl font-semibold text-[#1E3A29] mb-3">{c.form.sentTitle}</h3>
                  <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{c.form.sentText}</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-[#1E3A29] mb-7">{c.form.title}</h2>
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* hidden from people; spam bots fill it in */}
                    <input type="text" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                    <div>
                      <label className={label} htmlFor="contact-name">{c.form.name}</label>
                      <input {...check.field('name')} required type="text" autoComplete="name" maxLength={LIMITS.name} value={form.name} onChange={change('name')} className={input('name')} placeholder={c.form.namePlaceholder} />
                      <FieldError check={check} name="name" />
                    </div>
                    <div>
                      <label className={label} htmlFor="contact-phone">{c.form.phone}</label>
                      <input {...check.field('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={form.phone} onChange={change('phone')} className={input('phone')} placeholder="0912 345 678" />
                      <FieldError check={check} name="phone" />
                    </div>
                    <div>
                      <label className={label} htmlFor="contact-email">{c.form.email}</label>
                      <input {...check.field('email')} required type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={form.email} onChange={change('email')} className={input('email')} placeholder="your@email.com" />
                      <FieldError check={check} name="email" />
                    </div>
                    <div>
                      <label className={label} htmlFor="contact-message">{c.form.message}</label>
                      <textarea {...check.field('message')} required rows={5} maxLength={LIMITS.contactMessage} value={form.message} onChange={change('message')} className={input('message')} placeholder={c.form.messagePlaceholder} />
                      <FieldError check={check} name="message" />
                    </div>
                    {check.hasErrors && <p className="text-sm font-sans font-semibold text-[#B42318]">{t.common.problems.fixFields}</p>}
                    {failed && <p role="alert" className="text-sm font-sans text-[#1E3A29]">{t.common.formError}</p>}
                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      className="btn-primary w-full"
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
