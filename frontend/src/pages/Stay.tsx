import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import ContactButtons from '../components/ContactButtons';

/**
 * The Guest House: a planned service that is not open yet. The page says so in
 * large, bright letters so no visitor mistakes it for something to book, and
 * points to the VIP service (which is open) and to the ways to reach us.
 * Nothing here takes a booking, and no photographs of other rooms are shown.
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
      <PageHero slot="stay" eyebrow={st.hero.eyebrow} title={st.hero.title} desc={st.comingSoon.lead} />

      {/* Not open yet: said large and bright */}
      <section className="px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="coming-soon-panel max-w-screen-xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-16 text-center">
          <p className="coming-soon-word font-display font-extrabold uppercase leading-[0.95]">{st.comingSoon.badge}</p>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#13261A] leading-tight mt-6 mb-4">{st.comingSoon.title}</h2>
          <p className="text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">{st.comingSoon.text}</p>
        </div>
      </section>

      {/* What is open now */}
      <section className="py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white rounded-[2rem] p-7 sm:p-9 elev-1 flex flex-col items-start">
            <span className="eyebrow mb-4">{t.vip.hero.eyebrow}</span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E3A29] leading-tight mb-3">{st.comingSoon.vipTitle}</h3>
            <p className="text-[#1E3A29]/70 leading-relaxed mb-6">{st.comingSoon.vipText}</p>
            <Link to="/vip" className="btn-primary mt-auto">
              {t.nav.links.vip}
            </Link>
          </div>
          <div className="bg-[#E3EBD8] rounded-[2rem] p-7 sm:p-9 flex flex-col items-start">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#13261A] leading-tight mb-3">{st.comingSoon.askTitle}</h3>
            <p className="text-[#1E3A29]/75 leading-relaxed mb-6">{st.comingSoon.askText}</p>
            <ContactButtons className="mt-auto" />
          </div>
        </div>
      </section>
    </main>
  );
}
