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
    close: "Gordda",
    house: {
      // EN: Explore in 3D
      eyebrow: "3D-n Be'a",
      // EN: Walk Around a Traditional House
      title: "Wogaa Keettaa Yuuya",
      // EN: A simple stand-in model. A scan of the real house will take its place.
      placeholder: "Xalala misile de'iyaa. Tumu keettaa misiley matan hayssan kessettana.",
      // EN: Step inside
      stepInside: "Giddo gelite",
      spots: {
        roof: {
          // EN: Thatched dome
          label: "Maatan dadettida qum\"uwaa",
          // EN: [HOTSPOT TEXT NEEDED: the roof]
          text: "[KEETTA HUUPHE QAALA KOSHSHIYA]: keettaa huuphea",
        },
        wall: {
          // EN: Woven walls
          label: "Dadettida godata",
          // EN: [HOTSPOT TEXT NEEDED: the walls]
          text: "[DEESE QAALA KOSHSHIYA]: deeseata",
        },
        door: {
          // EN: Carved door
          label: "Xaaxettida panggiyaa",
          // EN: [HOTSPOT TEXT NEEDED: the door]
          text: "",
        },
        inside: {
          // EN: Inside the house
          label: "Keettaa gidduwaa",
        },
      },
    },
    tour: {
      // EN: 360° Tour
      eyebrow: "360° Yuushshidi be'uwa",
      // EN: Look Around Bushaashe Garuwa
      title: "Bushaashe Garuwaa Yuuyada Be'a",
      // EN: Choose a place, then drag to look in every direction.
      desc: "Sohuwaa doorada, ubba ginaarakka be'anawu goochcha.",
      // EN: Open the 360° view
      open: "360° be'uwaa dooya",
      // EN: [360° PHOTO NEEDED]
      needed: "[360° MISILE KOSHSHEES]",
      scenes: {
        // EN: The main gate
        gate: "Waanna kare panggiyaa",
        // EN: Inside “Meesho Keettaa”
        meeshsho: "Meesho Keettaa gidduwaa",
        // EN: Inside “Gulanttaa Keettaa”
        gulanttaa: "Gulanttaa Keettaa gidduwaa",
        // EN: The great lawn
        lawn: "Gita qooruwaa",
        // EN: The zigba trees
        zigba: "Zigaa mittata",
      },
    },
    museum: {
      // EN: The Collection
      eyebrow: "Shiiquwaa",
      // EN: Objects Kept in the Cultural Houses
      title: "Wogaa Keettan Naagettida Miishshata",
      // EN: Scroll to walk past them. Choose one to turn it around.
      desc: "Entta xaleetti aadhdhanawu dirichcha. Issuwaa doorada yuushshada be'a.",
      // EN: Look closer
      closer: "Matan xeella",
      // EN: [OBJECT MODEL NEEDED]
      modelNeeded: "[MEESHSHA MISILE KOSHSHEES]",
      // EN: [OBJECT STORY NEEDED]
      storyNeeded: "[MIISHSHAA TARIKEE KOSHSHEES]",
      items: {
        // EN: Grinding stone (“wotta”)
        wotta: "Gaacciyoo shuchchaa(Woxaa)",
        // EN: Tools for spinning and weaving cotton
        cotton: "Puuttuwaa suqqiyoonne daddiyoo miishshata.",
        // EN: Household goods
        household: "Keetta giddo miishshata",
        // EN: Traditional instruments
        instruments: "Yettaa miishshata",
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
      more: "Daruwa be'a",
      points: {
        // EN: The main gate
        gate: "Waanna kara panggiyaa",
        // EN: “Meesho Keettaa”
        meeshsho: "Meesho Keettaa",
        // EN: “Gulanttaa Keettaa”
        gulanttaa: "Gulantta Keettaa",
        // EN: The zigba trees
        zigba: "Zigaa mittata",
      },
    },
  },
};

export default page;
