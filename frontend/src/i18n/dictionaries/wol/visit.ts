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
      eyebrow: "",
      // EN: Plan Your Visit
      title: "",
    },
    booking: {
      // EN: Book Your Experience
      eyebrow: "",
      // EN: What Would You Like to Experience?
      title: "",
      // EN: Select one or more experiences and we'll be in touch to confirm your visit.
      desc: "",
    },
    types: {
      heritage: {
        // EN: Heritage Visit
        label: "",
        // EN: Cultural houses, artifacts, and heritage tour
        desc: "",
      },
      cultural: {
        // EN: Cultural Tour
        label: "",
        // EN: Music, dance, food and traditions
        desc: "",
      },
      food: {
        // EN: Food Event
        label: "",
        // EN: Traditional food experience
        desc: "",
      },
      restaurant: {
        // EN: Restaurant
        label: "",
        // EN: Lunch or dinner at our restaurant
        desc: "",
      },
      guesthouse: {
        // EN: Guesthouse
        label: "",
        // EN: Overnight stay
        desc: "",
      },
      group: {
        // EN: Group Visit
        label: "",
        // EN: Groups of 10 or more
        desc: "",
      },
      education: {
        // EN: Educational Visit
        label: "",
        // EN: Schools, universities and researchers
        desc: "",
      },
      meeting: {
        // EN: Meeting Hall
        label: "",
        // EN: Meetings, trainings and workshops
        desc: "",
      },
    },
    gettingHere: {
      // EN: Getting Here
      title: "",
      routes: [
        {
          // EN: Directions
          from: "",
          // EN: Bushaashe Garuwa is near Gununo in Damot Sore Woreda, Wolaita Zone. Use the map below, or search for "XP44+J6 Gununo" on Google Maps. Contact us and we will gladly guide you.
          dir: "",
        },
      ],
    },
    form: {
      // EN: Thank You!
      thanksTitle: "",
      // EN: We've received your request and will contact you shortly to confirm your visit to Bushaashe Garuwa.
      thanksText: "",
      // EN: Your Details
      title: "",
      // EN: Full Name *
      name: "",
      // EN: Your full name
      namePlaceholder: "",
      // EN: Phone *
      phone: "",
      // EN: Email
      email: "",
      // EN: Preferred Date *
      date: "",
      // EN: Number of Visitors
      visitors: "",
      // EN: 1 visitor
      visitorOne: "",
      // EN: {count} visitors
      visitorMany: "",
      // EN: Message
      message: "",
      // EN: Any special requirements or questions...
      messagePlaceholder: "",
      // EN: Continue
      submit: "",
    },
  },
};

export default page;
