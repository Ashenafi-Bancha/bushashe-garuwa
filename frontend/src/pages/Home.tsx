import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import { useRevealChildren } from '../lib/motion';
import { useSiteEvents } from '../lib/events';
import { DIRECTIONS_URL } from '../lib/location';
import StoryFilm from '../components/StoryFilm';
import PhotoRing from '../components/PhotoRing';
import QuickLinks from '../components/QuickLinks';
import PhotoCard from '../components/PhotoCard';
import CulturalFoodDates from '../components/CulturalFoodDates';
import SwipeRow from '../components/SwipeRow';

const heroSlides: { key: PhotoKey; pos: string }[] = [
  { key: 'gate', pos: 'object-[center_35%]' },
  { key: 'home', pos: 'object-center' },
  { key: 'gifaataa1', pos: 'object-[center_40%]' },
  { key: 'house', pos: 'object-center' },
  { key: 'zigba', pos: 'object-[center_40%]' },
  { key: 'gifaataa2', pos: 'object-[center_45%]' },
];
const SLIDE_MS = 6000;

const livingHeritage = [
  { id: 'houses', img: photos.house },
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

const facilities = ['meetingHall', 'zoo', 'pool', 'orchard', 'horses', 'crocodile', 'fish', 'guesthouse', 'restaurant'] as const;

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
  return <span ref={ref}>{match[1]}{shown.toLocaleString('en-US')}{match[3]}</span>;
}

export default function Home() {
  const { t } = useI18n();
  const h = t.home;
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
  const [firstWord, ...rest] = h.hero.title.split(' ');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const page = useRevealChildren<HTMLElement>();

  useEffect(() => {
    const timer = setTimeout(() => goTo(heroIdx + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [heroIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // have every photograph ready so each slide opens without a flash
  useEffect(() => {
    heroSlides.forEach(({ key }) => { const img = new Image(); img.src = photos[key]; });
  }, []);

  useEffect(() => {
    // shown after the hero, hidden again at the footer so it never covers the links there
    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      setShowStickyCta(y > vh * 0.8 && y + vh < document.documentElement.scrollHeight - 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <main ref={page} className="pb-24 lg:pb-0">

        {/* ═════════ HERO ═════════
            The photographs come first. Computers: the whole screen, edge to edge.
            Phones and tablets: right under the header, whole, at their own shape,
            so the name and the buttons are on the first screen too.
            Each new photograph sweeps in from the right like a curtain while it
            settles; the one before drifts away underneath. The name and the words
            follow just below. Swipe on phones. */}
        <section className="relative" aria-label={h.hero.title}>
          <div
            className="relative mt-16 sm:mt-[72px] aspect-[3/2] lg:mt-0 lg:aspect-auto lg:h-[100svh] lg:min-h-[560px] overflow-hidden bg-[#13261A]"
            onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              const start = touchX.current; touchX.current = null;
              const end = e.changedTouches[0]?.clientX;
              if (start === null || end === undefined || Math.abs(end - start) < 50) return;
              goTo(heroIdx + (end < start ? 1 : -1));
            }}
          >
            {prevIdx !== null && (
              <div key={`out-${prevIdx}-${heroIdx}`} className="hero-slide hero-slide-out">
                <img src={photos[heroSlides[prevIdx]!.key]} alt="" className={`w-full h-full object-cover ${heroSlides[prevIdx]!.pos}`} />
              </div>
            )}
            <div key={`in-${heroIdx}`} className={`hero-slide ${prevIdx === null ? 'hero-slide-first' : 'hero-slide-in'}`}>
              <img
                src={photos[heroSlides[heroIdx]!.key]}
                alt={t.photos[heroSlides[heroIdx]!.key]}
                fetchPriority="high"
                className={`hero-slide-img w-full h-full object-cover ${heroSlides[heroIdx]!.pos}`}
              />
            </div>

            {/* a faint shade only behind the header words at the very top */}
            <span className="hidden lg:block absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#13261A]/50 via-[#13261A]/20 to-transparent z-[3]" />
            {/* only a thin soft edge joins the photograph to the page; nothing lies over it */}
            <span className="absolute inset-x-0 bottom-0 h-6 lg:h-20 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />


            {/* the name of the place in the photograph, and the way to the next one */}
            <div className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:bottom-auto lg:right-8 lg:top-[104px] flex items-center gap-2">
              <span key={heroIdx} className="rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
                {t.photoCaptions[heroSlides[heroIdx]!.key].title}
              </span>
              <button
                type="button"
                onClick={() => goTo(heroIdx + 1)}
                aria-label={h.hero.next}
                className="hit-slim grid place-items-center w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#1E3A29] hover:bg-[#1E3A29] hover:text-white transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* the words, just below the photograph */}
          <div className="relative z-[5] max-w-screen-xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-6">
            {/* the name in the lettering of the main gate, raised in 3D, sized to the screen */}
            <h1 className="hero-name brand-sign brand-3d whitespace-nowrap leading-[1] mb-6 lg:mb-8">
              {/* phones and tablets: two lines; computers: one line */}
              <span className="line-mask"><span>{firstWord}</span></span>{' '}
              <span className="line-mask d2"><span>{rest.join(' ')}</span></span>
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 animate-fade-up delay-300">
              <div className="max-w-xl">
                <p className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] leading-snug tracking-tight mb-3">{h.hero.subtitle}</p>
                <p className="text-[#1E3A29]/70 leading-relaxed">{h.hero.lead}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <Link to="/discover" className="btn-primary">{h.hero.explore}</Link>
                <Link to="/visit" className="btn-outline text-[#1E3A29]">{t.common.planVisit}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ THE PLACE IN NUMBERS ═════════ */}
        <section className="px-5 sm:px-8 pt-6 lg:pt-10">
          <ul data-reveal className="fade-section max-w-screen-xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-px rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-[#1E3A29]/8 elev-1">
            {h.facts.items.map((fact, i) => (
              <li key={fact.label} className={`bg-white px-5 py-6 sm:px-7 sm:py-8 ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}>
                <span className="block w-2 h-2 rounded-full bg-[#86A94F] mb-5" />
                <div className="font-display text-[2rem] sm:text-5xl font-extrabold leading-none tracking-[-0.04em] text-[#1E3A29] whitespace-nowrap">
                  <CountUp value={fact.value} />
                </div>
                <div className="text-sm text-[#1E3A29]/60 mt-3 leading-snug">{fact.label}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ═════════ QUICK LINKS ═════════ */}
        <QuickLinks />

        {/* ═════════ A RUNNING BAND OF WORDS ═════════ */}
        <div className="overflow-hidden py-6" aria-hidden="true">
          <div className="bg-[#1E3A29] text-[#F4EFE4] py-5 sm:py-6 -rotate-2 scale-105">
            <div className="flex w-max animate-marquee font-display font-bold text-3xl sm:text-5xl tracking-[-0.03em]">
              {[0, 1].map((n) => (
                <span key={n} className="flex items-center">
                  {[...h.marquee, ...h.marquee].map((word, i) => (
                    <span key={i} className="flex items-center">
                      <span className="px-6 sm:px-8">{word}</span>
                      <span className="text-[#86A94F]">✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═════════ WHO WE ARE ═════════ */}
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div data-reveal className="fade-section relative order-2 lg:order-1">
              <div className="img-zoom rounded-[2rem] aspect-[4/5] overflow-hidden elev-2">
                <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover object-[center_60%]" loading="lazy" />
              </div>
              <div className="hidden sm:block absolute -bottom-10 -right-6 lg:-right-10 w-[46%] aspect-square rounded-[1.75rem] overflow-hidden border-[6px] border-[#F4EFE4] elev-2">
                <img src={photos.gifaataa2} alt={t.photos.gifaataa2} className="w-full h-full object-cover" loading="lazy" />
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
                        <span className="inline-flex items-center gap-3 rounded-full bg-[#1E3A29] text-[#F4EFE4] text-[13px] font-bold pl-5 pr-1.5 py-1.5">
                          {t.common.explore}
                          <span aria-hidden="true" className="grid place-items-center w-8 h-8 rounded-full bg-[#86A94F] text-[#13261A] transition-transform duration-500 group-hover:-rotate-45">→</span>
                        </span>
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
            <SwipeRow grid="md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((exp, i) => {
                const text = h.experiences.items[exp.id];
                return (
                  <div key={exp.id} data-reveal className="fade-section h-full" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                    <PhotoCard to={exp.to} photo={'img' in exp ? exp.img : undefined} title={text.title} desc={text.desc} />
                  </div>
                );
              })}
            </SwipeRow>
          </div>
        </section>

        {/* ═════════ STAY AND DINE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <SwipeRow grid="md:grid-cols-2" item="w-[84vw] sm:w-[64vw]">
              {[
                { to: '/stay', eyebrow: h.stay.eyebrow, title: h.stay.title, desc: h.stay.desc, cta: h.stay.cta, photo: undefined as string | undefined, chips: Object.values(h.stay.rooms).map((r) => r.name) },
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
                      <span className="mt-auto inline-flex items-center gap-3 rounded-full bg-[#1E3A29] text-[#F4EFE4] text-[13px] font-bold pl-5 pr-1.5 py-1.5">
                        {card.cta}
                        <span aria-hidden="true" className="grid place-items-center w-8 h-8 rounded-full bg-[#86A94F] text-[#13261A] transition-transform duration-500 group-hover:-rotate-45">→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </SwipeRow>

            {/* what else is on the grounds */}
            <div className="mt-20 sm:mt-28">
              <Heading eyebrow={h.facilities.eyebrow} title={h.facilities.title} desc={h.facilities.desc} />
              <SwipeRow grid="md:grid-cols-2 lg:grid-cols-3" item="w-[70vw] sm:w-[46vw]" gap="gap-3 md:gap-x-10 md:gap-y-0">
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
              </SwipeRow>
            </div>
          </div>
        </section>

        {/* ═════════ TIMELINE ═════════ */}
        <section className="bg-[#13261A] text-[#F4EFE4] py-20 sm:py-28 rounded-[2rem] sm:rounded-[3rem] mx-2 sm:mx-3">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.timeline.eyebrow} title={h.timeline.title} dark />
            <SwipeRow grid="md:grid-cols-3 lg:grid-cols-5" item="w-[66vw] sm:w-[42vw]" dark>
              {h.timeline.items.map((item, i) => (
                <div key={i} data-reveal className="fade-section h-full rounded-[1.5rem] bg-white/[0.06] border border-white/10 p-6 hover:bg-white/[0.1] transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="font-display text-3xl font-extrabold text-[#B9D38A] tracking-tight mb-4">{item.period}</div>
                  <div className="font-bold mb-2">{item.label}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </SwipeRow>
          </div>
        </section>

        {/* ═════════ THE READING PLACE AND THE STORIES ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <SwipeRow grid="md:grid-cols-2" item="w-[84vw] sm:w-[64vw]">
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
            </SwipeRow>
          </div>
        </section>

        {/* ═════════ THE GROUNDS IN 3D ═════════ */}
        <PhotoRing />

        {/* ═════════ INVITATION ═════════ */}
        <section className="px-2 sm:px-3 pb-6">
          <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden py-24 sm:py-32 lg:py-40">
            <img src={photos.home} alt={t.photos.home} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13261A] via-[#13261A]/65 to-[#13261A]/30" />
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
      </main>

      {/* ── Phones: a small bar with the two main actions ── */}
      <div className={`mobile-sticky-cta lg:hidden ${showStickyCta ? '' : 'hidden-cta'}`} inert={!showStickyCta}>
        <Link to="/visit" className="flex-1 btn-primary btn-on-dark justify-center !py-1.5 !text-[13px] whitespace-nowrap shadow-none">{t.common.planVisit}</Link>
        <Link to="/contact" className="flex-1 btn-glass justify-center !py-3 !text-[13px] whitespace-nowrap">{t.common.contactUs}</Link>
      </div>
    </>
  );
}
