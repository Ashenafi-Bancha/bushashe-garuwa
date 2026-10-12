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
    // EN: Coming soon
    soon: "",
    // EN: Planned. Not open yet.
    soonNote: "",
    // EN: What's included
    showIncluded: "",
    // EN: Hide details
    hideDetails: "",
    items: {
      food: {
        // EN: Cultural Food Experience
        title: "",
        // EN: Taste authentic Wolaita cuisine
        sub: "",
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
        // EN: Traditional Coffee Ceremony
        title: "",
        // EN: The sacred Ethiopian ritual
        sub: "",
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
        // EN: Cultural Music and Dance Performance
        title: "",
        // EN: Wolaita music, song and dance
        sub: "",
        // EN: Traditional Wolaita music, song and ceremonial dance, performed on the grounds. The performances are planned and will be announced here when they begin.
        desc: "",
        includes: [
          // EN: Traditional music
          "",
          // EN: Cultural dance
          "",
        ],
      },
      workshop: {
        // EN: Cultural Skills Workshop
        title: "",
        // EN: Weaving and other Wolaita skills
        sub: "",
        // EN: Hands-on workshops in weaving and other traditional Wolaita skills are being prepared. They are planned and not open yet.
        desc: "",
        includes: [
          // EN: Weaving
          "",
          // EN: Other traditional skills
          "",
        ],
      },
      tour: {
        // EN: Heritage Tour
        title: "",
        // EN: A guided walk through history
        sub: "",
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
      horse: {
        // EN: Horseback Riding
        title: "",
        // EN: Ride across the great lawn
        sub: "",
        // EN: Horses are kept at Bushaashe Garuwa and wait on the great lawn for visitors who would like to ride. Ask when you arrive, or tell us when you book your visit.
        desc: "",
        includes: [
          // EN: A horse from the grounds
          "",
          // EN: A ride on the great lawn
          "",
        ],
      },
      education: {
        // EN: Educational Visit
        title: "",
        // EN: Learning through experience
        sub: "",
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
