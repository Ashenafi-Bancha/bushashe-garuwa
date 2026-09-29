import type { ReactNode } from 'react';
import { photos, type PhotoKey } from '../assets/photos';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Opening section of the inner pages: the label and a large title on the paper,
 * the description beside it, then a wide rounded photograph that settles in
 * with a slow zoom. Any <span> inside the title is picked out in moss green.
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
    <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-6 sm:pb-10">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-16 lg:items-end mb-8 sm:mb-12">
          <div>
            <span className="eyebrow mb-5 sm:mb-6 animate-fade-up">{eyebrow}</span>
            <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold text-[#1E3A29] leading-[0.98] [&>span>span_span]:text-[#6F9443]">
              <span className="line-mask"><span>{title}</span></span>
            </h1>
          </div>
          {desc && (
            <p className="text-base sm:text-lg text-[#1E3A29]/65 leading-relaxed max-w-md animate-fade-up delay-200 lg:pb-2">{desc}</p>
          )}
        </div>

        <div className="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden h-[46svh] min-h-[280px] sm:h-[58svh] lg:h-[68svh] lg:max-h-[720px] photo-3d animate-scale-in delay-100">
          <img
            src={photos[photo]}
            alt={t.photos[photo]}
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-cover ${pos} animate-ken-burns`}
          />
          <span className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold">
            {caption.title}
          </span>
        </div>
      </div>
    </section>
  );
}
