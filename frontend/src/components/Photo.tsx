import type { ImgHTMLAttributes } from 'react';
import { useI18n } from '../i18n/I18nProvider';

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  /** Real Bushaashe Garuwa photo. Omit to render the woven panel instead. */
  src?: string;
  alt: string;
  /** Shown in the corner of the woven panel, e.g. the room or dish name */
  label?: string;
};

/**
 * A real photo, or, where the client has not supplied one yet, a woven panel
 * in the house colours: a quiet, finished-looking stand-in rather than an
 * empty box. It keeps the same shape so the layout never shifts.
 */
export default function Photo({ src, alt, label, className = '', ...rest }: PhotoProps) {
  const { t } = useI18n();
  if (src) return <img src={src} alt={alt} className={className} {...rest} />;

  // three quiet variations, picked from the name, so a row of panels is not identical
  const variant = [...(label ?? alt)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 3;
  const wash = [
    'bg-gradient-to-br from-[#1e5447]/70 via-transparent to-[#0a1f19]/70',
    'bg-gradient-to-tr from-[#0a1f19]/75 via-transparent to-[#26604f]/55',
    'bg-gradient-to-b from-[#23594a]/60 via-transparent to-[#0a1f19]/80',
  ][variant];

  return (
    <div
      role="img"
      aria-label={`${alt} (${t.common.photoComingSoon})`}
      className={`${className} relative overflow-hidden bg-[#143a30] woven-panel woven-${variant + 1}`}
    >
      <span className={`absolute inset-0 ${wash}`} />
      {label && (
        <span className="absolute left-4 bottom-4 right-4 text-[#E3B866]/90 font-display text-base leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}
