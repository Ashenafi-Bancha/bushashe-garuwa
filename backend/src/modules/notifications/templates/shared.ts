/** Types and helpers shared by the guest emails and the team alerts */

export type Lang = 'en' | 'am';
export type Rendered = { subject: string; html: string; text: string };

/** Guests get their email in the language they used on the website; Wolaytta falls back to English until it is translated */
export const langOf = (value: string): Lang => (value === 'am' ? 'am' : 'en');

export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** What a visitor ticked on the Plan Your Visit form, in words */
export const EXPERIENCES: Record<string, Record<Lang, string>> = {
  heritage: { en: 'Heritage tour', am: 'የቅርስ ጉብኝት' },
  cultural: { en: 'Cultural experience', am: 'ባህላዊ ተሞክሮ' },
  food: { en: 'Traditional food', am: 'ባህላዊ ምግብ' },
  restaurant: { en: 'Restaurant', am: 'ምግብ ቤት' },
  guesthouse: { en: 'Guesthouse stay', am: 'በእንግዳ ማረፊያ ማደር' },
  group: { en: 'Group visit', am: 'የቡድን ጉብኝት' },
  education: { en: 'Educational visit', am: 'ትምህርታዊ ጉብኝት' },
  meeting: { en: 'Meeting hall', am: 'የስብሰባ አዳራሽ' },
};

export type BookingFacts = {
  reference: string;
  name: string;
  phone: string;
  guests: number;
  eventName: string;
  eventDate: string;
  eventTime: string | null;
  partner: string | null;
  lang: Lang;
};

export type VisitFacts = {
  name: string;
  date: string;
  visitors: string;
  experiences: string[];
  lang: Lang;
};

export type MessageFacts = { name: string; message: string; lang: Lang };
