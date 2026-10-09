import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
// a light copy of the logo, sized for the header and footer (the full one is assets/brand/logo.png)
import logo from '../assets/brand/logo-small.webp';
import { useI18n } from '../i18n/I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';
import SocialLinks from './SocialLinks';
import { lockScroll } from '../lib/motion';

type PageKey = 'home' | 'events' | 'heritage' | 'experiences' | 'vip' | 'stay' | 'dine' | 'about' | 'discover' | 'gallery' | 'contact' | 'visit';

const routes: Record<PageKey, string> = {
  home: '/',
  events: '/events',
  heritage: '/heritage',
  experiences: '/experiences',
  vip: '/vip',
  stay: '/stay',
  dine: '/dine',
  about: '/about',
  discover: '/discover',
  gallery: '/gallery',
  contact: '/contact',
  visit: '/visit',
};

/* Services opens as a small panel on computers and a headed list on phones */
const groups = {
  services: ['experiences', 'vip', 'dine', 'stay'],
} as const satisfies Record<string, readonly PageKey[]>;

type GroupKey = keyof typeof groups;

/**
 * The pages that open with a photograph running up behind the header, so the
 * header lies on the picture instead of being a strip of its own.
 */
const hasPhotoHero = (path: string) =>
  path === '/preview/hero' || Object.values(routes).some((r) => (r === '/' ? path === '/' : path === r || path.startsWith(r + '/')));

/* ── Line icons, one per page ── */
const paths: Record<PageKey, ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  events: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  heritage: <><path d="M3 9 12 4l9 5" /><path d="M5 9.5v8.5M9.7 9.5v8.5M14.3 9.5v8.5M19 9.5v8.5" /><path d="M3 20.5h18" /></>,
  experiences: <><path d="M12 3l2.2 5.1 5.3.5-4 3.6 1.2 5.3L12 14.8 7.3 17.5l1.2-5.3-4-3.6 5.3-.5z" /></>,
  vip: <><path d="M4 18h16M5 18 3.5 8l5 4L12 5l3.5 7 5-4L19 18" /></>,
  stay: <><path d="M3 19V7M21 19v-5a3 3 0 0 0-3-3h-8v8" /><path d="M3 15h18" /><circle cx="6.5" cy="11" r="1.8" /></>,
  dine: <><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" /><path d="M16 3c-1.7 1.5-2.5 3.5-2.5 6h3V21" /></>,
  about: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  discover: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  gallery: <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 4 4 3-3 4 4" /></>,
  contact: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1C10.7 20 4 13.3 4 5a1 1 0 0 1 1-1z" /></>,
  visit: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
};

function Icon({ page, className = 'w-5 h-5' }: { page: PageKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[page]}
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<GroupKey | null>(null);
  // computers show the photograph behind the header; phones show it below
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { t } = useI18n();

  // a line under each page name in the panels and the phone menu
  const describe = (key: PageKey): string | undefined => {
    if (key === 'discover' || key === 'contact' || key === 'vip') return t.nav.describe[key];
    if (key === 'home') return undefined;
    return t.home.quick.items[key];
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setPanel(null); }, [location.pathname]);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setPanel(null); } };
    const onDown = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setPanel(null); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, []);

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));
  const groupActive = (g: GroupKey) => groups[g].some((k) => isActive(routes[k]));
  // every page opens on a full-screen photograph; at the top the header is
  // written straight onto it (the 'page not found' screen has none, so it keeps the pill)
  const onPhoto = wide && hasPhotoHero(location.pathname) && !scrolled && !open;
  const linkTone = (active: boolean) =>
    active
      ? onPhoto ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-[#0E8A50] text-[#F4EFE4]'
      : onPhoto ? 'text-white hover:bg-white/15 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]' : 'text-[#1E3A29]/75 hover:text-[#1E3A29] hover:bg-[#1E3A29]/6';

  const barLink = (key: PageKey) => (
    <Link
      key={key}
      to={routes[key]}
      className={`px-2.5 xl:px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors duration-300 ${linkTone(isActive(routes[key]))}`}
    >
      {t.nav.links[key]}
    </Link>
  );

  const barGroup = (g: GroupKey) => (
    <div key={g} className="relative" onMouseEnter={() => setPanel(g)} onMouseLeave={() => setPanel(null)}>
      <button
        type="button"
        aria-expanded={panel === g}
        aria-haspopup="true"
        onClick={() => setPanel(panel === g ? null : g)}
        className={`hit-slim flex items-center gap-1.5 px-2.5 xl:px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors duration-300 ${linkTone(groupActive(g))}`}
      >
        {t.nav.links[g]}
        <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 transition-transform duration-300 ${panel === g ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {/* the panel hangs from the button; the invisible top padding keeps the hover alive on the way down */}
      <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-300 ${panel === g ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`} inert={panel !== g}>
        <ul className="w-[22rem] rounded-[1.5rem] bg-white p-2 shadow-[0_24px_60px_-24px_rgba(30,58,41,0.45)] border border-[#1E3A29]/6">
          {groups[g].map((key) => (
            <li key={key}>
              <Link to={routes[key]} className={`group flex items-start gap-3.5 rounded-2xl p-3 transition-colors ${isActive(routes[key]) ? 'bg-[#E9EEDD]' : 'hover:bg-[#F4EFE4]'}`}>
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#86A94F]/20 text-[#1E3A29] flex-shrink-0 transition-colors group-hover:bg-[#86A94F] group-hover:text-[#13261A]">
                  <Icon page={key} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-[#1E3A29] text-sm">{t.nav.links[key]}</span>
                  {describe(key) && <span className="block text-[#1E3A29]/55 text-xs leading-snug mt-0.5">{describe(key)}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  /* one row of the phone menu */
  const menuRow = (key: PageKey, i: number) => (
    <li
      key={key}
      style={{
        opacity: open ? 1 : 0,
        transform: open ? 'none' : 'translateY(14px)',
        transition: `opacity .45s ease ${80 + i * 35}ms, transform .6s var(--ease-out-expo) ${80 + i * 35}ms`,
      }}
    >
      <Link
        to={routes[key]}
        className={`flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors ${isActive(routes[key]) ? 'bg-white shadow-sm' : 'active:bg-white/70'}`}
      >
        <span className={`grid place-items-center w-11 h-11 rounded-xl flex-shrink-0 ${isActive(routes[key]) ? 'bg-[#0E8A50] text-[#F4EFE4]' : 'bg-[#86A94F]/20 text-[#1E3A29]'}`}>
          <Icon page={key} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-bold text-[#1E3A29] leading-tight tracking-tight">{t.nav.links[key]}</span>
          {describe(key) && <span className="block text-[#1E3A29]/55 text-xs leading-snug mt-0.5 truncate">{describe(key)}</span>}
        </span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1E3A29]/35 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Link>
    </li>
  );

  let row = 0;

  return (
    <>
      {/* part of the page, not a separate bar: on a photograph just the words;
          otherwise the page's own paper colour, edge to edge, no border or shadow */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${onPhoto ? 'bg-transparent' : 'bg-[#F4EFE4]'}`}>
        <div className="mx-auto max-w-screen-xl h-16 sm:h-[72px] px-4 sm:px-8 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label={t.nav.homeAria}>
            <img
              src={logo}
              alt="Bushaashe Garuwa"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain bg-white p-0.5 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-display text-[16px] sm:text-[18px] font-bold tracking-tight whitespace-nowrap text-[#15A864]">Bushaashe Garuwa</span>
          </Link>

          {/* computers: every way in, right in the bar */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-0.5" aria-label={t.nav.mainNav}>
            {barLink('home')}
            {barLink('events')}
            {barLink('heritage')}
            {barGroup('services')}
            {barLink('about')}
            {barLink('gallery')}
            {barLink('contact')}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher variant="bar" onDark={onPhoto} />
            {/* wrapped: the button's own display would otherwise beat `hidden` */}
            <span className="hidden xl:block">
              <Link to="/visit" className="btn-primary nav-cta whitespace-nowrap">{t.common.planVisit}</Link>
            </span>
            {/* phones and tablets: the hamburger */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              aria-controls="site-menu"
              className="lg:hidden grid place-items-center w-11 h-11 -mr-2 text-[#1E3A29]"
            >
              {/* a plain three-line icon that turns into a cross */}
              <span className="relative block w-6 h-[18px]">
                <span className={`absolute left-0 right-0 h-[2.5px] rounded-full bg-current transition-all duration-500 ${open ? 'top-[8px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 right-0 top-[8px] h-[2.5px] rounded-full bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 right-0 h-[2.5px] rounded-full bg-current transition-all duration-500 ${open ? 'top-[8px] -rotate-45' : 'top-[16px]'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Phone menu: one column, an icon for every page, grouped as on computers ── */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuLabel}
        inert={!open}
        data-lenis-prevent
        className={`site-menu lg:hidden fixed inset-0 z-[45] bg-[#F4EFE4] overflow-y-auto ${open ? 'is-open' : 'pointer-events-none'}`}
      >
        <nav className="max-w-lg mx-auto px-4 pt-24 sm:pt-28 pb-10" aria-label={t.nav.mobileNav}>
          <ul className="space-y-1">
            {menuRow('home', row++)}
            {menuRow('events', row++)}
            {menuRow('heritage', row++)}
          </ul>

          {(Object.keys(groups) as GroupKey[]).map((g) => (
            <div key={g} className="mt-5">
              <div className="px-3 mb-1.5 text-xs font-bold text-[#C4622D]">{t.nav.links[g]}</div>
              <ul className="space-y-1">{groups[g].map((key) => menuRow(key, row++))}</ul>
            </div>
          ))}

          <ul className="mt-5 space-y-1">
            {menuRow('about', row++)}
            {menuRow('discover', row++)}
            {menuRow('gallery', row++)}
            {menuRow('contact', row++)}
          </ul>

          <div
            className="mt-7 rounded-[1.75rem] bg-[#E3EBD8] text-[#13261A] p-5"
            style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(14px)', transition: 'opacity .5s ease .45s, transform .7s var(--ease-out-expo) .45s' }}
          >
            <Link to="/visit" className="btn-primary w-full">
              {t.common.planVisit}
            </Link>
            <div className="mt-5 text-sm text-[#1E3A29]/80 leading-relaxed space-y-1">
              <p>{t.common.locationLine}</p>
              <p><a href="tel:+251932196502" className="text-[#13261A] font-semibold">+251 932 196 502</a></p>
              <p><a href="mailto:bushaashegaruwa@gmail.com" className="hover:text-[#0B6E40]">bushaashegaruwa@gmail.com</a></p>
            </div>
            <div className="mt-4"><SocialLinks small /></div>
          </div>
        </nav>
      </div>
    </>
  );
}
