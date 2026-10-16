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
    loading: "3D be'uwaa giigissiyoogaa...",
    // EN: Drag to turn
    drag: "Yuushshanawu goochcha",
    // EN: Drag to look around
    lookAround: "Yuuyidi be'anawu goochcha",
    // EN: Close
    close: "Guyyissite",
    house: {
      // EN: Explore in 3D
      eyebrow: "3D-n Be'a",
      // EN: Walk Around a Traditional House
      title: "Aada Keettaa Yuuya",
      // EN: A simple stand-in model. A scan of the real house will take its place.
      placeholder: "Xalala misile de'iyaa. Tumu keettaa misiley matan hayssan kessettana.",
      // EN: Step inside
      stepInside: "Giddoyite",
      spots: {
        roof: {
          // EN: Thatched dome
          label: "Maaxxa huuphea",
          // EN: [HOTSPOT TEXT NEEDED: the roof]
          text: "[KEETTA HUUPHE QAALA KOSHSHIYA]: keettaa huuphea",
        },
        wall: {
          // EN: Woven walls
          label: "Xammettida deesea",
          // EN: [HOTSPOT TEXT NEEDED: the walls]
          text: "[DEESE QAALA KOSHSHIYA]: deeseata",
        },
        door: {
          // EN: Carved door
          label: "Qaxxarettida panggaa",
          // EN: [HOTSPOT TEXT NEEDED: the door]
          text: "[PANGGA QAALA KOSHSHIYA]: panggaa",
        },
        inside: {
          // EN: Inside the house
          label: "Keettaa giddosuwaa",
        },
      },
    },
    tour: {
      // EN: 360° Tour
      eyebrow: "360° Yuushu be'uwaa",
      // EN: Look Around Bushaashe Garuwa
      title: "Bushaashe Garuwaa Yuuyada Be'a",
      // EN: Choose a place, then drag to look in every direction.
      desc: "Sohuwaa doorada, heedzaneyka be'anawu goochcha.",
      // EN: Open the 360° view
      open: "360° be'uwaa dooya",
      // EN: [360° PHOTO NEEDED]
      needed: "[360° MISILE KOSHSHIYA]",
      scenes: {
        // EN: The main gate
        gate: "Waanna kera panggaa",
        // EN: Inside Meeshsho Keettaa
        meeshsho: "Meeshsho Keettaa giddosuwaa",
        // EN: Inside Gulanttaa Keettaa
        gulanttaa: "Gulanttaa Keettaa giddosuwaa",
        // EN: The great lawn
        lawn: "Gita maata sa'aa",
        // EN: The zigba trees
        zigba: "Zigbaa mittata",
      },
    },
    museum: {
      // EN: The Collection
      eyebrow: "Shiiquwaa",
      // EN: Objects Kept in the Cultural Houses
      title: "Aada Keettan Naagettida Meeshshata",
      // EN: Scroll to walk past them. Choose one to turn it around.
      desc: "Entta xaleetti aadhdhanawu dirichcha. Issuwaa doorada yuushshada be'a.",
      // EN: Look closer
      closer: "Matan xeella",
      // EN: [OBJECT MODEL NEEDED]
      modelNeeded: "[MEESHSHA MISILE KOSHSHIYA]",
      // EN: [OBJECT STORY NEEDED]
      storyNeeded: "[MEESHSHA TARIKI KOSHSHIYA]",
      items: {
        // EN: Grinding stone (wotta)
        wotta: "Wottaa",
        // EN: Tools for spinning and weaving cotton
        cotton: "Tooniyaanne maoyo oosuwaa miishshata",
        // EN: Household goods
        household: "Keetta giddosaa miishshata",
        // EN: Traditional instruments
        instruments: "Aada yettiya meeshshata",
      },
    },
    map: {
      // EN: Map of the Grounds
      eyebrow: "Gadiyaa Karttaa",
      // EN: Find Your Way Around
      title: "Ne Ogiyaa Garssaappe Demma",
      // EN: Choose a point to see what is there.
      desc: "Yan de'iyaagaa be'anawu xiyaa doorada goottexxa.",
      // EN: [MAP LAYOUT NEEDED] The points are not yet in their true places.
      layoutNeeded: "[KARTTA GIIGISSO KOSHSHIYA] Xiyayti tumu sohuwan ha'i gakkanaas wodedibeenna.",
      // EN: See more
      more: "Aaruwa be'a",
      points: {
        // EN: The main gate
        gate: "Waanna kera panggaa",
        // EN: Meeshsho Keettaa
        meeshsho: "Meeshsho Keettaa",
        // EN: Gulanttaa Keettaa
        gulanttaa: "Gulanttaa Keettaa",
        // EN: The zigba trees
        zigba: "Zigbaa mittata",
      },
    },
  },
};

export default page;
