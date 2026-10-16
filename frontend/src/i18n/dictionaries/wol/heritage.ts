import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Heritage page
 * See it on the site: /heritage
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  heritage: {
    nature: {
      // EN: Living Nature
      eyebrow: "De'oy Diyoo Meretaa",
      // EN: Life Among the Houses
      title: "De'oy Keettatu Giddon",
      // EN: Birds on the roofs and bright plants along the paths: the grounds are alive in every season.
      desc: "Kaaraa bollan de'iyaa kafotanne ogiyaa bollan lo\"iyaa mittata: gibbee wode ubban paxa de'ees. ",
    },
    hero: {
      // EN: Wolaita Heritage
      eyebrow: "Wolaytta Buquraa",
      // EN: Explore Wolaita Heritage in Bushaashe Garuwa
      title: "Wolaytta Bushaashe Garuwan Be'ite",
    },
    // EN: Every element of Bushaashe Garuwa is a living chapter of Wolaita history. Explore our heritage categories and discover the stories within each one.
    intro: "Issi issi Bushaashe Garuwan de'iyaabay paxa de'iyaa Wolaytta haydaa shemppuwaa. Nu buquraa qommota xeelliiddi issuwa issuwa giddon de'iyaa taariketa be'ite.",
    categories: {
      houses: {
        // EN: Cultural Houses
        label: "Wogaa Keettata",
        // EN: Two traditional Wolaita houses, Gulanttaa Keettaa and Meeshsho Keettaa, full of the traditional tools and instruments of the Wolaita people.
        desc: "Naa\"u Wolaytta keettata: Gulantta Keettaanne Meesho Keettaa, Wolaytta woga miishshatun kumidaageeta.",
      },
      trees: {
        // EN: Trees & Plants
        label: "Mittatanne Dozata",
        // EN: Heritage trees, mango, apple, papaya and banana, more than 1,800 coffee trees, enset and fragrant traditional garden plants.
        desc: "Mangguwaa, appiliyaa, paapaayiyaanne muuziyaa, 1800 dariyaa tukke mittata, uuttaanne sawo mittata.",
      },
      spices: {
        // EN: Spices & Herbs
        label: "Qimaametanne Sawo Maatata",
        // EN: The spices and herbs that give Wolaita food its taste, among the fragrant plants of the garden.
        desc: "Gaden de'iyaa sawo peenoy de'iyoo mittatuppe Wolaytta qumay mal\"ana mala oottiya qimaametanne sawo Maatata.",
      },
      crocodile: {
        // EN: Crocodile Pond
        label: "Hawulaashuwaa Maakooriyaa",
        // EN: A properly fenced crocodile pond, where visitors watch the crocodiles from a safe distance.
        desc: "Xomoosiyaageeti yashshennasaappe eqqidi be'anawu suure direttida hawulaashuwaa maakooriyaa.",
      },
      animals: {
        // EN: Animals & Zoo
        label: "Medoosatanne Do'ata Naagiyoo Sohuwaa",
        // EN: A small zoo where visitors meet the animals kept on the heritage grounds of Bushaashe Garuwa.
        desc: "Xomoosiyaageeti Bushaashe Garuwa gibbe giddon naagettida do'ata be'anawu guutta do'ata naagiyoo sohuwaa.",
      },
      artifacts: {
        // EN: Artifacts
        label: "Buquraa Miishshata",
        // EN: Treasured objects of Wolaita craft, ceremony and daily life.
        desc: "Wolaytta kushe bila gidida, galla galla go'ettiyoo bonchcho miishshata.",
      },
      clothing: {
        // EN: Traditional Clothing
        label: "Wogaa Maayettaa",
        // EN: Clothing that carries culture: the visual language of Wolaita identity.
        desc: "Wogaa tookkida maayettaa: Wolaytta oonattetay bessiyaa qaalaa.",
      },
      music: {
        // EN: Music & Dance
        label: "Yettaanne Durssaa",
        // EN: Living traditions of Wolaita music, song, and ceremonial dance.
        desc: "Wolaytta yettaanne durssaa.",
      },
      food: {
        // EN: Cultural Food
        label: "Wogaa Qumaa",
        // EN: Recipes passed through generations: the taste of Wolaita heritage.
        desc: "Yeletaappe yeletawu pinnida Wolaytta qumaa katuwaa.",
      },
      stories: {
        // EN: Oral Histories
        label: "Doonaa Haydata",
        // EN: Stories passed down in Wolaytta, Amharic and English.
        desc: "Wolayttattuwan, Amaarattuwaaninne Ingiliizattuwan odettiyaa taariketa.",
      },
    },
    houses: {
      // EN: Traditional Houses
      eyebrow: "Wogaa Keettata",
      // EN: Two Traditional Wolaita Houses
      title: "Naa\"u Wolaytta Keettata",
      // EN: Bushaashe Garuwa keeps two traditional and cultural Wolaita houses. Inside them are the traditional tools and instruments the Wolaita people have used in daily life, work and ceremony.
      desc: "Bushaashe Garuwan naa\"u Wolaytta wogaa keettati de'oosona. Etu giddon, Wolaytta asay bantta galla galla de'uwawu, oosuwawunne baalatussi go'ettido miishshati de'oosona.",
      // EN: Traditional Wolaita house
      label: "Beni Wolaytta Keettaa",
      // EN: Inside: the traditional grinding stone (wotta), tools for spinning and weaving cotton, household goods, and the traditional instruments of the Wolaita people.
      inside: "Etu giddon: gaacciyoo shuchchay (woxaa), daddiyoonne puuttuwaa suqqiyoo miishshati, son go'ettiyoo shaqaxatinne beni Wolaytta asaa miishshati de'oosona.",
    },
    trees: {
      // EN: Living Memory
      eyebrow: "Xayenna Taarikiyaa",
      // EN: Trees Planted by Our Forefathers and the Current Generation
      title: "Nu mayzza aawatuuninne ha\"i yeletan tokettida mittata",
      items: {
        zigba: {
          // EN: Zigba (African Yellowwood)
          name: "Zigaa",
          // EN: Planted by Garedew · Cared for by his children today
          age: "",
          // EN: The zigba trees stand in a long, even line across the grounds. Garedew planted them by measure and watered them with water brought from the river, so that travellers passing by could rest in their shade. His children care for them today and keep planting new ones beside them.
          sig: "",
        },
      },
      // EN: Scan QR codes on-site to discover each tree's full story
      qr: "Issi issi kumetta taarikiyaa eranawu mittatu bollan de'iyaa 'QR' kooddeta denttidi be'ite.",
    },
    family: {
      // EN: Family Legacy
      eyebrow: "So asaa Laataa",
      // EN: Generations of Heritage
      title: "Laataa Yeletata",
      // EN: Behind every cultural house, every artifact and every story is a family that devoted generations to preserving the soul of Wolaita. Discover the people behind the heritage.
      desc: "Issi wogaa keettaa, buquraanne taarikiyaa zokkuwan Wolayttaa shemppuwaa naaganawu bantta yeletaa immidida so asay de'ees. Ha buquraa zokkossan de'iyaa asatubaa xanna'ite.",
      // EN: Discover the Family Story
      cta: "So Taarikiyaa Nabbabite",
      generations: [
        // EN: Bushaashe
        "Bushaasha",
        // EN: Alambo
        "Alambba",
        // EN: Garedew
        "Garedewu",
        // EN: Today
        "Hachchi",
      ],
    },
  },
};

export default page;
