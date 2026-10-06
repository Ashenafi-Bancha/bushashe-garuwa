import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · 3D pages under review (not public yet: translate last)
 * See it on the site: /preview
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  immersive: {
    // EN: Preparing the 3D view…
    loading: "",
    // EN: Drag to turn
    drag: "",
    // EN: Drag to look around
    lookAround: "",
    // EN: Close
    close: "",
    house: {
      // EN: Explore in 3D
      eyebrow: "",
      // EN: Walk Around a Traditional House
      title: "",
      // EN: A simple stand-in model. A scan of the real house will take its place.
      placeholder: "",
      // EN: Step inside
      stepInside: "",
      spots: {
        roof: {
          // EN: Thatched dome
          label: "",
          // EN: [HOTSPOT TEXT NEEDED: the roof]
          text: "",
        },
        wall: {
          // EN: Woven walls
          label: "",
          // EN: [HOTSPOT TEXT NEEDED: the walls]
          text: "",
        },
        door: {
          // EN: Carved door
          label: "",
          // EN: [HOTSPOT TEXT NEEDED: the door]
          text: "",
        },
        inside: {
          // EN: Inside the house
          label: "",
        },
      },
    },
    tour: {
      // EN: 360° Tour
      eyebrow: "",
      // EN: Look Around Bushaashe Garuwa
      title: "",
      // EN: Choose a place, then drag to look in every direction.
      desc: "",
      // EN: Open the 360° view
      open: "",
      // EN: [360° PHOTO NEEDED]
      needed: "",
      scenes: {
        // EN: The main gate
        gate: "",
        // EN: Inside Meeshsho Keettaa
        meeshsho: "",
        // EN: Inside Gulanttaa Keettaa
        gulanttaa: "",
        // EN: The great lawn
        lawn: "",
        // EN: The zigba trees
        zigba: "",
      },
    },
    museum: {
      // EN: The Collection
      eyebrow: "",
      // EN: Objects Kept in the Cultural Houses
      title: "",
      // EN: Scroll to walk past them. Choose one to turn it around.
      desc: "",
      // EN: Look closer
      closer: "",
      // EN: [OBJECT MODEL NEEDED]
      modelNeeded: "",
      // EN: [OBJECT STORY NEEDED]
      storyNeeded: "",
      items: {
        // EN: Grinding stone (wotta)
        wotta: "",
        // EN: Tools for spinning and weaving cotton
        cotton: "",
        // EN: Household goods
        household: "",
        // EN: Traditional instruments
        instruments: "",
      },
    },
    map: {
      // EN: Map of the Grounds
      eyebrow: "",
      // EN: Find Your Way Around
      title: "",
      // EN: Choose a point to see what is there.
      desc: "",
      // EN: [MAP LAYOUT NEEDED] The points are not yet in their true places.
      layoutNeeded: "",
      // EN: See more
      more: "",
      points: {
        // EN: The main gate
        gate: "",
        // EN: Meeshsho Keettaa
        meeshsho: "",
        // EN: Gulanttaa Keettaa
        gulanttaa: "",
        // EN: The zigba trees
        zigba: "",
      },
    },
  },
};

export default page;
