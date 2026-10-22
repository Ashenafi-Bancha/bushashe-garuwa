import { picture } from '../assets/photos';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { HeroSlot } from '../lib/heroSlots';
import { heroPhotos, useSiteMedia } from '../lib/media';

/**
 * Opening section of the inner pages.
 *
 * Phones: the photograph first, whole and in its own shape, from edge to edge;
 * the label, the title and the description below it.
 *
 * Computers: the words on the left and the photograph on the right. The
 * photograph runs in behind the words and melts into the colour of the page,
 * so it reads as the background of the text.
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
      className="page-hero relative lg:mt-[72px] lg:h-[clamp(480px,calc(64vw/var(--ratio)),calc(100svh-72px))] lg:overflow-hidden"
      style={{ '--ratio': Math.max(ratio, 1.3) } as CSSProperties}
    >
      {/* the photograph: whole on phones; on computers the right side, behind the words */}
      <div
        className={`relative w-full mt-16 sm:mt-[72px] min-h-[220px] overflow-hidden bg-[#E3EBD8] ${upright ? 'max-h-[78svh]' : ''} lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[66%] lg:h-full lg:min-h-0 lg:max-h-none lg:bg-transparent`}
        style={{ aspectRatio: ratio }}
      >
        <div key={photo.id} className="hero-slide hero-slide-first">
          <div className="absolute inset-0">
            {/* an upright photograph on a phone: a soft blurred copy fills the sides */}
            <img src={photo.src} alt="" aria-hidden="true" className="lg:hidden absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-80" />
            <img
              ref={img}
              {...picture(photo.src, '(min-width: 1024px) 66vw, 100vw')}
              alt={photo.alt}
              fetchPriority="high"
              onLoad={measure}
              className={`hero-slide-img relative w-full h-full object-contain lg:object-cover ${photo.pos}`}
            />
          </div>
        </div>
        {/* computers: the photograph melts into the page behind the words, and softly at the foot */}
        <span className="hidden lg:block absolute inset-0 z-[3] bg-[linear-gradient(90deg,#F4EFE4_0%,rgba(244,239,228,0.88)_18%,rgba(244,239,228,0.45)_38%,rgba(244,239,228,0)_62%)]" />
        <span className="absolute inset-x-0 bottom-0 h-6 lg:h-24 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />
        <span className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:right-8 lg:bottom-8 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
          {photo.title}
        </span>
      </div>

      {/* the words: below the photograph on phones, on its left on computers */}
      <div className="relative z-[5] max-w-screen-xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-6 sm:pb-10 lg:py-0 lg:h-full lg:flex lg:items-center">
        <div className="lg:max-w-[min(36rem,44%)]">
          <span className="eyebrow mb-5 animate-fade-up">{eyebrow}</span>
          <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-[min(4rem,9svh)] font-extrabold text-[#1E3A29] leading-[0.98] [&>span>span_span]:text-[#6F9443]">
            <span className="line-mask"><span>{title}</span></span>
          </h1>
          {desc && (
            <p className="mt-5 lg:mt-7 text-base sm:text-lg text-[#1E3A29]/75 leading-relaxed max-w-md animate-fade-up delay-200">{desc}</p>
          )}
        </div>
      </div>
    </section>
  );
}
