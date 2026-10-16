import { BRAND } from './brand.js';
import { button, buttons, escape, eyebrow, frame, heading, highlights, noteBox, paragraph, plainText, subheading, summaryCard } from './layout.js';
import { type BookingFacts, EXPERIENCES, formatDate, type MessageFacts, type Rendered, type VisitFacts } from './shared.js';

/**
 * The alerts the Bushaashe Garuwa team receives, in English: a bold headline,
 * when it came in, the dates and the number of guests large enough to read in a
 * second, all the details in a table, and buttons to reply or call at once.
 */

export type AdminEmail = {
  siteUrl: string;
  subject: string;
  /** "New Booking Request" */
  kind: string;
  guest: { name: string; email?: string | null; phone?: string | null };
  /** the big figures at the top (values already escaped) */
  highlights: [string, string][];
  /** all the details (raw values; escaped here) */
  rows: [string, string][];
  /** what the guest wrote, if anything */
  message?: string | null;
  /** the subject of the reply the "Reply to Guest" button starts */
  replySubject: string;
  /** when it came in; now, unless given (for previews and tests) */
  receivedAt?: Date;
};

/** "Friday 16 October 2026 at 14:05" in Addis Ababa time */
export function addisTime(at: Date): string {
  const day = at.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Addis_Ababa' });
  const time = at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Addis_Ababa' });
  return `${day} at ${time}`;
}

/** Builds one team alert from its parts */
export function adminAlert(e: AdminEmail): Rendered {
  const site = e.siteUrl.replace(/\/$/, '');
  const C = BRAND.colors;
  const when = addisTime(e.receivedAt ?? new Date());
  const { email, phone, name } = e.guest;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(e.replySubject)}` : '';
  const tel = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';

  const body = [
    eyebrow('Action needed', 'en', 'clay'),
    heading(e.kind),
    paragraph(
      `From <strong class="t-ink" style="color:${C.ink};">${escape(name)}</strong><br /><span class="t-muted" style="font-size:14px;color:${C.muted};">Received ${escape(when)} (Addis Ababa time)</span>`,
    ),
    highlights(e.highlights),
    subheading('The details'),
    summaryCard(e.rows.map(([label, value]) => [label, escape(value)] as [string, string])),
    e.message ? noteBox('What they wrote', escape(e.message), 'en', { quote: true }) : '',
    buttons(
      mailto ? button(mailto, 'Reply to Guest') : '',
      tel ? button(tel, 'Call Guest', 'en', mailto ? 'outline' : 'solid') : '',
      button(`${site}/admin`, 'Open the staff area', 'en', 'outline'),
    ),
    noteBox('', `Please get back to ${escape(name)} ${BRAND.replyWithin.en}: the website promises every guest an answer within a day.`),
  ].join('');

  return {
    subject: e.subject,
    html: frame({
      lang: 'en',
      siteUrl: site,
      preheader: `${e.kind} from ${name}, received ${when}`,
      title: e.subject,
      body,
      note: 'Sent to the Bushaashe Garuwa team by the website.',
    }),
    text: plainText([
      e.kind.toUpperCase(),
      `From ${name}, received ${when} (Addis Ababa time)`,
      '',
      ...e.rows.filter(([, v]) => v).map(([label, value]) => `${label}: ${value}`),
      e.message ? `\nWhat they wrote:\n${e.message}` : '',
      '',
      email ? `Reply: ${email}` : '',
      phone ? `Call: ${phone}` : '',
      `Staff area: ${site}/admin`,
    ]),
  };
}

// ───────────────────────── the team alerts ─────────────────────────

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** A guest reserved places at an event */
export function staffNewBooking(
  b: BookingFacts & { email: string | null; message: string | null; placesLeft: number | null },
  siteUrl: string,
  receivedAt?: Date,
): Rendered {
  const date = formatDate(b.eventDate, 'en');
  return adminAlert({
    siteUrl,
    receivedAt,
    subject: `New Booking Request — ${b.name}, ${date}`,
    kind: 'New Booking Request',
    guest: { name: b.name, email: b.email, phone: b.phone },
    highlights: [
      ['Date', escape(date) + (b.eventTime ? `<br /><span style="font-size:15px;font-weight:700;">${escape(b.eventTime)}</span>` : '')],
      ['Guests', escape(plural(b.guests, 'guest', 'guests'))],
    ],
    rows: [
      ['Booking number', b.reference],
      ['Event', b.eventName],
      ['Date', date],
      ['Time', b.eventTime ?? ''],
      ['Guests', String(b.guests)],
      ['Name', b.name],
      ['Phone', b.phone],
      ['Email', b.email ?? ''],
      ['Places left', b.placesLeft === null ? '' : String(b.placesLeft)],
    ],
    message: b.message,
    replySubject: `Your booking at Bushaashe Garuwa (${b.reference})`,
  });
}

/** A visitor asked to come (Plan Your Visit form) */
export function staffNewVisit(v: VisitFacts & { phone: string; email: string | null; message: string | null }, siteUrl: string, receivedAt?: Date): Rendered {
  const date = formatDate(v.date, 'en');
  return adminAlert({
    siteUrl,
    receivedAt,
    subject: `New Visit Request — ${v.name}, ${date}`,
    kind: 'New Visit Request',
    guest: { name: v.name, email: v.email, phone: v.phone },
    highlights: [
      ['Date', escape(date)],
      ['Guests', escape(v.visitors)],
    ],
    rows: [
      ['Date', date],
      ['Guests', v.visitors],
      ['Interested in', v.experiences.map((id) => EXPERIENCES[id]?.en ?? id).join(', ')],
      ['Name', v.name],
      ['Phone', v.phone],
      ['Email', v.email ?? ''],
      ['Language', v.lang === 'am' ? 'Amharic' : 'English'],
    ],
    message: v.message,
    replySubject: 'Your visit to Bushaashe Garuwa',
  });
}

/** Someone wrote through the contact form */
export function staffNewMessage(m: MessageFacts & { email: string; phone: string | null }, siteUrl: string, receivedAt?: Date): Rendered {
  return adminAlert({
    siteUrl,
    receivedAt,
    subject: `New Message — ${m.name}`,
    kind: 'New Message',
    guest: { name: m.name, email: m.email, phone: m.phone },
    highlights: [],
    rows: [
      ['Name', m.name],
      ['Email', m.email],
      ['Phone', m.phone ?? ''],
      ['Language', m.lang === 'am' ? 'Amharic' : 'English'],
    ],
    message: m.message,
    replySubject: 'Re: your message to Bushaashe Garuwa',
  });
}
