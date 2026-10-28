import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import logoSmall from '../../assets/brand/logo-small.webp';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { firstName, useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
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
  visits: { title: 'Visit requests', lead: 'People who asked to come and see Bushaashe Garuwa.' },
  bookings: { title: 'Event bookings', lead: 'Places reserved at the cultural food evenings and other events.' },
  messages: { title: 'Messages', lead: 'Messages sent from the contact page.' },
  events: { title: 'Events', lead: 'The events shown on the website.' },
  gallery: { title: 'Gallery', lead: 'Photos on the Gallery page, each with a heading and a description.' },
  hero: { title: 'Page photos', lead: 'The large photograph that opens each page.' },
  content: { title: 'Website text', lead: 'Change the words on the website, in each language.' },
  reviews: { title: 'Guest reviews', lead: 'What guests said, shown on the home page.' },
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

/** One thing waiting for an answer, in the Overview's list */
type Waiting = { key: string; section: SectionId; icon: IconName; name: string; detail: string; at: string };

/** The newest unanswered visit requests, bookings and messages, together, newest first */
function NeedsAttention({ onOpen, refreshKey }: { onOpen: (section: SectionId) => void; refreshKey: unknown }) {
  const { token } = useAdminSession();
  const [items, setItems] = useState<Waiting[] | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([
      adminApi.visits(token, 1, { pageSize: 6, status: 'new' }),
      adminApi.bookings(token, 1, '', undefined, 'pending'),
      adminApi.messages(token, 1, '', 'new'),
    ])
      .then(([visits, bookings, messages]) => {
        if (!live) return;
        const all: Waiting[] = [
          ...visits.items.map((v) => ({ key: `v${v.id}`, section: 'visits' as const, icon: 'visits' as const, name: v.name, detail: `Visit · ${new Date(`${v.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${v.visitors} ${v.visitors === '1' ? 'guest' : 'guests'}`, at: v.createdAt })),
          ...bookings.items.map((b) => ({ key: `b${b.id}`, section: 'bookings' as const, icon: 'bookings' as const, name: b.name, detail: `Booking · ${b.eventName ?? 'Event'} · ${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}`, at: b.createdAt })),
          ...messages.items.map((m) => ({ key: `m${m.id}`, section: 'messages' as const, icon: 'messages' as const, name: m.name, detail: m.message, at: m.createdAt })),
        ];
        setItems(all.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6));
      })
      .catch(() => live && setItems([]));
    return () => {
      live = false;
    };
  }, [token, refreshKey]);

  return (
    <section className="admin-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <h2 className="admin-h3">Needs your attention</h2>
        {items && items.length > 0 && <span className="text-[12px] text-[var(--a-muted)]">Newest first</span>}
      </div>
      {!items ? (
        <div className="px-5 pb-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="admin-shimmer block h-10 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-5 pb-8 pt-4 text-center">
          <span className="inline-grid place-items-center w-11 h-11 rounded-full bg-[var(--a-brand-soft)] text-[var(--a-brand)] mb-2">
            <Icon name="checkCircle" />
          </span>
          <p className="text-[14px] font-semibold text-[var(--a-ink)]">All caught up</p>
          <p className="text-[13px] text-[var(--a-muted)]">No new requests or messages.</p>
        </div>
      ) : (
        <ul className="border-t border-[var(--a-border)] divide-y divide-[var(--a-border)]">
          {items.map((item) => (
            <li key={item.key}>
              <button type="button" onClick={() => onOpen(item.section)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[var(--a-hover)] transition-colors">
                <Avatar name={item.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-[var(--a-ink)] truncate">{item.name}</span>
                  <span className="block text-[13px] text-[var(--a-muted)] truncate">{item.detail}</span>
                </span>
                <span className="text-[12px] text-[var(--a-faint)] whitespace-nowrap">{timeAgo(item.at)}</span>
                <Icon name="chevronRight" className="w-4 h-4 text-[var(--a-faint)]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** The title of a section, what it is for, and its main buttons on the right */
function PageHeader({ title, lead, actions }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 mb-5 sm:mb-7">
      <div className="min-w-0">
        <h1 className="admin-h1">{title}</h1>
        {lead && <p className="text-[14px] sm:text-[15px] text-[var(--a-muted)] mt-1">{lead}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

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

  // phones: a hairline under the top bar once the page scrolls under it
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 44);
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
    ...(isOwner ? [{ title: 'Team', sections: [{ id: 'staff' as const, label: 'Staff', icon: 'team' as const }] }] : []),
  ];

  const heading = HEADINGS[shown];
  const isTab = TABS.some((tab) => tab.id === shown);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const name = firstName(user);

  const waiting = summary ? summary.visits.new + summary.bookings.pending + summary.contact.new : undefined;
  // requests, bookings and messages moved on from "new" since midnight
  const handledToday = summary ? summary.visits.handledToday + summary.bookings.handledToday + summary.contact.handledToday : undefined;

  /** The parts of the website staff look after, each a way into its section */
  const website: { id: SectionId; icon: IconName; title: string; state: string }[] = [
    { id: 'events', icon: 'events', title: 'Events', state: summary ? `${summary.events.upcoming} upcoming` : '' },
    { id: 'gallery', icon: 'gallery', title: 'Gallery', state: summary?.media ? plural(summary.media.gallery, 'photo added', 'photos added') : '' },
    { id: 'hero', icon: 'hero', title: 'Page photos', state: summary?.media ? plural(summary.media.heroes, 'of yours', 'of yours') : '' },
    { id: 'content', icon: 'text', title: 'Website text', state: summary ? plural(summary.content.edited, 'text edited', 'texts edited') : '' },
    { id: 'reviews', icon: 'star', title: 'Guest reviews', state: '' },
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

  const overview = (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title={`${greeting}${name ? `, ${name}` : ''}`}
        lead={
          <>
            {today} ·{' '}
            {waiting === undefined ? 'checking what is waiting…' : waiting === 0 ? 'nothing is waiting for you.' : <strong className="font-semibold text-[var(--a-ink)]">{plural(waiting, 'thing is', 'things are')} waiting for you.</strong>}
          </>
        }
        actions={
          <button type="button" onClick={loadSummary} className="hidden sm:inline-flex admin-btn-quiet">
            <Icon name="refresh" className="w-4 h-4" />
            Refresh
          </button>
        }
      />

      <InstallCard canInstall={app.canInstall} appleHint={app.appleHint} onInstall={app.install} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon="visits" label="Upcoming visits" value={summary?.visits.upcoming ?? '–'} hint={`${summary?.visits.new ?? 0} not handled`} onClick={() => setSection('visits')} />
        <StatCard icon="guests" label="Guests booked" value={summary?.bookings.guestsUpcoming ?? '–'} hint={`${summary?.bookings.pending ?? 0} to call back`} onClick={() => setSection('bookings')} />
        <StatCard icon="messages" label="New messages" value={summary?.contact.new ?? '–'} hint={`${summary?.contact.last7Days ?? 0} this week`} onClick={() => setSection('messages')} />
        <StatCard icon="checkCircle" label="Handled today" value={handledToday ?? '–'} hint={handledToday ? 'Well done' : 'Nothing yet'} />
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 items-start">
        <NeedsAttention onOpen={setSection} refreshKey={summary?.generatedAt} />
        <div className="space-y-5">
          <TodayAgenda onOpen={() => setSection('schedule')} />
          <section className="admin-card !p-0 overflow-hidden">
            <h2 className="admin-h3 px-5 pt-4 pb-3">The website</h2>
            <ul className="border-t border-[var(--a-border)] divide-y divide-[var(--a-border)]">
              {website.map((part) => (
                <li key={part.id}>
                  <button type="button" onClick={() => setSection(part.id)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[var(--a-hover)] transition-colors">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--a-brand-soft)] text-[var(--a-brand)]">
                      <Icon name={part.icon} className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-[14px] font-semibold text-[var(--a-ink)]">{part.title}</span>
                    <span className="text-[12px] text-[var(--a-muted)]">{part.state}</span>
                    <Icon name="chevronRight" className="w-4 h-4 text-[var(--a-faint)]" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-root min-h-screen">
      <Sidebar
        groups={groups}
        current={shown}
        onChoose={setSection}
        onSignOut={signOut}
        user={user}
        onAccount={() => setSection('account')}
        canInstall={app.canInstall}
        onInstall={app.install}
      />

      <div className="lg:pl-[248px] min-h-screen flex flex-col">
        {/* phones: a light top bar, the way back or the logo on the left, the section in the middle, you on the right */}
        <header className={`lg:hidden sticky top-0 z-30 admin-topbar ${scrolled ? 'is-scrolled' : ''}`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="h-14 px-2 grid grid-cols-[44px_1fr_44px] items-center">
            {isTab ? (
              <img src={logoSmall} alt="Bushaashe Garuwa" className="w-9 h-9 ml-1 rounded-full bg-white object-contain ring-1 ring-[var(--a-border)]" />
            ) : (
              <button type="button" onClick={goBack} aria-label="Back" className="admin-icon-btn !w-11 !h-11">
                <Icon name="arrowLeft" className="w-5 h-5" />
              </button>
            )}
            {/* the section's name appears here once its large title has scrolled away */}
            <div className={`text-center text-[16px] font-semibold text-[var(--a-ink)] truncate transition-opacity duration-200 ${scrolled || shown === 'overview' ? 'opacity-100' : 'opacity-0'}`}>{shown === 'overview' ? 'Bushaashe Garuwa' : heading.title}</div>
            <button type="button" onClick={() => setSection('account')} aria-label="My account" className="justify-self-end mr-1 rounded-full active:scale-95 transition-transform">
              <Avatar name={user?.name ?? ''} email={user?.email} size="sm" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 lg:pt-9 pb-28 lg:pb-12">
          <div key={shown} className="admin-enter">
            {!app.online && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-[var(--a-ink)] text-white px-4 py-3 text-sm">
                <Icon name="wifiOff" className="w-5 h-5 flex-shrink-0" />
                You are offline. Requests and changes will show again as soon as the connection is back.
              </div>
            )}
            {error && app.online && (
              <div className="mb-5">
                <Notice kind="error">{error}</Notice>
              </div>
            )}

            {shown === 'overview' ? overview : <PageHeader title={heading.title} lead={heading.lead} />}

            {shown === 'schedule' && <ScheduleView />}
            {shown === 'visits' && <VisitsView newCount={summary?.visits.new} />}
            {shown === 'bookings' && <BookingsView pendingCount={summary?.bookings.pending} />}
            {shown === 'messages' && <MessagesView newCount={summary?.contact.new} />}
            {shown === 'events' && <EventsView />}
            {shown === 'gallery' && <GalleryView />}
            {shown === 'hero' && <HeroView />}
            {shown === 'content' && <ContentView />}
            {shown === 'reviews' && <ReviewsView />}
            {shown === 'staff' && <StaffView />}
            {shown === 'account' && <AccountView app={app} />}
          </div>
        </main>

        {/* phones: the tab bar along the foot of the screen */}
        <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 admin-tabbar" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Main sections">
          <div className="grid grid-cols-5 h-[60px]">
            {[...TABS, { id: 'more' as const, label: 'More', icon: 'more' as const }].map((tab) => {
              const active = tab.id === 'more' ? moreOpen || (!isTab && !moreOpen) : shown === tab.id && !moreOpen;
              const badge = tab.id === 'more' ? undefined : badges[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => (tab.id === 'more' ? setMoreOpen(true) : setSection(tab.id))}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${active ? 'text-[var(--a-brand)]' : 'text-[var(--a-muted)]'}`}
                >
                  <span className={`grid place-items-center w-14 h-7 rounded-full transition-colors ${active ? 'bg-[var(--a-brand-soft)]' : ''}`}>
                    <Icon name={tab.icon} className="w-[21px] h-[21px]" />
                  </span>
                  {tab.label}
                  {badge !== undefined && badge > 0 && <span className="absolute top-1.5 left-1/2 ml-2.5 admin-count !min-w-[18px] !h-[18px] !text-[10px] ring-2 ring-white">{badge}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* phones: everything else, as a sheet of tiles */}
        <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
          <div className="grid grid-cols-3 gap-2">
            {moreTiles.map((tile) => (
              <button key={tile.id} type="button" onClick={() => setSection(tile.id)} className={`admin-tile !flex-col !py-4 ${shown === tile.id ? '!border-[var(--a-brand)] !bg-[var(--a-brand-soft)]' : ''}`}>
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--a-brand-soft)] text-[var(--a-brand)]">
                  <Icon name={tile.icon} />
                </span>
                <span className="text-[12px]">{tile.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-white border border-[var(--a-border)] divide-y divide-[var(--a-border)] overflow-hidden">
            {app.canInstall && (
              <button type="button" onClick={app.install} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-semibold text-[var(--a-brand)] active:bg-[var(--a-hover)]">
                <Icon name="download" className="w-5 h-5" />
                Install the staff app
              </button>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 text-[14px] font-semibold text-[var(--a-ink)] active:bg-[var(--a-hover)]">
              <Icon name="external" className="w-5 h-5 text-[var(--a-muted)]" />
              View the website
            </a>
            <button type="button" onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-semibold text-[#C62828] active:bg-[#C62828]/5">
              <Icon name="signOut" className="w-5 h-5" />
              Sign out
            </button>
          </div>
          <p className="text-center text-[11px] text-[var(--a-faint)] mt-4">© {new Date().getFullYear()} Bushaashe Garuwa · Staff app</p>
        </Sheet>
      </div>
    </div>
  );
}
