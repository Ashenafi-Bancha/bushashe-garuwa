import { photos, picture, type PhotoKey } from '../assets/photos';
import Photo from '../components/Photo';
import { useI18n } from '../i18n/I18nProvider';
import PageHero from '../components/PageHero';
import ContactButtons from '../components/ContactButtons';

/* What the hall is used for, each with its photograph where there is one; the words are in the translations (t.meeting.uses) */
const USES: { id: 'meetings' | 'trainings' | 'education' | 'weddings' | 'family' | 'anniversaries' | 'visitors'; photo?: PhotoKey }[] = [
  { id: 'meetings', photo: 'meetingHall' },
  { id: 'trainings', photo: 'eventGathering' },
  { id: 'education' },
  { id: 'weddings' },
  { id: 'family', photo: 'eventElders' },
  { id: 'anniversaries', photo: 'eventCelebration' },
  { id: 'visitors', photo: 'gifaataa3' },
];

/**
 * The meeting hall, a service of its own: a hall on the grounds for meetings,
 * trainings, lessons, weddings, family days and visitor groups. It is arranged
 * by calling or writing; there is no booking form.
 */
export default function MeetingHall() {
  const { t } = useI18n();
  const m = t.meeting;

  return (
    <main>
      <PageHero slot="meetingHall" eyebrow={m.hero.eyebrow} title={m.hero.title} desc={m.hero.desc} />

      {/* What it is for */}
      <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="hall-what">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 lg:gap-16 lg:items-end mb-10 sm:mb-12">
            <div>
              <span className="eyebrow mb-5">{m.intro.eyebrow}</span>
              <h2 id="hall-what" className="font-display text-4xl sm:text-5xl font-extrabold text-[#1E3A29] leading-[1]">{m.intro.title}</h2>
            </div>
            <p className="text-[#1E3A29]/70 text-base sm:text-lg leading-relaxed">{m.intro.text}</p>
          </div>

          <ul data-wave className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {USES.map(({ id, photo }, i) => (
              <li key={id} data-reveal className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <Photo src={photo && photos[photo]} alt={photo ? t.photos[photo] : m.uses[id].title} label={m.uses[id].title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-5 sm:px-5">
                  <span className="block text-[#C4622D] text-sm font-bold tabular-nums mb-2">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] tracking-tight mb-2">{m.uses[id].title}</h3>
                  <p className="text-[#1E3A29]/65 text-sm sm:text-base leading-relaxed">{m.uses[id].desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The hall and the grounds, in photographs */}
      <section className="bg-[#E3EBD8] mx-2 sm:mx-3 rounded-[2rem] sm:rounded-[3rem] py-12 sm:py-16 lg:py-20" aria-labelledby="hall-photos">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 id="hall-photos" className="font-display text-3xl sm:text-4xl font-extrabold text-[#13261A] leading-tight mb-8 sm:mb-10">{m.photosTitle}</h2>
          <div data-wave className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {(['meetingHall', 'hallAndBar', 'eventGathering'] as const).map((key) => (
              <figure key={key} className="bg-white rounded-[2rem] p-2.5 elev-1">
                <div className="img-zoom rounded-[1.5rem] overflow-hidden aspect-[3/2]">
                  <img {...picture(photos[key], '(max-width: 767px) 100vw, 33vw')} alt={t.photos[key]} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <figcaption className="px-4 py-4 sm:px-5">
                  <span className="block font-display text-xl font-bold text-[#1E3A29]">{t.photoCaptions[key].title}</span>
                  <span className="block text-[#1E3A29]/65 text-sm mt-1">{t.photoCaptions[key].desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Arranging it */}
      <section className="py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E3A29] mb-3">{m.cta.title}</h2>
          <p className="text-[#1E3A29]/70 max-w-xl mx-auto mb-7">{m.cta.text}</p>
          <ContactButtons className="justify-center" />
        </div>
      </section>
    </main>
  );
}
