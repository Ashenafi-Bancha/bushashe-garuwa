import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { useI18n } from '../i18n/I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { lockScroll } from '../lib/motion';

const navRoutes = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'discover', to: '/discover' },
  { key: 'heritage', to: '/heritage' },
  { key: 'experiences', to: '/experiences' },
  { key: 'events', to: '/events' },
  { key: 'stay', to: '/stay' },
  { key: 'dine', to: '/dine' },
  { key: 'library', to: '/library' },
  { key: 'gallery', to: '/gallery' },
  { key: 'visit', to: '/visit' },
  { key: 'contact', to: '/contact' },
] as const;

/* The desktop bar shows every page; the full-screen menu (tablet and phone) lists them too. */
const barKeys = ['home', 'about', 'discover', 'heritage', 'experiences', 'events', 'stay', 'dine', 'library', 'gallery', 'visit', 'contact'] as const;

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  const navLinks = navRoutes.map((r) => ({ key: r.key, to: r.to, label: t.nav.links[r.key] }));
  const barLinks = navLinks.filter((l) => (barKeys as readonly string[]).includes(l.key));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location.pathname]);

  useEffect(() => {
    lockScroll(mobileOpen || searchOpen);
    return () => lockScroll(false);
  }, [mobileOpen, searchOpen]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;
  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
        <div
          className={`mx-auto max-w-screen-xl flex items-center justify-between gap-3 rounded-full pl-2 pr-2 sm:pl-3 transition-all duration-500 ${
            transparent
              ? 'bg-white/10 border border-white/15 backdrop-blur-md'
              : 'bg-[#0e2820]/85 border border-white/10 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]'
          } ${scrolled ? 'h-14' : 'h-16'}`}
        >
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label={t.nav.homeAria}>
            <img
              src={logo}
              alt="Bushaashe Garuwa Lodge"
              className={`rounded-full object-contain bg-white/90 p-0.5 transition-all duration-500 group-hover:scale-105 ${
                scrolled ? 'w-9 h-9' : 'w-11 h-11'
              }`}
            />
            <div className="leading-none">
              <div className="font-display text-white text-[13px] sm:text-[15px] font-bold tracking-tight whitespace-nowrap">Bushaashe Garuwa</div>
              <div className="hidden xl:block text-[#C99A45] text-[10px] font-medium tracking-[0.18em] uppercase mt-1">Wolaita · Ethiopia</div>
            </div>
          </Link>

          {/* ── Desktop links ── */}
          <nav className="hidden lg:flex items-center gap-0.5 min-w-0" aria-label={t.nav.mainNav}>
            {barLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-[5px] xl:px-3 py-2 rounded-full text-[11.5px] xl:text-[13px] font-medium whitespace-nowrap transition-colors duration-300 ${
                  isActive(link.to) ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="search-toggle touch-target rounded-full text-white/70 hover:text-white hover:bg-white/10"
              aria-label={t.nav.search}
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2" strokeLinecap="round"/>
              </svg>
            </button>

            <LanguageSwitcher variant="bar" />


            {/* Menu — phones and tablets */}
            <button
              className={`menu-toggle touch-target rounded-full text-white/85 hover:text-white hover:bg-white/10 ${mobileOpen ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}/>
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}/>
                <span className={`block h-[1.5px] rounded-full bg-current transition-all duration-400 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}/>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu: drops down from the header, same glass style ── */}
      <div
        className={`menu-panel fixed inset-0 z-40 bg-[#0a1f19]/40 backdrop-blur-[2px] transition-opacity duration-400 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuLabel}
        inert={!mobileOpen}
        className={`menu-panel fixed inset-x-0 top-0 z-[45] px-3 sm:px-4 pt-[76px] pointer-events-none`}
      >
        <div
          className={`mx-auto max-w-screen-xl rounded-[1.75rem] bg-[#0e2820]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] p-3 origin-top transition-all duration-500 max-h-[calc(100svh-96px)] overflow-y-auto ${
            mobileOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-3 scale-[0.98]'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          data-lenis-prevent
        >
          <nav className="grid grid-cols-2 gap-1" aria-label={t.nav.mobileNav}>
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all duration-300 ${
                  isActive(link.to) ? 'bg-[#C99A45] text-[#0e2820]' : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-6px)',
                  transition: `opacity 0.4s ease ${i * 25}ms, transform 0.5s var(--ease-out-expo) ${i * 25}ms, background-color 0.25s ease, color 0.25s ease`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-white/10">
            <Link to="/visit" className="btn-primary w-full justify-center">
              {t.common.planVisit}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Search overlay ── */}
      <div
        inert={!searchOpen}
        className={`fixed inset-0 z-[55] transition-all duration-400 ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: searchOpen ? 'blur(20px) saturate(1.2)' : 'none', background: 'rgba(10,31,25,0.94)' }}
      >
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute inset-0 w-full h-full"
          aria-label={t.nav.closeSearch}
          tabIndex={-1}
        />
        <div className="relative z-10 flex items-start justify-center pt-28 sm:pt-36 px-5">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 rounded-full bg-white/8 border border-white/15 pl-6 pr-2 py-2 mb-10 focus-within:border-[#C99A45]/60 transition-colors">
              <svg className="w-5 h-5 text-[#C99A45] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                placeholder={t.nav.searchPlaceholder}
                className="flex-1 bg-transparent text-white text-lg sm:text-xl font-display placeholder-white/30 outline-none py-2"
              />
              <button onClick={() => setSearchOpen(false)} className="touch-target rounded-full text-white/50 hover:text-white hover:bg-white/10" aria-label={t.nav.closeSearch}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="text-white/35 text-xs font-medium tracking-[0.14em] uppercase mb-4">{t.nav.suggested}</div>
            <div className="flex flex-wrap gap-2">
              {t.nav.suggestions.map((s) => (
                <button
                  key={s}
                  className="rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-[#C99A45] hover:text-[#C99A45] text-sm px-4 py-2 transition-all duration-300 active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
