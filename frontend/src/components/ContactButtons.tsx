import { useI18n } from '../i18n/I18nProvider';

/** The ways to reach Bushaashe Garuwa with one tap */
export const CONTACT = {
  phone: 'tel:+251932196502',
  whatsapp: 'https://wa.me/251932196502',
  telegram: 'https://t.me/bushaashegaruwafrist',
};

/** Three buttons: call, WhatsApp, Telegram. Each opens the phone's own app. */
export default function ContactButtons({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={CONTACT.phone} className="btn-outline btn-sm text-[#1E3A29]">
        {t.common.call}
      </a>
      <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm text-[#1E3A29]">
        WhatsApp
      </a>
      <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm text-[#1E3A29]">
        Telegram
      </a>
    </div>
  );
}
