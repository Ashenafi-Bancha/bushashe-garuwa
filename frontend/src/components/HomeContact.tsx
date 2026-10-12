import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { DIRECTIONS_URL, MAPS_URL, MAP_EMBED_URL, PLUS_CODE } from '../lib/location';
import ContactButtons from './ContactButtons';
import SocialLinks from './SocialLinks';

/**
 * The foot of the home page: every way to reach Bushaashe Garuwa (phone, email,
 * address, opening hours, the buttons to call or write) beside the live map.
 */
export default function HomeContact() {
  const { t } = useI18n();
  const c = t.contact;
  const m = t.common.map;

  const facts: { label: string; value: string; href?: string; note?: string }[] = [
    { label: t.common.phone, value: '+251 932 196 502', href: 'tel:+251932196502', note: c.phoneNote },
    { label: t.common.email, value: 'bushaashegaruwa@gmail.com', href: 'mailto:bushaashegaruwa@gmail.com', note: c.emailNote },
    { label: t.common.location, value: t.common.brand, note: `${c.locationLine1}, ${c.locationLine2}` },
    { label: m.plusCode, value: PLUS_CODE },
    { label: t.common.openingHours, value: t.common.hoursDaily, note: t.common.eveningEvents },
  ];

  return (
    <section id="contact" className="bg-[#E3EBD8] mx-2 sm:mx-3 mb-3 rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 lg:py-20" aria-labelledby="home-contact-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div data-reveal className="fade-section max-w-2xl mb-8 sm:mb-12">
          <span className="eyebrow mb-5">{c.hero.eyebrow}</span>
          <h2 id="home-contact-title" className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#13261A] leading-[0.98] mb-4">{c.hero.title}</h2>
          <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{c.intro}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-5 sm:gap-6">
          {/* the address and the ways to reach us */}
          <div data-reveal className="fade-section bg-white rounded-[2rem] p-6 sm:p-8 elev-1 flex flex-col">
            <dl className="divide-y divide-[#1E3A29]/10">
              {facts.map((fact) => (
                <div key={fact.label} className="py-4 first:pt-0">
                  <dt className="text-[#C4622D] text-xs font-bold tracking-[0.14em] uppercase mb-1">{fact.label}</dt>
                  <dd className="text-[#1E3A29] text-base sm:text-lg font-semibold break-words">
                    {fact.href ? (
                      <a href={fact.href} className="hover:text-[#0B6E40] transition-colors">{fact.value}</a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                  {fact.note && <dd className="text-[#1E3A29]/55 text-sm mt-0.5">{fact.note}</dd>}
                </div>
              ))}
            </dl>

            <ContactButtons className="mt-5" />
            <div className="mt-6">
              <SocialLinks dark={false} />
            </div>
            <div className="mt-auto pt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">{c.form.title}</Link>
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-[#1E3A29]">{m.directions}</a>
            </div>
          </div>

          {/* the map itself */}
          <div data-reveal className="fade-section relative rounded-[2rem] overflow-hidden bg-[#1E3A29]/10 elev-1 min-h-[360px] sm:min-h-[460px]">
            <iframe
              src={MAP_EMBED_URL}
              title={m.frameTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-4 bottom-4 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#1E3A29] shadow-[0_10px_26px_rgba(19,38,26,0.28)] hover:bg-[#0E8A50] hover:text-white transition-colors"
            >
              {m.open}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
