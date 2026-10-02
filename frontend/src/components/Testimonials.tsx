import { useI18n } from '../i18n/I18nProvider';
import { TESTIMONIALS } from '../lib/testimonials';
import SwipeRow from './SwipeRow';

/**
 * What guests say: cards to swipe through on phones, a grid on larger screens.
 * Shows nothing until real words are added to lib/testimonials.ts.
 */
export default function Testimonials() {
  const { t, lang } = useI18n();
  if (TESTIMONIALS.length === 0) return null;
  const words = t.home.testimonials;

  return (
    <section className="py-16 sm:py-24" aria-labelledby="guests-title">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div data-reveal className="max-w-3xl mb-10 sm:mb-14">
          <span className="eyebrow mb-5">{words.eyebrow}</span>
          <h2 id="guests-title" className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A29] leading-[0.98]">{words.title}</h2>
        </div>
        <SwipeRow>
          {TESTIMONIALS.map((guest) => (
            <figure key={guest.name} data-reveal className="h-full bg-white rounded-[1.75rem] p-6 sm:p-8 elev-1 flex flex-col justify-between gap-6">
              <blockquote className="font-display text-xl sm:text-2xl font-bold text-[#1E3A29] leading-snug tracking-tight">“{guest.words[lang] ?? guest.words.en}”</blockquote>
              <figcaption className="text-sm">
                <span className="block font-bold text-[#1E3A29]">{guest.name}</span>
                {guest.from && <span className="block text-[#1E3A29]/60">{guest.from}</span>}
              </figcaption>
            </figure>
          ))}
        </SwipeRow>
      </div>
    </section>
  );
}
