import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Sidebar, { type SectionGroup, type SectionId } from '../components/Sidebar';
import { Icon, type IconName } from '../components/icons';
import { InstallCard, Notice, StatCard } from '../components/ui';
import { useStaffApp } from '../pwa';
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
  const app = useStaffApp();
  // the section is kept in the address (#visits…), so the phone's Back button and the app shortcuts work
  const fromHash = (): SectionId => {
    const id = window.location.hash.slice(1);
    return (Object.keys(HEADINGS) as SectionId[]).includes(id as SectionId) ? (id as SectionId) : 'overview';
  };
  const [section, showSection] = useState<SectionId>(fromHash);
  // how many sections were opened here, so Back can step back through them
  const depth = useRef(0);
  useEffect(() => {
    const onPop = () => {
      depth.current = Math.max(0, depth.current - 1);
      showSection(fromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const setSection = (next: SectionId) => {
    if (next === section) return;
    window.history.pushState(null, '', next === 'overview' ? window.location.pathname : `#${next}`);
    depth.current += 1;
    showSection(next);
    window.scrollTo({ top: 0 });
  };
  const goBack = () => {
    if (depth.current > 0) window.history.back();
    else setSection('overview');
  };
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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

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
        canInstall={app.canInstall}
        onInstall={app.install}
      />

      <div className="lg:pl-[264px] min-h-screen flex flex-col">
        {/* the bar above the work, in its own colour: where you are, and the way back to the menu on a phone */}
        <header className="sticky top-0 z-30 bg-[#3F7D20] text-white shadow-[0_8px_22px_-14px_rgba(19,38,26,0.7)]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
              <h1 className="font-display text-base sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                Bushaashe Garuwa <span className="text-[#DDEBCB] font-bold">Admin Dashboard</span>
              </h1>
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
          {/* where you are: the way back, the page's name and what it is for */}
          <div className="mb-6 sm:mb-8">
            {section !== 'overview' && (
              <button type="button" onClick={goBack} className="inline-flex admin-btn-quiet mb-4">
                <Icon name="arrowLeft" className="w-4 h-4" />
                Back
              </button>
            )}
            {section === 'overview' && <div className="text-[#346A1A] text-sm font-bold mb-1">{today}</div>}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] leading-tight tracking-tight">
              {section === 'overview' ? `${greeting}!` : heading.title}
            </h2>
            <p className="text-[#1E3A29]/60 text-sm sm:text-base mt-1">{heading.lead}</p>
          </div>

          {!app.online && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#13261A] text-white px-4 py-3 text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14.5 10.4A10 10 0 0 1 19 13" /></svg>
              You are offline. Requests and changes will show again as soon as the connection is back.
            </div>
          )}
          {error && app.online && (
            <div className="mb-6">
              <Notice kind="error">{error}</Notice>
            </div>
          )}

          {section === 'overview' && (
            <div className="space-y-10">
              <InstallCard canInstall={app.canInstall} appleHint={app.appleHint} onInstall={app.install} />
              {figures}

              <section>
                <h2 className="font-display text-lg font-bold text-[#1E3A29] mb-3">Look after the website</h2>
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {website.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSection(part.id)}
                      className="group text-left rounded-2xl bg-white border border-[#1E3A29]/8 p-5 shadow-[0_1px_2px_rgba(30,58,41,0.04),0_12px_26px_-22px_rgba(30,58,41,0.35)] transition-all duration-300 hover:border-[#3F7D20]/40 hover:-translate-y-0.5"
                    >
                      <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#3F7D20]/10 text-[#3F7D20] mb-4 group-hover:bg-[#3F7D20] group-hover:text-white transition-colors">
                        <Icon name={part.icon} />
                      </span>
                      <span className="flex items-center gap-1.5 font-display text-lg text-[#1E3A29]">
                        {part.title}
                        <Icon name="arrowRight" className="w-4 h-4 text-[#3F7D20] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </span>
                      <span className="block text-[#1E3A29]/55 text-sm mt-1">{part.text}</span>
                      <span className="block text-[#346A1A] text-xs font-bold mt-3 min-h-4">{part.state}</span>
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
        <footer className="bg-[#3F7D20] text-white/85 text-xs sm:text-sm pb-[76px] lg:pb-0">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Bushaashe Garuwa · Staff area</span>
            <span className="flex items-center gap-4">
              {email && <span className="truncate max-w-[60vw]">Signed in as {email}</span>}
              <a href="/" target="_blank" rel="noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">
                View the website
              </a>
            </span>
          </div>
        </footer>

        {/* phones: the day's work one tap away, as in an app */}
        <nav
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1E3A29]/10 shadow-[0_-10px_24px_-18px_rgba(19,38,26,0.4)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Main sections"
        >
          <div className="grid grid-cols-5">
            {(
              [
                { id: 'overview', label: 'Home', icon: 'overview' },
                { id: 'visits', label: 'Visits', icon: 'visits', badge: summary?.visits.new },
                { id: 'bookings', label: 'Bookings', icon: 'bookings', badge: summary?.bookings.pending },
                { id: 'messages', label: 'Messages', icon: 'messages', badge: summary?.contact.new },
              ] as { id: SectionId; label: string; icon: IconName; badge?: number }[]
            ).map((tab) => {
              const active = section === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSection(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-bold transition-colors ${active ? 'text-[#346A1A]' : 'text-[#1E3A29]/50'}`}
                >
                  <span className={`grid place-items-center w-12 h-8 rounded-full transition-colors ${active ? 'bg-[#3F7D20]/12' : ''}`}>
                    <Icon name={tab.icon} className="w-5 h-5" />
                  </span>
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute top-1.5 left-1/2 ml-2 min-w-[18px] h-[18px] rounded-full bg-[#C4622D] text-white text-[10px] leading-[18px] px-1 tabular-nums">{tab.badge}</span>
                  )}
                </button>
              );
            })}
            <button type="button" onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-bold text-[#1E3A29]/50">
              <span className="grid place-items-center w-12 h-8 rounded-full">
                <Icon name="more" className="w-5 h-5" />
              </span>
              More
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
