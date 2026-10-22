import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import Band from '../components/Band';

/**
 * The family history (/family-history): the generations from Bushaashe to the
 * family of today, each story opening under its name. It opens with the memorial
 * of Garedew Alambo.
 */

/* The family line, oldest first — names, labels and histories live in the translations (t.about.lineage) */
const lineage = ['bushaashe', 'alambo', 'garedew', 'current'] as const;

/* Names of people and places in the family stories, set in bold italic. Each language
   writes them its own way (Amharic adds letters in front, Wolaytta adds endings), so the
   name itself is found and marked, wherever it sits in the word. */
const NAMES: Record<string, RegExp> = {
  en: /(Bushaashe Garuwa|Bushaashe|Alambo|Garedew|Emperor Haile Selassie|Haile Selassie|Addis Ababa|Wolaita|Silte|Were Ilu|Wollo)/g,
  am: /(ቡሻሼ ጋሯ|ቡሻሼ|አላምቦ|ጋረደው|አፄ ኃይለ ሥላሴ|ኃይለ ሥላሴ|አዲስ አበባ|ወላይታ|ስልጤ|ወረኢሉ|ወሎ)/g,
  wol: /(Bushaashe Gar[a-z']*|Bushaashe[a-z']*|Alamb+o[a-z']*|Garedew[a-z']*|Atse Hayle Sil+aase[a-z']*|Hayle Sil+aase[a-z']*|Haile Sel+as+ie[a-z']*|Tung+a[a-z']*|Addis Ababa[a-z']*|Wola[iy]t+a[a-z']*|Silx+e[a-z']*|Silte[a-z']*|Were Ii?l+u?[a-z']*|Wol+o[a-z']*)/g,
};
function withNames(text: string, lang: string) {
  const pattern = NAMES[lang] ?? NAMES.en!;
  return text.split(pattern).map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold italic text-[#13261A]">{part}</strong> : part));
}

export default function FamilyHistory() {
  const { t, lang } = useI18n();
  const a = t.about;
  // the story open under its name; none at first, each shows its opening lines and a Read more
  const [person, setPerson] = useState<(typeof lineage)[number] | null>(null);
  return (
    <main>
      <PageHero slot="family" eyebrow={a.lineage.eyebrow} title={a.lineage.title} desc={a.lineage.desc} />

      <Band id="family" className="py-6 sm:py-10 lg:py-12 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          {/* the family today */}
          <figure className="bg-white rounded-[2rem] p-2.5 elev-1 mb-12">
            <div className="rounded-[1.5rem] overflow-hidden aspect-[3/2] sm:aspect-[21/9]">
              <img {...picture(photos.family)} alt={t.photos.family} loading="lazy" className="w-full h-full object-cover object-[center_30%]" />
            </div>
            <figcaption className="px-4 py-4 sm:px-5">
              <span className="block font-display text-xl font-bold text-[#1E3A29]">{t.photoCaptions.family.title}</span>
              <span className="block text-[#1E3A29]/65 text-sm mt-1">{t.photoCaptions.family.desc}</span>
            </figcaption>
          </figure>

          <p className="text-[#346A1A] text-sm font-bold mb-5">{a.lineage.hint}</p>

          {/* one card per generation, oldest first; its story opens right under its name */}
          <ol className="relative space-y-4">
            {/* the line that joins the generations */}
            <span aria-hidden="true" className="absolute left-[34px] sm:left-[42px] top-10 bottom-10 w-px bg-[#C4622D]/40" />
            {lineage.map((id, i) => {
              const p = a.lineage.people[id];
              const open = person === id;
              const paragraphs = p.story.trim() ? p.story.split(/\n\s*\n/) : [];
              const panel = `story-${id}`;
              return (
                <li key={id} className={`relative rounded-3xl transition-all duration-500 ${open ? 'bg-white shadow-[0_24px_50px_-34px_rgba(19,38,26,0.55)] ring-1 ring-[#C4622D]/35' : 'bg-white/60 hover:bg-white'}`}>
                  <button
                    type="button"
                    onClick={() => setPerson(open ? null : id)}
                    aria-expanded={open}
                    aria-controls={panel}
                    className="w-full flex items-start gap-4 sm:gap-6 p-4 sm:p-6 text-left"
                  >
                    <span
                      className={`relative z-10 w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] mt-1 flex-shrink-0 rounded-full grid place-items-center font-display text-lg sm:text-2xl font-extrabold transition-all duration-500 ${
                        open ? 'bg-[#3F7D20] text-white shadow-[0_0_0_6px_rgba(63,125,32,0.18)]' : 'bg-white text-[#346A1A] ring-4 ring-[#E3EBD8]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[#346A1A] text-[11px] font-bold tracking-[0.12em] uppercase mb-1">{p.generation}</span>
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#13261A] leading-tight">{p.name}</span>
                        <span
                          aria-hidden="true"
                          className={`grid place-items-center w-9 h-9 flex-shrink-0 rounded-full border border-[#1E3A29]/15 text-[#346A1A] transition-transform duration-500 ${open ? 'rotate-180 bg-[#3F7D20]/10' : ''}`}
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                      </span>
                      {p.period && <span className="block text-[#1E3A29]/70 text-sm mt-1">{p.period}</span>}
                      {/* the opening lines, so the reader knows what the story holds */}
                      {!open && paragraphs[0] && (
                        <span className="block text-[#1E3A29]/75 text-[15px] sm:text-base leading-relaxed mt-3 line-clamp-2">{withNames(paragraphs[0], lang)}</span>
                      )}
                      {!open && (
                        <span className="inline-flex items-center gap-1.5 text-[#346A1A] text-sm font-bold mt-3">
                          {paragraphs.length ? a.lineage.readMore : a.lineage.pending}
                          {paragraphs.length > 0 && <span aria-hidden="true">&rarr;</span>}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* the whole story, opening smoothly under the name */}
                  <div id={panel} className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-6 pb-6 sm:pb-8 sm:pl-[100px]">
                        {paragraphs.length ? (
                          paragraphs.map((para, k) => (
                            <p
                              key={k}
                              className={`text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed mb-4 max-w-3xl ${k === 0 ? 'font-display text-xl sm:text-2xl text-[#13261A] leading-snug' : ''}`}
                            >
                              {withNames(para, lang)}
                            </p>
                          ))
                        ) : (
                          <p className="text-[#1E3A29]/70 italic">{a.lineage.pending}</p>
                        )}

                        {id === 'bushaashe' && (
                          <>
                            {/* his children, as written on the sign at the gate */}
                            {a.lineage.children.length > 0 && (
                              <div className="mt-6 pt-6 border-t border-[#1E3A29]/10">
                                <h4 className="font-display text-xl sm:text-2xl text-[#13261A] mb-4">{a.lineage.childrenTitle}</h4>
                                <ul className="flex flex-wrap gap-2.5">
                                  {a.lineage.children.map((child) => (
                                    <li key={child} className="rounded-full bg-[#E3EBD8] text-[#1E3A29] text-sm sm:text-base px-4 py-2">
                                      <strong className="italic">{child}</strong> <span className="text-[#1E3A29]/60 italic">{p.name}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* the generations before him, oldest first, leading to Bushaashe */}
                            {a.lineage.ancestors.length > 0 && (
                              <div className="mt-6 pt-6 border-t border-[#1E3A29]/10">
                                <h4 className="font-display text-xl sm:text-2xl text-[#13261A] mb-4">{a.lineage.ancestorsTitle}</h4>
                                <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
                                  {[...a.lineage.ancestors, p.name].map((name, k, all) => (
                                    <li key={`${name}-${k}`} className="flex items-center gap-2">
                                      <span className={`rounded-full px-4 py-2 text-sm sm:text-base font-bold italic ${k === all.length - 1 ? 'bg-[#3F7D20] text-white' : 'bg-white ring-1 ring-[#1E3A29]/15 text-[#1E3A29]'}`}>{name}</span>
                                      {k < all.length - 1 && (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C4622D]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                          <path d="M5 12h14" />
                                          <path d="m13 6 6 6-6 6" />
                                        </svg>
                                      )}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </>
                        )}

                        <button type="button" onClick={() => setPerson(null)} className="inline-flex items-center gap-1.5 mt-6 text-[#346A1A] text-sm font-bold hover:underline underline-offset-4">
                          <span aria-hidden="true">&uarr;</span>
                          {a.lineage.readLess}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Band>

      {/* on to the rest of the story */}
      <section className="py-14 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Link to="/visit" className="btn-primary">{t.common.planVisit}</Link>
          <Link to="/about" className="btn-outline">{t.nav.links.about}</Link>
          <Link to="/heritage" className="btn-outline">{t.nav.links.heritage}</Link>
        </div>
      </section>
    </main>
  );
}
