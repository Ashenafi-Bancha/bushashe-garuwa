import { Link } from 'react-router-dom';
import Photo from './Photo';

/**
 * The card used across the site: a tall rounded photograph, then the name in
 * small bold capitals with an arrow over a hairline, then a short description.
 * The hairline and the arrow move on hover, so the whole card feels like a link.
 */
export default function PhotoCard({
  to,
  photo,
  title,
  desc,
  meta,
  ratio = 'aspect-[4/5]',
}: {
  to: string;
  /** web path of a real photograph; leave out for the woven panel */
  photo?: string;
  title: string;
  desc?: string;
  /** small line under the description, e.g. "24 items" or a date */
  meta?: string;
  ratio?: string;
}) {
  return (
    <Link to={to} className="group block">
      <div className={`img-zoom rounded-[1.25rem] overflow-hidden ${ratio} bg-[#0E6B63]/10 elev-1`}>
        <Photo src={photo} alt={title} label={title} className="w-full h-full object-cover" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 pb-3 border-b border-[#12150F]/12 group-hover:border-[#0E6B63] transition-colors">
        <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase text-[#0E6B63]">{title}</h3>
        <span
          aria-hidden="true"
          className="text-[#0E6B63] text-lg leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </div>
      {desc && <p className="mt-3 text-[#12150F]/55 text-sm leading-relaxed">{desc}</p>}
      {meta && <span className="mt-2 block text-[#B8863B] text-xs">{meta}</span>}
    </Link>
  );
}
