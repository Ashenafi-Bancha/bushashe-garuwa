import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Events page
 * See it on the site: /events
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  events: {
    kinds: {
      // EN: What We Hold
      eyebrow: "Nu Giigissiyoogata",
      // EN: Three Kinds of Events
      title: "Heezzu Qommo Giigissota",
      // EN: Ask About a Private Event
      ask: "Buzo Giigissuwaabaa Oychchite",
      items: {
        food: {
          // EN: Cultural Food Event
          title: "Wogaa Qumaa Makkisuwaa",
          // EN: Twice a month
          when: "Aginan naa\"utoo",
          // EN: An evening of traditional Wolaita food, coffee, music and storytelling in the cultural houses. Reserve your place below.
          desc: "Wolaytta wogaa keettatu giddon Wolaytta qumaa, tukkiyaa, yettaanne haysiyaa odiyoo omarssaa. Intte sohuwaa garssaara oyttite.",
        },
        gifaataa: {
          // EN: “Gifaataa”
          title: "Gifaataa",
          // EN: Once a year
          when: "Layttan issutoo",
          // EN: The Wolaita new year festival, celebrated on the grounds with traditional dress, food, song and dance.
          desc: "Wolaytta ooratta layttaa baalay woga maayotun, quman, yettaaninee durssan gibbe giddon bochcheettees.",
        },
        private: {
          // EN: Private Events
          title: "Buzo Makkisota",
          // EN: When you choose
          when: "Intte doorido wodiyan",
          // EN: Your own gathering, arranged the way you want it: a family day, an anniversary, a meeting or a celebration with friends.
          desc: "Intte koyyiyoo ogiyan giigida intte buzo giigissuwaa: so asaa gallassaa, baalaa, shiiquwaa woykko laggetuura oottiyoo baalaa.",
        },
      },
    },
    moments: {
      // EN: Moments
      eyebrow: "Hanidabata",
      // EN: Gatherings at Bushaashe Garuwa
      title: "Bushaashe Garuwan polettida shiiqota",
      // EN: Elders, families and friends come here to meet, to celebrate and to play. A few moments from the grounds.
      desc: "Cimati, issi keettaa asatinne laggeti shiiquwawu, ufayssan bonchchanawunne kaa'anawu hagawu yoosona. Gibbiyawu keehippe mata.",
      // EN: See the Gallery
      cta: "Pootuwaa Be'a",
    },
    booking: {
      // EN: Reserve your place
      title: "Intte sohuwaa Oyttite",
      // EN: Full Name *
      name: "Kumetta Sunttaa",
      // EN: Phone *
      phone: "Silkke Payduwaa",
      // EN: Email
      email: "Imayliyaa",
      // EN: How many people? *
      guests: "Aappun asee?",
      // EN: Anything we should know?
      message: "Nuna erissanawu koyyiyoobi de'ii?",
      // EN: Dietary needs, a celebration, arrival time…
      messagePlaceholder: "Qumaa Koshshaa (Miyoobatanne meennabata), bonchchiyoobaa woykko oottiyoobaa, gakkiyoo saatiyaa",
      // EN: Reserve my place
      submit: "Ta sohuwaa oyqqa",
      // EN: Sending…
      sending: "Yeddiiddi de'ees",
      // EN: Cancel
      cancel: "Essa",
      // EN: Close
      close: "Gordda",
      // EN: Your place is reserved
      thanksTitle: "Niyoo bootay oyqettiis",
      // EN: We have received your booking and will call you to confirm the details.
      thanksText: "Ne azazuwaa ekkida, aaruwan erananawu silkkiya shocana doos.",
      // EN: Your booking number
      referenceLabel: "Ne azazuwaa payduwaa",
      // EN: Please keep it. Tell us this number when you call or when you arrive.
      referenceNote: "Ne payduwaa loytta oyqqa. Nuyyoo silkkiyaa shociyoode woykko sohuwaa gakkiyoode, ha payduwaa odite.",
      // EN: Only {count} places left for this evening.
      placesLeft: "Ha omarssawu {count} sohotu xallawu attidosona.",
      // EN: Only one place left for this evening.
      onePlaceLeft: "Ha omarssawu issi soho xallay attiis.",
      // EN: This evening is fully booked.
      noPlaces: "Ha omarssay wuridi oyqettiichchiis, booti baawa.",
    },
    live: {
      // EN: Reserve your place
      bookCta: "Intte bootaa oyttite",
      // EN: Together with {partner}
      partnerWith: "Issippe yiyay {partner}",
      // EN: Limited places
      limited: "Amara Sohota",
      // EN: Fully booked
      full: "Muleera oyqettiichchiis",
      // EN: Places available
      open: "De'iyaa Sohota",
      // EN: Coming up at Bushaashe Garuwa
      upcomingTitle: "Bushaashe Garuwan matan yees.",
      // EN: {count} places left
      placesLeft: "{count} sohuti attidosona",
      // EN: One place left
      onePlaceLeft: "Issi sohoy attiis",
    },
    hero: {
      // EN: Cultural Events
      eyebrow: "Wogaa Makkisota",
      // EN: What's Happening
      titleA: "Bushaashe Garuwan",
      // EN: at Bushaashe Garuwa
      titleB: "Aybi Haniiddi De'ii?",
    },
    // EN: Featured This Month
    featured: "Ha aginan polettida erettida makkisota",
    // EN: Upcoming Events
    upcoming: "Sinttaara Yiiddi De'iya Makkisota",
    categories: {
      // EN: All
      all: "Ubbatakka",
      // EN: Food
      food: "Qumaa",
      // EN: Culture
      culture: "Wogaa",
      // EN: Education
      education: "Timirttiyaa",
      // EN: Music
      music: "Yettaa",
      // EN: Community
      community: "Heeraa Asaa",
    },
    // EN: No dates are announced right now. The cultural food evening is held twice a month: the next dates will appear here as soon as they are set, or call us to hear about them.
    noneYet: "",
    // EN: No events of this kind are announced right now.
    noneInCategory: "",
  },
};

export default page;
