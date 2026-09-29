import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';

const pillars = [
  { id: 'heritage' },
  { id: 'nature' },
  { id: 'knowledge' },
  { id: 'hospitality' },
] as const;

export default function Discover() {
  const { t } = useI18n();
  const d = t.discover;
  return (
    <main>
      {/* Hero */}
      <PageHero photo="home" eyebrow={d.hero.eyebrow} title={d.hero.title} desc={t.common.goal.text} />

      {/* Our story */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <div className="text-[#1E3A29] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{d.story.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E3A29] leading-tight mb-6">{d.story.title}</h2>
              <p className="text-[#1E3A29]/70 font-sans text-base leading-relaxed mb-5">
                {d.story.p1}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed">
                {d.story.p2}
              </p>
            </div>
            <div className="img-zoom aspect-[4/5] rounded-[2rem] bg-[#1E3A29]/10">
              <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 sm:mb-20">
            <div className="bg-[#1E3A29] rounded-3xl p-6 sm:p-10">
              <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-4">{d.mission.label}</div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-4">{d.mission.title}</h3>
              <p className="text-white/60 font-sans text-sm leading-relaxed">
                {d.mission.text}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#1E3A29]/10 p-6 sm:p-10">
              <div className="text-[#C4622D] text-xs font-sans tracking-wider uppercase mb-4">{d.vision.label}</div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1E3A29] mb-4">{d.vision.title}</h3>
              <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">
                {d.vision.text}
              </p>
            </div>
          </div>

          {/* Four pillars */}
          <div className="text-center mb-12">
            <div className="text-[#1E3A29] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{d.pillars.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E3A29]">{d.pillars.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="bg-white rounded-2xl border border-[#1E3A29]/10 p-7 hover:border-[#C4622D]/30 transition-colors">
                <h3 className="font-display text-xl font-semibold text-[#1E3A29] mb-3">{d.pillars.items[pillar.id].title}</h3>
                <p className="text-[#1E3A29]/55 font-sans text-sm leading-relaxed">{d.pillars.items[pillar.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A29] mx-2 sm:mx-3 rounded-[2rem] py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">{t.common.comeBePart}</h2>
          <p className="text-white/55 font-sans text-base max-w-xl mx-auto mb-10">{d.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/visit" className="inline-flex items-center gap-2 bg-[#86A94F] hover:bg-[#B9D38A] text-[#13261A] text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
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
