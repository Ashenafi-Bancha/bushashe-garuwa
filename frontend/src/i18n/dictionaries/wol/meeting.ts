import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · Meeting Hall page
 * See it on the site: /meeting-hall
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
  meeting: {
    hero: {
      // EN: Meeting Hall
      eyebrow: "",
      // EN: A Hall for Your Gathering
      title: "",
      // EN: A hall on the heritage grounds for meetings, trainings, weddings and family days, with food and coffee from our kitchen.
      desc: "",
    },
    intro: {
      // EN: What It Is For
      eyebrow: "",
      // EN: One Hall, Many Occasions
      title: "",
      // EN: The hall is set with rows of chairs dressed in white with bands of Wolaita pattern. Outside are the gardens, the lawns and the cultural houses, so a working day or a celebration can also be a visit.
      text: "",
    },
    uses: {
      meetings: {
        // EN: Meetings
        title: "",
        // EN: For organisations, offices and community groups.
        desc: "",
      },
      trainings: {
        // EN: Trainings & Workshops
        title: "",
        // EN: Room to sit, listen and work, with quiet grounds outside.
        desc: "",
      },
      education: {
        // EN: Education
        title: "",
        // EN: Lessons and talks for schools, universities and study groups.
        desc: "",
      },
      weddings: {
        // EN: Weddings
        title: "",
        // EN: A hall for the ceremony or the meal, and the gardens for photographs.
        desc: "",
      },
      family: {
        // EN: Family Gatherings
        title: "",
        // EN: Bring the whole family together for a day.
        desc: "",
      },
      anniversaries: {
        // EN: Anniversaries & Celebrations
        title: "",
        // EN: Birthdays, anniversaries and other days worth marking.
        desc: "",
      },
      visitors: {
        // EN: Visitor Groups
        title: "",
        // EN: A place for groups to gather and eat before or after the heritage walk.
        desc: "",
      },
    },
    // EN: The Hall and the Grounds
    photosTitle: "",
    cta: {
      // EN: Would You Like to Use the Hall?
      title: "",
      // EN: Call or write to us with the date and the number of people, and we will arrange it with you.
      text: "",
    },
  },
};

export default page;
