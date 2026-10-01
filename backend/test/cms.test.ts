import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import { openTestDatabase } from './helpers/database.js';
import { memoryMailer } from '../src/modules/notifications/mailer.js';

process.env.NODE_ENV = 'test'; // keeps the logger quiet

const STAFF_EMAIL = 'staff@bushaashegaruwa.test';
const STAFF_PASSWORD = 'a-test-password-only';
/** the session token the staff account gets when it signs in, set in before() */
let staffToken = '';
const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const lastYear = '2020-05-01';

let base = '';
/** emails the API would have sent, kept in memory */
const outbox = memoryMailer();
let close: () => Promise<void>;

before(async () => {
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: STAFF_EMAIL, ADMIN_PASSWORD: STAFF_PASSWORD, FORM_RATE_LIMIT: '50', STAFF_EMAIL: 'staff@bushaashegaruwa.com' });
  const db = await openTestDatabase();
  const app = createApp(env, db, { mailer: outbox });
  await app.prepare(); // creates the staff account from the settings
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;

  const signIn = await fetch(base + '/v1/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: STAFF_EMAIL, password: STAFF_PASSWORD }),
  });
  staffToken = ((await signIn.json()) as { data: { token: string } }).data.token;
  close = async () => {
    server.close();
    await db.close();
  };
});
after(() => close());

const read = (res: Response): Promise<any> => res.json();
const staff = (path: string, init: RequestInit = {}) =>
  fetch(base + path, {
    ...init,
    headers: { authorization: `Bearer ${staffToken}`, 'content-type': 'application/json', ...init.headers },
  });
const post = (path: string, body: unknown) =>
  fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

const culturalFood = {
  date: inTwoWeeks,
  time: '17:00 – 21:00',
  category: 'food',
  availability: 'limited',
  featured: true,
  published: true,
  bookable: true,
  capacity: 10,
  partner: 'Lidya Cultural Food',
  translations: {
    en: { name: 'Wolaita Cultural Food Evening', desc: 'Traditional dishes, coffee ceremony and storytelling.' },
    am: { name: 'የወላይታ ባህላዊ ምግብ ምሽት' },
  },
};

describe('website content', () => {
  it('saves staff edits and serves them to the website', async () => {
    const save = await staff('/v1/content/admin', {
      method: 'PUT',
      body: JSON.stringify({
        entries: [
          { key: 'home.hero.title', lang: 'en', value: 'A Living Wolaita Heritage' },
          { key: 'home.hero.title', lang: 'am', value: 'ሕያው የወላይታ ቅርስ' },
          { key: 'settings.phone', lang: '*', value: '+251 911 22 33 44' },
        ],
      }),
    });
    assert.equal(save.status, 200);

    const english = await read(await fetch(base + '/v1/content?lang=en'));
    assert.equal(english.data.entries['home.hero.title'], 'A Living Wolaita Heritage');
    assert.equal(english.data.entries['settings.phone'], '+251 911 22 33 44', 'shared values reach every language');

    const amharic = await read(await fetch(base + '/v1/content?lang=am'));
    assert.equal(amharic.data.entries['home.hero.title'], 'ሕያው የወላይታ ቅርስ');
  });

  it('puts the built-in text back when the value is emptied', async () => {
    await staff('/v1/content/admin', {
      method: 'PUT',
      body: JSON.stringify({ entries: [{ key: 'home.hero.title', lang: 'en', value: '  ' }] }),
    });
    const english = await read(await fetch(base + '/v1/content?lang=en'));
    assert.equal(english.data.entries['home.hero.title'], undefined);
  });

  it('refuses keys that are not text paths, and edits from strangers', async () => {
    const bad = await staff('/v1/content/admin', {
      method: 'PUT',
      body: JSON.stringify({ entries: [{ key: 'DROP TABLE;', lang: 'en', value: 'x' }] }),
    });
    assert.equal(bad.status, 400);
    const stranger = await fetch(base + '/v1/content/admin', { method: 'PUT', body: '{}' });
    assert.equal(stranger.status, 401);
  });
});

describe('events', () => {
  it('adds an event and shows it on the website', async () => {
    const created = await read(await staff('/v1/events/admin', { method: 'POST', body: JSON.stringify(culturalFood) }));
    assert.equal(created.data.partner, 'Lidya Cultural Food');
    assert.equal(created.data.bookable, true);

    const publicList = await read(await fetch(base + '/v1/events'));
    assert.equal(publicList.data.items.length, 1);
    assert.equal(publicList.data.items[0].translations.en.name, 'Wolaita Cultural Food Evening');
  });

  it('keeps drafts and past events off the website', async () => {
    await staff('/v1/events/admin', {
      method: 'POST',
      body: JSON.stringify({ ...culturalFood, published: false, translations: { en: { name: 'Draft evening' } } }),
    });
    await staff('/v1/events/admin', {
      method: 'POST',
      body: JSON.stringify({ ...culturalFood, date: lastYear, translations: { en: { name: 'Past evening' } } }),
    });

    const publicList = await read(await fetch(base + '/v1/events'));
    assert.equal(publicList.data.items.length, 1);
    const staffList = await read(await staff('/v1/events/admin'));
    assert.equal(staffList.data.items.length, 3, 'staff see drafts and past events too');
  });

  it('changes and removes an event', async () => {
    const list = await read(await staff('/v1/events/admin'));
    const draft = list.data.items.find((e: any) => e.translations.en.name === 'Draft evening');
    const updated = await read(
      await staff(`/v1/events/admin/${draft.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...culturalFood, published: true, translations: { en: { name: 'Second evening' } } }),
      }),
    );
    assert.equal(updated.data.translations.en.name, 'Second evening');
    assert.equal((await staff(`/v1/events/admin/${draft.id}`, { method: 'DELETE' })).status, 200);
    assert.equal((await staff(`/v1/events/admin/${draft.id}`, { method: 'DELETE' })).status, 404);
  });
});

describe('booking a place at an event', () => {
  let eventId = 0;

  before(async () => {
    const list = await read(await staff('/v1/events/admin'));
    eventId = list.data.items.find((e: any) => e.translations.en.name === 'Wolaita Cultural Food Evening').id;
  });

  it('shows how many places are left on the website', async () => {
    const publicList = await read(await fetch(base + '/v1/events'));
    const event = publicList.data.items.find((e: any) => e.id === eventId);
    assert.equal(event.capacity, 10);
    assert.equal(event.placesLeft, 10);
  });

  it('takes a booking and counts the guests', async () => {
    const res = await post(`/v1/events/${eventId}/bookings`, {
      name: 'Selam Bekele',
      phone: '+251 911 00 11 22',
      guests: 4,
      message: 'We are celebrating a birthday.',
      language: 'en',
    });
    assert.equal(res.status, 201);

    const bookings = await read(await staff(`/v1/events/admin/bookings?eventId=${eventId}`));
    assert.equal(bookings.data.total, 1);
    assert.equal(bookings.data.items[0].guests, 4);
    assert.equal(bookings.data.items[0].eventName, 'Wolaita Cultural Food Evening');

    assert.match(bookings.data.items[0].reference, /^BG-[2-9A-HJ-NP-Z]{4}$/, 'the guest gets a short code');
    assert.equal(bookings.data.items[0].status, 'pending');

    const summary = await read(await staff('/v1/admin/summary'));
    assert.equal(summary.data.bookings.guestsUpcoming, 4);
    assert.equal(summary.data.events.upcoming, 1, 'the second evening was removed in the test above');
  });

  it('refuses bookings for past events and unknown events', async () => {
    const list = await read(await staff('/v1/events/admin'));
    const past = list.data.items.find((e: any) => e.translations.en.name === 'Past evening');
    assert.equal((await post(`/v1/events/${past.id}/bookings`, { name: 'A', phone: '0911000000', guests: 1 })).status, 400);
    assert.equal((await post('/v1/events/9999/bookings', { name: 'A', phone: '0911000000', guests: 1 })).status, 404);
  });

  it('checks the guest details', async () => {
    const res = await post(`/v1/events/${eventId}/bookings`, { name: '', phone: 'abc', guests: 0 });
    assert.equal(res.status, 400);
    const fields = (await read(res)).error.details.map((d: { field: string }) => d.field);
    assert.deepEqual(fields.sort(), ['guests', 'name', 'phone']);
  });

  it('treats a repeat request from the same phone as the same booking', async () => {
    const again = await post(`/v1/events/${eventId}/bookings`, {
      name: 'Selam Bekele',
      phone: '0911 00 11 22', // the same number written differently
      guests: 4,
      language: 'en',
    });
    assert.equal(again.status, 201);
    const bookings = await read(await staff(`/v1/events/admin/bookings?eventId=${eventId}`));
    assert.equal(bookings.data.total, 1, 'no second booking is created');
  });

  it('refuses more guests than there are places left', async () => {
    const tooMany = await post(`/v1/events/${eventId}/bookings`, { name: 'Big group', phone: '0922 00 00 00', guests: 9 });
    assert.equal(tooMany.status, 409);
    const body = await read(tooMany);
    assert.equal(body.error.code, 'not_enough_places');
    assert.equal(body.error.details.placesLeft, 6);
  });

  it('fills the event, then frees the places again when a booking is cancelled', async () => {
    const fill = await post(`/v1/events/${eventId}/bookings`, { name: 'Family', phone: '0933 00 00 00', guests: 6 });
    assert.equal(fill.status, 201);
    const filled = await read(await fetch(base + '/v1/events'));
    assert.equal(filled.data.items.find((e: any) => e.id === eventId).placesLeft, 0);

    const full = await post(`/v1/events/${eventId}/bookings`, { name: 'Late guest', phone: '0944 00 00 00', guests: 1 });
    assert.equal(full.status, 409);
    assert.equal((await read(full)).error.code, 'event_full');

    const list = await read(await staff(`/v1/events/admin/bookings?eventId=${eventId}`));
    const family = list.data.items.find((b: any) => b.name === 'Family');
    await staff(`/v1/events/admin/bookings/${family.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) });

    const freed = await read(await fetch(base + '/v1/events'));
    assert.equal(freed.data.items.find((e: any) => e.id === eventId).placesLeft, 6, 'cancelled places go back');
  });

  it('lets staff confirm a booking', async () => {
    const bookings = await read(await staff(`/v1/events/admin/bookings?eventId=${eventId}&status=pending`));
    const id = bookings.data.items[0].id;
    const updated = await read(await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'confirmed' }) }));
    assert.equal(updated.data.status, 'confirmed');
    assert.equal((await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'done' }) })).status, 400, 'only booking statuses are allowed');
  });
});

describe('staff search and the handled-today count', () => {
  it('finds a booking by its short code, name or phone', async () => {
    const all = await read(await staff('/v1/events/admin/bookings'));
    const one = all.data.items[0];
    const byCode = await read(await staff(`/v1/events/admin/bookings?q=${encodeURIComponent(one.reference)}`));
    assert.equal(byCode.data.total, 1);
    assert.equal(byCode.data.items[0].id, one.id);

    const byName = await read(await staff(`/v1/events/admin/bookings?q=${encodeURIComponent(one.name.split(' ')[0])}`));
    assert.ok(byName.data.items.some((b: any) => b.id === one.id));

    const nothing = await read(await staff('/v1/events/admin/bookings?q=nobody-by-this-name'));
    assert.equal(nothing.data.total, 0);
  });

  it('counts what staff handled today, and forgets it when a booking goes back to pending', async () => {
    // start from a booking put back to pending, so the test does not depend on the ones above
    const any = await read(await staff('/v1/events/admin/bookings'));
    const id = any.data.items[0].id;
    await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'pending' }) });
    const before = (await read(await staff('/v1/admin/summary'))).data.bookings.handledToday;

    await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'confirmed' }) });
    assert.equal((await read(await staff('/v1/admin/summary'))).data.bookings.handledToday, before + 1);

    await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'pending' }) });
    assert.equal((await read(await staff('/v1/admin/summary'))).data.bookings.handledToday, before);
  });
});

describe('emails', () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

  it('sends the guest their booking number, and tells the staff', async () => {
    outbox.sent.length = 0;
    const list = await read(await staff('/v1/events/admin'));
    const event = list.data.items.find((e: any) => e.translations.en.name === 'Wolaita Cultural Food Evening');
    // make room so the booking goes through
    await staff(`/v1/events/admin/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...culturalFood, capacity: 200, translations: event.translations }),
    });
    const res = await post(`/v1/events/${event.id}/bookings`, {
      name: 'Mekdes <b>Haile</b>',
      phone: '0988 77 66 55',
      email: 'mekdes@example.com',
      guests: 2,
      language: 'am',
    });
    const { reference } = (await read(res)).data;
    await settle();

    const guest = outbox.sent.find((m) => m.kind === 'booking-received');
    assert.ok(guest, 'the guest gets an email');
    assert.equal(guest.to, 'mekdes@example.com');
    assert.ok(guest.subject.includes(reference), 'the subject carries the booking number');
    assert.ok(guest.subject.startsWith('ቦታዎ ተይዟል'), 'written in the language the guest used');
    assert.ok(guest.html.includes('Mekdes &lt;b&gt;Haile&lt;/b&gt;'), 'what a guest types is escaped');
    assert.ok(!guest.html.includes('<b>Haile</b>'));
    assert.ok(guest.text.includes(reference), 'a plain-text copy is included');

    const staffNotice = outbox.sent.find((m) => m.kind === 'staff-new-booking');
    assert.equal(staffNotice?.to, 'staff@bushaashegaruwa.com');
  });

  it('tells the guest once when their booking is confirmed', async () => {
    const found = await read(await staff('/v1/events/admin/bookings?q=Mekdes'));
    const id = found.data.items[0].id;
    outbox.sent.length = 0;

    await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'confirmed' }) });
    await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'confirmed' }) });
    await settle();

    const confirmations = outbox.sent.filter((m) => m.kind === 'booking-confirmed');
    assert.equal(confirmations.length, 1, 'setting confirmed twice sends one email');
  });

  it('skips the guest email when no address was given', async () => {
    outbox.sent.length = 0;
    const list = await read(await staff('/v1/events/admin'));
    const event = list.data.items.find((e: any) => e.translations.en.name === 'Wolaita Cultural Food Evening');
    await post(`/v1/events/${event.id}/bookings`, { name: 'No Email', phone: '0977 11 22 33', guests: 1 });
    await settle();
    assert.equal(outbox.sent.filter((m) => m.kind === 'booking-received').length, 0);
    assert.equal(outbox.sent.filter((m) => m.kind === 'staff-new-booking').length, 1);
  });
});

describe('two guests asking at the same moment', () => {
  it('never gives the last places out twice', async () => {
    const created = await read(
      await staff('/v1/events/admin', {
        method: 'POST',
        body: JSON.stringify({ ...culturalFood, capacity: 4, translations: { en: { name: 'Small evening' } } }),
      }),
    );
    const id = created.data.id;

    // six different guests, three places each, all sent at once: only one can fit
    const answers = await Promise.all(
      Array.from({ length: 6 }, (_, i) => post(`/v1/events/${id}/bookings`, { name: `Guest ${i}`, phone: `09220000${10 + i}`, guests: 3 })),
    );
    const statuses = answers.map((res) => res.status).sort();
    assert.deepEqual(statuses, [201, 409, 409, 409, 409, 409]);

    const events = await read(await staff('/v1/events/admin'));
    const small = events.data.items.find((e: any) => e.id === id);
    assert.equal(small.placesLeft, 1, 'three of the four places are taken, once');
  });
});
