import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

type Category = 'all' | 'food' | 'culture' | 'education' | 'music' | 'community';
type AvailKind = 'limited' | 'open' | 'group';

const categories: Category[] = ['all', 'food', 'culture', 'education', 'music', 'community'];

/* Schedule data — names, dates and descriptions live in the translations (t.events.items) */
const events: { id: keyof Dictionary['events']['items']; date: string; time: string; cat: Exclude<Category, 'all'>; availKind: AvailKind; featured: boolean }[] = [
  { id: 'foodOct', date: '2026-10-05', time: '17:00 – 21:00', cat: 'food', availKind: 'limited', featured: true },
  { id: 'oralHistory', date: '2026-10-12', time: '16:00 – 18:30', cat: 'culture', availKind: 'open', featured: false },
  { id: 'harvest', date: '2026-10-19', time: '17:00 – 20:00', cat: 'community', availKind: 'open', featured: true },
  { id: 'schoolDay', date: '2026-10-25', time: '08:30 – 14:00', cat: 'education', availKind: 'group', featured: false },
  { id: 'foodNov', date: '2026-11-02', time: '17:00 – 21:00', cat: 'food', availKind: 'open', featured: false },
  { id: 'music', date: '2026-11-08', time: '10:00 – 13:00', cat: 'music', availKind: 'open', featured: false },
];

export default function Events() {
  const { t } = useI18n();
  const e = t.events;
  const [activeCat, setActiveCat] = useState<Category>('all');

  const withText = events.map((ev) => ({ ...ev, ...e.items[ev.id] }));
  const filtered = activeCat === 'all' ? withText : withText.filter((ev) => ev.cat === activeCat);
  const featured = withText.filter((ev) => ev.featured);
  const availStyle = (kind: AvailKind, dark: boolean) =>
    kind === 'limited'
      ? dark ? 'bg-[#A65A3A]/20 text-[#A65A3A]' : 'bg-[#A65A3A]/10 text-[#A65A3A]'
      : kind === 'group'
        ? 'bg-[#173F35]/10 text-[#173F35]'
        : dark ? 'bg-[#173F35] text-[#C99A45]' : 'bg-[#C99A45]/10 text-[#C99A45]';

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <img src={photos.gifaataa3} alt={t.photos.gifaataa3} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <span className="eyebrow glass text-white mb-5">{e.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02]">{e.hero.titleA}<br/>{e.hero.titleB}</h1>
        </div>
      </section>

      {/* Featured events */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-10">{e.featured}</div>
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((ev) => (
              <div key={ev.id} className="group relative overflow-hidden flex flex-col rounded-3xl bg-[#0e2820]/50 border border-white/10 hover:border-[#C99A45]/30 transition-all duration-300">
                <div className="img-zoom aspect-[16/9] bg-[#0e2820]">
                  <Photo alt={ev.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                </div>
                <div className="p-5 sm:p-7 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[#C99A45] text-xs font-sans tracking-wider">{ev.dateLabel}</span>
                      <span className="text-white/40 text-xs font-sans ml-3">· {ev.time}</span>
                    </div>
                    <span className={`text-xs font-sans rounded-full px-3 py-1 flex-shrink-0 ${availStyle(ev.availKind, true)}`}>
                      {ev.avail}
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-white mb-3">{ev.name}</h2>
                  <p className="text-white/55 font-sans text-sm leading-relaxed mb-5 flex-1">{ev.desc}</p>
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-xs font-sans font-semibold rounded-full px-5 py-3 transition-colors">
                      {t.common.reserveYourPlace}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All events */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 mb-10 flex-wrap">
            <h2 className="font-display text-3xl font-semibold text-[#173F35]">{e.upcoming}</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`text-xs font-sans font-semibold rounded-full px-4 py-2 transition-colors border ${
                    activeCat === cat
                      ? 'bg-[#173F35] text-white border-[#173F35]'
                      : 'border-[#173F35]/20 text-[#173F35]/60 hover:border-[#173F35]/50 hover:text-[#173F35]'
                  }`}
                >
                  {e.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((ev) => (
              <div key={ev.id} className="bg-white heritage-card flex flex-col sm:flex-row overflow-hidden">
                <div className="img-zoom sm:w-48 flex-shrink-0 aspect-video sm:aspect-auto bg-[#173F35]/10">
                  <Photo alt={ev.name} className="w-full h-full object-cover"/>
                </div>
                <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[#C99A45] text-xs font-sans tracking-wider">{ev.dateLabel}</span>
                      <span className="text-[#1D211E]/30 text-xs font-sans">{ev.time}</span>
                      <span className="bg-[#F7F5F0] text-[#173F35] text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5">{e.categories[ev.cat]}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#173F35] mb-2">{ev.name}</h3>
                    <p className="text-[#1D211E]/55 text-sm font-sans leading-relaxed">{ev.desc}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 flex-shrink-0">
                    <span className={`text-xs font-sans rounded-full px-3 py-1 ${availStyle(ev.availKind, false)}`}>
                      {ev.avail}
                    </span>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1e5447] text-white text-xs font-sans font-semibold rounded-full px-4 py-2.5 transition-colors whitespace-nowrap">
                      {t.common.reserve}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
