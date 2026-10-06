import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Heritage page
 * See it on the site: /heritage
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  heritage: {
    hero: {
      // EN: Wolaita Heritage
      eyebrow: "",
      // EN: Explore Wolaita Heritage in Bushaashe Garuwa
      title: "",
    },
    // EN: Every element of Bushaashe Garuwa is a living chapter of Wolaita history. Explore our heritage categories and discover the stories within each one.
    intro: "",
    // EN: {count} items
    itemCount: "",
    categories: {
      houses: {
        // EN: Cultural Houses
        label: "",
        // EN: Two traditional Wolaita houses, Gulanttaa Keettaa and Meeshsho Keettaa, full of the traditional tools and instruments of the Wolaita people.
        desc: "",
      },
      trees: {
        // EN: Trees & Plants
        label: "",
        // EN: Heritage trees, mango, apple, papaya and banana, more than 1,800 coffee trees, enset and fragrant traditional garden plants.
        desc: "",
      },
      animals: {
        // EN: Animals & Zoo
        label: "",
        // EN: A small zoo where visitors meet the animals kept on the heritage grounds of Bushaashe Garuwa.
        desc: "",
      },
      artifacts: {
        // EN: Artifacts
        label: "",
        // EN: Treasured objects of Wolaita craft, ceremony and daily life.
        desc: "",
      },
      clothing: {
        // EN: Traditional Clothing
        label: "",
        // EN: Clothing that carries culture: the visual language of Wolaita identity.
        desc: "",
      },
      music: {
        // EN: Music & Dance
        label: "",
        // EN: Living traditions of Wolaita music, song, and ceremonial dance.
        desc: "",
      },
      food: {
        // EN: Traditional Food
        label: "",
        // EN: Recipes passed through generations: the taste of Wolaita heritage.
        desc: "",
      },
      stories: {
        // EN: Oral Histories
        label: "",
        // EN: Stories passed down in Wolaytta, Amharic and English.
        desc: "",
      },
    },
    houses: {
      // EN: Traditional Houses
      eyebrow: "",
      // EN: Two Traditional Wolaita Houses
      title: "",
      // EN: Bushaashe Garuwa keeps two traditional and cultural Wolaita houses. Inside them are the traditional tools and instruments the Wolaita people have used in daily life, work and ceremony.
      desc: "",
      // EN: Traditional Wolaita house
      label: "",
      // EN: Inside: the traditional grinding stone (wotta), tools for spinning and weaving cotton, household goods, and the traditional instruments of the Wolaita people.
      inside: "",
    },
    trees: {
      // EN: Living Memory
      eyebrow: "",
      // EN: Trees Planted by Our Forefathers and the Current Generation
      title: "",
      items: {
        zigba: {
          // EN: Zigba (African Yellowwood)
          name: "",
          // EN: Planted by our forefathers and the current generation
          age: "",
          // EN: The zigba trees stand in a long line across the grounds. Our forefathers planted the first of them, the family has protected them ever since, and the current generation keeps planting new ones beside them.
          sig: "",
        },
      },
      // EN: Scan QR codes on-site to discover each tree's full story
      qr: "",
    },
    family: {
      // EN: Family Legacy
      eyebrow: "",
      // EN: Generations of Heritage
      title: "",
      // EN: Behind every cultural house, every artifact and every story is a family that devoted generations to preserving the soul of Wolaita. Discover the people behind the heritage.
      desc: "",
      // EN: Discover the Family Story
      cta: "",
      generations: [
        // EN: Bushaashe
        "",
        // EN: Alambo
        "",
        // EN: Garedew
        "",
        // EN: Today
        "",
      ],
    },
  },
};

export default page;
