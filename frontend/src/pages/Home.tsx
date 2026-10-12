import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import { heroPhotos, useSiteMedia } from '../lib/media';
import QuickLinks, { GuestHouseSoon } from '../components/QuickLinks';
import CulturalFoodDates from '../components/CulturalFoodDates';
import CardGrid from '../components/CardGrid';
import { useSiteEvents } from '../lib/events';
import HomeContact from '../components/HomeContact';
import HeroName from '../components/HeroName';
import StickyBook from '../components/StickyBook';
import { useNoIndex } from '../lib/noindex';
import { deviceTier, forcedTier, rememberSlow } from '../three/device';

/** The 3D landscape opening, fetched only on the pages that use it */
const LandscapeHero = lazy(() => import('../three/LandscapeHero'));

const SLIDE_MS = 6000;

/* What else is on the grounds; the words are in the translations (t.home.facilities.items) */
const facilities = ['meetingHall', 'vip', 'zoo', 'pool', 'orchard', 'horses', 'crocodile', 'fish', 'restaurant'] as const;

/* ── A figure that counts up when it comes into view: "1,800+" counts to 1800 ── */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2]!.replace(/,/g, '')) : 0;
  const grouped = Boolean(match?.[2]!.includes(','));
  const [shown, setShown] = useState(match ? 0 : target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setShown(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span>{value}</span>;
  return <span ref={ref}>{match[1]}{grouped ? shown.toLocaleString('en-US') : shown}{match[3]}</span>;
}

export default function Home({ landscape = false }: { /** Open with the 3D landscape where the device can draw it */ landscape?: boolean }) {
  const { t, lang } = useI18n();
  const h = t.home;
  // devices that cannot draw the landscape smoothly keep the photographs
  const [tier, setTier] = useState(() => (landscape ? deviceTier() : 'none'));
  // with the landscape it is a page under review
  useNoIndex(landscape);
  // the built-in slides, or the ones staff added in the admin area (Page photos)
  const heroSlides = heroPhotos('home', useSiteMedia(), t, lang);
  const { events: siteEvents } = useSiteEvents();
  const slideIds = heroSlides.map((slide) => slide.id).join(' ');
  const [heroIdx, setHeroIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const goTo = (next: number) => {
    const n = (next + heroSlides.length) % heroSlides.length;
    if (n === heroIdx) return;
    setPrevIdx(heroIdx);
    setHeroIdx(n);
  };

  useEffect(() => {
    const timer = setTimeout(() => goTo(heroIdx + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [heroIdx, slideIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // a different set of slides starts again from its first photograph
  const [shownIds, setShownIds] = useState(slideIds);
  if (shownIds !== slideIds) {
    setShownIds(slideIds);
    setHeroIdx(0);
    setPrevIdx(null);
  }
  const slide = heroSlides[heroIdx] ?? heroSlides[0]!;
  const lastSlide = prevIdx === null ? undefined : heroSlides[prevIdx];

  // have every photograph ready so each slide opens without a flash
  // (after the first has had time to arrive, so they do not slow it down on a phone)
  useEffect(() => {
    const timer = setTimeout(() => {
      heroSlides.slice(1).forEach(({ src }) => {
        const img = new Image();
        const { srcSet, sizes } = picture(src);
        if (srcSet && sizes) {
          img.sizes = sizes;
          img.srcset = srcSet;
        }
        img.src = src;
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [slideIds]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <main>

        {/* ═════════ HERO ═════════
            The photographs come first, and the name, the line and the buttons are
            on the first screen with them. Computers: the photograph fills the upper
            part of the screen from edge to edge and runs up behind the header, so the
            header lies on the picture and is not a strip of its own; nothing else is
            laid over it. Phones and tablets: right under the header, whole, at the
            photograph's own shape.
            Each new photograph sweeps in from the right like a curtain while it
            settles; the one before drifts away underneath. The name and the words
            follow just below. Swipe on phones. */}
        {tier !== 'none' ? (
          <Suspense fallback={<div className="h-[100svh] bg-[#E3EBD8]" />}>
            <LandscapeHero
              tier={tier}
              watchSpeed={forcedTier() === null}
              onTooSlow={() => {
                rememberSlow();
                setTier('none');
              }}
            />
          </Suspense>
        ) : (
        <section className="relative" aria-label={h.hero.title}>
          <div
            className="relative mt-16 sm:mt-[72px] aspect-[3/2] lg:mt-0 lg:aspect-auto lg:h-[70svh] lg:min-h-[400px] overflow-hidden bg-[#E3EBD8]"
            onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              const start = touchX.current; touchX.current = null;
              const end = e.changedTouches[0]?.clientX;
              if (start === null || end === undefined || Math.abs(end - start) < 50) return;
              goTo(heroIdx + (end < start ? 1 : -1));
            }}
          >
            {lastSlide && (
              <div key={`out-${lastSlide.id}-${slide.id}`} className="hero-slide hero-slide-out">
                <img {...picture(lastSlide.src)} alt="" className={`w-full h-full object-cover ${lastSlide.pos}`} />
              </div>
            )}
            <div key={`in-${slide.id}`} className={`hero-slide ${lastSlide ? 'hero-slide-in' : 'hero-slide-first'}`}>
              <img
                {...picture(slide.src)}
                alt={slide.alt}
                fetchPriority="high"
                className={`hero-slide-img w-full h-full object-cover ${slide.pos}`}
              />
            </div>

            {/* a faint shade behind the header words at the very top */}
            <span className="hidden lg:block absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 via-black/15 to-transparent z-[3]" />

            {/* only a thin soft edge joins the photograph to the page; nothing lies over it */}
            <span className="absolute inset-x-0 bottom-0 h-6 lg:h-9 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />


            {/* the name of the place in the photograph, and the way to the next one */}
            <div className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:bottom-auto lg:right-8 lg:top-[100px] flex items-center gap-2">
              <span key={slide.id} className="rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
                {slide.title}
              </span>
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => goTo(heroIdx + 1)}
                  aria-label={h.hero.next}
                  className="hit-slim grid place-items-center w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#1E3A29] hover:bg-[#0E8A50] hover:text-white hover:border-[#0E8A50] transition-colors"
                >
                  →
                </button>
              )}
            </div>
          </div>

          {/* the words, just below the photograph */}
          <div className="relative z-[5] max-w-screen-xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 lg:pt-3 pb-6">
            {/* the name in the lettering of the main gate, raised in 3D, sized to the screen */}
            <HeroName title={h.hero.title} className="mb-6 lg:mb-4" />
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 animate-fade-up delay-300">
              <div className="max-w-xl">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E3A29] leading-tight tracking-tight mb-2">{h.hero.subtitle}</p>
                <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{h.hero.lead}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <Link to="/discover" className="btn-primary">{h.hero.explore}</Link>
                <Link to="/visit" className="btn-outline text-[#1E3A29]">{t.common.planVisit}</Link>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ═════════ THE WAY DOWN: a mouse whose wheel keeps rolling ═════════ */}
        <div className="scroll-cue pt-4 sm:pt-6 lg:pt-0" aria-hidden="true">
          <span className="scroll-cue-mouse">
            <span className="scroll-cue-wheel" />
          </span>
          <span className="scroll-cue-text">{h.hero.scroll}</span>
        </div>

        {/* ═════════ THE PLACE IN NUMBERS: a card for each figure ═════════ */}
        <section className="px-5 sm:px-8 pt-6 lg:pt-8">
          <ul data-wave className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {h.facts.items.map((fact) => (
              <li key={fact.label} className="fact-card">
                <div className="font-display text-[1.6rem] sm:text-4xl xl:text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-[#0B6E40] whitespace-nowrap">
                  <CountUp value={fact.value} />
                </div>
                <div className="text-[13px] sm:text-sm text-[#1E3A29]/65 mt-2.5 leading-snug">{fact.label}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ═════════ EVERY PART OF THE SITE, in order, the Guest House (coming soon) last ═════════ */}
        <QuickLinks />

        {/* ═════════ WHAT ELSE IS ON THE GROUNDS ═════════ */}
        <section className="pt-6 sm:pt-10 pb-12 sm:pb-16" aria-labelledby="facilities-title">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <div data-reveal className="fade-section max-w-2xl mb-8 sm:mb-12">
              <span className="eyebrow mb-5">{h.facilities.eyebrow}</span>
              <h2 id="facilities-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-4">{h.facilities.title}</h2>
              <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{h.facilities.desc}</p>
            </div>
            <CardGrid grid="md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((id, i) => {
                const item = h.facilities.items[id];
                return (
                  <div key={id} className="h-full flex gap-4 rounded-[1.5rem] bg-white p-5 sm:p-6 elev-1">
                    <span className="text-[#C4622D] text-sm font-bold tabular-nums pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#1E3A29] tracking-tight mb-1.5">{item.title}</h3>
                      <p className="text-[#1E3A29]/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardGrid>
          </div>
        </section>

        {/* ═════════ CULTURAL FOOD EVENINGS (dates from the staff area) ═════════ */}
        <CulturalFoodDates events={siteEvents} />

        {/* ═════════ LAST OF THE PLACES: the Guest House, coming soon ═════════ */}
        <GuestHouseSoon />

        {/* ═════════ CONTACT: every way to reach us, and the map ═════════ */}
        <HomeContact />
        <StickyBook />
      </main>
    </>
  );
}
