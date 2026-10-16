/**
 * Everything about the brand that the emails use, in one place: the logo, the
 * colours and fonts of the website, the contacts and the social links.
 *
 * Only links that really exist are listed. Instagram, TikTok, X and a YouTube
 * channel are left empty until the business has them; an empty link is simply
 * not shown. Images are served from the live website, since mail apps cannot
 * show local files.
 */
export const BRAND = {
  name: 'Bushaashe Garuwa',
  /** the website's own line, in both languages */
  tagline: { en: 'Where Wolaita Heritage Lives', am: 'የወላይታ ቅርስ ሕያው የሆነበት' },
  site: 'https://bushaashegaruwa.com',
  /** the round logo, 180 x 180, on white so it reads on any background */
  logo: '/apple-touch-icon.png',

  colors: {
    /** deep forest: the header band */
    forest: '#13261A',
    /** the dark green of headings and text */
    ink: '#1E3A29',
    body: '#4B5C50',
    muted: '#7D8A7A',
    /** the green of the website's buttons */
    green: '#3F7D20',
    greenDark: '#346A1A',
    moss: '#B9D38A',
    /** paper cream and sage, the website's two backgrounds */
    cream: '#F4EFE4',
    sage: '#E3EBD8',
    line: '#E6DECD',
    /** terracotta, the website's warm accent */
    clay: '#C4622D',
    white: '#FFFFFF',
  },

  /** the colours of the traditional Wolaita cloth, for the thin band under the header */
  cloth: ['#B5321E', '#E8B23A', '#1B1B1B', '#3F7D20', '#E8B23A', '#B5321E', '#1B1B1B', '#3F7D20'],

  fonts: {
    /** headings: the website's display face, then safe fallbacks */
    display: "'Bricolage Grotesque', 'Segoe UI', Helvetica, Arial, sans-serif",
    /** body text: the website's text face, then safe fallbacks */
    body: "'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif",
    /** Ge'ez letters need an Ethiopic font */
    ethiopic: "'Noto Sans Ethiopic', Nyala, 'Abyssinica SIL', 'Segoe UI', Arial, sans-serif",
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap',
  },

  contact: {
    phone: '+251 932 196 502',
    phoneHref: '+251932196502',
    email: 'bushaashegaruwa@gmail.com',
    address: { en: 'Damot Sore Woreda, Wolaita Zone, Ethiopia', am: 'ዳሞት ሶሬ ወረዳ፣ ወላይታ ዞን፣ ኢትዮጵያ' },
    directions: 'https://www.google.com/maps/dir/?api=1&destination=XP44%2BJ6%20Gununo',
  },

  /** hosted PNG icons in the brands' own colours (frontend/public/email); an empty url is not shown */
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/bushaashe.garuwa', icon: '/email/facebook.png' },
    { name: 'WhatsApp', url: 'https://wa.me/251932196502', icon: '/email/whatsapp.png' },
    { name: 'Telegram', url: 'https://t.me/bushaashegaruwafrist', icon: '/email/telegram.png' },
    { name: 'Instagram', url: '', icon: '/email/instagram.png' },
    { name: 'TikTok', url: '', icon: '/email/tiktok.png' },
    { name: 'YouTube', url: '', icon: '/email/youtube.png' },
  ],

  /** how soon the team answers, as the website promises */
  replyWithin: { en: 'within 24 hours', am: 'በ24 ሰዓት ውስጥ' },
} as const;
