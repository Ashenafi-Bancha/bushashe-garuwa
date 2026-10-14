import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Experiences page
 * See it on the site: /experiences
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  experiences: {
    hero: {
      // EN: Be Part of the Story
      eyebrow: "Taarikiyawu Issi Bolla Gidite",
      // EN: Experience Wolaita in Bushaashe Garuwa
      title: "Wolaytta Bushaashe Garuwan Be'ite",
    },
    // EN: Bushaashe Garuwa is not simply observed; it is experienced. Each of our visitor experiences is designed to create a genuine, respectful and memorable encounter with living Wolaita culture.
    intro: "Bushaashe Garoy xeelliyooba xalla gidenna; bochchidi, meezetidi be'iyooba. Issi issi nu imattay meezetiyoobay Wolaytta wogaara tumu, bonchchoy de'iyoonne dogettenna gaytotettay de'ana mala qofettidi giigidaagaa.",
    // EN: Coming soon
    soon: "Mata wodiyan...",
    // EN: Planned. Not open yet.
    soonNote: "Halchchetti uttis. Shin dooyettibeenna.",
    // EN: What's included
    showIncluded: "Aybaa aybaa oyqqidee",
    // EN: Hide details
    hideDetails: "Gentta",
    items: {
      food: {
        // EN: Cultural Food Experience
        title: "Qumaa Meezetuwaa",
        // EN: Taste authentic Wolaita cuisine
        sub: "Tumu Wolaytta qumaa miidi be'ite",
        // EN: Gather around the communal table and experience traditional Wolaita cooking. Taste dishes prepared with ancient recipes, learn about the ingredients, and share a meal with our family.
        desc: "Issipe shiiqidi Wolaytta wogaa qumaa katuwaa be'ite. Mayzza katuwaa ogiyan ka'ida quma mi be'ite, qimametubaa tamaarite, qassikka nu so asaara shiiqidi qumaa miite.",
        includes: [
          // EN: Welcome coffee ceremony
          "'Hashshu saro yeeta' giiddi tukkiyan mokkiyoogaa.",
          // EN: Guided cooking demonstration
          "Qumaa katuwaa bessiyoogaa",
          // EN: Full traditional meal
          "Kumetta wogaa qumaa",
          // EN: Recipe card to take home
          "Soo ekkidi biyoo 'katuwaa ogiyaa' karddiyaa.",
        ],
      },
      coffee: {
        // EN: Traditional Coffee Ceremony
        title: "Tukkiyaa Makkisuwaa",
        // EN: The sacred Ethiopian ritual
        sub: "Toophphiyan bonchchettidda meeziyaa",
        // EN: Experience the Ethiopian coffee ceremony as it has been performed for generations. Our host will guide you through the roasting, brewing and serving ritual with authentic Wolaita hospitality.
        desc: "Yeletatuyyoo haniiddi takkida Toophphiyaa tukkiyaa makkisuwaa meezetidi be'ite. Nu imattaa mokkiyaageeti tukkiyaa shaa'iiddi, penttissiiddinne aattiiddi tumu Wolaytta imattaa mohuwaara kaalettiidd bessoosona.",
        includes: [
          // EN: Three rounds of coffee
          "Heezzutoo zarettido tukkiyaa",
          // EN: Traditional snacks
          "Qurssiyaa",
          // EN: Cultural explanation
          "Tamaarissiyoogaa",
          // EN: Communal experience
          "Issippe shiiqidi be'iyoogaa",
        ],
      },
      performance: {
        // EN: Cultural Music and Dance Performance
        title: "Wogaa Yettaanne Durssaa Makkisuwaa",
        // EN: Wolaita music, song and dance
        sub: "Wolaytta yettaanne durssaa",
        // EN: Traditional Wolaita music, song and ceremonial dance, performed on the grounds. The performances are planned and will be announced here when they begin.
        desc: "Wolaytta wogaa yettaynne durssay gibbe giddon besettees. Makkisotu keeretti uttidosonanne hagan mata wodiyan erettoosona.",
        includes: [
          // EN: Traditional music
          "Yettaa",
          // EN: Cultural dance
          "Durssaa",
        ],
      },
      workshop: {
        // EN: Cultural Skills Workshop
        title: "Wogaa Bilaa Loohissuwaa",
        // EN: Weaving and other Wolaita skills
        sub: "Dattaanne hara Wolaytta bilata",
        // EN: Hands-on workshops in weaving and other traditional Wolaita skills are being prepared. They are planned and not open yet.
        desc: "Dattaanne hara Wolaytta bilata loohissoti giigiiddi de'oosona. Halchchettidisona; shin biron doomettiichchibookkona.",
        includes: [
          // EN: Weaving
          "Dattaa",
          // EN: Other traditional skills
          "Hara Wolaytta bilata",
        ],
      },
      tour: {
        // EN: Heritage Tour
        title: "Buqura Yuuyiiddi Be'iyoogaa",
        // EN: A guided walk through history
        sub: "Taarikiyaa giddoora kaalettin tohuwan hemettiyoogaa",
        // EN: Walk through the entire Bushaashe Garuwa heritage site with an expert guide. Visit cultural houses, ancient trees, the artifact collection, and hear the stories connected to each location.
        desc: "Eranchchay keelettiiddi bessishin mule Bushaashe Garuwa gidduwaara hemettite. Woga keettata, mayzza mittatanne shiiqida buqurata be'ite. Issi issi sohuwaara gayttida taarikiyaakka ezggite.",
        includes: [
          // EN: Expert heritage guide
          "Eranchchay kaalettin buquraa yuuyyiiddi be'iyoogaa",
          // EN: Cultural houses visit
          "Wogaa keettata xomoosiyoogaa",
          // EN: Ancient tree tour
          "Mayzza mittata hemettiiddi be'iyoogaa",
          // EN: Artifact viewing
          "Buqurata be'iyoogaa",
          // EN: Traditional tea break
          "Shayiyaa uyiyoo shemppo wodiyaa",
        ],
      },
      horse: {
        // EN: Horseback Riding
        title: "Paraa Togaa",
        // EN: Ride across the great lawn
        sub: "Gita aaho qooruwan para laaggiyoogaa",
        // EN: Horses are kept at Bushaashe Garuwa and wait on the great lawn for visitors who would like to ride. Ask when you arrive, or tell us when you book your visit.
        desc: "Bushaashe Garuwan parati de'oosona; toggana koyyiyaa imattatussi gita dembban giididi naagoosona. Gakkiyoode nuna oychchite woykka xomoosonawu sohuwaa oyttiyoode nuyyoo odite.",
        includes: [
          // EN: A horse from the grounds
          "Gibbe giddon giigida parata",
          // EN: A ride on the great lawn
          "Aaho gita zaguwan laaggiyoogaa",
        ],
      },
      education: {
        // EN: Educational Visit
        title: "Timirtte Xomoosuwaa",
        // EN: Learning through experience
        sub: "Meezetiiddi tamaariyoogaa",
        // EN: Structured educational experiences for schools, universities and research groups. Tailored to different age groups and academic interests, with hands-on cultural activities.
        desc: "Timirtte keettatuyyoo, yunbbersttetuyoonne pilggiyaa yaratuyyoo giigida timirtteba gidida meezeta. Dumma dumma laytta citatuyyoonne luxetta koshshatuyyoo giigida woga oosotikke de'oosona.",
        includes: [
          // EN: Structured educational program
          "Giigida luxetta pirograamiyaa",
          // EN: Hands-on activities
          "Oyqqidi oottiiddi be'iyoo oosota",
          // EN: Learning materials
          "Tamaariyoo miishshata",
          // EN: Certificate of participation
          "Shaakkido gishshawu imettiyoo 'Markka Woraqataa'",
          // EN: Guided discussions
          "Kaaleta zoretaa",
        ],
      },
      photography: {
        // EN: Photography Experience
        title: "Pootuwaa denddiyoo meeziyaa",
        // EN: Capture the living heritage
        sub: "Mereta sohota pootuwaa denttite",
        // EN: A guided photography experience through the most visually striking locations of Bushaashe Garuwa: cultural houses, heritage trees, cultural performances and authentic daily life.
        desc: "Bushaashe Garuwan de'iyaa keehippe lo\"iyaa sohotu pootuwaa denttiyoo meeziyoo: wogaa keettata, mayzza mittatanne yettaanne durssaa tumu galla galla de'uwaara.",
        includes: [
          // EN: Photography guide
          "Pootuwaa denttiyoosaa kaalettidi bessiyoogaa",
          // EN: Access to all heritage areas
          "Ubbasaakka denttanawu danddayeeta",
          // EN: Portrait sessions with traditional dress
          "Wogaa maayota maayidi pootuwa denddiyoogaa",
          // EN: Best viewpoint guidance
          "Pootuwaa denddanawu keehippe lo\"iyaa sohoti bessiyoogaa.",
        ],
      },
      family: {
        // EN: Family Heritage Tour
        title: "So asaa buquraa xomoosiyoogaa",
        // EN: Discover the family story together
        sub: "So asaa taarikiyaa issippe siyite",
        // EN: A special tour designed for families, blending storytelling, nature walks, cultural activities and food in a relaxed, multi-generational experience.
        desc: "So asawu giigida dumma xomoosuwaa, haysiyaa odiyoogaa, meretan tohuwan hemettiyoogaa, wogaa qaattatanne allaxxiiddi qumaa miyoogaa.",
        includes: [
          // EN: Family-friendly program
          "So asawu injjetiya pirogiraamiyaa",
          // EN: Nature walk
          "Meretan tohuwan hemettiyoogaa",
          // EN: Storytelling session for children
          "Naatuyyoo haysiyaa odiyoo wodiyaa",
          // EN: Traditional meal
          "Wogaa qumaa",
          // EN: Family portrait
          "So asaa pootuwaa",
        ],
      },
    },
    cta: {
      // EN: Not sure where to start?
      title: "Awuppe doommanaakko eribeekketii?",
      // EN: Contact us and we'll help you design the Bushaashe Garuwa experience that's right for you.
      desc: "Nuna demmite; inttiyoo injjetiyaa Bushaashe Garuwan aattiyoo wodiyaa giigissana mala inttena maaddan.",
    },
  },
};

export default page;
