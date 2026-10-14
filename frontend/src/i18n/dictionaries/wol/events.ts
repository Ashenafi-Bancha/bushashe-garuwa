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
          // EN: Gifaataa
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
      title: "Boshaashe Garuwan polettida shiiqota",
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
    items: {
      foodOct: {
        // EN: Sunday 5 October 2026
        dateLabel: "Gifaataa 24, 2019",
        // EN: Wolaita Cultural Food Experience
        name: "Wolaytta Wogaa Qumaa Meezetiyoogaa",
        // EN: Our flagship monthly gathering: traditional dishes, coffee ceremony, music and oral storytelling around the fire. A complete evening of Wolaita culture.
        desc: "Nu keehippe waanna shiiqoti: woga qumata, shiiqidi tukkiyoo uyiyoogaa, yettaanne tamaa achchan shiiqidi haysiyaa odiyoogaa. Wolaytta wogaa kumetta qammaa.",
        // EN: Limited: 12 places remaining
        avail: "Amara: 12 sohoti attidosona",
      },
      oralHistory: {
        // EN: Sunday 12 October 2026
        dateLabel: "Woggaa 11 Gooluwaa, 2019",
        // EN: Oral History Evening
        name: "Doonaa Haydaa Omarssaa",
        // EN: Hear Wolaita elders share stories of family, land, and tradition. Stories told in Wolaytta with interpretation in Amharic and English.
        desc: "Wolaytta bayra asati so asaa, biittaanne wogaa taarikiyaa odiyoode siyiyoogaa. Wolayttattuwan odettiyaa taariketi Amaarattuwawunne Ingiliizattuwawu birshshettoosona.",
        // EN: Open
        avail: "Dooya",
      },
      harvest: {
        // EN: Sunday 19 October 2026
        dateLabel: "Woggaa 08 Gooluwaa, 2019",
        // EN: Harvest Heritage Evening
        name: "Kattaa Shiishshiyoo Wodiyaa Omarssaa",
        // EN: Celebrate the harvest season with traditional food, dance and elder storytelling. A community gathering at the heart of Wolaita culture.
        desc: "Kattaa shiishshiyoo wodiyaa woga quman, durssaaninne cimatu haysiyaa oduwan bonchchite. ",
        // EN: Open
        avail: "Dooya",
      },
      schoolDay: {
        // EN: Saturday 25 October 2026
        dateLabel: "Qeeraa 01 Gooluwaa, 2019",
        // EN: School Heritage Visit Day
        name: "Timirtte Keettatu Xomooso Gallassaa",
        // EN: A structured educational day for school groups: heritage tour, cultural activities, and traditional lunch.
        desc: "Timirtte keettaappe yiyaa citatussi giigida timirtte gallassa: buqura yuuyyidi be'iyoogaa, wogaa kaassaatanne wogaa laaxaa muussaa.",
        // EN: Group booking
        avail: "Citan Sohuwa Oyttanawu",
      },
      foodNov: {
        // EN: Sunday 2 November 2026
        dateLabel: "Woggaa 22 Gooluwaa, 2019",
        // EN: Wolaita Cultural Food Experience
        name: "Wolaytta Wogaa Qumaa Meezetiyoogaa",
        // EN: Our monthly cultural food gathering returns. Traditional Wolaita cuisine, coffee ceremony, music and community.
        desc: "Nu aginaa wogaa qumaa muussaa shiiqoy simmidi yeees. Wolaytta wogaa qumata, tukkiyaa shiiqidi uyyiyoo wodiyaa, yettaanne ",
        // EN: Open
        avail: "Dooya",
      },
      music: {
        // EN: Saturday 8 November 2026
        dateLabel: "Qeeraa 28 Gooluwaa, 2019",
        // EN: Traditional Music Workshop
        name: "Wogaa Yettaa Meezetiyoogaa",
        // EN: Learn about traditional Wolaita instruments and music. A participatory workshop for all ages led by community musicians.
        desc: "Wolaytta wogaa yettaa miishshatubaanne yettatubaa tamaariyoogaa. Hegan de'iyaa yettanchchatinne yettaa miishshaa kaa'iyaageeta kaaletttiyoo issippe tamaariyoo wodiyaa.",
        // EN: Open
        avail: "Dooya",
      },
    },
  },
};

export default page;
