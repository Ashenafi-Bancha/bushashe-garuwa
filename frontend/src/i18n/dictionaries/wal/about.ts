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
      eyebrow: "",
      // EN: A Heritage Built
      titleA: "",
      // EN: Generation by Generation
      titleB: "",
      // EN: Bushaashe Garuwa heritage
      imgAlt: "",
    },
    who: {
      // EN: Who We Are
      eyebrow: "",
      // EN: More Than a Place: A Living Story
      title: "",
      // EN: Bushaashe Garuwa is a living Wolaita heritage destination in Damot Sore Woreda, Wolaita Zone, Ethiopia: a beautifully developed eco-tourism site, cultivated and cared for by the Bushaashe family. We are more than a museum, a resort, or a tourist attraction; we are a family heritage that has been tended and passed down across four generations.
      p1: "",
      // EN: The name Bushaashe (sometimes written Bushashe) is a family name, and today it is also known across Wolaita as the name of a cultural landmark.
      name: "",
      // EN: What began as a family homestead, with its trees, houses, animals, and traditions, has grown into a place where the whole world can come and experience the depth, beauty, and wisdom of Wolaita culture.
      p2: "",
      // EN: From our cultural houses and ancient trees, to the reading place, oral histories, traditional food, and guesthouse: every element of Bushaashe Garuwa exists to honor the past, celebrate the present, and protect the future of Wolaita heritage.
      p3: "",
      // EN: Bushaashe Garuwa is also a gathering place for the region: it hosts cultural celebrations, including the eve of Gifaataa, the traditional New Year festival of the Wolaita people.
      festival: "",
      // EN: Generations
      generations: "",
      // EN: Years of Heritage
      years: "",
      // EN: Since the 18th century
      since: "",
    },
    purpose: {
      // EN: Our Purpose
      eyebrow: "",
      // EN: Mission & Vision
      title: "",
      // EN: Our Mission
      missionLabel: "",
      // EN: To Honor, Preserve, and Share the Living Heritage of Wolaita
      missionTitle: "",
      // EN: Our mission is to preserve and celebrate the cultural, historical, natural, and oral heritage of the Wolaita people, and to make that heritage accessible, meaningful, and alive for every generation.
      missionP1: "",
      // EN: We do this through authentic cultural experiences, a living heritage site, oral histories, traditional food, community engagement, and education, all grounded in the spirit of our ancestors and the warmth of Wolaita hospitality.
      missionP2: "",
      // EN: Our Vision
      visionLabel: "",
      // EN: Wolaita Heritage Celebrated by Ethiopia and the World
      visionTitle: "",
      // EN: We envision Bushaashe Garuwa as the leading cultural heritage destination of Southern Ethiopia, a place recognized nationally and internationally as a model of authentic heritage preservation, community pride, and cultural tourism done with integrity.
      visionP1: "",
      // EN: We envision a future where every child in Wolaita knows their heritage, where researchers and travelers come from around the world to experience it, and where the wisdom of our ancestors continues to shape the lives of generations yet to come.
      visionP2: "",
      tags: [
        // EN: Authentic
        "",
        // EN: Educational
        "",
        // EN: Community-led
        "",
        // EN: Sustainable
        "",
        // EN: Celebrated
        "",
      ],
    },
    values: {
      // EN: What Guides Us
      eyebrow: "",
      // EN: Our Values
      title: "",
      items: {
        authenticity: {
          // EN: Authenticity
          title: "",
          // EN: We present Wolaita heritage exactly as it is, without performance, without distortion. Every story we tell, every tradition we share, every experience we offer is rooted in lived truth.
          desc: "",
        },
        respect: {
          // EN: Respect
          title: "",
          // EN: We hold our ancestors, their knowledge, and their way of life in the highest regard. Visitors are welcomed as guests into a living heritage, and we ask that this respect is shared.
          desc: "",
        },
        preservation: {
          // EN: Preservation
          title: "",
          // EN: We believe that what is not preserved is lost. Our oral history collection and heritage site exist so that future generations inherit what past generations built.
          desc: "",
        },
        continuity: {
          // EN: Continuity
          title: "",
          // EN: Heritage is not a museum piece. It is a living practice. We actively pass Wolaita knowledge, traditions, and culture to the next generation through education, experience, and community.
          desc: "",
        },
        hospitality: {
          // EN: Hospitality
          title: "",
          // EN: In Wolaita culture, a guest is a blessing. Every visitor to Bushaashe Garuwa is received with genuine warmth, care, and the spirit of community that defines our people.
          desc: "",
        },
        education: {
          // EN: Education
          title: "",
          // EN: Knowledge shared is knowledge multiplied. We welcome schools, universities, researchers, and curious visitors to learn from the depth of Wolaita heritage and history.
          desc: "",
        },
      },
    },
    lineage: {
      // EN: The Family Line
      eyebrow: "",
      // EN: From Bushaashe to Today
      title: "",
      // EN: Bushaashe Garuwa bears the name of Bushaashe, the first father of this line. His story continued through Alambo and Garedew, and lives on today in the family that cares for the grounds. Choose a name to read their history.
      desc: "",
      // EN: The family is writing this history now. It will be published here soon.
      pending: "",
      people: {
        bushaashe: {
          // EN: Bushaashe
          name: "",
          // EN: First generation · The founder
          generation: "",
          // EN: 18th century
          period: "",
          // EN: 
          story: "",
        },
        alambo: {
          // EN: Alambo
          name: "",
          // EN: Second generation
          generation: "",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
        garedew: {
          // EN: Garedew
          name: "",
          // EN: Third generation
          generation: "",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
        current: {
          // EN: The Current Generation
          name: "",
          // EN: Today · Commissioner Fiseha Garedew and family
          generation: "",
          // EN: 
          period: "",
          // EN: 
          story: "",
        },
      },
    },
    offer: {
      // EN: What We Offer
      eyebrow: "",
      // EN: Everything in One Living Destination
      title: "",
      items: {
        // EN: Cultural Houses
        houses: "",
        // EN: Heritage Trees
        trees: "",
        // EN: Artifacts
        artifacts: "",
        // EN: Cultural Performances
        performances: "",
        // EN: The reading place
        reading: "",
        // EN: Traditional Food
        food: "",
        // EN: Coffee Ceremony
        coffee: "",
        // EN: Guesthouse
        guesthouse: "",
        // EN: Music & Dance
        music: "",
        // EN: Oral Histories
        stories: "",
      },
    },
    cta: {
      // EN: Bushaashe Garuwa is open to all who wish to experience, learn from, and celebrate the living heritage of Wolaita.
      desc: "",
    },
  },
};

export default page;
