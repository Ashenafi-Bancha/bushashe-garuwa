import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

/* Icons per item — the text lives in the translations (t.about.*) */
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
  return (
    <main className="pt-20">

      {/* Hero */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] h-[65vh] min-h-[440px] flex items-end overflow-hidden">
        <img
          src={photos.gifaataa2}
          alt={t.photos.gifaataa2}
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/95 via-[#173F35]/50 to-[#173F35]/10" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <span className="eyebrow glass text-white mb-5">{a.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02] max-w-3xl">
            {a.hero.titleA}<br />
            <span className="text-[#C99A45]">{a.hero.titleB}</span>
          </h1>
          <p className="text-white/60 font-sans text-base mt-5 max-w-xl leading-relaxed">
            {t.common.slogan}
          </p>
        </div>
      </section>

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
                {a.who.p2}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed">
                {a.who.p3}
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
              <div className="absolute -top-5 -right-5 bg-[#C99A45] rounded-2xl shadow-xl p-6 hidden lg:block">
                <div className="text-[#173F35] font-display text-3xl font-semibold">100+</div>
                <div className="text-[#173F35]/70 font-sans text-xs tracking-wider uppercase mt-1">{a.who.years}</div>
              </div>
            </div>
          </div>
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

      {/* Generations */}
      <section className="bg-[#1D211E] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{a.generations.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">{a.generations.title}</h2>
            <p className="text-white/45 font-sans text-base mt-4 max-w-xl leading-relaxed">
              {a.generations.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {a.generations.items.map((gen, i) => (
              <div key={i} className="flex gap-6 rounded-3xl border border-white/10 hover:border-[#C99A45]/30 p-7 transition-colors duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border-2 border-[#C99A45]/50 flex items-center justify-center">
                    <span className="text-[#C99A45] font-display text-lg font-semibold">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-1">{gen.label}</div>
                  <div className="text-white font-display text-xl font-semibold mb-3">{gen.role}</div>
                  <p className="text-white/50 font-sans text-sm leading-relaxed">{gen.desc}</p>
                </div>
              </div>
            ))}
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
