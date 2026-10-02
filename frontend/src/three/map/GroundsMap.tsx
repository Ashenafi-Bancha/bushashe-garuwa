import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import Frame3D from '../Frame3D';
import { MAP_POINTS, type MapPointId } from './points';

const MapScene = lazy(() => import('./MapScene'));

/**
 * A small 3D model of the grounds with a numbered marker for each place.
 * Choosing a marker (or its name in the list) shows what is there.
 */
export default function GroundsMap() {
  const { t } = useI18n();
  const words = t.immersive.map;
  const facilities = t.home.facilities.items;
  const [chosen, setChosen] = useState<MapPointId>('gate');

  /* every name and description below is text the site already carries */
  const about = (id: MapPointId): { title: string; desc: string } => {
    if (id === 'gate') return { title: words.points.gate, desc: t.photoCaptions.gate.desc };
    if (id === 'meeshsho') return { title: words.points.meeshsho, desc: t.photoCaptions.meeshsho.desc };
    if (id === 'gulanttaa') return { title: words.points.gulanttaa, desc: t.heritage.houses.desc };
    if (id === 'zigba') return { title: words.points.zigba, desc: t.photoCaptions.zigba.desc };
    return facilities[id];
  };
  const names = Object.fromEntries(MAP_POINTS.map((point) => [point.id, about(point.id).title])) as Record<MapPointId, string>;
  const shown = about(chosen);
  const link = MAP_POINTS.find((point) => point.id === chosen)!.to;

  return (
    <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="map-3d-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <span className="eyebrow mb-5">{words.eyebrow}</span>
          <h2 id="map-3d-title" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-4">{words.title}</h2>
          <p className="text-[#1E3A29]/70 leading-relaxed">{words.desc}</p>
          <p className="mt-3 text-[#9A4A20] text-sm font-semibold">{words.layoutNeeded}</p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-10 lg:items-start">
          <Frame3D className="aspect-square sm:aspect-[3/2] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-[#E3EBD8]" fallback={null}>
            {(tier, active) => (
              <>
                <MapScene tier={tier} active={active} names={names} chosen={chosen} onChoose={setChosen} />
                <span className="absolute left-4 bottom-4 rounded-full bg-white/85 backdrop-blur-md px-3.5 py-1.5 text-[#1E3A29] text-xs font-semibold pointer-events-none">
                  {t.immersive.drag}
                </span>
              </>
            )}
          </Frame3D>

          <div>
            <div className="rounded-[1.5rem] bg-white border border-[#1E3A29]/10 p-5 sm:p-6 mb-5" aria-live="polite">
              <h3 className="font-display text-2xl font-bold text-[#1E3A29] mb-2">{shown.title}</h3>
              <p className="text-[#1E3A29]/75 text-sm sm:text-base leading-relaxed mb-5">{shown.desc}</p>
              <Link to={link} className="btn-primary btn-sm">
                {words.more}
              </Link>
            </div>
            {/* the same places as a list: for keyboards, screen readers and devices without 3D */}
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
              {MAP_POINTS.map((point, i) => (
                <li key={point.id}>
                  <button
                    type="button"
                    onClick={() => setChosen(point.id)}
                    aria-pressed={chosen === point.id}
                    className={`w-full flex items-center gap-3 rounded-full pl-2 pr-4 py-2 text-left text-sm font-bold transition-colors ${
                      chosen === point.id ? 'bg-[#0E8A50] text-white' : 'text-[#1E3A29] hover:bg-[#1E3A29]/6'
                    }`}
                  >
                    <span className={`grid place-items-center w-7 h-7 flex-shrink-0 rounded-full text-xs tabular-nums ${chosen === point.id ? 'bg-white text-[#0B6E40]' : 'bg-[#E3EBD8] text-[#1E3A29]'}`}>
                      {i + 1}
                    </span>
                    {names[point.id]}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
