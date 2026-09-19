import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
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
                className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/50 transition-all duration-300"
                aria-label="Facebook">
                <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                <span className="text-[10px] font-sans text-white/60 group-hover:text-white transition-colors">Facebook</span>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-300"
                aria-label="TikTok">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
                </svg>
                <span className="text-[10px] font-sans text-white/60 group-hover:text-white transition-colors">TikTok</span>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-[#E1306C]/15 border border-white/10 hover:border-[#E1306C]/40 transition-all duration-300"
                aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDC80"/>
                      <stop offset="25%" stopColor="#FCAF45"/>
                      <stop offset="50%" stopColor="#F77737"/>
                      <stop offset="75%" stopColor="#C13584"/>
                      <stop offset="100%" stopColor="#833AB4"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad)"/>
                </svg>
                <span className="text-[10px] font-sans text-white/60 group-hover:text-white transition-colors">Instagram</span>
              </a>

              {/* Email */}
              <a href="mailto:info@bushaashegaruwa.com"
                className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-[#EA4335]/15 border border-white/10 hover:border-[#EA4335]/40 transition-all duration-300"
                aria-label={t.common.email}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" fill="#EA4335" opacity="0.9"/>
                  <path d="M2 6l10 7 10-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[10px] font-sans text-white/60 group-hover:text-white transition-colors">{t.common.email}</span>
              </a>

              {/* Phone */}
              <a href="tel:+251000000000"
                className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-[#25D366]/15 border border-white/10 hover:border-[#25D366]/40 transition-all duration-300"
                aria-label="Phone / WhatsApp">
                <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.502 3.935 1.386 5.608L0 24l6.545-1.371A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.37l-.36-.213-3.713.778.791-3.627-.234-.374A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
                </svg>
                <span className="text-[10px] font-sans text-white/60 group-hover:text-white transition-colors">WhatsApp</span>
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
