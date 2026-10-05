import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · On every page: header menu, footer, buttons, notices
 * See it on the site: any page
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  meta: {
    // EN: Bushaashe Garuwa | Where Wolaita Heritage Lives
    title: "",
  },

  common: {
    // EN: Bushaashe Garuwa
    brand: "",
    // EN: Call us
    call: "",
    // EN: Book Now
    bookNow: "",
    // EN: Plan Your Visit
    planVisit: "",
    // EN: Contact Us
    contactUs: "",
    // EN: Get in Touch
    getInTouch: "",
    // EN: Explore
    explore: "",
    // EN: Explore All
    exploreAll: "",
    // EN: Learn More
    learnMore: "",
    // EN: Reserve
    reserve: "",
    // EN: Reserve Your Place
    reserveYourPlace: "",
    // EN: Get Directions
    getDirections: "",
    // EN: We could not send your message. Please check your connection and try again, or call us.
    formError: "",
    // EN: Photo coming soon
    photoComingSoon: "",
    // EN: Location
    location: "",
    // EN: Opening Hours
    openingHours: "",
    // EN: Contact
    contact: "",
    // EN: Phone
    phone: "",
    // EN: Email
    email: "",
    // EN: Damot Sore Woreda, Wolaita Zone, Ethiopia
    locationLine: "",
    map: {
      // EN: Find Us
      eyebrow: "",
      // EN: Where Bushaashe Garuwa Is
      title: "",
      // EN: Bushaashe Garuwa is near Gununo, in Damot Sore Woreda, Wolaita Zone. Open the map for directions from wherever you are.
      desc: "",
      // EN: On Google Maps
      listedAs: "",
      // EN: Plus code
      plusCode: "",
      // EN: Get Directions
      directions: "",
      // EN: Open in Google Maps
      open: "",
      // EN: Map showing the location of Bushaashe Garuwa
      frameTitle: "",
    },
    // EN: Bushaashe Garuwa, Damot Sore Woreda
    addressLine1: "",
    // EN: Wolaita Zone, Ethiopia
    addressLine2: "",
    // EN: Daily 08:00 – 18:00
    hoursDaily: "",
    // EN: Evening events available by reservation
    eveningEvents: "",
    // EN: Honoring Our Ancestors, Preserving Our Heritage, and Passing It On to Future Generations.
    slogan: "",
    // EN: Come and Be Part of the Story
    comeBePart: "",
    goal: {
      // EN: Our Ultimate Goal
      eyebrow: "",
      // EN: To keep and preserve the culture, traditions and heritage of Wolaita, and to pass them on to future generations.
      text: "",
    },
  },

  nav: {
    links: {
      // EN: Home
      home: "",
      // EN: About
      about: "",
      // EN: Discover
      discover: "",
      // EN: Heritage
      heritage: "",
      // EN: Experiences
      experiences: "",
      // EN: Events
      events: "",
      // EN: Guest House
      stay: "",
      // EN: Dine
      dine: "",
      // EN: Visit
      visit: "",
      // EN: Gallery
      gallery: "",
      // EN: Services
      services: "",
      // EN: Contact
      contact: "",
    },
    describe: {
      // EN: Our story, mission and vision.
      discover: "",
      // EN: Phone, email and a message form.
      contact: "",
    },
    // EN: Bushaashe Garuwa home
    homeAria: "",
    // EN: Main navigation
    mainNav: "",
    // EN: Mobile navigation
    mobileNav: "",
    // EN: Navigation menu
    menuLabel: "",
    // EN: Open menu
    openMenu: "",
    // EN: Close menu
    closeMenu: "",
    // EN: Search
    search: "",
    // EN: Close search
    closeSearch: "",
    // EN: Search Bushaashe Garuwa...
    searchPlaceholder: "",
    // EN: Suggested
    suggested: "",
    suggestions: [
      // EN: Cultural Houses
      "",
      // EN: Heritage Trees
      "",
      // EN: Traditional Food
      "",
      // EN: Guesthouse
      "",
      // EN: Cultural Events
      "",
      // EN: Oral Histories
      "",
      // EN: The Reading Place
      "",
      // EN: Heritage Tour
      "",
    ],
    // EN: Language
    language: "",
    // EN: coming soon
    wolayttaSoon: "",
    // EN: Menu
    menu: "",
    // EN: Close
    close: "",
  },

  notice: {
    // EN: Wolaytta is coming soon
    title: "",
    // EN: We are carefully translating every page into Wolayttatto. Until the full Wolaytta version is ready, please continue in English or Amharic.
    body: "",
    // EN: Continue in English
    continueEn: "",
    // EN: Continue in Amharic
    continueAm: "",
    // EN: Close
    close: "",
  },

  footer: {
    // EN: Where Wolaita Heritage Lives. A living cultural heritage destination in Wolaita, Ethiopia.
    tagline: "",
    // EN: Follow Us
    followUs: "",
    columns: {
      explore: {
        // EN: Explore
        title: "",
        links: {
          // EN: Heritage
          heritage: "",
          // EN: Experiences
          experiences: "",
          // EN: Events
          events: "",
          // EN: Gallery
          gallery: "",
        },
      },
      stay: {
        // EN: Stay
        title: "",
        links: {
          // EN: Guesthouse
          guesthouse: "",
          // EN: Restaurant
          restaurant: "",
          // EN: Bar
          bar: "",
          // EN: Cultural Food Events
          foodEvents: "",
        },
      },
      discover: {
        // EN: Discover
        title: "",
        links: {
          // EN: Our Story
          story: "",
          // EN: Family History
          family: "",
          // EN: Historical Timeline
          timeline: "",
          // EN: Oral Histories
          stories: "",
        },
      },
      visit: {
        // EN: Visit
        title: "",
        links: {
          // EN: Plan Your Visit
          plan: "",
          // EN: Contact Us
          contact: "",
          // EN: Educational Visits
          education: "",
          // EN: Group Tours
          groups: "",
          // EN: School Visits
          schools: "",
        },
      },
    },
    // EN: Bushaashe Garuwa, Damot Sore Woreda, Wolaita Zone, Ethiopia
    address: "",
    // EN: Bushaashe Garuwa. Where Wolaita Heritage Lives.
    rights: "",
  },

  notFound: {
    // EN: Page Not Found
    title: "",
    // EN: The page you're looking for doesn't exist.
    text: "",
    // EN: Return Home
    button: "",
  },
};

export default page;
