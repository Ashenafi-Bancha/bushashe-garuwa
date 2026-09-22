import { Link } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from './SocialLinks';
import { MAPS_URL } from '../lib/location';

/** Routes per footer column; labels come from t.footer.columns. */
const footerRoutes = {
  explore: { heritage: '/heritage', experiences: '/experiences', events: '/events', gallery: '/gallery', archive: '/library' },
  stay: { guesthouse: '/stay', restaurant: '/dine', bar: '/dine#bar', bookRoom: '/stay#book', foodEvents: '/events' },
  discover: { story: '/discover', family: '/heritage/family', timeline: '/heritage/timeline', library: '/library', stories: '/heritage/stories' },
  visit: { plan: '/visit', contact: '/contact', education: '/experiences/education', groups: '/experiences', schools: '/experiences/education' },
};

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#0e2820] text-white">
      {/* Pattern accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C99A45] to-transparent opacity-40"/>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-16">
          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="Bushaashe Garuwa Lodge"
                className="w-14 h-14 rounded-full object-contain bg-white/90 p-0.5 flex-shrink-0"
              />
              <div className="leading-none">
                <div className="font-display text-white text-lg font-bold tracking-tight">Bushaashe Garuwa</div>
                <div className="text-[#C99A45] text-[10px] font-medium tracking-[0.18em] uppercase mt-1.5">Wolaita · Ethiopia</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-sans mb-5">
              {t.footer.tagline}
            </p>

            {/* Follow us (desktop; on smaller screens it closes the footer) */}
            <div className="hidden lg:block">
              <div className="text-[#C99A45] text-[10px] font-sans font-semibold tracking-[0.2em] uppercase mb-3">{t.footer.followUs}</div>
              <SocialLinks small />
            </div>
          </div>

          {/* Link columns */}
          {(Object.keys(footerRoutes) as (keyof typeof footerRoutes)[]).map((col) => {
            const column = t.footer.columns[col];
            const routes: Record<string, string> = footerRoutes[col];
            return (
              <div key={col}>
                <div className="text-[#C99A45] text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-5">{column.title}</div>
                <ul className="space-y-3">
                  {Object.entries(column.links).map(([key, label]) => (
                    <li key={key}>
                      <Link
                        to={routes[key]}
                        className="text-white/50 hover:text-white text-sm font-sans transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact row */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-6 text-white/40 text-xs font-sans text-center sm:text-left">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t.footer.address}</a>
            <span>+251 XXX XXX XXX</span>
            <a href="mailto:info@bushaashegaruwa.com" className="hover:text-white transition-colors">info@bushaashegaruwa.com</a>
          </div>
          <div className="text-white/25 text-xs font-sans">
            © {new Date().getFullYear()} {t.footer.rights}
          </div>
        </div>

        {/* Follow us, last on phones and tablets */}
        <div className="lg:hidden border-t border-white/10 mt-6 pt-6 flex flex-col items-center gap-3">
          <div className="text-[#C99A45] text-[10px] font-sans font-semibold tracking-[0.2em] uppercase">{t.footer.followUs}</div>
          <SocialLinks small />
        </div>
      </div>
    </footer>
  );
}
