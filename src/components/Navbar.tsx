import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useI18n } from '../i18n/I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';

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
  { key: 'visit', to: '/visit' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  const navLinks = navRoutes.map((r) => ({ to: r.to, label: t.nav.links[r.key] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome     = location.pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-[#0e2820]/95 backdrop-blur-md border-b border-white/5'
        }`}
        style={{ WebkitBackdropFilter: scrolled ? 'blur(16px)' : undefined }}
      >
        <div
          className={`max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-14' : 'h-16 sm:h-20'
          }`}
        >
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-h-[44px]" aria-label={t.nav.homeAria}>
            <img
              src={logo}
              alt="Bushaashe Garuwa Lodge"
              className={`object-contain flex-shrink-0 transition-all duration-500 group-hover:scale-105 drop-shadow-sm ${
                scrolled ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'
              }`}
            />
            <div className="hidden sm:block">
              <div className="text-[#C99A45] font-serif text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase leading-none">Bushaashe</div>
              <div className="text-white/50 font-sans text-[8px] sm:text-[9px] tracking-[0.22em] uppercase leading-none mt-0.5">Garuwa</div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label={t.nav.mainNav}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-2.5 py-2 text-[11px] tracking-[0.12em] uppercase font-sans font-semibold transition-colors duration-300 group ${
                  location.pathname === link.to
                    ? 'text-[#C99A45]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-[#C99A45] transition-all duration-400 ${
                    location.pathname === link.to ? 'w-4' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="touch-target text-white/60 hover:text-white transition-colors rounded-sm"
              aria-label={t.nav.search}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Language — hide at lg where nav links take the space, restore at xl */}
            <div className="hidden md:flex lg:hidden xl:flex">
              <LanguageSwitcher variant="bar" />
            </div>

            {/* CTA — xl+ only (lg is occupied by nav links) */}
            <Link
              to="/visit"
              className="hidden xl:inline-flex items-center gap-2 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-[10px] font-sans font-bold uppercase tracking-[0.18em] px-5 py-3 ml-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#C99A45]/20 active:scale-95"
            >
              {t.common.planVisit}
            </Link>

            {/* Hamburger — lg hidden */}
            <button
              className="lg:hidden touch-target text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={`block h-px bg-current transition-all duration-400 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}/>
                <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}/>
                <span className={`block h-px bg-current transition-all duration-400 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}/>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuLabel}
        className={`fixed inset-0 z-40 flex flex-col bg-[#0e2820] transition-all duration-500 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle pattern */}
        <div className="absolute inset-0 pattern-diamond opacity-30 pointer-events-none"/>

        <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-12 pt-20 pb-6 overflow-y-auto">
          <nav className="flex flex-col" aria-label={t.nav.mobileNav}>
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-serif text-3xl sm:text-4xl font-light py-3 border-b border-white/8 flex items-center justify-between group transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-[#C99A45]'
                    : 'text-white/75 hover:text-white hover:pl-1'
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms',
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(-16px)',
                  opacity: mobileOpen ? 1 : 0,
                  transition: `opacity 0.45s ease ${i * 40}ms, transform 0.5s var(--ease-out-expo) ${i * 40}ms, color 0.25s ease, padding 0.25s ease`,
                }}
              >
                {link.label}
                <span className="text-[#C99A45]/50 text-lg group-hover:text-[#C99A45] transition-colors">→</span>
              </Link>
            ))}
          </nav>

          {/* Language + CTA */}
          <div
            className="mt-8 flex flex-col gap-5"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.5s ease ${navLinks.length * 40 + 80}ms, transform 0.5s var(--ease-out-expo) ${navLinks.length * 40 + 80}ms`,
            }}
          >
            <div className="flex items-center gap-1">
              <span className="text-white/25 text-xs font-sans tracking-wider mr-2">{t.nav.language}:</span>
              <LanguageSwitcher variant="menu" />
            </div>

            <Link
              to="/visit"
              className="inline-flex items-center justify-center bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-sm font-sans font-bold uppercase tracking-[0.18em] py-4 transition-colors active:scale-[0.98]"
            >
              {t.common.planVisit}
            </Link>
          </div>
        </div>

        <div className="relative px-6 sm:px-12 pb-8 text-white/20 text-xs font-sans tracking-wider" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
          {t.common.slogan}
        </div>
      </div>

      {/* ── Search overlay ── */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-400 ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: searchOpen ? 'blur(20px) saturate(1.2)' : 'none', background: 'rgba(14,40,32,0.96)' }}
      >
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute inset-0 w-full h-full"
          aria-label={t.nav.closeSearch}
        />
        <div className="relative z-10 flex items-start justify-center pt-28 sm:pt-36 px-6">
          <div className="w-full max-w-2xl">
            <div className="flex items-center border-b-2 border-[#C99A45] pb-4 mb-10">
              <svg className="w-5 h-5 text-[#C99A45] mr-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                autoFocus
                type="search"
                placeholder={t.nav.searchPlaceholder}
                className="flex-1 bg-transparent text-white text-xl sm:text-2xl font-serif placeholder-white/25 outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="touch-target text-white/40 hover:text-white ml-2" aria-label={t.nav.closeSearch}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="text-white/30 text-xs font-sans tracking-[0.2em] uppercase mb-4">{t.nav.suggested}</div>
            <div className="flex flex-wrap gap-2">
              {t.nav.suggestions.map((s) => (
                <button
                  key={s}
                  className="border border-white/15 text-white/50 hover:border-[#C99A45] hover:text-[#C99A45] text-xs font-sans px-4 py-2.5 transition-all duration-300 active:scale-95"
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
