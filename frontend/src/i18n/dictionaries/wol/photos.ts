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
    // EN: “Meesho Keettaa”: a traditional Wolaita house with a thatched dome and a carved wooden door, among enset plants
    meeshsho: "Meesho Keettaa: maatan dadettida qum\"oy, sikettida godaanne ciiretti giigida sanqqay de'iyoo uuttatu giddon keexettida keettaa.",
    // EN: Bushaashe Garuwa: the main gate with its carved tree-trunk pillars and the welcome sign
    gate: "Bushaashe Garuwa: naa\"u mittaappe giigida tuussa mittati, hashshu yeeta giyaa mohaa xuufeenne moqottaappe merettida sanqqay de'iyoo giddo geliyoo waanna penggiyaa",
    // EN: Bushaashe Garuwa: traditional thatched house, flags and grounds
    house: "Bushaashe Garuwaa: gita gatta keettaa, banddiratanne zaguwaa",
    // EN: Bushaashe Garuwa: thatched pavilions and lush gardens
    pavilions: "Bushaashe Garuwaa: maatan xammettida qeeri keettatanne lo'idi carkkiya ataakilttiya sohuwaa",
    // EN: Bushaashe Garuwa: gardens and recreational grounds
    gardens: "Bushaashe Garuwaa: ataakiltte gadetanne kaa'iyoo sohota",
    // EN: Bushaashe Garuwa: open lawns, heritage tree and traditional house
    lawn: "Bushaashe Garuwaa: aaho qooruwaa, laata mittaanne beni keettaa",
    // EN: The meeting hall at Bushaashe Garuwa: rows of chairs in white covers with bands of Wolaita pattern, under wood-panelled walls
    meetingHall: "Bushaashe Garuwan de'iyaa shiiquwa gutaraa: goday mittan alleeqido keettaa giddon de'iya, bootta carqqiyan kamettida oydeti yafaran uttidosaa.",
    // EN: A VIP room for sleeping: a carved wooden bed with an embroidered white cover, and an armchair
    vipRoom: "Xiskkanawu VIP kifiliyaa: sikettida bootta carqqiyan kamettida mittaappe ciiretti giigida arssaanne zemppuwaara de'iyaa oydiyaa",
    // EN: The VIP sitting and dining room: sofas, a marble-topped table, a kitchen counter and a fireplace
    vipDining: "Uttiyoonne qumaa miyoo VIP kifiliyaa: soofata, ibinabaradiyan kamettida xarapheezzaa, eqo kushiinaanne tamaa eettiyoosaa",
    // EN: The VIP kitchen: carved wooden cupboards above a marble counter with a sink, beside a panelled wooden door
    vipKitchen: "VIP kushiinaa: mitta penggiyaa miyyiyan, ibinabaradiya xarapheezzaappe bolla baggaara de'iyaa mittaappe ciirettidi giigida eqo saaxiniyaa",
    // EN: The VIP cooking corner: a black double sink with running water and a two-ring electric stove on a wooden worktop
    vipCooking: "VIP kattiyo zoozaa: goggiyaa haattay de'iyoo naa\"u karetta meecciyo ollatinne naa\"u kattiyoosay de'iyoo koorinttiyaa coocee de'iyoo mittaappe giigida eqqidi kattiyoo sohuwaa.",
    // EN: A VIP rest room: a rain shower and a round mirror under three warm lamps, on marble-patterned tiles
    vipShower: "VIP meecettiyoo kifiliyaa: iraa haattan bollaa meecettiyoosaanne qassikka ibinabaradiyan kamettida xarapheezzaappe bolla baggaara heezzu xomppettuppe garssaara de'iyaa irzziizo-mala heregay de'iyoosaa",
    // EN: A VIP rest room: a white washbasin with a chrome tap against marble-patterned tiles
    vipBasin: "VIP meeceetiyo keettaa: ibinabaradiyan kamettida xarapheezzaa bollan de'iyaa haattaa bombbati de'iyoo bootta meecciyoo ollaa.",
    // EN: A VIP rest room: a white toilet in a room tiled from floor to ceiling
    vipToilet: "VIP meeceetiyo keettaa: sa'aappe biidi kaaraa gakkanaassi bootta shuchchan puulattid sheeshsha keettaa",
    // EN: Elders in traditional Wolaita dress seated under the great tree at Bushaashe Garuwa, in front of a thatched house and a welcome banner
    eventElders: "Wogaa maayuwaa maayida cimati Bushaashe Garuwaan de'iyaa gita mittaa garssan, 'Hashshu Saro Yeeta' giyaa xuufiyaa oyqqidi maata keettaa sinttan uttidosona",
    // EN: A gathering at Bushaashe Garuwa: a man speaks into a microphone to guests seated at a long table covered in Wolaita cloth, under a tree
    eventGathering: "Bushaashe Garuwan de'iyaa shiiquwaa: Wolaytta maayuwan kamettida adussa xarapheezzaa sinttan mitta giddon uttida imattatuyyoo bitanee maykiraapooniyan haasayees.",
    // EN: A celebration at Bushaashe Garuwa: guests in Wolaita-pattern shirts clap around a cake with candles and a large traditional loaf
    eventCelebration: "Bushaashe Garuwan de'iyaa bonchchuwaa: Imattati Wolaytta shuraabiyan alleeqidi sanddalliyaa keekkiyaanne gita daabbuwaa yuushuwan kushiyaa baqqiiddi",
    // EN: Guests in Wolaita-pattern shirts playing with a ball and laughing on the lawn at Bushaashe Garuwa
    eventGames: "Imattati Wolaytta shuraabiyan alleeqidi, kuwaasiya kaa'iiddinne Bushaashe Garuwan de'iya gita qooruwan poocammiiddinne miicciiddi",
    // EN: Bushaashe Garuwa: traditional thatched house, fountain and flags among the gardens
    home: "Bushaashe Garuwaa: ataakiltte sohotu giddon de'iyaa beni gatta keettaa, pulttuwaanne banddiraa",
    // EN: Enset (false banana) growing at Bushaashe Garuwa, the staple plant of Wolaita food culture
    enset: "Wolaytta asaa meeze quma gididanne Bushaashe Garuwaan dicciya uttaa",
    // EN: Traditional Wolaita dishes served in woven baskets inside a cultural house at Bushaashe Garuwa
    food: "Bushaashe Garuwan Wolaytta beni keettatu giddon sikettida sayniyan shiiqiya Wolaytta qumaa.",
    // EN: The row of zigba trees at Bushaashe Garuwa, planted by Garedew, son of Alambo
    zigba: "Alambbo na'aa gidida Garedewun tokettida Bushaashe Garuwan de'iyaa zigaa mittatu yafaraa",
    // EN: The crocodile pond at Bushaashe Garuwa: three crocodiles in clear green water inside a walled pond with a sandy bank, set in the grass
    crocodilePond: "Bushaashe Garuwan giddon hawulaashoy de'iyoo haattaa ollaa: maata giddon de'iyaanne shafetiyaa soho gidida direttida maata malatiya haattaa ollaa giddon heezzu hawulaashoti de'oosona.",
    // EN: The reading place at Bushaashe Garuwa: a thatched bamboo platform raised among the trees, reached by a bamboo stair, its posts painted red, black and yellow
    readingPlace: "Bushaashe Garuwan de'iyaa nabbabbiyoo sohuwaa: woyshan dadetti giigida wuygeenne maatan dadettida kaaray de'iyoo, mittatu giddon xoqqu giidi keexettida, woyshan giigida kiyiyoo xekkaay de'iyoonne, a mintti essida tuussati zo'o, karettanne bica qalamiyan tiyettidi alleeqido sohuwaa",
    // EN: The rock fountain at Bushaashe Garuwa: water falling in threads over a great dark rock ringed with stones, on the lawn among palms and hedges
    rockFountain: "Bushaashe Garuwan de'iyaa shuchchan giigida pulttuwaa: zambbaanne dadettida dirssatu giddon gita qooruwan de'iyaa baasuwan qeeri shuchchatun doodettida woggaa shuchchaa bollaara shaahettidi goggiyaa haattaa.",
    // EN: The small zoo at Bushaashe Garuwa: a young deer standing in the grass behind the wire fence, beside its wooden shelter
    zoo: "Bushaashe Garuwan de'iyaa do'ata naagiyoo guutta sohuwaa: shuban dirssaa guyye baggan ba mitta keettaa matan maata giddon eqqi mara dogiyaa",
    // EN: A rider in a light suit and a woven scarf on a grey horse dressed in traditional red-tasselled harness, crossing the lawn at Bushaashe Garuwa
    horseRiding: "Suufiya maayidi, dadettida sharbbiyaa qooriyan xaaxidi, beni zo'o carqqiyaara koorettida giraaca paraa toggidi Bushashe Garuwan qooruwan yuuyyiyaa paraa laaggiyaagaa",
    // EN: Two horses in traditional harness at Bushaashe Garuwa, with brass bridles, red and yellow tassels and an embroidered saddle cloth, standing on the lawn
    horses: "Bushaashe Garuwaa giddon naasiyaa bixaalan bixaalettidda, zo'o bicanne siketti giigida kooraara de'iyaa qooruwan eqqida naa\"u parata.",
    // EN: The fish pond at Bushaashe Garuwa: fish swimming in clear green water in a stone-edged pond under a shade net, fed by a little waterfall
    fishPond: "Bushaashe Garuwan de'iyaa molee de'iyoo haattaa ollaa: goggiyaa haattan kumiyaa, yuushoy shuchchan giigido direttidanne maata malatiyaa geeshsha haattaa giddon wadhdhiyaa moliyaa",
    // EN: The vegetable garden at Bushaashe Garuwa: neat beds of cabbage, carrots and lettuce, with maize and trees behind
    vegetableGarden: "Gushaahse Garuwan de'iyaa ataakiltte sohuwaa: Guyyeera badalaynne zaafeti de'iyoo xaatta santtaa, kaarootiyaa salaaxaa gadiyaa.",
    // EN: “Gulanttaa Keettaa” at Bushaashe Garuwa: a round traditional Wolaita house with a thatched dome, dark bands on its woven walls and a wooden door
    gulanttaa: "Bushaashe Garuwan de'iyaa “Gulantta Keettaa”: maatan dadettida kaaray, sikettida godatu bollan kareta yafaratinne mitta penggee de'iyoo beni irzzo Wolaytta keettaa",
    // EN: Inside “Gulanttaa Keettaa”: a traditional bed of wooden poles covered with a hide, against a wall of bamboo and split wood
    traditionalBed: "“Gulantta Keettaa” gidduwaa: woyshaappe merettidanne galbbay hiixettido beni arssaa",
    // EN: Inside “Gulanttaa Keettaa”: woven baskets, lids and fans in red and green, and rows of clay pots, hung on a woven wall
    artifactsWall: "“Gulantta Keettaa” gidduwaa: godan kaqqettida zo'onne maatama datta qarcciitata, eta qum\"utanne, urqqaappe merettida shaateta",
    // EN: Inside “Gulanttaa Keettaa”: a large clay water pot, a colourful lidded basket and bundles wrapped in dried enset leaves
    artifactsCorner: "“Gulantta Keettaa” gidduwaa: wogga haattaa otuwaa, dumma dumma mereti de'iyoo qum\"uwaara de'iyaa masoofiyaanne uuttaa gobban giigida shidhdhaa",
    // EN: The memorial of Garedew Alambo at Bushaashe Garuwa: a bronze bust on a black column, before banana and enset plants
    garedewMemorial: "Bushaashe Garuwan Garedewu Alambba hassayuwaa: muuziyaanne uuttaa sinttan de'iyaa naasiyaappe oosettida karetta shuchchaa bollan de'iyaa 'hawulttiyaa'",
    // EN: A white pigeon with a feathered crest and grey-brown wings on the red earth at Bushaashe Garuwa
    whitePigeon: "Bushaashe Garuwan de'iyaa, giraaca-ochcha-teera mala qefee de'iyoo bootta haraphphiyoo",
    // EN: A banana plant at Bushaashe Garuwa with a large bunch of green bananas and its purple flower
    bananaBunch: "Bushaashe Garuwan de'iyaa, cora maataama muuze ayfeta tookkidanne ochchaa-teeraa mala ciishshay de'iyoo muuziyaa mittaa",
    // EN: A papaya tree at Bushaashe Garuwa, heavy with green fruit and one turning yellow
    papaya: "Bushaahse Garuwan de'iyaa, ayfiiyan deexetti uttidanne issi ayfee ubba ka'iiddi de'iyoo paapaayiyaa mittaa",
    // EN: Young broad-leaved trees growing in rows in the red earth of the Bushaashe Garuwa farm
    youngTrees: "Bushaashe Garuwan zo'o biitta goshshaa bollan yafaran mokkiyaa aaho hayttay de'iyoo yelaga mittata.",
    // EN: A young deer with large ears standing in the grass on the lawn at Bushaashe Garuwa
    deer: "Bushaashe Garuwan qooruwaa maata giddon eqqida, wogga hayttay de'iyoo mara genessiyoo",
    // EN: The farm building with a green roof among banana, enset and young trees on the four-hectare farm of Bushaashe Garuwa
    farm: "Oyddu hektaare gidida Bushaashe Garuwaa goshshan de'iyaa, muuzziyaa, uuttaanne yelaga mittatu giddon de'iyaa, goshshaa hintstsaa",
    // EN: The bamboo meeting hall with a green roof beside the round thatched bar, along a stone path through the gardens of Bushaashe Garuwa
    hallAndBar: "Bushaahse Garuwan, ataakiltte sohotukko efiyaa shuchcha ogiyaa bollan de'iyaa, shaye keettaa matan de'iyaa, maataama kaaray de'iyoo woyshaappe merettida yaa'iyoo sohuwaa.",
    // EN: The bar at Bushaashe Garuwa: a round house with a thatched roof, glass walls and lanterns, on the lawn among flowers
    bar: "Bushaahse Garuwan de'iyaa shaye keettaa: dadettida kaaray de'iyoo, herega godaynne xomppeti de'iyoo, ciishshatu giddon de'iyaa keettaa",
    // EN: Banana plants with a bunch of green bananas growing in the red earth at Bushaashe Garuwa
    banana: "Bushaashe Garuwan zo'o biittaa bollan mokkiyaanne cora maataama muuzziyaa ayfiyaa tookkida muuzziyaa mittata",
    // EN: The herb garden at Bushaashe Garuwa: herbs and flowering plants beside a stone path
    herbs: "Bushaashe Garuwan de'iya qimametu gadiyaa: shuchchaa ogiyaa matan de'iyaa qimametanne ciiyyiyaa mittata",
    // EN: Plants with red and green leaves along a path at Bushaashe Garuwa, beside a thatched house and young trees
    gardenPlant: "Bushaashe Garuwaa giddon de'iyaa ogiyaa bollan de'iyaa, maata keettaanne yelaga zaafeti matan de'iyaa zo'onne maataama bonccoti de'iyoo mittata",
    // EN: A pigeon with a white head and a purple sheen on its neck, perched on the edge of a roof at Bushaashe Garuwa
    bird: "Bushaashe Garuwaa giddon keettaa huuphiyan uttida, bootta huupheenne ochchaa-teeraa milatiyaa qooree de'iyoo haraphphiyoo",
    // EN: “Gifaataa” celebration at Bushaashe Garuwa: guests in traditional Wolaita dress walking through the heritage gate
    gifaataa1: "Bushaashe Garuwaan “Gifaataa” bonchchuwaa: Wolaytta wogaa maayuwaa maayida imattati buqura sohuwaa penggiyaara geliiddi",
    // EN: “Gifaataa” celebration: women in traditional Wolaita dress gathered on the Bushaashe Garuwa lawn
    gifaataa2: "“Gifaataa” bonchchuwaa: Bushaashe Garuwa dembban shiiqida Wolaytta wogaa maayuwaa maayida maccaasat.",
    // EN: “Gifaataa” celebration: guests in traditional Wolaita attire on the Bushaashe Garuwa grounds
    gifaataa3: "“Gifaataa” bonchchuwaa: Bushaashe Garuwaa gibbe giddon Wolaytta maayuwaa maayida imattata",
  },

  photoCaptions: {
    meeshsho: {
      // EN: “Meesho Keettaa”
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
      title: "Gibbiyawu Gul\"a Sohuwaa",
      // EN: The great traditional house, the fountain and the flags, set among the gardens.
      desc: "Gita beni keettaa, pulttuwaanne banddirata.",
    },
    gifaataa1: {
      // EN: Arriving for “Gifaataa”
      title: "Gifaataassi Yiyoogaa",
      // EN: Guests in traditional Wolaita dress walk through the heritage gate for the new year celebration.
      desc: "Wolaytta maayota maayida imattati ooratta layttaa baalaa bonchchiyoogaa penggiyaara gelishin.",
    },
    house: {
      // EN: The Traditional House
      title: "Beni Keettaa",
      // EN: A traditional Wolaita house with its thatched roof, beside the path and the Ge'ez letters of the name.
      desc: "Ogiyaanne amaaratto pitaletun xaafettida sunttaa matan de'iyaa maatan dadettida kaaray de'iyoo beni Wolaytta keettaa.",
    },
    gifaataa2: {
      // EN: Women of “Gifaataa”
      title: "Gifaataa Maccaasata",
      // EN: Women in white and red traditional Wolaita dress gather on the lawn during “Gifaataa”.
      desc: "Boottaanne zo'o wogaa Wolaytta maayota maayida maccaasati Gifaataa wodiyan yiidi maata sa'an shiiqi uttidogaa",
    },
    pavilions: {
      // EN: Thatched Pavilions
      title: "Maata Daaseta",
      // EN: Shaded pavilions among the trees, where visitors rest and gather.
      desc: "Imattati shemppiyoonne shiiquyoo mittatu giddon de'iyaa kuway de'iyoo daaseta.",
    },
    gifaataa3: {
      // EN: Guests of the Celebration
      title: "Baalaa Imattata",
      // EN: Guests in traditional Wolaita attire stand together on the grounds during “Gifaataa”.
      desc: "Wolaytta wogaa maayuwaa maayida imatti “Gifaataa” wodiyan gibbe giddon shiiqi eqqidosona",
    },
    gardens: {
      // EN: The Gardens
      title: "Ataakiltte Gadiyaa",
      // EN: Green lawns, hedges and a play area for children and families.
      desc: "Maata qooruwaa, dadattida dirssatanne naatinne so asay kaa'iyoo sohuwaa.",
    },
    enset: {
      // EN: Enset, the False Banana
      title: "Uuttaa",
      // EN: Enset growing on the grounds: the staple plant at the heart of Wolaita food and culture.
      desc: "Gibbe gade giddon mokkiyaa uuttaa: Wolaytta qumaanne wogaa waanna gidida meeze mittaa.",
    },
    food: {
      // EN: The Taste of Wolaita
      title: "Wolaytta Mal\"otettaa",
      // EN: Traditional Wolaita dishes, from enset to beans and greens, served in woven baskets inside a cultural house.
      desc: "Uuttaappe doommidi baaqeelaa gakkanawu woga keettaa giddon masoofiyan aadhdhiyaa wogaa Wolaytta qumata",
    },
    zigba: {
      // EN: The Zigba Trees
      title: "Zigaa Mittata",
      // EN: Zigba trees planted by Garedew, standing in a long, even line like a peaceful procession.
      desc: "Garedewu tokkido maaraara salppiyan eqqida zigaa mittata",
    },
    crocodilePond: {
      // EN: The Crocodile Pond
      title: "Hawulaashuwaa Haattaa Ollaa",
      // EN: Crocodiles rest in clear water inside a walled, fenced pond, safe to watch from above.
      desc: "Hawulaashoti gimbbinyan direttida geehshsa eellida haattaa ollaa giddon shemppoosona. Bollaara eqqidi hirggennan be'eeta.",
    },
    readingPlace: {
      // EN: The Reading Place
      title: "Nabbabbiyoo Sohuwaa",
      // EN: Up the bamboo stair, under the thatch and among the trees: a quiet place to read.
      desc: "Woyshaappe giigida kiyiyo xekkay, maata kaaray de'iyoonne mittatu giddon de'iyaa woppu giida nabbabbiyoo sohuwa.",
    },
    rockFountain: {
      // EN: The Rock Fountain
      title: "Shuchchaa Soossuwaa",
      // EN: Water falls in silver threads over a great dark rock on the lawn.
      desc: "Wogga shuchchaa bollaara biraa kiriyaa malatiyaa haattay maataa bollan wodhdhees.",
    },
    zoo: {
      // EN: The Small Zoo
      title: "Do'ata Naagiyoo Guutta Sohuwaa",
      // EN: A young deer by its shelter: the zoo where children meet the animals of the grounds.
      desc: "Ba keettaa matan eqqida mara dogiyaa: naati gibbiyan de'iyaa do'ata be'iyoo 'do\'ata naagiyoo sohuwaa'.",
    },
    horseRiding: {
      // EN: A Ride Across the Lawn
      title: "Zaguwan Paraa Togaa",
      // EN: A grey horse in its festive harness carries a rider past the thatched houses.
      desc: "Baalaa alleequwan puulattida giraaca paray paraaway toggin maata keettaa mataara kanttiiddi de'ees.",
    },
    horses: {
      // EN: The Horses of the Grounds
      title: "Gibbiyaa Parata",
      // EN: Dressed in brass and red tassels, the way horses are adorned in Wolaita.
      desc: "Wolayttan parati alleeqiyaadan zo'onne naasiyaa milatiyaabatun alleeqida parata.",
    },
    fishPond: {
      // EN: The Fish Pond
      title: "Mole Haattaa Ollaa",
      // EN: Fish swim in clear green water under a shade net, fed by a little waterfall.
      desc: "Guutta goggiyaa haattan kumiyaa, yuushoy shuchchan giigido direttidanne maata malatiyaa geeshsha haattaa giddon wadhdhiyaa moliyaa",
    },
    vegetableGarden: {
      // EN: The Vegetable Garden
      title: "Ataakilttiya Sohuwaa",
      // EN: Cabbage, carrots, lettuce and other vegetables grow in neat beds, with maize standing behind them.
      desc: "Santtay, kaarootee, salaaxaynne hara ataakiltteti geeshsha sa'an mokkoosona. Guyye baggaara badalay de'ees.",
    },
    gulanttaa: {
      // EN: “Gulanttaa Keettaa”
      title: "“Gulantta Keettaa”",
      // EN: The second traditional house of the grounds: a thatched dome and woven walls banded in black.",
      desc: "Gibbe giddon naa\"antto beni keettaa: maata qum\"oynne karetta yafaratun alleeqida dadettida godaa.",
    },
    traditionalBed: {
      // EN: The Traditional Bed
      title: "Wogaa Arssaa",
      // EN: A bed of wooden poles under a hide, as the Wolaita slept in their houses.",
      desc: "Wolaytta asay beni xiskkiyoo, galbban kamettida mittaa arssaa.",
    },
    artifactsWall: {
      // EN: Baskets and Clay Pots
      title: "Samppatanne Urqqa Miishshata",
      // EN: Woven baskets, lids and fans, and rows of clay pots: the household of a Wolaita home.",
      desc: "Wolaytta so giddo miishshata: masoofeta, samppata, shaateta, goseta, buleta, zazzareta, pittiyoobatanne hara hara cora miishshata.",
    },
    artifactsCorner: {
      // EN: The Water Pot and the Mesob
      title: "Haattaa Otuwaanne Masoofiyaa",
      // EN: A clay water pot, a bright lidded basket and bundles kept in dried enset leaves.",
      desc: "Haattaa otuwaa, alleeqida masoofiyaanne uuttaa gobbaappe merettida uttiyoo shidhdhaa.",
    },
    garedewMemorial: {
      // EN: The Memorial of Garedew
      title: "Garedewu Hassayayiyoogaa",
      // EN: A bronze bust of Garedew Alambo stands on the grounds he made flourish.",
      desc: "Garedewu Alambbossi naasiyan giigida hawulttee eti puulayido gibbe giddon eqqiis.",
    },
    whitePigeon: {
      // EN: A Crested Pigeon
      title: "Zawudee De'iyoo Haraphphiyoo",
      // EN: A white pigeon with a crown of feathers, one of the birds kept on the grounds.",
      desc: "Gibbe giddon naagettiyaa kafotuppe issuwaa gidida, qefiyaa zawudee de'iyoo bootta haraphphiyoo.",
    },
    bananaBunch: {
      // EN: Bananas Ripening
      title: "Ka'iyaa Muuzziyaa",
      // EN: A heavy bunch of green bananas and the purple flower beneath it.",
      desc: "Maata malatiyaa muuziyan deexettidanne garssaara ochcha teeraa milatiyaa ciishshay de'iyoo muuziyaa mittaa.",
    },
    papaya: {
      // EN: The Papaya Tree
      title: "Paapaayiyaa Mittaa",
      // EN: Papayas growing in a crown under the leaves, one already turning yellow.",
      desc: "Zawudiyaadan bonccuwaappe garssaara diccida paapaayiyaa; issi ayfee koyrottidi ka'iiddi de'ees.",
    },
    youngTrees: {
      // EN: Young Trees
      title: "Yelaga Mittata",
      // EN: New trees planted in rows: the grounds are still growing.",
      desc: "Yafaran tokettida ooratta mittata: gibbee hanno gakkanawu haa haa puulattiiddi de'ees.",
    },
    deer: {
      // EN: A Young Deer on the Lawn
      title: "Maatan Eqqida Mara Dogiyoo",
      // EN: One of the animals of the grounds, ears up, listening in the green grass.",
      desc: "Gibbe giddon de'iyaa do'atuppe issuwaa gidida dogiyaa, hayttaa essada ezggaydda de'awusu.",
    },
    farm: {
      // EN: The Four-Hectare Farm
      title: "Oyddu Hektaare Gadiyaa",
      // EN: Bananas, enset and young trees stretch across four hectares of farmland around the farm building.",
      desc: "Muezee, uttaynne yelaga mittati oyddu hektaare gidiya gadiyan keettaa yuuyyidi muleera micetti uttidosona.",
    },
    hallAndBar: {
      // EN: The Meeting Hall and the Bar
      title: "Shiiquwa Gutaraanne Shaye Keettaa",
      // EN: The bamboo hall and the round, thatched bar stand side by side along the garden path.",
      desc: "Ataakiltte sohuwaa efiyaa ogiyaa matan eqqida woyshan keexettida gutaraanne maatan dadettida kaaray de'iyoo irzzo shaye keettaa.",
    },
    bar: {
      // EN: The Bar
      title: "Shaye Keettaa",
      // EN: A round, thatched house with glass walls and warm lanterns, looking out over the lawn and the flowers.",
      desc: "Herega godaynne pholqqattiyaa xomppeti de'iyoo irzzotida maata kaaray de'iyoo keettaa. Dembbaakkonne ciishshatukko simmidi eqqiis.",
    },
    banana: {
      // EN: The Banana Grove
      title: "Muuziya Goshshaa",
      // EN: Banana plants heavy with green fruit grow in rows in the red earth.",
      desc: "Maatama ayfiyaa tookkida muuziyaa mittati zo'o biittaa bollan, yafaran mokkidosona.",
    },
    herbs: {
      // EN: The Herb Garden
      title: "Sawiya Mittatu Sohuwaa",
      // EN: Herbs for the kitchen and bright flowers grow side by side along the stone path.",
      desc: "Kichchiya woshshaataanne poqqiya shaawati shaaqi ogiya bollan issi baashan diccoosona.",
    },
    gardenPlant: {
      // EN: Colours of the Garden
      title: "Ataakilttiya Malkketa",
      // EN: Red-leaved plants line the path beside the thatched house, among young trees and green lawns.
      desc: "Zo'o hayttai de'iya ataakilttiyaa maaxxa keettaa matan ogiya bollan kora eqqida, yaara mittatanne caala maata sa'aara.",
    },
    bird: {
      // EN: A Resident of the Grounds
      title: "Gibbiyan De'iyaagaa",
      // EN: A pigeon with a white head and a shining purple neck watches from the edge of a roof.
      desc: "Bootta huupheenne phoolammiya ochcha-teeraa malatiyaa qooree de'iyoo haraphphiyaa kaaraa liiphiyan uttada xeellawusu.",
    },
    lawn: {
      // EN: The Great Lawn
      title: "Gita Qooruwaa",
      // EN: Open lawns and the great tree, with the traditional house in the distance.
      desc: "Aaho dembbaanne gita mittata, hini haahuwan sinttaara beettiyaa keettaara.",
    },
    meetingHall: {
      // EN: The Meeting Hall
      title: "Shiiquwa Gutaraa",
      // EN: Rows of chairs dressed in white with bands of Wolaita pattern, ready for a meeting or a training.
      desc: "Shiiquwawu woykko loohissuwawu giigida Wolaytta alleequwan alleeqidanne bootta carqqiyan kamettida oydetu yafaraa.",
    },
    vipRoom: {
      // EN: VIP Room for Sleeping
      title: " VIP Xiskkiyoo Kifiliyaa",
      // EN: A carved wooden bed with a hand-embroidered cover.
      desc: "Mittaappe giigidanne kushiyan sikettida carqqiyan kamettida arssaa.",
    },
    vipDining: {
      // EN: VIP Sitting and Dining Room
      title: "VIP Uttiyonne Miyoo Kifiliyaa",
      // EN: Sofas, a marble-topped table, the kitchen counter and the fireplace.",
      desc: "Soofata, ibinabaradiyan kamettida xarapheezzaa, kushiinan de'iyaa miishshata dooriyo sohuwaanne tama eettiyoo sohuwaa.",
    },
    vipKitchen: {
      // EN: The VIP Kitchen
      title: "VIP Kushiinaa",
      // EN: Carved wooden cupboards, a marble counter and a sink: a kitchen of your own to cook in.
      desc: "Mittaappe giigida eqo saaxineta, ibinabaradiyaappe giigida xarapheezzaanne meecciyoo ollaa: ne niiyoo kattiyoo kushiinaa. ",
    },
    vipCooking: {
      // EN: Cook It Yourself
      title: "Ne Huuphen Katta",
      // EN: A double sink with running water and an electric stove, ready for the family meal.
      desc: "So asay kattaa kattanawu giigi uttida goggiyaa haattay de'iyoo naa\"u karetta meecciyo ollatanne koorintte coociyaa.",
    },
    vipShower: {
      // EN: Shower Room
      title: "Bollaa Meeceetiyo Kifiliyaa",
      // EN: A rain shower, a round mirror and warm lamps on marble-patterned tiles.
      desc: "Iraa haattan bollaa meechchaa, ibinabaradiyan kamettida xarapheezzaa bollan de'iyaa irzzo heregaanne xomppeta.",
    },
    vipBasin: {
      // EN: Washbasin
      title: "Kushiyaanne Som\"uwaa Meecettiyoosaa",
      // EN: A white basin and a bright tap, kept spotless for every guest.
      desc: "Yiyaa yiyaa imattawu geeshshaa mulxxuxxi uttida bootta meecciyoosaanne pholqqommiyaa haattaa bombbaa.",
    },
    vipToilet: {
      // EN: Private Rest Room
      title: "Buzo Shemppiyoo Kifiliyaa",
      // EN: A clean, modern rest room, tiled from floor to ceiling.
      desc: "Sa'aappe biidi kaaraa gakkanaassi bootta shuchchan puulattida, geeshsha buzo shemppiyoo kifiliyaa.",
    },
    eventElders: {
      // EN: Elders Under the Great Tree
      title: "Cimati, Gita Mittaa Garssan",
      // EN: Elders in traditional Wolaita dress sit in the shade before the thatched house, welcoming their guests.
      desc: "Wolaytta wogaa maayuwaa maayida cimati maata keettaa sinttan kuwaa giddon uttidi, bantta imattata mokkiiddi de'oosona.",
    },
    eventGathering: {
      // EN: A Meeting in the Open Air
      title: "Kareera Carkkiyaasan Yaa'iyoogaa",
      // EN: A speaker addresses guests at a long table dressed in Wolaita cloth, in the shade of a tree.",
      desc: "Mittaa kuwaa giddon Wolaytta carqqiyan kamettida adussa xarapheezzaa yuushuwan uttida imattatussi haasayiiddi de'ees.",
    },
    eventCelebration: {
      // EN: A Day to Celebrate
      title: "Galatiyo Gallassaa",
      // EN: Friends clap around a cake and a great traditional loaf, with the thatched pavilion behind them.",
      desc: "Laggeti keekkiyaanne wogga daabbuwaa yuushuwan kushiyaa baqqiiddi; guyye baggaara maata keettay de'ees.",
    },
    eventGames: {
      // EN: Games on the Lawn
      title: "Qooruwan Kaassaa",
      // EN: After the meal, guests play and laugh together on the wide green lawn.",
      desc: "Qumaappe guyyiyan, imattati aaho qooruwan issippe kaa'oosonanne miiccoosona.",
    },
  },
};

export default page;
