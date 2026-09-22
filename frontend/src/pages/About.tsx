import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';

/* Icons per item — the text lives in the translations (t.about.*) */
/* The family line, oldest first — names, labels and histories live in the translations (t.about.lineage) */
const lineage = ['bushaashe', 'alambo', 'garedew', 'current'] as const;

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
  { id: 'library' },
  { id: 'food' },
  { id: 'coffee' },
  { id: 'guesthouse' },
  { id: 'music' },
  { id: 'stories' },
] as const;

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  const [person, setPerson] = useState<(typeof lineage)[number]>('bushaashe');
  const selected = a.lineage.people[person];
  return (
    <main>

      {/* Hero */}
      <PageHero photo="gifaataa2" pos="object-bottom" eyebrow={a.hero.eyebrow} desc={t.common.slogan}
        title={<>{a.hero.titleA}<br /><span className="text-[#A65A3A]">{a.hero.titleB}</span></>} />

      {/* Who we are */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.who.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#173F35] leading-tight mb-6 gold-underline">
                {a.who.title}
              </h2>
              <p className="text-[#1D211E]/70 font-sans text-base leading-relaxed mb-5">
                {a.who.p1}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.name}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.p2}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed mb-5">
                {a.who.p3}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed">
                {a.who.festival}
              </p>
            </div>
            <div className="relative">
              <div className="img-zoom aspect-[4/5] rounded-[2rem] bg-[#173F35]/10">
                <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#173F35] rounded-2xl shadow-xl p-6 hidden lg:block">
                <div className="text-[#C99A45] font-display text-3xl font-semibold">4+</div>
                <div className="text-white/50 font-sans text-xs tracking-wider uppercase mt-1">{a.who.generations}</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-[#C99A45] rounded-2xl shadow-xl px-6 py-5 hidden lg:block max-w-[12rem]">
                <div className="text-[#173F35] font-display text-2xl font-semibold leading-tight">{a.who.since}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimate goal */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] mb-7">{t.common.goal.eyebrow}</span>
          <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#0e2820] leading-[1.2]">{t.common.goal.text}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.purpose.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">{a.purpose.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Mission */}
            <div className="bg-[#0e2820] rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#C99A45]/10" />
              <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-6 flex items-center gap-3">
                <div className="w-6 h-px bg-[#C99A45]" />
                {a.purpose.missionLabel}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug mb-6">
                {a.purpose.missionTitle}
              </h3>
              <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">
                {a.purpose.missionP1}
              </p>
              <p className="text-white/50 font-sans text-sm leading-relaxed">
                {a.purpose.missionP2}
              </p>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[#C99A45] font-display text-lg italic font-semibold">
                  “{t.common.slogan}”
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-[#1e5447] rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-[#C99A45]/10" />
              <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-6 flex items-center gap-3">
                <div className="w-6 h-px bg-[#C99A45]" />
                {a.purpose.visionLabel}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug mb-6">
                {a.purpose.visionTitle}
              </h3>
              <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">
                {a.purpose.visionP1}
              </p>
              <p className="text-white/50 font-sans text-sm leading-relaxed">
                {a.purpose.visionP2}
              </p>
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-3">
                  {a.purpose.tags.map((tag, i) => (
                    <span key={i} className="border border-[#C99A45]/30 text-[#C99A45]/70 text-xs font-sans rounded-full px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.values.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#173F35] leading-tight">{a.values.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((val) => (
              <div key={val.id} className="bg-white heritage-card p-7">
                <h3 className="font-display text-xl font-semibold text-[#173F35] mb-3">{a.values.items[val.id].title}</h3>
                <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">{a.values.items[val.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family line: Bushaashe -> Alambo -> Garedew -> today */}
      <section id="family" className="bg-[#1D211E] mx-2 sm:mx-3 rounded-[2rem] py-16 sm:py-24 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow bg-white/8 text-[#C99A45] mb-5">{a.lineage.eyebrow}</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-5">{a.lineage.title}</h2>
            <p className="text-white/55 text-base sm:text-lg leading-relaxed">{a.lineage.desc}</p>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-[76px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#C99A45]/80 via-[#C99A45]/40 to-[#C99A45]/80" />
            <div className="lg:hidden absolute left-[52px] top-10 bottom-10 w-px bg-[#C99A45]/40" />

            <div className="grid lg:grid-cols-4 gap-3 lg:gap-6">
              {lineage.map((id, i) => {
                const p = a.lineage.people[id];
                const active = person === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPerson(id)}
                    aria-pressed={active}
                    className={`relative flex lg:flex-col items-center lg:text-center gap-5 lg:gap-4 rounded-3xl p-4 lg:p-6 text-left transition-all duration-500 ${
                      active ? 'bg-white/[0.07] ring-1 ring-[#C99A45]/50' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <span
                      className={`relative z-10 w-[72px] h-[72px] lg:w-[104px] lg:h-[104px] flex-shrink-0 rounded-full flex items-center justify-center font-display text-3xl lg:text-5xl transition-all duration-500 ${
                        active ? 'bg-[#C99A45] text-[#0e2820] shadow-[0_0_0_8px_rgba(201,154,69,0.15)]' : 'bg-[#173F35] text-[#C99A45] ring-4 ring-[#1D211E]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[#C99A45] text-[11px] font-semibold tracking-[0.12em] uppercase mb-1.5">{p.generation}</span>
                      <span className="block font-display text-2xl lg:text-3xl text-white">{p.name}</span>
                      {p.period && <span className="block text-white/45 text-sm mt-1">{p.period}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* history of the selected father */}
          <div key={person} className="mt-10 rounded-3xl bg-white/[0.04] border border-white/10 p-7 sm:p-10 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-5">
              <h3 className="font-display text-3xl sm:text-4xl text-white">{selected.name}</h3>
              <span className="text-[#C99A45] text-sm">{selected.generation}{selected.period ? ` · ${selected.period}` : ''}</span>
            </div>
            {selected.story.trim() ? (
              selected.story.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="text-white/70 text-base sm:text-lg leading-relaxed mb-4 max-w-4xl">{para}</p>
              ))
            ) : (
              <p className="text-white/45 italic">{a.lineage.pending}</p>
            )}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.milestones.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#173F35] leading-tight">{a.milestones.title}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#C99A45] via-[#C99A45]/40 to-transparent hidden md:block ml-[5.5rem]" />
            <div className="space-y-6">
              {a.milestones.items.map((m, i) => (
                <div key={i} className="flex items-start gap-8">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-[#C99A45] font-sans text-xs font-semibold tracking-wider">{m.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 hidden md:flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-[#C99A45] bg-[#F7F5F0] z-10" />
                  </div>
                  <div className="bg-white rounded-2xl border border-[#173F35]/10 hover:border-[#C99A45]/30 px-4 sm:px-6 py-4 flex-1 transition-colors">
                    <p className="text-[#173F35] font-sans text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we offer summary */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.offer.eyebrow}</div>
            <h2 className="font-display text-4xl font-semibold text-white">{a.offer.title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {offerItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 hover:border-[#C99A45]/40 p-5 text-center transition-colors duration-200">
                <div className="text-white/70 font-sans text-xs leading-snug">{a.offer.items[item.id]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] py-28 overflow-hidden">
        <img src={photos.pavilions} alt={t.photos.pavilions} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0e2820]/82" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            {t.common.comeBePart}
          </h2>
          <p className="text-white/55 font-sans text-base max-w-xl mx-auto mb-10 leading-relaxed">
            {a.cta.desc}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/visit" className="inline-flex items-center gap-2 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {t.common.planVisit}
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {t.common.getInTouch}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
