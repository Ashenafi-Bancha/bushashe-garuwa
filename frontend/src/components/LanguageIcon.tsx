import { useId } from 'react';
import type { Lang } from '../i18n/config';

/**
 * A small round mark for each language: the world for English, the colours of
 * the Ethiopian flag for Amharic, and the Dunguza pattern (the red, black and
 * yellow stepped design of Wolaita) for Wolayttatto doonaa.
 */
export default function LanguageIcon({ lang, className = 'w-5 h-5' }: { lang: Lang; className?: string }) {
  const clip = useId();
  return (
    <svg viewBox="0 0 24 24" className={`flex-shrink-0 rounded-full ${className}`} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {lang === 'en' && (
          <>
            <rect width="24" height="24" fill="#E3EBD8" />
            <g fill="none" stroke="#3F7D20" strokeWidth="1.5">
              <circle cx="12" cy="12" r="7.5" />
              <path d="M4.5 12h15M12 4.5c2.4 2.2 3.4 4.7 3.4 7.5s-1 5.3-3.4 7.5c-2.4-2.2-3.4-4.7-3.4-7.5s1-5.3 3.4-7.5z" />
            </g>
          </>
        )}
        {lang === 'am' && (
          <>
            {/* green, yellow and red, with the blue disc and its star */}
            <rect width="24" height="8" fill="#078930" />
            <rect y="8" width="24" height="8" fill="#FCDD09" />
            <rect y="16" width="24" height="8" fill="#DA121A" />
            <circle cx="12" cy="12" r="4.6" fill="#0F47AF" />
            <path d="M12 8.6l.9 2.4h2.5l-2 1.5.8 2.4-2.2-1.5-2.2 1.5.8-2.4-2-1.5h2.5z" fill="#FCDD09" />
          </>
        )}
        {lang === 'wol' && (
          <>
            {/* the Dunguza: a black stepped band outlined in yellow, on red */}
            <rect width="24" height="24" fill="#D2231C" />
            <path d="M0 3.6h24M0 20.4h24" stroke="#F6C51C" strokeWidth="1.2" />
            <path
              d="M0 10h6.5V7.4h2.6V5.2h5.8v2.2h2.6V10H24v4h-6.5v2.6h-2.6v2.2H9.1v-2.2H6.5V14H0z"
              fill="#111111"
              stroke="#F6C51C"
              strokeWidth="1.1"
              strokeLinejoin="miter"
            />
          </>
        )}
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(19,38,26,0.15)" />
    </svg>
  );
}
