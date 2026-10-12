import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Contact page
 * See it on the site: /contact
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  contact: {
    hero: {
      // EN: Contact
      eyebrow: "Nuna Demmanawu",
      // EN: We'd Love to Hear From You
      title: "Intteppe Siyana Doseettees",
    },
    // EN: Whether you're planning a visit, reserving an experience, booking a room, or simply curious about Bushaashe Garuwa, we're here to help.
    intro: "Xomoosuwa keeranawu gididee, Kifiliya oyttanawu woykko cookka Bushaashe Garuwaaba erana xallawu koyidaba gidikkokka, inttena maaddanawu giigi uttida.",
    // EN: Available daily 08:00 – 18:00
    phoneNote: "Ubbatookka 02:00 - 12:00 gakkanawu de'ees.",
    // EN: We respond within 24 hours
    emailNote: "24 saatiyaa giddon zaaruwaa immoos.",
    // EN: Damot Sore Woreda, Wolaita Zone
    locationLine1: "Daamoota Soore Allaanaa, Wolaytta Moottaa",
    // EN: Ethiopia
    locationLine2: "Toophphiyaa",
    // EN: Social Media
    social: "Coraa Gattiyaa Eqotata",
    form: {
      // EN: Message Sent
      sentTitle: "Kiitay Biis",
      // EN: Thank you for reaching out. We'll be in touch within 24 hours.
      sentText: "Nunaara gaytto gishshawu keehippe galatoos. 24 saatiya giddon simmi gayttana.",
      // EN: Send a Message
      title: "Kiitaa Yeddite",
      // EN: Full Name *
      name: "Kumetta Sunttaa",
      // EN: Your full name
      namePlaceholder: "Ne Kumetta Sunttaa Hagan Xaafa",
      // EN: Phone
      phone: "Silkke Payduwa",
      // EN: Email *
      email: "Iimayliyaa",
      // EN: Message *
      message: "Kiitaa",
      // EN: How can we help you?
      messagePlaceholder: "Ay Maddanee?",
      // EN: Send Message
      submit: "Kiitaa Yeddite",
    },
  },
};

export default page;
