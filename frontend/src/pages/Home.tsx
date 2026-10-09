import { lazy, Suspense, useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import { useSiteEvents } from '../lib/events';
import { heroPhotos, useSiteMedia } from '../lib/media';
import { DIRECTIONS_URL } from '../lib/location';
import StoryFilm from '../components/StoryFilm';
import PhotoRing from '../components/PhotoRing';
import QuickLinks from '../components/QuickLinks';
import PhotoCard from '../components/PhotoCard';
import CulturalFoodDates from '../components/CulturalFoodDates';
import CardGrid from '../components/CardGrid';
import HeroName from '../components/HeroName';
import StickyBook from '../components/StickyBook';
import Testimonials from '../components/Testimonials';
import { useNoIndex } from '../lib/noindex';
import { deviceTier, forcedTier, rememberSlow } from '../three/device';

/** The 3D landscape opening, fetched only on the pages that use it */
const LandscapeHero = lazy(() => import('../three/LandscapeHero'));

const SLIDE_MS = 6000;

const livingHeritage = [
  { id: 'houses', img: photos.meeshsho },
  { id: 'trees', img: photos.enset },
  { id: 'animals' },
  { id: 'artifacts' },
] as const;

const experiences = [
  { id: 'food', img: photos.food, to: '/experiences' },
  { id: 'coffee', to: '/experiences' },
  { id: 'performance', img: photos.gifaataa2, to: '/experiences' },
  { id: 'tour', img: photos.pavilions, to: '/experiences' },
  { id: 'education', to: '/experiences/education' },
  { id: 'photography', img: photos.gardens, to: '/experiences' },
] as const;

const facilities = ['meetingHall', 'vip', 'zoo', 'pool', 'orchard', 'horses', 'crocodile', 'fish', 'restaurant', 'guesthouse'] as const;

/* ── Section heading: label, a large title, an optional line and action ── */
function Heading({ eyebrow, title, desc, center = false, action, dark = false }: {
  eyebrow: string; title: string; desc?: string; center?: boolean; action?: ReactNode; dark?: boolean;
}) {
  return (
    <div data-reveal className={`fade-section mb-10 sm:mb-14 ${center ? 'text-center' : 'flex flex-col md:flex-row md:items-end justify-between gap-6'}`}>
      <div className={center ? 'max-w-3xl mx-auto' : 'max-w-3xl'}>
        <span className={`eyebrow mb-5 ${dark ? '!bg-white/10 !text-[#B9D38A]' : ''}`}>{eyebrow}</span>
        <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] ${dark ? 'text-[#F4EFE4]' : 'text-[#1E3A29]'}`}>{title}</h2>
        {desc && <p className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${dark ? 'text-white/65' : 'text-[#1E3A29]/60'}`}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

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
  const { events: siteEvents } = useSiteEvents();

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
              <p className="max-w-xl font-display text-xl sm:text-2xl font-bold text-[#1E3A29] leading-snug tracking-tight">{h.hero.subtitle}</p>
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

        {/* ═════════ QUICK LINKS ═════════ */}
        <QuickLinks />

        {/* ═════════ TWO ROWS OF LARGE WORDS that slide past each other as you scroll ═════════ */}
        <div className="overflow-hidden py-10 sm:py-16 select-none" aria-hidden="true">
          {(['left', 'right'] as const).map((direction, row) => (
            <div key={direction} data-strip={direction} className="word-strip flex w-max items-center">
              {[...h.marquee, ...h.marquee, ...h.marquee].map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className={(i + row) % 2 === 0 ? 'text-[#1E3A29]' : 'word-outline'}>{word}</span>
                  <span className="mx-5 sm:mx-9 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#0E8A50]" />
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* ═════════ WHO WE ARE ═════════ */}
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div data-reveal className="fade-section relative order-2 lg:order-1">
              <div className="img-zoom rounded-[2rem] aspect-[4/5] overflow-hidden elev-2">
                <img {...picture(photos.lawn)} alt={t.photos.lawn} className="w-full h-full object-cover object-[center_60%]" loading="lazy" />
              </div>
              <div className="hidden sm:block absolute -bottom-10 -right-6 lg:-right-10 w-[46%] aspect-square rounded-[1.75rem] overflow-hidden border-[6px] border-[#F4EFE4] elev-2">
                <img {...picture(photos.gifaataa2)} alt={t.photos.gifaataa2} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute top-6 -left-3 sm:-left-6 bg-white rounded-2xl elev-2 px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#86A94F] text-[#13261A] grid place-items-center font-display text-xl font-extrabold">4+</div>
                <div className="text-sm font-bold text-[#1E3A29] leading-tight">{h.intro.generations}</div>
              </div>
            </div>

            <div data-reveal className="fade-section order-1 lg:order-2">
              <span className="eyebrow mb-5">{h.intro.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[0.98] mb-7">{h.intro.title}</h2>
              <p className="text-lg sm:text-xl text-[#1E3A29]/75 leading-relaxed mb-5">{h.intro.p1}</p>
              <p className="text-base text-[#1E3A29]/60 leading-relaxed mb-8">{h.intro.p2}</p>
              <blockquote className="rounded-[1.5rem] bg-white p-6 sm:p-7 mb-8 elev-1">
                <div className="text-[#C4622D] text-sm font-bold mb-2">{t.common.goal.eyebrow}</div>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] leading-snug tracking-tight">{t.common.goal.text}</p>
              </blockquote>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/about" className="btn-primary">{t.nav.links.about}</Link>
                {h.intro.pillars.map((pillar) => (
                  <span key={pillar} className="rounded-full border border-[#1E3A29]/15 px-4 py-2 text-sm font-semibold text-[#1E3A29]/80">{pillar}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ THE FILM (shown once one is added) ═════════ */}
        <StoryFilm />

        {/* ═════════ CULTURAL FOOD EVENINGS (dates from the staff area) ═════════ */}
        <CulturalFoodDates events={siteEvents} />

        {/* ═════════ LIVING HERITAGE: cards that stack as you scroll ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.living.eyebrow} title={h.living.title} center />
            <div className="max-w-5xl mx-auto">
              {livingHeritage.map((item, i) => {
                const text = h.living.items[item.id];
                return (
                  <div key={item.id} className="sticky mb-8 sm:mb-10" style={{ top: `calc(96px + ${i * 22}px)` } as CSSProperties}>
                    <Link
                      to="/heritage"
                      className="group grid md:grid-cols-[1.1fr_1fr] bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-40px_rgba(30,58,41,0.55)] border border-[#1E3A29]/5"
                    >
                      <div className="img-zoom aspect-[16/10] md:aspect-auto md:min-h-[380px]">
                        <Photo src={'img' in item ? item.img : undefined} alt={text.title} label={text.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center items-start">
                        <span className="text-[#C4622D] text-sm font-bold tabular-nums mb-4">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] leading-none tracking-[-0.03em] mb-4">{text.title}</h3>
                        <p className="text-[#1E3A29]/65 leading-relaxed mb-7">{text.desc}</p>
                        <span className="btn-primary btn-sm">{t.common.explore}</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ EXPERIENCES ═════════ */}
        <section className="bg-[#E9EEDD] py-20 sm:py-28 rounded-[2rem] sm:rounded-[3rem] mx-2 sm:mx-3">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.experiences.eyebrow}
              title={h.experiences.title}
              action={<Link to="/experiences" className="btn-outline text-[#1E3A29] self-start md:self-auto">{t.common.exploreAll}</Link>}
            />
            <CardGrid grid="md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((exp, i) => {
                const text = h.experiences.items[exp.id];
                return (
                  <div key={exp.id} data-reveal className="fade-section h-full" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                    <PhotoCard to={exp.to} photo={'img' in exp ? exp.img : undefined} title={text.title} desc={text.desc} />
                  </div>
                );
              })}
            </CardGrid>
          </div>
        </section>

        {/* ═════════ STAY AND DINE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <CardGrid grid="md:grid-cols-2">
              {[
                { to: '/vip', eyebrow: t.vip.hero.eyebrow, title: t.vip.hero.title, desc: t.vip.hero.desc, cta: t.common.learnMore, photo: photos.vipDining as string | undefined, chips: [t.vip.features.kitchen.title, t.vip.features.fire.title, t.vip.features.rooms.title] },
                { to: '/dine', eyebrow: h.restaurant.eyebrow, title: h.restaurant.title, desc: h.restaurant.desc, cta: h.restaurant.cta, photo: photos.food, chips: h.restaurant.categories },
              ].map((card, i) => (
                <div key={card.to} data-reveal className="fade-section h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                  <Link to={card.to} className="group flex h-full flex-col bg-white rounded-[2rem] p-2.5 elev-1 transition-transform duration-500 hover:-translate-y-1.5">
                    <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[16/10]">
                      <Photo src={card.photo} alt={card.title} label={card.eyebrow} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col items-start p-5 sm:p-8">
                      <span className="eyebrow mb-4">{card.eyebrow}</span>
                      <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] leading-[1.02] tracking-[-0.03em] mb-4">{card.title}</h3>
                      <p className="text-[#1E3A29]/65 leading-relaxed mb-6">{card.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {card.chips.map((chip) => (
                          <span key={chip} className="rounded-full bg-[#F4EFE4] px-3.5 py-1.5 text-[13px] font-semibold text-[#1E3A29]/75">{chip}</span>
                        ))}
                      </div>
                      <span className="mt-auto btn-primary btn-sm">{card.cta}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </CardGrid>

            {/* what else is on the grounds */}
            <div className="mt-20 sm:mt-28">
              <Heading eyebrow={h.facilities.eyebrow} title={h.facilities.title} desc={h.facilities.desc} />
              {/* the meeting hall in a photograph, and beside it the guest house: not open yet, said large and bright */}
              <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-14">
                <Link to="/contact" data-reveal className="fade-section group block bg-white rounded-[2rem] p-2.5 elev-1">
                  <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                    <img {...picture(photos.meetingHall, '(max-width: 767px) 100vw, 50vw')} alt={t.photos.meetingHall} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 py-5 sm:px-5">
                    <h3 className="font-display text-2xl font-bold text-[#1E3A29] tracking-tight mb-1.5">{h.facilities.items.meetingHall.title}</h3>
                    <p className="text-[#1E3A29]/60 text-sm sm:text-base leading-relaxed">{h.facilities.items.meetingHall.desc}</p>
                  </div>
                </Link>
                <Link to="/stay" data-reveal className="fade-section coming-soon-panel flex flex-col items-center justify-center text-center rounded-[2rem] px-6 py-12">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#13261A] mb-3">{h.facilities.items.guesthouse.title}</span>
                  <span className="coming-soon-word font-display font-extrabold uppercase leading-[0.95]">{t.stay.comingSoon.badge}</span>
                  <span className="text-[#1E3A29]/75 text-sm sm:text-base leading-relaxed max-w-sm mt-5">{t.stay.comingSoon.lead}</span>
                </Link>
              </div>
              <CardGrid grid="md:grid-cols-2 lg:grid-cols-3" gap="gap-3 md:gap-x-10 md:gap-y-0">
                {facilities.map((id, i) => {
                  const item = h.facilities.items[id];
                  return (
                    <div key={id} data-reveal className="fade-section h-full flex gap-5 rounded-[1.5rem] bg-white p-6 elev-1 md:bg-transparent md:shadow-none md:rounded-none md:p-0 md:py-6 md:border-t md:border-[#1E3A29]/12" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
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
          </div>
        </section>

        {/* ═════════ TIMELINE ═════════ */}
        <section className="bg-[#E3EBD8] text-[#13261A] py-20 sm:py-28 rounded-[2rem] sm:rounded-[3rem] mx-2 sm:mx-3">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.timeline.eyebrow} title={h.timeline.title} />
            <CardGrid grid="md:grid-cols-3 lg:grid-cols-5">
              {h.timeline.items.map((item, i) => (
                <div key={i} data-reveal className="fade-section h-full rounded-[1.5rem] bg-white border border-[#1E3A29]/12 p-6 hover:bg-white/80 transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="font-display text-3xl font-extrabold text-[#0B6E40] tracking-tight mb-4">{item.period}</div>
                  <div className="font-bold mb-2">{item.label}</div>
                  <p className="text-[#1E3A29]/80 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </CardGrid>
          </div>
        </section>

        {/* ═════════ THE READING PLACE AND THE STORIES ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <CardGrid grid="md:grid-cols-2">
            {[
              { eyebrow: h.reading.eyebrow, title: h.reading.title, text: h.reading.desc, extra: h.reading.mountain, chips: h.reading.qualities, cta: h.reading.cta, to: '/visit', photo: photos.gardens as string | undefined, label: h.reading.caption },
              { eyebrow: h.stories.eyebrow, title: h.stories.title, text: h.stories.p1, extra: h.stories.p2, chips: h.stories.languages, cta: h.stories.cta, to: '/heritage/stories', photo: undefined, label: h.stories.elderAlt },
            ].map((card, i) => (
              <article key={card.title} data-reveal className="fade-section h-full flex flex-col bg-white rounded-[2rem] p-2.5 elev-1" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[16/10]">
                  <Photo src={card.photo} alt={card.label} label={card.label} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col items-start p-5 sm:p-8">
                  <span className="eyebrow mb-4">{card.eyebrow}</span>
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] leading-[1.02] tracking-[-0.03em] mb-4">{card.title}</h3>
                  <p className="text-[#1E3A29]/70 leading-relaxed mb-3">{card.text}</p>
                  <p className="text-[#1E3A29]/55 text-sm leading-relaxed mb-6">{card.extra}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {card.chips.map((chip) => (
                      <span key={chip} className="rounded-full bg-[#F4EFE4] px-3.5 py-1.5 text-[13px] font-semibold text-[#1E3A29]/75">{chip}</span>
                    ))}
                  </div>
                  <Link to={card.to} className="btn-primary mt-auto">{card.cta}</Link>
                </div>
              </article>
            ))}
            </CardGrid>
          </div>
        </section>

        {/* ═════════ THE GROUNDS IN 3D ═════════ */}
        <PhotoRing />

        {/* ═════════ INVITATION ═════════ */}
        <section className="px-2 sm:px-3 pb-6">
          <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden py-24 sm:py-32 lg:py-40">
            <img {...picture(photos.home)} alt={t.photos.home} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
            <div data-reveal className="fade-section relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
              <span className="eyebrow !bg-white/15 !text-white backdrop-blur mb-6">{h.final.eyebrow}</span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[0.92] tracking-[-0.05em] mb-10">{h.final.title}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                {[t.common.locationLine, t.common.hoursDaily, '+251 932 196 502'].map((text) => (
                  <span key={text} className="glass rounded-full px-5 py-2 text-white/90 text-sm">{text}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link to="/visit" className="btn-primary btn-on-dark">{t.common.planVisit}</Link>
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-glass">{t.common.getDirections}</a>
              </div>
            </div>
          </div>
        </section>
        {/* what guests say: appears once real words are added (lib/testimonials.ts) */}
        <Testimonials />
        <StickyBook />
      </main>
    </>
  );
}
