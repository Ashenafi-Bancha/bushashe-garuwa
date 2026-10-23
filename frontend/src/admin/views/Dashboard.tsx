import { useCallback, useEffect, useRef, useState } from 'react';
import logoSmall from '../../assets/brand/logo-small.webp';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { firstName, useAdminSession } from '../auth/AdminSession';
import Avatar from '../components/Avatar';
import Sheet from '../components/Sheet';
import Sidebar, { type SectionGroup, type SectionId } from '../components/Sidebar';
import { Icon, type IconName } from '../components/icons';
import { InstallCard, Notice, StatCard } from '../components/ui';
import { useStaffApp } from '../pwa';
import AccountView from './AccountView';
import BookingsView from './BookingsView';
import ContentView from './ContentView';
import EventsView from './EventsView';
import GalleryView from './GalleryView';
import HeroView from './HeroView';
import MessagesView from './MessagesView';
import ReviewsView from './ReviewsView';
import ScheduleView, { TodayAgenda } from './ScheduleView';
import StaffView from './StaffView';
import VisitsView from './VisitsView';

/** The words at the top of the work area, so staff always know where they are */
const HEADINGS: Record<SectionId, { title: string; lead: string }> = {
  overview: { title: 'Overview', lead: 'Everything waiting for you today.' },
  schedule: { title: 'Schedule', lead: 'Who is coming, day by day: visits, and events with their bookings.' },
  reviews: { title: 'Guest reviews', lead: 'What guests said, shown on the home page.' },
  visits: { title: 'Visit requests', lead: 'People who asked to come and see Bushaashe Garuwa.' },
  bookings: { title: 'Event bookings', lead: 'Places reserved at the cultural food evenings and other events.' },
  messages: { title: 'Messages', lead: 'Messages sent from the contact page.' },
  events: { title: 'Events', lead: 'Add and change the events shown on the website.' },
  gallery: { title: 'Gallery', lead: 'Add photos to the Gallery page, each with a heading and a description.' },
  hero: { title: 'Page photos', lead: 'The large photograph that opens each page.' },
  content: { title: 'Website text', lead: 'Change the words on the website, in each language.' },
  staff: { title: 'Staff', lead: 'Who can sign in to the staff area.' },
  account: { title: 'My account', lead: 'Your name, your password and this app.' },
};

/** The sections on the phone's tab bar; the others open from More, with a way back */
const TABS: { id: SectionId; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Home', icon: 'overview' },
  { id: 'visits', label: 'Visits', icon: 'visits' },
  { id: 'bookings', label: 'Bookings', icon: 'bookings' },
  { id: 'messages', label: 'Messages', icon: 'messages' },
];

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export default function Dashboard() {
  const { token, user, isOwner, signOut } = useAdminSession();
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
  const [moreOpen, setMoreOpen] = useState(false);
  const setSection = (next: SectionId) => {
    setMoreOpen(false);
    if (next === section) return window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', next === 'overview' ? window.location.pathname : `#${next}`);
    depth.current += 1;
    showSection(next);
    window.scrollTo({ top: 0 });
  };
  const goBack = () => {
    if (depth.current > 0) window.history.back();
    else setSection('overview');
  };
  // only owners see the staff accounts
  const shown: SectionId = section === 'staff' && !isOwner ? 'overview' : section;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

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

  // phones: the small title in the top bar appears once the large one has scrolled away
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const badges: Partial<Record<SectionId, number | undefined>> = {
    visits: summary?.visits.new,
    bookings: summary?.bookings.pending,
    messages: summary?.contact.new,
  };

  const groups: SectionGroup[] = [
    { sections: [{ id: 'overview', label: 'Overview', icon: 'overview' }] },
    {
      title: 'Requests',
      sections: [
        { id: 'schedule', label: 'Schedule', icon: 'schedule' },
        { id: 'visits', label: 'Visit requests', icon: 'visits', badge: badges.visits },
        { id: 'bookings', label: 'Event bookings', icon: 'bookings', badge: badges.bookings },
        { id: 'messages', label: 'Messages', icon: 'messages', badge: badges.messages },
      ],
    },
    {
      title: 'Website',
      sections: [
        { id: 'events', label: 'Events', icon: 'events' },
        { id: 'gallery', label: 'Gallery', icon: 'gallery' },
        { id: 'hero', label: 'Page photos', icon: 'hero' },
        { id: 'content', label: 'Website text', icon: 'text' },
        { id: 'reviews', label: 'Guest reviews', icon: 'star' },
      ],
    },
    {
      title: 'Team',
      sections: [
        ...(isOwner ? [{ id: 'staff' as const, label: 'Staff', icon: 'team' as const }] : []),
        { id: 'account', label: 'My account', icon: 'user' },
      ],
    },
  ];

  const heading = HEADINGS[shown];
  const isTab = TABS.some((tab) => tab.id === shown);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const name = firstName(user);

  const waiting = summary ? summary.visits.new + summary.bookings.pending + summary.contact.new : undefined;
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

  /** The tiles of the More sheet on a phone */
  const moreTiles: { id: SectionId; icon: IconName; label: string }[] = [
    { id: 'schedule', icon: 'schedule', label: 'Schedule' },
    { id: 'events', icon: 'events', label: 'Events' },
    { id: 'gallery', icon: 'gallery', label: 'Gallery' },
    { id: 'hero', icon: 'hero', label: 'Page photos' },
    { id: 'content', icon: 'text', label: 'Website text' },
    { id: 'reviews', icon: 'star', label: 'Reviews' },
    ...(isOwner ? [{ id: 'staff' as const, icon: 'team' as const, label: 'Staff' }] : []),
    { id: 'account', icon: 'user', label: 'My account' },
  ];

  /** The green card that opens the day: who you are, what is waiting, the way to it */
  const welcome = (
    <section className="admin-welcome relative overflow-hidden rounded-[28px] text-white px-5 sm:px-8 py-6 sm:py-8">
      <span aria-hidden="true" className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10" />
      <span aria-hidden="true" className="absolute right-16 -bottom-20 w-40 h-40 rounded-full bg-white/[0.07]" />
      <div className="relative">
        <div className="text-white/75 text-[13px] font-semibold">{today}</div>
        <h2 className="font-display text-[1.85rem] sm:text-4xl font-extrabold leading-tight tracking-tight mt-1">
          {greeting}
          {name ? `, ${name}` : ''}!
        </h2>
        <p className="text-white/85 text-[15px] mt-1.5">
          {waiting === undefined ? 'Fetching what is waiting…' : waiting === 0 ? 'All caught up. Nothing is waiting for you.' : `${plural(waiting, 'thing is', 'things are')} waiting for you.`}
        </p>
        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar -mx-1 px-1">
          {TABS.slice(1).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-white/16 hover:bg-white/24 active:scale-[0.97] backdrop-blur-md px-3.5 py-2 text-[13px] font-bold transition-all"
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
              {(badges[tab.id] ?? 0) > 0 && <span className="min-w-5 h-5 rounded-full bg-white text-[#346A1A] text-[11px] leading-5 px-1.5 tabular-nums">{badges[tab.id]}</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F4EFE4]">
      <Sidebar
        groups={groups}
        current={shown}
        onChoose={setSection}
        onSignOut={signOut}
        user={user}
        onAccount={() => setSection('account')}
        open={false}
        onClose={() => undefined}
        canInstall={app.canInstall}
        onInstall={app.install}
      />

      <div className="lg:pl-[264px] min-h-screen flex flex-col">
        {/* computers: the bar above the work, in its own colour */}
        <header className="hidden lg:block sticky top-0 z-30 bg-[#3F7D20] text-white shadow-[0_8px_22px_-14px_rgba(19,38,26,0.7)]">
          <div className="max-w-screen-xl mx-auto px-8 h-[72px] flex items-center gap-3">
            <h1 className="flex-1 min-w-0 font-display text-2xl font-extrabold text-white leading-tight tracking-tight">
              Bushaashe Garuwa <span className="text-[#DDEBCB] font-bold">Admin Dashboard</span>
            </h1>
            {shown === 'overview' && (
              <button type="button" onClick={loadSummary} className="inline-flex admin-btn-quiet on-dark flex-shrink-0">
                <Icon name="refresh" className="w-4 h-4" />
                Refresh
              </button>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex admin-btn-quiet on-dark flex-shrink-0">
              <Icon name="external" className="w-4 h-4" />
              View the website
            </a>
            <button type="button" onClick={() => setSection('account')} aria-label="My account" className="rounded-full ring-2 ring-white/30 hover:ring-white/60 transition-shadow">
              <Avatar name={user?.name ?? ''} email={user?.email} size="sm" />
            </button>
          </div>
        </header>

        {/* phones: a light bar like an app's, the way back on the left and you on the right */}
        <header className={`lg:hidden sticky top-0 z-30 admin-topbar ${scrolled ? 'is-scrolled' : ''}`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="h-14 px-3 flex items-center gap-2">
            {isTab ? (
              <img src={logoSmall} alt="Bushaashe Garuwa" className="w-9 h-9 rounded-full bg-white object-contain p-0.5 shadow-sm" />
            ) : (
              <button type="button" onClick={goBack} aria-label="Back" className="grid place-items-center w-10 h-10 -ml-1 rounded-full text-[#1E3A29] active:bg-[#1E3A29]/8">
                <Icon name="arrowLeft" className="w-5 h-5" />
              </button>
            )}
            <div className={`flex-1 min-w-0 text-center font-display font-bold text-[16px] text-[#1E3A29] truncate transition-opacity duration-200 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
              {shown === 'overview' ? 'Bushaashe Garuwa' : heading.title}
            </div>
            <button type="button" onClick={() => setSection('account')} aria-label="My account" className="rounded-full active:scale-95 transition-transform">
              <Avatar name={user?.name ?? ''} email={user?.email} size="sm" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-8 pt-2 lg:pt-8 pb-32 lg:pb-10">
          <div key={shown} className="admin-enter">
            {/* where you are */}
            {shown !== 'overview' && (
              <div className="mb-5 sm:mb-8">
                <button type="button" onClick={goBack} className="hidden lg:inline-flex admin-btn-quiet mb-4">
                  <Icon name="arrowLeft" className="w-4 h-4" />
                  Back
                </button>
                <h2 className="font-display text-[2rem] sm:text-4xl font-extrabold text-[#1E3A29] leading-tight tracking-tight">{heading.title}</h2>
                <p className="text-[#1E3A29]/55 text-sm sm:text-base mt-1">{heading.lead}</p>
              </div>
            )}

            {!app.online && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#13261A] text-white px-4 py-3 text-sm">
                <Icon name="wifiOff" className="w-5 h-5 flex-shrink-0" />
                You are offline. Requests and changes will show again as soon as the connection is back.
              </div>
            )}
            {error && app.online && (
              <div className="mb-5">
                <Notice kind="error">{error}</Notice>
              </div>
            )}

            {shown === 'overview' && (
              <div className="space-y-8 sm:space-y-10 pt-2 lg:pt-0">
                {welcome}
                <InstallCard canInstall={app.canInstall} appleHint={app.appleHint} onInstall={app.install} />
                <TodayAgenda onOpen={() => setSection('schedule')} />
                {figures}

                <section>
                  <h2 className="font-display text-lg font-bold text-[#1E3A29] mb-3">Look after the website</h2>
                  {/* a row to swipe through on phones, a grid on computers */}
                  <div className="flex sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                    {website.map((part) => (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => setSection(part.id)}
                        className="group snap-start flex-shrink-0 w-[62%] sm:w-auto text-left admin-card hover:border-[#3F7D20]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
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
                  <h2 className="font-display text-lg font-bold text-[#1E3A29] mb-3">Visits coming up</h2>
                  <VisitsView newCount={summary?.visits.new} />
                </section>
              </div>
            )}

            {shown === 'visits' && <VisitsView newCount={summary?.visits.new} />}
            {shown === 'bookings' && <BookingsView pendingCount={summary?.bookings.pending} />}
            {shown === 'messages' && <MessagesView newCount={summary?.contact.new} />}
            {shown === 'events' && <EventsView />}
            {shown === 'gallery' && <GalleryView />}
            {shown === 'hero' && <HeroView />}
            {shown === 'content' && <ContentView />}
            {shown === 'schedule' && <ScheduleView />}
            {shown === 'reviews' && <ReviewsView />}
            {shown === 'staff' && <StaffView />}
            {shown === 'account' && <AccountView app={app} />}
          </div>
        </main>

        {/* computers: the foot of the staff area */}
        <footer className="hidden lg:block bg-[#3F7D20] text-white/85 text-sm">
          <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Bushaashe Garuwa · Staff area</span>
            <span className="flex items-center gap-4">
              {user && <span className="truncate max-w-[40vw]">Signed in as {user.name || user.email}</span>}
              <a href="/" target="_blank" rel="noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">
                View the website
              </a>
            </span>
          </div>
        </footer>

        {/* phones: the tab bar, floating above the bottom of the screen */}
        <nav className="lg:hidden fixed inset-x-3 z-40" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 10px)' }} aria-label="Main sections">
          <div className="admin-tabbar grid grid-cols-5 gap-1 p-1.5">
            {[...TABS, { id: 'more' as const, label: 'More', icon: 'more' as const }].map((tab) => {
              const active = tab.id === 'more' ? moreOpen || (!isTab && !moreOpen) : shown === tab.id && !moreOpen;
              const badge = tab.id === 'more' ? undefined : badges[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => (tab.id === 'more' ? setMoreOpen(true) : setSection(tab.id))}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center gap-0.5 h-[54px] rounded-[20px] text-[11px] font-bold transition-all duration-300 active:scale-95 ${
                    active ? 'bg-[#3F7D20] text-white shadow-[0_10px_20px_-10px_rgba(63,125,32,0.9)]' : 'text-[#1E3A29]/50'
                  }`}
                >
                  <Icon name={tab.icon} className="w-[22px] h-[22px]" />
                  {tab.label}
                  {badge !== undefined && badge > 0 && (
                    <span className={`absolute top-1 right-[18%] min-w-[18px] h-[18px] rounded-full text-[10px] leading-[18px] px-1 tabular-nums ring-2 ${active ? 'bg-white text-[#346A1A] ring-[#3F7D20]' : 'bg-[#C4622D] text-white ring-white'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* phones: everything else, as a sheet of tiles */}
        <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
          <div className="grid grid-cols-3 gap-2.5">
            {moreTiles.map((tile) => (
              <button key={tile.id} type="button" onClick={() => setSection(tile.id)} className={`admin-tile !flex-col !py-4 ${shown === tile.id ? '!border-[#3F7D20] !bg-[#3F7D20]/8' : ''}`}>
                <span className="grid place-items-center w-11 h-11 rounded-2xl bg-[#3F7D20]/10 text-[#3F7D20]">
                  <Icon name={tile.icon} />
                </span>
                <span className="text-[12px]">{tile.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-white border border-[#1E3A29]/8 divide-y divide-[#1E3A29]/8 overflow-hidden">
            {app.canInstall && (
              <button type="button" onClick={app.install} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-semibold text-[#346A1A] active:bg-[#F4EFE4]">
                <Icon name="download" className="w-5 h-5" />
                Install the staff app
              </button>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 text-[14px] font-semibold text-[#1E3A29] active:bg-[#F4EFE4]">
              <Icon name="external" className="w-5 h-5 text-[#1E3A29]/60" />
              View the website
            </a>
            <button type="button" onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-semibold text-[#C62828] active:bg-[#C62828]/5">
              <Icon name="signOut" className="w-5 h-5" />
              Sign out
            </button>
          </div>
          <p className="text-center text-[11px] text-[#1E3A29]/40 mt-4">© {new Date().getFullYear()} Bushaashe Garuwa · Staff app</p>
        </Sheet>
      </div>
    </div>
  );
}
