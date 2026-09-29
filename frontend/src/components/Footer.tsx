import { Link } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from './SocialLinks';
import { MAPS_URL } from '../lib/location';

/** Routes per footer column; labels come from t.footer.columns. */
const footerRoutes = {
  explore: { heritage: '/heritage', experiences: '/experiences', events: '/events', gallery: '/gallery' },
  stay: { guesthouse: '/stay', restaurant: '/dine', bar: '/dine#bar', bookRoom: '/stay#book', foodEvents: '/events' },
  discover: { story: '/discover', family: '/heritage/family', timeline: '/heritage/timeline', stories: '/heritage/stories' },
  visit: { plan: '/visit', contact: '/contact', education: '/experiences/education', groups: '/experiences', schools: '/experiences/education' },
};

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative bg-[#13261A] text-[#F4EFE4] overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24">
        {/* the invitation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 sm:pb-16 border-b border-white/10">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-[-0.04em] max-w-3xl">
            {t.footer.headline}
          </h2>
          <Link to="/visit" className="btn-primary btn-on-dark self-start lg:self-auto flex-shrink-0">
            {t.common.planVisit}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-12 py-14 sm:py-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Bushaashe Garuwa" className="w-14 h-14 rounded-full object-contain bg-white p-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-display text-xl font-bold tracking-tight">Bushaashe Garuwa</div>
                <div className="text-white/55 text-xs font-medium leading-snug mt-1">{t.common.locationLine}</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">{t.footer.tagline}</p>
            <div className="text-white/40 text-xs font-semibold mb-3">{t.footer.followUs}</div>
            <SocialLinks small />
          </div>

          {(Object.keys(footerRoutes) as (keyof typeof footerRoutes)[]).map((col) => {
            const column = t.footer.columns[col];
            const routes: Record<string, string> = footerRoutes[col];
            return (
              <div key={col}>
                <div className="text-[#B9D38A] text-sm font-bold mb-5">{column.title}</div>
                <ul className="space-y-3">
                  {Object.entries(column.links).map(([key, label]) => (
                    <li key={key}>
                      <Link to={routes[key]} className="text-white/65 hover:text-white text-sm transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-6 text-center sm:text-left">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t.footer.address}</a>
            <a href="tel:+251932196502" className="hover:text-white transition-colors">+251 932 196 502</a>
            <a href="mailto:info@bushaashegaruwa.com" className="hover:text-white transition-colors">info@bushaashegaruwa.com</a>
          </div>
          <div>© {new Date().getFullYear()} {t.footer.rights}</div>
        </div>
      </div>

      {/* the name, very large and very quiet, along the bottom */}
      <div aria-hidden="true" className="pointer-events-none select-none font-display font-extrabold text-white/[0.05] whitespace-nowrap leading-[0.8] tracking-[-0.05em] text-[12vw] text-center -mb-[1.5vw]">
        Bushaashe Garuwa
      </div>
    </footer>
  );
}
