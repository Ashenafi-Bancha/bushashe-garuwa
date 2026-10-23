import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import type { Database } from '../src/db/database.js';
import { todayInEthiopia } from '../src/db/sql.js';
import { memoryMailer } from '../src/modules/notifications/mailer.js';
import { openTestDatabase } from './helpers/database.js';

process.env.NODE_ENV = 'test'; // keeps the logger quiet

let db: Database;
let server: Server;
let base = '';
let token = '';

before(async () => {
  db = await openTestDatabase();
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: 'owner@bushaashegaruwa.test', ADMIN_PASSWORD: 'the-owner-password', FORM_RATE_LIMIT: '50' });
  const app = createApp(env, db, { mailer: memoryMailer() });
  await app.prepare();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
  const res = await call('', '/admin/login', 'POST', { email: 'owner@bushaashegaruwa.test', password: 'the-owner-password' });
  token = res.data.token;
});
after(async () => {
  server.close();
  await db.close();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function call(auth: string, path: string, method = 'GET', body?: unknown): Promise<{ status: number; data: any }> {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(auth ? { authorization: `Bearer ${auth}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { data?: unknown };
  return { status: res.status, data: json.data };
}

const plusDays = (n: number) => {
  const day = new Date(`${todayInEthiopia()}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + n);
  return day.toISOString().slice(0, 10);
};

describe('guests reviews', () => {
  it('shows only published reviews on the website, newest first', async () => {
    assert.equal((await call('', '/reviews')).data.items.length, 0, 'none yet');
    const first = await call(token, '/reviews/admin', 'POST', { name: 'Selam', origin: 'Addis Ababa', words: { en: 'A peaceful day.', am: 'ሰላማዊ ቀን።' }, rating: 5 });
    assert.equal(first.status, 201);
    assert.equal(first.data.words.am, 'ሰላማዊ ቀን።');
    await call(token, '/reviews/admin', 'POST', { name: 'Hidden', words: { en: 'Not yet' }, published: false });
    await call(token, '/reviews/admin', 'POST', { name: 'Dawit', words: { en: 'Great food.', am: '' } });

    const shown = (await call('', '/reviews')).data.items as { name: string; words: { am?: string } }[];
    assert.deepEqual(shown.map((r) => r.name), ['Dawit', 'Selam']);
    assert.equal(shown[0]!.words.am, undefined, 'an empty translation falls back to English');
    assert.equal((await call(token, '/reviews/admin')).data.items.length, 3, 'staff see the hidden one too');
  });

  it('lets staff change, hide and remove a review, and keeps it to staff', async () => {
    const [latest] = (await call(token, '/reviews/admin')).data.items as { id: number }[];
    const changed = await call(token, `/reviews/admin/${latest!.id}`, 'PUT', { name: 'Dawit A.', words: { en: 'Great food!' }, rating: 4, published: false });
    assert.equal(changed.data.name, 'Dawit A.');
    assert.equal((await call('', '/reviews')).data.items.some((r: { id: number }) => r.id === latest!.id), false);
    assert.equal((await call(token, `/reviews/admin/${latest!.id}`, 'DELETE')).status, 200);
    assert.equal((await call(token, `/reviews/admin/${latest!.id}`, 'DELETE')).status, 404);

    assert.equal((await call('', '/reviews/admin')).status, 401);
    assert.equal((await call('', '/reviews/admin', 'POST', { name: 'X', words: { en: 'Y' } })).status, 401);
    assert.equal((await call(token, '/reviews/admin', 'POST', { name: 'X', words: { en: '' } })).status, 400, 'English is required');
    assert.equal((await call(token, '/reviews/admin', 'POST', { name: 'X', words: { en: 'Y' }, rating: 9 })).status, 400);
  });
});

describe('the schedule', () => {
  it('lists, day by day, the visits and the events with their bookings', async () => {
    const tomorrow = plusDays(1);
    await call('', '/visits', 'POST', { name: 'Almaz', phone: '+251911000222', date: tomorrow, visitors: '3–5', experiences: ['heritage'], language: 'en' });
    await call('', '/visits', 'POST', { name: 'Far Future', phone: '+251911000333', date: plusDays(40), visitors: '2', language: 'en' });
    const event = await call(token, '/events/admin', 'POST', { date: tomorrow, time: '18:00', category: 'food', bookable: true, translations: { en: { name: 'Cultural food evening' } } });
    assert.equal(event.status, 201);
    await call('', `/events/${event.data.id}/bookings`, 'POST', { name: 'Hanna', phone: '+251911000444', guests: 4, language: 'en' });
    const cancelled = await call('', `/events/${event.data.id}/bookings`, 'POST', { name: 'Gone', phone: '+251911000555', guests: 2, language: 'en' });
    assert.equal(cancelled.status, 201);
    const bookings = (await call(token, '/events/admin/bookings?q=Gone')).data.items as { id: number }[];
    await call(token, `/events/admin/bookings/${bookings[0]!.id}/status`, 'PATCH', { status: 'cancelled' });

    const res = await call(token, '/admin/schedule');
    assert.equal(res.status, 200);
    assert.equal(res.data.from, todayInEthiopia());
    const day = (res.data.days as { date: string; visits: { name: string }[]; events: { name: string; guests: number; bookings: { name: string }[] }[] }[]).find((d) => d.date === tomorrow)!;
    assert.deepEqual(day.visits.map((v) => v.name), ['Almaz']);
    assert.equal(day.events[0]!.name, 'Cultural food evening');
    assert.equal(day.events[0]!.guests, 4, 'cancelled bookings do not count');
    assert.deepEqual(day.events[0]!.bookings.map((b) => b.name), ['Hanna']);
    assert.equal((res.data.days as { visits: { name: string }[] }[]).some((d) => d.visits.some((v) => v.name === 'Far Future')), false, 'two weeks by default');

    const later = await call(token, `/admin/schedule?from=${plusDays(35)}&days=10`);
    assert.ok(later.data.days.some((d: { visits: { name: string }[] }) => d.visits.some((v) => v.name === 'Far Future')));
    assert.equal((await call(token, '/admin/schedule?days=500')).status, 400);
    assert.equal((await call('', '/admin/schedule')).status, 401);
  });
});
