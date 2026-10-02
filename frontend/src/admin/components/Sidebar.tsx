import logo from '../../assets/brand/logo.png';
import { Icon, type IconName } from './icons';

export type SectionId = 'overview' | 'visits' | 'bookings' | 'messages' | 'events' | 'gallery' | 'hero' | 'content';

export type Section = {
  id: SectionId;
  label: string;
  icon: IconName;
  /** number shown on the right; left out when there is nothing waiting */
  badge?: number;
};

/** The menu in parts: the day's work first, then what is shown on the website */
export type SectionGroup = { title?: string; sections: Section[] };

const ITEM = 'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors';
const QUIET = 'text-[#1E3A29]/65 hover:bg-[#1E3A29]/5 hover:text-[#1E3A29]';

/**
 * The staff menu: the same list on every screen, as a column beside the work on
 * wide screens and as a drawer behind the menu button on narrow ones.
 */
export default function Sidebar({
  groups,
  current,
  onChoose,
  onSignOut,
  email,
  open,
  onClose,
}: {
  groups: SectionGroup[];
  current: SectionId;
  onChoose: (id: SectionId) => void;
  onSignOut: () => void;
  /** who is signed in */
  email?: string;
  open: boolean;
  onClose: () => void;
}) {
  const list = (
    <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Staff sections">
      {groups.map((group, i) => (
        <div key={group.title ?? i} className={i > 0 ? 'mt-6' : ''}>
          {group.title && (
            <div className="px-3 mb-2 text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E3A29]/40">{group.title}</div>
          )}
          <div className="space-y-1">
            {group.sections.map((section) => {
              const active = section.id === current;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    onChoose(section.id);
                    onClose();
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`${ITEM} text-left ${active ? 'bg-[#0E8A50] text-white shadow-[0_10px_22px_-14px_rgba(14,138,80,0.9)]' : QUIET}`}
                >
                  <Icon name={section.icon} />
                  <span className="flex-1 truncate">{section.label}</span>
                  {section.badge !== undefined && section.badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                        active ? 'bg-white text-[#0B6E40]' : 'bg-[#C4622D] text-white'
                      }`}
                    >
                      {section.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const panel = (
    <div className="flex h-full flex-col bg-white border-r border-[#1E3A29]/10">
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-[#1E3A29]/8">
        <img src={logo} alt="" className="w-10 h-10 rounded-full object-contain flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-display text-[#1E3A29] text-[15px] font-bold leading-none truncate">Bushaashe Garuwa</div>
          <div className="text-[#0E8A50] text-[10px] font-bold tracking-[0.18em] uppercase mt-1.5">Staff area</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the menu"
          className="lg:hidden ml-auto grid place-items-center w-10 h-10 rounded-xl text-[#1E3A29]/60 hover:bg-[#1E3A29]/5"
        >
          <Icon name="close" />
        </button>
      </div>

      {list}

      <div className="px-3 py-4 border-t border-[#1E3A29]/8 space-y-1">
        <a href="/" className={`${ITEM} ${QUIET}`}>
          <Icon name="external" />
          View the website
        </a>
        <button type="button" onClick={onSignOut} className={`${ITEM} text-left ${QUIET}`}>
          <Icon name="signOut" />
          Sign out
        </button>
        {email && (
          <div className="flex items-center gap-3 rounded-xl bg-[#F4EFE4] px-3 py-2.5 mt-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#1E3A29] text-white text-sm font-bold uppercase flex-shrink-0">
              {email[0]}
            </span>
            <div className="min-w-0">
              <div className="text-[#1E3A29]/45 text-[10px] font-bold tracking-[0.14em] uppercase">Signed in</div>
              <div className="text-[#1E3A29] text-[13px] font-semibold truncate" title={email}>{email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* wide screens: the column is always there */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[264px] z-40">{panel}</aside>

      {/* narrow screens: a drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button type="button" aria-label="Close the menu" onClick={onClose} className="absolute inset-0 bg-[#13261A]/50 backdrop-blur-sm" />
        <div
          className={`absolute inset-y-0 left-0 w-[86%] max-w-[300px] shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {panel}
        </div>
      </div>
    </>
  );
}
