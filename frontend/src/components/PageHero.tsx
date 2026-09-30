import type { ReactNode } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Opening section of the inner pages, drawn like the home page: the photograph
 * fills the whole screen, edge to edge, settling in from a slight zoom; its
 * bottom melts into the page, and the label, the title and the description rise
 * out of that fade. Any <span> inside the title is picked out in moss green.
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
    <section className="relative">
      <div className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#13261A]">
        <div className="hero-slide hero-slide-first">
          <img
            src={photos[photo]}
            alt={t.photos[photo]}
            fetchPriority="high"
            className={`hero-slide-img w-full h-full object-cover ${pos}`}
          />
        </div>
        <span className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#13261A]/35 to-transparent z-[3]" />
        <span className="absolute inset-x-0 bottom-0 h-[62%] sm:h-[58%] bg-gradient-to-t from-[#F4EFE4] from-[18%] via-[#F4EFE4]/80 via-[42%] to-transparent z-[3]" />
        <span className="absolute z-[4] right-4 sm:right-8 top-[88px] sm:top-[104px] rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold animate-fade-in">
          {caption.title}
        </span>
      </div>

      <div className="relative z-[5] -mt-[30svh] sm:-mt-[32svh] max-w-screen-xl mx-auto px-5 sm:px-8 pb-6 sm:pb-10 grid lg:grid-cols-[1.4fr_1fr] gap-5 lg:gap-16 lg:items-end">
        <div>
          <span className="eyebrow !bg-white/70 backdrop-blur mb-5 animate-fade-up">{eyebrow}</span>
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
