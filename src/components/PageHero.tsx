import type { ReactNode } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Opening section of the inner pages: a real photograph running edge to edge
 * (first on phones, on the right on larger screens) with the title beside it,
 * instead of text laid over a framed background image.
 */
export default function PageHero({ eyebrow, title, desc, photo, pos = 'object-center' }: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  photo: PhotoKey;
  /** object-position of the photo, e.g. 'object-top' */
  pos?: string;
}) {
  const { t } = useI18n();
  const caption = t.photoCaptions[photo];

  return (
    <section className="relative bg-[#F7F5F0] overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1.05fr] lg:min-h-[86vh]">
        {/* Photo */}
        <div className="relative lg:order-2 h-[52svh] min-h-[320px] sm:h-[60svh] lg:h-auto overflow-hidden lg:rounded-bl-[4rem]">
          <img
            src={photos[photo]}
            alt={t.photos[photo]}
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-cover ${pos} animate-hero-photo`}
          />
          {/* keeps the floating header readable over bright skies */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a1f19]/45 to-transparent" />
          <span className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 rounded-full bg-[#0a1f19]/55 backdrop-blur-md border border-white/15 px-4 py-2 text-white text-xs sm:text-sm font-medium animate-fade-up delay-500">
            {caption.title}
          </span>
        </div>

        {/* Text */}
        <div className="flex items-center px-5 sm:px-8 lg:pr-14 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pt-10 pb-12 sm:pt-12 lg:pt-32 lg:pb-20">
          <div className="max-w-xl">
            <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] mb-6 animate-fade-up">{eyebrow}</span>
            <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl text-[#0e2820] leading-[1.02] animate-fade-up delay-100">
              {title}
            </h1>
            {desc && (
              <p className="mt-6 text-base sm:text-lg text-[#1D211E]/65 leading-relaxed animate-fade-up delay-200">{desc}</p>
            )}
            <div className="mt-10 h-px w-24 bg-gradient-to-r from-[#C99A45] to-transparent animate-fade-up delay-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
