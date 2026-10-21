import { Link } from 'react-router-dom';
// a light copy of the logo, sized for the header and footer (the full one is assets/brand/logo.png)
import logo from '../assets/brand/logo-small.webp';
import { useI18n } from '../i18n/I18nProvider';
import SocialLinks from './SocialLinks';
import { MAPS_URL } from '../lib/location';

/** Routes per footer column; labels come from t.footer.columns. */
const footerRoutes = {
  explore: { heritage: '/heritage', experiences: '/experiences', events: '/events', gallery: '/gallery' },
  stay: { vip: '/vip', guesthouse: '/stay', restaurant: '/dine', bar: '/dine#bar', foodEvents: '/events' },
  discover: { story: '/discover', family: '/family-history', timeline: '/heritage/timeline', stories: '/heritage/stories' },
  visit: { plan: '/visit', contact: '/contact', education: '/experiences/education', groups: '/experiences', schools: '/experiences/education' },
};

export default function Footer() {
  const { t } = useI18n();
  return (
    // the green of the website's buttons, with the words in white (the emails' footer matches)
    <footer className="relative text-white">
      {/* the top edge, drawn by hand: high at the left corner, wavering across, falling away on the right */}
      <svg viewBox="0 0 1440 190" preserveAspectRatio="none" aria-hidden="true" className="block w-full h-[56px] sm:h-[90px] lg:h-[120px] -mb-px">
        <path d="M0 0 C6.3 10.8 22.3 47.5 38 65 C53.7 82.5 78.7 95.7 94 105 C109.3 114.3 114 117.5 130 121 C146 124.5 159.8 125.3 190 126 C220.2 126.7 275.2 126.5 311 125 C346.8 123.5 375.2 116.3 405 117 C434.8 117.7 461.7 127.7 490 129 C518.3 130.3 543.5 128 575 125 C606.5 122 646 114.5 679 111 C712 107.5 740 103.5 773 104 C806 104.5 844 111 877 114 C910 117 944.3 122.7 971 122 C997.7 121.3 1010.2 111.7 1037 110 C1063.8 108.3 1102.2 110 1132 112 C1161.8 114 1189.3 116 1216 122 C1242.7 128 1262 139.7 1292 148 C1322 156.3 1371.3 165 1396 172 C1420.7 179 1432.7 187 1440 190 L1440 192 L0 192 Z" fill="#3F7D20" />
      </svg>
      <div className="bg-[#3F7D20] overflow-hidden pb-16">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-12 pb-12 sm:pb-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Bushaashe Garuwa" className="w-14 h-14 rounded-full object-contain bg-white p-0.5 flex-shrink-0 shadow-sm" />
              <div className="min-w-0">
                <div className="font-display text-xl font-bold tracking-tight text-white">Bushaashe Garuwa</div>
                <div className="text-white/85 text-xs font-semibold leading-snug mt-1">{t.common.locationLine}</div>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-sm">{t.footer.tagline}</p>
            <div className="text-white text-xs font-bold mb-3">{t.footer.followUs}</div>
            <SocialLinks small onGreen />
          </div>

          {(Object.keys(footerRoutes) as (keyof typeof footerRoutes)[]).map((col) => {
            const column = t.footer.columns[col];
            const routes: Record<string, string> = footerRoutes[col];
            return (
              <div key={col}>
                <div className="text-white text-[15px] font-extrabold mb-5">{column.title}</div>
                <ul className="space-y-3">
                  {Object.entries(column.links).map(([key, label]) => (
                    <li key={key}>
                      <Link to={routes[key]} className="text-white/85 font-medium hover:text-white hover:underline underline-offset-4 text-sm transition-colors duration-200">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/25 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/90">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-6 text-center sm:text-left">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline underline-offset-4 transition-colors">{t.footer.address}</a>
            <a href="tel:+251932196502" className="hover:text-white hover:underline underline-offset-4 transition-colors">+251 932 196 502</a>
            <a href="mailto:bushaashegaruwa@gmail.com" className="hover:text-white hover:underline underline-offset-4 transition-colors">bushaashegaruwa@gmail.com</a>
          </div>
          <div>© {new Date().getFullYear()} {t.footer.rights}</div>
        </div>
      </div>
      </div>
    </footer>
  );
}
