import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Sidebar, { type SectionGroup, type SectionId } from '../components/Sidebar';
import { Icon, type IconName } from '../components/icons';
import { Notice, StatCard } from '../components/ui';
import BookingsView from './BookingsView';
import ContentView from './ContentView';
import EventsView from './EventsView';
import GalleryView from './GalleryView';
import HeroView from './HeroView';
import MessagesView from './MessagesView';
import VisitsView from './VisitsView';

/** The words at the top of the work area, so staff always know where they are */
const HEADINGS: Record<SectionId, { title: string; lead: string }> = {
  overview: { title: 'Overview', lead: 'Everything waiting for you today.' },
  visits: { title: 'Visit requests', lead: 'People who asked to come and see Bushaashe Garuwa.' },
  bookings: { title: 'Event bookings', lead: 'Places reserved at the cultural food evenings and other events.' },
  messages: { title: 'Messages', lead: 'Messages sent from the contact page.' },
  events: { title: 'Events', lead: 'Add and change the events shown on the website.' },
  gallery: { title: 'Gallery', lead: 'Add photos to the Gallery page, each with a heading and a description.' },
  hero: { title: 'Page photos', lead: 'The large photograph that opens each page.' },
  content: { title: 'Website text', lead: 'Change the words on the website, in each language.' },
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export default function Dashboard() {
  const { token, email, signOut } = useAdminSession();
  const [section, setSection] = useState<SectionId>('overview');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      setSummary(await adminApi.summary(token));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the counts');
    }
  }, [token]);

  // the counts follow the work: fresh on every section change, and once a minute
  useEffect(() => {
    void loadSummary();
  }, [loadSummary, section]);

  useEffect(() => {
    const timer = setInterval(() => void loadSummary(), 60_000);
    return () => clearInterval(timer);
  }, [loadSummary]);

  const groups: SectionGroup[] = [
    { sections: [{ id: 'overview', label: 'Overview', icon: 'overview' }] },
    {
      title: 'Requests',
      sections: [
        { id: 'visits', label: 'Visit requests', icon: 'visits', badge: summary?.visits.new },
        { id: 'bookings', label: 'Event bookings', icon: 'bookings', badge: summary?.bookings.pending },
        { id: 'messages', label: 'Messages', icon: 'messages', badge: summary?.contact.new },
      ],
    },
    {
      title: 'Website',
      sections: [
        { id: 'events', label: 'Events', icon: 'events' },
        { id: 'gallery', label: 'Gallery', icon: 'gallery' },
        { id: 'hero', label: 'Page photos', icon: 'hero' },
        { id: 'content', label: 'Website text', icon: 'text' },
      ],
    },
  ];

  const heading = HEADINGS[section];

  // requests, bookings and messages moved on from "new" since midnight
  const handledToday = summary
    ? summary.visits.handledToday + summary.bookings.handledToday + summary.contact.handledToday
    : undefined;

  const figures = (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon="visits"
        label="Upcoming visits"
        value={summary?.visits.upcoming ?? '–'}
        hint={`${summary?.visits.new ?? 0} not handled`}
        onClick={() => setSection('visits')}
      />
      <StatCard
        icon="guests"
        label="Guests booked"
        value={summary?.bookings.guestsUpcoming ?? '–'}
        hint={`${summary?.bookings.pending ?? 0} to call back`}
        onClick={() => setSection('bookings')}
      />
      <StatCard
        icon="messages"
        label="New messages"
        value={summary?.contact.new ?? '–'}
        hint={`${summary?.contact.last7Days ?? 0} this week`}
        onClick={() => setSection('messages')}
      />
      <StatCard icon="checkCircle" label="Handled today" value={handledToday ?? '–'} hint={handledToday ? 'Well done' : 'Nothing handled yet'} />
    </div>
  );

  /** The parts of the website staff look after, each a way into its section */
  const website: { id: SectionId; icon: IconName; title: string; text: string; state: string }[] = [
    {
      id: 'gallery',
      icon: 'gallery',
      title: 'Gallery',
      text: 'Add photos with a heading and a description.',
      state: summary?.media ? plural(summary.media.gallery, 'photo added', 'photos added') : '',
    },
    {
      id: 'hero',
      icon: 'hero',
      title: 'Page photos',
      text: 'Change the photograph that opens a page.',
      state: summary?.media ? plural(summary.media.heroes, 'photo of yours', 'photos of yours') : '',
    },
    {
      id: 'events',
      icon: 'events',
      title: 'Events',
      text: 'Add the next cultural food evening.',
      state: summary ? `${summary.events.upcoming} upcoming, ${plural(summary.events.drafts, 'draft', 'drafts')}` : '',
    },
    {
      id: 'content',
      icon: 'text',
      title: 'Website text',
      text: 'Change the words, in each language.',
      state: summary ? plural(summary.content.edited, 'text edited', 'texts edited') : '',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE4]">
      <Sidebar
        groups={groups}
        current={section}
        onChoose={setSection}
        onSignOut={signOut}
        email={email}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-[264px] min-h-screen flex flex-col">
        {/* the bar above the work, in its own colour: where you are, and the way back to the menu on a phone */}
        <header className="sticky top-0 z-30 bg-[#1E3A29] text-white shadow-[0_6px_18px_-10px_rgba(19,38,26,0.6)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 h-[72px] flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open the menu"
              className="lg:hidden flex-shrink-0 w-11 h-11 rounded-xl border border-white/20 bg-white/10 grid place-items-center text-white"
            >
              <Icon name="menu" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight truncate">{heading.title}</h1>
              <p className="text-white/65 text-xs sm:text-sm truncate">{heading.lead}</p>
            </div>

            {/* the other sections have their own Refresh, beside their lists */}
            {section === 'overview' && (
              <button type="button" onClick={loadSummary} className="hidden sm:inline-flex admin-btn-quiet on-dark flex-shrink-0">
                <Icon name="refresh" className="w-4 h-4" />
                Refresh
              </button>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="hidden md:inline-flex admin-btn-quiet on-dark flex-shrink-0">
              <Icon name="external" className="w-4 h-4" />
              View the website
            </a>
          </div>
        </header>

        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {error && (
            <div className="mb-6">
              <Notice kind="error">{error}</Notice>
            </div>
          )}

          {section === 'overview' && (
            <div className="space-y-10">
              {figures}

              <section>
                <h2 className="font-display text-lg font-bold text-[#1E3A29] mb-3">Your website</h2>
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {website.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSection(part.id)}
                      className="group text-left rounded-2xl bg-white border border-[#1E3A29]/8 p-5 hover:border-[#0E8A50]/40 hover:-translate-y-0.5"
                    >
                      <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#1E3A29] text-white mb-4 group-hover:bg-[#0E8A50] transition-colors">
                        <Icon name={part.icon} />
                      </span>
                      <span className="flex items-center gap-1.5 font-display text-lg text-[#1E3A29]">
                        {part.title}
                        <Icon name="arrowRight" className="w-4 h-4 text-[#0E8A50] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </span>
                      <span className="block text-[#1E3A29]/55 text-sm mt-1">{part.text}</span>
                      <span className="block text-[#0B6E40] text-xs font-bold mt-3 min-h-4">{part.state}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-display text-lg font-bold text-[#1E3A29] mb-3">Waiting for you</h2>
                <VisitsView />
              </section>
            </div>
          )}

          {section === 'visits' && <VisitsView />}
          {section === 'bookings' && <BookingsView />}
          {section === 'messages' && <MessagesView />}
          {section === 'events' && <EventsView />}
          {section === 'gallery' && <GalleryView />}
          {section === 'hero' && <HeroView />}
          {section === 'content' && <ContentView />}
        </main>

        {/* the foot of the staff area, in the same colour as the bar above */}
        <footer className="bg-[#1E3A29] text-white/70 text-xs sm:text-sm">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Bushaashe Garuwa · Staff area</span>
            <span className="flex items-center gap-4">
              {email && <span className="truncate max-w-[60vw]">Signed in as {email}</span>}
              <a href="/" target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-[#B9D38A] transition-colors">
                View the website
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
