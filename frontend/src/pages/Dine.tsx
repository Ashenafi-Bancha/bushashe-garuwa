import { useState } from 'react';
import { Link } from 'react-router-dom';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';

type MenuCategory = keyof Dictionary['dine']['menu'];

const menuCategories: MenuCategory[] = ['wolaita', 'ethiopian', 'drinks', 'special'];

/* Real dish photos by menu id (e.g. kitfo: photos.kitfo) — add them here as the client supplies them */
const dishPhotos: Record<string, string | undefined> = {};

export default function Dine() {
  const { t } = useI18n();
  const dn = t.dine;
  const [activeMenu, setActiveMenu] = useState<MenuCategory>('wolaita');

  return (
    <main>
      {/* Hero */}
      <PageHero slot="dine" eyebrow={dn.hero.eyebrow} title={dn.hero.title} desc={dn.hero.desc} />

      {/* Menu */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-14">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveMenu(cat)}
                className={`text-xs font-sans font-semibold rounded-full px-6 py-3 transition-colors border ${
                  activeMenu === cat
                    ? 'bg-[#0E8A50] text-white border-[#0E8A50]'
                    : 'border-[#1E3A29]/20 text-[#1E3A29]/60 hover:border-[#1E3A29]/50 hover:text-[#1E3A29]'
                }`}
              >
                {dn.categories[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Object.entries(dn.menu[activeMenu]).map(([id, item]) => (
              <div key={id} className="bg-white heritage-card overflow-hidden">
                <div className="img-zoom aspect-square sm:aspect-video bg-[#1E3A29]/10">
                  <Photo src={dishPhotos[id]} alt={item.name} label={item.name} className="w-full h-full object-cover"/>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A29] mb-1.5 sm:mb-2 leading-tight">{item.name}</h3>
                  <p className="text-[#1E3A29]/55 text-xs font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/events" className="btn-primary">
              {dn.joinEvent}
            </Link>
          </div>
        </div>
      </section>

      {/* Bar: what it is and when it is open, then its drinks in two kinds, cultural and modern */}
      <section id="bar" className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[3rem] py-14 sm:py-20 lg:py-24 mb-12 sm:mb-16">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 lg:items-end mb-10 sm:mb-12">
            <div>
              <span className="eyebrow mb-5 !bg-white">{dn.bar.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#13261A] leading-[1] mb-5">{dn.bar.title}</h2>
              <p className="text-[#1E3A29]/80 text-base sm:text-lg leading-relaxed max-w-xl">{dn.bar.desc}</p>
            </div>
            {/* opening hours */}
            <div className="bg-white rounded-[1.5rem] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[#0B6E40] text-xs font-bold tracking-[0.14em] uppercase mb-4">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {dn.bar.hours}
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[#1E3A29]/60 text-sm">{dn.bar.weekdays}</dt>
                  <dd className="font-display text-xl sm:text-3xl font-extrabold text-[#1E3A29] tabular-nums whitespace-nowrap mt-1">14:00 – 22:00</dd>
                </div>
                <div>
                  <dt className="text-[#1E3A29]/60 text-sm">{dn.bar.weekends}</dt>
                  <dd className="font-display text-xl sm:text-3xl font-extrabold text-[#1E3A29] tabular-nums whitespace-nowrap mt-1">12:00 – 23:00</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* the drinks: cultural ones and modern ones, each in its own card */}
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {([
              { kind: dn.bar.cultural, accent: 'bg-[#C4622D]', mark: 'text-[#C4622D]' },
              { kind: dn.bar.modern, accent: 'bg-[#0E8A50]', mark: 'text-[#0E8A50]' },
            ] as const).map(({ kind, accent, mark }) => (
              <div key={kind.title} className="bg-white rounded-[1.75rem] overflow-hidden elev-1">
                <div className={`h-1.5 ${accent}`} />
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E3A29] tracking-tight">{kind.title}</h3>
                  <p className="text-[#1E3A29]/65 text-sm sm:text-base mt-1.5 mb-5">{kind.desc}</p>
                  <ul className="divide-y divide-[#1E3A29]/10">
                    {kind.items.map((drink) => (
                      <li key={drink} className="flex items-center gap-3 py-3.5 text-[#1E3A29] text-base sm:text-lg font-semibold">
                        <span className={`text-xl leading-none ${mark}`} aria-hidden="true">•</span>
                        {drink}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
