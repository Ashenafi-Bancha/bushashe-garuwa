import { Link } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { useI18n } from '../i18n/I18nProvider';

/** Routes per footer column; labels come from t.footer.columns. */
const footerRoutes = {
  explore: { heritage: '/heritage', experiences: '/experiences', events: '/events', gallery: '/gallery', archive: '/archive' },
  stay: { guesthouse: '/stay', restaurant: '/dine', bar: '/dine#bar', bookRoom: '/stay#book', foodEvents: '/events' },
  discover: { story: '/discover', family: '/heritage/family', timeline: '/heritage/timeline', library: '/library', stories: '/heritage/stories' },
  visit: { plan: '/visit', contact: '/contact', education: '/experiences/education', groups: '/experiences', schools: '/experiences/education' },
};

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#0e2820] text-white pb-20 lg:pb-0">
      {/* Pattern accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C99A45] to-transparent opacity-40"/>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-16">
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

            {/* Follow us */}
            <div className="text-[#C99A45] text-[10px] font-sans font-semibold tracking-[0.2em] uppercase mb-3">{t.footer.followUs}</div>
            <div className="flex flex-wrap gap-2.5">

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="group flex items-center px-4 py-2 rounded-full bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/50 transition-all duration-300"
                aria-label="Facebook">
                <span className="text-xs font-sans text-white/70 group-hover:text-white transition-colors">Facebook</span>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="group flex items-center px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="TikTok">
                <span className="text-xs font-sans text-white/70 group-hover:text-white transition-colors">TikTok</span>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="group flex items-center px-4 py-2 rounded-full bg-white/5 hover:bg-[#E1306C]/15 border border-white/10 hover:border-[#E1306C]/40 transition-all duration-300"
                aria-label="Instagram">
                <span className="text-xs font-sans text-white/70 group-hover:text-white transition-colors">Instagram</span>
              </a>

              {/* Email */}
              <a href="mailto:info@bushaashegaruwa.com"
                className="group flex items-center px-4 py-2 rounded-full bg-white/5 hover:bg-[#EA4335]/15 border border-white/10 hover:border-[#EA4335]/40 transition-all duration-300"
                aria-label={t.common.email}>
                <span className="text-xs font-sans text-white/70 group-hover:text-white transition-colors">{t.common.email}</span>
              </a>

              {/* Phone */}
              <a href="tel:+251000000000"
                className="group flex items-center px-4 py-2 rounded-full bg-white/5 hover:bg-[#25D366]/15 border border-white/10 hover:border-[#25D366]/40 transition-all duration-300"
                aria-label="Phone / WhatsApp">
                <span className="text-xs font-sans text-white/70 group-hover:text-white transition-colors">WhatsApp</span>
              </a>

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
            <span>{t.footer.address}</span>
            <span>+251 XXX XXX XXX</span>
            <span>info@bushaashegaruwa.com</span>
          </div>
          <div className="text-white/25 text-xs font-sans">
            © {new Date().getFullYear()} {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
