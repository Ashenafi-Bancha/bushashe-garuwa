import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

let base = '';
/** emails the API would have sent, kept in memory */
const outbox = memoryMailer();
let close: () => Promise<void>;

before(async () => {
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: STAFF_EMAIL, ADMIN_PASSWORD: STAFF_PASSWORD, FORM_RATE_LIMIT: '7' });
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

const post = (path: string, body: unknown) =>
  fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
/** Response body as loosely typed JSON, for assertions */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const read = (res: Response): Promise<any> => res.json();
const staff = (path: string, init: RequestInit = {}) =>
  fetch(base + path, {
    ...init,
    headers: { authorization: `Bearer ${staffToken}`, 'content-type': 'application/json', ...init.headers },
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

describe('admin dashboard', () => {
  it('confirms a valid staff key and refuses a wrong one', async () => {
    assert.equal((await staff('/v1/admin/session')).status, 200);
    assert.equal((await fetch(base + '/v1/admin/session', { headers: { authorization: 'Bearer nope' } })).status, 401);
  });

  it('counts messages and visit requests', async () => {
    const { data } = await read(await staff('/v1/admin/summary'));
    assert.equal(data.contact.total, 1);
    assert.equal(data.contact.new, 0); // the one message was marked done above
    assert.equal(data.contact.last7Days, 1);
    assert.deepEqual(data.visits, { total: 1, new: 1, upcoming: 1, handledToday: 0 });
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

describe('staff sign-in', () => {
  const login = (body: unknown) => post('/v1/admin/login', body);

  it('gives a session for the right email and password, whatever the capitals in the email', async () => {
    const res = await login({ email: STAFF_EMAIL.toUpperCase(), password: STAFF_PASSWORD });
    assert.equal(res.status, 200);
    const { token, user, expiresAt } = (await read(res)).data;
    assert.equal(user.email, STAFF_EMAIL);
    assert.ok(token.length >= 40, 'a long random token');
    assert.ok(new Date(expiresAt).getTime() > Date.now());

    const session = await fetch(base + '/v1/admin/session', { headers: { authorization: `Bearer ${token}` } });
    assert.equal(session.status, 200);
    assert.equal((await read(session)).data.user.email, STAFF_EMAIL);
  });

  it('refuses a wrong password and an unknown email in the same way', async () => {
    const wrong = await login({ email: STAFF_EMAIL, password: 'not-the-password' });
    const unknown = await login({ email: 'nobody@bushaashegaruwa.test', password: STAFF_PASSWORD });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.equal((await read(wrong)).error.message, (await read(unknown)).error.message);
  });

  it('asks for both fields', async () => {
    assert.equal((await login({ email: 'not-an-email', password: '' })).status, 400);
  });

  it('does not accept the password itself as a session', async () => {
    const res = await fetch(base + '/v1/admin/session', { headers: { authorization: `Bearer ${STAFF_PASSWORD}` } });
    assert.equal(res.status, 401);
  });

  it('ends the session on sign-out', async () => {
    const { token } = (await read(await login({ email: STAFF_EMAIL, password: STAFF_PASSWORD }))).data;
    const headers = { authorization: `Bearer ${token}` };
    assert.equal((await fetch(base + '/v1/admin/logout', { method: 'POST', headers })).status, 200);
    assert.equal((await fetch(base + '/v1/admin/session', { headers })).status, 401);
    assert.equal((await staff('/v1/admin/session')).status, 200, 'other sessions carry on');
  });
});

describe('serving the website from the same app', () => {
  let site = '';
  let stop: () => Promise<void>;

  before(async () => {
    const folder = mkdtempSync(join(tmpdir(), 'bushaashe-web-'));
    mkdirSync(join(folder, 'assets'));
    writeFileSync(join(folder, 'index.html'), '<!doctype html><title>Bushaashe Garuwa</title>');
    writeFileSync(join(folder, 'assets', 'app-abc123.js'), 'console.log(1)');
    writeFileSync(join(folder, 'assets', 'big-abc123.js'), 'console.log("Bushaashe Garuwa");\n'.repeat(400));

    const env = loadEnv({ NODE_ENV: 'test', WEB_DIST: folder });
    const db = await openTestDatabase();
    const server = createApp(env, db, { mailer: memoryMailer() }).listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    site = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    stop = async () => {
      server.close();
      await db.close();
      rmSync(folder, { recursive: true, force: true });
    };
  });
  after(() => stop());

  it('answers every page address with the website, and keeps /api for the API', async () => {
    for (const path of ['/', '/heritage', '/admin', '/events/anything']) {
      const res = await fetch(site + path);
      assert.equal(res.status, 200, path);
      assert.match(await res.text(), /Bushaashe Garuwa/, path);
      assert.equal(res.headers.get('cache-control'), 'no-cache', path);
    }
    assert.equal((await fetch(site + '/api/health')).status, 200);
    const unknown = await fetch(site + '/api/nope');
    assert.equal(unknown.status, 404);
    assert.equal((await read(unknown)).error.code, 'not_found');
  });

  it('lets browsers keep fingerprinted assets, and says 404 for missing ones', async () => {
    const asset = await fetch(site + '/assets/app-abc123.js');
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('cache-control') ?? '', /immutable/);
    assert.equal((await fetch(site + '/assets/missing.js')).status, 404);
  });

  it('sends scripts compressed, and whole', async () => {
    const asset = await fetch(site + '/assets/big-abc123.js', { headers: { 'accept-encoding': 'gzip' } });
    assert.equal(asset.status, 200);
    assert.equal(asset.headers.get('content-encoding'), 'gzip');
    assert.match(asset.headers.get('cache-control') ?? '', /immutable/);
    assert.equal((await asset.text()).length, 'console.log("Bushaashe Garuwa");\n'.length * 400);
  });
});

describe('what search engines read about each page', () => {
  let site = '';
  let stop: () => Promise<void>;

  before(async () => {
    const folder = mkdtempSync(join(tmpdir(), 'bushaashe-seo-'));
    writeFileSync(
      join(folder, 'index.html'),
      '<!doctype html><html><head><title>General</title><meta name="description" content="general"><meta name="robots" content="noindex, nofollow"><meta property="og:title" content="General"></head><body><div id="root"></div></body></html>',
    );
    writeFileSync(
      join(folder, 'seo.json'),
      JSON.stringify({
        url: 'https://bushaashegaruwa.com',
        name: 'Bushaashe Garuwa',
        alternateNames: ['Bushashe Garuwa', 'ቡሻሼ ጋሯ'],
        description: 'A Wolaita heritage place.',
        image: '/og/home.jpg',
        logo: '/apple-touch-icon.png',
        telephone: '+251932196502',
        email: 'bushaashegaruwa@gmail.com',
        address: { streetAddress: 'Damot Sore Woreda', addressLocality: 'Gununo', addressRegion: 'Wolaita Zone', addressCountry: 'ET' },
        plusCode: 'XP44+J6 Gununo',
        maps: 'https://maps.example',
        opens: '08:00',
        closes: '18:00',
        sameAs: [],
        keywords: 'Wolaita',
        noindex: ['/admin', '/preview'],
        pages: [
          { path: '/', title: 'Home title', description: 'Home words' },
          { path: '/heritage', title: 'Heritage & houses', description: 'Heritage words "quoted" <b>', image: '/og/heritage.jpg', name: 'Heritage' },
          { path: '/heritage/trees', title: 'Trees title', description: 'Trees words', name: 'Trees', parent: '/heritage' },
        ],
        sections: ['/heritage/'],
      }),
    );
    const env = loadEnv({ NODE_ENV: 'test', WEB_DIST: folder });
    const db = await openTestDatabase();
    const server = createApp(env, db, { mailer: memoryMailer() }).listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    site = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    stop = async () => {
      server.close();
      await db.close();
      rmSync(folder, { recursive: true, force: true });
    };
  });
  after(() => stop());

  it('gives each page its own title, description, address, preview photo and business details', async () => {
    const res = await fetch(site + '/heritage/');
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /<title>Heritage &amp; houses<\/title>/);
    assert.match(html, /<meta name="description" content="Heritage words &quot;quoted&quot; &lt;b&gt;">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/bushaashegaruwa.com\/heritage">/);
    assert.match(html, /<meta property="og:image" content="https:\/\/bushaashegaruwa.com\/og\/heritage.jpg">/);
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.doesNotMatch(html, /General|noindex/, 'the general lines are replaced, not added to');
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]!);
    const place = data['@graph'].find((item: { '@type': string[] }) => Array.isArray(item['@type']));
    assert.equal(place.name, 'Bushaashe Garuwa');
    assert.deepEqual(place.alternateName, ['Bushashe Garuwa', 'ቡሻሼ ጋሯ']);
    assert.equal(place.address.addressCountry, 'ET');
  });

  it('shows sub-pages as the page above them, with a breadcrumb trail', async () => {
    const trees = await (await fetch(site + '/heritage/trees')).text();
    assert.match(trees, /<title>Trees title<\/title>/);
    const crumbs = JSON.parse(trees.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]!)['@graph'][2].breadcrumb.itemListElement;
    assert.deepEqual(crumbs.map((c: { name: string }) => c.name), ['Bushaashe Garuwa', 'Heritage', 'Trees']);
    const houses = await (await fetch(site + '/heritage/houses')).text();
    assert.match(houses, /<link rel="canonical" href="https:\/\/bushaashegaruwa.com\/heritage">/);
  });

  it('keeps the staff area out of search results, and says 404 for an address that is no page', async () => {
    const admin = await fetch(site + '/admin');
    assert.equal(admin.status, 200);
    assert.match(await admin.text(), /noindex/);
    const missing = await fetch(site + '/no-such-page');
    assert.equal(missing.status, 404);
    const body = await missing.text();
    assert.match(body, /Page not found/);
    assert.match(body, /<div id="root">/, 'still the website, which then shows its own "page not found"');
  });
});

describe('the staff app', () => {
  let site = '';
  let stop: () => Promise<void>;
  before(async () => {
    const folder = mkdtempSync(join(tmpdir(), 'bushaashe-staff-'));
    writeFileSync(join(folder, 'index.html'), '<!doctype html><html><head><title>x</title><link rel="manifest" href="/manifest.webmanifest" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /></head><body></body></html>');
    writeFileSync(join(folder, 'seo.json'), JSON.stringify({ url: 'https://bushaashegaruwa.com', name: 'Bushaashe Garuwa', alternateNames: [], description: '', image: '/og/home.jpg', logo: '/x.png', telephone: '', email: '', address: { streetAddress: '', addressLocality: '', addressRegion: '', addressCountry: 'ET' }, plusCode: '', maps: '', opens: '08:00', closes: '18:00', sameAs: [], keywords: '', noindex: ['/admin'], pages: [{ path: '/', title: 'Home', description: 'd' }], sections: [] }));
    const env = loadEnv({ NODE_ENV: 'test', WEB_DIST: folder });
    const db = await openTestDatabase();
    const server = createApp(env, db, { mailer: memoryMailer() }).listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    site = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    stop = async () => { server.close(); await db.close(); rmSync(folder, { recursive: true, force: true }); };
  });
  after(() => stop());

  it('gives the staff area its own manifest and icon, and leaves the public site alone', async () => {
    const admin = await (await fetch(site + '/admin')).text();
    assert.match(admin, /href="\/admin.webmanifest"/);
    assert.match(admin, /href="\/staff\/apple-touch-icon.png"/);
    assert.match(admin, /apple-mobile-web-app-capable/);
    const home = await (await fetch(site + '/')).text();
    assert.match(home, /href="\/manifest.webmanifest"/);
    assert.doesNotMatch(home, /admin.webmanifest/);
  });
});
