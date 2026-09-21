import { useCallback, useEffect, useState } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { lockScroll, Tilt } from '../lib/motion';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';

type Category = Exclude<keyof Dictionary['gallery']['filters'], 'all'>;
type Filter = Category | 'all';

/** Every real photo, with the category it belongs to. Add new ones here as they are registered in photos.ts. */
/* `span` is the tile size in the full mosaic (All); it fills the 4-column grid exactly.
   The small zigba photo always gets a small tile. */
const items: { key: PhotoKey; cat: Category; span: string }[] = [
  { key: 'home', cat: 'grounds', span: 'sm:col-span-2 sm:row-span-2' },
  { key: 'gifaataa1', cat: 'culture', span: '' },
  { key: 'house', cat: 'grounds', span: 'sm:row-span-2' },
  { key: 'gifaataa2', cat: 'culture', span: '' },
  { key: 'pavilions', cat: 'grounds', span: 'sm:col-span-2' },
  { key: 'gifaataa3', cat: 'culture', span: '' },
  { key: 'gardens', cat: 'grounds', span: '' },
  { key: 'enset', cat: 'grounds', span: 'sm:col-span-2' },
  { key: 'zigba', cat: 'grounds', span: '' },
  { key: 'lawn', cat: 'grounds', span: '' },
];

const filters: Filter[] = ['all', 'grounds', 'culture'];

/** Repeating mosaic pattern so any number of photos still fills the grid tidily. */
const spans = [
  'sm:col-span-2 sm:row-span-2',
  '',
  'sm:row-span-2',
  '',
  'sm:col-span-2',
  '',
  '',
  'sm:col-span-2',
];

export default function Gallery() {
  const { t } = useI18n();
  const g = t.gallery;
  const [filter, setFilter] = useState<Filter>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const shown = filter === 'all' ? items : items.filter((i) => i.cat === filter);
  const current = openIdx === null ? null : shown[openIdx];

  const close = useCallback(() => setOpenIdx(null), []);
  const step = useCallback(
    (delta: number) => setOpenIdx((i) => (i === null ? i : (i + delta + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    lockScroll(openIdx !== null);
    return () => lockScroll(false);
  }, [openIdx]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx, close, step]);

  return (
    <>
    <main>
      {/* Hero */}
      <PageHero photo="home" eyebrow={g.hero.eyebrow} title={g.hero.title} desc={g.intro} />

      {/* Filters + grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setOpenIdx(null); }}
                aria-pressed={filter === f}
                className={`text-sm font-semibold rounded-full px-5 py-2.5 border transition-all duration-300 ${
                  filter === f
                    ? 'bg-[#0e2820] text-white border-[#0e2820]'
                    : 'border-[#0e2820]/15 text-[#0e2820]/70 hover:border-[#0e2820]/50 hover:text-[#0e2820]'
                }`}
              >
                {g.filters[f]}
              </button>
            ))}
            <span className="ml-auto text-[#1D211E]/40 text-sm whitespace-nowrap">{fmt(g.count, { count: shown.length })}</span>
          </div>

          {shown.length === 0 ? (
            <p className="py-20 text-center text-[#1D211E]/40">{g.empty}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[150px] sm:auto-rows-[210px] lg:auto-rows-[240px] gap-3 sm:gap-4">
              {shown.map((item, i) => (
                <Tilt key={item.key} className={`rounded-2xl sm:rounded-3xl ${filter === 'all' ? item.span : spans[i % spans.length]}`} max={5}>
                  <button
                    onClick={() => setOpenIdx(i)}
                    className="img-zoom group relative block w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#173F35]/8"
                  >
                    <img src={photos[item.key]} alt={t.photos[item.key]} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#0a1f19]/85 via-[#0a1f19]/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-left">
                      <span className="block font-display text-base sm:text-xl text-white leading-tight">{t.photoCaptions[item.key].title}</span>
                      <span className="hidden sm:block text-white/75 text-xs sm:text-sm leading-snug mt-1 line-clamp-2">{t.photoCaptions[item.key].desc}</span>
                    </span>
                  </button>
                </Tilt>
              ))}
            </div>
          )}
        </div>
      </section>

      </main>

      {/* Full-screen viewer — outside <main> so it covers the whole window */}
      <div
        inert={openIdx === null}
        className={`fixed inset-0 z-[60] flex flex-col transition-opacity duration-400 ${
          openIdx === null ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ background: 'rgba(8,24,19,0.96)', backdropFilter: 'blur(12px)' }}
        role="dialog"
        aria-modal="true"
        aria-label={g.hero.title}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 py-5">
          <span className="text-white/60 text-sm tabular-nums">
            {openIdx !== null && fmt(g.position, { current: openIdx + 1, total: shown.length })}
          </span>
          <button onClick={close} className="touch-target rounded-full text-white/70 hover:text-white hover:bg-white/10" aria-label={g.close}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 px-3 sm:px-8 pb-6 min-h-0">
          <button onClick={() => step(-1)} className="touch-target rounded-full text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0" aria-label={g.previous}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <figure className="min-w-0 flex-1 h-full flex flex-col items-center justify-center gap-4">
            {current && (
              <>
                <img
                  key={current.key}
                  src={photos[current.key]}
                  alt={t.photos[current.key]}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl animate-scale-in"
                />
                <figcaption className="text-center max-w-2xl">
                  <span className="block font-display text-2xl sm:text-3xl text-white">{t.photoCaptions[current.key].title}</span>
                  <span className="block text-white/65 text-sm sm:text-base mt-2 leading-relaxed">{t.photoCaptions[current.key].desc}</span>
                </figcaption>
              </>
            )}
          </figure>

          <button onClick={() => step(1)} className="touch-target rounded-full text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0" aria-label={g.next}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
