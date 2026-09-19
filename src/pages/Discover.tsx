import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

const pillars = [
  { id: 'heritage', icon: '🏛' },
  { id: 'nature', icon: '🌳' },
  { id: 'knowledge', icon: '📚' },
  { id: 'hospitality', icon: '☕' },
] as const;

export default function Discover() {
  const { t } = useI18n();
  const d = t.discover;
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <img src={photos.home} alt={t.photos.home} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <span className="eyebrow glass text-white mb-5">{d.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02]">{d.hero.title}</h1>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{d.story.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#173F35] leading-tight mb-6">{d.story.title}</h2>
              <p className="text-[#1D211E]/70 font-sans text-base leading-relaxed mb-5">
                {d.story.p1}
              </p>
              <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed">
                {d.story.p2}
              </p>
            </div>
            <div className="img-zoom aspect-[4/5] rounded-[2rem] bg-[#173F35]/10">
              <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 sm:mb-20">
            <div className="bg-[#173F35] rounded-3xl p-6 sm:p-10">
              <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-4">{d.mission.label}</div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-4">{d.mission.title}</h3>
              <p className="text-white/60 font-sans text-sm leading-relaxed">
                {d.mission.text}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#173F35]/10 p-6 sm:p-10">
              <div className="text-[#C99A45] text-xs font-sans tracking-wider uppercase mb-4">{d.vision.label}</div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#173F35] mb-4">{d.vision.title}</h3>
              <p className="text-[#1D211E]/60 font-sans text-sm leading-relaxed">
                {d.vision.text}
              </p>
            </div>
          </div>

          {/* Four pillars */}
          <div className="text-center mb-12">
            <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{d.pillars.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#173F35]">{d.pillars.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="bg-white rounded-2xl border border-[#173F35]/10 p-7 hover:border-[#C99A45]/30 transition-colors">
                <div className="icon-tile mb-4">{pillar.icon}</div>
                <h3 className="font-display text-xl font-semibold text-[#173F35] mb-3">{d.pillars.items[pillar.id].title}</h3>
                <p className="text-[#1D211E]/55 font-sans text-sm leading-relaxed">{d.pillars.items[pillar.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">{t.common.comeBePart}</h2>
          <p className="text-white/55 font-sans text-base max-w-xl mx-auto mb-10">{d.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/visit" className="inline-flex items-center gap-2 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {t.common.planVisit}
            </Link>
            <Link to="/heritage" className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {d.cta.explore}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
