import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import CardGrid from '../components/CardGrid';

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
      <PageHero slot="discover" eyebrow={d.hero.eyebrow} title={d.hero.title} desc={t.common.goal.text} />

      {/* Our story */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <span className="eyebrow mb-5">{d.story.eyebrow}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E3A29] leading-tight mb-6">{d.story.title}</h2>
              <p className="text-[#1E3A29]/70 font-sans text-base leading-relaxed mb-5">
                {d.story.p1}
              </p>
              <p className="text-[#1E3A29]/60 font-sans text-base leading-relaxed">
                {d.story.p2}
              </p>
            </div>
            <div className="img-zoom aspect-[4/5] rounded-[2rem] bg-[#1E3A29]/10">
              <img {...picture(photos.lawn)} alt={t.photos.lawn} className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 sm:mb-20">
            <div className="bg-[#0E8A50] rounded-3xl p-6 sm:p-10">
              <div className="text-white/85 text-xs font-sans font-semibold tracking-wider uppercase mb-4">{d.mission.label}</div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-4">{d.mission.title}</h3>
              <p className="text-white/90 font-sans text-sm leading-relaxed">
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
            <span className="eyebrow mb-5">{d.pillars.eyebrow}</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E3A29]">{d.pillars.title}</h2>
          </div>
          <CardGrid grid="md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => (
              <div key={pillar.id} className="h-full bg-white heritage-card p-7">
                <span className="block text-[#C4622D] text-sm font-bold tabular-nums mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl font-bold text-[#1E3A29] mb-3">{d.pillars.items[pillar.id].title}</h3>
                <p className="text-[#1E3A29]/60 font-sans text-sm leading-relaxed">{d.pillars.items[pillar.id].desc}</p>
              </div>
            ))}
          </CardGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#13261A] mb-4">{t.common.comeBePart}</h2>
          <p className="text-[#1E3A29]/80 font-sans text-base max-w-xl mx-auto mb-10">{d.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/visit" className="btn-primary">
              {t.common.planVisit}
            </Link>
            <Link to="/heritage" className="btn-outline text-[#1E3A29]">
              {d.cta.explore}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
