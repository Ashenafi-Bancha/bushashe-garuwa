import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Meeting Hall page
 * See it on the site: /meeting-hall
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  meeting: {
    hero: {
      // EN: Meeting Hall
      eyebrow: "Shiiquwaa Gutaraa",
      // EN: A Hall for Your Gathering
      title: "Shiiwuwawu Haniyaa Gutaraa",
      // EN: A hall on the heritage grounds for meetings, trainings, weddings and family days, with food and coffee from our kitchen.
      desc: "Shiiquwawu, loohissuwawu, bullachchatuyyoonne so asaa gallassutussi haniyaa aaho sohoy nu kushiinan giigida qumaanne tukkiyaara.",
    },
    intro: {
      // EN: What It Is For
      eyebrow: "Aybissi Maaddii?",
      // EN: One Hall, Many Occasions
      title: "Issi Gutaraa, Cora Giigissota",
      // EN: The hall is set with rows of chairs dressed in white with bands of Wolaita pattern. Outside are the gardens, the lawns and the cultural houses, so a working day or a celebration can also be a visit.
      text: "Kifilee, Wolaytta bootta carqqiyan lil\"issido oydetun giigidi kumi uttiis. Kare baggaara qassi ataakiltte bootati, dembbatinne keettati de'oosona; hegaa gishshawu intte xomoosoy ooso woykko baala xomooso gidanawukka danddayees.",
    },
    uses: {
      meetings: {
        // EN: Meetings
        title: "Shiiqota",
        // EN: For organisations, offices and community groups.
        desc: "Kawo keettatussi, ooso keettatussinne dere yaratussi.",
      },
      trainings: {
        // EN: Trainings & Workshops
        title: "Luxissiyoogaanne Loohissuwaa",
        // EN: Room to sit, listen and work, with quiet grounds outside.
        desc: "Uttanawu, ezgganawunne oosuwaa oottanawu haniyaa qassikka kare baggaara co\"u giida sohoy de'iyoo kifiliyaa.",
      },
      education: {
        // EN: Education
        title: "Luxettaa",
        // EN: Lessons and talks for schools, universities and study groups.
        desc: "Timirtte keettatussi, Yunbbersttetussinne xanna'iyaa citatussi sissiyoo haasayatanne immiyoo meeziyaa woykko timirttiyaa",
      },
      weddings: {
        // EN: Weddings
        title: "Bullachchata",
        // EN: A hall for the ceremony or the meal, and the gardens for photographs.
        desc: "Qumaa maanawu kifilyaa, pootuwaa denddanawu qassi ataakiltte bootati de'oosona.",
      },
      family: {
        // EN: Family Gatherings
        title: "So asaa Shiiqota",
        // EN: Bring the whole family together for a day.
        desc: "Kumetta so asaa issi gallassawu ekkidi yiite",
      },
      anniversaries: {
        // EN: Anniversaries & Celebrations
        title: "Laytta Baalatanne Bonchcho Baalata",
        // EN: Birthdays, anniversaries and other days worth marking.
        desc: "Yeleta gallassaa, laytta baalanne hara bonchchettana koshshiyaa gallassata.",
      },
      visitors: {
        // EN: Visitor Groups
        title: "Xomoosiyaageetu Citata",
        // EN: A place for groups to gather and eat before or after the heritage walk.
        desc: "Citati shiiqinawunne hemetaappe kasiyan woykko guyyiyan qumaa maanawu haniyaa sohuwaa.",
      },
    },
    // EN: The Hall and the Grounds
    photosTitle: "Gutaraanne Gibbiyaa",
    cta: {
      // EN: Would You Like to Use the Hall?
      title: "Gutaraa sohuwaa go'ettanawu koyay?",
      // EN: Call or write to us with the date and the number of people, and we will arrange it with you.
      text: "Yiyoo gallassaanne yiyaa asaa qoodaa nuyyoo silkkiyaa shocidi woykko xuufiyan erissite, attidabaa nu giigissana.",
    },
  },
};

export default page;
