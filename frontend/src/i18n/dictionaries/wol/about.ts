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
      // EN: Bushaashe Garuwa is also a gathering place for the region: it hosts cultural celebrations, including the eve of “Gifaataa”, the traditional New Year festival of the Wolaita people.
      festival: "Qassikka, Bushaashe Garoy shiiqo sohuwa: Wolaytta asaa ooratta layttaa baalaa gidida, Gifaataa, malatiyaanne hara cora ufayssa baalata bonchchiyoosa gidiis.",
      // EN: Generations
      generations: "Yeletata",
      // EN: Years of Heritage
      years: "Buquraa Wodiya",
      // EN: Since before the 18th century
      since: "",
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
      // EN: Bushaashe Garuwa bears the name of Bushaashe, who kept the land and the ways of the forefathers who came before him. His story continued through Alambo and Garedew, and lives on today in the family that cares for the grounds. Choose a name to read their history.
      desc: "Bushaashe Garoy banttappe kase de'ida aawato biittaanne wogaa naagidi takettida Bushaashe sunttan xeesettees. Eta taarikee Alambbooninne Garedewun kaallidi yiidi hachchi gibbiyaa naagiyaa so asan paxa gididi de'ees. Eta taarikiyaa nabbabanawu sunttaa dooridi.",
      // EN: The family is writing this history now. It will be published here soon.
      pending: "So asay ha taarikiyaa xuufiyan giigissiiddi de'oosona. Mata wodiya wuriyoode hagan wottana.",
      // EN: Tap a name to read the story.
      hint: "",
      // EN: Read the full story
      readMore: "",
      // EN: Show less
      readLess: "",
      // EN: Read the family history
      open: "",
      // EN: The Children of Bushaashe
      childrenTitle: "Bushaashe Naata",
      // EN: The Generations Before Bushaashe
      ancestorsTitle: "Bushaasheppe Kase Yeletata",
      children: [
        // EN: Anano
        "Anano",
        // EN: Betalo
        "Beetalo",
        // EN: Ch'afan
        "Cafan",
        // EN: Alambo
        "Alambbo",
        // EN: Tero
        "Teero",
        // EN: Biramo
        "Biramo",
        // EN: Mrs. Bote
        "W/ro Bote",
        // EN: Sundado
        "Sundado",
        // EN: Embele
        "Embele",
      ],
      ancestors: [
      ],
      people: {
        bushaashe: {
          // EN: Bushaashe
          name: "Bushaasha",
          // EN: The place bears his name
          generation: "Sohoy eta sunttan xeesettees",
          // EN: 
          period: "",
          // EN: Long before visitors came to walk its paths, there was Bushaashe, and this place still carries his name. From his forefathers he received more than land. He received a way of life: the houses they built, the trees they planted, the words, the songs and the customs of Wolaita. In a time when such things could easily have slipped away, Bushaashe held them close. He was a strong man and a steadfast keeper of culture, and under his hand the grounds we now call Bushaashe Garuwa were tended, protected and kept whole. Yet his greatest work was not only what he kept, but whom he taught. Around him grew a large family, and to each of his children he gave the same lesson: what our fathers left us is not ours to lose. Keep it. Live by it. Carry it forward. When the time came, Bushaashe placed the land in the hands of his son Alambo, not as a gift alone, but as an adera: a sacred trust, to guard the place, to honour the forefathers and to hand it on whole. Every generation since has lived by that trust, and every visitor who walks through the gate today walks into its story.
          story: "Hachchi imattati yiidi ogeta yedhdhanaappe daro layttatuppe kase, Bushaashe de'idosona; ha sohoy hachchi gakkanawu eta sunttaa tookkidi de'ees.\n\nEti bantta aawatuppe ekkidoy biitta xalla gidenna. De'iyoo ogiyaakka ekkidosona: eti keexxido keettata, eti tokkido mittata, Wolaytta qaalata, yettatanne meezeta ekkidosona. Hagaa malabay eesuwan dogettana danddayiyoo wodiyan, Bushaashe mintti oyqqidosona. Bushaashe minonne wogaa minttidi naagiyaa aawa; hachchi nu Bushaashe Garuwa giyo sohoy eta kushiyan saaphotidi, naagettidinne paccennan de'iis.\n\nEta gita oosoy eti naagidobaa xalla gidenna; oona tamaarissidaakkonneppe attin. Eta yuushuwan gita keettaa asay dicciis; bantta issi issi naatussi issi mala timirttiya immidosona: nu aawati immobay nu xayssana koshshiyooba gidenna. Naagite; an de'itenne; kaalliyaa yeletawu aattite.\n\nWodee gakkin he sohuwaa Bushaashe bantta na'awu Alambbossi shedhdhidosona. Immidoykka imotadan xalla gidennan hadaradanppekka attin. Hegeekka sohuwaa naagana mala, aawata bonchchana malanne pacissennan kaalliyaa yeletawu shedhdhiyoogaa. He wodeppe doommidi issi issi yeletay he hadaran de'iis. Hachchi ha penggiyaara geliyaa issi issi imattaykka he taarikiyaakko gelees.",
        },
        alambo: {
          // EN: Alambo
          name: "Alambba",
          // EN: Son of Bushaashe · Received the trust
          generation: "Bushaashe na'aa · Hadaraa ekkidaagaa",
          // EN: 
          period: "",
          // EN: Alambo, son of Bushaashe, received from his father both the land and its history, and with them the culture of Wolaita. He was a great father, who gave his life to keeping that inheritance whole and passing it on to the generations after him. His faithfulness was tested. In the days of Emperor Haile Selassie, Alambo was imprisoned in Addis Ababa, and there he remained for six years. After six years he was brought before the Emperor himself to plead his case. He spoke boldly, and it was said that he had defied the King. He was sentenced to six more years, and taken from Addis Ababa to Wollo, to be held at Were Ilu. Twelve years in all, far from Wolaita and from the grounds he had promised to keep. Yet he was never forgotten at home: through all those years his son Garedew walked the long roads to see him. Alambo had six children, two daughters and four sons, and Garedew was one of them. Because Garedew had come to him again and again through his years in prison, Alambo called him “my son who has done me great kindness”, and to him he gave the place in trust. He taught Garedew that the history must be guarded, that the culture of Wolaita must be kept, and that what is handed to the next generation must be whole and true to the ways of Wolaita. So the adera that Alambo had received from Bushaashe passed, faithfully, into Garedew's hands.
          story: "Bushaashe na'aa Alambboy, bantta aawaappe biittaa, taarikiyaanne Wolatta wogaa laattidosona. He laataa pacissennan naagidi kaalliyaa yeletawu aattanawu bantta de'uwaa immida gita aawa.\n\nEta ammanoy paacettiis. Atse Hayle Sillaase wode, Alambboy Tunggan usuppun layttaa qashettidosona. Usuppun layttaappe guyyiyan bantta yohuwaa odanawu kawuwaa sintti shiiqidosona. Kawuwaara xalidi yayennan palamettidosona. Hegaa gishshawu «Kawuwaa bollan Xaliis» geetettidi gujo usuppun layttawu Tunggappe Wollo efin Were Iillun qashettidosona.\n\nMuleera tammanne naa\"u layttaa Wolayttappenne bantta naagana giidi qaalaa gelido sohuwaappekka haakkidi de'idosona. Gidoppe attin, bantta soo asan dogettibookkona; he layttatun etu na'ay Garedewu bantta aawaa be'anawu adussa ogeta tohuwan hemettidosona.\n\nAlambboyyoo naa\"u macca naatinne oyddu attuma naati de'oosona; Garedewukka etappe issuwaa. Alambboy qashettido wodetun Garedewu eta zaari zaaridi oychchido gishshawu, Alambboy \"tawu gitabaa oottida ta na'awu\" giidi sohuwaa hadaran immidosona. Taarikiyaa naagana koshshiyoogaadan, Wolaytta wogaa gam\"ettana koshshiyoogaadan, kaalliyaa yeletawu giigidanne Wolaytta wogaa oyqqida laataa aattana koshshiyoogaadan tamaarissidosona.\n\nHagaadan oottidi Alambboy Bushaasheppe ekkido hadaraa tumatettan Garedewuyyoo aattiis.",
        },
        garedew: {
          // EN: Garedew
          name: "Garedew",
          // EN: Son of Alambo
          generation: "Alambbo Na'aa",
          // EN: Ethiopian calendar 1898 – 1997 (1905/06 – 2004/05)
          period: "1997 M.L. hayqqidosona",
          // EN: Garedew was Alambo's beloved son, and the long years of his father's imprisonment showed what kind of son he was. When Alambo was held in Addis Ababa, no cars ran on the road from Wolaita. Garedew went on foot. He walked for a whole day, stopped for the night in Silte, and reached Addis Ababa on the second day. Again and again he made that journey to visit his father. When Alambo was taken to Were Ilu in Wollo, the road grew longer still. Garedew walked it too, sleeping along the way, and for the journey he made and sewed his own shoes by hand. He never went empty-handed. He carried money north and came home with mules to sell in Wolaita, for the family were mule traders too. His love for his father and his work for his family travelled the same road. In gratitude, Alambo placed the land in Garedew's hands as an adera, and Garedew made it flourish. It was he who planted the zigba trees that still stand in a long, even line across Bushaashe Garuwa, like a peaceful procession. Each was set in its place by measure, and to help them grow strong he brought water from the river to water them. He did not plant them for his family alone. The open field lay beside the road, and Garedew wanted travellers tired from the way to be able to come in and rest in the zigba's shade. That was the kind of father he was: always thinking beyond himself. Garedew married eight wives. With his eighth wife he had six children, two sons and four daughters. Today it is Garedew's children who care for Bushaashe Garuwa and make it flourish, so that the culture of Wolaita, the trust of the fathers and the work of those who came before may go on. Garedew passed away in 1997 in the Ethiopian calendar (2004/05), leaving the line of zigba trees, and the trust, to his children.
          story: "Garedewu Alambboy keehippe dosiyoo na'a. Eta aawaa qasho keettan aattido layttati eti aymala na'akkonne bessidosona.\n\nAlambboy Tunggan qashettido wode Wolayttappe biyaa kaamee deenna. Garedewu gediyan biidosona. Gallassaa muliyaa hemettidi, Silxxen aqidi, naa\"antto gallassan Tungga gakkidosona. Bantta aawaa oychchanawu he adussa ogiyaa zaari zaaridi hemettidosona.\n\nAlambboy Wollo Were Iillu biiyoorin ogee yaa aduqqiis. Garedewu he ogiyaakka bantta ogiyan hemettidosona; ogiyan aqidosona. Hemetawu haniyaa caammaa bantta kushiyan sikkidi wottoosona.\n\nMela kushe bi erokkona. Eta so asay baquluwaa zal\"anchchay gidiyoo gishshay, miishshaa oyqqidi huuphessa baggi biidi Wolayttan bayzziyoo baqulota shammi ekkidi simmoosona. Bantta aawaassi de'iyaa siiqoynne bantta so asaassi oottiyoo oosoy issi ogiyan issippe hemettidosona.\n\nAlambboy sohuwaa hadaran immidosona; Garedewukka aacissidosona. Hachchi Bushaashe Garuwaa adussa sitta yafaran eqqida zigaa mittata tokkidaykka eta. Issoy issoy maaran likettidi ba sohuwaa oyqqiis; mittati loyttidi diccana mala shaafaappe haattaa ehi ehidi ushshoosona.\n\nEti tokkidoy coo mitta xalla gidenna. Ogiyan aaho dembbay de'iyoo gishshawu hemetan daafuridi yiyaa ogiyaaway gelidi Zigaa kuwan shemppana mala giidi qoppidi oottidosona. Banttappe aadhdhidi haraatussikka qoppiya hagaa mala asa.\n\nGaredewu hosppun macca asaa ekkidosona. Hosppuntteeppe naa\"u attuma naatunne oyddu macca naata, muleera usuppun naata, yelidosona. Wolaytta wogay, aawatu hadaraynne kase aawatu oosoy sinttawu kaallana mala, hachchi Bushaashe Garuwaa kaalli xeelliyaynne dichciyay Garedewu naata.\n\nGaredewu Zigaa yafaraanne hadaraa bantta naatussi immidi, 1997 M.L. ha alamiyaappe hayquwan shaakettidosona.",
        },
        current: {
          // EN: The Current Generation
          name: "Hachchi Yeletaa",
          // EN: Today · Commissioner Fiseha Garedew and family
          generation: "Hachchi · Komishineeriyaa Fiseha Garedewunne A soo asaa",
          // EN: 
          period: "",
          // EN: The trust has now come to the children of Garedew. They hold in honour what their fathers left them: the adera, the culture of Wolaita, and the knowledge and ways by which the people of Wolaita lived for generations. Their aim is simple and great at once: that all of this should live on in this place, and pass whole to the generations still to come. Their fathers taught them so. Again and again the words were spoken: guard this place. It holds the history, the culture and the civilisation of Wolaita. Keep it with honour, as you received it from us, and hand it on, prepared and whole, from generation to generation. So they build with care. Beside the zigba trees their father planted, they plant more zigba and other trees. Onto the grounds they have brought the traditional houses of Wolaita, its traditional clothing, its spices and the treasures of its culture: the things that tell of Wolaita's knowledge, history and civilisation. What has grown here is not a museum, and the family would never call it one. It is Bushaashe Garuwa: beautiful to look at and good to stay in, a place where visitors come to see, to linger and to take part, and where programmes and gatherings fill the grounds with life. From Bushaashe to Alambo, from Alambo to Garedew, and from Garedew to his children, the same word has passed from hand to hand. Today it is kept with diligence, so that one day it may be handed on again.
          story: "Hadaray ha\"i Garedewu naata gakkiis. Bantta aawati etawu aggidi biido hadaraa, Wolaytta wogaanne eraanne Wolaytta asay daro yeletatuyyoo de'ido ogiyaa bonchchuwan oyqqidosona. Eta halchchoy laafabakka gitabakka. Hegeekka, ha ubbabay ha sohuwan paxa de'ana malanne paccennan kaalliyaa yeletawu aadhdhana mala.\n\nHegaa gishshatawu akeekan dichchiiddi de'oosona. Eta aaway tokkido zigatu matan hara guzo zigata tokkoosona. Wolaytta eraa, taarikiyaanne dichchaa haasayiyaa Wolaytta wogaa keettata, maayota, qimaametanne buqurata eta sohuwaa gelissidossona.\n\nHachchi diccidabay muuzeeme gidenna; so asaykka muuzeeme giidi xeesenna. Bushaashe Garuwaa geetettees: ayfiyawu xeellanawu lo\"iyaa, hegan takkanawu ufayssiyaa, xomoosiyaageeti be'anawu, takkanwunne issi bolla gidanawu yiyoo, dumma dumma giigissotinne shiiqoti gibbiyawu de'oy daanaadan oottiyoo soho.\n\nBushaasheppe Alambbokko, Alambboppe Garedewukko, Garedewuppe qassi A naatussi, issi qaalay, kushiyaappe kushiyawu aadhdhiiddi yiis. Hachchi issi galla haranttuwa shedhdhettana mala danaddayan naagettees.",
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
