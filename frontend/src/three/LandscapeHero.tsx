import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { createAmbience, type Ambience } from './ambience';
import type { Tier } from './device';
// stills of the scene's first moment, shown at once while the scene itself is fetched.
// If the scene changes, capture them again (the canvas alone, at 16:9 and on an upright phone).
import posterTall from './poster-tall.webp';
import posterWide from './poster-wide.webp';

/** The 3D drawing library is large: it is fetched only here, after the page is up */
const LandscapeScene = lazy(() => import('./LandscapeScene'));

type Props = {
  tier: Exclude<Tier, 'none'>;
  /** Check the drawing speed and call `onTooSlow` if the device cannot keep up */
  watchSpeed: boolean;
  onTooSlow: () => void;
};

/**
 * The home page opening as a journey: a drawn landscape fills the screen with
 * the name, a line and two buttons over its lower part. Scrolling walks down
 * through the trees to the houses while the light turns from sunrise to golden
 * hour; then the page carries on.
 *
 * The section is taller than the screen and the picture stays pinned while it
 * is scrolled through. `--journey` (0 to 1) on the section says how far.
 */
export default function LandscapeHero({ tier, watchSpeed, onTooSlow }: Props) {
  const { t } = useI18n();
  const h = t.home.hero;
  const track = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [fetch3d, setFetch3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [firstWord, ...rest] = h.title.split(' ');

  // nature sounds: off until asked for, and silent again when the page is left or hidden
  const [sound, setSound] = useState(false);
  const ambience = useRef<Ambience | null>(null);
  useEffect(() => {
    if (!sound) return;
    ambience.current ??= createAmbience();
    const player = ambience.current;
    player.start();
    const onHide = () => (document.hidden ? player.stop() : player.start());
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      player.stop();
    };
  }, [sound]);

  // wait until the page itself has loaded before fetching the scene
  useEffect(() => {
    let timer = 0;
    const start = () => { timer = window.setTimeout(() => setFetch3d(true), 150); };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', start);
    };
  }, []);

  // nothing is drawn while the scene is off screen
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const watcher = new IntersectionObserver(([entry]) => setOnScreen(entry?.isIntersecting ?? true));
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <section ref={track} className="landscape-hero relative" aria-label={h.title}>
      <div
        ref={frame}
        className="sticky top-16 sm:top-[72px] lg:top-0 h-[calc(100svh-4rem)] sm:h-[calc(100svh-72px)] lg:h-[100svh] min-h-[520px] overflow-hidden bg-[#E3EBD8]"
      >
        {/* a still of the scene until the scene has drawn itself */}
        <picture aria-hidden="true">
          <source media="(orientation: portrait)" srcSet={posterTall} />
          <img src={posterWide} alt="" fetchPriority="high" className="landscape-poster absolute inset-0 w-full h-full object-cover" />
        </picture>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
          {fetch3d && (
            <Suspense fallback={null}>
              <LandscapeScene track={track} tier={tier} active={onScreen} watchSpeed={watchSpeed} onReady={() => setReady(true)} onTooSlow={onTooSlow} />
            </Suspense>
          )}
        </div>

        {/* a faint shade behind the header words on computers */}
        <span className="hidden lg:block absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />

        {/* nature sounds, off until switched on */}
        <button
          type="button"
          onClick={() => setSound((on) => !on)}
          aria-pressed={sound}
          aria-label={h.sound}
          title={h.sound}
          className="hit-slim absolute z-[2] right-3 top-3 sm:right-5 sm:top-5 lg:right-8 lg:top-[100px] grid place-items-center w-10 h-10 rounded-full bg-white/85 backdrop-blur-md text-[#1E3A29] hover:bg-white transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
            {sound ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="m16 9.5 5 5m0-5-5 5" />}
          </svg>
        </button>

        {/* the words, on a wash of the page colour that rises from the bottom */}
        <div className="journey-words absolute inset-x-0 bottom-0">
          <span className="absolute inset-x-0 bottom-0 -top-28 bg-gradient-to-t from-[#F4EFE4] from-[58%] via-[#F4EFE4]/80 via-[78%] to-transparent" />
          <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 pb-6 sm:pb-9 lg:pb-10">
            <h1 className="hero-name brand-sign brand-3d whitespace-nowrap leading-[1] mb-4 lg:mb-6">
              <span className="line-mask"><span>{firstWord}</span></span>{' '}
              <span className="line-mask d2"><span>{rest.join(' ')}</span></span>
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-12 animate-fade-up delay-300">
              <div className="max-w-xl">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E3A29] leading-tight tracking-tight">{h.walk}</p>
                <p className="hidden sm:block text-[#1E3A29]/70 leading-relaxed mt-3">{h.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <Link to="/stay#book" className="btn-primary">{h.book}</Link>
                <Link to="/heritage" className="btn-outline text-[#1E3A29]">{h.heritage}</Link>
              </div>
            </div>
            <p className="hidden lg:flex items-center gap-2 mt-7 text-[#1E3A29]/55 text-xs font-bold tracking-[0.18em] uppercase">
              <span className="w-8 h-px bg-[#1E3A29]/30" />
              {h.scroll}
            </p>
          </div>
        </div>

        {/* a thin soft edge joins the picture to the page */}
        <span className="absolute inset-x-0 bottom-0 h-10 lg:h-16 bg-gradient-to-t from-[#F4EFE4] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
