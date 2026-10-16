/**
 * Writes every email, filled with sample details, to data/email-previews/ so the
 * designs can be opened in a browser and checked in both languages: one .html and
 * one .txt (the plain-text copy) per email, and an index.html linking them all.
 *
 *   pnpm --filter @bushaashe/backend email:preview
 *
 * Images (logo, social icons) come from SITE_URL, the live website by default.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  bookingConfirmed,
  bookingReceived,
  contactReceived,
  staffNewBooking,
  staffNewMessage,
  staffNewVisit,
  visitReceived,
  type BookingFacts,
} from '../src/modules/notifications/templates/messages.js';

const SITE = process.env.SITE_URL ?? 'https://bushaashegaruwa.com';
const OUT = join(process.cwd(), 'data', 'email-previews');
mkdirSync(OUT, { recursive: true });

const inTwoWeeks = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
const now = new Date();

const booking = (lang: 'en' | 'am'): BookingFacts => ({
  reference: 'BG-7K3Q',
  name: lang === 'am' ? 'መቅደስ ኃይሌ' : 'Mekdes Haile',
  phone: '+251 911 22 33 44',
  guests: 4,
  eventName: lang === 'am' ? 'የወላይታ ባህላዊ ምግብ ምሽት' : 'Wolaita Cultural Food Evening',
  eventDate: inTwoWeeks,
  eventTime: '17:00 – 21:00',
  partner: null,
  lang,
});

const visit = (lang: 'en' | 'am') => ({
  name: lang === 'am' ? 'ዳዊት በቀለ' : 'Dawit Bekele',
  date: inTwoWeeks,
  visitors: '11–20',
  experiences: ['heritage', 'food', 'meeting'],
  lang,
});

const emails = {
  'guest-booking-received-en': bookingReceived(booking('en'), SITE),
  'guest-booking-received-am': bookingReceived(booking('am'), SITE),
  'guest-booking-confirmed-en': bookingConfirmed(booking('en'), SITE),
  'guest-booking-confirmed-am': bookingConfirmed(booking('am'), SITE),
  'guest-visit-received-en': visitReceived(visit('en'), SITE),
  'guest-visit-received-am': visitReceived(visit('am'), SITE),
  'guest-message-received-en': contactReceived(
    { name: 'Hanna Tesfaye', message: 'Hello! We are a school from Hawassa and would like to bring 40 students in November.\nIs that possible?', lang: 'en' },
    SITE,
  ),
  'team-new-booking': staffNewBooking(
    { ...booking('en'), email: 'mekdes@example.com', message: 'We are celebrating my mother’s birthday.', placesLeft: 12 },
    SITE,
    now,
  ),
  'team-new-visit': staffNewVisit(
    { ...visit('en'), phone: '0911 00 11 22', email: 'dawit@example.com', message: 'A company outing for our staff.' },
    SITE,
    now,
  ),
  'team-new-message': staffNewMessage(
    { name: 'Hanna Tesfaye', message: 'Can we bring 40 students in November?', lang: 'en', email: 'hanna@example.com', phone: '+251 922 33 44 55' },
    SITE,
    now,
  ),
};

const links: string[] = [];
for (const [name, email] of Object.entries(emails)) {
  writeFileSync(join(OUT, `${name}.html`), email.html, 'utf-8');
  writeFileSync(join(OUT, `${name}.txt`), `Subject: ${email.subject}\n\n${email.text}\n`, 'utf-8');
  links.push(`<li><a href="${name}.html">${name}</a> · <a href="${name}.txt">text</a><br><small>${email.subject}</small></li>`);
  console.log(`${name.padEnd(28)} ${email.subject}`);
}
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Bushaashe Garuwa emails</title><body style="font-family:system-ui;padding:24px;line-height:1.7"><h1>Bushaashe Garuwa emails</h1><ul>${links.join('')}</ul></body>`,
  'utf-8',
);
console.log(`\nOpen ${join(OUT, 'index.html')}`);
