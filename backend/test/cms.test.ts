import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import { openDatabase } from '../src/db/database.js';

process.env.NODE_ENV = 'test'; // keeps the logger quiet

const ADMIN_KEY = 'test-admin-key-0123456789abcdef';
const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const lastYear = '2020-05-01';

let base = '';
let close: () => void;

before(async () => {
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_API_KEY: ADMIN_KEY, FORM_RATE_LIMIT: '50' });
  const db = openDatabase(':memory:');
  const server = createApp(env, db).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
  close = () => {
    server.close();
    db.close();
  };
});
after(() => close());

const read = (res: Response): Promise<any> => res.json();
const staff = (path: string, init: RequestInit = {}) =>
  fetch(base + path, {
    ...init,
    headers: { authorization: `Bearer ${ADMIN_KEY}`, 'content-type': 'application/json', ...init.headers },
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

  it('lets staff mark a booking as done', async () => {
    const bookings = await read(await staff('/v1/events/admin/bookings'));
    const id = bookings.data.items[0].id;
    const updated = await read(await staff(`/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'done' }) }));
    assert.equal(updated.data.status, 'done');
  });
});
