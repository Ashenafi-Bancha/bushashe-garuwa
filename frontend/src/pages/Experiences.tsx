import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';
import Band from '../components/Band';
import { wol } from '../lib/wolaitaWords';

/* Order and photos — the text for each id lives in the translations (t.experiences.items) */
const experiences: { id: keyof Dictionary['experiences']['items']; img?: string; soon?: boolean }[] = [
  { id: 'food', img: photos.food },
  { id: 'coffee' },
  { id: 'performance', soon: true },
  { id: 'workshop', soon: true },
  { id: 'tour', img: photos.house },
  { id: 'horse', img: photos.lawn },
  { id: 'education', img: photos.eventGathering },
  { id: 'photography', img: photos.gardens },
  { id: 'family', img: photos.eventElders },
];

export default function Experiences() {
  const { t } = useI18n();
  const x = t.experiences;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <main>
      {/* Hero */}
      <PageHero slot="experiences" eyebrow={x.hero.eyebrow} title={x.hero.title} desc={x.intro} />


      {/* Experience cards */}
      <section className="bg-[#F4EFE4] pb-12 sm:pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiences.map(({ id, img, soon }, i) => {
              const exp = x.items[id];
              return (
              <div key={id} className="bg-white heritage-card overflow-hidden">
                <div className="relative img-zoom aspect-video bg-[#1E3A29]/10">
                  <Photo src={img} alt={exp.title} label={exp.title} className="w-full h-full object-cover"/>
                  {soon && <span className="absolute top-4 left-4 rounded-full bg-[#E05A1A] text-white text-xs font-bold uppercase tracking-wide px-3.5 py-1.5">{x.soon}</span>}
                </div>
                <div className="p-5 sm:p-7">
                  <div className="mb-4">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1E3A29] mb-1">{wol(exp.title)}</h2>
                      <p className="text-[#1E3A29] text-sm font-sans">{exp.sub}</p>
                    </div>
                  </div>
                  <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed mb-4">{wol(exp.desc)}</p>

                  <button
                    onClick={() => setSelected(selected === i ? null : i)}
                    className="text-[#1E3A29]/60 text-xs font-sans tracking-wide flex items-center gap-1 mb-4 hover:text-[#1E3A29] transition-colors"
                  >
                    {selected === i ? x.hideDetails : x.showIncluded}
                  </button>

                  {selected === i && (
                    <ul className="mb-5 space-y-2">
                      {exp.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm font-sans text-[#1E3A29]/65">
                          <div className="w-1 h-1 bg-[#C4622D] mt-2 flex-shrink-0"/>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1E3A29]/10">
                    {soon ? (
                      <span className="text-[#C4530F] text-sm font-bold">{x.soonNote}</span>
                    ) : (
                      <Link to="/visit" className="btn-primary btn-sm">
                        {t.common.reserve}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Reading Place: a quiet corner of the grounds */}
      <Band outer="mb-12 sm:mb-16" className="py-6 sm:py-10 lg:py-12" aria-labelledby="reading-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <figure data-reveal className="bg-white rounded-[2rem] p-2.5 elev-1">
            <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
              <img {...picture(photos.readingPlace, '(max-width: 1023px) 100vw, 50vw')} alt={t.photos.readingPlace} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[#1E3A29]/70">{t.home.reading.caption}</figcaption>
          </figure>
          <div data-reveal>
            <span className="eyebrow !bg-white mb-5">{t.home.reading.eyebrow}</span>
            <h2 id="reading-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#13261A] leading-[1.05] mb-4">{wol(t.home.reading.title)}</h2>
            <p className="text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed mb-3">{wol(t.home.reading.desc)}</p>
            <p className="text-[#1E3A29]/70 italic leading-relaxed mb-6">{t.home.reading.mountain}</p>
            <ul className="flex flex-wrap gap-2.5 mb-8">
              {t.home.reading.qualities.map((q) => (
                <li key={q} className="rounded-full bg-white text-[#1E3A29] text-sm font-semibold px-4 py-2">{q}</li>
              ))}
            </ul>
            <Link to="/visit" className="btn-primary">{t.home.reading.cta}</Link>
          </div>
        </div>
      </Band>

      {/* CTA */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24 overflow-hidden">
        <img {...picture(photos.gardens)} alt={t.photos.gardens} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-[#3F7D20]/90"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">{wol(x.cta.title)}</h2>
          <p className="text-white/90 font-sans text-base max-w-xl mx-auto mb-10">{wol(x.cta.desc)}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary btn-on-dark">
              {t.common.contactUs}
            </Link>
            <Link to="/visit" className="btn-outline btn-outline-light">
              {t.common.planVisit}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
