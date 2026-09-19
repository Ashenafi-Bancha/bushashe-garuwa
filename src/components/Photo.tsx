import type { ImgHTMLAttributes } from 'react';
import { useI18n } from '../i18n/I18nProvider';

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  /** Real Bushaashe Garuwa photo. Omit to render the branded placeholder. */
  src?: string;
  alt: string;
};

/**
 * Renders a real photo, or — until the client supplies one — a branded
 * placeholder that keeps the same box so layouts stay intact.
 */
export default function Photo({ src, alt, className = '', ...rest }: PhotoProps) {
  const { t } = useI18n();
  if (src) return <img src={src} alt={alt} className={className} {...rest} />;

  return (
    <div
      role="img"
      aria-label={`${alt} — ${t.common.photoComingSoon}`}
      className={`${className} relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e5447] to-[#0e2820] text-[#C99A45]`}
    >
      <div className="absolute inset-0 pattern-diamond opacity-60" />
      <span className="relative text-[9px] font-sans font-semibold tracking-[0.25em] uppercase text-[#C99A45]/60">
        {t.common.photoComingSoon}
      </span>
    </div>
  );
}
