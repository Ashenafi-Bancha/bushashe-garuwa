import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Plan Your Visit page
 * See it on the site: /visit
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  visit: {
    hero: {
      // EN: Your Visit
      eyebrow: "Intte Xomoosuwaa",
      // EN: Plan Your Visit
      title: "Intte Xomoosuwaa Keerite",
    },
    booking: {
      // EN: Book Your Experience
      eyebrow: "Erana Koyiyoobawu Sohuwaa Oyttite",
      // EN: What Would You Like to Experience?
      title: "Ay Meezetana Koyidetii?",
      // EN: Select one or more experiences and we'll be in touch to confirm your visit.
      desc: "Issi woykko cora erana koyidobata doorite; xomoosuwaa aguwaa shaakkanawu gayttana.",
    },
    types: {
      heritage: {
        // EN: Heritage Visit
        label: "Buquraa Be'anawu",
        // EN: Cultural houses, artifacts, and heritage tour
        desc: "Wogaa keettata, buqura miishshatanne buquraa be'uwaa",
      },
      cultural: {
        // EN: Cultural Tour
        label: "Wogaa Be'anawu",
        // EN: Music, dance, food and traditions
        desc: "Yettaa, durssaa, qumaanne wogata",
      },
      food: {
        // EN: Food Event
        label: "Qumaa Giigissuwaa",
        // EN: Traditional food experience
        desc: "Wogaa qumaa meeziyaa",
      },
      restaurant: {
        // EN: Restaurant
        label: "Katta Keettaa",
        // EN: Lunch or dinner at our restaurant
        desc: "Nu katta keettan laaxaa woykko kahuwaa",
      },
      guesthouse: {
        // EN: Guesthouse
        label: "Imatta Keettaa",
        // EN: Overnight stay
        desc: "Issi qammaa aattanawu",
      },
      group: {
        // EN: Group Visit
        label: "Citan Xomoosanawu",
        // EN: Groups of 10 or more
        desc: "10nne appe dariya asatu citaa",
      },
      education: {
        // EN: Educational Visit
        label: "Luxetta Xomoosuwaa",
        // EN: Schools, universities and researchers
        desc: "Timirtte Keettata, Yunbbersttetanne pilggiyaageeta",
      },
      meeting: {
        // EN: Meeting Hall
        label: "Yaa'iyoo Sohuwaa",
        // EN: Meetings, trainings and workshops
        desc: "Yaa'atanne Loohissota",
      },
    },
    gettingHere: {
      // EN: Getting Here
      title: "Sohuwaa Waani Gakkanee",
      routes: [
        {
          // EN: Directions
          from: "Ginata",
          // EN: Bushaashe Garuwa is near Gununo in Damot Sore Woreda, Wolaita Zone. Use the map below, or search for "XP44+J6 Gununo" on Google Maps. Contact us and we will gladly guide you.
          dir: "Bushaashe Garoy Gununo Ambbaa matan, Daamoota Soore Allaanan, Wolaytta Moottan de'ees. Dugeera de'iyaa karttaa go'etta woykko \"XP44+J6 Gununo\" gaada Googiliyaa Karttaa bollan xaafada koyya. Nuna demmite; gita ufayssan inttena kaalettana.",
        },
      ],
    },
    form: {
      // EN: Thank You!
      thanksTitle: "Galatoos!",
      // EN: We've received your request and will contact you shortly to confirm your visit to Bushaashe Garuwa.
      thanksText: "Intte azazuwaa ekkida; Bushaashe Garuwaa buussaa aguwaa shaakkanawu matan inttena demmana.",
      // EN: Your Details
      title: "Intte Marajjaa",
      // EN: Full Name *
      name: "Kumetta Sunttaa *",
      // EN: Your full name
      namePlaceholder: "Kumetta Suntaa Xaafite",
      // EN: Phone *
      phone: "Silkkiyaa Payduwaa *",
      // EN: Email
      email: "Iimayliyaa",
      // EN: Preferred Date *
      date: "Koyiyoo Gallassaa *",
      // EN: Number of Visitors
      visitors: "Xomoosiyaa asaa qoodaa",
      // EN: 1 visitor
      visitorOne: "1 xomoosiyaagaa",
      // EN: {count} visitors
      visitorMany: "{count} xomoosiyaageeta",
      // EN: Message
      message: "Kiitaa",
      // EN: Any special requirements or questions...
      messagePlaceholder: "Dumma koshshay woykko oyshay de'ikko...",
      // EN: Continue
      submit: "Qaxxala",
    },
  },
};

export default page;
