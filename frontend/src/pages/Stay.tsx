import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import ContactButtons from '../components/ContactButtons';

/**
 * The Guest House: a planned service that is not open yet. The page says so
 * plainly, gives a first look at the VIP room in photographs, and points to the
 * contact page. Nothing here takes a booking.
 *
 * WHEN THE GUEST HOUSE OPENS: the room list, the "why stay" section and the
 * request form this page used to carry are in the git history of this file,
 * and `components/StayInquiry.tsx` (the request form, which reaches the staff
 * area under Visits) is still there to be put back. Their words are still in
 * the translations under `stay` (rooms, amenities, why, inquiry, cta).
 */
export default function Stay() {
  const { t } = useI18n();
  const st = t.stay;

  return (
    <main>
      <PageHero slot="stay" eyebrow={`${st.hero.eyebrow} · ${st.comingSoon.badge}`} title={st.hero.title} desc={st.comingSoon.lead} />

      {/* Not open yet: said plainly */}
      <section className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="max-w-screen-xl mx-auto rounded-[1.75rem] sm:rounded-[2rem] bg-[#E3EBD8] px-6 py-7 sm:px-10 sm:py-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-[#C4622D] text-white text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 mb-4">{st.comingSoon.badge}</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#13261A] leading-tight mb-3">{st.comingSoon.title}</h2>
            <p className="text-[#1E3A29]/75 leading-relaxed">{st.comingSoon.text}</p>
          </div>
          <Link to="/contact" className="btn-primary flex-shrink-0">
            {t.common.contactUs}
          </Link>
        </div>
      </section>

      {/* A first look: the VIP room, in photographs */}
      <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="vip-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 lg:gap-16 lg:items-end mb-8 sm:mb-10">
            <div>
              <span className="eyebrow mb-5">{st.vip.eyebrow}</span>
              <h2 id="vip-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1]">{st.vip.title}</h2>
            </div>
            <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{st.vip.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {(['vipRoom', 'vipDining'] as const).map((key) => (
              <figure key={key} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[key], '(max-width: 767px) 100vw, 50vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5 font-display text-xl font-bold text-[#1E3A29]">{t.photoCaptions[key].title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Questions in the meantime */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#13261A] mb-3">{st.comingSoon.askTitle}</h2>
          <p className="text-[#1E3A29]/75 max-w-xl mx-auto mb-7">{st.comingSoon.askText}</p>
          <ContactButtons className="justify-center" />
        </div>
      </section>
      <div className="h-12 sm:h-16" />
    </main>
  );
}
