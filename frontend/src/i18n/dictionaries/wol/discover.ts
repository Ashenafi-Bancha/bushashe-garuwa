import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Discover page
 * See it on the site: /discover
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  discover: {
    hero: {
      // EN: Who We Are
      eyebrow: "Nu Oonee",
      // EN: Discover Bushaashe Garuwa
      title: "Bushaashe Garuwaara Erettite",
    },
    story: {
      // EN: Our Story
      eyebrow: "Nu Taarikiya",
      // EN: A Heritage That Lives and Breathes
      title: "De'iyaanne Shemppiyaa Buquraa",
      // EN: Bushaashe Garuwa was not built as a destination. It grew as a family, generation by generation, rooted in the soil of Wolaita, shaped by its history, and sustained by its culture.
      p1: "Bushaashe Garoy soho xalla giyoogan gidenna keexettidoy. Wolaytta biittaa bollan xaphuwaa yeddidi, taarikiyan giigidinne zemppidi issi so asadan yeletan yeletan dicciiddi yiis.",
      // EN: What began as a family homestead became a place of cultural preservation. What was preserved became a heritage. What became a heritage became an invitation: to visitors, students, researchers, and anyone curious about the depth and beauty of Wolaita culture.
      p2: "Issi keettaa asay de'iyoo sohodan doommidaagee ha\"i kaalli xeellidi naagiyoo soho gidiis. Kaalli xeellidi naagidoogee qassikka buqura gidiis. Buqura gididaagee xomoosiyaageeta, tamaareta, pilgganchchatanne Wolaytta wogaa ciimmatettaanne puulaa eranawu koyyiyaa oonanne baakko shoobbiya soho gidiis.",
    },
    mission: {
      // EN: Our Mission
      label: "Nu Kiitay",
      // EN: To Preserve, Share and Celebrate Wolaita Heritage
      title: "Wolaytta Buquraa Naagiyoogaa, haratuyyoo Shaakkiyoogaanne Bonchchiyoogaa.",
      // EN: We preserve the cultural, historical, and natural heritage of Wolaita and make it accessible to all, through authentic experiences, education, and living community participation.
      text: "Wolaytta wogaanne mereta imota gidida buquraa naageettes; qassikka tumu meeziyan, timirttiyaaninne dere asa shiiquwan ubbawu dooya oottiyoogaa.",
    },
    vision: {
      // EN: Our Vision
      label: "Nu Wode Aymoy",
      // EN: A Living Heritage, Celebrated by the World
      title: "Alamiyan Bonchchettiyaa Boshettenna Buquraa",
      // EN: We envision Bushaashe Garuwa as the leading cultural heritage destination in Southern Ethiopia, a place where Wolaita knowledge, culture and community continue to thrive and inspire.
      text: "Nu amoykka Bushaashe Garoy Tohossa Toophphiyaa giddon wogaa buqura sohotuppe sintta xeera gidana malanne qassikka Wolaytta eray, wogaynne deree ciiyyiiddinne ayfiiddi sinttawu baana mala.",
    },
    pillars: {
      // EN: Why Bushaashe Garuwa?
      eyebrow: "Ayssi Bushaashe Garoy?",
      // EN: Four Reasons to Come
      title: "Yaanawu Oyddu Gaasoti",
      items: {
        heritage: {
          // EN: Heritage
          title: "Buqura",
          // EN: Four generations of Wolaita family history, cultural houses, artifacts and oral traditions preserved in one living destination.
          desc: "Issi sohuwan naagetti uttida oyddu Wolaytta yeletatu haydaa, keettata, buquratenne doonaa taariketa.",
        },
        nature: {
          // EN: Nature
          title: "Mereta",
          // EN: Ancient trees, heritage plants, animals, and the natural landscape of Wolaita, all within the Bushaashe Garuwa grounds.
          desc: "Bushaashe Garuwaa giddon de'iyaa mayzza mittata, dozata, medoosatanne mereta Wolaytta biittaa utettaa.",
        },
        knowledge: {
          // EN: Knowledge
          title: "Era",
          // EN: Oral histories and traditional knowledge of Wolaita culture, language and farming, kept by the family and shared with visitors.
          desc: "So asan naagettidanne xomoosiyaageetussi shaakkiyoo doonaa haydata, beni Wolaytta wogaa, qaalaanne goshshaa erata.",
        },
        hospitality: {
          // EN: Hospitality
          title: "Imattaa Mohuwaa",
          // EN: Authentic Wolaita food, a welcoming guesthouse, a warm restaurant and the genuine hospitality of our family.
          desc: "Tumu Wolaytta qumaa, mokki ekkiyaa imatta keettaa, hombbocettay de'iyoo katta keettaanne ufayssiyaa nu soo asaa imattaa mohuwaa.",
        },
      },
    },
    cta: {
      // EN: Bushaashe Garuwa is waiting for you. Plan your visit and begin your journey into Wolaita heritage.
      desc: "Bushaashe Garoy inttena naagees. Xomoosonawu keeruwaa oyttidi Wolaytta buquraa sohuwaakko hemetaa doommite.",
      // EN: Explore Heritage
      explore: "Buquraa Be'ite",
    },
  },
};

export default page;
