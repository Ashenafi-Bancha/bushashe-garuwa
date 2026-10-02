import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { photos, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

const RING: PhotoKey[] = ['gate', 'meeshsho', 'home', 'house', 'gifaataa1', 'food', 'pavilions', 'gifaataa2', 'gardens', 'zigba', 'lawn', 'enset'];

/** Photograph width in the ring, per screen size */
const cardWidth = (viewport: number) => (viewport < 640 ? 250 : viewport < 1024 ? 260 : 320);
/** Height of a card for its width: landscape on phones, so the whole photograph shows; portrait elsewhere */
const cardShape = (viewport: number) => (viewport < 640 ? 2 / 3 : 1.45);

/**
 * The grounds as a ring of photographs standing in 3D space: it turns by itself,
 * and can be dragged or swiped. The face nearest the viewer is the one in focus.
 *
 * Built from CSS 3D transforms, so it costs no extra download, and it settles
 * into a plain row of photographs when someone has asked for less motion.
 */
export default function PhotoRing() {
  const { t } = useI18n();
  const ring = t.home.ring;
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [radius, setRadius] = useState(520);
  const [width, setWidth] = useState(320);
  const [shape, setShape] = useState(1.45);
  const [stillMode, setStillMode] = useState(false);
  const drag = useRef<{ x: number; angle: number } | null>(null);
  const frame = useRef(0);
  const holder = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  const step = 360 / RING.length;

  useEffect(() => {
    const measure = () => {
      const viewport = window.innerWidth;
      const w = cardWidth(viewport);
      setWidth(w);
      setShape(cardShape(viewport));
      // the ring is wide enough that neighbouring photographs never overlap
      setRadius(Math.round((w * 1.25) / (2 * Math.tan(Math.PI / RING.length))));
    };
    measure();
    window.addEventListener('resize', measure);
    setStillMode(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // nothing turns while the ring is out of sight, or the tab is in the background
  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const watcher = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)), { threshold: 0.15 });
    watcher.observe(element);
    const onVisibility = () => setOnScreen(document.visibilityState === 'visible' && Boolean(element.getBoundingClientRect().bottom > 0));
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      watcher.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // turns slowly on its own until someone takes hold of it
  useEffect(() => {
    if (stillMode || dragging || !onScreen) return;
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = now - last;
      last = now;
      setAngle((current) => current - elapsed * 0.0055);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [stillMode, dragging, onScreen]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      drag.current = { x: e.clientX, angle };
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [angle],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    setAngle(drag.current.angle + (e.clientX - drag.current.x) * 0.25);
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
    setDragging(false);
  }, []);

  const turn = (direction: -1 | 1) => setAngle((current) => current + direction * step);

  /** Which photograph is facing the viewer, so its name can be shown */
  const facing = useMemo(() => {
    const normalized = ((-angle % 360) + 360) % 360;
    return RING[Math.round(normalized / step) % RING.length]!;
  }, [angle, step]);

  if (stillMode) {
    return (
      <section className="py-20 sm:py-28">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] mb-8">{ring.title}</h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {RING.map((key) => (
              <img key={key} src={photos[key]} alt={t.photos[key]} loading="lazy" className="rounded-2xl w-full sm:aspect-[3/4] sm:object-cover" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      
      

      <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 text-center mb-10 sm:mb-14">
        <span className="eyebrow mb-5">{ring.eyebrow}</span>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[0.98]">{ring.title}</h2>
        <p className="text-[#1E3A29]/60 mt-5 max-w-xl mx-auto text-base sm:text-lg">{ring.desc}</p>
      </div>

      <div
        ref={holder}
        className="relative select-none"
        style={{ perspective: '1400px', height: `${Math.round(width * shape)}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className={`absolute inset-0 mx-auto ${dragging ? '' : 'transition-transform duration-500 ease-out'}`}
          style={{
            width: `${width}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${angle}deg)`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          {RING.map((key, i) => (
            <figure
              key={key}
              className="absolute inset-0 rounded-[1.75rem] overflow-hidden shadow-[0_40px_80px_-34px_rgba(19,38,26,0.7)]"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
            >
              <img
                src={photos[key]}
                alt={t.photos[key]}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-contain sm:object-cover bg-[#13261A] pointer-events-none"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute left-4 right-4 bottom-4 text-left text-white font-display text-lg leading-tight">
                {t.photoCaptions[key].title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => turn(1)} aria-label={ring.previous} className="w-12 h-12 rounded-full bg-white text-[#1E3A29] text-xl elev-1 hover:bg-[#0E8A50] hover:text-white transition-colors">
            ‹
          </button>
          <span className="text-[#1E3A29]/60 text-sm min-w-[12rem] text-center">{t.photoCaptions[facing].title}</span>
          <button type="button" onClick={() => turn(-1)} aria-label={ring.next} className="w-12 h-12 rounded-full bg-white text-[#1E3A29] text-xl elev-1 hover:bg-[#0E8A50] hover:text-white transition-colors">
            ›
          </button>
        </div>
        <Link to="/gallery" className="btn-primary">{ring.cta}</Link>
      </div>
      <p className="relative text-center text-[#1E3A29]/40 text-xs mt-5">{ring.hint}</p>
    </section>
  );
}
