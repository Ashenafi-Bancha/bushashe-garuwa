import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';

/* Page structure — the text for each id lives in the translations (t.heritage.*) */
const categories = [
  { id: 'houses', img: photos.house, count: 2, to: '/heritage/houses' },
  { id: 'trees', img: photos.enset, count: 24, to: '/heritage/trees' },
  { id: 'animals', count: 15, to: '/heritage/animals' },
  { id: 'artifacts', count: 120, to: '/heritage/artifacts' },
  { id: 'clothing', img: photos.gifaataa2, count: 35, to: '/heritage/clothing' },
  { id: 'music', count: 18, to: '/heritage/music' },
  { id: 'food', img: photos.food, count: 40, to: '/dine' },
  { id: 'stories', count: 60, to: '/heritage/stories' },
] as const;

/* The two traditional houses keep their Wolaytta names in every language */
const houseNames = ['Gulanttaa Keettaa', 'Meesho Keettaa'];

/* Wolaytta and scientific names stay the same in every language */
const trees = [
  { id: 'goba', wolaytta: 'Goba', scientific: 'Ficus sycomorus' },
  { id: 'doro', wolaytta: 'Doro', scientific: 'Acacia abyssinica' },
  { id: 'wonka', wolaytta: 'Wonka', scientific: 'Ensete ventricosum' },
  { id: 'tigo', wolaytta: 'Tigo', scientific: 'Olea europaea subsp. africana' },
  { id: 'zigba', wolaytta: 'Zigba', scientific: 'Podocarpus falcatus' },
] as const;

export default function Heritage() {
  const { t } = useI18n();
  const hg = t.heritage;
  const [activeTree, setActiveTree] = useState<number | null>(null);

  return (
    <main>
      {/* Hero */}
      <PageHero photo="house" eyebrow={hg.hero.eyebrow} title={hg.hero.title} desc={hg.intro} />

      {/* Heritage categories grid */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-7">
            {categories.map((cat) => {
              const text = hg.categories[cat.id];
              return (
              <Link key={cat.id} to={cat.to} className="group block">
                <div className="img-zoom rounded-[1.25rem] sm:rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-[#1E3A29]/10 elev-1">
                  <Photo src={'img' in cat ? cat.img : undefined} alt={text.label} label={text.label} className="w-full h-full object-cover"/>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-[#1E3A29]/12 group-hover:border-[#1E3A29] transition-colors">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A29] leading-tight">{text.label}</h3>
                  <span aria-hidden="true" className="text-[#1E3A29] text-lg leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </div>
                <p className="mt-2 sm:mt-3 text-[#1E3A29]/60 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{text.desc}</p>
                <span className="mt-2 block text-[#C4622D] text-xs">{fmt(hg.itemCount, { count: cat.count })}</span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The two traditional houses */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="img-zoom rounded-[2rem] aspect-[4/3] bg-[#1E3A29]/10">
            <img src={photos.house} alt={t.photos.house} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <span className="eyebrow bg-[#1E3A29]/10 text-[#1E3A29] mb-5">{hg.houses.eyebrow}</span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#1E3A29] leading-[1.05] mb-5">{hg.houses.title}</h2>
            <p className="text-[#1E3A29]/65 text-base sm:text-lg leading-relaxed mb-8">{hg.houses.desc}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {houseNames.map((name) => (
                <div key={name} className="heritage-card bg-white p-6">
                  <div className="text-[#C4622D] text-[11px] font-semibold tracking-[0.12em] uppercase mb-2">{hg.houses.label}</div>
                  <div lang="wal" className="font-display text-2xl text-[#1E3A29]">{name}</div>
                </div>
              ))}
            </div>
            <p className="text-[#1E3A29]/55 text-sm leading-relaxed">{hg.houses.inside}</p>
          </div>
        </div>
      </section>

      {/* Trees section */}
      <section className="bg-[#1E3A29] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <div className="text-[#C4622D] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{hg.trees.eyebrow}</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">{hg.trees.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trees.map((tree, i) => {
              const text = hg.trees.items[tree.id];
              return (
              <button
                key={tree.id}
                onClick={() => setActiveTree(activeTree === i ? null : i)}
                className="text-left rounded-2xl border border-white/10 hover:border-[#C4622D]/40 p-6 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[#C4622D] font-display text-2xl font-semibold mb-1">{tree.wolaytta}</div>
                    <div className="text-white/70 font-sans text-sm mb-1">{text.name}</div>
                    <div className="text-white/30 font-sans text-xs italic">{tree.scientific}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white/40 text-xs font-sans">{text.age}</div>
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
            <div className="inline-flex items-center gap-3 rounded-full border border-[#C4622D]/30 text-[#C4622D] text-sm font-sans px-6 py-3">
              {hg.trees.qr}
            </div>
          </div>
        </div>
      </section>

      {/* Family history CTA */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow mb-5">{hg.family.eyebrow}</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E3A29] leading-tight mb-6">{hg.family.title}</h2>
              <p className="text-[#1E3A29]/70 font-sans text-base leading-relaxed mb-8">
                {hg.family.desc}
              </p>
              <Link to="/about#family" className="inline-flex items-center gap-2 bg-[#1E3A29] hover:bg-[#2D5239] text-white text-sm font-sans font-semibold rounded-full px-8 py-4 transition-colors">
                {hg.family.cta}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hg.family.generations.map((gen, i) => (
                <Link key={i} to="/about#family" className="heritage-card bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#86A94F] text-[#13261A] flex items-center justify-center font-display text-lg sm:text-2xl font-extrabold flex-shrink-0">{i + 1}</span>
                  <span className="font-display text-lg sm:text-2xl font-bold text-[#1E3A29] leading-tight">{gen}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
