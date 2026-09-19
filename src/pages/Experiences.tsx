import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

/* Order and photos — the text for each id lives in the translations (t.experiences.items) */
const experiences: { id: keyof Dictionary['experiences']['items']; img?: string }[] = [
  { id: 'food' },
  { id: 'coffee' },
  { id: 'performance' },
  { id: 'tour', img: photos.house },
  { id: 'education' },
  { id: 'photography' },
  { id: 'family' },
];

export default function Experiences() {
  const { t } = useI18n();
  const x = t.experiences;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <img src={photos.pavilions} alt={t.photos.pavilions} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{x.hero.eyebrow}</div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">{x.hero.title}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#F6F1E7] py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <p className="text-[#1D211E]/65 font-sans text-base leading-relaxed max-w-2xl">
            {x.intro}
          </p>
        </div>
      </section>

      {/* Experience cards */}
      <section className="bg-[#F6F1E7] pb-12 sm:pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {experiences.map(({ id, img }, i) => {
              const exp = x.items[id];
              return (
              <div key={id} className="bg-white heritage-card overflow-hidden">
                <div className="img-zoom aspect-video bg-[#173F35]/10">
                  <Photo src={img} alt={exp.title} className="w-full h-full object-cover"/>
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#173F35] mb-1">{exp.title}</h2>
                      <p className="text-[#A65A3A] text-sm font-sans">{exp.sub}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[#1D211E]/40 text-xs font-sans mb-1">{x.duration}</div>
                      <div className="text-[#173F35] text-sm font-sans font-semibold">{exp.duration}</div>
                    </div>
                  </div>
                  <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed mb-4">{exp.desc}</p>

                  <button
                    onClick={() => setSelected(selected === i ? null : i)}
                    className="text-[#173F35]/60 text-xs font-sans tracking-wide flex items-center gap-1 mb-4 hover:text-[#173F35] transition-colors"
                  >
                    {selected === i ? x.hideDetails : x.showIncluded}
                  </button>

                  {selected === i && (
                    <ul className="mb-5 space-y-2">
                      {exp.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm font-sans text-[#1D211E]/65">
                          <div className="w-1 h-1 bg-[#C99A45] mt-2 flex-shrink-0"/>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#173F35]/10">
                    <div className="text-[#C99A45] font-sans font-semibold text-sm">{exp.price}</div>
                    <Link to="/visit" className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1e5447] text-white text-xs font-sans font-semibold tracking-widest uppercase px-5 py-3 transition-colors">
                      {t.common.reserve}
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        <img src={photos.gardens} alt={t.photos.gardens} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-[#173F35]/85"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">{x.cta.title}</h2>
          <p className="text-white/60 font-sans text-base max-w-xl mx-auto mb-10">{x.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-sm font-sans font-semibold tracking-widest uppercase px-10 py-4 transition-colors">
              {t.common.contactUs}
            </Link>
            <Link to="/visit" className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white text-sm font-sans font-semibold tracking-widest uppercase px-10 py-4 transition-colors">
              {t.common.planVisit}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
