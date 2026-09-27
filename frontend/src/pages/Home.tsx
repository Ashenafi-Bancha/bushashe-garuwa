import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { Tilt, useScrollY } from '../lib/motion';
import { useSiteEvents } from '../lib/events';
import { videos } from '../assets/videos';
import StoryFilm from '../components/StoryFilm';
import PhotoRing from '../components/PhotoRing';
import WelcomeTyper from '../components/WelcomeTyper';
import QuickLinks from '../components/QuickLinks';
import PhotoCard from '../components/PhotoCard';
import { useHeroVideo } from '../lib/heroVideo';
import CulturalFoodDates from '../components/CulturalFoodDates';

const heroSlides: { key: PhotoKey; pos: string }[] = [
  { key: 'home',      pos: 'object-center' },
  { key: 'gifaataa1', pos: 'object-center' },
  { key: 'house',     pos: 'object-center' },
  { key: 'zigba',     pos: 'object-[center_40%]' },
  { key: 'pavilions', pos: 'object-center' },
  { key: 'lawn',      pos: 'object-[center_65%]' },
];
const SLIDE_MS = 6500;

/* Page structure — the text for each id lives in the translations (t.home.*) */
const exploreCards = [
  { id: 'heritage', img: photos.house, to: '/heritage', span: 'md:col-span-2 md:row-span-2' },
  { id: 'nature', img: photos.lawn, to: '/heritage', span: 'md:col-span-2' },
  { id: 'culture', img: photos.gifaataa1, to: '/experiences', span: '' },
  { id: 'hospitality', img: photos.pavilions, to: '/stay', span: '' },
] as const;

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

const rooms = ['standard', 'family', 'heritage'] as const;

const facilities = ['meetingHall', 'zoo', 'pool', 'orchard', 'horses', 'crocodile', 'fish', 'guesthouse', 'restaurant'] as const;

const bookYears = ['2018', '2020', '2015', '2019'];

/* Mosaic: spans fill a 4-column grid exactly (2 columns on mobile) */
const galleryPhotos: { key: PhotoKey; span: string }[] = [
  { key: 'home', span: 'col-span-2 row-span-2' },
  { key: 'gifaataa1', span: '' },
  { key: 'house', span: 'md:row-span-2' },
  { key: 'gifaataa2', span: '' },
  { key: 'pavilions', span: 'md:col-span-2' },
  { key: 'gifaataa3', span: 'md:col-span-2' },
  { key: 'gardens', span: 'md:col-span-2' },
  { key: 'enset', span: '' },
  { key: 'zigba', span: 'md:col-span-2' },
  { key: 'lawn', span: 'col-span-2 md:col-span-3' },
];

/* ── Scroll reveal ── */
function FadeSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '-60px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`fade-section ${inView ? 'in-view' : ''} ${className}`}
      style={delay ? { transitionDelay: inView ? `${delay}ms` : '0ms' } : undefined}
    >
      {children}
    </div>
  );
}

/* ── Section heading ── */
function Heading({ eyebrow, title, desc, dark = false, center = false, action }: {
  eyebrow: string; title: string; desc?: string; dark?: boolean; center?: boolean; action?: ReactNode;
}) {
  return (
    <FadeSection className={`mb-12 sm:mb-16 ${action ? 'flex flex-col md:flex-row md:items-end justify-between gap-6' : ''}`}>
      <div className={center ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}>
        {/* a short line, then the label, then the heading: the rhythm of the reference sites */}
        <span className={`block w-10 h-px mb-4 bg-[#B8863B] ${center ? 'mx-auto' : ''}`} />
        <span className={`block text-xs font-bold tracking-[0.2em] uppercase mb-4 ${dark ? 'text-[#D8B778]' : 'text-[#35723A]'}`}>
          {eyebrow}
        </span>
        <h2 className={`font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] ${dark ? 'text-white' : 'text-[#12150F]'}`}>
          {title}
        </h2>
        {desc && <p className={`mt-5 text-base sm:text-lg leading-relaxed ${center ? 'mx-auto' : ''} max-w-2xl ${dark ? 'text-white/60' : 'text-[#12150F]/60'}`}>{desc}</p>}
      </div>
      {action}
    </FadeSection>
  );
}

function TextLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center text-sm font-semibold rounded-full px-6 py-3 border transition-all duration-500 hover:-translate-y-0.5 ${
        dark
          ? 'border-white/20 text-white hover:bg-white hover:text-[#12150F]'
          : 'border-[#12150F]/15 text-[#12150F] hover:bg-[#2F4A2B] hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  const { t } = useI18n();
  const h = t.home;
  const [heroIdx, setHeroIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { events: siteEvents } = useSiteEvents();
  const heroVideo = useHeroVideo();
  // the hero only drifts with the scroll on desktop, where the words lie on the
  // photograph; on phones they sit below it and must stay put
  const [wideScreen, setWideScreen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroIdx((i) => (i + 1) % heroSlides.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [heroIdx]);

  useEffect(() => {
    // shown after the hero, hidden again at the footer so it never covers the social icons
    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      setShowStickyCta(y > vh * 0.6 && y + vh < document.documentElement.scrollHeight - 520);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollY = useScrollY(1400);
  const drift = wideScreen ? scrollY : 0;

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWideScreen(wide.matches);
    sync();
    wide.addEventListener('change', sync);
    return () => wide.removeEventListener('change', sync);
  }, []);

  const stats: { value?: string; label?: string; phrase?: string }[] = [
    { value: '4+', label: h.hero.statGenerations },
    { value: '200+', label: h.hero.statYears },
    { phrase: h.hero.sinceCentury },
  ];

  return (
    <>
      <main className="pb-24 lg:pb-0">

        {/* ═════════ HERO ═════════
            Phones: the photographs come first in their own panel, then the words
            beneath them. Desktop: the words sit on the photograph, as before. */}
        <section className="relative bg-[#16250F] lg:h-[100svh] lg:min-h-[640px] overflow-hidden" aria-label={h.hero.title}>

          {/* The photographs */}
          <div className="relative h-[60svh] min-h-[380px] sm:h-[62svh] overflow-hidden rounded-b-[1rem] lg:rounded-none lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
            <div className="absolute inset-0 will-change-transform" style={{ transform: `translate3d(0, ${drift * 0.35}px, 0)` }}>
              {heroVideo && (
                <video
                  src={videos.heroLoop}
                  poster={photos[heroSlides[0]!.key]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover z-[1]"
                />
              )}
              {heroSlides.map(({ key, pos }, i) => (
                <img
                  key={key}
                  src={photos[key]}
                  alt={t.photos[key]}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className={`absolute inset-0 w-full h-full object-cover ${pos} transition-opacity duration-[1600ms] ease-in-out ${
                    i === heroIdx ? 'opacity-100 animate-ken-burns' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* header stays readable over a bright sky */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#16250F]/70 to-transparent" />
            {/* the photographs sink into the dark below them on phones, and carry the words on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#16250F] via-transparent to-transparent lg:via-[#16250F]/45" />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#16250F]/80 via-[#16250F]/20 to-transparent" />

            {/* Which photograph is showing */}
            <div className="absolute bottom-5 inset-x-0 z-10 lg:bottom-7">
              <div className="max-w-screen-xl mx-auto px-5 sm:px-8 flex items-center justify-between">
                <div className="flex gap-2">
                  {heroSlides.map((s, i) => (
                    // the bar stays thin; the padding gives a finger something to hit
                    <button
                      key={s.key}
                      onClick={() => setHeroIdx(i)}
                      className="hit-slim group w-10 sm:w-14 py-4 -my-4"
                      aria-label={fmt(h.hero.slide, { n: i + 1 })}
                      aria-current={i === heroIdx}
                    >
                      <span className="relative block h-1 w-full rounded-full bg-white/25 overflow-hidden transition-colors group-hover:bg-white/40">
                        {i === heroIdx && <span key={heroIdx} className="absolute inset-0 bg-[#B8863B] rounded-full animate-progress" />}
                        {i < heroIdx && <span className="absolute inset-0 bg-white/70 rounded-full" />}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs font-medium tracking-[0.14em] uppercase">
                  {h.hero.scroll}
                  <span className="block w-px h-7 bg-gradient-to-b from-white/60 to-transparent animate-scroll-bounce" />
                </div>
              </div>
            </div>
          </div>

          {/* The words */}
          <div
            className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 pt-7 sm:pt-8 pb-14 sm:pb-16 lg:pt-0 lg:pb-24 lg:h-full lg:flex lg:flex-col lg:justify-end will-change-transform"
            style={{ transform: `translate3d(0, ${drift * -0.12}px, 0)`, opacity: Math.max(0, 1 - drift / 700) }}
          >
            <div className="max-w-4xl">
                {/* on phones the greeting lifts onto the edge of the photograph above it */}
                <WelcomeTyper
                  className="glow-welcome font-display italic text-[#D8B778] text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] leading-tight animate-fade-up delay-75
                    absolute -top-[4.5rem] sm:-top-24 inset-x-5 sm:inset-x-8
                    lg:top-28 xl:top-32 lg:inset-x-auto lg:right-0 lg:w-[46%]"
                  nameClassName="text-white"
                />
                <h1 className="glow-title font-display font-bold text-white text-[clamp(2.5rem,6.6vw,5rem)] leading-[1.06] tracking-[-0.01em] animate-fade-up delay-100">
                  {h.hero.title}
                </h1>
                <p className="mt-4 sm:mt-6 font-display font-normal text-xl sm:text-3xl text-white/85 leading-snug max-w-2xl animate-fade-up delay-200">
                  {h.hero.subtitle}
                </p>
                <p className="mt-5 sm:mt-6 pl-4 sm:pl-5 border-l-2 border-[#B8863B] max-w-xl font-display italic font-semibold text-lg sm:text-2xl leading-snug text-white/90 animate-fade-up delay-300">
                  <span className="text-[#D8B778]">{h.hero.sloganA}</span>{' '}
                  {h.hero.sloganB}{' '}
                  <span className="text-white/75">{h.hero.sloganC}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-10 animate-fade-up delay-400">
                  <Link to="/discover" className="btn-primary justify-center">
                    {h.hero.explore}
                  </Link>
                  <Link to="/visit" className="btn-glass justify-center">
                    {t.common.planVisit}
                  </Link>
                </div>
            </div>
          </div>
        </section>

        {/* ═════════ THE FILM (hidden until one is added) ═════════ */}
        <StoryFilm />

        {/* ═════════ THE PLACE IN NUMBERS ═════════ */}
        <div className="border-y border-[#12150F]/8 bg-white/70">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-7 sm:py-10">
            <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {h.facts.items.map((fact, i) => (
                <li
                  key={fact.label}
                  className={`group rounded-2xl bg-white border border-[#12150F]/8 elev-1 px-4 py-5 sm:px-5 text-center lg:text-left transition-transform duration-300 hover:-translate-y-1 ${
                    i === 4 ? 'col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  {/* the gold appears only as this hairline */}
                  <span className="block w-7 h-px bg-[#B8863B] mb-4 mx-auto lg:mx-0 transition-all duration-300 group-hover:w-12" />
                  <div className="font-display text-3xl sm:text-4xl leading-none text-[#12150F]">{fact.value}</div>
                  <div className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase mt-2 text-[#12150F]/50 leading-snug">
                    {fact.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═════════ QUICK LINKS (phones) ═════════ */}
        <QuickLinks />

        {/* ═════════ INTRO ═════════ */}
        <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <FadeSection>
              <span className="eyebrow bg-[#35723A]/10 text-[#35723A] mb-5">{h.intro.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#12150F] leading-[1.05] mb-7">
                {h.intro.title}
              </h2>
              <p className="text-lg sm:text-xl text-[#12150F]/75 leading-relaxed mb-5">{h.intro.p1}</p>
              <p className="text-base text-[#12150F]/55 leading-relaxed mb-8">{h.intro.p2}</p>
              <div className="border-l-2 border-[#B8863B] pl-5 mb-8">
                <div className="text-[#35723A] text-xs font-semibold tracking-[0.14em] uppercase mb-2">{t.common.goal.eyebrow}</div>
                <p className="font-display italic text-xl sm:text-2xl text-[#35723A] leading-snug">{t.common.goal.text}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {h.intro.pillars.map((pillar, i) => (
                  <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#12150F]/8 px-4 py-2 text-sm font-medium text-[#12150F] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8863B]"/>{pillar}
                  </span>
                ))}
              </div>
            </FadeSection>

            <FadeSection delay={150} className="relative">
              <div className="img-zoom rounded-[2rem] aspect-[4/5] bg-[#35723A]/10 shadow-2xl shadow-[#12150F]/20">
                <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover object-[center_60%]"/>
              </div>
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-[48%] aspect-square rounded-[1.75rem] overflow-hidden border-8 border-[#FAFAF8] shadow-xl">
                <img src={photos.gifaataa2} alt={t.photos.gifaataa2} className="w-full h-full object-cover" loading="lazy"/>
              </div>
              <div className="absolute top-6 right-3 sm:-right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2F4A2B] text-[#B8863B] flex items-center justify-center font-display text-xl font-bold">4+</div>
                <div className="text-sm font-semibold text-[#12150F] leading-tight">{h.intro.generations}</div>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ EXPLORE — bento ═════════ */}
        <section className="relative bg-[#EFF4EA] py-20 sm:py-28">
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.explore.eyebrow} title={h.explore.title} center />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {exploreCards.map((card, i) => {
                const text = h.explore.cards[card.id];
                return (
                  <FadeSection key={card.id} delay={i * 80}>
                    <PhotoCard to={card.to} photo={card.img} title={text.title} desc={text.sub} />
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ LIVING HERITAGE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.living.eyebrow} title={h.living.title} center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {livingHeritage.map((item, i) => {
                const text = h.living.items[item.id];
                return (
                  <FadeSection key={item.id} delay={i * 80}>
                    <PhotoCard to="/heritage" photo={'img' in item ? item.img : undefined} title={text.title} desc={text.desc} />
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ THE GROUNDS IN 3D ═════════ */}
        <PhotoRing />

        {/* ═════════ TIMELINE ═════════ */}
        <section className="relative py-20 sm:py-28">
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.timeline.eyebrow} title={h.timeline.title} center />

            {/* Desktop: horizontal */}
            <div className="hidden lg:block relative">
              <div className="absolute top-[7px] left-0 right-0 h-px bg-[#12150F]/10"/>
              <div className="grid grid-cols-5 gap-5">
                {h.timeline.items.map((item, i) => (
                  <FadeSection key={i} delay={i * 90}>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#35723A] ring-8 ring-[#35723A]/10 mb-8"/>
                    <Tilt className="rounded-3xl h-full" max={8}>
                    <div className="rounded-[1.25rem] bg-white border border-[#12150F]/8 elev-1 p-6 h-full transition-transform duration-300 hover:-translate-y-1">
                      <div className="font-display text-2xl font-bold text-[#35723A] mb-3">{item.period}</div>
                      <div className="font-display text-sm font-bold tracking-[0.06em] uppercase text-[#12150F] mb-2">{item.label}</div>
                      <p className="text-[#12150F]/55 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    </Tilt>
                  </FadeSection>
                ))}
              </div>
            </div>

            {/* Mobile: vertical */}
            <div className="lg:hidden relative pl-8">
              <div className="absolute left-[6px] top-2 bottom-2 w-px bg-[#12150F]/10"/>
              <div className="space-y-5">
                {h.timeline.items.map((item, i) => (
                  <FadeSection key={i} delay={i * 60} className="relative">
                    <div className="absolute -left-8 top-6 w-3.5 h-3.5 rounded-full bg-[#35723A] ring-4 ring-[#35723A]/10"/>
                    <div className="rounded-[1.25rem] bg-white border border-[#12150F]/8 elev-1 p-5">
                      <div className="font-display text-xl font-bold text-[#35723A] mb-1">{item.period}</div>
                      <div className="font-display text-sm font-bold tracking-[0.06em] uppercase text-[#12150F] mb-1">{item.label}</div>
                      <p className="text-[#12150F]/55 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ EXPERIENCES ═════════ */}
        <section className="bg-[#EFF4EA] py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.experiences.eyebrow} title={h.experiences.title} center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {experiences.map((exp, i) => {
                const text = h.experiences.items[exp.id];
                return (
                  <FadeSection key={exp.id} delay={(i % 3) * 80}>
                    <PhotoCard to={exp.to} photo={'img' in exp ? exp.img : undefined} title={text.title} desc={text.desc} ratio="aspect-[4/3]" />
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ CULTURAL FOOD EVENT (dates from the admin area) ═════════ */}
        <CulturalFoodDates events={siteEvents} />

        {/* ═════════ GUESTHOUSE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.stay.eyebrow} title={h.stay.title} desc={h.stay.desc} center />
            <div className="scroll-smooth-x -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible pb-4 sm:pb-0">
              <div className="flex gap-5 sm:grid sm:grid-cols-3 w-max sm:w-auto">
                {rooms.map((id, i) => {
                  const room = h.stay.rooms[id];
                  return (
                    <FadeSection key={id} delay={i * 90} className="snap-start w-[78vw] sm:w-auto flex-shrink-0">
                      <PhotoCard to="/stay" title={room.name} desc={room.desc} meta={h.stay.viewRoom} ratio="aspect-[4/3]" />
                    </FadeSection>
                  );
                })}
              </div>
            </div>
            <FadeSection className="text-center mt-12">
              <Link to="/stay" className="btn-primary">
                {h.stay.cta}
              </Link>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ RESTAURANT ═════════ */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <FadeSection className="relative min-h-[360px] lg:min-h-[520px] rounded-[2rem] overflow-hidden img-zoom photo-3d">
                <img src={photos.food} alt={t.photos.food} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
              </FadeSection>
              <FadeSection delay={120} className="rounded-[1.25rem] bg-white border border-[#12150F]/8 elev-1 p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
                <span className="relative block w-10 h-px bg-[#B8863B] mb-4" />
                <span className="relative block text-xs font-bold tracking-[0.2em] uppercase text-[#35723A] mb-4">{h.restaurant.eyebrow}</span>
                <h2 className="relative font-display text-4xl sm:text-5xl font-extrabold text-[#12150F] leading-[1.05] mb-6">{h.restaurant.title}</h2>
                <p className="relative text-[#12150F]/60 text-base sm:text-lg leading-relaxed mb-8">{h.restaurant.desc}</p>
                <div className="relative flex flex-wrap gap-2 mb-10">
                  {h.restaurant.categories.map((cat, i) => (
                    <span key={i} className="rounded-full border border-[#12150F]/12 text-[#12150F]/70 text-sm px-4 py-2">{cat}</span>
                  ))}
                </div>
                <Link to="/dine" className="relative btn-primary self-start">
                  {h.restaurant.cta}
                </Link>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ═════════ FACILITIES & SERVICES ═════════ */}
        <section className="bg-[#EFF4EA] py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.facilities.eyebrow} title={h.facilities.title} desc={h.facilities.desc} center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((id, i) => {
                const item = h.facilities.items[id];
                return (
                  <FadeSection key={id} delay={(i % 3) * 80}>
                    <div className="rounded-[1.25rem] bg-white border border-[#12150F]/8 elev-1 h-full p-7 sm:p-8 flex flex-col transition-transform duration-300 hover:-translate-y-1">
                      <span className="text-[#B8863B] text-sm font-semibold tabular-nums mb-5">0{i + 1}</span>
                      <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase text-[#35723A] mb-3">{item.title}</h3>
                      <p className="text-[#12150F]/55 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ ORAL HISTORY ═════════ */}
        <section className="relative py-20 sm:py-28">
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeSection className="relative">
              <div className="rounded-[1.25rem] overflow-hidden elev-1 aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5]">
                <Photo alt={h.stories.elderAlt} label={h.stories.elderAlt} className="w-full h-full object-cover"/>
              </div>
              {/* Audio player */}
              <div className="relative -mt-24 mx-4 sm:mx-8 rounded-[1.25rem] bg-white border border-[#12150F]/8 elev-2 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 flex-shrink-0 rounded-full bg-[#35723A] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    aria-label={isPlaying ? h.stories.pause : h.stories.play}
                  >
                    {isPlaying
                      ? <span className="flex gap-1"><span className="w-1 h-4 rounded bg-current"/><span className="w-1 h-4 rounded bg-current"/></span>
                      : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#35723A] text-[11px] font-bold tracking-[0.12em] uppercase mb-1">{h.stories.nowPlaying}</div>
                    <div className="font-display text-[#12150F] font-bold truncate">{h.stories.storyTitle}</div>
                    <div className="text-[#12150F]/50 text-xs mt-0.5">{h.stories.meta}</div>
                  </div>
                </div>
                <div className="flex items-end gap-[3px] h-10 mt-5">
                  {Array.from({ length: 42 }, (_, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-full ${isPlaying ? 'bg-[#35723A] animate-wave' : 'bg-[#12150F]/12'}`}
                      style={{
                        height: `${30 + Math.abs(Math.sin(i * 0.7) * 55 + Math.cos(i * 1.9) * 15)}%`,
                        animationDelay: `${(i % 7) * 90}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </FadeSection>

            <FadeSection delay={120}>
              <span className="eyebrow bg-white/8 text-[#B8863B] mb-5">{h.stories.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-7">{h.stories.title}</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-5">{h.stories.p1}</p>
              <p className="text-white/50 text-base leading-relaxed mb-8">{h.stories.p2}</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {h.stories.languages.map((l, i) => (
                  <span key={i} className="rounded-full bg-white/8 border border-white/10 text-white/80 text-sm px-4 py-2">{l}</span>
                ))}
              </div>
              <TextLink to="/heritage/stories">{h.stories.cta}</TextLink>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ THE READING PLACE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeSection>
              <span className="eyebrow bg-[#35723A]/10 text-[#35723A] mb-5">{h.reading.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#12150F] leading-[1.05] mb-7">{h.reading.title}</h2>
              <p className="text-[#12150F]/65 text-lg leading-relaxed mb-6">{h.reading.desc}</p>
              <p className="text-[#12150F]/55 text-base leading-relaxed mb-8">{h.reading.mountain}</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {h.reading.qualities.map((quality, i) => (
                  <span key={i} className="rounded-full bg-white border border-[#12150F]/8 text-[#12150F]/80 text-sm px-4 py-2 shadow-sm">{quality}</span>
                ))}
              </div>
              <Link to="/visit" className="btn-primary">{h.reading.cta}</Link>
            </FadeSection>

            <FadeSection delay={100} className="relative rounded-[2rem] overflow-hidden img-zoom photo-3d min-h-[340px] lg:min-h-[460px]">
              <img src={photos.gardens} alt={t.photos.gardens} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#16250F]/80 via-transparent to-transparent" />
              <span className="absolute left-6 right-6 bottom-6 text-white font-display text-xl sm:text-2xl leading-tight">
                {h.reading.caption}
              </span>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ GALLERY ═════════ */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.gallery.eyebrow}
              title={h.gallery.title}
              action={<TextLink to="/gallery">{h.gallery.full}</TextLink>}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] lg:auto-rows-[230px] gap-3 sm:gap-4">
              {galleryPhotos.map(({ key, span }) => (
                <FadeSection key={key} className={`img-zoom group relative rounded-2xl sm:rounded-3xl bg-[#35723A]/8 ${span}`}>
                  <Link to="/gallery" className="block w-full h-full">
                    <img src={photos[key]} alt={t.photos[key]} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#16250F]/85 via-[#16250F]/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                      <span className="block font-display text-base sm:text-xl text-white leading-tight">{t.photoCaptions[key].title}</span>
                      <span className="hidden sm:block text-white/75 text-xs sm:text-sm leading-snug mt-1 line-clamp-2">{t.photoCaptions[key].desc}</span>
                    </span>
                  </Link>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ FINAL CTA ═════════ */}
        <section className="px-2 sm:px-3 pb-3">
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden py-24 sm:py-32 lg:py-40">
            <img src={photos.home} alt={t.photos.home} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#16250F] via-[#16250F]/70 to-[#16250F]/40"/>
            <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
              <FadeSection>
                <span className="eyebrow glass text-white mb-6">{h.final.eyebrow}</span>
                <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.98] tracking-[-0.04em] mb-10">
                  {h.final.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                  {[t.common.locationLine, t.common.hoursDaily, '+251 XXX XXX XXX'].map((text, i) => (
                    <span key={i} className="glass rounded-full px-5 py-2 text-white/85 text-sm">
                      {text}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/visit" className="btn-primary justify-center">{t.common.planVisit}</Link>
                  <a href="#" className="btn-glass justify-center">{t.common.getDirections}</a>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky CTA ── */}
      <div className={`mobile-sticky-cta lg:hidden ${showStickyCta ? '' : 'hidden-cta'}`} inert={!showStickyCta}>
        <Link to="/visit" className="flex-1 btn-primary justify-center py-3 text-[13px] shadow-none">
          {t.common.planVisit}
        </Link>
        <Link to="/contact" className="flex-1 btn-glass justify-center py-3 text-[13px]">
          {t.common.contactUs}
        </Link>
      </div>
    </>
  );
}
