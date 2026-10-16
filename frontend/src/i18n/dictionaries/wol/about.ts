import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · About page
 * See it on the site: /about
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  about: {
    hero: {
      // EN: About Bushaashe Garuwa
      eyebrow: "Bushaashe Garuwaabaa",
      // EN: A Heritage Built
      titleA: "Yeletan Yeletan",
      // EN: Generation by Generation
      titleB: "Keexettida Buquraa",
      // EN: Bushaashe Garuwa heritage
      imgAlt: "Bushaashe Garuwa buquraa",
    },
    who: {
      // EN: Who We Are
      eyebrow: "Nu Oonakkonne",
      // EN: More Than a Place: A Living Story
      title: "Sohoppe Kanttees: Paxa Taarikiya",
      // EN: Bushaashe Garuwa is a living Wolaita heritage destination in Damot Sore Woreda, Wolaita Zone, Ethiopia: a beautifully developed eco-tourism site, cultivated and cared for by the Bushaashe family. We are more than a museum, a resort, or a tourist attraction; we are a family heritage that has been tended and passed down across four generations.
      p1: "Bushaashe Garoy Toophphiyan, Wolaytta Moottan, Damoota Soore Allaanan beettiya Wolaytta buqura soho: Bushaashe so asay dichchidi naagidinne puulayidi keexxido zannaqa soho. Nuuni muuzeeme, erizort woykko zannaqa soho xalla gidokko; nuuni oyddu yeletaara kanttidi yiida issi keetta asa buqurappe attin.",
      // EN: The name Bushaashe (sometimes written Bushashe) is a family name, and today it is also known across Wolaita as the name of a cultural landmark.
      name: "'Bushaashe' (issi issitoo 'Bushashe' geetettidikka xaafettees) giya sunttay issi keettaa asaa suntta gididi ha wodiyan Wolaytta giddo ubbasan issi soho suntta gididi erettees.",
      // EN: What began as a family homestead, with its trees, houses, animals, and traditions, has grown into a place where the whole world can come and experience the depth, beauty, and wisdom of Wolaita culture.
      p2: "Issi wode mittatuura, keettatuura, mehetuuranne wogatuura issi keettaa asay de'iyoosa gididaagee, hachchi alamee mulee yiidi Wolaytta wogaa loyttidi, puulaaninne eran meezetiyoo soho gidiis.",
      // EN: From our cultural houses and ancient trees, to the reading place, oral histories, traditional food, and guesthouse: every element of Bushaashe Garuwa exists to honor the past, celebrate the present, and protect the future of Wolaita heritage.
      p3: "Nu wogaa keettatuppenne mayzza wode mittatuppe doommidi nabbabiyo sohuwa, doonaa haydaa, wogaa qumaanne imattay aqiyoo keettaa gakkanawu: issi issi Bushaashe Garuwan de'iyaabay nu aadhdhida taarikiya bonchchanawu ha\"i nu gakkosan galatanawunne Wolaytta sinttanaa buquraa naaganaassa.",
      // EN: Bushaashe Garuwa is also a gathering place for the region: it hosts cultural celebrations, including the eve of Gifaataa, the traditional New Year festival of the Wolaita people.
      festival: "Qassikka, Bushaashe Garoy shiiqo sohuwa: Wolaytta asaa ooratta layttaa baalaa gidida, Gifaataa, malatiyaanne hara cora ufayssa baalata bonchchiyoosa gidiis.",
      // EN: Generations
      generations: "Yeletata",
      // EN: Years of Heritage
      years: "Buquraa Wodiya",
      // EN: Since the 18th century
      since: "18ntto Xeetu Layttaappe doommidi",
    },
    purpose: {
      // EN: Our Purpose
      eyebrow: "Nu Halchchoy",
      // EN: Mission & Vision
      title: "Kiitaa & Wode Aymuwaa",
      // EN: Our Mission
      missionLabel: "Nu Kiitaa",
      // EN: To Honor, Preserve, and Share the Living Heritage of Wolaita
      missionTitle: "Wolaytta buquraa bonchchiyoogaa, naagiyoogaanne haraatuyyoo shaakkiyoogaa.",
      // EN: Our mission is to preserve and celebrate the cultural, historical, natural, and oral heritage of the Wolaita people, and to make that heritage accessible, meaningful, and alive for every generation.
      missionP1: "Nu kiitay Wolaytta asaa wogaa, hayda, meretanne doona buqurata naagiyoogaanne bonchchi wottiyoogaa; qassikka ha buquraa yeleta ubbawu gakkiya, birshshettay diyoonne xayennaagaa oottidi takettiyoogaa.",
      // EN: We do this through authentic cultural experiences, a living heritage site, oral histories, traditional food, community engagement, and education, all grounded in the spirit of our ancestors and the warmth of Wolaita hospitality.
      missionP2: "Hagaakka oottiyoy tumu wogaa meezetun, paxa buqura sohotun, doonaa haydatun, wogaa qumatun, dere asay shaakkiyoobatuuninne timirttiyaana; ha ubbaykka nu aawatu ayyaanaaninne Wolaytta imatta mohuwaa ho\"u baasettidaageeta.",
      // EN: Our Vision
      visionLabel: "Nu Wode Aymuwaa",
      // EN: Wolaita Heritage Celebrated by Ethiopia and the World
      visionTitle: "Toophphiyaaninne Alamiyan Bonchchettida Wolaytta Asaa Buquraa",
      // EN: We envision Bushaashe Garuwa as the leading cultural heritage destination of Southern Ethiopia, a place recognized nationally and internationally as a model of authentic heritage preservation, community pride, and cultural tourism done with integrity.
      visionP1: "Nu amoykka Bushaashe Garoy Tohossa Toophphiyaa giddon wogaa buqura sohotuppe sintta xeera gidana mala; qassikka tumu buqura naaguwan, deriya otorssiyoogaaninne xillotettan polettiya zannaqa soho gidiyoogan Toophphiyaa yuushuwaaninne Alamiyaa yuushuwan leemisodan erettidaagaa gidana mala",
      // EN: We envision a future where every child in Wolaita knows their heritage, where researchers and travelers come from around the world to experience it, and where the wisdom of our ancestors continues to shape the lives of generations yet to come.
      visionP2: "Wolayttan de'iyaa issi issi naati bantta buquraa eriyoo, alamiyaa gaxaappe yiida pilgiyaageetinne qariyaageeti meezetiyoonne nu mayzza aawatu eray sinttaara biron yaana diyaa yeletaa de'uwaa giigissiiddi biyoo sinttaa gidana mala wodenaassi amottoos.",
      tags: [
        // EN: Authentic
        "Xillotaa",
        // EN: Educational
        "Tamaarissiyaa",
        // EN: Community-led
        "Deriyan kaaletettiyaa",
        // EN: Sustainable
        "Wodenawu de'iyaa",
        // EN: Celebrated
        "Bonchchettiyaa",
      ],
    },
    values: {
      // EN: What Guides Us
      eyebrow: "Nuna Kaalettiyaabati Aybee",
      // EN: Our Values
      title: "Nu Isseeteti",
      items: {
        authenticity: {
          // EN: Authenticity
          title: "Xillotettaa",
          // EN: We present Wolaita heritage exactly as it is, without performance, without distortion. Every story we tell, every tradition we share, every experience we offer is rooted in lived truth.
          desc: "Wolaytta buquraa gujjennan denttennan, malatissoy baynnaaninne geellayennan attan besseettes. Nu yootiyoo issi issi taarikee, issi issi wogaynne issi issi meezee de'ido tuman baasettidaagaa",
        },
        respect: {
          // EN: Respect
          title: "Saaphuwaa",
          // EN: We hold our ancestors, their knowledge, and their way of life in the highest regard. Visitors are welcomed as guests into a living heritage, and we ask that this respect is shared.
          desc: "Nu aawata, etu eraanne etu de'uwaa maaraa gita bonchchuwan oyqqeettes. Xomoosiyaageeta ha buquraa sohuwa boossuwan mokki ekkiiddi ha bonchchuwaakka shaakkana mala oychcheettees.",
        },
        preservation: {
          // EN: Preservation
          title: "Naagiyoogaa",
          // EN: We believe that what is not preserved is lost. Our oral history collection and heritage site exist so that future generations inherit what past generations built.
          desc: "Naagi oyqqennabi xayiyoogee attenna giidi ammaneettes. Nu maxaafa keettati, doona haydatinne buqura sohoti naagettiyoy yiya yeletati kase yeletati giigissidobaa laattana mala giyoogaana.",
        },
        continuity: {
          // EN: Continuity
          title: "Sinttawu efuwa",
          // EN: Heritage is not a museum piece. It is a living practice. We actively pass Wolaita knowledge, traditions, and culture to the next generation through education, experience, and community.
          desc: "Buqura giyoobay muuzeeme miishsha gidenna; paxa meezeppe attin. Wolaytta eraa, meeziyaanne wogaa shemppennan kaalliyaa yeletawu luxettaa, meeziyaanne dere asaa baggaara aatteettes.",
        },
        hospitality: {
          // EN: Hospitality
          title: "Imatta Mohaa",
          // EN: In Wolaita culture, a guest is a blessing. Every visitor to Bushaashe Garuwa is received with genuine warmth, care, and the spirit of community that defines our people.
          desc: "Wolaytta wogan imattoy anjjo. Bushaashe Garuwa yiya ay imattinne tumu ufayssan, yaynuwaaninne deriya ufayssa mohan mohettees; hageetikka nu asaa eeshshaa qonccissiyaageeta.",
        },
        education: {
          // EN: Education
          title: "Tamaarissiyoogaa",
          // EN: Knowledge shared is knowledge multiplied. We welcome schools, universities, researchers, and curious visitors to learn from the depth of Wolaita heritage and history.
          desc: "Issoy issuwawu shaakkido eray dari dari bees. Luxetta keettata, Yunbberestteta Pilggiyaageetanne eraa koyyiyaa dumma dumma imattata Wolaytta buquraanne haydaappe ciimman tamaarana mala shoobbeettes.",
        },
      },
    },
    lineage: {
      // EN: The Family Line
      eyebrow: "So Asaa Yeletaa Yafaraa",
      // EN: From Bushaashe to Today
      title: "Bushaasheppe doommidi Hachchi gakkanawu",
      // EN: Bushaashe Garuwa bears the name of Bushaashe, the first father of this line. His story continued through Alambo and Garedew, and lives on today in the family that cares for the grounds. Choose a name to read their history.
      desc: "Bushaashe Garoy ha so asaa yeletaa yafaran koyro aawa gidida Bushaashe sunttan xeesettes. A taarikee Alambbanne Garedewura kanttida, hachchi qassi gibbiyaa kaalli xeelliyaa keettaa asatun de'ees. Etu taarikiyaa nabbabanawu sunttaa doorite.",
      // EN: The family is writing this history now. It will be published here soon.
      pending: "So asay ha taarikiyaa xuufiyan giigissiiddi de'oosona. Mata wodiya wuriyoode hagan wottana.",
      // EN: The Children of Bushaashe
      childrenTitle: "",
      // EN: The Generations Before Bushaashe
      ancestorsTitle: "",
      children: [
        // EN: Anano
        "",
        // EN: Betalo
        "",
        // EN: Ch'afan
        "",
        // EN: Alambo
        "",
        // EN: Tero
        "",
        // EN: Biramo
        "",
        // EN: Mrs. Bote
        "",
        // EN: Sundado
        "",
        // EN: Embele
        "",
      ],
      ancestors: [
      ],
      people: {
        bushaashe: {
          // EN: Bushaashe
          name: "Bushaasha",
          // EN: First generation · The founder
          generation: "Koyro Yeletaa · Baasidaagaa",
          // EN: 18th century
          period: "18ntto Xeetu Layttaa",
          // EN: Long before visitors came to walk its paths, there was Bushaashe, and this place still carries his name. From his forefathers he received more than land. He received a way of life: the houses they built, the trees they planted, the words, the songs and the customs of Wolaita. In a time when such things could easily have slipped away, Bushaashe held them close. He was a strong man and a steadfast keeper of culture, and under his hand the grounds we now call Bushaashe Garuwa were tended, protected and kept whole. Yet his greatest work was not only what he kept, but whom he taught. Around him grew a large family, and to each of his children he gave the same lesson: what our fathers left us is not ours to lose. Keep it. Live by it. Carry it forward. When the time came, Bushaashe placed the land in the hands of his son Alambo, not as a gift alone, but as an adera: a sacred trust, to guard the place, to honour the forefathers and to hand it on whole. Every generation since has lived by that trust, and every visitor who walks through the gate today walks into its story.
          story: "",
        },
        alambo: {
          // EN: Alambo
          name: "Alambba",
          // EN: Second generation
          generation: "Naa\"antto Yeletaa",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
        garedew: {
          // EN: Garedew
          name: "Garedew",
          // EN: Third generation
          generation: "Heezzantto Yeletaa",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
        current: {
          // EN: The Current Generation
          name: "Hachchi Yeletaa",
          // EN: Today · Commissioner Fiseha Garedew and family
          generation: "Hachchi · Komishineeriyaa Fiseha Garedewnne A soo asaa",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
      },
    },
    offer: {
      // EN: What We Offer
      eyebrow: "Nu Immiyoobati",
      // EN: Everything in One Living Destination
      title: "Ubbaykka Issi Sohuwan",
      items: {
        // EN: Cultural Houses
        houses: "Wogaa Keettata",
        // EN: Heritage Trees
        trees: "Laata Mittata",
        // EN: Artifacts
        artifacts: "Buqurata",
        // EN: Cultural Performances
        performances: "Wogaa Giigissota",
        // EN: The reading place
        reading: "Nabbabbiyoo sohuwaa",
        // EN: Traditional Food
        food: "Wogaa Qumaa",
        // EN: Coffee Ceremony
        coffee: "Tukkiyaa uyiyoo Makkisuwa",
        // EN: Guesthouse
        guesthouse: "Imatta Keettaa",
        // EN: Music & Dance
        music: "Yettaa & Durssaa",
        // EN: Oral Histories
        stories: "Doonaa Haydata",
      },
    },
    cta: {
      // EN: Bushaashe Garuwa is open to all who wish to experience, learn from, and celebrate the living heritage of Wolaita.
      desc: "Bushaashe Garoy Wolaytta de'iyaa buquraa be'anawu, appe tamaaranawunne an ufayttanawu koyiyaa ubbawu dooya.",
    },
  },
};

export default page;
