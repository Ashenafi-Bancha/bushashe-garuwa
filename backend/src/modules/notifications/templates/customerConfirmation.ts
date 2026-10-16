import { BRAND } from './brand.js';
import { button, buttons, escape, eyebrow, fontFor, frame, heading, noteBox, paragraph, plainText, referenceBlock, subheading, summaryCard } from './layout.js';
import { type BookingFacts, EXPERIENCES, formatDate, type Lang, type MessageFacts, type Rendered, type VisitFacts } from './shared.js';

/**
 * The emails a guest receives, in the language they used on the website: a warm
 * greeting by name, a thank-you in the spirit of Wolaita hospitality, what we
 * received, a summary card of the details, what happens next, the way to the
 * website, and a sign-off with our contacts.
 */

/** Words every guest email shares */
const WORDS = {
  en: {
    dear: (name: string) => `Dear ${name},`,
    thanks:
      'Thank you for choosing Bushaashe Garuwa. Here every guest is welcomed the Wolaita way: with an open gate, a warm heart and a cup of coffee.',
    next: 'What happens next',
    website: 'Visit Our Website',
    regards: 'With warm regards,',
    team: 'The Bushaashe Garuwa Team',
    questions: 'Questions? We are always glad to help.',
    note: 'You are receiving this because you made a request on our website.',
  },
  am: {
    dear: (name: string) => `ውድ ${name}፣`,
    thanks: 'ቡሻሼ ጋሯን ስለመረጡ ከልብ እናመሰግናለን። እዚህ እያንዳንዱ እንግዳ በወላይታ ባህል ይቀበላል፦ በተከፈተ በር፣ በሞቀ ልብና በአንድ ስኒ ቡና።',
    next: 'ቀጥሎ ምን ይሆናል',
    website: 'ድረ ገጻችንን ይጎብኙ',
    regards: 'ከልባዊ ሰላምታ ጋር፣',
    team: 'የቡሻሼ ጋሯ ቡድን',
    questions: 'ጥያቄ ካለዎት በደስታ እንረዳዎታለን።',
    note: 'ይህን ኢሜይል የተቀበሉት በድረ ገጻችን ላይ ጥያቄ ስላቀረቡ ነው።',
  },
} as const;

export type CustomerEmail = {
  lang: Lang;
  siteUrl: string;
  name: string;
  subject: string;
  preheader: string;
  badge: string;
  headline: string;
  /** the first lines after the greeting (escaped HTML) */
  intro: string;
  reference?: { label: string; code: string; note: string };
  summaryTitle?: string;
  /** values already escaped */
  summary?: [string, string][];
  /** what the guest wrote, shown as a quote (escaped HTML) */
  quote?: { title: string; text: string };
  next: string;
  /** the second button, beside "Visit Our Website" */
  extra?: { href: string; label: string; first?: boolean };
  /** the plain-text lines (no HTML) */
  textLines: (string | false | null | undefined)[];
};

/** Builds one guest email from its parts */
export function customerConfirmation(e: CustomerEmail): Rendered {
  const w = WORDS[e.lang];
  const site = e.siteUrl.replace(/\/$/, '');
  const C = BRAND.colors;
  const website = button(site, w.website, e.lang, e.extra?.first ? 'outline' : 'solid');
  const extra = e.extra ? button(e.extra.href, e.extra.label, e.lang, e.extra.first ? 'solid' : 'outline') : '';

  const contacts = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="rule" style="margin:26px 0 0;border-top:1px solid ${C.line};">
      <tr><td style="padding-top:20px;font-family:${fontFor(e.lang)};font-size:15px;line-height:1.65;" class="t-body">
        <span class="t-body" style="color:${C.body};">${w.regards}</span><br />
        <strong class="t-ink" style="color:${C.ink};font-size:16px;">${w.team}</strong>
        <div class="t-muted" style="margin-top:16px;font-size:13px;line-height:1.8;color:${C.muted};">
          ${w.questions}<br />
          <a href="tel:${BRAND.contact.phoneHref}" style="color:${C.green};text-decoration:none;font-weight:700;">${BRAND.contact.phone}</a>
          &nbsp;·&nbsp;
          <a href="mailto:${BRAND.contact.email}" style="color:${C.green};text-decoration:none;font-weight:700;">${BRAND.contact.email}</a><br />
          ${BRAND.contact.address[e.lang]}
        </div>
      </td></tr>
    </table>`;

  const body = [
    eyebrow(e.badge, e.lang),
    heading(e.headline, e.lang),
    paragraph(`<strong class="t-ink" style="color:${C.ink};">${w.dear(escape(e.name))}</strong>`, e.lang, 'margin-bottom:10px;'),
    paragraph(w.thanks, e.lang),
    paragraph(e.intro, e.lang),
    e.reference ? referenceBlock(e.reference.label, e.reference.code, e.reference.note, e.lang) : '',
    e.summary?.length ? (e.summaryTitle ? subheading(e.summaryTitle, e.lang) : '') + summaryCard(e.summary, e.lang) : '',
    e.quote ? noteBox(e.quote.title, e.quote.text, e.lang, { quote: true }) : '',
    noteBox(w.next, e.next, e.lang),
    buttons(e.extra?.first ? extra + website : website + extra),
    contacts,
  ].join('');

  return {
    subject: e.subject,
    html: frame({ lang: e.lang, siteUrl: site, preheader: e.preheader, title: e.subject, body, note: w.note }),
    text: plainText(
      [
        w.dear(e.name),
        '',
        w.thanks,
        '',
        ...e.textLines,
        '',
        `${w.next}: ${e.next.replace(/<[^>]+>/g, '')}`,
        '',
        `${w.website}: ${site}`,
        '',
        w.regards,
        w.team,
        '',
        w.note,
      ],
      e.lang,
    ),
  };
}

// ───────────────────────── the guest emails ─────────────────────────

const within = (lang: Lang) => BRAND.replyWithin[lang];

/** A guest reserved places at an event */
export function bookingReceived(b: BookingFacts, siteUrl: string): Rendered {
  const date = formatDate(b.eventDate, b.lang);
  const am = b.lang === 'am';
  const labels = am ? ['ዝግጅት', 'ቀን', 'ሰዓት', 'እንግዶች', 'በጋራ ከ', 'ስልክ'] : ['Event', 'Date', 'Time', 'Guests', 'Together with', 'Phone'];
  const values = [b.eventName, date, b.eventTime ?? '', String(b.guests), b.partner ?? '', b.phone];
  return customerConfirmation({
    lang: b.lang,
    siteUrl,
    name: b.name,
    subject: am ? `ቦታዎ ተይዟል ✨ · ${b.reference}` : `Your Bushaashe Garuwa booking is received ✨ · ${b.reference}`,
    preheader: am
      ? `እናመሰግናለን፤ የቡሻሼ ጋሯ ማስያዣዎ ደርሶናል። የማስያዣ ቁጥር ${b.reference}`
      : `Thank you, your Bushaashe Garuwa booking has been received. Booking number ${b.reference}.`,
    badge: am ? 'ማስያዣ ደርሶናል' : 'Booking received',
    headline: am ? 'ቦታዎ ተይዟል' : 'Your place is reserved',
    intro: am
      ? `ለ<strong>${escape(b.eventName)}</strong> ያስያዙትን ቦታ ተቀብለናል።`
      : `We have received your booking for <strong>${escape(b.eventName)}</strong>.`,
    reference: {
      label: am ? 'የማስያዣ ቁጥርዎ' : 'Your booking number',
      code: b.reference,
      note: am ? 'ሲደውሉ ወይም ሲመጡ ይህን ቁጥር ይንገሩን።' : 'Tell us this number when you call or when you arrive.',
    },
    summaryTitle: am ? 'የማስያዣዎ ዝርዝር' : 'Your booking',
    summary: labels.map((label, i) => [label, escape(values[i])] as [string, string]),
    next: am
      ? `ቡድናችን ቦታዎን ለማረጋገጥ ${within(b.lang)} በ<strong>${escape(b.phone)}</strong> ይደውልልዎታል።`
      : `Our team will call you on <strong>${escape(b.phone)}</strong> ${within(b.lang)} to confirm your places.`,
    extra: { href: `${siteUrl.replace(/\/$/, '')}/events`, label: am ? 'ዝግጅቱን ይመልከቱ' : 'See the event' },
    textLines: [
      `${am ? 'የማስያዣ ቁጥርዎ' : 'Your booking number'}: ${b.reference}`,
      ...labels.map((label, i) => values[i] && `${label}: ${values[i]}`),
    ],
  });
}

/** Staff confirmed a guest's booking */
export function bookingConfirmed(b: BookingFacts, siteUrl: string): Rendered {
  const date = formatDate(b.eventDate, b.lang);
  const am = b.lang === 'am';
  const labels = am ? ['ዝግጅት', 'ቀን', 'ሰዓት', 'እንግዶች', 'የማስያዣ ቁጥር'] : ['Event', 'Date', 'Time', 'Guests', 'Booking number'];
  const values = [b.eventName, date, b.eventTime ?? '', String(b.guests), b.reference];
  return customerConfirmation({
    lang: b.lang,
    siteUrl,
    name: b.name,
    subject: am ? `ማስያዣዎ ተረጋግጧል ✨ · ${date}` : `Your Bushaashe Garuwa booking is confirmed ✨ · ${date}`,
    preheader: am ? `ማስያዣዎ ${b.reference} ተረጋግጧል። ${date} እንገናኝ።` : `Your booking ${b.reference} is confirmed. See you on ${date}.`,
    badge: am ? 'ማስያዣዎ ተረጋግጧል' : 'Booking confirmed',
    headline: am ? `${escape(date)} እንገናኝ` : `See you on ${escape(date)}`,
    intro: am
      ? `ማስያዣዎ <strong>${escape(b.reference)}</strong> ተረጋግጧል። ወደ ቡሻሼ ጋሯ ለመቀበልዎ በጉጉት እንጠብቃለን።`
      : `Your booking <strong>${escape(b.reference)}</strong> is confirmed. We look forward to welcoming you to Bushaashe Garuwa.`,
    summaryTitle: am ? 'የማስያዣዎ ዝርዝር' : 'Your booking',
    summary: labels.map((label, i) => [label, escape(values[i])] as [string, string]),
    next: am
      ? 'ሲደርሱ በዋናው በር ላይ የማስያዣ ቁጥርዎን ይንገሩን። መንገዱን ለማግኘት ከታች ያለው ቁልፍ ካርታውን ይከፍታል።'
      : 'When you arrive, tell us your booking number at the main gate. The button below opens the map with the way to us.',
    extra: { href: BRAND.contact.directions, label: am ? 'አቅጣጫ ያግኙ' : 'Get directions', first: true },
    textLines: labels.map((label, i) => values[i] && `${label}: ${values[i]}`).concat([`${am ? 'አቅጣጫ' : 'Directions'}: ${BRAND.contact.directions}`]),
  });
}

/** A visitor asked to come (Plan Your Visit form) */
export function visitReceived(v: VisitFacts, siteUrl: string): Rendered {
  const date = formatDate(v.date, v.lang);
  const am = v.lang === 'am';
  const interests = v.experiences.map((id) => EXPERIENCES[id]?.[v.lang] ?? id).join(am ? '፣ ' : ', ');
  const labels = am ? ['ቀን', 'እንግዶች', 'የሚፈልጉት'] : ['Date', 'Guests', 'Interested in'];
  const values = [date, v.visitors, interests];
  return customerConfirmation({
    lang: v.lang,
    siteUrl,
    name: v.name,
    subject: am ? 'የጉብኝት ጥያቄዎ ደርሶናል ✨' : 'Your Bushaashe Garuwa request is received ✨',
    preheader: am ? 'እናመሰግናለን፤ የቡሻሼ ጋሯ የጉብኝት ጥያቄዎ ደርሶናል።' : 'Thank you, your Bushaashe Garuwa request has been received.',
    badge: am ? 'የጉብኝት ጥያቄ' : 'Visit request',
    headline: am ? 'ጥያቄዎ ደርሶናል' : 'We have received your request',
    intro: am
      ? `በ<strong>${escape(date)}</strong> ቡሻሼ ጋሯን ለመጎብኘት ያቀረቡት ጥያቄ ደርሶናል።`
      : `Your request to visit Bushaashe Garuwa on <strong>${escape(date)}</strong> has reached us.`,
    summaryTitle: am ? 'የጥያቄዎ ዝርዝር' : 'Your request',
    summary: labels.map((label, i) => [label, escape(values[i])] as [string, string]),
    next: am ? `ቀኑን አብረን ለማቀድ ቡድናችን ${within(v.lang)} ይደውልልዎታል።` : `Our team will call you ${within(v.lang)} to plan the day with you.`,
    extra: { href: BRAND.contact.directions, label: am ? 'በካርታ ላይ ያግኙን' : 'Find us on the map' },
    textLines: labels.map((label, i) => values[i] && `${label}: ${values[i]}`),
  });
}

/** Someone wrote through the contact form */
export function contactReceived(m: MessageFacts, siteUrl: string): Rendered {
  const am = m.lang === 'am';
  return customerConfirmation({
    lang: m.lang,
    siteUrl,
    name: m.name,
    subject: am ? 'መልእክትዎ ደርሶናል ✨' : 'Thank you for writing to Bushaashe Garuwa ✨',
    preheader: am ? 'እናመሰግናለን፤ መልእክትዎ ቡሻሼ ጋሯ ደርሷል።' : 'Thank you, your message to Bushaashe Garuwa has been received.',
    badge: am ? 'መልእክት ደርሷል' : 'Message received',
    headline: am ? 'መልእክትዎ ደርሶናል' : 'We have received your message',
    intro: am ? 'መልእክትዎ ቡድናችን ዘንድ ደርሷል።' : 'Your message has reached our team.',
    quote: { title: am ? 'የጻፉት' : 'What you wrote', text: escape(m.message) },
    next: am ? `ለእያንዳንዱ መልእክት እንመልሳለን፤ ብዙውን ጊዜ ${within(m.lang)}።` : `We reply to every message, usually ${within(m.lang)}.`,
    textLines: [am ? 'የጻፉት፦' : 'What you wrote:', m.message],
  });
}
