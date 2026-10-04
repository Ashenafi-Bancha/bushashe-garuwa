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
      eyebrow: "",
      // EN: Experience Wolaita in Bushaashe Garuwa
      title: "",
    },
    // EN: Bushaashe Garuwa is not simply observed; it is experienced. Each of our visitor experiences is designed to create a genuine, respectful and memorable encounter with living Wolaita culture.
    intro: "",
    // EN: Duration
    duration: "",
    // EN: What's included
    showIncluded: "",
    // EN: Hide details
    hideDetails: "",
    items: {
      food: {
        // EN: Food Experience
        title: "",
        // EN: Taste authentic Wolaita cuisine
        sub: "",
        // EN: 2–3 hours
        duration: "",
        // EN: Gather around the communal table and experience traditional Wolaita cooking. Taste dishes prepared with ancient recipes, learn about the ingredients, and share a meal with our family.
        desc: "",
        includes: [
          // EN: Welcome coffee ceremony
          "",
          // EN: Guided cooking demonstration
          "",
          // EN: Full traditional meal
          "",
          // EN: Recipe card to take home
          "",
        ],
      },
      coffee: {
        // EN: Coffee Ceremony
        title: "",
        // EN: The sacred Ethiopian ritual
        sub: "",
        // EN: 1 hour
        duration: "",
        // EN: Experience the Ethiopian coffee ceremony as it has been performed for generations. Our host will guide you through the roasting, brewing and serving ritual with authentic Wolaita hospitality.
        desc: "",
        includes: [
          // EN: Three rounds of coffee
          "",
          // EN: Traditional snacks
          "",
          // EN: Cultural explanation
          "",
          // EN: Communal experience
          "",
        ],
      },
      performance: {
        // EN: Cultural Performance
        title: "",
        // EN: Music, dance and storytelling
        sub: "",
        // EN: 1.5 hours
        duration: "",
        // EN: Watch traditional Wolaita musicians and dancers perform ceremonies, songs and dances that have been passed through generations. Hear elders tell oral histories in Wolaytta.
        desc: "",
        includes: [
          // EN: Traditional music performance
          "",
          // EN: Cultural dance
          "",
          // EN: Oral history session
          "",
          // EN: Q&A with performers
          "",
        ],
      },
      tour: {
        // EN: Heritage Tour
        title: "",
        // EN: A guided walk through history
        sub: "",
        // EN: 3–4 hours
        duration: "",
        // EN: Walk through the entire Bushaashe Garuwa heritage site with an expert guide. Visit cultural houses, ancient trees, the artifact collection, and hear the stories connected to each location.
        desc: "",
        includes: [
          // EN: Expert heritage guide
          "",
          // EN: Cultural houses visit
          "",
          // EN: Ancient tree tour
          "",
          // EN: Artifact viewing
          "",
          // EN: Traditional tea break
          "",
        ],
      },
      education: {
        // EN: Educational Visit
        title: "",
        // EN: Learning through experience
        sub: "",
        // EN: Half or full day
        duration: "",
        // EN: Structured educational experiences for schools, universities and research groups. Tailored to different age groups and academic interests, with hands-on cultural activities.
        desc: "",
        includes: [
          // EN: Structured educational program
          "",
          // EN: Hands-on activities
          "",
          // EN: Learning materials
          "",
          // EN: Certificate of participation
          "",
          // EN: Guided discussions
          "",
        ],
      },
      photography: {
        // EN: Photography Experience
        title: "",
        // EN: Capture the living heritage
        sub: "",
        // EN: 3 hours
        duration: "",
        // EN: A guided photography experience through the most visually striking locations of Bushaashe Garuwa: cultural houses, heritage trees, cultural performances and authentic daily life.
        desc: "",
        includes: [
          // EN: Photography guide
          "",
          // EN: Access to all heritage areas
          "",
          // EN: Portrait sessions with traditional dress
          "",
          // EN: Best viewpoint guidance
          "",
        ],
      },
      family: {
        // EN: Family Heritage Tour
        title: "",
        // EN: Discover the family story together
        sub: "",
        // EN: 4 hours
        duration: "",
        // EN: A special tour designed for families, blending storytelling, nature walks, cultural activities and food in a relaxed, multi-generational experience.
        desc: "",
        includes: [
          // EN: Family-friendly program
          "",
          // EN: Nature walk
          "",
          // EN: Storytelling session for children
          "",
          // EN: Traditional meal
          "",
          // EN: Family portrait
          "",
        ],
      },
    },
    cta: {
      // EN: Not sure where to start?
      title: "",
      // EN: Contact us and we'll help you design the Bushaashe Garuwa experience that's right for you.
      desc: "",
    },
  },
};

export default page;
