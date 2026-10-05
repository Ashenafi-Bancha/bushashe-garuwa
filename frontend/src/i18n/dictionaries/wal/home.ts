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
      title: "",
      // EN: Where Wolaita Culture, Traditions & Heritage Live On.
      subtitle: "",
      // EN: Honoring Our Ancestors,
      sloganA: "",
      // EN: Preserving Our Heritage,
      sloganB: "",
      // EN: and Passing It On to Future Generations.
      sloganC: "",
      // EN: Explore Bushaashe Garuwa
      explore: "",
      // EN: Scroll to Explore
      scroll: "",
      // EN: Slide {n}
      slide: "",
      // EN: Generations
      statGenerations: "",
      // EN: Years of heritage
      statYears: "",
      // EN: Since the 18th century
      sinceCentury: "",
      // EN: WOLAITA · HERITAGE · NATURE · CULTURE · 
      badge: "",
      // EN: Next photograph
      next: "",
      // EN: A family heritage place in Damot Sore, near Gununo, kept for four generations.
      lead: "",
      // EN: Walk the land of our forefathers
      walk: "",
      // EN: Book Your Stay
      book: "",
      // EN: Explore Our Heritage
      heritage: "",
      // EN: Nature sounds
      sound: "",
    },
    testimonials: {
      // EN: Guests
      eyebrow: "",
      // EN: What Our Guests Say
      title: "",
    },
    film: {
      // EN: Watch
      eyebrow: "",
      // EN: A Film of Bushaashe Garuwa
      title: "",
      // EN: A short walk through the grounds, the cultural houses and a Gifaataa celebration.
      desc: "",
      // EN: Play the film
      play: "",
    },
    ring: {
      // EN: Step inside
      eyebrow: "",
      // EN: Turn the grounds in your hand
      title: "",
      // EN: Drag the photographs to walk around Bushaashe Garuwa.
      desc: "",
      // EN: Turn to the previous photograph
      previous: "",
      // EN: Turn to the next photograph
      next: "",
      // EN: Open the gallery
      cta: "",
      // EN: Drag, swipe, or use the arrows
      hint: "",
    },
    quick: {
      // EN: Find your way
      eyebrow: "",
      // EN: Everything at Bushaashe Garuwa
      title: "",
      // EN: Every part of Bushaashe Garuwa, one step away.
      desc: "",
      items: {
        // EN: Cultural houses, ancient trees and the family story.
        heritage: "",
        // EN: Food, coffee, music, dance and guided tours.
        experiences: "",
        // EN: Cultural food evenings twice a month, and Gifaataa.
        events: "",
        // EN: A guest house among the gardens. Coming soon.
        stay: "",
        // EN: Wolaita and Ethiopian dishes, cooked with care.
        dine: "",
        // EN: Opening hours, directions and booking a visit.
        visit: "",
        // EN: The grounds, the houses and the celebrations in photos.
        gallery: "",
        // EN: Who we are and why we keep this place.
        about: "",
      },
    },
    marquee: [
      // EN: Heritage
      "",
      // EN: Nature
      "",
      // EN: Culture
      "",
      // EN: Food
      "",
      // EN: Gifaataa
      "",
      // EN: Stay
      "",
    ],
    facts: {
      items: [
        {
          // EN: 18th c.
          value: "",
          // EN: Where the story begins
          label: "",
        },
        {
          // EN: 4+
          value: "",
          // EN: Generations of the family
          label: "",
        },
        {
          // EN: 2
          value: "",
          // EN: Traditional Wolaita houses
          label: "",
        },
        {
          // EN: 1,800+
          value: "",
          // EN: Coffee trees on the grounds
          label: "",
        },
        {
          // EN: 2
          value: "",
          // EN: Cultural food evenings a month
          label: "",
        },
      ],
    },
    intro: {
      // EN: Our Purpose
      eyebrow: "",
      // EN: More Than a Destination
      title: "",
      // EN: Bushaashe Garuwa is a living Wolaita heritage destination, where generations of history, culture, and knowledge meet the warmth of genuine hospitality.
      p1: "",
      // EN: We are not a museum. We are a living family heritage that welcomes visitors to become part of our ongoing story. From cultural houses to the reading place in the gardens, from traditional food to oral histories, Bushaashe Garuwa is an experience unlike any other in Ethiopia.
      p2: "",
      pillars: [
        // EN: Heritage
        "",
        // EN: Nature
        "",
        // EN: Culture
        "",
        // EN: Hospitality
        "",
      ],
      // EN: Generations
      generations: "",
    },
    explore: {
      // EN: Four Worlds in One Place
      eyebrow: "",
      // EN: Explore Bushaashe Garuwa
      title: "",
      cards: {
        heritage: {
          // EN: Heritage
          title: "",
          // EN: History, family generations, cultural houses and artifacts
          sub: "",
        },
        nature: {
          // EN: Nature
          title: "",
          // EN: Trees, plants, animals and the living landscape
          sub: "",
        },
        culture: {
          // EN: Culture
          title: "",
          // EN: Food, music, dance, clothing and living traditions
          sub: "",
        },
        hospitality: {
          // EN: Hospitality
          title: "",
          // EN: Guesthouse, restaurant, bar and visitor services
          sub: "",
        },
      },
    },
    living: {
      // EN: In Every Corner
      eyebrow: "",
      // EN: A Living Heritage
      title: "",
      items: {
        houses: {
          // EN: Cultural Houses
          title: "",
          // EN: Gulanttaa Keettaa and Meeshsho Keettaa: two traditional Wolaita houses holding the tools of Wolaita life.
          desc: "",
        },
        trees: {
          // EN: Trees, Plants & Orchards
          title: "",
          // EN: Mango, apple, papaya, banana, more than 1,800 coffee trees, enset and fragrant garden plants.
          desc: "",
        },
        animals: {
          // EN: Animals & Zoo
          title: "",
          // EN: A small zoo of animals kept on the heritage grounds, a favourite with families.
          desc: "",
        },
        artifacts: {
          // EN: Cultural Artifacts
          title: "",
          // EN: Treasured objects of Wolaita craft, ceremony and daily life.
          desc: "",
        },
      },
    },
    timeline: {
      // EN: Our History
      eyebrow: "",
      // EN: A Journey Through Time
      title: "",
      items: [
        {
          // EN: The 1700s
          period: "",
          // EN: Roots
          label: "",
          // EN: The family's story in the Wolaita highlands begins in the 18th century.
          desc: "",
        },
        {
          // EN: 1940s
          period: "",
          // EN: First Houses
          label: "",
          // EN: Cultural houses built; heritage trees planted.
          desc: "",
        },
        {
          // EN: 1970s
          period: "",
          // EN: Preservation
          label: "",
          // EN: Oral histories and artifacts formally documented.
          desc: "",
        },
        {
          // EN: 1995
          period: "",
          // EN: Oral histories
          label: "",
          // EN: Elders recorded, and their stories written down.
          desc: "",
        },
        {
          // EN: Today
          period: "",
          // EN: Bushaashe Garuwa
          label: "",
          // EN: A living heritage destination, open to all.
          desc: "",
        },
      ],
      // EN: Explore Our History
      cta: "",
    },
    experiences: {
      // EN: Be Part of the Story
      eyebrow: "",
      // EN: Experience Wolaita in Bushaashe Garuwa
      title: "",
      items: {
        food: {
          // EN: Traditional Food
          title: "",
          // EN: Taste authentic Wolaita dishes prepared with generational recipes.
          desc: "",
        },
        coffee: {
          // EN: Coffee Ceremony
          title: "",
          // EN: Experience the sacred Ethiopian coffee ritual in its cultural setting.
          desc: "",
        },
        performance: {
          // EN: Cultural Performance
          title: "",
          // EN: Watch traditional Wolaita music, song and ceremonial dance.
          desc: "",
        },
        tour: {
          // EN: Heritage Tour
          title: "",
          // EN: Walk through generations of history with an expert guide.
          desc: "",
        },
        education: {
          // EN: Educational Visit
          title: "",
          // EN: Structured experiences for schools and universities.
          desc: "",
        },
        photography: {
          // EN: Photography Experience
          title: "",
          // EN: Capture heritage, nature and people in a living landscape.
          desc: "",
        },
      },
    },
    events: {
      // EN: Monthly Cultural Events
      eyebrow: "",
      // EN: Taste Wolaita in Bushaashe Garuwa
      title: "",
      // EN: Experience traditional Wolaita food and culture through our regular cultural food events.
      desc: "",
      // EN: All Events
      all: "",
      items: {
        food: {
          // EN: Oct 5, 2026
          date: "",
          // EN: Wolaita Cultural Food Experience
          name: "",
          // EN: Traditional dishes, coffee ceremony, music and storytelling around the fire.
          desc: "",
          // EN: Limited spaces
          avail: "",
        },
        harvest: {
          // EN: Oct 19, 2026
          date: "",
          // EN: Harvest Heritage Evening
          name: "",
          // EN: Celebrate the harvest with traditional food, dance and elder storytelling.
          desc: "",
          // EN: Open
          avail: "",
        },
      },
    },
    culturalFood: {
      // EN: Twice every month
      eyebrow: "",
      // EN: The Cultural Food Event
      title: "",
      // EN: Twice a month Bushaashe Garuwa opens its cultural houses for an evening of traditional Wolaita food, coffee, music and storytelling. Reserve your place and join us.
      desc: "",
      // EN: Together with {partner}
      partner: "",
      // EN: Next dates
      nextTitle: "",
      // EN: Reserve your place
      bookCta: "",
      // EN: See all events
      allCta: "",
      // EN: The next dates will be announced here soon.
      soon: "",
    },
    facilities: {
      // EN: On the Grounds
      eyebrow: "",
      // EN: Facilities & Services
      title: "",
      // EN: Beyond the heritage itself, Bushaashe Garuwa is a place to gather, learn and relax, for families, schools, organisations and travellers.
      desc: "",
      items: {
        meetingHall: {
          // EN: Meeting Hall
          title: "",
          // EN: A hall for meetings, trainings, workshops and community gatherings, with food and coffee served from our kitchen.
          desc: "",
        },
        zoo: {
          // EN: Zoo & Animals
          title: "",
          // EN: A small zoo where visitors (especially children and school groups) meet the animals kept on the grounds.
          desc: "",
        },
        pool: {
          // EN: Swimming Pool
          title: "",
          // EN: A swimming pool set among the gardens, for guests of the guesthouse and for day visitors.
          desc: "",
        },
        orchard: {
          // EN: Plants & Fruit Trees
          title: "",
          // EN: Mango, apple, papaya and banana trees, more than 1,800 coffee trees, enset, and traditional garden plants with wonderful scents.
          desc: "",
        },
        horses: {
          // EN: Horse Riding
          title: "",
          // EN: Horses wait on the great lawn for visitors who would like to ride.
          desc: "",
        },
        crocodile: {
          // EN: Crocodile Pond & Wildlife
          title: "",
          // EN: A properly fenced crocodile pond and an area where wild animals are cared for.
          desc: "",
        },
        fish: {
          // EN: Fish Pond
          title: "",
          // EN: A fish pond among the gardens, part of the working life of the grounds.
          desc: "",
        },
        guesthouse: {
          // EN: Guesthouse
          title: "",
          // EN: A planned service: rooms for an overnight stay inside the heritage site itself. Not open yet.
          desc: "",
        },
        restaurant: {
          // EN: Restaurant & Bar
          title: "",
          // EN: Wolaita and Ethiopian dishes, traditional drinks and the coffee ceremony, served all day.
          desc: "",
        },
      },
    },
    stay: {
      // EN: Guesthouse
      eyebrow: "",
      // EN: Stay Within the Story
      title: "",
      // EN: A guest house inside the heritage site is planned, so that visitors can stay overnight. It is not open yet.
      desc: "",
      rooms: {
        standard: {
          // EN: Standard Room
          name: "",
          // EN: Cultural touches, private bathroom, garden views.
          desc: "",
        },
        family: {
          // EN: Family Room
          name: "",
          // EN: Spacious with private outdoor area and heritage decor.
          desc: "",
        },
        heritage: {
          // EN: Heritage Room
          name: "",
          // EN: Full Wolaita immersion: our most special stay.
          desc: "",
        },
      },
      // EN: View Room
      viewRoom: "",
      // EN: Explore Guesthouse
      cta: "",
    },
    restaurant: {
      // EN: Restaurant
      eyebrow: "",
      // EN: Taste the Culture in Bushaashe Garuwa
      title: "",
      // EN: Our restaurant serves authentic Wolaita cuisine alongside Ethiopian classics, every dish rooted in tradition, prepared with care.
      desc: "",
      categories: [
        // EN: Wolaita Cuisine
        "",
        // EN: Ethiopian Cuisine
        "",
        // EN: Drinks
        "",
        // EN: Special Events
        "",
      ],
      // EN: Explore Restaurant
      cta: "",
    },
    stories: {
      // EN: Wolaita elder storyteller
      elderAlt: "",
      // EN: Oral History
      eyebrow: "",
      // EN: Stories Passed Down
      title: "",
      // EN: For generations, Wolaita knowledge has lived in words, spoken around fires, in homes, at ceremonies. Our oral history collection preserves these living stories.
      p1: "",
      // EN: Elders tell them in Wolaytta, Amharic and English. Each story is a window into a world that continues to shape Wolaita life today.
      p2: "",
      languages: [
        // EN: Wolaytta
        "",
        // EN: Amharic
        "",
        // EN: English
        "",
      ],
      // EN: Discover More Stories
      cta: "",
    },
    reading: {
      // EN: A quiet corner
      eyebrow: "",
      // EN: The Reading Place
      title: "",
      // EN: A quiet place in the gardens to sit with a book, where the only sounds are birds, wind in the trees and the day going by.
      desc: "",
      // EN: Look up from the page and Mount Damota stands before you, close enough to feel.
      mountain: "",
      // EN: Read with the mountain in front of you
      caption: "",
      qualities: [
        // EN: Quiet
        "",
        // EN: Shade and gardens
        "",
        // EN: A view of Mount Damota
        "",
        // EN: Open to visitors
        "",
      ],
      // EN: Plan your visit
      cta: "",
    },
    gallery: {
      // EN: Gallery
      eyebrow: "",
      // EN: Life at Bushaashe Garuwa
      title: "",
      // EN: Full Gallery
      full: "",
    },
    final: {
      // EN: Ready to Visit?
      eyebrow: "",
      // EN: Your Journey Starts Here
      title: "",
    },
  },
};

export default page;
