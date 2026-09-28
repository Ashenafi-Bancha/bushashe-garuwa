/**
 * Writes every email, filled with sample details, to data/email-previews/ so the
 * designs can be opened in a browser and checked in both languages.
 *
 *   pnpm email:preview
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

const SITE = process.env.SITE_URL ?? 'https://bushashe-garuwa.vercel.app';
const OUT = join(process.cwd(), 'data', 'email-previews');
mkdirSync(OUT, { recursive: true });

const inTwoWeeks = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

const booking = (lang: 'en' | 'am'): BookingFacts => ({
  reference: 'BG-7K3Q',
  name: lang === 'am' ? 'መቅደስ ኃይሌ' : 'Mekdes Haile',
  phone: '+251 911 22 33 44',
  guests: 4,
  eventName: lang === 'am' ? 'የወላይታ ባህላዊ ምግብ ምሽት' : 'Wolaita Cultural Food Evening',
  eventDate: inTwoWeeks,
  eventTime: '17:00 – 21:00',
  partner: 'Lidya Cultural Food',
  lang,
});

const emails = {
  'booking-received-en': bookingReceived(booking('en'), SITE),
  'booking-received-am': bookingReceived(booking('am'), SITE),
  'booking-confirmed-en': bookingConfirmed(booking('en'), SITE),
  'booking-confirmed-am': bookingConfirmed(booking('am'), SITE),
  'visit-received-en': visitReceived(
    { name: 'Dawit Bekele', date: inTwoWeeks, visitors: '11–20', experiences: ['heritage', 'food', 'meeting'], lang: 'en' },
    SITE,
  ),
  'message-received-en': contactReceived(
    { name: 'Hanna Tesfaye', message: 'Hello! We are a school from Hawassa and would like to bring 40 students in November.\nIs that possible?', lang: 'en' },
    SITE,
  ),
  'staff-new-booking': staffNewBooking(
    { ...booking('en'), email: 'mekdes@example.com', message: 'We are celebrating my mother’s birthday.', placesLeft: 12 },
    SITE,
  ),
  'staff-new-visit': staffNewVisit(
    { name: 'Dawit Bekele', date: inTwoWeeks, visitors: '11–20', experiences: ['heritage', 'food'], lang: 'en', phone: '0911 00 11 22', email: null, message: 'A company outing.' },
    SITE,
  ),
  'staff-new-message': staffNewMessage(
    { name: 'Hanna Tesfaye', message: 'Can we bring 40 students in November?', lang: 'en', email: 'hanna@example.com', phone: null },
    SITE,
  ),
};

for (const [name, email] of Object.entries(emails)) {
  writeFileSync(join(OUT, `${name}.html`), email.html, 'utf-8');
  console.log(`${name.padEnd(22)} ${email.subject}`);
}
console.log(`\nOpen them from ${OUT}`);
