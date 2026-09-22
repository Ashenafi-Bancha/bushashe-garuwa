import type { ReactNode } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Opening section of the inner pages.
 * Phones: the photograph first, edge to edge, with the title below it.
 * Desktop: the photograph fills the whole section and the title sits in the
 * lower left corner on a soft shade, leaving the centre of the photo clear.
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
    <section className="relative bg-[#F7F5F0] overflow-hidden lg:bg-[#0e2820] lg:h-[92vh] lg:min-h-[640px] lg:max-h-[980px] lg:flex lg:items-end">
      {/* Photo */}
      <div className="relative h-[52svh] min-h-[320px] sm:h-[60svh] overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
        <img
          src={photos[photo]}
          alt={t.photos[photo]}
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover ${pos} animate-hero-photo`}
        />
        {/* keeps the floating header readable over bright skies */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a1f19]/45 to-transparent" />
        {/* desktop: shade only behind the text in the lower left */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-tr from-[#0a1f19]/90 via-[#0a1f19]/25 via-45% to-transparent to-70%" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a1f19]/55 to-transparent" />
        <span className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 lg:left-auto lg:right-8 lg:bottom-8 rounded-full bg-[#0a1f19]/55 backdrop-blur-md border border-white/15 px-4 py-2 text-white text-xs sm:text-sm font-medium animate-fade-up delay-500">
          {caption.title}
        </span>
      </div>

      {/* Text */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-5 sm:px-8 pt-10 pb-12 sm:pt-12 lg:pt-0 lg:pb-14">
        <div className="max-w-xl">
          <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] lg:bg-white/10 lg:text-white lg:backdrop-blur-md lg:border lg:border-white/20 mb-6 lg:mb-4 animate-fade-up">{eyebrow}</span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[3.4rem] xl:text-[4rem] text-[#0e2820] lg:text-white leading-[1.02] animate-fade-up delay-100 lg:[&_span]:text-[#E3B866]">
            {title}
          </h1>
          {desc && (
            <p className="mt-6 lg:mt-4 max-w-xl lg:max-w-md text-base sm:text-lg lg:text-base text-[#1D211E]/65 lg:text-white/80 leading-relaxed animate-fade-up delay-200">{desc}</p>
          )}
          <div className="mt-10 lg:mt-8 h-px w-24 bg-gradient-to-r from-[#C99A45] to-transparent animate-fade-up delay-300" />
        </div>
      </div>
    </section>
  );
}
