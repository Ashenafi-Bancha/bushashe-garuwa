import { Children, useRef, useState, type ReactNode } from 'react';

/**
 * On phones, a row of cards to swipe sideways, with a small bar showing how far
 * along you are; from tablets up (md) the same cards sit in the grid given.
 * Keeps long lists short on a phone, where most visitors are.
 */
export default function SwipeRow({
  children,
  grid = 'md:grid-cols-2 lg:grid-cols-3',
  item = 'w-[80vw] sm:w-[58vw]',
  gap = 'gap-4 md:gap-5',
  dark = false,
}: {
  children: ReactNode;
  /** columns from md up, e.g. 'md:grid-cols-2 lg:grid-cols-3' */
  grid?: string;
  /** width of each card on phones */
  item?: string;
  gap?: string;
  /** on a dark section: a light progress bar */
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const items = Children.toArray(children);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const room = el.scrollWidth - el.clientWidth;
    setProgress(room > 0 ? el.scrollLeft / room : 0);
  };

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        data-wave
        className={`scroll-smooth-x flex md:grid md:overflow-visible -mx-5 px-5 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 scroll-px-5 sm:scroll-px-8 ${gap} ${grid}`}
      >
        {items.map((child, i) => (
          <div key={i} className={`snap-start flex-shrink-0 md:w-auto ${item}`}>
            {child}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className={`md:hidden mt-5 mx-auto w-20 h-1 rounded-full overflow-hidden ${dark ? 'bg-white/15' : 'bg-[#1E3A29]/10'}`} aria-hidden="true">
          <span
            className={`block h-full rounded-full transition-[margin] duration-150 ${dark ? 'bg-[#B9D38A]' : 'bg-[#0E8A50]'}`}
            style={{ width: `${100 / Math.min(items.length, 4)}%`, marginLeft: `${progress * (100 - 100 / Math.min(items.length, 4))}%` }}
          />
        </div>
      )}
    </div>
  );
}
