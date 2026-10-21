import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Photo descriptions and captions (gallery, and read aloud by screen readers)
 * See it on the site: /gallery
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  photos: {
    // EN: Meeshsho Keettaa: a traditional Wolaita house with a thatched dome and a carved wooden door, among enset plants
    meeshsho: "Meesho Keettaa: maatan dadettida qum\"oy, sikettida godaanne ciiretti giigida sanqqay de'iyoo uuttatu giddon keexettida keettaa.",
    // EN: Bushaashe Garuwa: the main gate with its carved tree-trunk pillars and the welcome sign
    gate: "Bushaashe Garuwa: naa\"u mittaappe giigida tuussa mittati, hashshu yeeta giyaa mohaa xuufeenne moqottaappe merettida sanqqay de'iyoo giddo geliyoo waanna penggiyaa",
    // EN: Bushaashe Garuwa: traditional thatched house, flags and grounds
    house: "Bushaashe Garuwaa: gita gatta keettaa, banddiratanne zaguwaa",
    // EN: Bushaashe Garuwa: thatched pavilions and lush gardens
    pavilions: "Bushaashe Garuwaa: maaxxan xammettida adaratanne lo'idi carkkiya ataakilttiya sa'aa",
    // EN: Bushaashe Garuwa: gardens and recreational grounds
    gardens: "Bushaashe Garuwaa: ataakiltte mittatanne shemppiyo gadiyaa",
    // EN: Bushaashe Garuwa: open lawns, heritage tree and traditional house
    lawn: "Bushaashe Garuwaa: dooyettida maata sa'aa, laata mittaanne aada keettaa",
    // EN: The meeting hall at Bushaashe Garuwa: rows of chairs in white covers with bands of Wolaita pattern, under wood-panelled walls
    meetingHall: "Bushaashe Garuwaa shiiquwa adaraa: mitta deese garssan, Wolaytta aleeqee de'iya bootta maoy maayida oydhdheta saasata",
    // EN: A VIP room for sleeping: a carved wooden bed with an embroidered white cover, and an armchair
    vipRoom: "Hiixiyo VIP keettaa: oosetti xalettida mitta arsa, sikketida bootta maoy maayidabaanne uffi gidi uttiyo arsa",
    // EN: The VIP sitting and dining room: sofas, a marble-topped table, a kitchen counter and a fireplace
    vipDining: "Uttiyoore maana VIP adaraa: soofata, al'o zaaga dembbaa bolla gayida xarapheezaa, kichchiya koyronne tama sa'aa",
    // EN: The VIP kitchen: carved wooden cupboards above a marble counter with a sink, beside a panelled wooden door
    vipKitchen: "VIP kichchiya: haaxxa meecciyo sa'ara de'iya qaxxarettida mitta saxinetettaa, mitta pangga matan",
    // EN: The VIP cooking corner: a black double sink with running water and a two-ring electric stove on a wooden worktop
    vipCooking: "VIP kattiyo zoozaa: pulttiya haaxxai de'iya karetta laa'u haaxxa meecciyo sa'aanne mitta oosuwa dembbaa bollan de'iya koranti stove",
    // EN: A VIP rest room: a rain shower and a round mirror under three warm lamps, on marble-patterned tiles
    vipShower: "VIP meeceetiyo keettaa: ho'o lampatetta garssan de'iya pillaasa maala haaxxa pulttiyaaye, shaaqila janbberiyaanne xalettida xabiyaa bollan de'iya janbberiyaa",
    // EN: A VIP rest room: a white washbasin with a chrome tap against marble-patterned tiles
    vipBasin: "VIP meeceetiyo keettaa: xalettida xabiyaa sinttan de'iya bootta kusha meecciyoobaanne pillaasa boora poppoqqiyagaa",
    // EN: A VIP rest room: a white toilet in a room tiled from floor to ceiling
    vipToilet: "VIP meeceetiyo keettaa: huupheppe gade gakkanaas xabiyaan maayida keettan de'iya geeshsha bootta sheeshsho sa'aa",
    // EN: Elders in traditional Wolaita dress seated under the great tree at Bushaashe Garuwa, in front of a thatched house and a welcome banner
    eventElders: "Bushaashe Garuwaan gita mitta garssan, maaxxan xammettida keettaa sinttanne mokki ekkiya saasani sinttan aada Wolaytta maoya maayidi uttida cimata",
    // EN: A gathering at Bushaashe Garuwa: a man speaks into a microphone to guests seated at a long table covered in Wolaita cloth, under a tree
    eventGathering: "Bushaashe Garuwaa shiiquwaa: mitta garssan Wolaytta maoy maayida adhdha xarapheezaa matan uttida imttatassi issi bitanee maayikrofoniyaan haasayee",
    // EN: A celebration at Bushaashe Garuwa: guests in Wolaita-pattern shirts clap around a cake with candles and a large traditional loaf
    eventCelebration: "Bushaashe Garuwaa bonchchoo: Wolaytta aleeqee de'iya qamisiya maayida imttati tuulxxiya shamaara de'iya keekiyanne gita aada muqqa yuuyidi kushiya baqoosona",
    // EN: Guests in Wolaita-pattern shirts playing with a ball and laughing on the lawn at Bushaashe Garuwa
    eventGames: "Wolaytta aleeqee de'iya qamisiya maayida imttati Bushaashe Garuwaa maata sa'an booliya ka'idi miiccidosona",
    // EN: Bushaashe Garuwa: traditional thatched house, fountain and flags among the gardens
    home: "Bushaashe Garuwaa: ataakiltte giddon de'iya aada maaxxa keettaa, pulttiya haaxxa pillaasaanne banddarata",
    // EN: Enset (false banana) growing at Bushaashe Garuwa, the staple plant of Wolaita food culture
    enset: "Bushaashe Garuwaan dicciya uttiya (woykko emmaay), Wolaytta quma aadaa waanna mittaa",
    // EN: Traditional Wolaita dishes served in woven baskets inside a cultural house at Bushaashe Garuwa
    food: "Bushaashe Garuwaa aada keettaa giddon shashshamettida le'etan shiiqida aada Wolaytta qumata",
    // EN: The row of zigba trees at Bushaashe Garuwa, planted by Garedew, son of Alambo
    zigba: "",
    // EN: Gulanttaa Keettaa at Bushaashe Garuwa: a round traditional Wolaita house with a thatched dome, dark bands on its woven walls and a wooden door
    gulanttaa: "",
    // EN: Inside Gulanttaa Keettaa: a traditional bed of wooden poles covered with a hide, against a wall of bamboo and split wood
    traditionalBed: "",
    // EN: Inside Gulanttaa Keettaa: woven baskets, lids and fans in red and green, and rows of clay pots, hung on a woven wall
    artifactsWall: "",
    // EN: Inside Gulanttaa Keettaa: a large clay water pot, a colourful lidded basket and bundles wrapped in dried enset leaves
    artifactsCorner: "",
    // EN: The memorial of Garedew Alambo at Bushaashe Garuwa: a bronze bust on a black column, beside the thatched house and the enset
    garedewMemorial: "",
    // EN: A white pigeon with a feathered crest and grey-brown wings on the red earth at Bushaashe Garuwa
    whitePigeon: "",
    // EN: A banana plant at Bushaashe Garuwa with a large bunch of green bananas and its purple flower
    bananaBunch: "",
    // EN: A papaya tree at Bushaashe Garuwa, heavy with green fruit and one turning yellow
    papaya: "",
    // EN: Young broad-leaved trees growing in rows in the red earth of the Bushaashe Garuwa farm
    youngTrees: "",
    // EN: A young deer with large ears standing in the grass on the lawn at Bushaashe Garuwa
    deer: "",
    // EN: The farm building with a green roof among banana, enset and young trees on the four-hectare farm of Bushaashe Garuwa
    farm: "",
    // EN: The bamboo meeting hall with a green roof beside the round thatched bar, along a stone path through the gardens of Bushaashe Garuwa
    hallAndBar: "",
    // EN: Members of the Bushaashe family in traditional dress on the lawn at Bushaashe Garuwa
    family: "",
    // EN: The bar at Bushaashe Garuwa: a round house with a thatched roof, glass walls and lanterns, on the lawn among flowers
    bar: "",
    // EN: Banana plants with a bunch of green bananas growing in the red earth at Bushaashe Garuwa
    banana: "",
    // EN: The herb garden at Bushaashe Garuwa: herbs and flowering plants beside a stone path
    herbs: "",
    // EN: Plants with red and green leaves along a path at Bushaashe Garuwa, beside a thatched house and young trees
    gardenPlant: "Maaxxa keettaa matan, yaara mittatara ogiya giddon de'iya zo'o qassi caala hayttai de'iya ataakilttiyaa",
    // EN: A pigeon with a white head and a purple sheen on its neck, perched on the edge of a roof at Bushaashe Garuwa
    bird: "Bushaashe Garuwaa keetta huuphe zappiyaan uttida, bootta huupheenne qolla qorxxiya lo'o birssaqai de'iya holla kafiyaa",
    // EN: Gifaataa celebration at Bushaashe Garuwa: guests in traditional Wolaita dress walking through the heritage gate
    gifaataa1: "Gifaataa bonchchoo Bushaashe Garuwaan: aada Wolaytta maoy maayida imttati laata kera panggara giddoyees",
    // EN: Gifaataa celebration: women in traditional Wolaita dress gathered on the Bushaashe Garuwa lawn
    gifaataa2: "Gifaataa bonchchoo: aada Wolaytta maoy maayida maccaasay Bushaashe Garuwaa maata gadiyan shiiqidosona",
    // EN: Gifaataa celebration: guests in traditional Wolaita attire on the Bushaashe Garuwa grounds
    gifaataa3: "Gifaataa bonchchoo: aada Wolaytta maoy maayida imttati Bushaashe Garuwaa gadiyan eqqidosona",
  },

  photoCaptions: {
    meeshsho: {
      // EN: Meeshsho Keettaa
      title: "Meesho Keettaa",
      // EN: A traditional Wolaita house: a thatched dome, woven walls and a carved door, standing among the enset.
      desc: "Uuttatu giddon eqqida Wolaytta Wogaa keettaa: maatan dadettida qum\"uwaa, galabaan oosettida godaanne ciirettida sanqqaa.",
    },
    gate: {
      // EN: The Main Gate
      title: "Waanna Kare Panggiyaa",
      // EN: Two carved tree-trunk pillars, the welcome sign and the bamboo doors: the way into Bushaashe Garuwa.
      desc: "Laa'u qaxxarettida gufayti, mokki ekkiya saasani qassi woshsha pangga: Bushaashe Garuwaa geliyo ogiyaa.",
    },
    home: {
      // EN: The Heart of the Grounds
      title: "Sa'aa Wozanaa",
      // EN: The great traditional house, the fountain and the flags, set among the gardens.
      desc: "Gita aada keettaa, pulttiya haaxxa pillaasaanne banddarata, ataakiltte giddon giigida.",
    },
    gifaataa1: {
      // EN: Arriving for Gifaataa
      title: "Gifaataassi Yiyoogaa",
      // EN: Guests in traditional Wolaita dress walk through the heritage gate for the new year celebration.
      desc: "Aada Wolaytta maoy maayida imttati laytta laammiya bonchchoos laata kera panggara geloosona.",
    },
    house: {
      // EN: The Traditional House
      title: "Beni Keettaa",
      // EN: A traditional Wolaita house with its thatched roof, beside the path and the Ge'ez letters of the name.
      desc: "Maaxxan xammettida ba huupheera de'iya aada Wolaytta keettaa, ogiya matan qassi sunttaa abagida pilleera.",
    },
    gifaataa2: {
      // EN: Women of Gifaataa
      title: "Gifaataa Maccaasata",
      // EN: Women in white and red traditional Wolaita dress gather on the lawn during Gifaataa.
      desc: "Boottaara zo'ora aada Wolaytta maoy maayida maccaasay Gifaataa wode maata sa'an shiiqidosona.",
    },
    pavilions: {
      // EN: Thatched Pavilions
      title: "Maaxxa Adaratata",
      // EN: Shaded pavilions among the trees, where visitors rest and gather.
      desc: "Mitta garssan de'iya kuuyiya adaratata, be'iyasati shemppiyonne shiiqiyo sohuwaa.",
    },
    gifaataa3: {
      // EN: Guests of the Celebration
      title: "Bonchcho Imattata",
      // EN: Guests in traditional Wolaita attire stand together on the grounds during Gifaataa.
      desc: "Aada Wolaytta maoy maayida imttati Gifaataa wode sa'iya bollan issippe eqqidosona.",
    },
    gardens: {
      // EN: The Gardens
      title: "Ataakiltte Sa'aa",
      // EN: Green lawns, hedges and a play area for children and families.
      desc: "Caala maata sa'aa, dirssanne na'atassinne so asatassi ka'iyo pillaasaa.",
    },
    enset: {
      // EN: Enset, the False Banana
      title: "Uttiyaa (Emmaay)",
      // EN: Enset growing on the grounds: the staple plant at the heart of Wolaita food and culture.
      desc: "Sa'an dicciya uttiyaa: Wolaytta qumanne aada wozanappe de'iya waanna mittaa.",
    },
    food: {
      // EN: The Taste of Wolaita
      title: "Wolaytta Qumaa Malata",
      // EN: Traditional Wolaita dishes, from enset to beans and greens, served in woven baskets inside a cultural house.
      desc: "Uttiaappe bakelaasi qassi ataakilttiyaassi de'iya aada Wolaytta qumata, aada keettaa giddon shashshamettida le'etan shiiqida.",
    },
    zigba: {
      // EN: The Zigba Trees
      title: "Zigbaa Mittata",
      // EN: Zigba trees planted by Garedew, standing in a long, even line like a peaceful procession.
      desc: "",
    },
    gulanttaa: {
      // EN: Gulanttaa Keettaa
      title: "",
      // EN: The second traditional house of the grounds: a thatched dome and woven walls banded in black.
      desc: "",
    },
    traditionalBed: {
      // EN: The Traditional Bed
      title: "",
      // EN: A bed of wooden poles under a hide, as the Wolaita slept in their houses.
      desc: "",
    },
    artifactsWall: {
      // EN: Baskets and Clay Pots
      title: "",
      // EN: Woven baskets, lids and fans, and rows of clay pots: the household of a Wolaita home.
      desc: "",
    },
    artifactsCorner: {
      // EN: The Water Pot and the Mesob
      title: "",
      // EN: A clay water pot, a bright lidded basket and bundles kept in dried enset leaves.
      desc: "",
    },
    garedewMemorial: {
      // EN: The Memorial of Garedew
      title: "",
      // EN: A bronze bust of Garedew Alambo stands on the grounds he made flourish.
      desc: "",
    },
    whitePigeon: {
      // EN: A Crested Pigeon
      title: "",
      // EN: A white pigeon with a crown of feathers, one of the birds kept on the grounds.
      desc: "",
    },
    bananaBunch: {
      // EN: Bananas Ripening
      title: "",
      // EN: A heavy bunch of green bananas and the purple flower beneath it.
      desc: "",
    },
    papaya: {
      // EN: The Papaya Tree
      title: "",
      // EN: Papayas growing in a crown under the leaves, one already turning yellow.
      desc: "",
    },
    youngTrees: {
      // EN: Young Trees
      title: "",
      // EN: New trees planted in rows: the grounds are still growing.
      desc: "",
    },
    deer: {
      // EN: A Young Deer on the Lawn
      title: "",
      // EN: One of the animals of the grounds, ears up, listening in the green grass.
      desc: "",
    },
    farm: {
      // EN: The Four-Hectare Farm
      title: "",
      // EN: Bananas, enset and young trees stretch across four hectares of farmland around the farm building.
      desc: "",
    },
    hallAndBar: {
      // EN: The Meeting Hall and the Bar
      title: "",
      // EN: The bamboo hall and the round, thatched bar stand side by side along the garden path.
      desc: "",
    },
    family: {
      // EN: The Family
      title: "",
      // EN: Members of the family that keeps Bushaashe Garuwa, in traditional dress on the lawn.
      desc: "",
    },
    bar: {
      // EN: The Bar
      title: "",
      // EN: A round, thatched house with glass walls and warm lanterns, looking out over the lawn and the flowers.
      desc: "",
    },
    banana: {
      // EN: The Banana Grove
      title: "",
      // EN: Banana plants heavy with green fruit grow in rows in the red earth.
      desc: "",
    },
    herbs: {
      // EN: The Herb Garden
      title: "",
      // EN: Herbs for the kitchen and bright flowers grow side by side along the stone path.
      desc: "",
    },
    gardenPlant: {
      // EN: Colours of the Garden
      title: "Ataakilttiya Boniyaa",
      // EN: Red-leaved plants line the path beside the thatched house, among young trees and green lawns.
      desc: "Zo'o hayttai de'iya ataakilttiyaa maaxxa keettaa matan ogiya bollan kora eqqida, yaara mittatanne caala maata sa'aara.",
    },
    bird: {
      // EN: A Resident of the Grounds
      title: "Gadiyaa De'iyaas",
      // EN: A pigeon with a white head and a shining purple neck watches from the edge of a roof.
      desc: "Bootta huupheenne poqqiya birssaqai de'iya holla kafiyaa keettaa huuphe zappiaappe xeelliyoogaa.",
    },
    lawn: {
      // EN: The Great Lawn
      title: "Gita Maata Sa'aa",
      // EN: Open lawns and the great tree, with the traditional house in the distance.
      desc: "Dooyettida maata sa'aanne gita mittaa, haakkiyan de'iya aada keettaara.",
    },
    meetingHall: {
      // EN: The Meeting Hall
      title: "Shiiquwa Adaraa",
      // EN: Rows of chairs dressed in white with bands of Wolaita pattern, ready for a meeting or a training.
      desc: "Shiiquwawu woykko tamaarisuwawu giigida Wolaytta aleeqee de'iya bootta maoy maayida oydhdheta saasata.",
    },
    vipRoom: {
      // EN: VIP Room for Sleeping
      title: "VIP Hiixiyo Keettaa",
      // EN: A carved wooden bed with a hand-embroidered cover.
      desc: "Kushan sikketida maoy maayida qaxxarettida mitta arsaa.",
    },
    vipDining: {
      // EN: VIP Sitting and Dining Room
      title: "VIP Uttiyonne Maana Keettaa",
      // EN: Sofas, a marble-topped table, the kitchen counter and the fireplace.
      desc: "Soofata, al'o zaaga dembbaa bolla gayida xarapheezaa, kichchiya koyronne tama sa'aa.",
    },
    vipKitchen: {
      // EN: The VIP Kitchen
      title: "VIP Kichchiyaa",
      // EN: Carved wooden cupboards, a marble counter and a sink: a kitchen of your own to cook in.
      desc: "Qaxxarettida mitta saxinetettaa, al'o zaaga dembbaa bollan de'iya koyronne haaxxa meecciyo sa'aa: neesne katana keettaa.",
    },
    vipCooking: {
      // EN: Cook It Yourself
      title: "Ne Huuphen Katta",
      // EN: A double sink with running water and an electric stove, ready for the family meal.
      desc: "Pulttiya haaxxai de'iya laa'u haaxxa meecciyo sa'aanne koranti stove, so asa qumawu giigida.",
    },
    vipShower: {
      // EN: Shower Room
      title: "Meeceetiyo Keettaa",
      // EN: A rain shower, a round mirror and warm lamps on marble-patterned tiles.
      desc: "Pillaasa maala haaxxa pulttiyaaye, shaaqila janbberiyaanne ho'o lampata xalettida xabiyaa bollan.",
    },
    vipBasin: {
      // EN: Washbasin
      title: "Kusha Meecciyoabaa",
      // EN: A white basin and a bright tap, kept spotless for every guest.
      desc: "Bootta kusha meecciyoobaanne pillaasa boora poppoqqiyagaa, imtta ubbawu geeshshan naagettida.",
    },
    vipToilet: {
      // EN: Private Rest Room
      title: "Shaafettida Sheeshsho Sa'aa",
      // EN: A clean, modern rest room, tiled from floor to ceiling.
      desc: "Geeshsha, ha'i wodiya sheeshsho sa'aa, huupheppe gade gakkanaas xabiyaan maayida.",
    },
    eventElders: {
      // EN: Elders Under the Great Tree
      title: "Cimata Gita Mitta Garssan",
      // EN: Elders in traditional Wolaita dress sit in the shade before the thatched house, welcoming their guests.
      desc: "Aada Wolaytta maoy maayida cimati maaxxa keettaa sinttan kuuyiyaan uttidi imttata mokki ekkoosona.",
    },
    eventGathering: {
      // EN: A Meeting in the Open Air
      title: "Shiiquwa Carkkiya Sa'an",
      // EN: A speaker addresses guests at a long table dressed in Wolaita cloth, in the shade of a tree.
      desc: "Haasayiyaayssi mitta kuuyiyaan, Wolaytta maoy maayida adhdha xarapheezaa matan uttida imttatassi haasayees.",
    },
    eventCelebration: {
      // EN: A Day to Celebrate
      title: "Galatiyo Gallassa",
      // EN: Friends clap around a cake and a great traditional loaf, with the thatched pavilion behind them.
      desc: "Laggati keekiyaanne gita aada muqqa yuuyidi kushiya baqoosona, guyyeena maaxxa adaraa de'ishshin.",
    },
    eventGames: {
      // EN: Games on the Lawn
      title: "Ka'uwaa Maata Sa'an",
      // EN: After the meal, guests play and laugh together on the wide green lawn.
      desc: "Qumaappe guyyetan imttati aahuwaa caala maata sa'an ka'ididinne miiccidi issippe gayttidosona.",
    },
  },
};

export default page;
