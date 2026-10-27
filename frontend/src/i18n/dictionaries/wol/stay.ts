import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Guest House page (coming soon)
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
      eyebrow: "Imattay Shemppiyoosaa",
      // EN: Stay Within the Story
      title: "Taarikiya Giddon Takkite",
      // EN: Sleep where history breathes, in rooms that reflect the warmth and authenticity of Wolaita heritage.
      desc: "Taarikee shemppiyoosan; qassikka Wolaytta wogaa tumatettay qonccidi beettiyoo kifiletun xiskkite.",
    },
    comingSoon: {
      // EN: Coming soon
      badge: "Mata wodiyan...",
      // EN: A guest house inside the heritage site is planned. It is not open yet.
      lead: "Buqura sohuwan imattay shemppiyoosaa giigissanawu halchchetti uttiis. Ha'issawu dooyettiichchibeenna.",
      // EN: The Guest House Is a Coming Service
      title: "Imattay Shemppiyoosay Matan Yiyaa Haggaaza",
      // EN: Bushaashe Garuwa is preparing a guest house so that visitors can stay overnight. It is still being finished and does not take guests yet. We will announce it here when it opens.
      text: "Xomooosiyaageeti qammaa aattana mala Bushaashe Garoy imattay shemppiyoosaa giigissiiddi de'ees. Hanno gakkanawu wuruwaa bollan de'iyoo gishshawu imattata gelissiyoo doomettibeenna. Dooyettiyoode hagan erissana.",
      // EN: Questions in the Meantime?
      askTitle: "Hegee gakkanaashin oychchiyoobi de'iishsha?",
      // EN: Call or write to us and we will gladly tell you more.
      askText: "Nuussi silkkiya shocikko woykko xaafikko, inttiyoo aaruwaa ufayssan odana.",
      // EN: Open Now: the VIP Service
      vipTitle: "Ha'i Dooyettiis: VIP Haggaazaa",
      // EN: Families can already come to the VIP rooms to cook, eat, celebrate and stay the night.
      vipText: "So asati ha'ippe doommidi VIP kifiletukko yiidi kattana, maana, bonchchananne qassi qammaa aattanawu danddayoosona.",
    },
    // EN: Amenities
    amenitiesLabel: "Go'ettiyoobata",
    // EN: View Details
    viewDetails: "Aaruwa Be'ite",
    // EN: Book This Room
    bookRoom: "Ha Kifiliya Oyttite",
    rooms: {
      standard: {
        // EN: Standard Room
        name: "Hirayso Kifiliya",
        // EN: A peaceful retreat with cultural touches, comfortable bedding, private bathroom and serene garden views.
        desc: "Wogaa be'iddi, injjetiyaa hiixay de'iyoosan, buzo meecettiyoo kifilee de'iyoosan aattiyoo saroynne woppay de'iyoo shemppi ekkiyoogaa.",
        // EN: 2 guests
        guests: "2 imattatussi",
      },
      family: {
        // EN: Family Room
        name: "So Asa Kifiliya",
        // EN: Spacious family room with a private outdoor seating area, heritage decor, and comfortable beds for the whole family.
        desc: "Buzo aaho karee de'iyoo, buquratun alleeqida qassikka injjetiyaa hiixay de'iyoo, kumetta so asaassi giigidi aaho kifiliyaa.",
        // EN: 4 guests
        guests: "4 imattatussi",
      },
      heritage: {
        // EN: Heritage Room
        name: "Buqura Kifiliya",
        // EN: Our signature room: full immersion in Wolaita design, premium comfort, private terrace with heritage landscape views.
        desc: "Nuna dummayiyaa kifiliya: Wolaytta alleequwa giddo gelidi, gita injjiyaaninne sohuwaa utettaa be'anawu giigi buzo uttiyoosaa.",
        // EN: 2 guests
        guests: "2 imattatussi",
      },
    },
    amenities: {
      // EN: Wi-Fi
      wifi: "Wi-Fi",
      // EN: Private bathroom
      bathroom: "Buzo meecettiyoo kifiliyaa",
      // EN: Breakfast included
      breakfast: "Maallado qan\"eekka de'ees",
      // EN: Garden view
      garden: "Sohuwaa be'uwaa",
      // EN: Cultural access
      cultural: "Wogaa be'uwaa",
      // EN: Reading area
      reading: "Nabbabiya sohuwaa",
      // EN: Private outdoor area
      outdoor: "Buzo kare bagga sohuwaa",
      // EN: Children's welcome kit
      kids: "Naata mokki ekkiyo miishshata",
      // EN: Private terrace
      terrace: "Buzo kariyaa",
      // EN: Welcome coffee ceremony
      coffee: "Mokki ekkiyo tukkiyaa makkisuwaa",
      // EN: Heritage guide service
      guide: "Buqura sohuwaa yuushshidi bessiyaa haggaazaa.",
      // EN: Full cultural access
      fullCultural: "Kumetta wogaa be'uwaa",
    },
    why: {
      // EN: Why Stay at Bushaashe Garuwa?
      title: "Aayssi Bushaashe Garuwaan Takkiyoo?",
      // EN: Every night here is more than accommodation; it is an immersion in a living heritage.
      desc: "Hagan attiyoo issi issi qammay coo aatoppe shemppoppe dummatee; paxa de'iyoo buqura giddon aattiyoogaappe attin.",
      items: {
        setting: {
          // EN: Authentic Setting
          title: "Tumu Qizagguwaa",
          // EN: Surrounded by heritage trees, cultural houses and nature.
          desc: "Laata mittatun, wogaa keettatuuninne meretan doodettidaagaa.",
        },
        breakfast: {
          // EN: Traditional Breakfast
          title: "Meeze Maallado Qan\"iyaa",
          // EN: Start each day with a Wolaita breakfast prepared by our kitchen.
          desc: "Issi issi gallassaa nu kushiinan giigida Wolaytta qan'iyaa miidi doommite.",
        },
        access: {
          // EN: Full Cultural Access
          title: "Kumetta Wogaa Be'uwaa",
          // EN: Guests enjoy priority access to all heritage experiences.
          desc: "Imattati ubba buqura meezetakka kasetidi be'iyoogaa dosoosona.",
        },
        coffee: {
          // EN: Morning Coffee Ceremony
          title: "Maallado Tukkiyaa Uyiyoo Giigissuwaa",
          // EN: Begin every morning with the traditional Ethiopian coffee ritual.
          desc: "Issi issi guuraa Wolaytta meeze tukkiyaa ushshaa wogan doommite.",
        },
      },
    },
    inquiry: {
      // EN: Request Your Stay
      title: "Takkanwu Oychchite",
      // EN: Tell us when you would like to come. We will call you to confirm the room and the price.
      desc: "Awude yaana koyiyaakkonne nuyyoo odite. Kifiliyaanne gatiyaa erissanawu silkkiyaa shocana.",
      // EN: This is a request, not yet a confirmed booking.
      note: "Hagee ha'issawu oysha xallappe attin sohoy oyqettoogee shaakettibeenna.",
      // EN: Or reach us directly
      or: "Woykko nunaara sittan gayttite",
      // EN: Arrival date *
      arrival: "Gakkiyoo gallassaa *",
      // EN: Nights
      nights: "Qammata",
      // EN: 1 night
      nightOne: "1 qamma",
      // EN: {count} nights
      nightMany: "{count} qammata",
      // EN: Guests
      guests: "Imattata",
      // EN: 1 guest
      guestOne: "1 imatta",
      // EN: {count} guests
      guestMany: "{count} imattata",
      // EN: Room
      room: "Kifiliya",
      // EN: Any room
      anyRoom: "Ayy Kifiliyaanne",
      // EN: Send my request
      submit: "Ta oyshaa yedda",
      // EN: Sending…
      sending: "Yeddiiddi...",
      // EN: Request received
      thanksTitle: "Oyshay gakkiis",
      // EN: Thank you. We will call you shortly to confirm your stay at Bushaashe Garuwa.
      thanksText: "Galatoos. Bushaashe Garuwaan intte takettaa shaakkanwu matan silkkiyaa shocana.",
    },
    cta: {
      // EN: Ready to Book Your Stay?
      title: "Intte Takuwawu Sohuwa Oyttanwu Giigidonii?",
      // EN: Contact us to check availability and reserve your room at Bushaashe Garuwa.
      desc: "Sohoy de'iyoogaa baynnaagaa eranawu nuna demmite; yaatidi Bushaashe Garuwan intte kifiliyaa oyttite.",
      // EN: Book Your Stay
      book: "Intte Takuwawu Sohuwaa Oyttite",
      // EN: Ask a Question
      ask: "Oyshaa Oychcha",
    },
  },
};

export default page;
