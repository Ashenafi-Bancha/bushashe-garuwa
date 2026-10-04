import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Dine page
 * See it on the site: /dine
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  dine: {
    hero: {
      // EN: Restaurant & Bar
      eyebrow: "",
      // EN: Taste the Culture in Bushaashe Garuwa
      title: "",
      // EN: Every dish is rooted in tradition, prepared with care, and served with Wolaita warmth.
      desc: "",
    },
    categories: {
      // EN: Wolaita Cuisine
      wolaita: "",
      // EN: Ethiopian Cuisine
      ethiopian: "",
      // EN: Drinks
      drinks: "",
      // EN: Special Events
      special: "",
    },
    menu: {
      wolaita: {
        kitfo: {
          // EN: Kitfo Wolaita
          name: "",
          // EN: Minced beef seasoned with mitmita and niter kibbeh, served with kocho and ayib.
          desc: "",
        },
        bulla: {
          // EN: Bulla Porridge
          name: "",
          // EN: Traditional Wolaita porridge made from the root of the false banana plant, a staple food of the region.
          desc: "",
        },
        kocho: {
          // EN: Kocho with Wot
          name: "",
          // EN: Traditional Wolaita flat bread made from ensete, served with richly spiced vegetable or meat stew.
          desc: "",
        },
        tibs: {
          // EN: Tibs Wolaita
          name: "",
          // EN: Sautéed beef or lamb with onion, tomato, green pepper and traditional spices.
          desc: "",
        },
      },
      ethiopian: {
        doroWat: {
          // EN: Doro Wat
          name: "",
          // EN: Ethiopia's iconic slow-cooked chicken stew in a rich berbere sauce, served with injera.
          desc: "",
        },
        beyaynetu: {
          // EN: Injera with Beyaynetu
          name: "",
          // EN: A generous spread of vegetarian wots and salads on injera, ideal for cultural sharing.
          desc: "",
        },
        goredGored: {
          // EN: Gored Gored
          name: "",
          // EN: Tender cubed beef seasoned with kibbeh and served with injera.
          desc: "",
        },
        shiro: {
          // EN: Shiro Wat
          name: "",
          // EN: Smooth chickpea flour stew slow-cooked with spices. A classic Ethiopian comfort dish.
          desc: "",
        },
      },
      drinks: {
        bunna: {
          // EN: Bunna (Coffee)
          name: "",
          // EN: Ethiopian coffee served in the traditional ceremony style: three rounds, fresh roasted.
          desc: "",
        },
        tej: {
          // EN: Tej
          name: "",
          // EN: Traditional Ethiopian honey wine, lightly fermented and refreshing.
          desc: "",
        },
        tella: {
          // EN: Tella
          name: "",
          // EN: Home-brewed sorghum beer, a community beverage of Wolaita.
          desc: "",
        },
        juice: {
          // EN: Fresh Juice
          name: "",
          // EN: Seasonal fresh fruit juice: avocado, mango, papaya or passion fruit.
          desc: "",
        },
      },
      special: {
        foodEvening: {
          // EN: Cultural Food Evening
          name: "",
          // EN: Our monthly gathering: full traditional meal, coffee ceremony, music and storytelling. Reserve in advance.
          desc: "",
        },
        groupFeast: {
          // EN: Group Cultural Feast
          name: "",
          // EN: A full traditional feast for groups of 8–30 people, with cultural performance included.
          desc: "",
        },
        privateDinner: {
          // EN: Private Heritage Dinner
          name: "",
          // EN: An intimate private dinner experience in the heritage garden, available by request.
          desc: "",
        },
      },
    },
    // EN: Join a Cultural Food Event
    joinEvent: "",
    bar: {
      // EN: Bar
      eyebrow: "",
      // EN: Gather. Relax. Connect.
      title: "",
      // EN: Our bar is where stories are shared, community is built, and the day slowly fades into the warmth of Wolaita evenings. Traditional drinks alongside modern refreshments, always served with genuine hospitality.
      desc: "",
      // EN: Weekdays
      weekdays: "",
      // EN: Weekends
      weekends: "",
      drinks: [
        // EN: Tej (Honey Wine)
        "",
        // EN: Tella (Sorghum Beer)
        "",
        // EN: Ethiopian Coffee
        "",
        // EN: Fresh Juices
        "",
        // EN: Local Spirits
        "",
        // EN: Soft Drinks
        "",
      ],
    },
  },
};

export default page;
