import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Home page
 * See it on the site: /
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  home: {
    hero: {
      // EN: Bushaashe Garuwa
      title: "Bushaashe Garuwa",
      // EN: Where Wolaita Culture, Traditions & Heritage Live On.
      subtitle: "Wolaytta Wogay, Mayzza Eeshshaynne Buquray De'iyoosaa.",
      // EN: Honoring Our Ancestors,
      sloganA: "Nu Mayzza Aawata Bonchchiyoogaa,",
      // EN: Preserving Our Heritage,
      sloganB: "Nu Buquraa Naagiyoogaanne",
      // EN: and Passing It On to Future Generations.
      sloganC: "Yeletaappe Yeletawu Aattiyoogaa.",
      // EN: Explore Bushaashe Garuwa
      explore: "Xeella",
      // EN: Scroll to Explore
      scroll: "Xeellanawu Pude Suga",
      // EN: Slide {n}
      slide: "Sinttaa {n",
      // EN: Generations
      statGenerations: "Yeletata",
      // EN: Years of heritage
      statYears: "Buqura Layttata",
      // EN: Since the 18th century
      sinceCentury: "18tto Xeetu Layttaappe Doommidi",
      // EN: WOLAITA · HERITAGE · NATURE · CULTURE · 
      badge: "WOLAYTTA · BUQURAA · MERETAA · WOGAA",
      // EN: Next photograph
      next: "Kaalliyaa Misiliya",
      // EN: A family heritage place in Damot Sore, near Gununo, kept for four generations.
      lead: "Daamoota Sooren, Gununo matan, de'iya oyddu yeletaassi naagettida so asa buqura sohuwa.",
      // EN: Walk the land of our forefathers
      walk: "Nu aawatu biittan hemettite",
      // EN: Book Your Stay
      book: "Ne Sohuwa Oyqqa",
      // EN: Explore Our Heritage
      heritage: "Nu Buquraa Xeella",
      // EN: Nature sounds
      sound: "Meretaa giires",
    },
    testimonials: {
      // EN: Guests
      eyebrow: "Imattata",
      // EN: What Our Guests Say
      title: "Nu Imattati Giyoobaa",
    },
    film: {
      // EN: Watch
      eyebrow: "Be'a",
      // EN: A Film of Bushaashe Garuwa
      title: "Bushaashe Garuwa Pilmiya",
      // EN: A short walk through the grounds, the cultural houses and a Gifaataa celebration.
      desc: "Gade giddon, meesho keettatanne Gifaataa bonchcho sohuwan qantta hemetaa.",
      // EN: Play the film
      play: "Pilmiya Dooya",
    },
    ring: {
      // EN: Step inside
      eyebrow: "Giddo gela",
      // EN: Turn the grounds in your hand
      title: "Gibbiya intte kushiyan yuushshiiddi be'ite.",
      // EN: Drag the photographs to walk around Bushaashe Garuwa.
      desc: "Bushaashe Garuwa yuushuwaa yuuyyanawu, misileta goochchite.",
      // EN: Turn to the previous photograph
      previous: "Kasa misiliyawu dooya",
      // EN: Turn to the next photograph
      next: "Kaalliya misiliyawu dooya",
      // EN: Open the gallery
      cta: "Misiliya Keettaa Dooya",
      // EN: Drag, swipe, or use the arrows
      hint: "Goochchite, pittite woykko qestte malaataa go'ettite",
    },
    quick: {
      // EN: Find your way
      eyebrow: "Intte ogiya demmite",
      // EN: Everything at Bushaashe Garuwa
      title: "Beshaashe Garuwan de'iyaa ubbabaa",
      // EN: Every part of Bushaashe Garuwa, one step away.
      desc: "Bushaashe Garuwan diyaa ubbabaa, issi tangguwan.",
      items: {
        // EN: Cultural houses, ancient trees and the family story.
        heritage: "Mesho keettata, beni mittatanne so asaa taarikiya.",
        // EN: Food, coffee, music, dance and guided tours.
        experiences: "Qumaa, tukkiya, yettaa, durssaanne kaaleta hemeta.",
        // EN: Cultural food evenings twice a month, and Gifaataa.
        events: "Aginan naa\"utoo qumaa omarssata; Qasskikka Gifaataa bonchchuwaa.",
        // EN: A guest house among the gardens. Coming soon.
        stay: "Ataakiltte sohotun imatta kifiliya. Mata wodiyan...",
        // EN: Wolaita and Ethiopian dishes, cooked with care.
        dine: "Xinqqaaqiya giigida Wolayttanne Toophphiya qumata.",
        // EN: Opening hours, directions and booking a visit.
        visit: "Dooyettiyoo saateta, ginatanne xomoosanawu bootaa oytuwa.",
        // EN: The grounds, the houses and the celebrations in photos.
        gallery: "Gadiya, keettatane and ufayssata misiletun",
        // EN: Who we are and why we keep this place.
        about: "Nu oonakkonne ayssi ha sohuwaa naagiyaakko.",
      },
    },
    marquee: [
      // EN: Heritage
      "Buquraa",
      // EN: Nature
      "Meretaa",
      // EN: Culture
      "Wogaa",
      // EN: Food
      "Qumaa",
      // EN: Gifaataa
      "Gifaataa",
      // EN: Stay
      "Takettaa",
    ],
    facts: {
      items: [
        {
          // EN: 18th c.
          value: "18tto XL.",
          // EN: Where the story begins
          label: "Taarikiya dendduwa",
        },
        {
          // EN: 4+
          value: "4+",
          // EN: Generations of the family
          label: "Keettaasaa yeletata",
        },
        {
          // EN: 2
          value: "2",
          // EN: Traditional Wolaita houses
          label: "Beni Wolaytta keettata",
        },
        {
          // EN: 1,800+
          value: "1,800+",
          // EN: Coffee trees on the grounds
          label: "Gaden de'iyaa tukke mittata",
        },
        {
          // EN: 2
          value: "2",
          // EN: Cultural food evenings a month
          label: "Aginan aginan qumaa miyo omaarssata",
        },
      ],
    },
    intro: {
      // EN: Our Purpose
      eyebrow: "Nu Halchchoy",
      // EN: More Than a Destination
      title: "Sohoppe Kanttees",
      // EN: Bushaashe Garuwa is a living Wolaita heritage destination, where generations of history, culture, and knowledge meet the warmth of genuine hospitality.
      p1: "Bushaashe Garoy \"paxa de'iyaa\" Wolaytta buqura soho; yeletatu taarikee, wogaynne eray tumu gita ufayssan imattaa mohuwara issippe diyoossaa. ",
      // EN: We are not a museum. We are a living family heritage that welcomes visitors to become part of our ongoing story. From cultural houses to the reading place in the gardens, from traditional food to oral histories, Bushaashe Garuwa is an experience unlike any other in Ethiopia.
      p2: "Nuuni muuzeeme gidokko. Xomoosiyaageeti nu kaalliya taarikiya bolla gidana mala shoobbiya \"paxa de'iyaa\" so asaa buqurappe attin. Meesho keettatuppe biidi nabbabbiyoo sohota gakkanawu, wogaa qumaappe biidi nu doona taarikiyaa gakkanawu, Bushaashe Garoy Toophphiyan de'iya haraatuppe dummatiya soho.",
      pillars: [
        // EN: Heritage
        "Buqura",
        // EN: Nature
        "Mereta",
        // EN: Culture
        "Wogaa",
        // EN: Hospitality
        "Imattaa Mohuwa",
      ],
      // EN: Generations
      generations: "Yeletata",
    },
    explore: {
      // EN: Four Worlds in One Place
      eyebrow: "Oyddu Alameti Issis Sohuwan",
      // EN: Explore Bushaashe Garuwa
      title: "Bushaashe Garuwa yuuyi xeellite",
      cards: {
        heritage: {
          // EN: Heritage
          title: "Buqura",
          // EN: History, family generations, cultural houses and artifacts
          sub: "Taarikiya, so asaa yeletata, meesho keettatanee buqurata",
        },
        nature: {
          // EN: Nature
          title: "Mereta",
          // EN: Trees, plants, animals and the living landscape
          sub: "Zaafeta, Dozata, Medoosatanne mereta",
        },
        culture: {
          // EN: Culture
          title: "Wogaa",
          // EN: Food, music, dance, clothing and living traditions
          sub: "Qumaa, Yettaa, Durssaa, Qumaashshaanne de'iya wogata",
        },
        hospitality: {
          // EN: Hospitality
          title: "Imatta Mohuwa",
          // EN: Guesthouse, restaurant, bar and visitor services
          sub: "Imatta Keettaa, Quma Keettaa, Ushsha Keettaanne xomoosiyaagaa haggaaziyoogaa",
        },
      },
    },
    living: {
      // EN: In Every Corner
      eyebrow: "Zuuze Ubban",
      // EN: A Living Heritage
      title: "De'iya Buquraa",
      items: {
        houses: {
          // EN: Cultural Houses
          title: "Meesho Keettata",
          // EN: Gulanttaa Keettaa and Meeshsho Keettaa: two traditional Wolaita houses holding the tools of Wolaita life.
          desc: "Gulanttaa Keettaane Meesho Keettaa: Wolaytta de'uwaa miishshata oyqqida naa'u beni Wolaytta keettata.",
        },
        trees: {
          // EN: Trees, Plants & Orchards
          title: "Mittata, Dozata & Gadiya",
          // EN: Mango, apple, papaya, banana, more than 1,800 coffee trees, enset and fragrant garden plants.
          desc: "Mangguwaa, Appiliyaa, Paapaayiyaa, Muuziyaa, 1800 dariya tukke mittata, Uuttatanne Sawo mittata",
        },
        animals: {
          // EN: Animals & Zoo
          title: "Medoosata & Do'aa Naagiyoosaa",
          // EN: A small zoo of animals kept on the heritage grounds, a favourite with families.
          desc: "Buqura dirssa giddon de'iyanne so asankka keehippe dosettiya do'ata naagiyoo guutta sohuwa",
        },
        artifacts: {
          // EN: Cultural Artifacts
          title: "Wogaa Buqurata",
          // EN: Treasured objects of Wolaita craft, ceremony and daily life.
          desc: "Wolaytta asaa kushe ooso gidida, bonchchone galla galla go'ettiyo al\"o miishshata.",
        },
      },
    },
    timeline: {
      // EN: Our History
      eyebrow: "Nu Haydaa",
      // EN: A Journey Through Time
      title: "Wodiyan Hemettiyoogaa",
      items: [
        {
          // EN: The 1700s
          period: "1700 layttatun",
          // EN: Roots
          label: "Dendduwa",
          // EN: The family's story in the Wolaita highlands begins in the 18th century.
          desc: "So asaa tarikee Wolaytta xoqqa sohotun, 18tto Xeetu Layttaappe doommees.",
        },
        {
          // EN: 1940s
          period: "1940 layttata",
          // EN: First Houses
          label: "Koyro Keettata",
          // EN: Cultural houses built; heritage trees planted.
          desc: "Wogaa keettati keexettidosona; Buqura mittati tokettidosona.",
        },
        {
          // EN: 1970s
          period: "1970 layttata",
          // EN: Preservation
          label: "Naagiyoogaa",
          // EN: Oral histories and artifacts formally documented.
          desc: "Doona taariketinne miishshati wogan xaafettidosona.",
        },
        {
          // EN: 1995
          period: "1995",
          // EN: Oral histories
          label: "Doona Taariketa",
          // EN: Elders recorded, and their stories written down.
          desc: "Cimati nu qofan mazggabettin eta taarikee xaafettiis.",
        },
        {
          // EN: Today
          period: "Ha Wodiyan",
          // EN: Bushaashe Garuwa
          label: "Bushaashe Garuwa",
          // EN: A living heritage destination, open to all.
          desc: "Ubbawu dooya gidida buqura sohuwaa",
        },
      ],
      // EN: Explore Our History
      cta: "Nu Taarikiya Be'a",
    },
    experiences: {
      // EN: Be Part of the Story
      eyebrow: "Nu Taarikiya Bolla Gidite",
      // EN: Experience Wolaita in Bushaashe Garuwa
      title: "Wolaytta Bushaashe Garuwan be'ite",
      items: {
        food: {
          // EN: Traditional Food
          title: "Woga Qumaa",
          // EN: Taste authentic Wolaita dishes prepared with generational recipes.
          desc: "Beni katettan ka'ida Wolaytta tumu wogaa qumata ma be'a.",
        },
        coffee: {
          // EN: Coffee Ceremony
          title: "Tukkiya Makkisuwa",
          // EN: Experience the sacred Ethiopian coffee ritual in its cultural setting.
          desc: "Bonchchettida Toophphiya tukkiya makkisuwa a wogaa hanotan be'ite.",
        },
        performance: {
          // EN: Cultural Performance
          title: "Wogaa ",
          // EN: Watch traditional Wolaita music, song and ceremonial dance.
          desc: "Wolaytta wogaa yettaanne durssaa be'ite.",
        },
        tour: {
          // EN: Heritage Tour
          title: "Buquraa Be'uwaa",
          // EN: Walk through generations of history with an expert guide.
          desc: "Xomoosissiyaa eranchchaara yuuyyiiddi yeletaa taarikiya be'ite.",
        },
        education: {
          // EN: Educational Visit
          title: "Luxetta Keettatu Xomoosuwa",
          // EN: Structured experiences for schools and universities.
          desc: "Luxetta keettatussinne Yunbberstettuyoo giigidaageeta.",
        },
        photography: {
          // EN: Photography Experience
          title: "Pootuwa Dendduwaa",
          // EN: Capture heritage, nature and people in a living landscape.
          desc: "Buquraa, meretaanne asaa pootuwa denttite.",
        },
      },
    },
    events: {
      // EN: Monthly Cultural Events
      eyebrow: "Aginan Aginan Giiigiya Woga Giigissota",
      // EN: Taste Wolaita in Bushaashe Garuwa
      title: "Wolaytta Bushaashe Garuwan be'ite",
      // EN: Experience traditional Wolaita food and culture through our regular cultural food events.
      desc: "Wodiyan wodiyan giigiya wogaa qumaa giigissotun Wolaytta wogaa qumaanne Wogaa be'ite.",
      // EN: All Events
      all: "Ubba Giigissota",
      items: {
        food: {
          // EN: Oct 5, 2026
          date: "Gifaataa 25, 2019",
          // EN: Wolaita Cultural Food Experience
          name: "Wolaytta Wogaa Qumaa Be'uwaa",
          // EN: Traditional dishes, coffee ceremony, music and storytelling around the fire.
          desc: "Wogaa qumata, tukkiya makkisuwa, yettaanne tamaa matan shiiqidi haysiya yootiyoodaa.",
          // EN: Limited spaces
          avail: "Amara sohota",
        },
        harvest: {
          // EN: Oct 19, 2026
          date: "Gooluwaa 9, 2019",
          // EN: Harvest Heritage Evening
          name: "Cahaa Wodiya Omarssata",
          // EN: Celebrate the harvest with traditional food, dance and elder storytelling.
          desc: "Kattaa shiishshiyoo wodiya wogaa quman, durssaaninne cimati haysiya yootiyoosan bonchchite.",
          // EN: Open
          avail: "Dooya",
        },
      },
    },
    culturalFood: {
      // EN: Twice every month
      eyebrow: "Aginan naa\"utoo",
      // EN: The Cultural Food Event
      title: "Wogaa Qumaa Makkisuwa",
      // EN: Twice a month Bushaashe Garuwa opens its cultural houses for an evening of traditional Wolaita food, coffee, music and storytelling. Reserve your place and join us.
      desc: "Aginan naa\"utoo Bushaashe Garoy Wolaytta qumaa, tukkiya, yettaanne haysiya odiyoo omarssatuyoo ba wogaa keettata dooyees. Ne sohuwa oyttada nunan gaytta.",
      // EN: Together with {partner}
      partner: "{partner}yaara Issippe.",
      // EN: Next dates
      nextTitle: "Kaalliya gallassata",
      // EN: Reserve your place
      bookCta: "Ne Sohuwa Oytta.",
      // EN: See all events
      allCta: "Ubba Giigissotakka Be'a.",
      // EN: The next dates will be announced here soon.
      soon: "Kaalliya gallassata matan erissana.",
    },
    facilities: {
      // EN: On the Grounds
      eyebrow: "Dirssaappe Soora",
      // EN: Facilities & Services
      title: "Go'ettiyoobatanne Immiyo Haggaazata",
      // EN: Beyond the heritage itself, Bushaashe Garuwa is a place to gather, learn and relax, for families, schools, organisations and travellers.
      desc: "Buquratettappe aadhdhidi, Bushaashe Garoy keettaa asati, luxetta keettati, kawo maabaratinne hemettiyaageeti shiiqiyo, tamaariyoonne allaxxiyoo sohuwa.",
      items: {
        meetingHall: {
          // EN: Meeting Hall
          title: "Yaa'iyoo Keettaa",
          // EN: A hall for meetings, trainings, workshops and community gatherings, with food and coffee served from our kitchen.
          desc: "Yaa'awu, Loohissuwawu, Oottiyoosawunne Deriya Shiiquwawu haniya sohuwaa, Nu kushiinan giigidi shiiqiya qumaanne tukkiyaara.",
        },
        zoo: {
          // EN: Zoo & Animals
          title: "Do'aa Naagiyoosaa & Medoosata",
          // EN: A small zoo where visitors (especially children and school groups) meet the animals kept on the grounds.
          desc: "Xomoosiyaageeti (ubba qeeri naatinne lixetta keetta citati) do'ata be'iyoo xoyta do'ata naagiyoo sohuwa.",
        },
        pool: {
          // EN: Swimming Pool
          title: "Haattaa Wadhdhiyoo Maaqooriyaa",
          // EN: A swimming pool set among the gardens, for guests of the guesthouse and for day visitors.
          desc: "Imatta keettan de'iyaa imattatuyyoonne gallassa xomoosiyaageetuyyoo giigida haattaa wadhdhiyoo eellida haattaa sohuwa.",
        },
        orchard: {
          // EN: Plants & Fruit Trees
          title: "Dozata & Ayfiya Mittata",
          // EN: Mango, apple, papaya and banana trees, more than 1,800 coffee trees, enset, and traditional garden plants with wonderful scents.
          desc: "Mangguwaa, Appiliyaa, Paapaayiyaa, Muuziyaa, 1800 dariya tukke mittata, Uuttaanne dumma dumma sawiya peenoy de'iyoo darkko mittata",
        },
        horses: {
          // EN: Horse Riding
          title: "Paraa Togaa",
          // EN: Horses wait on the great lawn for visitors who would like to ride.
          desc: "Paraa toggana koyyiyaa imattatuyoo giigidi Parati aaho qooruwan naagoosona.",
        },
        crocodile: {
          // EN: Crocodile Pond & Wildlife
          title: "Aazoy diyoo haattaanne Wora Do'ata",
          // EN: A properly fenced crocodile pond and an area where wild animals are cared for.
          desc: "Loytti direttida aazoy diyoosa, qassikka wora do'ata naagiyoo sohuwa.",
        },
        fish: {
          // EN: Fish Pond
          title: "Moliya Oyqqiyoo Maaqooriyaa",
          // EN: A fish pond among the gardens, part of the working life of the grounds.
          desc: "Ataakiltte sohotu giddon de'iyaa moliya oyqqiyoo maaqooriyaa ",
        },
        vip: {
          // EN: VIP Service
          title: "VIP Immiyo Haggaazata",
          // EN: Private rooms for a family: a kitchen to cook in, a dining room, a fireplace and bedrooms.
          desc: "Dumma so asaa kifileta: qumaa kattiyoo kushiinaa, qumaa miyoo kifiliya, tamaa eettiyoosaanne hiixa kifileta. ",
        },
        guesthouse: {
          // EN: Guesthouse
          title: "Imatta Keettaa",
          // EN: A planned service: rooms for an overnight stay inside the heritage site itself. Not open yet.
          desc: "Halchchettidi giigida haggaazaa: qamaa aqanawu giigida sohota. Mata wodiyan doommettees...",
        },
        restaurant: {
          // EN: Restaurant & Bar
          title: "Katta Keettaanne Ushsha Keettata",
          // EN: Wolaita and Ethiopian dishes, traditional drinks and the coffee ceremony, served all day.
          desc: "Wolayttanne Toophphiyaa qumaa, wogaa ushshatinne tukkiyaa makkisoy gallassaa muumiya.",
        },
      },
    },
    stay: {
      // EN: Guesthouse
      eyebrow: "Imatta Keettaa",
      // EN: Stay Within the Story
      title: "Taarikiya Giddon Shemppa",
      // EN: A guest house inside the heritage site is planned, so that visitors can stay overnight. It is not open yet.
      desc: "Xomoosiyaageeti aqana mala buqura soho giddon imattay shemppiyoosay giigi uttiis. Ha\"issawu dooyettiichchibeenna.",
      rooms: {
        standard: {
          // EN: Standard Room
          name: "Dummatiyaa Kifiliya",
          // EN: Cultural touches, private bathroom, garden views.
          desc: "Wogaara erettiyoogaa, buzo bollaa meecettiyoo keettaa, sooppe kare qooruwa dembbawu xeelliyoosaa.",
        },
        family: {
          // EN: Family Room
          name: "Keettaa Asaa Kifiliya",
          // EN: Spacious with private outdoor area and heritage decor.
          desc: "Aawo karee de'iyoo keehippe miginjjettida woykko puulattida buzo sohuwa.",
        },
        heritage: {
          // EN: Heritage Room
          name: "Buqura Kifiliya",
          // EN: Full Wolaita immersion: our most special stay.
          desc: "Wolaytta wogawu giddo gelidi be'iyoogaa: ubbaappekka keehippe dummatiyaa sohuwa.",
        },
      },
      // EN: View Room
      viewRoom: "Kifiliya Be'ite.",
      // EN: Explore Guesthouse
      cta: "Imatta Keettaa Be'a",
    },
    restaurant: {
      // EN: Restaurant
      eyebrow: "Katta Keettaa",
      // EN: Taste the Culture in Bushaashe Garuwa
      title: "Wogaa Bushaashe Garuwan Be'ite",
      // EN: Our restaurant serves authentic Wolaita cuisine alongside Ethiopian classics, every dish rooted in tradition, prepared with care.
      desc: "Nu quma keettay mal\"o Wolaytta qumaa Toophphiya qumaara gattidi issippe giigissees. Issi issi kattay wogaa ogiya kaalliyoogan, daro xinqqaaqiyan ka\"iis.",
      categories: [
        // EN: Wolaita Cuisine
        "Wolaytta Qumaa",
        // EN: Ethiopian Cuisine
        "Toophphiya Qumaa",
        // EN: Drinks
        "Ushshati",
        // EN: Special Events
        "Dummatiyaa Giigissota",
      ],
      // EN: Explore Restaurant
      cta: "Katta Keettaa Be'ite",
    },
    stories: {
      // EN: Wolaita elder storyteller
      elderAlt: "Haysiya yootiya Wolaytta cimaa.",
      // EN: Oral History
      eyebrow: "Doonaa Taarikiya",
      // EN: Stories Passed Down
      title: "Laatettida Taariketa",
      // EN: For generations, Wolaita knowledge has lived in words, spoken around fires, in homes, at ceremonies. Our oral history collection preserves these living stories.
      p1: "Daro yeletatun, Wolaytta eray qaalatun, tamaa xaphon, so giddon haasayettiiddi takkiis. Cora nu doonaa taariketi ha paxa taariketa naagi oyqqoosona.",
      // EN: Elders tell them in Wolaytta, Amharic and English. Each story is a window into a world that continues to shape Wolaita life today.
      p2: "Cima asati taariketa Wolayttattuwan, Amaarattuwaaninne Ingiliizattuwan yootoosona. Issi issi taarikee hachchi Wolaytta de'uwaa loyttiiddi sinttawu biya alamiyaakko xeelliyoo masttoote.",
      languages: [
        // EN: Wolaytta
        "Wolayttatto",
        // EN: Amharic
        "Amaaratto",
        // EN: English
        "Ingiliizatto",
      ],
      // EN: Discover More Stories
      cta: "Hara Cora Taariketa Demmite",
    },
    reading: {
      // EN: A quiet corner
      eyebrow: "Woppu Giida Zooziya",
      // EN: The Reading Place
      title: "Nabbabbiyo Sohuwa",
      // EN: A quiet place in the gardens to sit with a book, where the only sounds are birds, wind in the trees and the day going by.
      desc: "Kafuwaa, mittatu giddoora biyaa Carkkuwaanne Kanttiya gallassa cenggurssappe attin hara cenggurssi baynna, maxaafara nabbabbiiddi uttanawu, woppu giida sohuwa.",
      // EN: Look up from the page and Mount Damota stands before you, close enough to feel.
      mountain: "Maxaafaa nabbabbiiddi pude xoqqu giyoode sinttan eqqabadan haniyaa Daamota Deree beettees.",
      // EN: Read with the mountain in front of you
      caption: "Deriyaa matan uttada nabbabbite.",
      qualities: [
        // EN: Quiet
        "Co\"u giida.",
        // EN: Shade and gardens
        "Mittatane etu Kuwaa",
        // EN: A view of Mount Damota
        "Daamoota Deriyaa Xeelaa",
        // EN: Open to visitors
        "Xomoosiyaageetuyyoo Dooya",
      ],
      // EN: Plan your visit
      cta: "Xomoosanawu Keerite",
    },
    gallery: {
      // EN: Gallery
      eyebrow: "Misiliya",
      // EN: Life at Bushaashe Garuwa
      title: "De'uwaa, Bushaashe Garuwan",
      // EN: Full Gallery
      full: "Mule Misiliya",
    },
    final: {
      // EN: Ready to Visit?
      eyebrow: "Xomoosanawu Giigidonii?",
      // EN: Your Journey Starts Here
      title: "Hemetay Hagaappe Doommees",
    },
  },
};

export default page;
