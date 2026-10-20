import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import CardGrid from '../components/CardGrid';

/* Icons per item — the text lives in the translations (t.about.*) */
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

const values = [
  { id: 'authenticity' },
  { id: 'respect' },
  { id: 'preservation' },
  { id: 'continuity' },
  { id: 'hospitality' },
  { id: 'education' },
] as const;

const offerItems = [
  { id: 'houses' },
  { id: 'trees' },
  { id: 'artifacts' },
  { id: 'performances' },
  { id: 'reading' },
  { id: 'food' },
  { id: 'coffee' },
  { id: 'guesthouse' },
  { id: 'music' },
  { id: 'stories' },
] as const;

export default function About() {
  const { t, lang } = useI18n();
  const a = t.about;
  // the story open under its name; none at first, each shows its opening lines and a Read more
  const [person, setPerson] = useState<(typeof lineage)[number] | null>(null);
  return (
    <main>

      {/* Hero */}
      <PageHero slot="about" eyebrow={a.hero.eyebrow} desc={t.common.slogan}
        title={<>{a.hero.titleA}<br /><span className="text-[#1E3A29]">{a.hero.titleB}</span></>} />

      {/* Who we are */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow mb-5">{a.who.eyebrow}</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E3A29] leading-tight mb-6 gold-underline">
                {a.who.title}
              </h2>
              <p className="text-[#1E3A29]/70 font-sans text-base leading-relaxed mb-5">
                {a.who.p1}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.name}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.p2}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.p3}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed">
                {a.who.festival}
              </p>
            </div>
            <div className="relative">
              <div className="img-zoom aspect-[4/5] rounded-[2rem] bg-[#1E3A29]/10">
                <img {...picture(photos.lawn)} alt={t.photos.lawn} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#3F7D20] rounded-2xl shadow-xl p-6 hidden lg:block">
                <div className="text-white font-display text-3xl font-semibold">4+</div>
                <div className="text-white/85 font-sans text-xs tracking-wider uppercase mt-1">{a.who.generations}</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-[#C4622D] rounded-2xl shadow-xl px-6 py-5 hidden lg:block max-w-[12rem]">
                <div className="text-white font-display text-2xl font-semibold leading-tight">{a.who.since}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimate goal */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="eyebrow bg-[#1E3A29]/10 text-[#1E3A29] mb-7">{t.common.goal.eyebrow}</span>
          <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1E3A29] leading-[1.2]">{t.common.goal.text}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <div className="text-[#346A1A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.purpose.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#13261A] leading-tight">{a.purpose.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#C4622D]/10" />
              <div className="text-[#346A1A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-6 flex items-center gap-3">
                <div className="w-6 h-px bg-[#C4622D]" />
                {a.purpose.missionLabel}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#13261A] leading-snug mb-6">
                {a.purpose.missionTitle}
              </h3>
              <p className="text-[#1E3A29]/80 font-sans text-sm leading-relaxed mb-6">
                {a.purpose.missionP1}
              </p>
              <p className="text-[#1E3A29]/70 font-sans text-sm leading-relaxed">
                {a.purpose.missionP2}
              </p>
              <div className="mt-8 pt-8 border-t border-[#1E3A29]/12">
                <p className="text-[#346A1A] font-display text-lg italic font-semibold">
                  “{t.common.slogan}”
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-[#C4622D]/10" />
              <div className="text-[#346A1A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-6 flex items-center gap-3">
                <div className="w-6 h-px bg-[#C4622D]" />
                {a.purpose.visionLabel}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#13261A] leading-snug mb-6">
                {a.purpose.visionTitle}
              </h3>
              <p className="text-[#1E3A29]/80 font-sans text-sm leading-relaxed mb-6">
                {a.purpose.visionP1}
              </p>
              <p className="text-[#1E3A29]/70 font-sans text-sm leading-relaxed">
                {a.purpose.visionP2}
              </p>
              <div className="mt-8 pt-8 border-t border-[#1E3A29]/12">
                <div className="flex flex-wrap gap-3">
                  {a.purpose.tags.map((tag, i) => (
                    <span key={i} className="border border-[#B9D38A]/30 text-[#346A1A]/80 text-xs font-sans rounded-full px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <span className="eyebrow mb-5">{a.values.eyebrow}</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E3A29] leading-tight">{a.values.title}</h2>
          </div>
          <CardGrid grid="md:grid-cols-2 lg:grid-cols-3">
            {values.map((val, i) => (
              <div key={val.id} className="h-full bg-white heritage-card p-7">
                <span className="block text-[#C4622D] text-sm font-bold tabular-nums mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl font-bold text-[#1E3A29] mb-3">{a.values.items[val.id].title}</h3>
                <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{a.values.items[val.id].desc}</p>
              </div>
            ))}
          </CardGrid>
        </div>
      </section>

      {/* Family line: Bushaashe -> Alambo -> Garedew -> today */}
      <section id="family" className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-16 sm:py-24 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow bg-white text-[#346A1A] mb-5">{a.lineage.eyebrow}</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#13261A] leading-[1.05] mb-5">{a.lineage.title}</h2>
            <p className="text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed">{a.lineage.desc}</p>
          </div>

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
      </section>

      {/* What we offer summary */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-[#346A1A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.offer.eyebrow}</div>
            <h2 className="font-display text-4xl font-semibold text-[#13261A]">{a.offer.title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {offerItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#1E3A29]/12 hover:border-[#C4622D]/40 p-5 text-center transition-colors duration-200">
                <div className="text-[#1E3A29]/80 font-sans text-xs leading-snug">{a.offer.items[item.id]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] py-28 overflow-hidden">
        <img {...picture(photos.pavilions)} alt={t.photos.pavilions} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#3F7D20]/90" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            {t.common.comeBePart}
          </h2>
          <p className="text-white/90 font-sans text-base max-w-xl mx-auto mb-10 leading-relaxed">
            {a.cta.desc}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/visit" className="btn-primary btn-on-dark">
              {t.common.planVisit}
            </Link>
            <Link to="/contact" className="btn-outline btn-outline-light">
              {t.common.getInTouch}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
