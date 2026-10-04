import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Photo descriptions and captions (gallery, and read aloud by screen readers)
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
  photos: {
    // EN: Meeshsho Keettaa: a traditional Wolaita house with a thatched dome and a carved wooden door, among enset plants
    meeshsho: "",
    // EN: Bushaashe Garuwa: the main gate with its carved tree-trunk pillars and the welcome sign
    gate: "",
    // EN: Bushaashe Garuwa: traditional thatched house, flags and grounds
    house: "",
    // EN: Bushaashe Garuwa: thatched pavilions and lush gardens
    pavilions: "",
    // EN: Bushaashe Garuwa: gardens and recreational grounds
    gardens: "",
    // EN: Bushaashe Garuwa: open lawns, heritage tree and traditional house
    lawn: "",
    // EN: Bushaashe Garuwa: traditional thatched house, fountain and flags among the gardens
    home: "",
    // EN: Enset (false banana) growing at Bushaashe Garuwa, the staple plant of Wolaita food culture
    enset: "",
    // EN: Traditional Wolaita dishes served in woven baskets inside a cultural house at Bushaashe Garuwa
    food: "",
    // EN: The row of zigba trees at Bushaashe Garuwa, planted by the forefathers of the family
    zigba: "",
    // EN: Gifaataa celebration at Bushaashe Garuwa: guests in traditional Wolaita dress walking through the heritage gate
    gifaataa1: "",
    // EN: Gifaataa celebration: women in traditional Wolaita dress gathered on the Bushaashe Garuwa lawn
    gifaataa2: "",
    // EN: Gifaataa celebration: guests in traditional Wolaita attire on the Bushaashe Garuwa grounds
    gifaataa3: "",
  },

  photoCaptions: {
    meeshsho: {
      // EN: Meeshsho Keettaa
      title: "",
      // EN: A traditional Wolaita house: a thatched dome, woven walls and a carved door, standing among the enset.
      desc: "",
    },
    gate: {
      // EN: The Main Gate
      title: "",
      // EN: Two carved tree-trunk pillars, the welcome sign and the bamboo doors: the way into Bushaashe Garuwa.
      desc: "",
    },
    home: {
      // EN: The Heart of the Grounds
      title: "",
      // EN: The great traditional house, the fountain and the flags, set among the gardens.
      desc: "",
    },
    gifaataa1: {
      // EN: Arriving for Gifaataa
      title: "",
      // EN: Guests in traditional Wolaita dress walk through the heritage gate for the new year celebration.
      desc: "",
    },
    house: {
      // EN: The Traditional House
      title: "",
      // EN: A traditional Wolaita house with its thatched roof, beside the path and the Ge'ez letters of the name.
      desc: "",
    },
    gifaataa2: {
      // EN: Women of Gifaataa
      title: "",
      // EN: Women in white and red traditional Wolaita dress gather on the lawn during Gifaataa.
      desc: "",
    },
    pavilions: {
      // EN: Thatched Pavilions
      title: "",
      // EN: Shaded pavilions among the trees, where visitors rest and gather.
      desc: "",
    },
    gifaataa3: {
      // EN: Guests of the Celebration
      title: "",
      // EN: Guests in traditional Wolaita attire stand together on the grounds during Gifaataa.
      desc: "",
    },
    gardens: {
      // EN: The Gardens
      title: "",
      // EN: Green lawns, hedges and a play area for children and families.
      desc: "",
    },
    enset: {
      // EN: Enset, the False Banana
      title: "",
      // EN: Enset growing on the grounds: the staple plant at the heart of Wolaita food and culture.
      desc: "",
    },
    food: {
      // EN: The Taste of Wolaita
      title: "",
      // EN: Traditional Wolaita dishes, from enset to beans and greens, served in woven baskets inside a cultural house.
      desc: "",
    },
    zigba: {
      // EN: The Zigba Trees
      title: "",
      // EN: Zigba trees planted by the forefathers of the family, standing in a row like a peaceful procession.
      desc: "",
    },
    lawn: {
      // EN: The Great Lawn
      title: "",
      // EN: Open lawns and the great tree, with the traditional house in the distance.
      desc: "",
    },
  },
};

export default page;
