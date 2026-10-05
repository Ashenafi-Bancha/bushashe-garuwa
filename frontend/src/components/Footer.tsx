import { Link } from 'react-router-dom';
// a light copy of the logo, sized for the header and footer (the full one is assets/brand/logo.png)
import logo from '../assets/brand/logo-small.webp';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from './SocialLinks';
import { MAPS_URL } from '../lib/location';

/** Routes per footer column; labels come from t.footer.columns. */
const footerRoutes = {
  explore: { heritage: '/heritage', experiences: '/experiences', events: '/events', gallery: '/gallery' },
  stay: { guesthouse: '/stay', restaurant: '/dine', bar: '/dine#bar', foodEvents: '/events' },
  discover: { story: '/discover', family: '/heritage/family', timeline: '/heritage/timeline', stories: '/heritage/stories' },
  visit: { plan: '/visit', contact: '/contact', education: '/experiences/education', groups: '/experiences', schools: '/experiences/education' },
};

export default function Footer() {
  const { t } = useI18n();
  return (
    // a light sage green: clean and airy, part of the green heritage brand
    <footer className="relative bg-[#E3EBD8] text-[#1E3A29] overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-12 pb-12 sm:pb-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Bushaashe Garuwa" className="w-14 h-14 rounded-full object-contain bg-white p-0.5 flex-shrink-0 shadow-sm" />
              <div className="min-w-0">
                <div className="font-display text-xl font-bold tracking-tight text-[#0B6E40]">Bushaashe Garuwa</div>
                <div className="text-[#1E3A29] text-xs font-semibold leading-snug mt-1">{t.common.locationLine}</div>
              </div>
            </div>
            <p className="text-[#1E3A29] text-sm leading-relaxed mb-6 max-w-sm">{t.footer.tagline}</p>
            <div className="text-[#0B6E40] text-xs font-bold mb-3">{t.footer.followUs}</div>
            <SocialLinks small />
          </div>

          {(Object.keys(footerRoutes) as (keyof typeof footerRoutes)[]).map((col) => {
            const column = t.footer.columns[col];
            const routes: Record<string, string> = footerRoutes[col];
            return (
              <div key={col}>
                <div className="text-[#0B6E40] text-[15px] font-extrabold mb-5">{column.title}</div>
                <ul className="space-y-3">
                  {Object.entries(column.links).map(([key, label]) => (
                    <li key={key}>
                      <Link to={routes[key]} className="text-[#13261A] font-medium hover:text-[#0B6E40] hover:underline underline-offset-4 text-sm transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#1E3A29]/20 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#13261A]">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-6 text-center sm:text-left">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#0B6E40] transition-colors">{t.footer.address}</a>
            <a href="tel:+251932196502" className="hover:text-[#0B6E40] transition-colors">+251 932 196 502</a>
            <a href="mailto:info@bushaashegaruwa.com" className="hover:text-[#0B6E40] transition-colors">info@bushaashegaruwa.com</a>
          </div>
          <div>© {new Date().getFullYear()} {t.footer.rights}</div>
        </div>
      </div>

    </footer>
  );
}
