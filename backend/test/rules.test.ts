import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import {
  addDays,
  checkEmail,
  checkEventDate,
  checkEventTime,
  checkName,
  checkNewPassword,
  checkVisitDate,
  checkWholeNumber,
  clean,
  eventTimes,
  isRealDate,
  phoneNumber,
  todayInEthiopia,
} from '../src/modules/shared/rules.js';
import { openTestDatabase } from './helpers/database.js';

process.env.NODE_ENV = 'test';

describe('the form rules', () => {
  it('are the same on the website and on the API', () => {
    const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
    assert.equal(
      read('../src/modules/shared/rules.ts'),
      read('../../frontend/src/lib/rules.ts'),
      'copy frontend/src/lib/rules.ts to backend/src/modules/shared/rules.ts',
    );
  });

  it('reads Ethiopian and international phone numbers', () => {
    for (const [typed, kept] of [
      ['0912345678', '+251912345678'],
      ['0912 345 678', '+251912345678'],
      ['091-234-5678', '+251912345678'],
      ['912345678', '+251912345678'],
      ['0712345678', '+251712345678'],
      ['+251 912 345 678', '+251912345678'],
      ['251912345678', '+251912345678'],
      ['00251912345678', '+251912345678'],
      ['0465512345', '+251465512345'],
      ['(011) 551 2345', '+251115512345'],
      ['+44 20 7946 0958', '+442079460958'],
      ['+1 (202) 555-0143', '+12025550143'],
    ]) {
      assert.equal(phoneNumber(typed!), kept, typed);
    }
    for (const typed of ['', '-------', '( ) ( )', 'abc', '12345', '0912345', '09123456789', '001234567','+251 0912 345 678', '+251 812 345 678', '0612345678', '+0 123 456 789', '+1234567', '0912345678 ext 2', '++251912345678', '+251912345678+']) {
      assert.equal(phoneNumber(typed), null, typed);
    }
  });

  it('asks for a name with letters, in any script', () => {
    for (const name of ['Abebe Kebede', 'አበበ ከበደ', 'W/ro Almaz', "O'Neil", 'Abebe & family', 'Group 12', 'Jo']) assert.equal(checkName(name), null, name);
    assert.equal(checkName(''), 'required');
    assert.equal(checkName('   '), 'required');
    for (const name of ['A', '1234', '<b>Abebe</b>', 'abebe@example.com', 'http://spam.example', 'www.spam.com', 'Abebe #1', 'Two\nlines']) {
      assert.equal(checkName(name), 'name', name);
    }
    assert.equal(checkName('a'.repeat(121)), 'tooLong');
  });

  it('asks for a full email address', () => {
    for (const email of ['name@example.com', 'first.last+tag@mail.example.et']) assert.equal(checkEmail(email), null, email);
    for (const email of ['name', 'name@', '@example.com', 'name@example', 'na me@example.com', 'name@@example.com', '.name@example.com', 'na..me@example.com']) {
      assert.equal(checkEmail(email), 'email', email);
    }
    assert.equal(checkEmail('', false), null, 'empty is fine when it is optional');
    assert.equal(checkEmail(''), 'required');
  });

  it('knows real days, and the visiting window', () => {
    assert.equal(isRealDate('2026-02-28'), true);
    assert.equal(isRealDate('2028-02-29'), true, 'a leap year');
    for (const date of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-00-10', '2026-1-5', '05/01/2026', '']) assert.equal(isRealDate(date), false, date);

    // 7 November 2026, 10:00 in Addis Ababa
    const now = Date.parse('2026-11-07T07:00:00Z');
    assert.equal(todayInEthiopia(now), '2026-11-07');
    assert.equal(todayInEthiopia(Date.parse('2026-11-07T22:30:00Z')), '2026-11-08', 'after 21:00 UTC it is already tomorrow in Ethiopia');
    assert.equal(checkVisitDate('2026-11-07', now), null);
    assert.equal(checkVisitDate('2026-11-06', now), null, 'one day of grace for visitors where it is still yesterday');
    assert.equal(checkVisitDate('2026-11-05', now), 'pastDate');
    assert.equal(checkVisitDate(addDays('2026-11-07', 730), now), null);
    assert.equal(checkVisitDate(addDays('2026-11-07', 731), now), 'farDate');
    assert.equal(checkVisitDate('2026-02-30', now), 'date');
    assert.equal(checkEventDate('2026-11-06', true, now), 'pastDate', 'a new event cannot be in the past');
    assert.equal(checkEventDate('2026-11-06', false, now), null, 'an existing one can be put right');
  });

  it('reads the event time the countdown starts from', () => {
    assert.deepEqual(eventTimes('17:00 – 21:00'), { start: { hours: 17, minutes: 0 }, end: { hours: 21, minutes: 0 } });
    assert.deepEqual(eventTimes('8:00 AM - 2:00 AM'), { start: { hours: 8, minutes: 0 }, end: { hours: 2, minutes: 0 } });
    assert.deepEqual(eventTimes('6 PM to 10 PM'), { start: { hours: 18, minutes: 0 }, end: { hours: 22, minutes: 0 } });
    assert.deepEqual(eventTimes('12:30 PM'), { start: { hours: 12, minutes: 30 }, end: null });
    assert.deepEqual(eventTimes('12 AM'), { start: { hours: 0, minutes: 0 }, end: null });
    for (const time of ['evening', '25:00', '17:60', '13 PM', '17:00 - ', '9 - 5 - 3']) assert.equal(checkEventTime(time), 'time', time);
    assert.equal(checkEventTime(''), null, 'the time may be left out');
  });

  it('checks numbers and passwords', () => {
    assert.equal(checkWholeNumber('3', 1, 200), null);
    assert.equal(checkWholeNumber('0', 1, 200), 'tooFew');
    assert.equal(checkWholeNumber('201', 1, 200), 'tooMany');
    assert.equal(checkWholeNumber('2.5', 1, 200), 'wholeNumber');
    assert.equal(checkWholeNumber('-1', 1, 200), 'wholeNumber');
    assert.equal(checkNewPassword('short'), 'passwordShort');
    assert.equal(checkNewPassword('the same one', 'the same one'), 'passwordSame');
    assert.equal(checkNewPassword('Owner@Example.com', '', 'owner@example.com'), 'passwordEmail');
    assert.equal(checkNewPassword('a long enough one'), null);
  });

  it('removes invisible characters', () => {
    assert.equal(clean('  Abebe​\u0000 '), 'Abebe');
    assert.equal(clean('line one\nline two'), 'line one\nline two', 'line breaks stay');
  });
});

describe('the forms, on the API', () => {
  const STAFF_EMAIL = 'owner@bushaashegaruwa.test';
  let base = '';
  let token = '';
  let close: () => Promise<void>;
  const inTwoWeeks = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

  before(async () => {
    const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: STAFF_EMAIL, ADMIN_PASSWORD: 'a-test-password-only', FORM_RATE_LIMIT: '100' });
    const db = await openTestDatabase();
    const app = createApp(env, db);
    await app.prepare();
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
    const signIn = await fetch(base + '/v1/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: STAFF_EMAIL, password: 'a-test-password-only' }),
    });
    token = ((await signIn.json()) as { data: { token: string } }).data.token;
    close = async () => {
      server.close();
      await db.close();
    };
  });
  after(() => close());

  const send = (path: string, body: unknown, method = 'POST', auth = false) =>
    fetch(base + path, {
      method,
      headers: { 'content-type': 'application/json', ...(auth ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
  const fieldsOf = async (res: Response) => ((await res.json()) as any).error.details.map((d: { field: string }) => d.field).sort();

  it('refuses a contact message with a made-up phone number or a name without letters', async () => {
    const res = await send('/v1/contact', { name: '1234', email: 'abebe@example.com', phone: '-------', message: 'Hello' });
    assert.equal(res.status, 400);
    assert.deepEqual(await fieldsOf(res), ['name', 'phone']);
  });

  it('says what is wrong with an optional field, not just "Invalid input"', async () => {
    const res = await send('/v1/contact', { name: 'Abebe Kebede', email: 'abebe@example.com', phone: '-------', message: 'Hello' });
    const details = ((await res.json()) as any).error.details;
    assert.equal(details[0].field, 'phone');
    assert.match(details[0].message, /phone number/);
  });

  it('keeps phone numbers in one form', async () => {
    const res = await send('/v1/visits', { name: 'Abebe Kebede', phone: '0912 345 678', date: inTwoWeeks, visitors: '2' });
    assert.equal(res.status, 201);
    const list = (await (await fetch(base + '/v1/visits', { headers: { authorization: `Bearer ${token}` } })).json()) as any;
    assert.equal(list.data.items[0].phone, '+251912345678');
  });

  it('refuses a visit on a day that does not exist', async () => {
    const res = await send('/v1/visits', { name: 'Abebe Kebede', phone: '0912345678', date: '2027-02-30', visitors: '2' });
    assert.equal(res.status, 400);
    assert.deepEqual(await fieldsOf(res), ['date']);
  });

  it('refuses an event time the countdown cannot read, and fewer places than are booked', async () => {
    const event = {
      date: inTwoWeeks,
      time: 'in the evening',
      category: 'food',
      bookable: true,
      capacity: 10,
      translations: { en: { name: 'Cultural Food Evening' } },
    };
    const refused = await send('/v1/events/admin', event, 'POST', true);
    assert.equal(refused.status, 400);
    assert.deepEqual(await fieldsOf(refused), ['time']);

    const created = (await (await send('/v1/events/admin', { ...event, time: '17:00 – 21:00' }, 'POST', true)).json()) as any;
    const id = created.data.id;
    assert.equal((await send(`/v1/events/${id}/bookings`, { name: 'Abebe Kebede', phone: '0912345678', guests: 6 })).status, 201);
    const shrink = await send(`/v1/events/admin/${id}`, { ...event, time: '17:00', capacity: 5 }, 'PUT', true);
    assert.equal(shrink.status, 409, 'six guests are booked');
    assert.equal((await send(`/v1/events/admin/${id}`, { ...event, time: '17:00', capacity: 6 }, 'PUT', true)).status, 200);
  });

  it('takes an event exactly as the staff form sends it: no photo, no partner, no time, no limit', async () => {
    // "No photo" is null, an event saved without a partner or a time comes back as null, untouched languages are empty
    const res = await send(
      '/v1/events/admin',
      {
        date: inTwoWeeks,
        time: null,
        category: 'culture',
        availability: 'open',
        featured: false,
        published: false,
        photo: null,
        partner: null,
        bookable: false,
        capacity: null,
        translations: { en: { name: 'Gifaataa Eve', desc: '' }, am: { name: '', desc: '' }, wol: { name: '', desc: '' } },
      },
      'POST',
      true,
    );
    assert.equal(res.status, 201, JSON.stringify(((await res.json()) as any).error));
  });

  it('names the field when an event is refused', async () => {
    const res = await send('/v1/events/admin', { date: inTwoWeeks, category: 'food', translations: { en: { name: '' } } }, 'POST', true);
    assert.equal(res.status, 400);
    const details = ((await res.json()) as any).error.details;
    assert.deepEqual(details, [{ field: 'translations.en.name', message: 'Please fill this in' }]);
  });

  it('refuses a staff name without letters', async () => {
    const res = await send('/v1/admin/staff', { email: 'new@bushaashegaruwa.test', name: '...', role: 'staff' }, 'POST', true);
    assert.equal(res.status, 400);
    assert.deepEqual(await fieldsOf(res), ['name']);
  });
});
