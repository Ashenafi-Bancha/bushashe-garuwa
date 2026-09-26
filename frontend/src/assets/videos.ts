/**
 * Films of Bushaashe Garuwa.
 *
 * HOW TO ADD THE HERO LOOP (the silent film behind the home page title)
 * 1. Put the original in  media-originals/video/hero-loop.mp4
 * 2. Run:  pnpm video      → writes a small web copy to src/assets/video/
 * 3. Import it below and set `heroLoop`
 * Keep it short (10–20 seconds), silent, and under about 6 MB, so it opens
 * quickly on a phone. The home page shows the photo slideshow until the film
 * has loaded, and on slow connections it never loads the film at all.
 *
 * HOW TO ADD THE MAIN FILM (the 1–2 minute story film)
 * Upload it to the Bushaashe Garuwa YouTube channel and put its id in `story`,
 * for example  https://www.youtube.com/watch?v=ABC123xyz  →  story: 'ABC123xyz'
 * A long film in the repository would slow the whole website down.
 */

export const videos = {
  /** Silent loop behind the home page title; undefined until the file is added */
  heroLoop: undefined as string | undefined,
  /** Poster frame shown before the film plays; falls back to a photo */
  storyPoster: undefined as string | undefined,
  /** YouTube id of the story film, e.g. 'ABC123xyz' */
  story: undefined as string | undefined,
};

export const hasHeroVideo = () => Boolean(videos.heroLoop);
export const hasStoryFilm = () => Boolean(videos.story);
