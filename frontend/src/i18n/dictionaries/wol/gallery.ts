import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Gallery page
 * See it on the site: /gallery
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  gallery: {
    hero: {
      // EN: Gallery
      eyebrow: "Poototu Keettaa",
      // EN: Life at Bushaashe Garuwa
      title: "De'oy Bushaashe Garuwan",
    },
    // EN: Photographs from the grounds, the gardens and our cultural celebrations. More are added as the seasons and events go by.
    intro: "Gibbiyaa giddon, ataakiltte sohotuppenne wogaa baalatuppe denttido pootota. Wodiyan wodiyan hara hara poototi gujettoosona.",
    filters: {
      // EN: All
      all: "Ubbatakka",
      // EN: Grounds & Nature
      grounds: "Gibbiyaanne Meretaa",
      // EN: Culture & Events
      culture: "Wogaanne Makkisota",
    },
    // EN: {count} photos
    count: "{count} pootota",
    // EN: No photos in this category yet.
    empty: "Ha yaran hanno gakkanwukka poototi baawa.",
    // EN: Close
    close: "Gordda",
    // EN: Previous photo
    previous: "kase pootuwaa",
    // EN: Next photo
    next: "Kaalliyaa pootuwaa",
    // EN: {current} of {total}
    position: "{total} ppe {current}",
  },
};

export default page;
