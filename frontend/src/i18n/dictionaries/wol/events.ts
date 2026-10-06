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
      title: "",
      // EN: Full Name *
      name: "",
      // EN: Phone *
      phone: "",
      // EN: Email
      email: "",
      // EN: How many people? *
      guests: "",
      // EN: Anything we should know?
      message: "",
      // EN: Dietary needs, a celebration, arrival time…
      messagePlaceholder: "",
      // EN: Reserve my place
      submit: "",
      // EN: Sending…
      sending: "",
      // EN: Cancel
      cancel: "",
      // EN: Close
      close: "",
      // EN: Your place is reserved
      thanksTitle: "",
      // EN: We have received your booking and will call you to confirm the details.
      thanksText: "",
      // EN: Your booking number
      referenceLabel: "",
      // EN: Please keep it. Tell us this number when you call or when you arrive.
      referenceNote: "",
      // EN: Only {count} places left for this evening.
      placesLeft: "",
      // EN: Only one place left for this evening.
      onePlaceLeft: "",
      // EN: This evening is fully booked.
      noPlaces: "",
    },
    live: {
      // EN: Reserve your place
      bookCta: "",
      // EN: Together with {partner}
      partnerWith: "",
      // EN: Limited places
      limited: "",
      // EN: Fully booked
      full: "",
      // EN: Places available
      open: "",
      // EN: Coming up at Bushaashe Garuwa
      upcomingTitle: "",
      // EN: {count} places left
      placesLeft: "",
      // EN: One place left
      onePlaceLeft: "",
    },
    hero: {
      // EN: Cultural Events
      eyebrow: "",
      // EN: What's Happening
      titleA: "",
      // EN: at Bushaashe Garuwa
      titleB: "",
    },
    // EN: Featured This Month
    featured: "",
    // EN: Upcoming Events
    upcoming: "",
    categories: {
      // EN: All
      all: "",
      // EN: Food
      food: "",
      // EN: Culture
      culture: "",
      // EN: Education
      education: "",
      // EN: Music
      music: "",
      // EN: Community
      community: "",
    },
    items: {
      foodOct: {
        // EN: Sunday 5 October 2026
        dateLabel: "",
        // EN: Wolaita Cultural Food Experience
        name: "",
        // EN: Our flagship monthly gathering: traditional dishes, coffee ceremony, music and oral storytelling around the fire. A complete evening of Wolaita culture.
        desc: "",
        // EN: Limited: 12 places remaining
        avail: "",
      },
      oralHistory: {
        // EN: Sunday 12 October 2026
        dateLabel: "",
        // EN: Oral History Evening
        name: "",
        // EN: Hear Wolaita elders share stories of family, land, and tradition. Stories told in Wolaytta with interpretation in Amharic and English.
        desc: "",
        // EN: Open
        avail: "",
      },
      harvest: {
        // EN: Sunday 19 October 2026
        dateLabel: "",
        // EN: Harvest Heritage Evening
        name: "",
        // EN: Celebrate the harvest season with traditional food, dance and elder storytelling. A community gathering at the heart of Wolaita culture.
        desc: "",
        // EN: Open
        avail: "",
      },
      schoolDay: {
        // EN: Saturday 25 October 2026
        dateLabel: "",
        // EN: School Heritage Visit Day
        name: "",
        // EN: A structured educational day for school groups: heritage tour, cultural activities, and traditional lunch.
        desc: "",
        // EN: Group booking
        avail: "",
      },
      foodNov: {
        // EN: Sunday 2 November 2026
        dateLabel: "",
        // EN: Wolaita Cultural Food Experience
        name: "",
        // EN: Our monthly cultural food gathering returns. Traditional Wolaita cuisine, coffee ceremony, music and community.
        desc: "",
        // EN: Open
        avail: "",
      },
      music: {
        // EN: Saturday 8 November 2026
        dateLabel: "",
        // EN: Traditional Music Workshop
        name: "",
        // EN: Learn about traditional Wolaita instruments and music. A participatory workshop for all ages led by community musicians.
        desc: "",
        // EN: Open
        avail: "",
      },
    },
  },
};

export default page;
