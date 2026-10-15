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
    title: "Bushaashe Garuwa | Wolaytta Aqoy, Hayday, Dumma Dumma Woga Buquraynee Bayra Aawatu Laatay de'iyo Zannaqa Sohuwa,",
  },

  common: {
    // EN: Back
    back: "",
    // EN: Bushaashe Garuwa
    brand: "Bushaashe Garuwa",
    // EN: Call us
    call: "Silkkiya Shocite",
    // EN: Book Now
    bookNow: "Sohuwa Oyttite",
    // EN: Plan Your Visit
    planVisit: "Xomoosanawu Keerite",
    // EN: Contact Us
    contactUs: "Nuna Demmanawu",
    // EN: Get in Touch
    getInTouch: "Nunaara Gayttite",
    // EN: Explore
    explore: "Aaruwa Be'ite",
    // EN: Explore All
    exploreAll: "Ubbaakka xeella",
    // EN: Learn More
    learnMore: "Aaruwa Erite",
    // EN: Reserve
    reserve: "Sohuwa Oyttite",
    // EN: Reserve Your Place
    reserveYourPlace: "Niyo Sohuwa Oyqqa",
    // EN: Get Directions
    getDirections: "Ginaa Erite",
    // EN: We could not send your message. Please check your connection and try again, or call us.
    formError: "Ne kiitaa yeddanawu danddayibookko. Ane ne Intterneetee oottikko be'ada , zaarettada mala, woykko nuussi silkkiya shoca",
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
    locationLine: "Daamoota Soore Allaana, Wolaytta Moottaa, Toophphiya",
    map: {
      // EN: Find Us
      eyebrow: "Nuna Demmite",
      // EN: Where Bushaashe Garuwa Is
      title: "Bushaashe Garoy Awan De'ii",
      // EN: Bushaashe Garuwa is near Gununo, in Damot Sore Woreda, Wolaita Zone. Open the map for directions from wherever you are.
      desc: "Bushaashe Garoy Gununo Ambba matan, Daamoota Soore Allaanan, Wolaytta Moottan de'ees. Ne de'iyoosan uttada  Bushaashe Garuwa gakkanaw efiya ginaa be'anawu Googiliya Karttaa dooya",
      // EN: On Google Maps
      listedAs: "Googiliya Karttaa Bollan",
      // EN: Plus code
      plusCode: "Pilas Koode",
      // EN: Get Directions
      directions: "Ginaa Erite",
      // EN: Open in Google Maps
      open: "Googiliya Karttan Dooyite",
      // EN: Map showing the location of Bushaashe Garuwa
      frameTitle: "Bushaashe Garoy diyoosaa bessiya Karttaa",
    },
    // EN: Bushaashe Garuwa, Damot Sore Woreda
    addressLine1: "Bushaashe Garuwa, Daamoota Soore Allaana",
    // EN: Wolaita Zone, Ethiopia
    addressLine2: "Wolaytta Moottaa, Toophphiya",
    // EN: Daily 08:00 – 18:00
    hoursDaily: "Ubbatookka 2:00 - 12:00",
    // EN: Evening events available by reservation
    eveningEvents: "Omarssi shiiqiyoogaassi kasetidi sohuwaa oyttana koshshees",
    // EN: Honoring Our Ancestors, Preserving Our Heritage, and Passing It On to Future Generations.
    slogan: "Nu Aawata Bonchchoos, Nu Wogaanne Haydaa Naagoos, Qassikka Yelettaappe Yeletawu Aattoos",
    // EN: Come and Be Part of the Story
    comeBePart: "Haayite, Yiidi Ha Taarikiya Shaakkite",
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
      home: "Suwa",
      // EN: About
      about: "Nubaa",
      // EN: Discover
      discover: "Xeella",
      // EN: Heritage
      heritage: "Buquraa",
      // EN: Experiences
      experiences: "Meezetidobata",
      // EN: Events
      events: "Makkisota",
      // EN: Guest House
      stay: "Imatta Kifiliya",
      // EN: VIP Service
      vip: "VIP Haggaaza",
      // EN: Dine
      dine: "Qumaa",
      // EN: Visit
      visit: "Xomoosa",
      // EN: Gallery
      gallery: "Misiliya Keettaa",
      // EN: Services
      services: "Haggaazata",
      // EN: Contact
      contact: "Nuna Demmanawu",
      // EN: Meeting Hall
      meeting: "",
      // EN: Family Stories
      stories: "",
    },
    describe: {
      // EN: Our story, mission and vision.
      discover: "Nu haydaa, kiitaa, wode aymuwaa",
      // EN: Phone, email and a message form.
      contact: "Silkke Paydoy, Iimayilee,  Qantta Xuufiyaa",
      // EN: Private rooms for a family: cook, eat, celebrate and stay.
      vip: "So asaassi dumma kifiliya: Kattite, Miite, Bonchchite, Aqite",
      // EN: For meetings, trainings, weddings and family days.
      meeting: "",
    },
    // EN: Bushaashe Garuwa home
    homeAria: "Bushaashe Garuwa Suwa",
    // EN: Main navigation
    mainNav: "",
    // EN: Mobile navigation
    mobileNav: "",
    // EN: Navigation menu
    menuLabel: "",
    // EN: Open menu
    openMenu: "Menu dooya",
    // EN: Close menu
    closeMenu: "Menu gordda",
    // EN: Search
    search: "Koya",
    // EN: Close search
    closeSearch: "Koshsha Gordda",
    // EN: Search Bushaashe Garuwa...
    searchPlaceholder: "Bushaashe Garuwan koyite...",
    // EN: Suggested
    suggested: "Qofay shiiqis",
    suggestions: [
      // EN: Cultural Houses
      "Wogaa Keettata",
      // EN: Heritage Trees
      "Laata Mittata",
      // EN: Traditional Food
      "Wogaa Qumaa",
      // EN: Guesthouse
      "Imatta Keettaa",
      // EN: Cultural Events
      "Wogaa Giigissota",
      // EN: Oral Histories
      "Doonaa Haydata",
      // EN: The Reading Place
      "Nabbabbiyo Sohuwa",
      // EN: Heritage Tour
      "Buquraa Xomoosuwa",
    ],
    // EN: Language
    language: "Qaalaa",
    // EN: coming soon
    wolayttaSoon: "Mata wodiyan...",
    // EN: Menu
    menu: "Menu",
    // EN: Close
    close: "Gordda",
  },

  notice: {
    // EN: Wolaytta is coming soon
    title: "Wolayttattoy mata wodiyan gakkees",
    // EN: We are carefully translating every page into Wolayttatto. Until the full Wolaytta version is ready, please continue in English or Amharic.
    body: "",
    // EN: Continue in English
    continueEn: "Ingiliizattuwan",
    // EN: Continue in Amharic
    continueAm: "Amaarattuwan",
    // EN: Close
    close: "Gordda",
  },

  footer: {
    // EN: Where Wolaita Heritage Lives. A living cultural heritage destination in Wolaita, Ethiopia.
    tagline: "Wolaytta Buquray De'iyoosaa. Toophphiya, Wolaytta giddon wogaa buquray de'iyoosaa.",
    // EN: Follow Us
    followUs: "Nuna Kaallite",
    columns: {
      explore: {
        // EN: Explore
        title: "Yuuyyi Be'ite",
        links: {
          // EN: Heritage
          heritage: "Buquraa",
          // EN: Experiences
          experiences: "Eridobata",
          // EN: Events
          events: "Giigissota",
          // EN: Gallery
          gallery: "Misiliya Keettaa",
        },
      },
      stay: {
        // EN: Stay
        title: "Takkite",
        links: {
          // EN: VIP Service
          vip: "VIP Haggaaza",
          // EN: Guesthouse (coming soon)
          guesthouse: "Imatta Keettaa (mata wodiyan...)",
          // EN: Restaurant
          restaurant: "Katta Keettaa",
          // EN: Bar
          bar: "Ushsha Keettaa",
          // EN: Cultural Food Events
          foodEvents: "Wogaa Qumaa Giigissota",
        },
      },
      discover: {
        // EN: Discover
        title: "Demma",
        links: {
          // EN: Our Story
          story: "Nu Taarikiyaa",
          // EN: Family History
          family: "Keettaa Asaa Taarikiya",
          // EN: Historical Timeline
          timeline: "",
          // EN: Oral Histories
          stories: "Doonaa Taariketa",
        },
      },
      visit: {
        // EN: Visit
        title: "Xomoosite",
        links: {
          // EN: Plan Your Visit
          plan: "Xomoosanawu Keerite",
          // EN: Contact Us
          contact: "Nuna Demmanawu",
          // EN: Educational Visits
          education: "Luxetta Xomoosota",
          // EN: Group Tours
          groups: "Citaa Xomoosota",
          // EN: School Visits
          schools: "Luxetta Keettaa Xomoosota",
        },
      },
    },
    // EN: Bushaashe Garuwa, Damot Sore Woreda, Wolaita Zone, Ethiopia
    address: "Bushaasha Garuwa, Daamoota Soore Allaana, Wolaytta Moottaa, Toophphiya",
    // EN: Bushaashe Garuwa. Where Wolaita Heritage Lives.
    rights: "Bushaashe Baruwaa. Wolaytta Buquray De'iyoosaa.",
  },

  notFound: {
    // EN: Page Not Found
    title: "Sinttay beettibeenna",
    // EN: The page you're looking for doesn't exist.
    text: "Intte koyiyoo sinttay de'enna.",
    // EN: Return Home
    button: "Suwakko Simma",
  },
};

export default page;
