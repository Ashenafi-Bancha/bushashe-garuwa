import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { Tilt, useScrollY } from '../lib/motion';

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

const events = [
  { id: 'food', availKind: 'limited' },
  { id: 'harvest', availKind: 'open' },
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
        <span className={`eyebrow mb-5 ${dark ? 'bg-white/8 text-[#C99A45]' : 'bg-[#A65A3A]/10 text-[#A65A3A]'}`}>{eyebrow}</span>
        <h2 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] ${dark ? 'text-white' : 'text-[#0e2820]'}`}>
          {title}
        </h2>
        {desc && <p className={`mt-5 text-base sm:text-lg leading-relaxed ${center ? 'mx-auto' : ''} max-w-2xl ${dark ? 'text-white/60' : 'text-[#1D211E]/60'}`}>{desc}</p>}
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
          ? 'border-white/20 text-white hover:bg-white hover:text-[#0e2820]'
          : 'border-[#0e2820]/15 text-[#0e2820] hover:bg-[#0e2820] hover:text-white'
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

  const stats: { value?: string; label?: string; phrase?: string }[] = [
    { value: '4+', label: h.hero.statGenerations },
    { value: '200+', label: h.hero.statYears },
    { phrase: h.hero.sinceCentury },
  ];

  return (
    <>
      <main className="pb-24 lg:pb-0">

        {/* ═════════ HERO ═════════ */}
        <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0a1f19]" aria-label={h.hero.title}>
          <div className="absolute inset-0 will-change-transform" style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}>
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f19]/55 via-[#0a1f19]/10 to-[#0a1f19]"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f19]/70 via-[#0a1f19]/10 to-transparent"/>

          <div
            className="relative z-10 h-full max-w-screen-xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-24 sm:pb-28 will-change-transform"
            style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)`, opacity: Math.max(0, 1 - scrollY / 700) }}
          >
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
              <div className="max-w-4xl">
                <span className="eyebrow glass text-white mb-6 sm:mb-8 animate-fade-up">
                  {h.hero.eyebrow}
                </span>
                <h1 className="font-display text-white text-[clamp(3.25rem,9.5vw,8rem)] leading-[0.95] animate-fade-up delay-100">
                  {h.hero.title}
                </h1>
                <p className="mt-5 sm:mt-6 font-display font-normal text-xl sm:text-3xl text-white/85 leading-snug max-w-2xl animate-fade-up delay-200">
                  {h.hero.subtitle}
                </p>
                <p className="mt-5 sm:mt-6 pl-4 sm:pl-5 border-l-2 border-[#C99A45] max-w-xl font-display italic font-medium text-lg sm:text-2xl leading-snug text-white/90 animate-fade-up delay-300">
                  <span className="text-[#E6BE6E]">{h.hero.sloganA}</span>{' '}
                  {h.hero.sloganB}{' '}
                  <span className="text-white/75">{h.hero.sloganC}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 animate-fade-up delay-400">
                  <Link to="/discover" className="btn-primary justify-center">
                    {h.hero.explore}
                  </Link>
                  <Link to="/visit" className="btn-glass justify-center">
                    {t.common.planVisit}
                  </Link>
                </div>
              </div>

              {/* Stats card */}
              <div className="hidden lg:block animate-fade-up delay-400 [perspective:1000px]">
                <Tilt className="rounded-3xl" max={10}>
                  <div className="grid grid-cols-3 glass rounded-3xl p-2 animate-float shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
                    {stats.map((s, i) => (
                      <div key={i} className={`px-6 py-5 flex flex-col justify-center ${i > 0 ? 'border-l border-white/15' : ''}`}>
                        {s.phrase ? (
                          <div className="font-display text-2xl leading-tight text-[#E6BE6E] max-w-[9rem]">{s.phrase}</div>
                        ) : (
                          <>
                            <div className="font-display text-4xl font-bold text-white">{s.value}</div>
                            <div className="text-xs text-white/60 mt-1 whitespace-nowrap">{s.label}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </Tilt>
              </div>
            </div>
          </div>

          {/* Slide progress + scroll hint */}
          <div className="absolute bottom-7 inset-x-0 z-10">
            <div className="max-w-screen-xl mx-auto px-5 sm:px-8 flex items-center justify-between">
              <div className="flex gap-2">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setHeroIdx(i)}
                    className="relative h-1 w-10 sm:w-14 rounded-full bg-white/25 overflow-hidden"
                    aria-label={fmt(h.hero.slide, { n: i + 1 })}
                    aria-current={i === heroIdx}
                  >
                    {i === heroIdx && <span key={heroIdx} className="absolute inset-0 bg-[#C99A45] rounded-full animate-progress" />}
                    {i < heroIdx && <span className="absolute inset-0 bg-white/70 rounded-full" />}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs font-medium tracking-[0.14em] uppercase">
                {h.hero.scroll}
                <span className="block w-px h-7 bg-gradient-to-b from-white/60 to-transparent animate-scroll-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ MARQUEE ═════════ */}
        <div className="bg-[#C99A45] overflow-hidden py-4 sm:py-5" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {[...h.intro.pillars, ...h.intro.pillars].map((p, i) => (
                  <span key={i} className="flex items-center font-display text-2xl sm:text-3xl font-bold text-[#0e2820] tracking-tight">
                    <span className="px-6 sm:px-8">{p}</span>
                    <span className="w-10 h-px bg-[#0e2820]/35" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═════════ INTRO ═════════ */}
        <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <FadeSection>
              <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] mb-5">{h.intro.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0e2820] leading-[1.05] mb-7">
                {h.intro.title}
              </h2>
              <p className="text-lg sm:text-xl text-[#1D211E]/75 leading-relaxed mb-5">{h.intro.p1}</p>
              <p className="text-base text-[#1D211E]/55 leading-relaxed mb-8">{h.intro.p2}</p>
              <div className="border-l-2 border-[#C99A45] pl-5 mb-8">
                <div className="text-[#A65A3A] text-xs font-semibold tracking-[0.14em] uppercase mb-2">{t.common.goal.eyebrow}</div>
                <p className="font-display italic text-xl sm:text-2xl text-[#173F35] leading-snug">{t.common.goal.text}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {h.intro.pillars.map((pillar, i) => (
                  <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0e2820]/8 px-4 py-2 text-sm font-medium text-[#0e2820] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C99A45]"/>{pillar}
                  </span>
                ))}
              </div>
            </FadeSection>

            <FadeSection delay={150} className="relative">
              <div className="img-zoom rounded-[2rem] aspect-[4/5] bg-[#173F35]/10 shadow-2xl shadow-[#0e2820]/20">
                <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover object-[center_60%]"/>
              </div>
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-[48%] aspect-square rounded-[1.75rem] overflow-hidden border-8 border-[#F7F5F0] shadow-xl">
                <img src={photos.gifaataa2} alt={t.photos.gifaataa2} className="w-full h-full object-cover" loading="lazy"/>
              </div>
              <div className="absolute top-6 right-3 sm:-right-6 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0e2820] text-[#C99A45] flex items-center justify-center font-display text-xl font-bold">4+</div>
                <div className="text-sm font-semibold text-[#0e2820] leading-tight">{h.intro.generations}</div>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ EXPLORE — bento ═════════ */}
        <section className="relative bg-[#0e2820] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[2.5rem] py-20 sm:py-28 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-[36rem] h-[36rem] glow-gold pointer-events-none"/>
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.explore.eyebrow} title={h.explore.title} dark />
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[640px]">
              {exploreCards.map((card, i) => {
                const text = h.explore.cards[card.id];
                return (
                  <FadeSection key={card.id} delay={i * 90} className={`${card.span} min-h-[320px] md:min-h-0`}>
                    <Tilt className="h-full rounded-[1.75rem]" max={5}>
                    <Link to={card.to} className="group relative block h-full rounded-[1.75rem] overflow-hidden">
                      <Photo
                        src={card.img}
                        alt={text.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f19]/90 via-[#0a1f19]/20 to-transparent"/>
                      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7">
                        <h3 className={`font-display font-bold text-white mb-2 ${i === 0 ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{text.title}</h3>
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md line-clamp-2">{text.sub}</p>
                      </div>
                    </Link>
                    </Tilt>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ LIVING HERITAGE ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.living.eyebrow}
              title={h.living.title}
              action={<TextLink to="/heritage">{t.common.exploreAll}</TextLink>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {livingHeritage.map((item, i) => {
                const text = h.living.items[item.id];
                return (
                  <FadeSection key={item.id} delay={i * 80}>
                    <Tilt className="h-full rounded-3xl">
                    <Link to="/heritage" className="group heritage-card bg-white flex flex-col h-full">
                      <div className="img-zoom relative aspect-[4/3] bg-[#173F35]/8">
                        <Photo src={'img' in item ? item.img : undefined} alt={text.title} className="w-full h-full object-cover"/>
                        <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-[#0e2820] tabular-nums">0{i + 1}</span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display text-xl font-bold text-[#0e2820] mb-2">{text.title}</h3>
                        <p className="text-[#1D211E]/60 text-sm leading-relaxed mb-6 flex-1">{text.desc}</p>
                        <span className="text-sm font-semibold text-[#A65A3A] underline decoration-[#A65A3A]/30 underline-offset-4 transition-colors group-hover:decoration-[#A65A3A]">
                          {t.common.explore}
                        </span>
                      </div>
                    </Link>
                    </Tilt>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ TIMELINE ═════════ */}
        <section className="relative bg-[#0e2820] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[2.5rem] py-20 sm:py-28 overflow-hidden">
          <div className="absolute -bottom-48 -left-40 w-[40rem] h-[40rem] glow-forest pointer-events-none"/>
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.timeline.eyebrow}
              title={h.timeline.title}
              dark
              action={<TextLink to="/heritage/timeline" dark>{h.timeline.cta}</TextLink>}
            />

            {/* Desktop: horizontal */}
            <div className="hidden lg:block relative">
              <div className="absolute top-[7px] left-0 right-0 h-px bg-gradient-to-r from-[#C99A45]/60 via-[#C99A45]/30 to-transparent"/>
              <div className="grid grid-cols-5 gap-5">
                {h.timeline.items.map((item, i) => (
                  <FadeSection key={i} delay={i * 90}>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#C99A45] ring-8 ring-[#C99A45]/15 mb-8"/>
                    <Tilt className="rounded-3xl h-full" max={8}>
                    <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 h-full hover:bg-white/[0.07] hover:border-[#C99A45]/30 transition-colors duration-500">
                      <div className="font-display text-2xl font-bold text-[#C99A45] mb-3">{item.period}</div>
                      <div className="font-display text-lg font-semibold text-white mb-2">{item.label}</div>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    </Tilt>
                  </FadeSection>
                ))}
              </div>
            </div>

            {/* Mobile: vertical */}
            <div className="lg:hidden relative pl-8">
              <div className="absolute left-[6px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C99A45]/60 to-[#C99A45]/10"/>
              <div className="space-y-5">
                {h.timeline.items.map((item, i) => (
                  <FadeSection key={i} delay={i * 60} className="relative">
                    <div className="absolute -left-8 top-6 w-3.5 h-3.5 rounded-full bg-[#C99A45] ring-4 ring-[#C99A45]/15"/>
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                      <div className="font-display text-xl font-bold text-[#C99A45] mb-1">{item.period}</div>
                      <div className="font-display text-base font-semibold text-white mb-1">{item.label}</div>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ EXPERIENCES ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.experiences.eyebrow}
              title={h.experiences.title}
              action={<TextLink to="/experiences">{t.common.exploreAll}</TextLink>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {experiences.map((exp, i) => {
                const text = h.experiences.items[exp.id];
                return (
                  <FadeSection key={exp.id} delay={(i % 3) * 80}>
                    <Tilt className="h-full rounded-3xl">
                    <Link to={exp.to} className="group heritage-card bg-white block h-full">
                      <div className="img-zoom relative aspect-[16/11] bg-[#173F35]/8">
                        <Photo src={'img' in exp ? exp.img : undefined} alt={text.title} className="w-full h-full object-cover"/>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl font-bold text-[#0e2820] mb-2">{text.title}</h3>
                        <p className="text-[#1D211E]/60 text-sm leading-relaxed line-clamp-2">{text.desc}</p>
                      </div>
                    </Link>
                    </Tilt>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ EVENTS ═════════ */}
        <section className="relative bg-[#101815] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[2.5rem] py-20 sm:py-28 overflow-hidden">
          <div className="absolute -top-40 left-1/3 w-[40rem] h-[30rem] glow-gold opacity-60 pointer-events-none"/>
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading
              eyebrow={h.events.eyebrow}
              title={h.events.title}
              desc={h.events.desc}
              dark
              action={<TextLink to="/events" dark>{h.events.all}</TextLink>}
            />
            <div className="grid lg:grid-cols-2 gap-5">
              {events.map((ev, i) => {
                const text = h.events.items[ev.id];
                return (
                  <FadeSection key={ev.id} delay={i * 100}>
                    <Tilt className="h-full rounded-3xl" max={4}>
                    <div className="group grid sm:grid-cols-[0.9fr_1.1fr] rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-[#C99A45]/40 transition-colors duration-500 h-full">
                      <div className="img-zoom relative min-h-[220px]">
                        <Photo src={ev.id === 'food' ? photos.food : undefined} alt={text.name} className="absolute inset-0 w-full h-full object-cover"/>
                        <span className="absolute top-4 left-4 rounded-full bg-[#C99A45] text-[#0e2820] text-xs font-bold px-3 py-1.5">{text.date}</span>
                      </div>
                      <div className="p-6 sm:p-7 flex flex-col">
                        <span className={`self-start text-[11px] font-semibold rounded-full px-3 py-1 mb-4 ${ev.availKind === 'open' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-[#A65A3A]/25 text-[#f0a584]'}`}>
                          {text.avail}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-white mb-3">{text.name}</h3>
                        <p className="text-white/55 text-sm leading-relaxed mb-6 flex-1">{text.desc}</p>
                        <Link to="/events" className="btn-primary self-start text-[13px] py-3 px-5">
                          {t.common.reserveYourPlace}
                        </Link>
                      </div>
                    </div>
                    </Tilt>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

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
                      <Tilt className="h-full rounded-3xl">
                      <Link to="/stay" className="group heritage-card bg-white block h-full">
                        <div className="img-zoom relative aspect-[4/3] bg-[#173F35]/8">
                          <Photo alt={room.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-6">
                          <h3 className="font-display text-xl font-bold text-[#0e2820] mb-2">{room.name}</h3>
                          <p className="text-[#1D211E]/60 text-sm leading-relaxed mb-5 line-clamp-2">{room.desc}</p>
                          <span className="text-sm font-semibold text-[#A65A3A] underline decoration-[#A65A3A]/30 underline-offset-4 transition-colors group-hover:decoration-[#A65A3A]">
                            {h.stay.viewRoom}
                          </span>
                        </div>
                      </Link>
                      </Tilt>
                    </FadeSection>
                  );
                })}
              </div>
            </div>
            <FadeSection className="text-center mt-12">
              <Link to="/stay" className="btn-primary bg-[#0e2820] border-[#0e2820] text-white hover:bg-[#173F35] hover:border-[#173F35]">
                {h.stay.cta}
              </Link>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ RESTAURANT ═════════ */}
        <section className="pb-20 sm:pb-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <FadeSection className="relative min-h-[360px] lg:min-h-[520px] rounded-[2rem] overflow-hidden img-zoom">
                <img src={photos.food} alt={t.photos.food} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
              </FadeSection>
              <FadeSection delay={120} className="rounded-[2rem] bg-[#0e2820] p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-32 -right-24 w-80 h-80 glow-gold pointer-events-none"/>
                <span className="relative eyebrow bg-white/8 text-[#C99A45] mb-5 self-start">{h.restaurant.eyebrow}</span>
                <h2 className="relative font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05] mb-6">{h.restaurant.title}</h2>
                <p className="relative text-white/65 text-base sm:text-lg leading-relaxed mb-8">{h.restaurant.desc}</p>
                <div className="relative flex flex-wrap gap-2 mb-10">
                  {h.restaurant.categories.map((cat, i) => (
                    <span key={i} className="rounded-full border border-white/15 bg-white/5 text-white/80 text-sm px-4 py-2">{cat}</span>
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
        <section className="pb-20 sm:pb-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
            <Heading eyebrow={h.facilities.eyebrow} title={h.facilities.title} desc={h.facilities.desc} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((id, i) => {
                const item = h.facilities.items[id];
                return (
                  <FadeSection key={id} delay={(i % 3) * 80}>
                    <Tilt className="h-full rounded-3xl" max={6}>
                      <div className="heritage-card bg-white h-full p-7 sm:p-8 flex flex-col">
                        <span className="text-[#C99A45] text-sm font-semibold tabular-nums mb-5">0{i + 1}</span>
                        <h3 className="font-display text-2xl font-semibold text-[#0e2820] mb-3">{item.title}</h3>
                        <p className="text-[#1D211E]/60 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </Tilt>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═════════ ORAL HISTORY ═════════ */}
        <section className="relative bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[2.5rem] py-20 sm:py-28 overflow-hidden">
          <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] glow-gold opacity-70 pointer-events-none"/>
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeSection className="relative">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5]">
                <Photo alt={h.stories.elderAlt} className="w-full h-full object-cover"/>
              </div>
              {/* Audio player */}
              <div className="relative -mt-24 mx-4 sm:mx-8 glass rounded-3xl p-5 sm:p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 flex-shrink-0 rounded-full bg-[#C99A45] text-[#0e2820] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    aria-label={isPlaying ? h.stories.pause : h.stories.play}
                  >
                    {isPlaying
                      ? <span className="flex gap-1"><span className="w-1 h-4 rounded bg-current"/><span className="w-1 h-4 rounded bg-current"/></span>
                      : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#C99A45] text-[11px] font-semibold tracking-[0.12em] uppercase mb-1">{h.stories.nowPlaying}</div>
                    <div className="font-display text-white font-semibold truncate">{h.stories.storyTitle}</div>
                    <div className="text-white/50 text-xs mt-0.5">{h.stories.meta}</div>
                  </div>
                </div>
                <div className="flex items-end gap-[3px] h-10 mt-5">
                  {Array.from({ length: 42 }, (_, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-full ${isPlaying ? 'bg-[#C99A45] animate-wave' : 'bg-white/25'}`}
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
              <span className="eyebrow bg-white/8 text-[#C99A45] mb-5">{h.stories.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-7">{h.stories.title}</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-5">{h.stories.p1}</p>
              <p className="text-white/50 text-base leading-relaxed mb-8">{h.stories.p2}</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {h.stories.languages.map((l, i) => (
                  <span key={i} className="rounded-full bg-white/8 border border-white/10 text-white/80 text-sm px-4 py-2">{l}</span>
                ))}
              </div>
              <TextLink to="/heritage/stories" dark>{h.stories.cta}</TextLink>
            </FadeSection>
          </div>
        </section>

        {/* ═════════ LIBRARY ═════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeSection>
              <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] mb-5">{h.library.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0e2820] leading-[1.05] mb-7">{h.library.title}</h2>
              <p className="text-[#1D211E]/65 text-lg leading-relaxed mb-8">{h.library.desc}</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {h.library.categories.map((cat, i) => (
                  <span key={i} className="rounded-full bg-white border border-[#0e2820]/8 text-[#0e2820]/80 text-sm px-4 py-2 shadow-sm">{cat}</span>
                ))}
              </div>
              <Link to="/library" className="btn-primary">{h.library.cta}</Link>
            </FadeSection>

            <FadeSection delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {h.library.books.map((book, i) => (
                  <div key={i} className={`book-3d group ${i % 2 === 1 ? 'mt-10' : ''}`}>
                    <div className={`book aspect-[3/4] p-5 pl-7 flex flex-col justify-between overflow-hidden ${
                      ['bg-[#0e2820]', 'bg-[#A65A3A]', 'bg-[#173F35]', 'bg-[#C99A45]'][i]
                    }`}>
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_75%_15%,white,transparent_55%)]"/>
                      <span className={`relative text-[10px] font-semibold tracking-[0.12em] uppercase ${i === 3 ? 'text-[#0e2820]/70' : 'text-white/60'}`}>{book.cat}</span>
                      <div className="relative">
                        <div className={`w-8 h-px mb-3 ${i === 3 ? 'bg-[#0e2820]/40' : 'bg-white/40'}`}/>
                        <span className={`block font-display text-lg sm:text-xl font-bold leading-tight ${i === 3 ? 'text-[#0e2820]' : 'text-white'}`}>{book.title}</span>
                        <span className={`block mt-2 text-xs ${i === 3 ? 'text-[#0e2820]/60' : 'text-white/50'}`}>{bookYears[i]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <FadeSection key={key} className={`img-zoom group relative rounded-2xl sm:rounded-3xl bg-[#173F35]/8 ${span}`}>
                  <Link to="/gallery" className="block w-full h-full">
                    <img src={photos[key]} alt={t.photos[key]} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#0a1f19]/85 via-[#0a1f19]/10 to-transparent" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f19] via-[#0a1f19]/70 to-[#0a1f19]/40"/>
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
