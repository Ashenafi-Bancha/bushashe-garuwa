import { picture } from '../assets/photos';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { HeroSlot } from '../lib/heroSlots';
import { heroPhotos, useSiteMedia } from '../lib/media';

/**
 * Opening section of the inner pages, drawn like the home page: the photograph
 * comes first; the label, the title and the description follow just below, on
 * the first screen with it. The photograph is shown whole, in its own shape,
 * from edge to edge (on computers running up behind the header) and never
 * taller than the screen. Any <span> inside the title is picked out in moss green.
 *
 * The photograph is the page's own (src/lib/heroSlots.ts), or the one staff
 * put in its place from the admin area.
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

  return (
    <section className="relative">
      {/* the photograph's own shape, from edge to edge, so all of it shows. Only an upright
          photograph is held to the screen's height, with a soft blurred copy filling the sides. */}
      <div
        className={`relative w-full mt-16 sm:mt-[72px] lg:mt-0 min-h-[220px] overflow-hidden bg-[#E3EBD8] ${ratio < 1.2 ? 'max-h-[78svh] lg:max-h-[100svh]' : ''}`}
        style={{ aspectRatio: ratio }}
      >
        <div key={photo.id} className="hero-slide hero-slide-first">
          <div className="absolute inset-0">
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
        {/* a faint shade behind the header words at the very top */}
        <span className="hidden lg:block absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 via-black/15 to-transparent z-[3]" />
        {/* only a thin soft edge joins the photograph to the page; nothing lies over it */}
        <span className="absolute inset-x-0 bottom-0 h-6 lg:h-9 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />
        <span className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:bottom-auto lg:right-8 lg:top-[100px] rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
          {photo.title}
        </span>
      </div>

      <div className="relative z-[5] pt-6 sm:pt-10 lg:pt-3 max-w-screen-xl mx-auto px-5 sm:px-8 pb-6 sm:pb-10 grid lg:grid-cols-[1.4fr_1fr] gap-5 lg:gap-16 lg:items-end">
        <div>
          <span className="eyebrow mb-5 lg:mb-4 animate-fade-up">{eyebrow}</span>
          <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-[min(3.75rem,8svh)] font-extrabold text-[#1E3A29] leading-[0.98] [&>span>span_span]:text-[#6F9443]">
            <span className="line-mask"><span>{title}</span></span>
          </h1>
        </div>
        {desc && (
          <p className="text-base sm:text-lg text-[#1E3A29]/70 leading-relaxed max-w-md animate-fade-up delay-200 lg:pb-2">{desc}</p>
        )}
      </div>
    </section>
  );
}
