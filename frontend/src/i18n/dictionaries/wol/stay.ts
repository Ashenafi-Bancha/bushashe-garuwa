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
      eyebrow: "Geshsha Keettaa",
      // EN: Stay Within the Story
      title: "Taarikkiya Giddon Shemppa",
      // EN: Sleep where history breathes, in rooms that reflect the warmth and authenticity of Wolaita heritage.
      desc: "Taarikkey de'iyo, Wolaytta aadaa aashshonninne tumutettaa bessiya keettatan hiixxa.",
    },
    comingSoon: {
      // EN: Coming soon
      badge: "Matan yees",
      // EN: A guest house inside the heritage site is planned. It is not open yet.
      lead: "Laata sa'aa giddon imtta keettai halchchettiis. Ha'i dooyettibeenna.",
      // EN: The Guest House Is a Coming Service
      title: "Imtta Keetti Yiya Oosuwaa",
      // EN: Bushaashe Garuwa is preparing a guest house so that visitors can stay overnight. It is still being finished and does not take guests yet. We will announce it here when it opens.
      text: "Be'iyasati qamma aadhdissana mala Bushaashe Garuwaagee imtta keettaa giigissiis. Ha'issa polliishetishshin imttata ekkekko. Dooyettiyo wode hayssan erissana.",
      // EN: Questions in the Meantime?
      askTitle: "Heedzan Oychchoy De'ii?",
      // EN: Call or write to us and we will gladly tell you more.
      askText: "Nuussi silkkiya shoccite woykko xaafite, nuni aaruwa eexxaashetan yootana.",
      // EN: Open Now: the VIP Service
      vipTitle: "Ha'i Dooyettida: VIP Oosuwaa",
      // EN: Families can already come to the VIP rooms to cook, eat, celebrate and stay the night.
      vipText: "So asati ha'issa VIP keettatassi yiidi katana, maana, galatana qassi qamma aadhdissana danddayoosona.",
    },
    // EN: Amenities
    amenitiesLabel: "Koshshiyaabaa",
    // EN: View Details
    viewDetails: "Aaruwa Be'a",
    // EN: Book This Room
    bookRoom: "Ha Keettaa Oyqqa",
    rooms: {
      standard: {
        // EN: Standard Room
        name: "Woga Keettaa",
        // EN: A peaceful retreat with cultural touches, comfortable bedding, private bathroom and serene garden views.
        desc: "Aada bessi, lo'o hiixiyobaa, ba haaxxa meecciyo sohuwaara qassi ataakiltte be'uwaara de'iya sarotetta shemppiyo sohuwaa.",
        // EN: 2 guests
        guests: "2 imttatassi",
      },
      family: {
        // EN: Family Room
        name: "So Asa Keettaa",
        // EN: Spacious family room with a private outdoor seating area, heritage decor, and comfortable beds for the whole family.
        desc: "Kumetta so asassi keehi lo'o hiixiyo arsaara, laata aleequwaara qassi ba kariya uttiyo pillaasaara de'iya aahuwaa so asa keettaa.",
        // EN: 4 guests
        guests: "4 imttatassi",
      },
      heritage: {
        // EN: Heritage Room
        name: "Laata Keettaa",
        // EN: Our signature room: full immersion in Wolaita design, premium comfort, private terrace with heritage landscape views.
        desc: "Nu dumma keettaa: Wolaytta aleequwa giddon kumetta de'uwaa, al'o shemppuwaa, ba terrace-ra qassi laata gadiyaa be'uwaara.",
        // EN: 2 guests
        guests: "2 imttatassi",
      },
    },
    amenities: {
      // EN: Wi-Fi
      wifi: "Wi-Fi",
      // EN: Private bathroom
      bathroom: "Ba meecciyo sohuwaa",
      // EN: Breakfast included
      breakfast: "Maallado qumay de'iyoogaa",
      // EN: Garden view
      garden: "Ataakiltte be'uwaa",
      // EN: Cultural access
      cultural: "Aada be'uwaa",
      // EN: Reading area
      reading: "Nabbabiya pillaasaa",
      // EN: Private outdoor area
      outdoor: "Ba kariya pillaasaa",
      // EN: Children's welcome kit
      kids: "Na'atassi mokki ekkiyo miishshata",
      // EN: Private terrace
      terrace: "Ba terrace-a",
      // EN: Welcome coffee ceremony
      coffee: "Mokki ekkiyo buna oosuwaa",
      // EN: Heritage guide service
      guide: "Laata ogiya bessiyaas",
      // EN: Full cultural access
      fullCultural: "Kumetta aada be'uwaa",
    },
    why: {
      // EN: Why Stay at Bushaashe Garuwa?
      title: "Aayssi Bushaashe Garuwaan Shemppii?",
      // EN: Every night here is more than accommodation; it is an immersion in a living heritage.
      desc: "Hayssan aadhdhiya qamma ubbay shemppiyoogaappe aadhdhiyaabaa; de'iya laataa giddon uttuyoogaa.",
      items: {
        setting: {
          // EN: Authentic Setting
          title: "Tumu Sohuwaa",
          // EN: Surrounded by heritage trees, cultural houses and nature.
          desc: "Laata mittatan, aada keettatanne medhetettaan yuuyettida.",
        },
        breakfast: {
          // EN: Traditional Breakfast
          title: "Aada Maallado Qumaa",
          // EN: Start each day with a Wolaita breakfast prepared by our kitchen.
          desc: "Gallassa ubbaa nu kichchiyeppe giigida Wolaytta maallado quman dooyite.",
        },
        access: {
          // EN: Full Cultural Access
          title: "Kumetta Aada Be'uwaa",
          // EN: Guests enjoy priority access to all heritage experiences.
          desc: "Imttati aada be'uta ubbaa kasetidi be'iyo uyoppaa demmoosona.",
        },
        coffee: {
          // EN: Morning Coffee Ceremony
          title: "Maallado Buna Oosuwaa",
          // EN: Begin every morning with the traditional Ethiopian coffee ritual.
          desc: "Maallado ubbaa aada Itoophiyaa buna oosuwa wogaan dooyite.",
        },
      },
    },
    inquiry: {
      // EN: Request Your Stay
      title: "Ne Shemppuwaa Oychcha",
      // EN: Tell us when you would like to come. We will call you to confirm the room and the price.
      desc: "Au wode yaanawu koyiyookko nuussi yootite. Keettaane miishshaa wogaa zaaridi erissanawu silkkiya shocana.",
      // EN: This is a request, not yet a confirmed booking.
      note: "Hayssi oychcho xalla, ha'i gakkanaas polettida oyqqo gidenna.",
      // EN: Or reach us directly
      or: "Woykko nuura pillaasan gayttite",
      // EN: Arrival date *
      arrival: "Gakkiyo gallassa *",
      // EN: Nights
      nights: "Qammata",
      // EN: 1 night
      nightOne: "1 qamma",
      // EN: {count} nights
      nightMany: "{count} qammata",
      // EN: Guests
      guests: "Imttata",
      // EN: 1 guest
      guestOne: "1 imtta",
      // EN: {count} guests
      guestMany: "{count} imttata",
      // EN: Room
      room: "Keettaa",
      // EN: Any room
      anyRoom: "Ayyikeene keettaa",
      // EN: Send my request
      submit: "Ta oychchoo yedda",
      // EN: Sending…
      sending: "Yeddidoogaa...",
      // EN: Request received
      thanksTitle: "Oychchoy ekkettiis",
      // EN: Thank you. We will call you shortly to confirm your stay at Bushaashe Garuwa.
      thanksText: "Galatoos. Bushaashe Garuwaan ne shemppuwaa giigissanawu matan silkkiya shocana.",
    },
    cta: {
      // EN: Ready to Book Your Stay?
      title: "Ne Shemppuwaa Oyqqanawu Giigidii?",
      // EN: Contact us to check availability and reserve your room at Bushaashe Garuwa.
      desc: "Sohoy de'iyoogaa be'anawunne Bushaashe Garuwaan ne keettaa oyqqanawu nuura gayttite.",
      // EN: Book Your Stay
      book: "Ne Sohuwaa Oyqqa",
      // EN: Ask a Question
      ask: "Oychcho Oychcha",
    },
  },
};

export default page;