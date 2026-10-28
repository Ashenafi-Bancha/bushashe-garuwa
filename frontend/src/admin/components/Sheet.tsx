import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './icons';

/**
 * A panel that slides up from the bottom of a phone, like the sheets of a
 * phone app, and opens as a window in the middle of a computer screen.
 * Closes with its button, a tap outside it, or the Escape key.
 */
export default function Sheet({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** a wider window on computers */
  wide?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  // the latest onClose, so the effect below runs only when the sheet opens or closes (not on every keystroke)
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={() => closeRef.current()} className="admin-backdrop absolute inset-0 bg-[#13261A]/45 backdrop-blur-[3px]" />
      <div
        ref={panel}
        tabIndex={-1}
        className={`admin-sheet relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[92svh] overflow-y-auto overscroll-contain bg-[var(--a-bg)] rounded-t-[22px] sm:rounded-2xl shadow-[0_-20px_60px_-20px_rgba(19,38,26,0.45)] outline-none`}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        {/* the grip a phone sheet is pulled by */}
        <div className="sm:hidden sticky top-0 z-10 flex justify-center pt-2.5 pb-1 bg-[var(--a-bg)]">
          <span className="w-10 h-1.5 rounded-full bg-[#1E3A29]/15" />
        </div>
        {title && (
          <div className="sticky top-0 sm:top-0 z-10 flex items-center justify-between gap-3 px-5 sm:px-6 pt-2 sm:pt-5 pb-3 bg-[var(--a-bg)]">
            <h2 className="text-[18px] font-bold text-[var(--a-ink)] tracking-[-0.01em]">{title}</h2>
            <button type="button" onClick={() => closeRef.current()} aria-label="Close" className="admin-icon-btn bordered">
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="px-5 sm:px-6 pb-2">{children}</div>
      </div>
    </div>
  );
}
