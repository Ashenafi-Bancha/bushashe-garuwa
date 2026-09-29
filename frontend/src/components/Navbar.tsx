import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { photos } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';
import SocialLinks from './SocialLinks';
import { lockScroll } from '../lib/motion';

type NavKey = 'home' | 'about' | 'discover' | 'heritage' | 'experiences' | 'events' | 'stay' | 'dine' | 'gallery' | 'visit' | 'contact';

const routes: Record<NavKey, string> = {
  home: '/',
  about: '/about',
  discover: '/discover',
  heritage: '/heritage',
  experiences: '/experiences',
  events: '/events',
  stay: '/stay',
  dine: '/dine',
  gallery: '/gallery',
  visit: '/visit',
  contact: '/contact',
};

/* the few places most visitors want, always in view on a computer */
const barKeys: NavKey[] = ['about', 'heritage', 'experiences', 'events', 'stay'];
/* every page, in the full-screen menu */
const menuKeys: NavKey[] = ['home', 'about', 'discover', 'heritage', 'experiences', 'events', 'stay', 'dine', 'gallery', 'visit', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
        {/* at the top the bar sits on the page; once scrolling it floats as a frosted pill */}
        <div
          className={`mx-auto max-w-screen-xl flex items-center justify-between gap-3 rounded-full transition-all duration-500 ${
            scrolled && !open
              ? 'bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_-18px_rgba(30,58,41,0.35)] border border-white/60 h-14 sm:h-16 pl-2 pr-2 sm:pl-3'
              : 'h-16 sm:h-[72px] pl-1 pr-1'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group relative z-[60]" aria-label={t.nav.homeAria}>
            <img
              src={logo}
              alt="Bushaashe Garuwa"
              className={`rounded-full object-contain bg-white p-0.5 shadow-sm transition-all duration-500 group-hover:scale-105 ${scrolled ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12'}`}
            />
            <span className={`font-display text-[15px] sm:text-[17px] font-bold tracking-tight whitespace-nowrap transition-colors duration-500 ${open ? 'text-[#F4EFE4]' : 'text-[#1E3A29]'}`}>
              Bushaashe Garuwa
            </span>
          </Link>

          <nav className={`hidden lg:flex items-center gap-1 transition-opacity duration-300 ${open ? 'opacity-0 pointer-events-none' : ''}`} aria-label={t.nav.mainNav}>
            {barKeys.map((key) => (
              <Link
                key={key}
                to={routes[key]}
                className={`relative px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors duration-300 ${
                  isActive(routes[key]) ? 'bg-[#1E3A29] text-[#F4EFE4]' : 'text-[#1E3A29]/75 hover:text-[#1E3A29] hover:bg-[#1E3A29]/6'
                }`}
              >
                {t.nav.links[key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 relative z-[60]">
            <div className={open ? 'hidden' : ''}>
              <LanguageSwitcher variant="bar" onDark={false} />
            </div>
            {/* wrapped: the button's own display would otherwise beat `hidden` */}
            <span className={`hidden ${open ? '' : 'md:block'}`}>
              <Link to="/visit" className="btn-primary nav-cta whitespace-nowrap">{t.common.planVisit}</Link>
            </span>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`flex items-center gap-2.5 rounded-full pl-4 pr-1.5 py-1.5 text-[13px] font-bold transition-colors duration-300 ${
                open ? 'bg-[#F4EFE4] text-[#1E3A29]' : 'bg-white text-[#1E3A29] shadow-sm hover:bg-[#1E3A29] hover:text-[#F4EFE4]'
              }`}
            >
              <span className="hidden sm:inline">{open ? t.nav.close : t.nav.menu}</span>
              <span className={`grid place-items-center w-8 h-8 rounded-full ${open ? 'bg-[#1E3A29] text-[#F4EFE4]' : 'bg-[#86A94F] text-[#13261A]'}`}>
                <span className="relative block w-3.5 h-2.5">
                  <span className={`absolute left-0 right-0 h-[1.5px] rounded bg-current transition-all duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 right-0 h-[1.5px] rounded bg-current transition-all duration-500 ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen menu: every page in large type, with a photograph and the contacts ── */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuLabel}
        inert={!open}
        data-lenis-prevent
        className={`site-menu fixed inset-0 z-[45] bg-[#13261A] text-[#F4EFE4] overflow-y-auto ${open ? 'is-open' : 'pointer-events-none'}`}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-12 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 min-h-full">
          <nav aria-label={t.nav.mobileNav}>
            <ul className="grid sm:grid-cols-2 gap-x-10">
              {menuKeys.map((key, i) => (
                <li
                  key={key}
                  className="border-b border-white/10"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateY(24px)',
                    transition: `opacity .6s ease ${150 + i * 45}ms, transform .8s var(--ease-out-expo) ${150 + i * 45}ms`,
                  }}
                >
                  <Link
                    to={routes[key]}
                    className={`group flex items-baseline gap-4 py-3.5 sm:py-4 ${isActive(routes[key]) ? 'text-[#B9D38A]' : 'text-[#F4EFE4] hover:text-[#B9D38A]'}`}
                  >
                    <span className="text-xs font-semibold text-white/35 tabular-nums w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {t.nav.links[key]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <aside
            className="flex flex-col gap-6"
            style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(24px)', transition: 'opacity .7s ease .35s, transform .9s var(--ease-out-expo) .35s' }}
          >
            <div className="hidden lg:block rounded-[1.75rem] overflow-hidden aspect-[4/3]">
              <img src={photos.home} alt={t.photos.home} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="lg:hidden"><LanguageSwitcher variant="menu" /></div>
            <Link to="/visit" className="btn-primary btn-on-dark self-start">
              {t.common.planVisit}
            </Link>
            <div className="text-sm text-white/65 leading-relaxed space-y-1">
              <p>{t.common.locationLine}</p>
              <p><a href="tel:+251932196502" className="hover:text-white">+251 932 196 502</a></p>
              <p><a href="mailto:info@bushaashegaruwa.com" className="hover:text-white">info@bushaashegaruwa.com</a></p>
            </div>
            <SocialLinks small />
          </aside>
        </div>
      </div>
    </>
  );
}
