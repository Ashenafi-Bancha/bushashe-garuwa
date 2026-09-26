import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
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
      <PageHero photo="food" eyebrow={dn.hero.eyebrow} title={dn.hero.title} desc={dn.hero.desc} />

      {/* Menu */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-14">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveMenu(cat)}
                className={`text-xs font-sans font-semibold rounded-full px-6 py-3 transition-colors border ${
                  activeMenu === cat
                    ? 'bg-[#173F35] text-white border-[#173F35]'
                    : 'border-[#173F35]/20 text-[#173F35]/60 hover:border-[#173F35]/50 hover:text-[#173F35]'
                }`}
              >
                {dn.categories[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(dn.menu[activeMenu]).map(([id, item]) => (
              <div key={id} className="bg-white heritage-card overflow-hidden">
                <div className="img-zoom aspect-video bg-[#173F35]/10">
                  <Photo src={dishPhotos[id]} alt={item.name} label={item.name} className="w-full h-full object-cover"/>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-[#173F35] mb-2">{item.name}</h3>
                  <p className="text-[#1D211E]/55 text-xs font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/events" className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1e5447] text-white text-sm font-sans font-semibold rounded-full px-8 py-4 transition-colors">
              {dn.joinEvent}
            </Link>
          </div>
        </div>
      </section>

      {/* Bar section */}
      <section id="bar" className="relative mx-2 sm:mx-3 rounded-[2rem] py-24 lg:py-32 overflow-hidden">
        <img src={photos.gardens} alt={t.photos.gardens} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-[#0e2820]/88"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-4">{dn.bar.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">{dn.bar.title}</h2>
              <p className="text-white/65 font-sans text-base leading-relaxed mb-8">
                {dn.bar.desc}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8 text-white/60 font-sans text-sm">
                <div><div className="text-[#C99A45] text-xs tracking-wider uppercase mb-1">{dn.bar.weekdays}</div>14:00 – 22:00</div>
                <div><div className="text-[#C99A45] text-xs tracking-wider uppercase mb-1">{dn.bar.weekends}</div>12:00 – 23:00</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {dn.bar.drinks.map((drink, i) => (
                <div key={i} className="rounded-2xl border border-white/10 p-4 text-white/60 font-sans text-sm hover:border-[#C99A45]/30 hover:text-white/80 transition-colors">
                  {drink}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
