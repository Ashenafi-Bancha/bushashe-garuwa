import { picture } from '../assets/photos';
import type { ImgHTMLAttributes } from 'react';
import { useI18n } from '../i18n/I18nProvider';

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  /** Real Bushaashe Garuwa photo. Omit to show the placeholder instead. */
  src?: string;
  alt: string;
  /** What belongs here, e.g. the room or dish name; shown on the placeholder */
  label?: string;
};

/**
 * A real photo, or, where the client has not sent one yet, a calm sage panel
 * with a small line drawing of a traditional house among hills, the name of
 * what belongs there and a "photo coming soon" tag. It keeps the same shape,
 * so the layout never shifts when the photograph arrives.
 */
export default function Photo({ src, alt, label, className = '', ...rest }: PhotoProps) {
  const { t } = useI18n();
  if (src) return <img {...picture(src)} alt={alt} className={className} {...rest} />;

  return (
    <div
      role="img"
      aria-label={`${alt} (${t.common.photoComingSoon})`}
      className={`${className} photo-placeholder relative overflow-hidden flex flex-col items-center justify-center text-center p-5`}
    >
      <svg viewBox="0 0 96 64" className="relative w-20 sm:w-24 h-auto text-[#1E3A29]/35 mb-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="74" cy="15" r="6" />
        <path d="M2 54c14-10 26-14 40-10s26 4 52-8" />
        <path d="M2 62c20-8 40-10 60-6s22 2 32-2" opacity=".6" />
        {/* a thatched Wolaita house */}
        <path d="M24 48V36M44 48V36M20 37c3-12 9-20 14-24 5 4 11 12 14 24" />
        <path d="M34 13v-5" />
        <path d="M31 48v-7h6v7" />
      </svg>
      {label && <span className="relative font-display text-base sm:text-lg font-bold text-[#1E3A29]/80 leading-tight max-w-[16rem]">{label}</span>}
      <span className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#1E3A29]/60">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" />
        </svg>
        {t.common.photoComingSoon}
      </span>
    </div>
  );
}
