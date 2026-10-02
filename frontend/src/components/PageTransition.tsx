import { AnimatePresence, LazyMotion, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToHash, scrollToTop } from '../lib/motion';

/** Loaded after the page is on screen, so the first download stays small */
const loadMotion = () => import('../lib/motionFeatures').then((module) => module.default);

/**
 * One page on screen: it starts at the top (or at the #part asked for) and
 * gets its scroll effects, which are taken away again when it leaves.
 */
function Page({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  useLayoutEffect(() => {
    if (!window.location.hash) scrollToTop();
  }, []);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let gone = false;
    void import('../lib/pageEffects').then(({ pageEffects }) => {
      if (!gone && root.current) stop = pageEffects(root.current);
    });
    return () => {
      gone = true;
      stop?.();
    };
  }, []);

  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => scrollToHash(hash), 350);
    return () => clearTimeout(timer);
  }, [hash]);

  return <div ref={root}>{children}</div>;
}

/**
 * Moving between pages: the page you leave fades up and away, then the next one
 * rises softly into place. `children` receives the location to draw, so the old
 * page stays whole while it leaves.
 */
export default function PageTransition({ children }: { children: (location: ReturnType<typeof useLocation>) => ReactNode }) {
  const location = useLocation();
  const still = useReducedMotion();

  return (
    <LazyMotion features={loadMotion} strict>
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={location.pathname}
          initial={still ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
          exit={still ? undefined : { opacity: 0, y: -14, transition: { duration: 0.22, ease: 'easeIn' } }}
        >
          <Page>{children(location)}</Page>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
