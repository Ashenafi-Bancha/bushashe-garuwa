import { useState } from 'react';
import { photos } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

type Filter = keyof Dictionary['library']['filters'];

const filters: Filter[] = ['all', 'history', 'culture', 'language', 'agriculture', 'knowledge', 'family'];

/* Catalogue facts — titles, authors and descriptions live in the translations (t.library.resources) */
const resources: { id: keyof Dictionary['library']['resources']; year: string; cat: Exclude<Filter, 'all'> }[] = [
  { id: 'origins', year: '2018', cat: 'history' },
  { id: 'agriculture', year: '2020', cat: 'agriculture' },
  { id: 'grammar', year: '2015', cat: 'language' },
  { id: 'ceremonies', year: '2019', cat: 'culture' },
  { id: 'chronicle', year: '2022', cat: 'family' },
  { id: 'ensete', year: '2017', cat: 'agriculture' },
  { id: 'knowledge', year: '2021', cat: 'knowledge' },
  { id: 'literature', year: '2016', cat: 'culture' },
];

export default function Library() {
  const { t } = useI18n();
  const lb = t.library;
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const q = query.toLowerCase();
  const filtered = resources
    .map((r) => ({ ...r, ...lb.resources[r.id] }))
    .filter((r) => {
      const matchesCat = activeFilter === 'all' || r.cat === activeFilter;
      const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <img src={photos.gardens} alt={t.photos.gardens} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/40 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{lb.hero.eyebrow}</div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">{lb.hero.title}</h1>
        </div>
      </section>

      {/* Search + filter */}
      <section className="bg-[#173F35] py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-xl mb-8">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder={lb.searchPlaceholder}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 pl-11 pr-4 py-3 font-sans text-sm focus:outline-none focus:border-[#C99A45] transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 transition-colors border ${
                  activeFilter === f
                    ? 'bg-[#C99A45] text-[#173F35] border-[#C99A45]'
                    : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                }`}
              >
                {lb.filters[f]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-[#F6F1E7] py-12 sm:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-[#1D211E]/40 font-sans text-sm">{fmt(filtered.length === 1 ? lb.resultsOne : lb.resultsMany, { count: filtered.length })}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((res) => (
              <div key={res.id} className="bg-white heritage-card flex flex-col">
                {/* Book cover placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-[#173F35] to-[#0e2820] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 pattern-weave"/>
                  <div className="relative z-10 text-center">
                    <div className="text-[#C99A45]/60 text-xs font-sans tracking-wider uppercase mb-4">{lb.filters[res.cat]}</div>
                    <div className="text-white font-serif text-lg font-light leading-snug mb-4">{res.title}</div>
                    <div className="w-12 h-px bg-[#C99A45]/40 mx-auto"/>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-base font-medium text-[#173F35] mb-1">{res.title}</h3>
                  <div className="text-[#1D211E]/45 text-xs font-sans mb-3">{res.author} · {res.year}</div>
                  <p className="text-[#1D211E]/55 text-xs font-sans leading-relaxed flex-1 mb-4">{res.desc}</p>
                  <button className="border border-[#173F35]/20 hover:border-[#173F35] text-[#173F35]/70 hover:text-[#173F35] text-xs font-sans font-semibold uppercase tracking-wider py-2.5 transition-colors">
                    {lb.viewResource}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#1D211E]/40 font-sans">
              {lb.empty}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
