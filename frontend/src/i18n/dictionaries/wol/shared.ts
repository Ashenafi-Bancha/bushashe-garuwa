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
    title: "Bushaashe Garuwa | Wolaytta Aqoy, Hayday,Dumma Dumma Woga Buquraynee Bayra Aawatu Laatay de'iyo Zannaqa Sohuwa,",
  },

  common: {
    // EN: Bushaashe Garuwa
    brand: "Bushaashe Garuwa",
    // EN: Call us
    call: "Silkkiya Shoccite",
    // EN: Book Now
    bookNow: "Sohuwa Oyqqa",
    // EN: Plan Your Visit
    planVisit: "Xomoosonaw keeruwa Oyqqa",
    // EN: Contact Us
    contactUs: "Nuna Demmanawu",
    // EN: Get in Touch
    getInTouch: "Nunaara Gayttite",
    // EN: Explore
    explore: "",
    // EN: Explore All
    exploreAll: "",
    // EN: Learn More
    learnMore: "Aaruwa Erite",
    // EN: Reserve
    reserve: "Sohuwa Oyqqite",
    // EN: Reserve Your Place
    reserveYourPlace: "Niyo Sohuwa Oyqqa",
    // EN: Get Directions
    getDirections: "Gina Erite",
    // EN: We could not send your message. Please check your connection and try again, or call us.
    formError: "Ne kiitaa yeddanawu danddayokko.Ane ne Intterneetee oottikko be'ada , zaarettada mala, woykko nuussi silkkiya shoca",
    // EN: Photo coming soon
    photoComingSoon: "Misilee matan Yees",
    // EN: Location
    location: "De'iyo Sohuwa",
    // EN: Opening Hours
    openingHours: "Dooyettiyo Saatee",
    // EN: Contact
    contact: "Nuna Demmanawu",
    // EN: Phone
    phone: "Silkke Paydoy",
    // EN: Email
    email: "Iimayilee",
    // EN: Damot Sore Woreda, Wolaita Zone, Ethiopia
    locationLine: "Daamoota Soore Allaana, Wolaytta Moottaa, Itoophiyaa",
    map: {
      // EN: Find Us
      eyebrow: "Nuna Demmite",
      // EN: Where Bushaashe Garuwa Is
      title: "Bushaashe Garoy Awan De'ii",
      // EN: Bushaashe Garuwa is near Gununo, in Damot Sore Woreda, Wolaita Zone. Open the map for directions from wherever you are.
      desc: "Bushaashe Garoy Gununo Ambba Matan, Daamoota Soore Allaanan, Wolaytta Moottan de'ees. Ne de'iyoosan uttada  Bushaashe Garuwa gakkanaw efiya ogiya be'anawu Googiliya Karttaa dooya",
      // EN: On Google Maps
      listedAs: "Googiliya Karttaa Bollan",
      // EN: Plus code
      plusCode: "",
      // EN: Get Directions
      directions: "Ogiya Erite",
      // EN: Open in Google Maps
      open: "Googiliya Karttan Dooyite",
      // EN: Map showing the location of Bushaashe Garuwa
      frameTitle: "Bushaashe Garoy de'iyo sohuwa bessiya Karttaa",
    },
    // EN: Bushaashe Garuwa, Damot Sore Woreda
    addressLine1: "Bushaashe Garuwa, Daamoota Soore Allaana",
    // EN: Wolaita Zone, Ethiopia
    addressLine2: "",
    // EN: Daily 08:00 – 18:00
    hoursDaily: "Ubbatookka 2:00 - 12:00",
    // EN: Evening events available by reservation
    eveningEvents: "",
    // EN: Honoring Our Ancestors, Preserving Our Heritage, and Passing It On to Future Generations.
    slogan: "Nu Aawata Bonchchoos, Nu Wogaanne Haydaa Naagoos, Qassikka Yelettaappe Yeletawu Aattoos",
    // EN: Come and Be Part of the Story
    comeBePart: "Yiite, Yiidi Ha Taarikkiya Shaakkite",
    goal: {
      // EN: Our Ultimate Goal
      eyebrow: "Nu Halchchoy",
      // EN: To keep and preserve the culture, traditions and heritage of Wolaita, and to pass them on to future generations.
      text: "Wolaytta Wogaa, Haydaa, Taarikkiya, Buquraanee Dummma Dumma Aqotata bonchchidi naagiyoogaanne, yeletaappe yeletawu Aattiyoogaa",
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
      // EN: VIP Service
      vip: "",
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
      // EN: Private rooms for a family: cook, eat, celebrate and stay.
      vip: "",
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
          // EN: VIP Service
          vip: "",
          // EN: Guesthouse (coming soon)
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
