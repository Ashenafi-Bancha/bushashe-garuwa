import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Dine page
 * See it on the site: /dine
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  dine: {
    hero: {
      // EN: Restaurant & Bar
      eyebrow: "Katta Keettaanne Ushsha Keettaa",
      // EN: Taste the Culture in Bushaashe Garuwa
      title: "Wolaytta Bushaashe Garuwan Be'ite",
      // EN: Every dish is rooted in tradition, prepared with care, and served with Wolaita warmth.
      desc: "Issi issi qumay wogan keten\"ida, akeekan giigidanne Wolaytta ufayssa mohuwaara shiiqiyaagaa.",
    },
    categories: {
      // EN: Wolaita Cuisine
      wolaita: "Wolaytta Qumata",
      // EN: Ethiopian Cuisine
      ethiopian: "Toophphiyaa Qumata",
      // EN: Drinks
      drinks: "Ushshata",
      // EN: Special Events
      special: "Dumma Giigissota",
    },
    menu: {
      wolaita: {
        kitfo: {
          // EN: Kitfo Wolaita
          name: "Wolaytta Kitfuwaa",
          // EN: Minced beef seasoned with mitmita and niter kibbeh, served with kocho and ayib.
          desc: "Bambbariyaaninne geeshsha oyssan giigida anccettida ashuwaa, unccaaranne pilaara gattidi aattiyoogaa.",
        },
        bulla: {
          // EN: Bulla Porridge
          name: "Itimaa Shendderaa",
          // EN: Traditional Wolaita porridge made from the root of the false banana plant, a staple food of the region.
          desc: "Uuttaappe giigiya Wolayttaa shendderaa; heerawukka meeze quma.",
        },
        kocho: {
          // EN: Kocho with Wot
          name: "Unccaara Woxiyaara",
          // EN: Traditional Wolaita flat bread made from ensete, served with richly spiced vegetable or meat stew.
          desc: "Uuuttaappe giigida Wolaytta unccay keehippe giigida ataakilttiya woykko asho woxiyaara shiiqees.",
        },
        tibs: {
          // EN: Tibs Wolaita
          name: "Wolaytta Xibsiyaa",
          // EN: Sautéed beef or lamb with onion, tomato, green pepper and traditional spices.
          desc: "Shunkkurtiya, timaatimiyaa woykko tuummuwaa, bambbariyaanne qimameta Booraa woykko Dorssaa ashuwaara gattidi giidissidoogaa.",
        },
      },
      ethiopian: {
        doroWat: {
          // EN: Doro Wat
          name: "Kutto Woxiyaa",
          // EN: Ethiopia's iconic slow-cooked chicken stew in a rich berbere sauce, served with injera.
          desc: "Bambbariyan daro wodiyaa ekkidi giigiya Toophphiyan keehippe erettiyaa kutto ashoy buddeenaara shiiqees.",
        },
        beyaynetu: {
          // EN: Injera with Beyaynetu
          name: "Buddeenaa Beyeaynetiyaara",
          // EN: A generous spread of vegetarian wots and salads on injera, ideal for cultural sharing.
          desc: "Buddeenan wottidi shiishshiyoo dumma dumma xoomaa woxetanne salaaxata; issippe shiiqidi maanawukka keehippe injjetees.",
        },
        goredGored: {
          // EN: Gored Gored
          name: "Gored Gorediya",
          // EN: Tender cubed beef seasoned with kibbeh and served with injera.
          desc: "Orddiyan anccettida shugo booraa ashuwaa oyssan kattin buddeenaara aaxxiyaagaa.",
        },
        shiro: {
          // EN: Shiro Wat
          name: "Shuro Woxiyaa",
          // EN: Smooth chickpea flour stew slow-cooked with spices. A classic Ethiopian comfort dish.
          desc: "Loddan qimamiyan ka'iyaa shugo shumbburaa xiilliyaa woxiyaa. Toophphiyan keehippe erettida qumaa.",
        },
      },
      drinks: {
        bunna: {
          // EN: Bunna (Coffee)
          name: "Tukkiyaa",
          // EN: Ethiopian coffee served in the traditional ceremony style: three rounds, fresh roasted.
          desc: "Toophphiyaa meeze tukkiyaa ushshaa wogan shiiqiyaa; heezzutoo zaaretettidaagaa; ooratta shaa'ettidaagaa.",
        },
        tej: {
          // EN: Tej
          name: "Xajjiyaa",
          // EN: Traditional Ethiopian honey wine, lightly fermented and refreshing.
          desc: "Toophphiyan meezetettida eessaappe giigida woyniyaa; daro daafurennan giigiyaanne uyin aliyaagaa.",
        },
        tella: {
          // EN: Tella
          name: "Xallaa",
          // EN: Home-brewed sorghum beer, a community beverage of Wolaita.
          desc: "Son agettiyaa maldduwaappe giigiyaa ushshaa; Wolaytta dere asaa ushshaa.",
        },
        juice: {
          // EN: Fresh Juice
          name: "Ho\"iyaa Juusiyaa",
          // EN: Seasonal fresh fruit juice: avocado, mango, papaya or passion fruit.
          desc: "Wodiyaa naagida abukaadoosiyaa, mangguwaanne paapaayiyaa malatiyaabatuppe giigiyaa ho\"iyaa juusiyaa.",
        },
      },
      special: {
        foodEvening: {
          // EN: Cultural Food Evening
          name: "Wogaa Qumaa Omarssaa",
          // EN: Our monthly gathering: full traditional meal, coffee ceremony, music and storytelling. Reserve in advance.
          desc: "Aginan aginan nu oottiyoo shiiqota: kumetta wogaa qumaa, tukkiyaa ushshaa, yettaanne haysiyaa odiyoogaa. Koyrottidi sohuwaa oyttiichchite.",
        },
        groupFeast: {
          // EN: Group Cultural Feast
          name: "Corawu Giigida Qumaa",
          // EN: A full traditional feast for groups of 8–30 people, with cultural performance included.
          desc: "8naappe biidi 30 gidiyaa yarati de'iyoo citatussi giigiyaa mohaa. Hara giigissotikka de'oosona.",
        },
        privateDinner: {
          // EN: Private Heritage Dinner
          name: "Buzo Kahuwaa",
          // EN: An intimate private dinner experience in the heritage garden, available by request.
          desc: "Buqura sohuwaa giddon de'iyaa ataakiltte sohuwan giigiya buzo kahuwaa meeziyaa; hagee qassi dumma oyshan giigees.",
        },
      },
    },
    // EN: Join a Cultural Food Event
    joinEvent: "Wogaa Qumaa Makkisota Shaakkite",
    bar: {
      // EN: Bar
      eyebrow: "Ushsha Keettaa",
      // EN: Gather. Relax. Connect.
      title: "Shiiqite. Allaxxite. Gayttite",
      // EN: Our bar is where stories are shared, community is built, and the day slowly fades into the warmth of Wolaita evenings. Traditional drinks alongside modern refreshments, always served with genuine hospitality.
      desc: "Nu ushsha keettay haydati hara odettiyoo, gallassay loddan ho\"iyaa Wolaytta omarssawu laamettiyoo soho. Ubbatookka wozanappe haniyaa imattaa mohaara shiiqoosona.",
      // EN: Weekdays
      weekdays: "Saynnoppe biidi Arbba",
      // EN: Weekends
      weekends: "Qeeraanne Woggaa",
      // EN: Opening Hours
      hours: "Dooyettiyoo Saateta",
      cultural: {
        // EN: Cultural Drinks
        title: "Wogaa Ushshata",
        // EN: Traditional drinks of Wolaita and Ethiopia.
        desc: "Wolayttanne Toophphiyaa Ushshata",
        items: [
          // EN: Tej (Honey Wine)
          "Xajjiyaa (Eessaa Woyniyaa)",
          // EN: Tella (Sorghum Beer)
          "Xallaa (Maldduwaa Biiraa)",
          // EN: Ethiopian Coffee
          "Toophphiyaa Tukkiyaa",
          // EN: Local Spirits
          "Toophphiya giddo Ushshata",
        ],
      },
      modern: {
        // EN: Modern Drinks
        title: "Wodiyaa Ushshata",
        // EN: Juices and soft drinks, for every taste.
        desc: "Juusetanna Laslaassata",
        items: [
          // EN: Fresh Juices
          "Ho\"o Juusiyaa",
          // EN: Soft Drinks
          "Laslaassata",
        ],
      },
    },
  },
};

export default page;
