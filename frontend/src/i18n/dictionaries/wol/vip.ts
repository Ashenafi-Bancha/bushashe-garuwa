import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · VIP Service page
 * See it on the site: /vip
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  vip: {
    hero: {
      // EN: VIP Service
      eyebrow: "",
      // EN: A Private Place for Your Family
      title: "",
      // EN: Come with your family, cook, eat and celebrate together, in rooms kept for you alone.
      desc: "",
    },
    intro: {
      // EN: What It Is
      eyebrow: "",
      // EN: Your Own Rooms on the Heritage Grounds
      title: "",
      // EN: The VIP service is for families and small groups who want a private place. You can cook in the VIP kitchen, eat together, celebrate, sit by the fire, and stay the night in the VIP rooms.
      text: "",
    },
    features: {
      kitchen: {
        // EN: VIP Kitchen
        title: "",
        // EN: Cook your own food there, the way your family likes it.
        desc: "",
      },
      dining: {
        // EN: Eat Together
        title: "",
        // EN: A sitting and dining room with sofas and a large table.
        desc: "",
      },
      celebrate: {
        // EN: Celebrate
        title: "",
        // EN: Birthdays, family gatherings and other special days, in private.
        desc: "",
      },
      fire: {
        // EN: Fireplace
        title: "",
        // EN: A fire in the VIP room to gather around.
        desc: "",
      },
      rooms: {
        // EN: VIP Rooms for Sleeping
        title: "",
        // EN: Bedrooms where the family can stay the night.
        desc: "",
      },
      restrooms: {
        // EN: VIP Rest Rooms
        title: "",
        // EN: Private rest rooms for VIP guests.
        desc: "",
      },
    },
    // EN: Inside the VIP Rooms
    photosTitle: "",
    cta: {
      // EN: Would You Like to Use the VIP Service?
      title: "",
      // EN: Call or write to us with your date and the number of people, and we will arrange it.
      text: "",
    },
  },
};

export default page;
