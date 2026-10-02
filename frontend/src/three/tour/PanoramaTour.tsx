import { lazy, Suspense, useMemo } from 'react';
import Photo from '../../components/Photo';
import { useI18n } from '../../i18n/I18nProvider';
import { deviceTier } from '../device';
import Dialog from '../Dialog';
import { TOUR_SCENES, type TourSceneId } from './scenes';

const PanoramaScene = lazy(() => import('./PanoramaScene'));

type Props = {
  /** The place being looked at, or null when the viewer is closed */
  open: TourSceneId | null;
  onOpen: (id: TourSceneId | null) => void;
};

/**
 * The 360° tour: a card for each place; choosing one opens a full-screen view
 * to look around in, with the other places one tap away.
 */
export default function PanoramaTour({ open, onOpen }: Props) {
  const { t } = useI18n();
  const words = t.immersive.tour;
  const tier = useMemo(deviceTier, []);
  const scene = TOUR_SCENES.find((item) => item.id === open);

  return (
    <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 lg:py-20" aria-labelledby="tour-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-9 sm:mb-12">
          <span className="eyebrow mb-5">{words.eyebrow}</span>
          <h2 id="tour-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#13261A] leading-[1] mb-4">{words.title}</h2>
          <p className="text-[#1E3A29]/75 leading-relaxed">{words.desc}</p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TOUR_SCENES.map((item) => (
            <li key={item.id} className="bg-white rounded-[1.75rem] p-2.5 elev-1 flex flex-col">
              <div className="img-zoom rounded-[1.25rem] overflow-hidden aspect-[3/2]">
                <Photo src={item.card} alt={words.scenes[item.id]} label={words.scenes[item.id]} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-4 flex-1 justify-between">
                <h3 className="font-display text-xl font-bold text-[#1E3A29] leading-tight">{words.scenes[item.id]}</h3>
                {tier !== 'none' && (
                  <button type="button" onClick={() => onOpen(item.id)} className="btn-primary btn-sm">
                    {words.open}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {scene && tier !== 'none' && (
        <Dialog
          title={words.scenes[scene.id]}
          onClose={() => onOpen(null)}
          footer={
            <div className="scroll-smooth-x flex gap-2 overflow-x-auto" role="group" aria-label={words.title}>
              {TOUR_SCENES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpen(item.id)}
                  aria-pressed={item.id === scene.id}
                  className={`flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                    item.id === scene.id ? 'bg-white text-[#13261A]' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {words.scenes[item.id]}
                </button>
              ))}
            </div>
          }
        >
          <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-white/70 text-sm font-semibold">{t.immersive.loading}</div>}>
            <PanoramaScene tier={tier} image={scene.image} name={words.scenes[scene.id]} needed={words.needed} />
          </Suspense>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-4 rounded-full bg-black/45 backdrop-blur-md px-4 py-2 text-white text-xs font-semibold pointer-events-none whitespace-nowrap">
            {t.immersive.lookAround}
          </span>
        </Dialog>
      )}
    </section>
  );
}
