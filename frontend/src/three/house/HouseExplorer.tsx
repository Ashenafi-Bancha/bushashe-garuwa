import { lazy, useState } from 'react';
import { photos } from '../../assets/photos';
import Photo from '../../components/Photo';
import { useI18n } from '../../i18n/I18nProvider';
import Frame3D from '../Frame3D';
import type { Spot } from './HouseScene';

const HouseScene = lazy(() => import('./HouseScene'));

/* Where each marker sits on the stand-in house (the words are in the translations) */
const PLACES = [
  { id: 'roof', at: [1.5, 4.25, 2.1], facing: [0.5, 0.5, 0.7] },
  { id: 'wall', at: [2.75, 0.85, 1.7], facing: [0.85, 0, 0.52] },
  { id: 'door', at: [0, 1.6, 3.3], facing: [0, 0, 1] },
  { id: 'inside', at: [0, 0.55, 3.3], facing: [0, 0, 1] },
] as const satisfies readonly { id: string; at: [number, number, number]; facing: [number, number, number] }[];

type SpotId = (typeof PLACES)[number]['id'];

/**
 * A traditional house to walk around: drag to turn it, choose a marker to read
 * about that part, and step inside into the 360° view.
 */
export default function HouseExplorer({ onStepInside }: { onStepInside?: () => void }) {
  const { t } = useI18n();
  const words = t.immersive.house;
  const [chosen, setChosen] = useState<SpotId>('roof');

  const spots: Spot[] = PLACES.map((place) => ({ id: place.id, at: [...place.at], facing: [...place.facing], label: words.spots[place.id].label }));
  // the note for "inside" is the text the heritage page already carries
  const note = chosen === 'inside' ? t.heritage.houses.inside : words.spots[chosen].text;

  return (
    <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="house-3d-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.25fr_1fr] gap-7 lg:gap-14 lg:items-center">
        <div className="relative">
          <Frame3D
            className="aspect-[4/3] sm:aspect-[3/2] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-[#E3EBD8]"
            fallback={
              <div className="img-zoom rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden aspect-[3/2]">
                <Photo src={photos.meeshsho} alt={t.photos.meeshsho} loading="lazy" className="w-full h-full object-cover" />
              </div>
            }
          >
            {(tier, active) => (
              <>
                <HouseScene tier={tier} active={active} spots={spots} chosen={chosen} onChoose={(id) => setChosen(id as SpotId)} />
                <span className="absolute left-4 bottom-4 rounded-full bg-white/85 backdrop-blur-md px-3.5 py-1.5 text-[#1E3A29] text-xs font-semibold pointer-events-none">
                  {t.immersive.drag}
                </span>
              </>
            )}
          </Frame3D>
          <p className="mt-3 text-[#1E3A29]/55 text-xs sm:text-sm">{words.placeholder}</p>
        </div>

        <div>
          <span className="eyebrow mb-5">{words.eyebrow}</span>
          <h2 id="house-3d-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-5">{words.title}</h2>
          <p className="text-[#1E3A29]/70 leading-relaxed mb-7">{t.heritage.houses.desc}</p>

          {/* the same choices as the markers, for keyboards and screen readers too */}
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={words.title}>
            {PLACES.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setChosen(place.id)}
                aria-pressed={chosen === place.id}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                  chosen === place.id ? 'bg-[#0E8A50] text-white' : 'bg-white text-[#1E3A29] border border-[#1E3A29]/15 hover:border-[#0E8A50]'
                }`}
              >
                {words.spots[place.id].label}
              </button>
            ))}
          </div>
          <div className="rounded-[1.5rem] bg-white border border-[#1E3A29]/10 p-5 sm:p-6 mb-6" aria-live="polite">
            <h3 className="font-display text-xl font-bold text-[#1E3A29] mb-2">{words.spots[chosen].label}</h3>
            <p className="text-[#1E3A29]/75 text-sm sm:text-base leading-relaxed">{note}</p>
          </div>
          {onStepInside && (
            <button type="button" onClick={onStepInside} className="btn-primary">
              {words.stepInside}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
