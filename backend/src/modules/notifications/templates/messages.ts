import { BRAND, button, capsFor, details, escape, fontFor, layout, paragraph, referenceBlock } from './layout.js';

/**
 * Every email Bushaashe Garuwa sends. Guests get theirs in the language they used
 * on the website (Wolaytta falls back to English until it is translated); staff
 * notices are in English.
 */

export type Lang = 'en' | 'am';
export type Rendered = { subject: string; html: string; text: string };

export const langOf = (value: string): Lang => (value === 'am' ? 'am' : 'en');

const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=XP44%2BJ6%20Gununo';

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

const FOOTER = {
  en: {
    followUs: 'Follow us:',
    why: 'You are receiving this because you contacted Bushaashe Garuwa through our website.',
  },
  am: {
    followUs: 'ይከተሉን፦',
    why: 'ይህን ኢሜይል የተቀበሉት በድረ-ገጻችን በኩል ቡሻሼ ጋሯን ስላገኙ ነው።',
  },
};

const EXPERIENCES: Record<string, Record<Lang, string>> = {
  heritage: { en: 'Heritage tour', am: 'የቅርስ ጉብኝት' },
  cultural: { en: 'Cultural experience', am: 'ባህላዊ ተሞክሮ' },
  food: { en: 'Traditional food', am: 'ባህላዊ ምግብ' },
  restaurant: { en: 'Restaurant', am: 'ምግብ ቤት' },
  guesthouse: { en: 'Guesthouse stay', am: 'በእንግዳ ማረፊያ ማደር' },
  group: { en: 'Group visit', am: 'የቡድን ጉብኝት' },
  education: { en: 'Educational visit', am: 'ትምህርታዊ ጉብኝት' },
  meeting: { en: 'Meeting hall', am: 'የስብሰባ አዳራሽ' },
};

/** A plain-text copy for mail apps that do not show HTML */
function textVersion(lines: (string | false | null | undefined)[]): string {
  return [...lines.filter(Boolean), '', 'Bushaashe Garuwa', BRAND.address, `${BRAND.phone} · ${BRAND.email}`].join('\n');
}

// ─────────────────────────────── Guests ───────────────────────────────

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

export function bookingReceived(b: BookingFacts, siteUrl: string): Rendered {
  const date = formatDate(b.eventDate, b.lang);
  const c =
    b.lang === 'am'
      ? {
          subject: `ቦታዎ ተይዟል · ${b.reference}`,
          eyebrow: 'ማስያዣ ደርሶናል',
          title: `እናመሰግናለን ${escape(b.name)}፣ ቦታዎ ተይዟል።`,
          lead: `ለ<strong>${escape(b.eventName)}</strong> ያስያዙትን ቦታ ተቀብለናል። ዝርዝሩን ለማረጋገጥ በ${escape(b.phone)} እንደውልልዎታለን።`,
          refLabel: 'የማስያዣ ቁጥርዎ',
          refNote: 'ሲደውሉ ወይም ሲመጡ ይህን ቁጥር ይንገሩን።',
          labels: ['ዝግጅት', 'ቀን', 'ሰዓት', 'እንግዶች', 'በጋራ ከ'],
          cta: 'ዝግጅቱን ይመልከቱ',
        }
      : {
          subject: `Your place is reserved · ${b.reference}`,
          eyebrow: 'Booking received',
          title: `Thank you, ${escape(b.name)}. Your place is reserved.`,
          lead: `We have received your booking for <strong>${escape(b.eventName)}</strong>. We will call you on ${escape(b.phone)} to confirm the details.`,
          refLabel: 'Your booking number',
          refNote: 'Tell us this number when you call or when you arrive.',
          labels: ['Event', 'Date', 'Time', 'Guests', 'Together with'],
          cta: 'See the event',
        };

  const html = layout({
    lang: b.lang,
    siteUrl,
    preheader: `${c.refLabel}: ${b.reference}`,
    eyebrow: c.eyebrow,
    title: c.title,
    body:
      paragraph(c.lead, b.lang) +
      referenceBlock(c.refLabel, b.reference, c.refNote, b.lang) +
      details([
        [c.labels[0]!, escape(b.eventName)],
        [c.labels[1]!, escape(date)],
        [c.labels[2]!, escape(b.eventTime ?? '')],
        [c.labels[3]!, escape(b.guests)],
        [c.labels[4]!, escape(b.partner ?? '')],
      ], b.lang) +
      button(`${siteUrl}/events`, c.cta, b.lang),
    footer: FOOTER[b.lang],
  });

  return {
    subject: c.subject,
    html,
    text: textVersion([
      c.subject,
      '',
      `${c.refLabel}: ${b.reference}`,
      `${c.labels[0]}: ${b.eventName}`,
      `${c.labels[1]}: ${date}`,
      b.eventTime && `${c.labels[2]}: ${b.eventTime}`,
      `${c.labels[3]}: ${b.guests}`,
      b.partner && `${c.labels[4]}: ${b.partner}`,
      '',
      `${siteUrl}/events`,
    ]),
  };
}

export function bookingConfirmed(b: BookingFacts, siteUrl: string): Rendered {
  const date = formatDate(b.eventDate, b.lang);
  const c =
    b.lang === 'am'
      ? {
          subject: `ተረጋግጧል፦ ${b.eventName}፣ ${date}`,
          eyebrow: 'ማስያዣዎ ተረጋግጧል',
          title: `${escape(date)} እንገናኝ`,
          lead: `ማስያዣዎ <strong>${escape(b.reference)}</strong> ተረጋግጧል። ወደ ቡሻሼ ጋሯ ለመቀበልዎ በጉጉት እንጠብቃለን።`,
          labels: ['ዝግጅት', 'ቀን', 'ሰዓት', 'እንግዶች', 'የማስያዣ ቁጥር'],
          cta: 'አቅጣጫ ያግኙ',
        }
      : {
          subject: `Confirmed: ${b.eventName}, ${date}`,
          eyebrow: 'Booking confirmed',
          title: `See you on ${escape(date)}`,
          lead: `Your booking <strong>${escape(b.reference)}</strong> is confirmed. We look forward to welcoming you to Bushaashe Garuwa.`,
          labels: ['Event', 'Date', 'Time', 'Guests', 'Booking number'],
          cta: 'Get directions',
        };

  return {
    subject: c.subject,
    html: layout({
      lang: b.lang,
      siteUrl,
      preheader: c.subject,
      eyebrow: c.eyebrow,
      title: c.title,
      body:
        paragraph(c.lead, b.lang) +
        details([
          [c.labels[0]!, escape(b.eventName)],
          [c.labels[1]!, escape(date)],
          [c.labels[2]!, escape(b.eventTime ?? '')],
          [c.labels[3]!, escape(b.guests)],
          [c.labels[4]!, escape(b.reference)],
        ], b.lang) +
        button(DIRECTIONS, c.cta, b.lang),
      footer: FOOTER[b.lang],
    }),
    text: textVersion([
      c.subject,
      '',
      `${c.labels[4]}: ${b.reference}`,
      b.eventTime && `${c.labels[2]}: ${b.eventTime}`,
      `${c.labels[3]}: ${b.guests}`,
      '',
      DIRECTIONS,
    ]),
  };
}

export type VisitFacts = {
  name: string;
  date: string;
  visitors: string;
  experiences: string[];
  lang: Lang;
};

export function visitReceived(v: VisitFacts, siteUrl: string): Rendered {
  const date = formatDate(v.date, v.lang);
  const interests = v.experiences.map((id) => EXPERIENCES[id]?.[v.lang] ?? id).join(', ');
  const c =
    v.lang === 'am'
      ? {
          subject: 'የጉብኝት ጥያቄዎ ደርሶናል',
          eyebrow: 'የጉብኝት ጥያቄ',
          title: `እናመሰግናለን ${escape(v.name)}`,
          lead: `በ<strong>${escape(date)}</strong> ቡሻሼ ጋሯን ለመጎብኘት ያቀረቡትን ጥያቄ ተቀብለናል። ቀኑን አብረን ለማቀድ በቅርቡ እንደውልልዎታለን።`,
          labels: ['ቀን', 'እንግዶች', 'የሚፈልጉት'],
          cta: 'በካርታ ላይ ያግኙን',
        }
      : {
          subject: 'We received your visit request',
          eyebrow: 'Visit request',
          title: `Thank you, ${escape(v.name)}`,
          lead: `We have received your request to visit Bushaashe Garuwa on <strong>${escape(date)}</strong>. We will call you soon to plan the day with you.`,
          labels: ['Date', 'Guests', 'Interested in'],
          cta: 'Find us on the map',
        };

  return {
    subject: c.subject,
    html: layout({
      lang: v.lang,
      siteUrl,
      preheader: c.subject,
      eyebrow: c.eyebrow,
      title: c.title,
      body:
        paragraph(c.lead, v.lang) +
        details([
          [c.labels[0]!, escape(date)],
          [c.labels[1]!, escape(v.visitors)],
          [c.labels[2]!, escape(interests)],
        ], v.lang) +
        button(DIRECTIONS, c.cta, v.lang),
      footer: FOOTER[v.lang],
    }),
    text: textVersion([c.subject, '', `${c.labels[0]}: ${date}`, `${c.labels[1]}: ${v.visitors}`, interests && `${c.labels[2]}: ${interests}`]),
  };
}

export type MessageFacts = { name: string; message: string; lang: Lang };

export function contactReceived(m: MessageFacts, siteUrl: string): Rendered {
  const c =
    m.lang === 'am'
      ? {
          subject: 'መልእክትዎ ደርሶናል',
          eyebrow: 'መልእክት ደርሷል',
          title: `ስለጻፉልን እናመሰግናለን ${escape(m.name)}`,
          lead: 'መልእክትዎ ደርሶናል። ለእያንዳንዱ መልእክት ብዙውን ጊዜ በአንድ ቀን ውስጥ እንመልሳለን።',
          yours: 'የጻፉት፦',
          cta: 'ድረ-ገጻችንን ይጎብኙ',
        }
      : {
          subject: 'We received your message',
          eyebrow: 'Message received',
          title: `Thank you for writing, ${escape(m.name)}`,
          lead: 'Your message has reached us. We reply to every message, usually within a day.',
          yours: 'What you wrote:',
          cta: 'Visit our website',
        };

  const quote = `
    <div style="font-family:${fontFor(m.lang)};font-size:12px;${capsFor(m.lang, '0.08em')}color:${BRAND.muted};margin:0 0 8px;">${c.yours}</div>
    <div style="background:${BRAND.soft};border-left:3px solid ${BRAND.gold};border-radius:10px;padding:14px 16px;margin:0 0 24px;font-family:${fontFor(m.lang)};font-size:14px;line-height:1.6;color:${BRAND.body};white-space:pre-line;">${escape(m.message)}</div>`;

  return {
    subject: c.subject,
    html: layout({
      lang: m.lang,
      siteUrl,
      preheader: c.lead,
      eyebrow: c.eyebrow,
      title: c.title,
      body: paragraph(c.lead, m.lang) + quote + button(siteUrl, c.cta, m.lang),
      footer: FOOTER[m.lang],
    }),
    text: textVersion([c.subject, '', c.lead, '', c.yours, m.message]),
  };
}

// ─────────────────────────────── Staff ───────────────────────────────

const STAFF_FOOTER = { followUs: 'Follow us:', why: 'Sent to the Bushaashe Garuwa staff inbox from the website.' };

function staffEmail(siteUrl: string, subject: string, eyebrow: string, title: string, rows: [string, string][], extra = ''): Rendered {
  return {
    subject,
    html: layout({
      lang: 'en',
      siteUrl,
      preheader: subject,
      eyebrow,
      title,
      body: details(rows.map(([label, value]) => [label, escape(value)])) + extra + button(`${siteUrl}/admin`, 'Open the staff area'),
      footer: STAFF_FOOTER,
    }),
    text: textVersion([subject, '', ...rows.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`), '', `${siteUrl}/admin`]),
  };
}

export function staffNewBooking(
  b: BookingFacts & { email: string | null; message: string | null; placesLeft: number | null },
  siteUrl: string,
): Rendered {
  const date = formatDate(b.eventDate, 'en');
  return staffEmail(
    siteUrl,
    `New booking ${b.reference}: ${b.name}, ${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}`,
    'New booking',
    `${escape(b.name)} reserved ${b.guests} ${b.guests === 1 ? 'place' : 'places'}`,
    [
      ['Booking number', b.reference],
      ['Event', b.eventName],
      ['Date', date],
      ['Guests', String(b.guests)],
      ['Phone', b.phone],
      ['Email', b.email ?? ''],
      ['Note', b.message ?? ''],
      ['Places left', b.placesLeft === null ? '' : String(b.placesLeft)],
    ],
  );
}

export function staffNewVisit(v: VisitFacts & { phone: string; email: string | null; message: string | null }, siteUrl: string): Rendered {
  const date = formatDate(v.date, 'en');
  return staffEmail(siteUrl, `New visit request: ${v.name}, ${date}`, 'New visit request', `${escape(v.name)} wants to visit`, [
    ['Date', date],
    ['Guests', v.visitors],
    ['Interested in', v.experiences.map((id) => EXPERIENCES[id]?.en ?? id).join(', ')],
    ['Phone', v.phone],
    ['Email', v.email ?? ''],
    ['Note', v.message ?? ''],
  ]);
}

export function staffNewMessage(m: MessageFacts & { email: string; phone: string | null }, siteUrl: string): Rendered {
  return staffEmail(
    siteUrl,
    `New message from ${m.name}`,
    'New message',
    `${escape(m.name)} wrote to you`,
    [
      ['Email', m.email],
      ['Phone', m.phone ?? ''],
      ['Language', m.lang === 'am' ? 'Amharic' : 'English'],
    ],
    `<div style="background:${BRAND.soft};border-left:3px solid ${BRAND.gold};border-radius:10px;padding:14px 16px;margin:0 0 24px;font-family:${BRAND.font};font-size:14px;line-height:1.6;color:${BRAND.body};white-space:pre-line;">${escape(m.message)}</div>`,
  );
}
