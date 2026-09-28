import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Sidebar, { type Section, type SectionId } from '../components/Sidebar';
import { Notice, StatCard } from '../components/ui';
import BookingsView from './BookingsView';
import ContentView from './ContentView';
import EventsView from './EventsView';
import MessagesView from './MessagesView';
import VisitsView from './VisitsView';

/** The words at the top of the work area, so staff always know where they are */
const HEADINGS: Record<SectionId, { title: string; lead: string }> = {
  overview: { title: 'Overview', lead: 'Everything waiting for you today.' },
  visits: { title: 'Visit requests', lead: 'People who asked to come and see Bushaashe Garuwa.' },
  bookings: { title: 'Event bookings', lead: 'Places reserved at the cultural food evenings and other events.' },
  messages: { title: 'Messages', lead: 'Messages sent from the contact page.' },
  events: { title: 'Events', lead: 'Add and change the events shown on the website.' },
  content: { title: 'Website text', lead: 'Change the words on the website, in each language.' },
};

export default function Dashboard() {
  const { key, signOut } = useAdminSession();
  const [section, setSection] = useState<SectionId>('overview');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      setSummary(await adminApi.summary(key));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the counts');
    }
  }, [key]);

  // the counts follow the work: fresh on every section change, and once a minute
  useEffect(() => {
    void loadSummary();
  }, [loadSummary, section]);

  useEffect(() => {
    const timer = setInterval(() => void loadSummary(), 60_000);
    return () => clearInterval(timer);
  }, [loadSummary]);

  const sections: Section[] = [
    { id: 'overview', label: 'Overview', hint: 'The numbers at a glance' },
    { id: 'visits', label: 'Visit requests', hint: 'People asking to visit', badge: summary?.visits.new },
    { id: 'bookings', label: 'Event bookings', hint: 'Places reserved', badge: summary?.bookings.pending },
    { id: 'messages', label: 'Messages', hint: 'From the contact page', badge: summary?.contact.new },
    { id: 'events', label: 'Events', hint: 'Dates on the website' },
    { id: 'content', label: 'Website text', hint: 'The words on the pages' },
  ];

  const heading = HEADINGS[section];

  // requests, bookings and messages moved on from "new" since midnight
  const handledToday = summary
    ? summary.visits.handledToday + summary.bookings.handledToday + summary.contact.handledToday
    : undefined;

  const figures = (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
      <StatCard label="Handled today" value={handledToday ?? '–'} hint={handledToday ? 'Well done' : 'Nothing handled yet'} />
      <StatCard label="Upcoming events" value={summary?.events.upcoming ?? '–'} hint={`${summary?.events.drafts ?? 0} not published`} />
      <StatCard label="Guests booked" value={summary?.bookings.guestsUpcoming ?? '–'} hint={`${summary?.bookings.pending ?? 0} to call back`} />
      <StatCard label="Upcoming visits" value={summary?.visits.upcoming ?? '–'} hint={`${summary?.visits.new ?? 0} not handled`} />
      <StatCard label="New messages" value={summary?.contact.new ?? '–'} hint={`${summary?.contact.last7Days ?? 0} this week`} />
      <StatCard label="Edited texts" value={summary?.content.edited ?? '–'} hint="Changed from here" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Sidebar
        sections={sections}
        current={section}
        onChoose={setSection}
        onSignOut={signOut}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-[260px]">
        {/* the bar above the work: where you are, and the way back to the menu on a phone */}
        <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur border-b border-[#12150F]/8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open the menu"
              className="lg:hidden flex-shrink-0 w-11 h-11 rounded-xl border border-[#12150F]/10 bg-white grid place-items-center text-[#12150F]"
            >
              <span className="w-[18px] flex flex-col gap-[5px]">
                <span className="block h-[1.5px] rounded-full bg-current" />
                <span className="block h-[1.5px] rounded-full bg-current" />
                <span className="block h-[1.5px] rounded-full bg-current" />
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#12150F] leading-tight truncate">{heading.title}</h1>
              <p className="text-[#12150F]/50 text-xs sm:text-sm truncate">{heading.lead}</p>
            </div>

            <button type="button" onClick={loadSummary} className="hidden sm:inline-flex admin-btn-quiet flex-shrink-0">
              Refresh
            </button>
          </div>
        </header>

        <main className="max-w-screen-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {error && (
            <div className="mb-6">
              <Notice kind="error">{error}</Notice>
            </div>
          )}

          {section === 'overview' && (
            <div className="space-y-8">
              {figures}
              <div>
                <h2 className="font-display text-lg font-bold text-[#12150F] mb-3">Waiting for you</h2>
                <VisitsView />
              </div>
            </div>
          )}

          {section === 'visits' && <VisitsView />}
          {section === 'bookings' && <BookingsView />}
          {section === 'messages' && <MessagesView />}
          {section === 'events' && <EventsView />}
          {section === 'content' && <ContentView />}
        </main>
      </div>
    </div>
  );
}
