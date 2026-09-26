import { useState } from 'react';
import { photos } from '../assets/photos';
import { videos } from '../assets/videos';
import { useI18n } from '../i18n/I18nProvider';

/**
 * The story film. Nothing is loaded from YouTube until the visitor presses play,
 * so the page stays fast and no one is tracked for simply opening the site.
 * The section hides itself until a film id is set in src/assets/videos.ts.
 */
export default function StoryFilm() {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const film = t.home.film;

  if (!videos.story) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow bg-[#A65A3A]/10 text-[#A65A3A] mb-5">{film.eyebrow}</span>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0e2820] leading-[1.05] mb-4">{film.title}</h2>
          <p className="text-[#1D211E]/65 text-base sm:text-lg leading-relaxed">{film.desc}</p>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden bg-[#0a1f19] aspect-video shadow-[0_40px_80px_-40px_rgba(14,40,32,0.6)]">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videos.story}?autoplay=1&rel=0&modestbranding=1`}
              title={film.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full">
              <img
                src={videos.storyPoster ?? photos.home}
                alt={t.photos.home}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-[#0a1f19]/35 group-hover:bg-[#0a1f19]/25 transition-colors" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="w-20 h-20 rounded-full bg-[#C99A45] text-[#0e2820] flex items-center justify-center shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-white font-semibold tracking-wide">{film.play}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
