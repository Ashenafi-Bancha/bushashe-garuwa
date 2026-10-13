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
      messagePlaceholder: "",
      // EN: Reserve my place
      submit: "Ta",
      // EN: Sending…
      sending: "Yeddiiddi de'ees",
      // EN: Cancel
      cancel: "Essa",
      // EN: Close
      close: "Gordda",
      // EN: Your place is reserved
      thanksTitle: "Niyoo bootay oyqettiis",
      // EN: We have received your booking and will call you to confirm the details.
      thanksText: "",
      // EN: Your booking number
      referenceLabel: "Ne payduwaa",
      // EN: Please keep it. Tell us this number when you call or when you arrive.
      referenceNote: "",
      // EN: Only {count} places left for this evening.
      placesLeft: "Ha qammawu {count} sohoti attidosona.",
      // EN: Only one place left for this evening.
      onePlaceLeft: "Hachchi qammawu issis soho xallay attiis.",
      // EN: This evening is fully booked.
      noPlaces: "Ha qammay woridi oyqettiichchiis.",
    },
    live: {
      // EN: Reserve your place
      bookCta: "Intte bootaa oyttite",
      // EN: Together with {partner}
      partnerWith: "",
      // EN: Limited places
      limited: "Amara Sohota",
      // EN: Fully booked
      full: "Kumetta",
      // EN: Places available
      open: "De'iyaa Sohota",
      // EN: Coming up at Bushaashe Garuwa
      upcomingTitle: "",
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
      all: "Ubbaakka",
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
    items: {
      foodOct: {
        // EN: Sunday 5 October 2026
        dateLabel: "Gifaataa 24, 2019",
        // EN: Wolaita Cultural Food Experience
        name: "",
        // EN: Our flagship monthly gathering: traditional dishes, coffee ceremony, music and oral storytelling around the fire. A complete evening of Wolaita culture.
        desc: "",
        // EN: Limited: 12 places remaining
        avail: "Amara: 12 sohoti attidosona",
      },
      oralHistory: {
        // EN: Sunday 11 October 2026
        dateLabel: "Woggaa 11 Gooluwaa, 2019",
        // EN: Oral History Evening
        name: "Doonaa Haydaa Omarssaa",
        // EN: Hear Wolaita elders share stories of family, land, and tradition. Stories told in Wolaytta with interpretation in Amharic and English.
        desc: "",
        // EN: Open
        avail: "Dooya",
      },
      harvest: {
        // EN: Sunday 19 October 2026
        dateLabel: "",
        // EN: Harvest Heritage Evening
        name: "",
        // EN: Celebrate the harvest season with traditional food, dance and elder storytelling. A community gathering at the heart of Wolaita culture.
        desc: "",
        // EN: Open
        avail: "Dooya",
      },
      schoolDay: {
        // EN: Saturday 25 October 2026
        dateLabel: "",
        // EN: School Heritage Visit Day
        name: "",
        // EN: A structured educational day for school groups: heritage tour, cultural activities, and traditional lunch.
        desc: "",
        // EN: Group booking
        avail: "Citan Sohuwa Oyttanawu",
      },
      foodNov: {
        // EN: Sunday 2 November 2026
        dateLabel: "",
        // EN: Wolaita Cultural Food Experience
        name: "",
        // EN: Our monthly cultural food gathering returns. Traditional Wolaita cuisine, coffee ceremony, music and community.
        desc: "",
        // EN: Open
        avail: "Dooya",
      },
      music: {
        // EN: Saturday 8 November 2026
        dateLabel: "",
        // EN: Traditional Music Workshop
        name: "",
        // EN: Learn about traditional Wolaita instruments and music. A participatory workshop for all ages led by community musicians.
        desc: "",
        // EN: Open
        avail: "Dooya",
      },
    },
  },
};

export default page;
