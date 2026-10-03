import { picture } from '../assets/photos';
import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { HeroSlot } from '../lib/heroSlots';
import { heroPhotos, useSiteMedia } from '../lib/media';

/**
 * Opening section of the inner pages, drawn like the home page: the photograph
 * fills the whole screen, edge to edge, shown clearly with nothing laid over it;
 * the label, the title and the description follow just below. Any <span> inside
 * the title is picked out in moss green.
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

  return (
    <section className="relative">
      <div className="relative mt-16 sm:mt-[72px] aspect-[3/2] lg:mt-0 lg:aspect-auto lg:h-[100svh] lg:min-h-[560px] overflow-hidden bg-[#E3EBD8]">
        <div key={photo.id} className="hero-slide hero-slide-first">
          <img
            {...picture(photo.src)}
            alt={photo.alt}
            fetchPriority="high"
            className={`hero-slide-img w-full h-full object-cover ${photo.pos}`}
          />
        </div>
        {/* a faint shade only behind the header words at the very top */}
        <span className="hidden lg:block absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/40 via-black/15 to-transparent z-[3]" />
        {/* only a thin soft edge joins the photograph to the page; nothing lies over it */}
        <span className="absolute inset-x-0 bottom-0 h-6 lg:h-20 bg-gradient-to-t from-[#F4EFE4] to-transparent z-[3]" />
        <span className="absolute z-[4] right-3 bottom-3 sm:right-5 sm:bottom-5 lg:bottom-auto lg:right-8 lg:top-[104px] rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
          {photo.title}
        </span>
      </div>

      <div className="relative z-[5] pt-6 sm:pt-10 max-w-screen-xl mx-auto px-5 sm:px-8 pb-6 sm:pb-10 grid lg:grid-cols-[1.4fr_1fr] gap-5 lg:gap-16 lg:items-end">
        <div>
          <span className="eyebrow mb-5 animate-fade-up">{eyebrow}</span>
          <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold text-[#1E3A29] leading-[0.98] [&>span>span_span]:text-[#6F9443]">
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
