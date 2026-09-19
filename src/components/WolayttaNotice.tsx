import { useEffect, useRef } from 'react';
import type { Lang } from '../i18n/config';
import type { Dictionary } from '../i18n/dictionaries/en';

type Props = {
  open: boolean;
  onClose: () => void;
  onChoose: (lang: Lang) => void;
  /** Shown in both languages, since the visitor has not picked one yet. */
  texts: { en: Dictionary['notice']; am: Dictionary['notice'] };
};

export default function WolayttaNotice({ open, onClose, onChoose, texts }: Props) {
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-400 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      inert={!open}
    >
      <button className="absolute inset-0 w-full h-full bg-[#0a1f19]/80 backdrop-blur-sm" onClick={onClose} aria-label={texts.en.close} tabIndex={-1} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wal-notice-title"
        className={`relative w-full max-w-lg bg-[#F7F5F0] shadow-2xl transition-transform duration-500 ${open ? 'translate-y-0' : 'translate-y-4'}`}
        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
      >
        <div className="h-1 bg-gradient-to-r from-[#173F35] via-[#C99A45] to-[#A65A3A]" />
        <button onClick={onClose} className="absolute top-3 right-3 touch-target text-[#173F35]/40 hover:text-[#173F35]" aria-label={texts.en.close}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5" /></svg>
        </button>

        <div className="px-6 sm:px-10 pt-9 pb-8">
          <div className="text-[#A65A3A] text-[10px] font-sans font-semibold tracking-[0.16em] uppercase mb-3">Wolayttatto</div>
          <h2 id="wal-notice-title" className="font-display text-3xl font-semibold text-[#173F35] leading-tight mb-1">{texts.en.title}</h2>
          <div lang="am" className="font-display text-2xl font-semibold text-[#173F35]/80 leading-snug mb-5">{texts.am.title}</div>

          <p className="text-[#1D211E]/70 font-sans text-sm leading-relaxed mb-2">{texts.en.body}</p>
          <p lang="am" className="text-[#1D211E]/60 font-sans text-sm leading-relaxed mb-7">{texts.am.body}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            <button ref={firstButton} onClick={() => onChoose('en')} className="btn-primary justify-center bg-[#173F35] border-[#173F35] text-white hover:bg-[#1e5447]">
              {texts.en.continueEn}
            </button>
            <button lang="am" onClick={() => onChoose('am')} className="btn-outline justify-center border-[#173F35] text-[#173F35] hover:bg-[#173F35] hover:text-white">
              {texts.am.continueAm}
            </button>
          </div>

          {import.meta.env.DEV && (
            <button onClick={() => onChoose('wal')} className="mt-5 w-full text-center text-[11px] font-sans text-[#173F35]/45 hover:text-[#173F35] underline underline-offset-4">
              Preview the Wolaytta draft (development only)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
