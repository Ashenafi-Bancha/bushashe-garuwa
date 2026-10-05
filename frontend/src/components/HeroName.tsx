import { animate, stagger } from 'animejs';
import { useLayoutEffect, useRef } from 'react';

/**
 * The name "BUSHAASHE GARUWA" at the top of the home page, in the lettering of
 * the main gate. Its letters rise into place one after another (anime.js).
 *
 * Phones and tablets show it on two lines, computers on one (see .hero-name).
 * Screen readers are given the name once, whole. Visitors who asked their
 * device for less motion, and browsers where the script has not run, see the
 * plain rise of each line that the stylesheet provides.
 */
export default function HeroName({ title, className = '' }: { title: string; className?: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [firstWord = '', ...rest] = title.split(' ');
  const lines = [firstWord, rest.join(' ')].filter(Boolean);

  useLayoutEffect(() => {
    const el = heading.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.hero-letter'));
    // hand the entrance over from the stylesheet to the letter-by-letter one, before anything is painted
    el.classList.add('by-letter');
    letters.forEach((letter) => {
      letter.style.transform = 'translateY(115%)';
    });
    const rising = animate(letters, {
      y: ['115%', '0%'],
      duration: 950,
      ease: 'outExpo',
      delay: stagger(45, { start: 120 }),
    });
    return () => {
      rising.revert();
      el.classList.remove('by-letter');
      letters.forEach((letter) => {
        letter.style.transform = '';
      });
    };
  }, [title]);

  return (
    <h1 ref={heading} aria-label={title} className={`hero-name brand-sign brand-3d whitespace-nowrap leading-[1] ${className}`}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden="true">
          <span className={`line-mask ${i > 0 ? 'd2' : ''}`}>
            <span>
              {Array.from(line).map((letter, n) => (
                <span key={n} className="hero-letter">
                  {letter === ' ' ? ' ' : letter}
                </span>
              ))}
            </span>
          </span>
          {i < lines.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}
