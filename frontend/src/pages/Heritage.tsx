import { Link, useLocation } from 'react-router-dom';
import { photos, picture } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';
import Band from '../components/Band';
import { wol } from '../lib/wolaitaWords';

/* Page structure — the text for each id lives in the translations (t.heritage.*) */
const categories: { id: keyof Dictionary['heritage']['categories']; img?: string; to: string }[] = [
  { id: 'houses', img: photos.meeshsho, to: '/heritage#houses' },
  { id: 'trees', img: photos.enset, to: '/heritage/trees' },
  { id: 'spices', img: photos.herbs, to: '/heritage/spices' },
  { id: 'animals', img: photos.deer, to: '/heritage/animals' },
  { id: 'crocodile', img: photos.crocodilePond, to: '/heritage#nature' },
  { id: 'artifacts', img: photos.artifactsWall, to: '/heritage#artifacts' },
  { id: 'food', img: photos.food, to: '/dine' },
  { id: 'clothing', img: photos.gifaataa2, to: '/heritage/clothing' },
  { id: 'music', to: '/heritage/music' },
  { id: 'stories', img: photos.eventElders, to: '/heritage/stories' },
];

/* The two traditional houses keep their Wolaytta names in every language.
   A house without `img` shows the placeholder until its photograph is added. */
const houses: { name: string; img?: string }[] = [
  { name: 'Meesho Keettaa', img: photos.meeshsho },
  { name: 'Gulanttaa Keettaa', img: photos.gulanttaa },
];

/* The zigba keeps its Wolaytta and scientific names in every language */
const ZIGBA = { wolaytta: 'Zigba', scientific: 'Podocarpus falcatus' };

/** Living Nature: the cards that run across two columns */
const WIDE = new Set<string>(['vegetableGarden', 'crocodilePond']);

export default function Heritage() {
  const { t, lang } = useI18n();
  // the houses' Wolaita names: in quotation marks and italic in English and Amharic, plain in Wolaytta
  const houseName = (name: string) => (lang === 'wol' ? name : `“${name}”`);
  const hg = t.heritage;
  const { pathname } = useLocation();

  return (
    <main>
      {/* Hero */}
      <PageHero slot={pathname.startsWith('/heritage/trees') ? 'heritageTrees' : 'heritage'} eyebrow={hg.hero.eyebrow} title={hg.hero.title} desc={hg.intro} />

      {/* Heritage categories grid */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div data-wave className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-7 sm:gap-6">
            {categories.map((cat) => {
              const text = hg.categories[cat.id];
              return (
              <Link key={cat.id} to={cat.to} className="group block">
                <div className="img-zoom rounded-[1.25rem] sm:rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-[#1E3A29]/10 elev-1">
                  <Photo src={cat.img} alt={text.label} label={text.label} className="w-full h-full object-cover"/>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-[#1E3A29]/12 group-hover:border-[#1E3A29] transition-colors">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1E3A29] leading-tight">{wol(text.label)}</h3>
                  <span aria-hidden="true" className="text-[#1E3A29] text-lg leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </div>
                <p className="mt-2 sm:mt-3 text-[#1E3A29]/60 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{wol(text.desc)}</p>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The two traditional houses, each with its own photograph */}
      <section id="houses" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 lg:gap-16 lg:items-end mb-10 sm:mb-12">
            <div>
              <span className="eyebrow mb-5">{hg.houses.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[1]">{wol(hg.houses.title)}</h2>
            </div>
            <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{wol(hg.houses.desc)}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {houses.map((house, i) => (
              <article key={house.name} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <Photo src={house.img} alt={houseName(house.name)} label={houseName(house.name)} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#346A1A] text-sm font-bold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[#1E3A29]/65 text-sm font-semibold">{wol(hg.houses.label)}</span>
                  </div>
                  <h3 lang="wal" className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] tracking-[-0.03em]">{wol(houseName(house.name))}</h3>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-[1.5rem] bg-[#E3EBD8] text-[#13261A] text-sm sm:text-base leading-relaxed p-5 sm:p-6">{wol(hg.houses.inside)}</p>
        </div>
      </section>

      {/* Inside Gulanttaa Keettaa: the traditional materials, which are also the artifacts of the collection */}
      <Band id="artifacts" aria-labelledby="interior-title" outer="mb-12 sm:mb-16" className="py-6 sm:py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="eyebrow !bg-white mb-5">{hg.interior.eyebrow}</span>
            <h2 id="interior-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#13261A] leading-[1.05] mb-3">{wol(hg.interior.title)}</h2>
            <p className="text-[#1E3A29]/75 leading-relaxed">{wol(hg.interior.desc)}</p>
          </div>
          <div data-wave className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {(['artifactsWall', 'traditionalBed', 'artifactsCorner'] as const).map((key) => (
              <figure key={key} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[4/3]">
                  <img {...picture(photos[key], '(max-width: 767px) 100vw, 33vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5">
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{wol(t.photoCaptions[key].title)}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{wol(t.photoCaptions[key].desc)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Band>

      {/* Trees: the zigba line, planted by our forefathers and the current generation */}
      <section id="trees" className="mx-2 sm:mx-3">
        <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-[#E3EBD8]">
          {/* the photograph, clear, with nothing over it but its name */}
          <div className="relative sm:h-[62svh] sm:min-h-[360px] lg:h-[78svh]">
            <img {...picture(photos.zigba)} alt={t.photos.zigba} loading="lazy" className="block sm:absolute sm:inset-0 w-full sm:h-full object-cover object-[center_40%]" />
            <span className="absolute left-5 top-5 sm:left-8 sm:top-8 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 text-[#1E3A29] text-xs sm:text-sm font-semibold">
              {wol(t.photoCaptions.zigba.title)}
            </span>
          </div>

          <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-10 sm:py-14 grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 lg:items-end">
            <div>
              <span className="eyebrow mb-5">{hg.trees.eyebrow}</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#13261A] leading-[1]">{wol(hg.trees.title)}</h2>
            </div>
            <div className="rounded-[1.75rem] bg-white border border-[#1E3A29]/12 p-6 sm:p-7 text-[#13261A]">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <div className="font-display text-3xl font-extrabold text-[#346A1A] tracking-tight">{ZIGBA.wolaytta}</div>
                <div className="text-[#1E3A29]/70 text-xs italic">{ZIGBA.scientific}</div>
              </div>
              <div className="text-[#1E3A29]/80 text-sm font-semibold mb-4">{wol(hg.trees.items.zigba.name)}</div>
              <p className="text-[#1E3A29]/80 text-sm sm:text-base leading-relaxed mb-5">{hg.trees.items.zigba.sig}</p>
              <span className="inline-flex rounded-full bg-[#86A94F] text-[#13261A] text-xs font-bold px-3.5 py-1.5">{hg.trees.items.zigba.age}</span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-[#1E3A29]/55 text-sm px-5">{hg.trees.qr}</p>
      </section>

      {/* Living nature: the plants, the farm and the animals of the grounds */}
      <section id="nature" className="pt-12 sm:pt-16 lg:pt-24" aria-labelledby="nature-title">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="eyebrow mb-5">{hg.nature.eyebrow}</span>
            <h2 id="nature-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A29] leading-[1.05] mb-3">{wol(hg.nature.title)}</h2>
            <p className="text-[#1E3A29]/70 leading-relaxed">{wol(hg.nature.desc)}</p>
          </div>
          <div data-wave className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {(['vegetableGarden', 'herbs', 'banana', 'papaya', 'gardenPlant', 'youngTrees', 'farm', 'fishPond', 'crocodilePond', 'zoo', 'deer', 'bird', 'whitePigeon'] as const).map((key) => (
              // the vegetable garden and the crocodile pond are wide cards across two columns
              <figure key={key} className={`bg-white rounded-[2rem] p-2.5 elev-1 ${WIDE.has(key) ? 'md:col-span-2' : ''}`}>
                <div className={`img-zoom rounded-[1.5rem] overflow-hidden ${WIDE.has(key) ? 'aspect-[3/2] md:aspect-[3.08/1]' : 'aspect-[3/2]'}`}>
                  <img {...picture(photos[key], WIDE.has(key) ? '(max-width: 767px) 100vw, 66vw' : '(max-width: 767px) 100vw, 50vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5">
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{wol(t.photoCaptions[key].title)}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{wol(t.photoCaptions[key].desc)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Family history CTA */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow mb-5">{hg.family.eyebrow}</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E3A29] leading-tight mb-6">{wol(hg.family.title)}</h2>
              <p className="text-[#1E3A29]/70 font-sans text-base leading-relaxed mb-8">
                {wol(hg.family.desc)}
              </p>
              <Link to="/family-history" className="btn-primary">
                {hg.family.cta}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hg.family.generations.map((gen, i) => (
                <Link key={i} to="/family-history" className="heritage-card bg-white p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#86A94F] text-[#13261A] flex items-center justify-center font-display text-lg sm:text-2xl font-extrabold flex-shrink-0">{i + 1}</span>
                  <span className="font-display text-lg sm:text-2xl font-bold text-[#1E3A29] leading-tight">{gen}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
