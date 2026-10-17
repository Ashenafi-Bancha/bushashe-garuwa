import { useI18n } from '../i18n/I18nProvider';

/** The ways to reach Bushaashe Garuwa with one tap */
export const CONTACT = {
  phone: 'tel:+251932196502',
  whatsapp: 'https://wa.me/251932196502',
  telegram: 'https://t.me/bushaashegaruwafrist',
};

/** Three buttons: call, WhatsApp, Telegram. Each opens the phone's own app. */
export default function ContactButtons({ className = '', onGreen = false }: { className?: string; /** on a green band: white buttons */ onGreen?: boolean }) {
  const { t } = useI18n();
  const first = onGreen ? 'btn-primary btn-on-dark btn-sm' : 'btn-outline btn-sm text-[#1E3A29]';
  const rest = onGreen ? 'btn-outline btn-outline-light btn-sm' : 'btn-outline btn-sm text-[#1E3A29]';
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={CONTACT.phone} className={first}>
        {t.common.call}
      </a>
      <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={rest}>
        WhatsApp
      </a>
      <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className={rest}>
        Telegram
      </a>
    </div>
  );
}
