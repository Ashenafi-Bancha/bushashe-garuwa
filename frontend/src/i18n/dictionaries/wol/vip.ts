import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · VIP Service page
 * See it on the site: /vip
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  vip: {
    hero: {
      // EN: VIP Service
      eyebrow: "VIP Haggaazaa",
      // EN: A Private Place for Your Family
      title: "Intte Keettaa Asaayyoo Buzo Sohuwaa",
      // EN: Come with your family, cook, eat and celebrate together, in rooms kept for you alone.
      desc: "Intte xallawu giigida kifiliyan intte keettaa asaara yiidi hegan kattite, miitenne issippe ufayttite",
    },
    intro: {
      // EN: What It Is
      eyebrow: "I bawu aybee",
      // EN: Your Own Rooms on the Heritage Grounds
      title: "Gibbe Giddon Inttiyoo Giigida Kifileta",
      // EN: The VIP service is for families and small groups who want a private place. You can cook in the VIP kitchen, eat together, celebrate, sit by the fire, and stay the night in the VIP rooms.
      text: "VIP haggaazay giigidoy buzo kifiliya koyyiya keettaa asaassinne guutta citan gididi yiyaa asatussa. VIP kifiliya kushiinan kattiyoogee, issippe miyoogee, bonchchiyoogee, tamaa yuushuwan shiiqidi kaa'iiddi uttiyoogee danddayetees; qassikka qammaakka hegan aqanawu danddayeeta.",
    },
    features: {
      kitchen: {
        // EN: VIP Kitchen
        title: "VIP Kushiinaa",
        // EN: Cook your own food there, the way your family likes it.
        desc: "Intte so asay dosiyoogadan oottidi intte qumaa intte giigissite.",
      },
      dining: {
        // EN: Eat Together
        title: "Issippe Miite",
        // EN: A sitting and dining room with sofas and a large table.
        desc: "Utti ekkanawunne kahuwaa maanawu giigida soofaynne gita xaraphpheexxay de'iyoo kifiliyaa",
      },
      celebrate: {
        // EN: Celebrate
        title: "Bonchchite",
        // EN: Birthdays, family gatherings and other special days, in private.
        desc: "Buzuwan shiiqidi yeleta gallassaa, so asaa shiiquwaanne hara hara dummatiyaa gallassata bonchchite",
      },
      fire: {
        // EN: Fireplace
        title: "Tamaa Sohuwaa",
        // EN: A fire in the VIP room to gather around.
        desc: "VIP kifiliya giddon shiiqi uttanawu giigida tamaa sohuwaa.",
      },
      rooms: {
        // EN: VIP Rooms for Sleeping
        title: "Xiskkiyoo VIP Kifileta",
        // EN: Bedrooms where the family can stay the night.
        desc: "So asay qammaa aqanawu giigida alggaa kifileta.",
      },
      restrooms: {
        // EN: VIP Rest Rooms
        title: "Shemppiyoo VIP Kifileta",
        // EN: Private rest rooms for VIP guests.
        desc: "VIP imattatussi giigida buzo shemppiyoo kifileta.",
      },
    },
    // EN: Inside the VIP Rooms
    photosTitle: "VIP Kifiletu Giddon",
    // EN: The sitting and dining room, the bedroom, the kitchen where you cook for yourselves, and the private rest rooms.
    photosDesc: "",
    cta: {
      // EN: Would You Like to Use the VIP Service?
      title: "VIP Haggaazaa go'ettanawu koyidetii?",
      // EN: Call or write to us with your date and the number of people, and we will arrange it.
      text: "Yiyoo gallassaa yiyaa asaa qoodaara silkkiyaa shocidi woykko qantta xuufiyan odite, attabaa nu giigissidi naagana.",
    },
  },
};

export default page;
