import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bookingReceived, contactReceived, staffNewBooking, staffNewMessage } from '../src/modules/notifications/templates/messages.js';

const SITE = 'https://bushaashegaruwa.com';
const booking = {
  reference: 'BG-7K3Q',
  name: 'Mekdes <script>alert(1)</script>',
  phone: '+251 911 22 33 44',
  guests: 4,
  eventName: 'Cultural Food Evening',
  eventDate: '2026-11-01',
  eventTime: '17:00',
  partner: null,
  lang: 'en' as const,
};

describe('the emails', () => {
  it('give the guest a full, safe confirmation with a plain-text copy', () => {
    const email = bookingReceived(booking, SITE);
    assert.match(email.subject, /BG-7K3Q/);
    assert.ok(!email.html.includes('<script>alert(1)</script>'), 'what a guest types is escaped');
    assert.ok(email.html.includes('Mekdes &lt;script&gt;'));
    assert.ok(email.html.includes('Visit Our Website'), 'the way back to the website');
    assert.ok(email.html.includes(`${SITE}/apple-touch-icon.png`), 'the logo by its full address');
    for (const icon of ['facebook', 'whatsapp', 'telegram']) assert.ok(email.html.includes(`${SITE}/email/${icon}.png`), `${icon} icon`);
    assert.ok(!email.html.includes('/email/instagram.png'), 'no icon for a network without a link');
    assert.ok(email.html.includes('display:none'), 'a hidden preheader');
    assert.ok(email.html.includes('v:roundrect'), 'buttons that work in Outlook');
    assert.ok(email.html.includes('You are receiving this because you made a request on our website.'));
    assert.match(email.text, /BG-7K3Q/);
    assert.ok(!/<[a-z]/i.test(email.text.replace(/<script>alert\(1\)<\/script>/, '')), 'the plain-text copy has no HTML');
  });

  it('gives the team the details, the time and buttons to reply or call', () => {
    const at = new Date('2026-10-16T11:05:00Z');
    const email = staffNewBooking({ ...booking, email: 'mekdes@example.com', message: 'A birthday', placesLeft: 12 }, SITE, at);
    assert.match(email.subject, /^New Booking Request — Mekdes .*, Sunday,? 1 November 2026$/);
    assert.ok(email.html.includes('New Booking Request'));
    assert.ok(email.html.includes('14:05'), 'the time it came in, in Addis Ababa time');
    assert.ok(email.html.includes('mailto:mekdes@example.com?subject=Your%20booking%20at%20Bushaashe%20Garuwa%20(BG-7K3Q)'), 'reply to guest');
    assert.ok(email.html.includes('tel:+251911223344'), 'call guest');
    assert.ok(!email.html.includes('<script>alert(1)</script>'));
    assert.ok(!email.html.includes('made a request on our website'), 'the guest note is only for guests');
  });

  it('leaves out the reply or call button when there is no email or phone', () => {
    const email = staffNewMessage({ name: 'Hanna', message: 'Hi', lang: 'en', email: 'hanna@example.com', phone: null }, SITE);
    assert.ok(email.html.includes('Reply to Guest'));
    assert.ok(!email.html.includes('Call Guest'));
  });

  it('writes Amharic guests in Amharic', () => {
    const email = contactReceived({ name: 'ሀና', message: 'ሰላም', lang: 'am' }, SITE);
    assert.ok(email.subject.startsWith('መልእክትዎ ደርሶናል'));
    assert.ok(email.html.includes('ድረ ገጻችንን ይጎብኙ'));
    assert.ok(email.html.includes('lang="am"'));
  });
});
