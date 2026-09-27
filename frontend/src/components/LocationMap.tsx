import { useI18n } from '../i18n/I18nProvider';
import { DIRECTIONS_URL, MAPS_LISTING_NAME, MAPS_URL, MAP_EMBED_URL, PLUS_CODE } from '../lib/location';

/** "Find us" section: where Bushaashe Garuwa is, with a live Google map and links for directions. */
export default function LocationMap({ id = 'map' }: { id?: string }) {
  const { t } = useI18n();
  const m = t.common.map;

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#FAFAF8]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-14 items-center">
        <div>
          <span className="eyebrow bg-[#35723A]/10 text-[#35723A] mb-5">{m.eyebrow}</span>
          <h2 className="font-display text-4xl sm:text-5xl text-[#12150F] leading-[1.05] mb-5">{m.title}</h2>
          <p className="text-[#12150F]/65 text-base leading-relaxed mb-6">{m.desc}</p>

          <dl className="space-y-4 mb-8">
            <div>
              <dt className="text-[#B8863B] text-xs font-semibold tracking-[0.16em] uppercase mb-1">{m.listedAs}</dt>
              <dd className="text-[#35723A] font-medium">{MAPS_LISTING_NAME}</dd>
            </div>
            <div>
              <dt className="text-[#B8863B] text-xs font-semibold tracking-[0.16em] uppercase mb-1">{m.plusCode}</dt>
              <dd className="text-[#35723A] font-medium tracking-wide">{PLUS_CODE}</dd>
            </div>
            <div>
              <dt className="text-[#B8863B] text-xs font-semibold tracking-[0.16em] uppercase mb-1">{t.common.location}</dt>
              <dd className="text-[#35723A] font-medium">{t.common.locationLine}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">{m.directions}</a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-[#35723A] border-[#35723A]/25">{m.open}</a>
          </div>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden bg-[#35723A]/10 elev-3 h-[340px] sm:h-[440px] lg:h-[520px]">
          <iframe
            src={MAP_EMBED_URL}
            title={m.frameTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
