import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import Photo from './Photo';

/**
 * The card used across the site, following the reference: a white card holding
 * a rounded photograph, the name, a short description and a small green pill
 * to open it. The whole card is the link; the pill is the visible invitation.
 */
export default function PhotoCard({
  to,
  photo,
  title,
  desc,
  meta,
  action,
  ratio = 'aspect-[4/3]',
}: {
  to: string;
  /** web path of a real photograph; leave out for the woven panel */
  photo?: string;
  title: string;
  desc?: string;
  /** small line under the description, e.g. "24 items" */
  meta?: string;
  /** words on the pill; defaults to "Explore" in the visitor's language */
  action?: string;
  ratio?: string;
}) {
  const { t } = useI18n();

  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-[1.5rem] bg-white border border-[#12150F]/8 elev-1 p-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`img-zoom rounded-[1.1rem] overflow-hidden ${ratio} bg-[#35723A]/10`}>
        <Photo src={photo} alt={title} label={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <h3 className="font-display text-lg font-bold text-[#12150F] leading-tight mb-2">{title}</h3>
        {desc && <p className="text-[#12150F]/55 text-sm leading-relaxed mb-4">{desc}</p>}
        {meta && <span className="text-[#B8863B] text-xs mb-4">{meta}</span>}

        <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#35723A] text-white text-[13px] font-semibold px-5 py-2.5 transition-colors group-hover:bg-[#43884A]">
          {action ?? t.common.explore}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">›</span>
        </span>
      </div>
    </Link>
  );
}
