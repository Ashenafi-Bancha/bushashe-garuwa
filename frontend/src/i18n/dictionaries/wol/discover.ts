import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Discover page
 * See it on the site: /discover
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  discover: {
    hero: {
      // EN: Who We Are
      eyebrow: "",
      // EN: Discover Bushaashe Garuwa
      title: "",
    },
    story: {
      // EN: Our Story
      eyebrow: "",
      // EN: A Heritage That Lives and Breathes
      title: "",
      // EN: Bushaashe Garuwa was not built as a destination. It grew as a family, generation by generation, rooted in the soil of Wolaita, shaped by its history, and sustained by its culture.
      p1: "",
      // EN: What began as a family homestead became a place of cultural preservation. What was preserved became a heritage. What became a heritage became an invitation: to visitors, students, researchers, and anyone curious about the depth and beauty of Wolaita culture.
      p2: "",
    },
    mission: {
      // EN: Our Mission
      label: "",
      // EN: To Preserve, Share and Celebrate Wolaita Heritage
      title: "",
      // EN: We preserve the cultural, historical, and natural heritage of Wolaita and make it accessible to all, through authentic experiences, education, and living community participation.
      text: "",
    },
    vision: {
      // EN: Our Vision
      label: "",
      // EN: A Living Heritage, Celebrated by the World
      title: "",
      // EN: We envision Bushaashe Garuwa as the leading cultural heritage destination in Southern Ethiopia, a place where Wolaita knowledge, culture and community continue to thrive and inspire.
      text: "",
    },
    pillars: {
      // EN: Why Bushaashe Garuwa?
      eyebrow: "",
      // EN: Four Reasons to Come
      title: "",
      items: {
        heritage: {
          // EN: Heritage
          title: "",
          // EN: Four generations of Wolaita family history, cultural houses, artifacts and oral traditions preserved in one living destination.
          desc: "",
        },
        nature: {
          // EN: Nature
          title: "",
          // EN: Ancient trees, heritage plants, animals, and the natural landscape of Wolaita, all within the Bushaashe Garuwa grounds.
          desc: "",
        },
        knowledge: {
          // EN: Knowledge
          title: "",
          // EN: Oral histories and traditional knowledge of Wolaita culture, language and farming, kept by the family and shared with visitors.
          desc: "",
        },
        hospitality: {
          // EN: Hospitality
          title: "",
          // EN: Authentic Wolaita food, a welcoming guesthouse, a warm restaurant and the genuine hospitality of our family.
          desc: "",
        },
      },
    },
    cta: {
      // EN: Bushaashe Garuwa is waiting for you. Plan your visit and begin your journey into Wolaita heritage.
      desc: "",
      // EN: Explore Heritage
      explore: "",
    },
  },
};

export default page;
