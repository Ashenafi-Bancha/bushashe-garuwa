import logo from '../../assets/brand/logo-small.webp';
import { ROLE_LABELS, type StaffUser } from '../api/types';
import Avatar from './Avatar';
import { Icon, type IconName } from './icons';

export type SectionId =
  | 'overview'
  | 'visits'
  | 'bookings'
  | 'messages'
  | 'events'
  | 'gallery'
  | 'hero'
  | 'content'
  | 'staff'
  | 'account'
  | 'schedule'
  | 'reviews';

export type Section = {
  id: SectionId;
  label: string;
  icon: IconName;
  /** number shown on the right; left out when there is nothing waiting */
  badge?: number;
};

/** The menu in parts: the day's work first, then what is shown on the website */
export type SectionGroup = { title?: string; sections: Section[] };

/**
 * The staff menu on computers: a quiet white column beside the work. The
 * sections scroll on their own; the person signed in stays at the foot.
 * Phones use the tab bar and the More sheet instead (see Dashboard).
 */
export default function Sidebar({
  groups,
  current,
  onChoose,
  onSignOut,
  user,
  onAccount,
  canInstall = false,
  onInstall,
}: {
  groups: SectionGroup[];
  current: SectionId;
  onChoose: (id: SectionId) => void;
  onSignOut: () => void;
  /** who is signed in */
  user: StaffUser | null;
  /** opens My account */
  onAccount: () => void;
  /** the browser offers to install the staff app */
  canInstall?: boolean;
  onInstall?: () => void;
}) {
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[248px] flex-col bg-white border-r border-[var(--a-border)]">
      {/* who this is */}
      <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0">
        <img src={logo} alt="" className="w-9 h-9 rounded-full object-contain bg-white ring-1 ring-[var(--a-border)]" />
        <div className="min-w-0 leading-tight">
          <div className="text-[14px] font-bold text-[var(--a-ink)] truncate">Bushaashe Garuwa</div>
          <div className="text-[12px] text-[var(--a-muted)]">Staff area</div>
        </div>
      </div>

      {/* the sections */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 pb-4" aria-label="Staff sections">
        {groups.map((group, i) => (
          <div key={group.title ?? i} className={i > 0 ? 'mt-5' : 'mt-2'}>
            {group.title && <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--a-faint)]">{group.title}</div>}
            <div className="space-y-0.5">
              {group.sections.map((section) => {
                const active = section.id === current;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onChoose(section.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`admin-nav-item ${active ? 'is-active' : ''}`}
                  >
                    <Icon name={section.icon} className="w-[18px] h-[18px]" />
                    <span className="flex-1 truncate">{section.label}</span>
                    {section.badge !== undefined && section.badge > 0 && <span className="admin-count">{section.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* the app, the website, and you */}
      <div className="flex-shrink-0 border-t border-[var(--a-border)] p-3 space-y-0.5">
        {canInstall && onInstall && (
          <button type="button" onClick={onInstall} className="admin-nav-item text-[var(--a-brand)]">
            <Icon name="download" className="w-[18px] h-[18px]" />
            Install the staff app
          </button>
        )}
        <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item">
          <Icon name="external" className="w-[18px] h-[18px]" />
          View the website
        </a>
        {user && (
          <div className={`flex items-center gap-2 rounded-xl p-1.5 mt-2 ${current === 'account' ? 'bg-[var(--a-brand-soft)]' : ''}`}>
            <button type="button" onClick={onAccount} className="flex-1 min-w-0 flex items-center gap-2.5 rounded-lg p-1 text-left hover:bg-[var(--a-hover)]">
              <Avatar name={user.name} email={user.email} size="sm" />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-[var(--a-ink)] truncate">{user.name || user.email}</span>
                <span className="block text-[11px] text-[var(--a-muted)]">{ROLE_LABELS[user.role]}</span>
              </span>
            </button>
            <button type="button" onClick={onSignOut} aria-label="Sign out" title="Sign out" className="admin-icon-btn">
              <Icon name="signOut" className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
