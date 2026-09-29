import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { startSmoothScroll } from '../lib/motion';

/**
 * Three design directions for the client to choose from, shown on one hidden
 * page (/directions). Each is a hero and one section, fully animated, using
 * the real photographs. Not linked from the site and not indexed.
 */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Anton&family=DM+Sans:wght@400;500;700&display=swap';

const TITLE = 'Bushaashe Garuwa';
const TAGLINE = 'Where Wolaita culture, traditions and heritage live on.';

const places: { key: PhotoKey; title: string; text: string }[] = [
  { key: 'house', title: 'The Great House', text: 'A traditional Wolaita house, raised by hand and kept by four generations.' },
  { key: 'zigba', title: 'The Zigba Line', text: 'Ancient trees standing in a quiet row along the way in.' },
  { key: 'food', title: 'Cultural Food', text: 'Twice a month, a table of Wolaita dishes with Lidya Cultural Food.' },
  { key: 'gifaataa2', title: 'Gifaataa', text: 'The Wolaita new year, celebrated on the grounds with song and dance.' },
  { key: 'lawn', title: 'The Great Lawn', text: 'Open green under the big tree, made for families and gatherings.' },
  { key: 'enset', title: 'Enset', text: 'The false banana at the heart of Wolaita food and life.' },
];

/* ─────────────── small shared helpers ─────────────── */

/** Adds `in` to elements marked data-reveal when they scroll into view */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.18 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Scroll progress (0 → 1) of an element through the viewport, as a CSS variable */
function useProgress<T extends HTMLElement>(varName = '--p') {
  const ref = useRef<T>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : Math.min(1, Math.max(0, 1 - r.top / window.innerHeight));
        el.style.setProperty(varName, p.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [varName]);
  return ref;
}

/** Letters that rise one after another */
function Letters({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="ltr-mask">
          <span className="ltr" style={{ animationDelay: `${delay + i * 45}ms` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/** A card that tilts toward the pointer in 3D, with a moving glare */
function Tilt({ children, className = '', max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>
      {children}
      <span className="tilt-glare" />
    </div>
  );
}

/* ─────────────── A · Cinematic ─────────────── */

function Cinematic() {
  const stage = useRef<HTMLDivElement>(null);
  const rail = useProgress<HTMLElement>();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = stage.current;
      if (!el) return;
      el.style.setProperty('--mx', String(e.clientX / window.innerWidth - 0.5));
      el.style.setProperty('--my', String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="dA" id="a">
      <section className="dA-hero" ref={stage}>
        <img src={photos.house} alt="" className="dA-bg" />
        <div className="dA-shade" />
        <div className="dA-grain" />

        <div className="dA-copy">
          <p className="dA-kicker"><span />Wolaita · Ethiopia</p>
          <h1 className="dA-title"><Letters text="Bushaashe" delay={200} /><br /><em><Letters text="Garuwa" delay={650} /></em></h1>
          <p className="dA-sub">{TAGLINE}</p>
          <div className="dA-ctas">
            <a className="dA-btn">Plan your visit</a>
            <a className="dA-link">Watch the story <span>→</span></a>
          </div>
        </div>

        {/* three photographs floating in depth, turning with the pointer */}
        <div className="dA-float">
          {(['zigba', 'gifaataa2', 'food'] as PhotoKey[]).map((k, i) => (
            <figure key={k} className={`dA-card dA-card${i}`}>
              <img src={photos[k]} alt="" />
            </figure>
          ))}
        </div>

        <div className="dA-scroll">Scroll<span /></div>
      </section>

      {/* sideways gallery, pinned while you scroll */}
      <section className="dA-rail" ref={rail}>
        <div className="dA-rail-sticky">
          <div className="dA-rail-head">
            <p className="dA-kicker"><span />Explore the grounds</p>
            <h2>Four generations,<br /><em>one living place</em></h2>
          </div>
          <div className="dA-track">
            {places.map((p, i) => (
              <article key={p.key} className="dA-slide">
                <div className="dA-slide-img"><img src={photos[p.key]} alt="" /></div>
                <div className="dA-slide-num">0{i + 1}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────── B · Living Earth ─────────────── */

function LivingEarth() {
  const hero = useProgress<HTMLElement>();
  return (
    <div className="dB" id="b">
      <section className="dB-hero" ref={hero}>
        <div className="dB-sticky">
          <div className="dB-top">
            <h1 className="dB-title">
              <span data-reveal className="dB-line"><span>Where heritage</span></span>
              <span data-reveal className="dB-line d2"><span>grows <i>green</i></span></span>
            </h1>
            <div className="dB-side" data-reveal>
              <p>{TAGLINE} A family place in Damot Sore, near Gununo, kept for four generations.</p>
              <a className="dB-btn">Plan your visit <b>→</b></a>
            </div>
          </div>

          {/* the photograph opens out to the edges as you scroll */}
          <div className="dB-framewrap">
          <div className="dB-frame">
            <img src={photos.home} alt="" />
          </div>
            <svg className="dB-badge" viewBox="0 0 200 200" aria-hidden>
              <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#circ">WOLAITA · HERITAGE · NATURE · CULTURE · </textPath></text>
              <circle cx="100" cy="100" r="30" />
            </svg>
          </div>
        </div>
      </section>

      <div className="dB-marquee" aria-hidden>
        <div>{Array.from({ length: 2 }, (_, i) => <span key={i}>Heritage ✦ Nature ✦ Culture ✦ Food ✦ Gifaataa ✦ Stay ✦&nbsp;</span>)}</div>
      </div>

      <section className="dB-cards">
        <div className="dB-cards-head" data-reveal>
          <span className="dB-pill">Discover</span>
          <h2>Everything at<br />Bushaashe Garuwa</h2>
        </div>
        <div className="dB-stack">
          {places.slice(0, 4).map((p, i) => (
            <div key={p.key} className="dB-stack-item" style={{ '--i': i } as CSSProperties}>
              <Tilt className="dB-card" max={8}>
                <img src={photos[p.key]} alt="" />
                <div className="dB-card-body">
                  <span className="dB-num">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <a className="dB-btn small">Explore <b>→</b></a>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── C · Wolaita Weave ─────────────── */

function Weave() {
  const [spin, setSpin] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const ring: PhotoKey[] = ['house', 'gifaataa1', 'zigba', 'food', 'gifaataa2', 'lawn', 'enset', 'gifaataa3'];

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!drag.current) setSpin((s) => s - 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="dC" id="c">
      <section className="dC-hero">
        <div className="dC-weave" aria-hidden />
        <div className="dC-copy">
          <p className="dC-kicker">Damot Sore · Wolaita · Ethiopia</p>
          <h1 className="dC-title">
            <span className="r1"><Letters text="BUSHAASHE" delay={150} /></span>
            <span className="r2"><Letters text="GARUWA" delay={600} /></span>
          </h1>
          <p className="dC-sub">{TAGLINE}</p>
          <div className="dC-ctas">
            <a className="dC-btn">Plan your visit</a>
            <a className="dC-btn ghost">Book cultural food</a>
          </div>
        </div>

        {/* a ring of photographs turning in 3D; drag to spin it */}
        <div
          className="dC-scene"
          onPointerDown={(e) => { drag.current = { x: e.clientX, start: spin }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (drag.current) setSpin(drag.current.start + (e.clientX - drag.current.x) * 0.35); }}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
        >
          <div className="dC-ring" style={{ transform: `translateZ(calc(var(--r) * -1)) rotateY(${spin}deg)` }}>
            {ring.map((k, i) => (
              <figure key={k} style={{ transform: `rotateY(${i * 45}deg) translateZ(var(--r))` }}>
                <img src={photos[k]} alt="" draggable={false} />
              </figure>
            ))}
          </div>
          <p className="dC-hint">Drag to turn</p>
        </div>
      </section>

      <div className="dC-band" aria-hidden />

      <section className="dC-grid">
        <div className="dC-grid-head" data-reveal>
          <h2>FOUR WORLDS<br /><span>IN ONE PLACE</span></h2>
          <p>Heritage houses, ancient trees, Wolaita food and the Gifaataa celebration, all on one family ground.</p>
        </div>
        <div className="dC-cards">
          {places.slice(0, 6).map((p, i) => (
            <article key={p.key} data-reveal className="dC-card" style={{ transitionDelay: `${(i % 3) * 120}ms` }}>
              <img src={photos[p.key]} alt="" />
              <div className="dC-card-body">
                <span>0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── the page ─────────────── */

export default function Directions() {
  useReveal();
  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS;
    document.head.appendChild(link);
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    document.title = 'Design directions · Bushaashe Garuwa';
    return () => { link.remove(); robots.remove(); };
  }, []);

  return (
    <div className="dirs">
      <style>{CSS}</style>
      <nav className="dirs-bar">
        <strong>{TITLE}</strong>
        <span>Design directions</span>
        <a href="#a">A · Cinematic</a>
        <a href="#b">B · Living Earth</a>
        <a href="#c">C · Wolaita Weave</a>
      </nav>
      <Label letter="A" name="Cinematic" note="Black, film-like, elegant serif, gold. Photos float in 3D and follow the mouse; the gallery slides sideways as you scroll." />
      <Cinematic />
      <Label letter="B" name="Living Earth" note="Warm ivory and forest green, bold modern type. The photo opens out as you scroll; cards tilt in 3D and stack." />
      <LivingEarth />
      <Label letter="C" name="Wolaita Weave" note="The red, yellow and black of the Wolaita scarf. Woven stripes move; a 3D ring of photos turns (drag it); cards flip in." />
      <Weave />
      <div className="dirs-end">Tell me A, B or C, or which parts you like from each.</div>
    </div>
  );
}

function Label({ letter, name, note }: { letter: string; name: string; note: string }) {
  return (
    <div className="dirs-label">
      <span className="dirs-letter">{letter}</span>
      <div><strong>{name}</strong><p>{note}</p></div>
    </div>
  );
}

/* ─────────────── styles, scoped by prefix ─────────────── */

const CSS = String.raw`
.dirs { background:#0b0b0b; overflow-x:clip; }
.dirs a { cursor:pointer; }
.dirs-bar { position:sticky; top:0; z-index:50; display:flex; gap:18px; align-items:center; flex-wrap:wrap;
  padding:12px 22px; background:rgba(12,12,12,.82); backdrop-filter:blur(14px); color:#fff; font:500 13px 'Manrope',sans-serif; }
.dirs-bar strong { font-weight:700; }
.dirs-bar span { color:#888; margin-right:auto; }
.dirs-bar a { color:#ddd; text-decoration:none; padding:6px 12px; border:1px solid #333; border-radius:99px; transition:.3s; }
.dirs-bar a:hover { background:#fff; color:#111; }
.dirs-label { display:flex; gap:18px; align-items:center; padding:28px 22px; background:#111; color:#fff; border-top:1px solid #222;
  font-family:'Manrope',sans-serif; }
.dirs-label p { margin:4px 0 0; color:#9a9a9a; font-size:14px; max-width:760px; }
.dirs-letter { width:52px; height:52px; border-radius:50%; display:grid; place-items:center; background:#fff; color:#111; font:800 22px 'Manrope'; flex:none; }
.dirs-end { padding:60px 22px; text-align:center; color:#bbb; font:500 16px 'Manrope',sans-serif; background:#111; }

.ltr-mask { display:inline-block; overflow:hidden; vertical-align:bottom; padding-bottom:.06em; }
.ltr { display:inline-block; transform:translateY(110%) rotate(8deg); animation:ltrUp 1s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes ltrUp { to { transform:none; } }

.tilt { position:relative; transform:perspective(1000px) rotateX(var(--rx,0)) rotateY(var(--ry,0)); transition:transform .4s cubic-bezier(.2,.8,.2,1); transform-style:preserve-3d; will-change:transform; }
.tilt-glare { pointer-events:none; position:absolute; inset:0; border-radius:inherit;
  background:radial-gradient(circle at var(--gx,50%) var(--gy,0%), rgba(255,255,255,.35), transparent 45%); opacity:0; transition:opacity .3s; }
.tilt:hover .tilt-glare { opacity:1; }

/* A · Cinematic */
.dA { --ink:#0B0A08; --ivory:#F3EBDD; --gold:#C9A35B; background:var(--ink); color:var(--ivory); font-family:'Manrope',sans-serif; }
.dA-hero { position:relative; min-height:100svh; display:grid; grid-template-columns:1.1fr 1fr; align-items:center; padding:120px 6vw 80px; overflow:hidden; }
.dA-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.42;
  transform:translate(calc(var(--mx,0)*-24px), calc(var(--my,0)*-16px)) scale(1.1); animation:kb 24s ease-in-out infinite alternate; }
@keyframes kb { from { scale:1 } to { scale:1.12 } }
.dA-shade { position:absolute; inset:0; background:linear-gradient(90deg, var(--ink) 18%, rgba(11,10,8,.55) 55%, rgba(11,10,8,.2)), linear-gradient(0deg, var(--ink), transparent 40%); }
.dA-grain { position:absolute; inset:0; opacity:.08; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.dA-copy { position:relative; z-index:2; }
.dA-kicker { display:flex; align-items:center; gap:12px; color:var(--gold); font-size:12px; letter-spacing:.32em; text-transform:uppercase; margin:0 0 28px; }
.dA-kicker span { width:44px; height:1px; background:var(--gold); }
.dA-title { font-family:'Cormorant Garamond',serif; font-weight:500; font-size:clamp(3.6rem,8.4vw,8.6rem); line-height:.9; margin:0; letter-spacing:-.01em; }
.dA-title em { color:var(--gold); font-style:italic; }
.dA-sub { max-width:460px; color:rgba(243,235,221,.72); font-size:18px; line-height:1.7; margin:30px 0 40px; opacity:0; animation:fadeUp 1s 1.2s forwards; }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
.dA-ctas { display:flex; gap:28px; align-items:center; opacity:0; animation:fadeUp 1s 1.45s forwards; }
.dA-btn { position:relative; padding:17px 34px; border-radius:99px; color:var(--ink); background:var(--ivory); font-weight:700; font-size:14px; overflow:hidden; isolation:isolate; }
.dA-btn::before { content:''; position:absolute; inset:0; background:var(--gold); transform:translateY(101%); transition:transform .5s cubic-bezier(.2,.8,.2,1); z-index:-1; }
.dA-btn:hover::before { transform:none; }
.dA-link { color:var(--ivory); font-weight:600; font-size:14px; border-bottom:1px solid rgba(243,235,221,.3); padding-bottom:4px; }
.dA-link span { display:inline-block; transition:transform .3s; } .dA-link:hover span { transform:translateX(6px); }
.dA-float { position:relative; z-index:2; height:560px; perspective:1400px; }
.dA-card { position:absolute; margin:0; border-radius:18px; overflow:hidden; box-shadow:0 40px 80px -20px rgba(0,0,0,.8), 0 0 0 1px rgba(201,163,91,.25);
  transform-style:preserve-3d; transition:transform .6s cubic-bezier(.2,.8,.2,1); animation:bob 7s ease-in-out infinite; }
.dA-card img { width:100%; height:100%; object-fit:cover; display:block; }
.dA-card0 { width:58%; height:72%; left:4%; top:12%; transform:rotateY(calc(var(--mx,0)*26deg + 14deg)) rotateX(calc(var(--my,0)*-18deg)) translateZ(40px); }
.dA-card1 { width:42%; height:48%; right:2%; top:0; transform:rotateY(calc(var(--mx,0)*34deg - 10deg)) rotateX(calc(var(--my,0)*-22deg + 6deg)) translateZ(140px); animation-delay:-2s; }
.dA-card2 { width:40%; height:42%; right:10%; bottom:0; transform:rotateY(calc(var(--mx,0)*30deg - 18deg)) rotateX(calc(var(--my,0)*-20deg - 4deg)) translateZ(220px); animation-delay:-4s; }
@keyframes bob { 50% { translate:0 -14px } }
.dA-scroll { position:absolute; bottom:26px; left:50%; translate:-50% 0; font-size:11px; letter-spacing:.3em; text-transform:uppercase; color:rgba(243,235,221,.5); display:flex; flex-direction:column; align-items:center; gap:10px; z-index:2; }
.dA-scroll span { width:1px; height:44px; background:linear-gradient(var(--gold),transparent); animation:drop 2s infinite; transform-origin:top; }
@keyframes drop { 0% { scale:1 0 } 50% { scale:1 1 } 100% { scale:1 1; opacity:0 } }
.dA-rail { height:320vh; position:relative; }
.dA-rail-sticky { position:sticky; top:0; height:100svh; overflow:hidden; display:flex; flex-direction:column; justify-content:center; gap:48px; }
.dA-rail-head { padding:0 6vw; }
.dA-rail-head h2 { font-family:'Cormorant Garamond',serif; font-weight:500; font-size:clamp(2.6rem,5vw,4.8rem); line-height:1; margin:0; }
.dA-rail-head em { color:var(--gold); }
.dA-track { display:flex; gap:32px; padding-left:6vw; transform:translateX(calc(var(--p,0) * -1 * (6 * 420px - 70vw))); will-change:transform; }
.dA-slide { flex:none; width:388px; }
.dA-slide-img { height:300px; border-radius:16px; overflow:hidden; margin-bottom:20px; }
.dA-slide-img img { width:100%; height:100%; object-fit:cover; transition:transform 1.2s cubic-bezier(.2,.8,.2,1); }
.dA-slide:hover img { transform:scale(1.08); }
.dA-slide-num { color:var(--gold); font-family:'Cormorant Garamond',serif; font-style:italic; font-size:22px; }
.dA-slide h3 { font-family:'Cormorant Garamond',serif; font-weight:600; font-size:32px; margin:4px 0 8px; }
.dA-slide p { color:rgba(243,235,221,.62); line-height:1.65; margin:0; font-size:15px; }

/* B · Living Earth */
.dB { --paper:#F4EFE4; --forest:#1E3A29; --moss:#86A94F; --clay:#C4622D; background:var(--paper); color:var(--forest); font-family:'Bricolage Grotesque',sans-serif; }
.dB-hero { height:210vh; position:relative; }
.dB-sticky { position:sticky; top:0; height:100svh; display:flex; flex-direction:column; padding:96px 5vw 5vh; gap:4vh; overflow:hidden; }
.dB-top { display:flex; justify-content:space-between; align-items:flex-end; gap:40px; }
.dB-title { margin:0; font-weight:800; font-size:clamp(3rem,7.6vw,8rem); line-height:.92; letter-spacing:-.045em; }
.dB-title i { font-style:normal; color:var(--moss); }
.dB-line { display:block; overflow:hidden; }
.dB-line > span { display:inline-block; transform:translateY(105%); transition:transform 1.1s cubic-bezier(.2,.8,.2,1); }
.dB-line.d2 > span { transition-delay:.12s; }
.dB-line.in > span { transform:none; }
.dB-side { max-width:340px; opacity:0; transform:translateY(20px); transition:1s .4s cubic-bezier(.2,.8,.2,1); }
.dB-side.in { opacity:1; transform:none; }
.dB-side p { font:400 16px/1.65 'Manrope',sans-serif; color:rgba(30,58,41,.72); margin:0 0 22px; }
.dB-btn { display:inline-flex; align-items:center; gap:12px; background:var(--forest); color:var(--paper); padding:8px 8px 8px 24px; border-radius:99px; font:600 14px 'Manrope',sans-serif; transition:.4s; }
.dB-btn b { width:38px; height:38px; border-radius:50%; display:grid; place-items:center; background:var(--moss); color:var(--forest); transition:transform .4s; }
.dB-btn:hover b { transform:rotate(-45deg); }
.dB-btn.small { padding:6px 6px 6px 18px; font-size:13px; } .dB-btn.small b { width:32px; height:32px; }
.dB-framewrap { position:relative; flex:1; min-height:0; }
.dB-frame { position:absolute; inset:0; border-radius:calc(40px - var(--p,0) * 40px);
  clip-path:inset(0 calc(22% - var(--p,0) * 22%) 0 calc(22% - var(--p,0) * 22%) round calc(40px - var(--p,0) * 16px)); }
.dB-frame img { width:100%; height:100%; object-fit:cover; transform:scale(calc(1.25 - var(--p,0) * .25)); }
.dB-badge { position:absolute; right:calc(24% - var(--p,0) * 20%); top:-60px; width:150px; height:150px; animation:spin 16s linear infinite; }
.dB-badge text { font:700 15px 'Manrope',sans-serif; letter-spacing:.28em; fill:var(--forest); }
.dB-badge circle { fill:var(--clay); }
@keyframes spin { to { rotate:360deg } }
.dB-marquee { overflow:hidden; background:var(--forest); color:var(--paper); padding:22px 0; transform:rotate(-2deg) scale(1.05); margin:40px 0; }
.dB-marquee div { display:flex; width:max-content; animation:marq 26s linear infinite; font-weight:700; font-size:clamp(1.6rem,3vw,2.6rem); letter-spacing:-.02em; }
@keyframes marq { to { transform:translateX(-50%) } }
.dB-cards { padding:80px 5vw 140px; }
.dB-cards-head { text-align:center; margin-bottom:60px; opacity:0; transform:translateY(30px); transition:1s cubic-bezier(.2,.8,.2,1); }
.dB-cards-head.in { opacity:1; transform:none; }
.dB-pill { display:inline-block; padding:8px 18px; border-radius:99px; background:rgba(134,169,79,.2); font:600 13px 'Manrope'; margin-bottom:18px; }
.dB-cards-head h2 { margin:0; font-weight:800; font-size:clamp(2.4rem,5vw,4.6rem); line-height:.95; letter-spacing:-.04em; }
.dB-stack { max-width:1000px; margin:0 auto; }
.dB-stack-item { position:sticky; top:calc(90px + var(--i) * 26px); margin-bottom:40px; }
.dB-card { display:grid; grid-template-columns:1.1fr 1fr; background:#fff; border-radius:32px; overflow:hidden; min-height:380px; box-shadow:0 30px 60px -30px rgba(30,58,41,.45); }
.dB-card img { width:100%; height:100%; object-fit:cover; }
.dB-card-body { padding:44px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; }
.dB-num { font:600 13px 'Manrope'; color:var(--clay); margin-bottom:14px; }
.dB-card h3 { margin:0 0 12px; font-weight:800; font-size:38px; letter-spacing:-.03em; line-height:1; }
.dB-card p { font:400 16px/1.65 'Manrope',sans-serif; color:rgba(30,58,41,.7); margin:0 0 26px; }

/* C · Wolaita Weave */
.dC { --coal:#15110E; --red:#C8342B; --sun:#F2B233; --cream:#F6EEDC; background:var(--coal); color:var(--cream); font-family:'DM Sans',sans-serif; }
.dC-hero { position:relative; min-height:100svh; display:grid; grid-template-columns:1fr 1.05fr; align-items:center; padding:110px 5vw 60px; overflow:hidden; }
.dC-weave { position:absolute; inset:-40%; opacity:.09; rotate:-18deg;
  background:repeating-linear-gradient(90deg, var(--red) 0 22px, var(--sun) 22px 34px, #000 34px 50px, var(--cream) 50px 54px, #000 54px 70px);
  animation:weave 30s linear infinite; }
@keyframes weave { to { transform:translateX(280px) } }
.dC-copy { position:relative; z-index:2; }
.dC-hero::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 25% 50%, rgba(21,17,14,.85), transparent 60%); pointer-events:none; }
.dC-kicker { font-weight:700; font-size:12px; letter-spacing:.3em; color:var(--sun); margin:0 0 20px; }
.dC-title { margin:0; font-family:'Anton',sans-serif; font-weight:400; font-size:clamp(4rem,10vw,10.5rem); line-height:.86; letter-spacing:.005em; }
.dC-title > span { display:block; }
.dC-title .r2 { color:transparent; -webkit-text-stroke:2px var(--sun); }
.dC-title .r2 .ltr { background:linear-gradient(90deg,var(--sun),var(--red)); -webkit-background-clip:text; background-clip:text; }
.dC-sub { max-width:420px; font-size:18px; line-height:1.65; color:rgba(246,238,220,.75); margin:28px 0 36px; opacity:0; animation:fadeUp 1s 1.2s forwards; }
.dC-ctas { display:flex; gap:14px; flex-wrap:wrap; opacity:0; animation:fadeUp 1s 1.4s forwards; }
.dC-btn { padding:16px 28px; background:var(--red); color:var(--cream); font-weight:700; font-size:14px; letter-spacing:.06em; text-transform:uppercase; border-radius:4px; box-shadow:6px 6px 0 var(--sun); transition:.25s; }
.dC-btn:hover { transform:translate(-3px,-3px); box-shadow:9px 9px 0 var(--sun); }
.dC-btn.ghost { background:transparent; border:2px solid var(--cream); box-shadow:6px 6px 0 var(--red); }
.dC-scene { --r:420px; position:relative; z-index:2; height:560px; perspective:1300px; cursor:grab; touch-action:pan-y; user-select:none; }
.dC-scene:active { cursor:grabbing; }
.dC-ring { position:absolute; left:50%; top:50%; width:230px; height:320px; margin:-160px 0 0 -115px; transform-style:preserve-3d; }
.dC-ring figure { position:absolute; inset:0; margin:0; border-radius:14px; overflow:hidden; backface-visibility:hidden; border:3px solid var(--sun); box-shadow:0 30px 50px -20px #000; }
.dC-ring img { width:100%; height:100%; object-fit:cover; pointer-events:none; }
.dC-hint { position:absolute; bottom:0; width:100%; text-align:center; font-size:12px; letter-spacing:.3em; text-transform:uppercase; color:rgba(246,238,220,.45); margin:0; }
.dC-band { height:28px; background:repeating-linear-gradient(90deg, var(--red) 0 40px, var(--sun) 40px 56px, #000 56px 76px, var(--cream) 76px 80px, #000 80px 100px); background-size:200px 100%; animation:band 6s linear infinite; }
@keyframes band { to { background-position:200px 0 } }
.dC-grid { padding:110px 5vw 140px; background:var(--cream); color:var(--coal); }
.dC-grid-head { display:flex; justify-content:space-between; align-items:flex-end; gap:40px; margin-bottom:56px; opacity:0; transform:translateY(30px); transition:1s cubic-bezier(.2,.8,.2,1); }
.dC-grid-head.in { opacity:1; transform:none; }
.dC-grid-head h2 { margin:0; font-family:'Anton',sans-serif; font-weight:400; font-size:clamp(3rem,6vw,6rem); line-height:.9; }
.dC-grid-head h2 span { color:var(--red); }
.dC-grid-head p { max-width:380px; font-size:17px; line-height:1.65; color:rgba(21,17,14,.7); margin:0; }
.dC-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; perspective:1400px; }
.dC-card { background:#fff; border-radius:10px; overflow:hidden; border:2px solid var(--coal); box-shadow:8px 8px 0 var(--coal);
  opacity:0; transform:rotateX(55deg) translateY(80px); transform-origin:bottom; transition:transform 1.1s cubic-bezier(.2,.8,.2,1), opacity .8s, box-shadow .3s; }
.dC-card.in { opacity:1; transform:none; }
.dC-card:hover { box-shadow:12px 12px 0 var(--red); }
.dC-card img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; transition:transform .8s; }
.dC-card:hover img { transform:scale(1.06); }
.dC-card-body { padding:22px 24px 26px; }
.dC-card-body span { font-family:'Anton'; color:var(--red); font-size:20px; }
.dC-card h3 { margin:6px 0 8px; font-family:'Anton',sans-serif; font-weight:400; font-size:30px; letter-spacing:.01em; text-transform:uppercase; }
.dC-card p { margin:0; line-height:1.6; color:rgba(21,17,14,.68); }

/* phones */
@media (max-width: 900px) {
  .dA-hero, .dC-hero { grid-template-columns:1fr; padding-top:100px; }
  .dA-float { height:380px; margin-top:30px; }
  .dA-slide { width:78vw; } .dA-track { transform:translateX(calc(var(--p,0) * -1 * (6 * (78vw + 32px) - 88vw))); }
  .dB-top { flex-direction:column; align-items:flex-start; gap:20px; }
  .dB-badge { width:104px; height:104px; top:-40px; right:8%; }
  .dB-card { grid-template-columns:1fr; } .dB-card img { height:220px; } .dB-card-body { padding:26px; }
  .dB-card h3 { font-size:28px; }
  .dC-scene { height:440px; --r:300px; } .dC-ring { width:170px; height:240px; margin:-120px 0 0 -85px; }
  .dC-grid-head { flex-direction:column; align-items:flex-start; }
  .dC-cards { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dirs *, .dirs *::before { animation:none !important; transition:none !important; }
  .ltr, .dB-line > span, .dC-card, .dB-side, .dB-cards-head, .dC-grid-head { transform:none !important; opacity:1 !important; }
}
`;
