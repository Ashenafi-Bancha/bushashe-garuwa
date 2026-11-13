import type { HTMLAttributes } from 'react';
import GreenEdge from './GreenEdge';

const TONES = { sage: '#E3EBD8', green: '#3F7D20' } as const;

/**
 * A coloured band across the page, shaped like the footer: the top-left corner
 * rises and the bottom-right corner hangs down. `className` styles the coloured
 * part (padding, layout); `outer` styles the whole band (its margin).
 */
export default function Band({ tone = 'sage', className = '', outer = '', children, ...rest }: HTMLAttributes<HTMLElement> & { tone?: keyof typeof TONES; outer?: string }) {
  const color = TONES[tone];
  return (
    <section {...rest} className={`relative ${outer}`}>
      <GreenEdge color={color} />
      <div className={`${tone === 'green' ? 'band-green' : ''} ${className}`} style={{ background: color }}>
        {children}
      </div>
      <GreenEdge color={color} flip />
    </section>
  );
}
