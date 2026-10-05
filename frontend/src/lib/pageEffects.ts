import { animate } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onSmoothScroll } from './motion';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The scroll effects of one page, set up when the page appears and removed when
 * it leaves:
 *
 *   - content rises into view as it is reached
 *   - rows and grids of cards and photographs (marked `data-wave`) arrive in a
 *     wave, each a moment after its neighbour (anime.js)
 *   - on computers, the opening photograph and the photographs behind text
 *     drift more slowly than the page (parallax)
 *   - the two rows of large words slide in opposite directions with the scroll
 *   - a thin line across the top shows how far down the page you are
 *
 * Only `transform` and `opacity` are animated, so it stays smooth on phones.
 * Nothing moves for visitors who asked their device for less motion.
 *
 * This module is loaded after the page has appeared (it is kept out of the
 * first download), so whatever is already on screen is left alone: only content
 * still below the screen is set to rise.
 */
export function pageEffects(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};

  const media = gsap.matchMedia();
  const stopListening = onSmoothScroll(ScrollTrigger.update);
  const belowScreen = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
  // cards waiting for their wave, so their starting look can be taken off again when the page is left
  const waiting: HTMLElement[] = [];
  const settle = (el: HTMLElement) => {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  };
  const context = gsap.context(() => {
    /* ── content rises into view ── */
    const rise = (all: Element[], trigger: Element) => {
      const targets = all.filter(belowScreen);
      if (targets.length === 0) return;
      gsap.set(targets, { autoAlpha: 0, y: 36 });
      ScrollTrigger.create({
        trigger,
        start: 'top 86%',
        once: true,
        onEnter: () =>
          gsap.to(targets, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity,visibility' }),
      });
    };

    // pieces marked by the page itself, revealed in the groups they arrive in
    const marked = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !el.closest('[data-wave]') && belowScreen(el));
    if (marked.length > 0) {
      gsap.set(marked, { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch(marked, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true, clearProps: 'transform,opacity,visibility' }),
      });
    }

    // every other section after the opening one: its blocks rise one after another
    gsap.utils.toArray<HTMLElement>('main > section').forEach((section, index) => {
      if (index === 0 || section.querySelector('[data-reveal]')) return;
      const blocks = Array.from(section.querySelectorAll(':scope > div > *')).filter((el) => !el.matches('img, span, [data-wave]'));
      rise(blocks.length > 0 ? blocks : [section], section);
    });

    /* ── rows and grids of cards: a wave from the first card outward ── */
    gsap.utils.toArray<HTMLElement>('[data-wave]').forEach((group) => {
      const cards = (Array.from(group.children) as HTMLElement[]).filter(belowScreen);
      if (cards.length === 0) return;
      cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(44px) scale(0.94)';
        // a card's own hover transition would lag behind the wave, so it rests until the wave is done
        card.style.transition = 'none';
      });
      waiting.push(...cards);
      ScrollTrigger.create({
        trigger: group,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          // each card waits by how far it lies from the first one, across and down, whatever the layout:
          // one row to swipe on a phone, columns on a computer, tiles of different sizes in the gallery
          const first = cards[0]!.getBoundingClientRect();
          const waits = cards.map((card) => {
            const box = card.getBoundingClientRect();
            const steps = (box.left - first.left) / Math.max(first.width, 1) + (box.top - first.top) / Math.max(first.height, 1);
            return Math.min(900, Math.max(0, steps) * 110);
          });
          animate(cards, {
            opacity: [0, 1],
            y: [44, 0],
            scale: [0.94, 1],
            duration: 850,
            ease: 'outExpo',
            delay: (_card, index) => waits[index ?? 0] ?? 0,
            onComplete: () => cards.forEach(settle),
          });
        },
      });
    });

    /* ── the two rows of large words ── */
    gsap.utils.toArray<HTMLElement>('[data-strip]').forEach((row) => {
      const toLeft = row.dataset.strip === 'left';
      gsap.fromTo(
        row,
        { xPercent: toLeft ? 0 : -22 },
        { xPercent: toLeft ? -22 : 0, ease: 'none', scrollTrigger: { trigger: row.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
      );
    });

    /* ── how far down the page ── */
    const bar = document.getElementById('scroll-progress');
    if (bar) {
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.3 } });
    }

    /* ── computers: photographs drift more slowly than the page ── */
    media.add('(min-width: 1024px)', () => {
      const hero = root.querySelector('.hero-slide')?.parentElement;
      if (hero) {
        // a variable, so each new photograph of the slideshow follows it too
        gsap.fromTo(hero, { '--hero-y': '0%' }, { '--hero-y': '16%', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
      gsap.utils.toArray<HTMLImageElement>('main img.absolute.inset-0').forEach((photo) => {
        const frame = photo.parentElement;
        if (!frame || photo.closest('.hero-slide')) return;
        gsap.set(frame, { overflow: 'hidden' });
        gsap.fromTo(
          photo,
          { yPercent: -8, scale: 1.16 },
          { yPercent: 8, scale: 1.16, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    });
  }, root);

  // photographs and live data change the page's height after it appears
  let timer = 0;
  const watcher = new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  watcher.observe(root);

  return () => {
    stopListening();
    waiting.forEach(settle);
    window.clearTimeout(timer);
    watcher.disconnect();
    media.revert();
    context.revert();
    const bar = document.getElementById('scroll-progress');
    if (bar) gsap.set(bar, { scaleX: 0 });
  };
}
