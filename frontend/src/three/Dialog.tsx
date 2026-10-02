import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n/I18nProvider';
import { lockScroll } from '../lib/motion';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** A row under the picture, e.g. the list of places */
  footer?: ReactNode;
};

/** A full-screen viewer over the page. Escape or the button closes it. */
export default function Dialog({ title, onClose, children, footer }: Props) {
  const { t } = useI18n();

  useEffect(() => {
    lockScroll(true);
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} data-viewer className="fixed inset-0 z-[80] flex flex-col animate-fade-in" style={{ background: 'rgba(8,24,19,0.97)' }}>
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4">
        <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">{title}</h2>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label={t.immersive.close}
          className="touch-target grid place-items-center w-11 h-11 flex-shrink-0 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="relative flex-1 min-h-0">{children}</div>
      {footer && <div className="px-5 sm:px-8 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
    </div>,
    document.body,
  );
}
