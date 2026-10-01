import logo from '../../assets/brand/logo.png';

export type SectionId = 'overview' | 'visits' | 'bookings' | 'messages' | 'events' | 'content';

export type Section = {
  id: SectionId;
  label: string;
  /** one line under the label, so staff know what the section is for */
  hint: string;
  /** number shown on the right; left out when there is nothing waiting */
  badge?: number;
};

/**
 * The staff menu: the same list on every screen, as a column beside the work on
 * wide screens and as a drawer behind the menu button on narrow ones.
 */
export default function Sidebar({
  sections,
  current,
  onChoose,
  onSignOut,
  email,
  open,
  onClose,
}: {
  sections: Section[];
  current: SectionId;
  onChoose: (id: SectionId) => void;
  onSignOut: () => void;
  /** who is signed in */
  email?: string;
  open: boolean;
  onClose: () => void;
}) {
  const list = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Staff sections">
      {sections.map((section) => {
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
            className={`w-full text-left rounded-2xl px-4 py-3 transition-colors ${
              active ? 'bg-[#86A94F] text-[#13261A]' : 'text-white/65 hover:bg-white/6 hover:text-white'
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-semibold text-sm">{section.label}</span>
              {section.badge !== undefined && section.badge > 0 && (
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                    active ? 'bg-[#13261A] text-white' : 'bg-white/12 text-white/80'
                  }`}
                >
                  {section.badge}
                </span>
              )}
            </span>
            <span className={`block text-[11px] leading-snug mt-1 ${active ? 'text-[#13261A]/65' : 'text-white/40'}`}>{section.hint}</span>
          </button>
        );
      })}
    </nav>
  );

  const panel = (
    <div className="flex h-full flex-col bg-[#13261A]">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <img src={logo} alt="" className="w-10 h-10 rounded-full bg-white/90 object-contain p-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-display text-white text-[15px] font-bold leading-none truncate">Bushaashe Garuwa</div>
          <div className="text-[#B9D38A] text-[10px] tracking-[0.18em] uppercase mt-1.5">Staff area</div>
        </div>
      </div>

      {list}

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {email && (
          <div className="px-4 pb-2">
            <div className="text-white/40 text-[10px] tracking-[0.18em] uppercase">Signed in as</div>
            <div className="text-white/85 text-sm font-semibold truncate" title={email}>{email}</div>
          </div>
        )}
        <a
          href="/"
          className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/6 hover:text-white transition-colors"
        >
          View the website
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/6 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* wide screens: the column is always there */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] z-40">{panel}</aside>

      {/* narrow screens: a drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <button type="button" aria-label="Close the menu" onClick={onClose} className="absolute inset-0 bg-[#13261A]/60 backdrop-blur-sm" />
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
