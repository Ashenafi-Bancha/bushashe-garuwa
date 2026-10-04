import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Stay page
 * See it on the site: /stay
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  stay: {
    hero: {
      // EN: Guesthouse
      eyebrow: "",
      // EN: Stay Within the Story
      title: "",
      // EN: Sleep where history breathes, in rooms that reflect the warmth and authenticity of Wolaita heritage.
      desc: "",
    },
    // EN: Amenities
    amenitiesLabel: "",
    // EN: View Details
    viewDetails: "",
    // EN: Book This Room
    bookRoom: "",
    rooms: {
      standard: {
        // EN: Standard Room
        name: "",
        // EN: A peaceful retreat with cultural touches, comfortable bedding, private bathroom and serene garden views.
        desc: "",
        // EN: 2 guests
        guests: "",
      },
      family: {
        // EN: Family Room
        name: "",
        // EN: Spacious family room with a private outdoor seating area, heritage decor, and comfortable beds for the whole family.
        desc: "",
        // EN: 4 guests
        guests: "",
      },
      heritage: {
        // EN: Heritage Room
        name: "",
        // EN: Our signature room: full immersion in Wolaita design, premium comfort, private terrace with heritage landscape views.
        desc: "",
        // EN: 2 guests
        guests: "",
      },
    },
    amenities: {
      // EN: Wi-Fi
      wifi: "",
      // EN: Private bathroom
      bathroom: "",
      // EN: Breakfast included
      breakfast: "",
      // EN: Garden view
      garden: "",
      // EN: Cultural access
      cultural: "",
      // EN: Reading area
      reading: "",
      // EN: Private outdoor area
      outdoor: "",
      // EN: Children's welcome kit
      kids: "",
      // EN: Private terrace
      terrace: "",
      // EN: Welcome coffee ceremony
      coffee: "",
      // EN: Heritage guide service
      guide: "",
      // EN: Full cultural access
      fullCultural: "",
    },
    why: {
      // EN: Why Stay at Bushaashe Garuwa?
      title: "",
      // EN: Every night here is more than accommodation; it is an immersion in a living heritage.
      desc: "",
      items: {
        setting: {
          // EN: Authentic Setting
          title: "",
          // EN: Surrounded by heritage trees, cultural houses and nature.
          desc: "",
        },
        breakfast: {
          // EN: Traditional Breakfast
          title: "",
          // EN: Start each day with a Wolaita breakfast prepared by our kitchen.
          desc: "",
        },
        access: {
          // EN: Full Cultural Access
          title: "",
          // EN: Guests enjoy priority access to all heritage experiences.
          desc: "",
        },
        coffee: {
          // EN: Morning Coffee Ceremony
          title: "",
          // EN: Begin every morning with the traditional Ethiopian coffee ritual.
          desc: "",
        },
      },
    },
    inquiry: {
      // EN: Request Your Stay
      title: "",
      // EN: Tell us when you would like to come. We will call you to confirm the room and the price.
      desc: "",
      // EN: This is a request, not yet a confirmed booking.
      note: "",
      // EN: Or reach us directly
      or: "",
      // EN: Arrival date *
      arrival: "",
      // EN: Nights
      nights: "",
      // EN: 1 night
      nightOne: "",
      // EN: {count} nights
      nightMany: "",
      // EN: Guests
      guests: "",
      // EN: 1 guest
      guestOne: "",
      // EN: {count} guests
      guestMany: "",
      // EN: Room
      room: "",
      // EN: Any room
      anyRoom: "",
      // EN: Send my request
      submit: "",
      // EN: Sending…
      sending: "",
      // EN: Request received
      thanksTitle: "",
      // EN: Thank you. We will call you shortly to confirm your stay at Bushaashe Garuwa.
      thanksText: "",
    },
    cta: {
      // EN: Ready to Book Your Stay?
      title: "",
      // EN: Contact us to check availability and reserve your room at Bushaashe Garuwa.
      desc: "",
      // EN: Book Your Stay
      book: "",
      // EN: Ask a Question
      ask: "",
    },
  },
};

export default page;
