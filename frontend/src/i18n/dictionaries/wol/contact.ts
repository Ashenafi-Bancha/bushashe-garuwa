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
      eyebrow: "",
      // EN: We'd Love to Hear From You
      title: "",
    },
    // EN: Whether you're planning a visit, reserving an experience, booking a room, or simply curious about Bushaashe Garuwa, we're here to help.
    intro: "",
    // EN: Available daily 08:00 – 18:00
    phoneNote: "",
    // EN: We respond within 24 hours
    emailNote: "",
    // EN: Damot Sore Woreda, Wolaita Zone
    locationLine1: "",
    // EN: Ethiopia
    locationLine2: "",
    // EN: Social Media
    social: "",
    form: {
      // EN: Message Sent
      sentTitle: "",
      // EN: Thank you for reaching out. We'll be in touch within 24 hours.
      sentText: "",
      // EN: Send a Message
      title: "",
      // EN: Full Name *
      name: "",
      // EN: Your full name
      namePlaceholder: "",
      // EN: Phone
      phone: "",
      // EN: Email *
      email: "",
      // EN: Message *
      message: "",
      // EN: How can we help you?
      messagePlaceholder: "",
      // EN: Send Message
      submit: "",
    },
  },
};

export default page;
