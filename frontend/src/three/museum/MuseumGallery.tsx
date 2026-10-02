import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import Photo from '../../components/Photo';
import { useI18n } from '../../i18n/I18nProvider';
import { deviceTier } from '../device';
import Dialog from '../Dialog';
import Frame3D from '../Frame3D';
import type { Exhibit } from './MuseumScene';

const MuseumScene = lazy(() => import('./MuseumScene'));
const ObjectViewer = lazy(() => import('./MuseumScene').then((module) => ({ default: module.ObjectViewer })));

/* The objects named on the heritage page. Each needs a scanned model and its story. */
const ITEMS = [
  { id: 'wotta', form: 0 },
  { id: 'cotton', form: 1 },
  { id: 'household', form: 2 },
  { id: 'instruments', form: 3 },
] as const satisfies readonly { id: string; form: Exhibit['form'] }[];

/**
 * The collection as a walk: the objects stand in a row, and scrolling walks
 * past them. Choosing one opens it larger, to turn around.
 */
export default function MuseumGallery() {
  const { t } = useI18n();
  const words = t.immersive.museum;
  const tier = useMemo(deviceTier, []);
  const track = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  const exhibits: Exhibit[] = ITEMS.map((item) => ({ id: item.id, form: item.form, name: words.items[item.id] }));
  const shown = exhibits.find((exhibit) => exhibit.id === open);

  const heading = (
    <div className="max-w-2xl">
      <span className="eyebrow mb-5">{words.eyebrow}</span>
      <h2 id="museum-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-4">{words.title}</h2>
      <p className="text-[#1E3A29]/70 leading-relaxed">{tier === 'none' ? t.heritage.categories.artifacts.desc : words.desc}</p>
    </div>
  );

  /* without 3D: the same objects as cards */
  if (tier === 'none') {
    return (
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="museum-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          {heading}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-9">
            {exhibits.map((exhibit) => (
              <li key={exhibit.id} className="bg-white rounded-[1.5rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.1rem] overflow-hidden aspect-square">
                  <Photo alt={exhibit.name} label={exhibit.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A29] leading-tight p-3">{exhibit.name}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={track} className="museum-walk relative" aria-labelledby="museum-title">
      <div className="sticky top-16 sm:top-[72px] h-[calc(100svh-4rem)] sm:h-[calc(100svh-72px)] min-h-[520px] flex flex-col overflow-hidden">
        <div className="max-w-screen-xl w-full mx-auto px-5 sm:px-8 pt-8 sm:pt-12">{heading}</div>
        <Frame3D className="flex-1 min-h-0" fallback={null}>
          {(sceneTier, active) => (
            <MuseumScene tier={sceneTier} active={active && open === null} track={track} exhibits={exhibits} closerLabel={words.closer} onOpen={setOpen} />
          )}
        </Frame3D>
      </div>

      {shown && (
        <Dialog
          title={shown.name}
          onClose={() => setOpen(null)}
          footer={
            <p className="text-white/75 text-sm leading-relaxed max-w-2xl">
              {words.storyNeeded} · {words.modelNeeded}
            </p>
          }
        >
          <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-white/70 text-sm font-semibold">{t.immersive.loading}</div>}>
            <ObjectViewer tier={tier} form={shown.form} />
          </Suspense>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-4 rounded-full bg-black/45 backdrop-blur-md px-4 py-2 text-white text-xs font-semibold pointer-events-none whitespace-nowrap">
            {t.immersive.drag}
          </span>
        </Dialog>
      )}
    </section>
  );
}
