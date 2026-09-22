import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import { openDatabase } from '../src/db/database.js';

process.env.NODE_ENV = 'test'; // keeps the logger quiet

const ADMIN_KEY = 'test-admin-key-0123456789abcdef';
const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

let base = '';
let close: () => void;

before(async () => {
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_API_KEY: ADMIN_KEY, FORM_RATE_LIMIT: '7' });
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

const post = (path: string, body: unknown) =>
  fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
/** Response body as loosely typed JSON, for assertions */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const read = (res: Response): Promise<any> => res.json();
const staff = (path: string, init: RequestInit = {}) =>
  fetch(base + path, {
    ...init,
    headers: { authorization: `Bearer ${ADMIN_KEY}`, 'content-type': 'application/json', ...init.headers },
  });

describe('health', () => {
  it('reports ok', async () => {
    const res = await fetch(base + '/health');
    assert.equal(res.status, 200);
    assert.equal((await read(res)).database, 'ok');
  });
});

describe('contact messages', () => {
  it('saves a valid message', async () => {
    const res = await post('/v1/contact', { name: 'Abebe', email: 'Abebe@Example.com', phone: '', message: 'Selam!', language: 'am' });
    assert.equal(res.status, 201);
    const list = await read(await staff('/v1/contact'));
    assert.equal(list.data.total, 1);
    assert.equal(list.data.items[0].email, 'abebe@example.com');
    assert.equal(list.data.items[0].phone, null);
    assert.equal(list.data.items[0].language, 'am');
  });

  it('rejects missing fields with details', async () => {
    const res = await post('/v1/contact', { name: '', email: 'not-an-email' });
    assert.equal(res.status, 400);
    const body = await read(res);
    assert.equal(body.error.code, 'bad_request');
    assert.deepEqual(body.error.details.map((d: { field: string }) => d.field).sort(), ['email', 'message', 'name']);
  });

  it('quietly ignores spam from the hidden field', async () => {
    const res = await post('/v1/contact', { name: 'Bot', email: 'bot@spam.com', message: 'buy', website: 'x' });
    assert.equal(res.status, 201);
    const list = await read(await staff('/v1/contact'));
    assert.equal(list.data.total, 1);
  });

  it('keeps the list for staff only', async () => {
    assert.equal((await fetch(base + '/v1/contact')).status, 401);
    assert.equal((await fetch(base + '/v1/contact', { headers: { authorization: 'Bearer wrong' } })).status, 401);
  });

  it('lets staff update the status', async () => {
    const res = await staff('/v1/contact/1/status', { method: 'PATCH', body: JSON.stringify({ status: 'done' }) });
    assert.equal(res.status, 200);
    assert.equal((await read(res)).data.status, 'done');
    const missing = await staff('/v1/contact/999/status', { method: 'PATCH', body: JSON.stringify({ status: 'done' }) });
    assert.equal(missing.status, 404);
  });
});

describe('visit requests', () => {
  it('saves a valid request', async () => {
    const res = await post('/v1/visits', {
      name: 'Hanna',
      phone: '+251 911 000 000',
      date: nextMonth,
      visitors: '6–10',
      experiences: ['heritage', 'food', 'food'],
      language: 'en',
    });
    assert.equal(res.status, 201);
    const list = await read(await staff('/v1/visits?upcoming=true'));
    assert.equal(list.data.total, 1);
    assert.deepEqual(list.data.items[0].experiences, ['heritage', 'food']);
  });

  it('rejects past dates and unknown options', async () => {
    const res = await post('/v1/visits', {
      name: 'Hanna',
      phone: '0911000000',
      date: '2020-01-01',
      visitors: '1000',
      experiences: ['skydiving'],
    });
    assert.equal(res.status, 400);
    const fields = (await read(res)).error.details.map((d: { field: string }) => d.field);
    assert.ok(fields.includes('date'));
    assert.ok(fields.includes('visitors'));
    assert.ok(fields.includes('experiences.0'));
  });
});

describe('protection', () => {
  it('limits form submissions per visitor', async () => {
    // 7 form posts allowed per window in this test (shared by both forms); the tests above used 5
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) statuses.push((await post('/v1/contact', { name: 'x', email: 'x@y.com', message: 'm' })).status);
    assert.deepEqual(statuses, [201, 201, 429, 429]);
  });

  it('answers unknown endpoints with JSON 404', async () => {
    const res = await fetch(base + '/v1/nothing');
    assert.equal(res.status, 404);
    assert.equal((await read(res)).error.code, 'not_found');
  });
});
