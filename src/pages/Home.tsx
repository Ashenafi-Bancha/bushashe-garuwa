import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import Photo from '../components/Photo';
import { fmt, useI18n } from '../i18n/I18nProvider';

const heroSlides: { key: PhotoKey; pos: string }[] = [
  { key: 'home',      pos: 'object-center' },
  { key: 'house',     pos: 'object-center' },
  { key: 'pavilions', pos: 'object-center' },
  { key: 'gardens',   pos: 'object-bottom' },
  { key: 'lawn',      pos: 'object-top' },
];

/* Page structure — the text for each id lives in the translations (t.home.*) */
const exploreCards = [
  { id: 'heritage', img: photos.house, to: '/heritage' },
  { id: 'nature', img: photos.lawn, to: '/heritage' },
  { id: 'culture', img: photos.gifaataa1, to: '/experiences' },
  { id: 'hospitality', img: photos.pavilions, to: '/stay' },
] as const;

const livingHeritage = [
  { id: 'houses', img: photos.house },
  { id: 'trees', img: photos.lawn },
  { id: 'animals' },
  { id: 'artifacts' },
] as const;

const experiences = [
  { id: 'food', to: '/experiences' },
  { id: 'coffee', to: '/experiences' },
  { id: 'performance', to: '/experiences' },
  { id: 'tour', img: photos.pavilions, to: '/experiences' },
  { id: 'education', to: '/experiences/education' },
  { id: 'photography', img: photos.gardens, to: '/experiences' },
] as const;

const events = [
  { id: 'food', availKind: 'limited' },
  { id: 'harvest', availKind: 'open' },
] as const;

const rooms = ['standard', 'family', 'heritage'] as const;

const bookYears = ['2018', '2020', '2015', '2019'];

const galleryPhotos: PhotoKey[] = ['home', 'gifaataa1', 'house', 'gifaataa2', 'pavilions', 'gifaataa3', 'gardens', 'lawn'];

/* ── FadeSection hook ── */
function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

export default function Home() {
  const { t } = useI18n();
  const h = t.home;
  const [heroIdx, setHeroIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroSlides.length), 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <main className="pb-16 lg:pb-0">

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[580px] flex items-end overflow-hidden" aria-label={h.hero.title}>

          {/* Slideshow */}
          {heroSlides.map(({ key, pos }, i) => (
            <img
              key={key}
              src={photos[key]}
              alt={t.photos[key]}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className={`absolute inset-0 w-full h-full object-cover ${pos} transition-opacity duration-[1400ms] ease-in-out ${
                i === heroIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f19]/95 via-[#173F35]/35 to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2820]/60 via-transparent to-transparent"/>

          {/* Content */}
          <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-8 pb-14 sm:pb-20 lg:pb-28">
            <div className="max-w-4xl">

              {/* Label row */}
              <div className="flex items-center gap-3 mb-5 sm:mb-8 animate-fade-up">
                <div className="h-px w-6 sm:w-10 bg-[#C99A45]/70 flex-shrink-0"/>
                <span className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] sm:tracking-[0.4em] uppercase">
                  {h.hero.eyebrow}
                </span>
              </div>

              {/* Main headline */}
              <h1 className="font-serif font-light text-white leading-[1.05] mb-5 sm:mb-8 animate-fade-up delay-100">
                <span className="block text-[clamp(2rem,8vw,5.5rem)] mb-2 sm:mb-3 tracking-tight">
                  {h.hero.title}
                </span>
                <span className="block text-[clamp(1rem,3.5vw,2rem)] font-light text-white/75 leading-snug max-w-2xl">
                  {h.hero.subtitle}
                </span>
              </h1>

              {/* Slogan */}
              <div className="flex items-start gap-3 mb-7 sm:mb-10 max-w-xl animate-fade-up delay-200">
                <div className="w-px self-stretch bg-[#C99A45]/50 flex-shrink-0 mt-1"/>
                <p className="font-serif italic text-sm sm:text-lg lg:text-xl text-white/90 leading-snug font-light">
                  {h.hero.sloganA}{' '}
                  <span className="not-italic text-white/65 text-xs sm:text-base lg:text-lg">
                    {h.hero.sloganB}
                  </span>
                  {' '}{h.hero.sloganC}
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 animate-fade-up delay-300">
                <Link
                  to="/discover"
                  className="btn-primary justify-center text-center py-3.5 sm:py-[14px] shadow-lg shadow-[#C99A45]/25"
                >
                  {h.hero.explore}
                  <span className="ml-1">→</span>
                </Link>
                <Link
                  to="/visit"
                  className="inline-flex items-center justify-center gap-2 font-sans font-bold text-[11px] tracking-[0.18em] uppercase text-white py-3.5 sm:py-[14px] px-8 border border-white/90 active:scale-[0.98] transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                  {t.common.planVisit}
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35 animate-fade-in delay-500">
            <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.25em] uppercase">{h.hero.scroll}</span>
            <div className="animate-scroll-bounce">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-6 sm:bottom-8 right-5 sm:right-8 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === heroIdx ? 'bg-[#C99A45] w-7' : 'bg-white/30 w-3 hover:bg-white/50'
                }`}
                aria-label={fmt(h.hero.slide, { n: i + 1 })}
              />
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            MORE THAN A DESTINATION
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] pattern-weave py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <FadeSection>
                  <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{h.intro.eyebrow}</div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35] leading-tight mb-5 sm:mb-6 gold-underline">
                    {h.intro.title}
                  </h2>
                  <p className="text-[#1D211E]/65 font-sans text-sm sm:text-base leading-relaxed mb-4">
                    {h.intro.p1}
                  </p>
                  <p className="text-[#1D211E]/50 font-sans text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
                    {h.intro.p2}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {h.intro.pillars.map((pillar, i) => (
                      <FadeSection key={i} delay={i * 80}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 bg-[#C99A45] flex-shrink-0"/>
                          <span className="text-[#173F35] font-sans font-semibold text-xs sm:text-sm tracking-wide uppercase">{pillar}</span>
                        </div>
                      </FadeSection>
                    ))}
                  </div>
                </FadeSection>
              </div>
              <FadeSection className="order-1 lg:order-2 relative" delay={150}>
                <div className="img-zoom aspect-[4/5] bg-[#173F35]/10">
                  <img src={photos.lawn} alt={t.photos.lawn} className="w-full h-full object-cover object-top"/>
                </div>
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-[#173F35] text-white p-5 sm:p-6 hidden sm:block">
                  <div className="font-serif text-3xl sm:text-4xl font-light text-[#C99A45]">5</div>
                  <div className="font-sans text-[10px] tracking-wider text-white/55 uppercase mt-1">{h.intro.generations}</div>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            EXPLORE BUSHASHE — 4 cards
        ════════════════════════════════════════ */}
        <section className="bg-[#173F35] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="text-center mb-10 sm:mb-14">
                <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.explore.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white">{h.explore.title}</h2>
              </div>
            </FadeSection>

            {/* Mobile: horizontal scroll; desktop: grid */}
            <div className="scroll-smooth-x pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0">
              <div className="flex gap-3 sm:gap-1 sm:grid sm:grid-cols-2 lg:grid-cols-4 w-[200%] sm:w-auto">
                {exploreCards.map((card, i) => {
                  const text = h.explore.cards[card.id];
                  return (
                    <FadeSection key={card.id} delay={i * 80} className="snap-start w-[80vw] sm:w-auto flex-shrink-0">
                      <Link to={card.to} className="group relative overflow-hidden flex items-end aspect-[3/4] sm:aspect-[3/4] block">
                        <Photo
                          src={'img' in card ? card.img : undefined}
                          alt={text.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f19]/90 via-[#173F35]/20 to-transparent transition-opacity duration-400"/>
                        <div className="relative p-5 sm:p-6 z-10 w-full">
                          <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mb-1.5">{text.title}</h3>
                          <p className="text-white/55 text-xs sm:text-sm font-sans leading-relaxed mb-3 line-clamp-2">{text.sub}</p>
                          <span className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                            {t.common.explore} <span>→</span>
                          </span>
                        </div>
                      </Link>
                    </FadeSection>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LIVING HERITAGE
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                  <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.living.eyebrow}</div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35] leading-tight">{h.living.title}</h2>
                </div>
                <Link to="/heritage" className="text-[#173F35] text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase hover:text-[#C99A45] transition-colors flex items-center gap-2 flex-shrink-0 group">
                  {t.common.exploreAll} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </FadeSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {livingHeritage.map((item, i) => {
                const text = h.living.items[item.id];
                return (
                  <FadeSection key={item.id} delay={i * 80}>
                    <Link to="/heritage" className="group flex gap-4 sm:gap-5 items-start heritage-card bg-white p-4 sm:p-5">
                      <div className="img-zoom w-24 sm:w-28 h-24 sm:h-28 flex-shrink-0 bg-[#173F35]/8">
                        <Photo src={'img' in item ? item.img : undefined} alt={text.title} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#173F35] mb-1.5">{text.title}</h3>
                        <p className="text-[#1D211E]/55 text-xs sm:text-sm font-sans leading-relaxed mb-3 line-clamp-2">{text.desc}</p>
                        <span className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                          {t.common.explore} <span>→</span>
                        </span>
                      </div>
                    </Link>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            TIMELINE
        ════════════════════════════════════════ */}
        <section className="bg-[#173F35] py-12 sm:py-16 lg:py-24 overflow-hidden">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="text-center mb-12 sm:mb-16">
                <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.timeline.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white">{h.timeline.title}</h2>
              </div>
            </FadeSection>

            {/* Mobile: vertical; desktop: horizontal */}
            <div className="hidden lg:block relative">
              <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C99A45]/35 to-transparent"/>
              <div className="grid grid-cols-5 gap-4">
                {h.timeline.items.map((item, i) => (
                  <FadeSection key={i} delay={i * 80}>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 border-2 border-[#C99A45] bg-[#173F35] flex items-center justify-center z-10 mb-6">
                        <div className="w-2 h-2 bg-[#C99A45] transition-all duration-300"/>
                      </div>
                      <div className="text-[#C99A45] text-[10px] font-sans tracking-wider uppercase mb-1">{item.period}</div>
                      <div className="text-white font-serif text-lg font-medium mb-2">{item.label}</div>
                      <p className="text-white/45 text-xs font-sans leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeSection>
                ))}
              </div>
            </div>

            {/* Mobile vertical */}
            <div className="lg:hidden space-y-4">
              {h.timeline.items.map((item, i) => (
                <FadeSection key={i} delay={i * 60}>
                  <div className="flex gap-5 items-start">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-7 h-7 border-2 border-[#C99A45] bg-[#173F35] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#C99A45]"/>
                      </div>
                      {i < h.timeline.items.length - 1 && <div className="w-px flex-1 bg-[#C99A45]/20 mt-2 min-h-[2rem]"/>}
                    </div>
                    <div className="pb-4">
                      <div className="text-[#C99A45] text-[10px] font-sans tracking-wider uppercase mb-1">{item.period}</div>
                      <div className="text-white font-serif text-lg font-medium mb-1">{item.label}</div>
                      <p className="text-white/45 text-xs font-sans leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>

            <FadeSection className="text-center mt-12 sm:mt-14">
              <Link to="/heritage/timeline" className="btn-outline border-[#C99A45]/45 text-[#C99A45] hover:bg-[#C99A45]/8">
                {h.timeline.cta}
              </Link>
            </FadeSection>
          </div>
        </section>

        {/* ════════════════════════════════════════
            EXPERIENCES
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="mb-10 sm:mb-14">
                <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.experiences.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35]">{h.experiences.title}</h2>
              </div>
            </FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {experiences.map((exp, i) => {
                const text = h.experiences.items[exp.id];
                return (
                  <FadeSection key={exp.id} delay={i * 60}>
                    <Link to={exp.to} className="group block bg-white heritage-card overflow-hidden h-full">
                      <div className="img-zoom aspect-video bg-[#173F35]/8">
                        <Photo src={'img' in exp ? exp.img : undefined} alt={text.title} className="w-full h-full object-cover"/>
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#173F35] mb-2">{text.title}</h3>
                        <p className="text-[#1D211E]/55 text-xs sm:text-sm font-sans leading-relaxed mb-4 line-clamp-2">{text.desc}</p>
                        <span className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                          {t.common.learnMore} <span>→</span>
                        </span>
                      </div>
                    </Link>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            EVENTS
        ════════════════════════════════════════ */}
        <section className="bg-[#1D211E] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 sm:mb-14">
                <div>
                  <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.events.eyebrow}</div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white">{h.events.title}</h2>
                  <p className="text-white/45 font-sans text-sm mt-3 max-w-lg leading-relaxed">{h.events.desc}</p>
                </div>
                <Link to="/events" className="text-[#C99A45] text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase hover:text-[#d9af65] transition-colors flex items-center gap-2 flex-shrink-0 group">
                  {h.events.all} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </FadeSection>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {events.map((ev, i) => {
                const text = h.events.items[ev.id];
                return (
                  <FadeSection key={ev.id} delay={i * 80}>
                    <div className="group bg-white/5 border border-white/10 hover:border-[#C99A45]/30 overflow-hidden transition-all duration-400">
                      <div className="img-zoom aspect-video bg-[#173F35]">
                        <Photo alt={text.name} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"/>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                          <span className="text-[#C99A45] text-xs font-sans tracking-wider">{text.date}</span>
                          <span className={`text-[10px] font-sans px-3 py-1 flex-shrink-0 ${ev.availKind === 'open' ? 'bg-[#173F35] text-[#C99A45]' : 'bg-[#A65A3A]/20 text-[#A65A3A]'}`}>
                            {text.avail}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-medium text-white mb-2">{text.name}</h3>
                        <p className="text-white/45 text-xs sm:text-sm font-sans leading-relaxed mb-5">{text.desc}</p>
                        <Link to="/events" className="btn-primary text-[10px] inline-flex">
                          {t.common.reserveYourPlace}
                        </Link>
                      </div>
                    </div>
                  </FadeSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            GUESTHOUSE
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="mb-10 sm:mb-14 text-center">
                <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.stay.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35]">{h.stay.title}</h2>
                <p className="text-[#1D211E]/55 font-sans text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">{h.stay.desc}</p>
              </div>
            </FadeSection>

            {/* Mobile: horizontal scroll cards */}
            <div className="scroll-smooth-x -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible pb-4 sm:pb-0">
              <div className="flex gap-4 sm:grid sm:grid-cols-3 w-[260%] sm:w-auto">
                {rooms.map((id, i) => {
                  const room = h.stay.rooms[id];
                  return (
                    <FadeSection key={id} delay={i * 80} className="snap-start w-[75vw] sm:w-auto flex-shrink-0">
                      <Link to="/stay" className="group block bg-white heritage-card overflow-hidden h-full">
                        <div className="img-zoom aspect-[4/3] bg-[#173F35]/8">
                          <Photo alt={room.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#173F35] mb-1.5">{room.name}</h3>
                          <p className="text-[#1D211E]/55 text-xs sm:text-sm font-sans leading-relaxed mb-3 line-clamp-2">{room.desc}</p>
                          <div className="text-[#C99A45] font-sans font-semibold text-sm mb-4">{room.price}</div>
                          <span className="text-[#173F35] text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                            {h.stay.viewRoom} <span>→</span>
                          </span>
                        </div>
                      </Link>
                    </FadeSection>
                  );
                })}
              </div>
            </div>

            <FadeSection className="text-center mt-10 sm:mt-12">
              <Link to="/stay" className="btn-primary bg-[#173F35] border-[#173F35] hover:bg-[#1e5447]">
                {h.stay.cta}
              </Link>
            </FadeSection>
          </div>
        </section>

        {/* ════════════════════════════════════════
            RESTAURANT — full bleed
        ════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
          <img src={photos.gardens} alt={t.photos.gardens} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f19]/96 via-[#0e2820]/80 to-transparent"/>
          <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="max-w-xl">
                <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{h.restaurant.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-5 sm:mb-6">{h.restaurant.title}</h2>
                <p className="text-white/65 font-sans text-sm sm:text-base leading-relaxed mb-7 sm:mb-8">
                  {h.restaurant.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                  {h.restaurant.categories.map((cat, i) => (
                    <span key={i} className="border border-white/25 text-white/65 text-[10px] sm:text-xs font-sans px-3 sm:px-4 py-1.5 sm:py-2 hover:border-[#C99A45]/60 hover:text-white transition-colors duration-300">
                      {cat}
                    </span>
                  ))}
                </div>
                <Link to="/dine" className="btn-primary">
                  {h.restaurant.cta}
                </Link>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ════════════════════════════════════════
            ORAL HISTORY
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <FadeSection>
                <div className="relative">
                  <div className="aspect-[3/4] bg-[#173F35]/8 overflow-hidden">
                    <Photo alt={h.stories.elderAlt} className="w-full h-full object-cover grayscale-[25%]"/>
                  </div>
                  {/* Audio card — repositioned for mobile */}
                  <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-5 lg:-right-5 bg-[#173F35] p-5 sm:p-6">
                    <div className="text-[#C99A45] font-sans text-[10px] tracking-wider uppercase mb-2">{h.stories.nowPlaying}</div>
                    <div className="text-white font-serif text-sm mb-3">{h.stories.storyTitle}</div>
                    <div className="flex items-end gap-0.5 mb-3 h-8">
                      {Array.from({ length: 28 }, (_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-[#C99A45]' : 'bg-[#C99A45]/40'}`}
                          style={{ height: `${20 + Math.sin(i * 0.9) * 10 + Math.cos(i * 1.3) * 8}px` }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-3 text-white/65 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 border border-[#C99A45] flex items-center justify-center group-hover:bg-[#C99A45]/15 transition-colors">
                        {isPlaying
                          ? <span className="flex gap-0.5"><span className="w-0.5 h-3 bg-[#C99A45]"/><span className="w-0.5 h-3 bg-[#C99A45]"/></span>
                          : <svg className="w-3 h-3 text-[#C99A45] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        }
                      </div>
                      <span className="text-xs font-sans">{isPlaying ? h.stories.pause : h.stories.play} · {h.stories.meta}</span>
                    </button>
                  </div>
                </div>
              </FadeSection>

              <FadeSection delay={120}>
                <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{h.stories.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35] leading-tight mb-5 sm:mb-6">{h.stories.title}</h2>
                <p className="text-[#1D211E]/65 font-sans text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                  {h.stories.p1}
                </p>
                <p className="text-[#1D211E]/50 font-sans text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
                  {h.stories.p2}
                </p>
                <div className="flex flex-wrap gap-2 mb-7 sm:mb-8">
                  {h.stories.languages.map((l, i) => (
                    <span key={i} className="border border-[#173F35]/20 text-[#173F35]/55 text-xs font-sans px-4 py-2 hover:border-[#173F35]/40 transition-colors">{l}</span>
                  ))}
                </div>
                <Link to="/heritage/stories" className="btn-outline border-[#173F35] text-[#173F35] hover:bg-[#173F35] hover:text-white">
                  {h.stories.cta}
                </Link>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            LIBRARY
        ════════════════════════════════════════ */}
        <section className="bg-[#173F35] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <FadeSection>
                <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4">{h.library.eyebrow}</div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-5 sm:mb-6">{h.library.title}</h2>
                <p className="text-white/65 font-sans text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                  {h.library.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                  {h.library.categories.map((cat, i) => (
                    <span key={i} className="border border-[#C99A45]/25 text-[#C99A45]/65 text-[10px] sm:text-xs font-sans px-3 py-1.5 hover:border-[#C99A45]/50 transition-colors">{cat}</span>
                  ))}
                </div>
                <Link to="/library" className="btn-primary">{h.library.cta}</Link>
              </FadeSection>

              <FadeSection delay={100}>
                <div className="grid grid-cols-2 gap-3">
                  {h.library.books.map((book, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 hover:border-[#C99A45]/25 transition-all duration-400 hover:bg-white/8">
                      <div className="w-full aspect-[3/4] bg-[#0e2820] mb-3 flex items-center justify-center pattern-weave relative overflow-hidden">
                        <svg className="w-7 h-7 text-[#C99A45]/35" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>
                      </div>
                      <div className="text-[#C99A45] text-[9px] font-sans tracking-wider uppercase mb-1">{book.cat}</div>
                      <div className="text-white text-xs font-sans font-medium leading-snug mb-1 line-clamp-2">{book.title}</div>
                      <div className="text-white/30 text-[10px] font-sans">{bookYears[i]}</div>
                    </div>
                  ))}
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            GALLERY
        ════════════════════════════════════════ */}
        <section className="bg-[#F6F1E7] py-12 sm:py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeSection>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 sm:mb-12">
                <div>
                  <div className="text-[#A65A3A] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-3 sm:mb-4">{h.gallery.eyebrow}</div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#173F35]">{h.gallery.title}</h2>
                </div>
                <Link to="/gallery" className="text-[#173F35] text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase hover:text-[#C99A45] transition-colors flex items-center gap-2 group">
                  {h.gallery.full} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </FadeSection>

            <div className="columns-2 lg:columns-4 gap-2 sm:gap-3 space-y-2 sm:space-y-3">
              {/* Real site photos */}
              {galleryPhotos.map((key) => (
                <div key={key} className="img-zoom break-inside-avoid bg-[#173F35]/8 cursor-pointer">
                  <img src={photos[key]} alt={t.photos[key]} className="w-full block" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════ */}
        <section className="relative py-24 sm:py-28 lg:py-36 overflow-hidden">
          <img src={photos.pavilions} alt={t.photos.pavilions} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-[#0a1f19]/82"/>
          <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeSection>
              <div className="text-[#C99A45] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-5 sm:mb-6">{h.final.eyebrow}</div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-5 sm:mb-6">
                {h.final.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/55 font-sans text-xs sm:text-sm mb-10 sm:mb-12">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C99A45] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {t.common.locationLine}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C99A45] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {t.common.hoursDaily}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C99A45] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  +251 XXX XXX XXX
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/visit" className="btn-primary justify-center">
                  {t.common.planVisit}
                </Link>
                <a href="#" className="btn-outline border-white/40 text-white hover:bg-white/8 justify-center">
                  {t.common.getDirections}
                </a>
              </div>
            </FadeSection>
          </div>
        </section>

      </main>

      {/* ── Mobile sticky CTA ── */}
      <div className={`mobile-sticky-cta lg:hidden ${showStickyCta ? '' : 'hidden-cta'}`} aria-hidden={!showStickyCta}>
        <Link to="/visit" className="flex-1 btn-primary justify-center py-3 text-[10px]">
          {t.common.planVisit}
        </Link>
        <Link to="/contact" className="flex-1 btn-outline border-white/30 text-white hover:bg-white/8 justify-center py-3 text-[10px]">
          {t.common.contactUs}
        </Link>
      </div>
    </>
  );
}
