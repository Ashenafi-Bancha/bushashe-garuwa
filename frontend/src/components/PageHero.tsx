import { picture } from '../assets/photos';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { HeroSlot } from '../lib/heroSlots';
import { heroPhotos, useSiteMedia } from '../lib/media';
import { wol } from '../lib/wolaitaWords';

/**
 * Opening section of the inner pages.
 *
 * Phones: the photograph first, whole and in its own shape, from edge to edge;
 * the label, the title and the description below it.
 *
 * Computers: the photograph is the background of the whole opening, shown
 * whole in its own shape, with a light shade from the left; the words sit on
 * the left in white.
 *
 * Any <span> inside the title is picked out in moss green. The photograph is
 * the page's own (src/lib/heroSlots.ts), or the one staff put in its place
 * from the admin area.
 */
export default function PageHero({ eyebrow, title, desc, slot }: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  /** which page this is, so it shows that page's opening photo */
  slot: HeroSlot;
}) {
  const { t, lang } = useI18n();
  const photo = heroPhotos(slot, useSiteMedia(), t, lang)[0]!;
  // the photograph's own width to height, read once it has loaded (3:2 until then)
  const [ratio, setRatio] = useState(1.5);
  const img = useRef<HTMLImageElement>(null);
  const measure = useCallback(() => {
    const el = img.current;
    if (el?.naturalWidth && el.naturalHeight) setRatio(el.naturalWidth / el.naturalHeight);
  }, []);
  useEffect(measure, [measure, photo.src]);
  const upright = ratio < 1.2;

  return (
    <section
      className="page-hero hero-on-photo relative lg:mt-[72px] lg:overflow-hidden lg:h-[min(calc(100vw/var(--ratio)),calc(100svh-72px))] lg:min-h-[480px]"
      style={{ '--ratio': ratio } as CSSProperties}
    >
      {/* the photograph: whole on phones; on computers the background of the whole opening, behind the words */}
      <div
        className={`relative w-full mt-16 sm:mt-[72px] min-h-[220px] overflow-hidden bg-[#E3EBD8] ${upright ? 'max-h-[78svh]' : ''} lg:absolute lg:inset-0 lg:mt-0 lg:w-full lg:h-full lg:min-h-0 lg:max-h-none lg:bg-[#13261A]`}
        style={{ aspectRatio: ratio }}
      >
        <div key={photo.id} className="hero-slide hero-slide-first">
          <div className="absolute inset-0">
            {/* a soft blurred copy fills any space beside the photograph, which itself is always shown whole */}
            <img src={photo.src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-80" />
            <img
              ref={img}
              {...picture(photo.src)}
              alt={photo.alt}
              fetchPriority="high"
              onLoad={measure}
              className="hero-slide-img relative w-full h-full object-contain"
            />
          </div>
        </div>
        {/* computers: a light shade from the left, just enough for the white words to read */}
        <span className="hidden lg:block absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(10,24,14,0.62)_0%,rgba(10,24,14,0.46)_30%,rgba(10,24,14,0.16)_54%,rgba(10,24,14,0)_70%)]" />
                <span className="absolute inset-x-0 bottom-0 h-6 lg:h-10 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />
        <span className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:right-8 lg:bottom-8 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
          {wol(photo.title)}
        </span>
      </div>

      {/* the words: below the photograph on phones; over its left side, in white, on computers */}
      <div className="relative z-[5] max-w-screen-xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-6 sm:pb-10 lg:py-0 lg:h-full lg:flex lg:items-center">
        <div className="lg:max-w-[min(36rem,44%)]">
          <span className="eyebrow mb-5 animate-fade-up">{eyebrow}</span>
          <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-[min(4.25rem,9.5svh)] font-extrabold text-[#1E3A29] lg:text-white leading-[0.98] [&>span>span_span]:text-[#6F9443] lg:[&>span>span_span]:text-[#BFDC93] lg:[text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
            <span className="line-mask"><span>{wol(title)}</span></span>
          </h1>
          {desc && (
            <p className="mt-5 lg:mt-7 text-base sm:text-lg text-[#1E3A29]/75 lg:text-white lg:[text-shadow:0_1px_12px_rgba(0,0,0,0.5)] leading-relaxed max-w-md animate-fade-up delay-200">{wol(desc)}</p>
          )}
        </div>
      </div>
    </section>
  );
}
