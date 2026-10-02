import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photos } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import type { Dictionary } from '../i18n/dictionaries/en';
import PageHero from '../components/PageHero';
import StayInquiry, { type RoomId } from '../components/StayInquiry';
import StickyBook from '../components/StickyBook';
import { scrollToHash } from '../lib/motion';

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
  // the room asked about in the request form
  const [wanted, setWanted] = useState<RoomId | ''>('');
  const askFor = (room: RoomId | '') => {
    setWanted(room);
    scrollToHash('#book');
  };

  return (
    <main>
      {/* Hero */}
      <PageHero slot="stay" eyebrow={st.hero.eyebrow} title={st.hero.title} desc={st.hero.desc} />

      {/* Room cards */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {rooms.map(({ id, size, amenities }, i) => {
              const room = st.rooms[id];
              return (
              <div key={id} className={`grid lg:grid-cols-2 gap-0 overflow-hidden bg-white rounded-3xl shadow-sm ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                {/* Gallery */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-[#1E3A29]/10">
                  <Photo alt={room.name} label={room.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="p-5 sm:p-8 lg:p-10 flex flex-col">
                  <h2 className="font-display text-3xl font-semibold text-[#1E3A29] mb-4">{room.name}</h2>

                  <div className="flex gap-6 mb-5">
                    <div className="text-[#1E3A29]/50 text-xs font-sans">{size}</div>
                    <div className="text-[#1E3A29]/50 text-xs font-sans">{room.guests}</div>
                  </div>

                  <p className="text-[#1E3A29]/65 font-sans text-sm leading-relaxed mb-6 flex-1">{room.desc}</p>

                  <div className="mb-6">
                    <div className="text-[#1E3A29]/65 text-xs font-sans tracking-wider uppercase mb-3">{st.amenitiesLabel}</div>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((a) => (
                        <span key={a} className="flex items-center gap-1.5 text-xs font-sans text-[#1E3A29]/70 rounded-full border border-[#1E3A29]/15 px-3 py-1.5">
                          {st.amenities[a]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedRoom(selectedRoom === i ? null : i)}
                      className="btn-outline btn-sm flex-1 text-[#1E3A29]"
                    >
                      {st.viewDetails}
                    </button>
                    <button type="button" onClick={() => askFor(id)} className="btn-primary btn-sm flex-1">
                      {st.bookRoom}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why stay */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] py-12 sm:py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-4xl font-semibold text-[#13261A] mb-4">{st.why.title}</h2>
            <p className="text-[#1E3A29]/80 font-sans text-base max-w-xl mx-auto">{st.why.desc}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyStay.map((item) => (
              <div key={item.id} className="text-center">
                <h3 className="text-[#13261A] font-display text-lg mb-2">{st.why.items[item.id].title}</h3>
                <p className="text-[#1E3A29]/70 font-sans text-sm leading-relaxed">{st.why.items[item.id].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request a stay: reaches the staff area */}
      <StayInquiry room={wanted} onRoom={setWanted} />

      {/* CTA */}
      <section className="bg-[#F4EFE4] py-12 sm:py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-4xl font-semibold text-[#1E3A29] mb-4">{st.cta.title}</h2>
          <p className="text-[#1E3A29]/55 font-sans text-base max-w-xl mx-auto mb-10">{st.cta.desc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button type="button" onClick={() => askFor(wanted)} className="btn-primary">
              {st.cta.book}
            </button>
            <Link to="/contact" className="btn-outline text-[#1E3A29]">
              {st.cta.ask}
            </Link>
          </div>
        </div>
      </section>
      <StickyBook />
    </main>
  );
}
