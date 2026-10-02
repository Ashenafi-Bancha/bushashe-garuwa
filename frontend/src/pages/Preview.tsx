import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNoIndex } from '../lib/noindex';
import HouseExplorer from '../three/house/HouseExplorer';
import GroundsMap from '../three/map/GroundsMap';
import MuseumGallery from '../three/museum/MuseumGallery';
import PanoramaTour from '../three/tour/PanoramaTour';
import type { TourSceneId } from '../three/tour/scenes';

/**
 * Pages under review. They are not linked from the site and search engines are
 * asked to leave them out; open them by address to judge a new part before it
 * goes public. This index is for the people building the site, so it is in
 * English only.
 */
const PAGES = [
  { to: '/preview/hero', title: 'Home page opening in 3D', note: 'The landscape journey: scroll to walk down to the house.' },
  { to: '/preview/heritage', title: 'House in 3D, 360° tour, the collection', note: 'Stand-in models and stand-in 360° pictures until the real ones arrive.' },
  { to: '/preview/map', title: 'Map of the grounds in 3D', note: 'The points are not yet in their true places.' },
];

export default function Preview({ view }: { view: 'index' | 'heritage' | 'map' }) {
  useNoIndex();
  const [tourScene, setTourScene] = useState<TourSceneId | null>(null);

  if (view === 'heritage') {
    return (
      <main className="pt-16 sm:pt-[72px]">
        <HouseExplorer onStepInside={() => setTourScene('meeshsho')} />
        <PanoramaTour open={tourScene} onOpen={setTourScene} />
        <MuseumGallery />
      </main>
    );
  }

  if (view === 'map') {
    return (
      <main className="pt-16 sm:pt-[72px]">
        <GroundsMap />
      </main>
    );
  }

  return (
    <main className="pt-16 sm:pt-[72px] min-h-[80svh]">
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <span className="eyebrow mb-5">Not public</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1] mb-4">Pages under review</h1>
        <p className="text-[#1E3A29]/70 leading-relaxed mb-8">
          New parts of the site, shown here before they replace anything visitors see. Add <code>?3d=none</code> to an address to see what a phone that cannot
          draw 3D is shown instead.
        </p>
        <ul className="space-y-3">
          {PAGES.map((page) => (
            <li key={page.to}>
              <Link to={page.to} className="block rounded-[1.5rem] bg-white border border-[#1E3A29]/10 p-5 sm:p-6 hover:border-[#0E8A50] transition-colors">
                <span className="block font-display text-xl font-bold text-[#1E3A29]">{page.title}</span>
                <span className="block text-[#1E3A29]/65 text-sm mt-1">{page.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
