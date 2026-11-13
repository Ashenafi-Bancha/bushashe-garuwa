/**
 * The shaped edge of the footer and of the coloured bands: a straight line
 * across the middle, the left corner curving up high and the right corner
 * falling away. Turned over (`flip`) it closes a band at the bottom, the right
 * corner hanging down. The corners keep their shape at every width; only the
 * straight middle stretches.
 */
export default function GreenEdge({ color = '#3F7D20', flip = false, className = '' }: { color?: string; flip?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ color }}
      className={`flex items-end h-[44px] sm:h-[64px] lg:h-[84px] ${flip ? 'rotate-180 -mt-px' : '-mb-px'} ${className}`}
    >
      <svg viewBox="0 0 120 100" className="block h-full w-auto shrink-0" style={{ aspectRatio: '6 / 5' }}>
        <path d="M0 0C5 32 32 50 120 50V100H0Z" fill="currentColor" />
      </svg>
      <div className="flex-1 h-1/2 -mx-px bg-current" />
      <svg viewBox="0 0 120 100" className="block h-full w-auto shrink-0" style={{ aspectRatio: '6 / 5' }}>
        <path d="M0 50C80 50 113 62 120 100H0Z" fill="currentColor" />
      </svg>
    </div>
  );
}
