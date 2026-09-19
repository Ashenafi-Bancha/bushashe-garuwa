import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Lenis from 'lenis';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Smooth scrolling (Lenis) ─────────────────────────────── */

let lenis: Lenis | null = null;

/** Start buttery smooth scrolling for the whole page. Returns a cleanup function. */
export function startSmoothScroll() {
  if (reducedMotion() || lenis) return () => {};
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), autoRaf: true });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Jump to the top instantly (used on page change). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Pause page scrolling while a full-screen menu or dialog is open. */
export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start());
  document.body.style.overflow = locked ? 'hidden' : '';
}

/* ── 3D tilt card ──────────────────────────────────────────── */

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees */
  max?: number;
  style?: CSSProperties;
};

/**
 * Tilts its content in 3D toward the pointer, with a soft light sheen.
 * Does nothing on touch screens or when the visitor prefers reduced motion.
 */
export function Tilt({ children, className = '', max = 7, style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.dataset.active = 'true';
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.dataset.active = 'false';
  };

  return (
    <div ref={ref} className={`tilt ${className}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      <span className="tilt-sheen" aria-hidden="true" />
    </div>
  );
}

/* ── Parallax ──────────────────────────────────────────────── */

/** Scroll position (px), updated once per animation frame — for gentle parallax effects. */
export function useScrollY(limit = Infinity) {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setY(Math.min(window.scrollY, limit)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [limit]);
  return y;
}

/* ── Automatic scroll reveal for inner pages ───────────────── */

/**
 * On every page except Home (which reveals its own content), each section after
 * the first rises into view in 3D as it is scrolled to.
 */
export function useAutoReveal(pathname: string) {
  useEffect(() => {
    if (pathname === '/' || reducedMotion()) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(:first-child)'));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    sections.forEach((el) => {
      el.classList.add('reveal');
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);
}
