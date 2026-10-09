import { Children, type ReactNode } from 'react';

/**
 * A set of cards: on phones one below the other, so nothing has to be swiped
 * sideways to be seen; from tablets up (md) they sit in the grid given.
 */
export default function CardGrid({
  children,
  grid = 'md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-4 md:gap-5',
}: {
  children: ReactNode;
  /** columns from md up, e.g. 'md:grid-cols-2 lg:grid-cols-3' */
  grid?: string;
  gap?: string;
}) {
  return (
    <div data-wave className={`grid grid-cols-1 ${gap} ${grid}`}>
      {Children.toArray(children).map((child, i) => (
        <div key={i} className="min-w-0">
          {child}
        </div>
      ))}
    </div>
  );
}
