import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import Photo from './Photo';

/**
 * The card used across the site: a white card with a rounded photograph, the
 * name, a short description and an "Explore" pill whose arrow turns on hover.
 * The whole card is the link; the pill is the visible invitation.
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
  /** web path of a real photograph; leave out for the placeholder */
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
      className="group flex h-full flex-col rounded-[1.75rem] bg-white p-2.5 elev-1 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(30,58,41,0.45)]"
    >
      <div className={`img-zoom rounded-[1.35rem] overflow-hidden ${ratio}`}>
        <Photo src={photo} alt={title} label={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <h3 className="font-display text-xl font-bold text-[#1E3A29] leading-tight mb-2">{title}</h3>
        {desc && <p className="text-[#1E3A29]/60 text-sm leading-relaxed mb-5">{desc}</p>}
        {meta && <span className="text-[#C4622D] text-xs font-semibold mb-5">{meta}</span>}

        <span className="mt-auto inline-flex w-fit items-center gap-3 rounded-full bg-[#1E3A29] text-[#F4EFE4] text-[13px] font-bold pl-5 pr-1.5 py-1.5">
          {action ?? t.common.explore}
          <span aria-hidden="true" className="grid place-items-center w-8 h-8 rounded-full bg-[#86A94F] text-[#13261A] transition-transform duration-500 group-hover:-rotate-45">→</span>
        </span>
      </div>
    </Link>
  );
}
