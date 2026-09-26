import { useEffect, useState } from 'react';
import { videos } from '../assets/videos';

/**
 * Whether to play the silent film behind the home page title.
 *
 * It stays off when there is no film, when the visitor asked for less motion,
 * when the phone is saving data, and on slow connections, where the photo
 * slideshow is the better experience anyway.
 */
export function useHeroVideo(): boolean {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!videos.heroLoop) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    type Connection = { saveData?: boolean; effectiveType?: string };
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && !['4g', 'wifi'].includes(connection.effectiveType)) return;

    // let the page settle first: the photograph is already on screen
    const timer = setTimeout(() => setPlay(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return play;
}
