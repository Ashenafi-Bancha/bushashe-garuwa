import { useI18n } from '../i18n/I18nProvider';
import { useTestimonials } from '../lib/testimonials';
import CardGrid from './CardGrid';

/** Five small stars, the given number filled in gold */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={`w-4 h-4 ${n <= rating ? 'text-[#E8A21A]' : 'text-[#1E3A29]/15'}`} fill="currentColor" aria-hidden="true">
          <path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * What guests say: cards to swipe through on phones, a grid on larger screens.
 * The reviews are the ones staff published in the staff area (Guest reviews);
 * the section shows nothing until there is at least one.
 */
export default function Testimonials() {
  const { t, lang } = useI18n();
  const reviews = useTestimonials();
  if (reviews.length === 0) return null;
  const words = t.home.testimonials;

  return (
    <section className="py-16 sm:py-24" aria-labelledby="guests-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div data-reveal className="max-w-3xl mb-10 sm:mb-14">
          <span className="eyebrow mb-5">{words.eyebrow}</span>
          <h2 id="guests-title" className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[0.98]">{words.title}</h2>
        </div>
        <CardGrid>
          {reviews.map((guest, i) => (
            <figure key={`${guest.name}-${i}`} data-reveal className="h-full bg-white rounded-[1.75rem] p-6 sm:p-8 elev-1 flex flex-col justify-between gap-6">
              <div>
                {guest.rating ? <Stars rating={guest.rating} /> : null}
                <blockquote className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] leading-snug tracking-tight mt-4">
                  “{guest.words[lang]?.trim() || guest.words.en}”
                </blockquote>
              </div>
              <figcaption className="text-sm">
                <span className="block font-bold text-[#1E3A29]">{guest.name}</span>
                {guest.from && <span className="block text-[#1E3A29]/60">{guest.from}</span>}
              </figcaption>
            </figure>
          ))}
        </CardGrid>
      </div>
    </section>
  );
}
