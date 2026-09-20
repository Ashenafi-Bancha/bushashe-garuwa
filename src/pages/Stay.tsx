import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';

type Amenity = keyof Dictionary['stay']['amenities'];

/* Room facts and amenities — names and descriptions live in the translations (t.stay.rooms) */
const rooms: { id: keyof Dictionary['stay']['rooms']; size: string; amenities: Amenity[] }[] = [
  { id: 'standard', size: '22 m²', amenities: ['wifi', 'bathroom', 'breakfast', 'garden', 'cultural', 'reading'] },
  { id: 'family', size: '38 m²', amenities: ['wifi', 'bathroom', 'breakfast', 'outdoor', 'cultural', 'kids'] },
  { id: 'heritage', size: '45 m²', amenities: ['wifi', 'bathroom', 'breakfast', 'terrace', 'fullCultural', 'coffee', 'guide'] },
];

const whyStay = [
  { id: 'setting' },
  { id: 'breakfast' },
  { id: 'access' },
  { id: 'coffee' },
] as const;

export default function Stay() {
  const { t } = useI18n();
  const st = t.stay;
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative mx-2 sm:mx-3 rounded-[2rem] h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <img src={photos.pavilions} alt={t.photos.pavilions} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2820]/90 via-[#173F35]/30 to-transparent"/>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <span className="eyebrow glass text-white mb-5">{st.hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.02]">{st.hero.title}</h1>
          <p className="text-white/65 font-sans text-base mt-4 max-w-xl">{st.hero.desc}</p>
        </div>
      </section>

      {/* Room cards */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {rooms.map(({ id, size, amenities }, i) => {
              const room = st.rooms[id];
              return (
              <div key={id} className={`grid lg:grid-cols-2 gap-0 overflow-hidden bg-white rounded-3xl shadow-sm ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                {/* Gallery */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-[#173F35]/10">
                  <Photo alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="p-5 sm:p-8 lg:p-10 flex flex-col">
                  <h2 className="font-display text-3xl font-semibold text-[#173F35] mb-4">{room.name}</h2>

                  <div className="flex gap-6 mb-5">
                    <div className="text-[#1D211E]/50 text-xs font-sans">{size}</div>
                    <div className="text-[#1D211E]/50 text-xs font-sans">{room.guests}</div>
                  </div>

                  <p className="text-[#1D211E]/65 font-sans text-sm leading-relaxed mb-6 flex-1">{room.desc}</p>

                  <div className="mb-6">
                    <div className="text-[#1D211E]/40 text-xs font-sans tracking-wider uppercase mb-3">{st.amenitiesLabel}</div>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((a) => (
                        <span key={a} className="flex items-center gap-1.5 text-xs font-sans text-[#173F35]/70 rounded-full border border-[#173F35]/15 px-3 py-1.5">
                          {st.amenities[a]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRoom(selectedRoom === i ? null : i)}
                      className="flex-1 border border-[#173F35] text-[#173F35] hover:bg-[#173F35] hover:text-white text-xs font-sans font-semibold rounded-full py-3.5 transition-colors"
                    >
                      {st.viewDetails}
                    </button>
                    <Link to="/contact" className="flex-1 bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] text-xs font-sans font-semibold rounded-full py-3.5 transition-colors text-center">
                      {st.bookRoom}
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why stay */}
      <section className="bg-[#173F35] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-4xl font-semibold text-white mb-4">{st.why.title}</h2>
            <p className="text-white/55 font-sans text-base max-w-xl mx-auto">{st.why.desc}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyStay.map((item) => (
              <div key={item.id} className="text-center">
                <h3 className="text-white font-display text-lg mb-2">{st.why.items[item.id].title}</h3>
                <p className="text-white/45 font-sans text-sm leading-relaxed">{st.why.items[item.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F5F0] py-12 sm:py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-4xl font-semibold text-[#173F35] mb-4">{st.cta.title}</h2>
          <p className="text-[#1D211E]/55 font-sans text-base max-w-xl mx-auto mb-10">{st.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1e5447] text-white text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {st.cta.book}
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-[#173F35] text-[#173F35] hover:bg-[#173F35] hover:text-white text-sm font-sans font-semibold rounded-full px-10 py-4 transition-colors">
              {st.cta.ask}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
