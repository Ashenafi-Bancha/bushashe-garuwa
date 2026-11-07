import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import type { SiteEvent } from '../lib/events';
import { wol } from '../lib/wolaitaWords';
import EventAd from './EventAd';
import TypeHeading from './TypeHeading';

/**
 * "Upcoming Events" on the home page: the heading types itself, then the next
 * events staff published, each as an advertisement with a countdown.
 * Hidden while no event is announced. The hero's events button leads here.
 */
export default function UpcomingEvents({ events }: { events: SiteEvent[] }) {
  const { t } = useI18n();
  if (events.length === 0) return null;
  const next = events.slice(0, 2);

  return (
    <section id="upcoming" className="px-5 sm:px-8 pt-10 sm:pt-14 pb-4" aria-labelledby="upcoming-title">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="eyebrow mb-4">{wol(t.events.ad.eyebrow)}</span>
            <TypeHeading id="upcoming-title" text={t.events.upcoming} className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#13261A] leading-[1.02]" />
          </div>
          <Link to="/events" className="btn-outline text-[#1E3A29] self-start sm:self-auto flex-shrink-0">{t.events.ad.seeAll}</Link>
        </div>
        <div className="space-y-6">
          {next.map((event) => (
            <EventAd key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
