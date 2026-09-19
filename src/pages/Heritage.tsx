import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';

/* Page structure — the text for each id lives in the translations (t.heritage.*) */
const categories = [
  { id: 'houses', icon: '🏠', img: photos.house, count: 8, to: '/heritage/houses' },
  { id: 'trees', icon: '🌳', img: photos.lawn, count: 24, to: '/heritage/trees' },
  { id: 'animals', icon: '🐐', count: 15, to: '/heritage/animals' },
  { id: 'artifacts', icon: '🏛', count: 120, to: '/heritage/artifacts' },
  { id: 'clothing', icon: '👘', img: photos.gifaataa2, count: 35, to: '/heritage/clothing' },
  { id: 'music', icon: '🎵', count: 18, to: '/heritage/music' },
  { id: 'food', icon: '🍲', count: 40, to: '/dine' },
  { id: 'stories', icon: '📖', count: 60, to: '/heritage/stories' },
] as const;

/* Wolaytta and scientific names stay the same in every language */
const trees = [
  { id: 'goba', wolaytta: 'Goba', scientific: 'Ficus sycomorus' },
  { id: 'doro', wolaytta: 'Doro', scientific: 'Acacia abyssinica' },
  { id: 'wonka', wolaytta: 'Wonka', scientific: 'Ensete ventricosum' },
  { id: 'tigo', wolaytta: 'Tigo', scientific: 'Olea europaea subsp. africana' },
] as const;

export default function Heritage() {
  const { t } = useI18n();
  const hg = t.heritage;
  const [activeTree, setActiveTree] = useState<number | null>(null);

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <img src={photos.house} alt={t.photos.house} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <span className="eyebrow glass text-white mb-5">{hg.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02]">{hg.hero.title}</h1>
        </div>
      </section>

      {/* Heritage categories grid */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <p className="text-[#1D211E]/60 font-sans text-base leading-relaxed max-w-2xl">
              {hg.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const text = hg.categories[cat.id];
              return (
              <Link key={cat.id} to={cat.to} className="group bg-white overflow-hidden heritage-card">
                <div className="img-zoom aspect-video bg-[#173F35]/10">
                  <Photo src={'img' in cat ? cat.img : undefined} alt={text.label} className="w-full h-full object-cover"/>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[#C99A45] text-xs font-sans">{fmt(hg.itemCount, { count: cat.count })}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#173F35] mb-2">{text.label}</h3>
                  <p className="text-[#1D211E]/55 text-xs font-sans leading-relaxed">{text.desc}</p>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trees section */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{hg.trees.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">{hg.trees.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trees.map((tree, i) => {
              const text = hg.trees.items[tree.id];
              return (
              <button
                key={tree.id}
                onClick={() => setActiveTree(activeTree === i ? null : i)}
                className="text-left rounded-2xl border border-white/10 hover:border-[#C99A45]/40 p-6 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[#C99A45] font-display text-2xl font-semibold mb-1">{tree.wolaytta}</div>
                    <div className="text-white/70 font-sans text-sm mb-1">{text.name}</div>
                    <div className="text-white/30 font-sans text-xs italic">{tree.scientific}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white/40 text-xs font-sans">{text.age}</div>
                    <div className={`mt-2 text-[#C99A45] text-xs transition-transform ${activeTree === i ? 'rotate-180' : ''}`}>↓</div>
                  </div>
                </div>
                {activeTree === i && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-white/60 font-sans text-sm leading-relaxed">
                    {text.sig}
                  </div>
                )}
              </button>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#C99A45]/30 text-[#C99A45] text-sm font-sans px-6 py-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              {hg.trees.qr}
            </div>
          </div>
        </div>
      </section>

      {/* Family history CTA */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-[#A65A3A] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{hg.family.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#173F35] leading-tight mb-6">{hg.family.title}</h2>
              <p className="text-[#1D211E]/70 font-sans text-base leading-relaxed mb-8">
                {hg.family.desc}
              </p>
              <Link to="/heritage/family" className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1e5447] text-white text-sm font-sans font-semibold rounded-full px-8 py-4 transition-colors">
                {hg.family.cta}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {hg.family.generations.map((gen, i) => (
                <div key={i} className={`aspect-square rounded-2xl bg-[#173F35]/10 flex flex-col items-center justify-center p-3 ${i === 2 ? 'col-span-1 row-span-2' : ''}`}>
                  <div className={`rounded-full bg-[#173F35]/20 mb-2 ${i === 2 ? 'w-16 h-16' : 'w-10 h-10'}`}/>
                  <div className="text-[#173F35] text-xs font-sans text-center leading-tight">{gen}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
