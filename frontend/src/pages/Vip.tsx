import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import ContactButtons from '../components/ContactButtons';

/* What the VIP service offers; the words are in the translations (t.vip.features) */
const FEATURES = ['kitchen', 'dining', 'celebrate', 'fire', 'rooms', 'restrooms'] as const;

/**
 * The VIP service: private rooms for a family or a small group, with their own
 * kitchen, dining room, fireplace, bedrooms and rest rooms. It is a service of
 * its own, separate from the Guest House (which is not open yet).
 */
export default function Vip() {
  const { t } = useI18n();
  const v = t.vip;

  return (
    <main>
      <PageHero slot="vip" eyebrow={v.hero.eyebrow} title={v.hero.title} desc={v.hero.desc} />

      {/* What it is */}
      <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="vip-what">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 lg:gap-16 lg:items-end mb-10 sm:mb-12">
            <div>
              <span className="eyebrow mb-5">{v.intro.eyebrow}</span>
              <h2 id="vip-what" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1]">{v.intro.title}</h2>
            </div>
            <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{v.intro.text}</p>
          </div>

          <ul data-wave className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((id, i) => (
              <li key={id} data-reveal className="bg-white rounded-[1.5rem] p-6 sm:p-7 elev-1">
                <span className="block text-[#C4622D] text-sm font-bold tabular-nums mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] tracking-tight mb-2">{v.features[id].title}</h3>
                <p className="text-[#1E3A29]/65 text-sm sm:text-base leading-relaxed">{v.features[id].desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The rooms, in photographs */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 lg:py-20" aria-labelledby="vip-photos">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 id="vip-photos" className="font-display text-3xl sm:text-4xl font-extrabold text-[#13261A] leading-tight mb-8 sm:mb-10">{v.photosTitle}</h2>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {(['vipDining', 'vipRoom'] as const).map((key) => (
              <figure key={key} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[key], '(max-width: 767px) 100vw, 50vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5">
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{t.photoCaptions[key].title}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{t.photoCaptions[key].desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Arranging it */}
      <section className="py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] mb-3">{v.cta.title}</h2>
          <p className="text-[#1E3A29]/70 max-w-xl mx-auto mb-7">{v.cta.text}</p>
          <ContactButtons className="justify-center" />
        </div>
      </section>
    </main>
  );
}
