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
      eyebrow: "",
      // EN: Life at Bushaashe Garuwa
      title: "",
    },
    // EN: Photographs from the grounds, the gardens and our cultural celebrations. More are added as the seasons and events go by.
    intro: "",
    filters: {
      // EN: All
      all: "",
      // EN: Grounds & Nature
      grounds: "",
      // EN: Culture & Events
      culture: "",
    },
    // EN: {count} photos
    count: "",
    // EN: No photos in this category yet.
    empty: "",
    // EN: Close
    close: "",
    // EN: Previous photo
    previous: "",
    // EN: Next photo
    next: "",
    // EN: {current} of {total}
    position: "",
  },
};

export default page;
