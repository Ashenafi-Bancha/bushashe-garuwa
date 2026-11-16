import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import { deviceOf, isRobot, sourceOf, visitorCode } from '../src/modules/stats/stats.service.js';
import { openTestDatabase } from './helpers/database.js';

process.env.NODE_ENV = 'test';

const PHONE = 'Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
const COMPUTER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

describe('counting visitors', () => {
  it('knows where a visit came from', () => {
    assert.equal(sourceOf(undefined, undefined, 'bushaashegaruwa.com'), 'direct');
    assert.equal(sourceOf('https://www.google.com/', undefined, 'bushaashegaruwa.com'), 'google');
    assert.equal(sourceOf('https://lm.facebook.com/l.php?u=x', undefined, 'bushaashegaruwa.com'), 'facebook');
    assert.equal(sourceOf('https://t.me/bushaashegaruwafrist', undefined, 'bushaashegaruwa.com'), 'telegram');
    assert.equal(sourceOf('android-app://org.telegram.messenger/', undefined, 'bushaashegaruwa.com'), 'telegram');
    assert.equal(sourceOf('https://bushaashegaruwa.com/heritage', undefined, 'bushaashegaruwa.com'), 'direct', 'our own pages are not a source');
    assert.equal(sourceOf('https://www.wolaitasodo.edu.et/news', undefined, 'bushaashegaruwa.com'), 'wolaitasodo.edu.et');
    assert.equal(sourceOf('https://www.google.com/', 'QR', 'bushaashegaruwa.com'), 'qr', 'the poster mark wins');
  });

  it('tells phones, tablets and computers apart, and leaves robots out', () => {
    assert.equal(deviceOf(PHONE), 'phone');
    assert.equal(deviceOf('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'), 'tablet');
    assert.equal(deviceOf(COMPUTER), 'computer');
    assert.equal(isRobot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), true);
    assert.equal(isRobot('facebookexternalhit/1.1'), true);
    assert.equal(isRobot(''), true);
    assert.equal(isRobot(PHONE), false);
  });

  it('gives a visitor a code that holds for one day only, and keeps no address', () => {
    const today = visitorCode('2026-11-16', '196.188.1.2', PHONE);
    assert.equal(visitorCode('2026-11-16', '196.188.1.2', PHONE), today, 'the same person, the same day');
    assert.notEqual(visitorCode('2026-11-16', '196.188.1.3', PHONE), today, 'someone else');
    assert.notEqual(visitorCode('2026-11-17', '196.188.1.2', PHONE), today, 'the next day, a new code');
    assert.ok(!today.includes('196'), 'the address cannot be read back');
  });
});

describe('the statistics, on the API', () => {
  const OWNER = 'owner@bushaashegaruwa.test';
  let base = '';
  let token = '';
  let close: () => Promise<void>;

  before(async () => {
    const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: OWNER, ADMIN_PASSWORD: 'a-test-password-only' });
    const db = await openTestDatabase();
    const app = createApp(env, db);
    await app.prepare();
    const server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
    const signIn = await fetch(base + '/v1/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: OWNER, password: 'a-test-password-only' }),
    });
    token = ((await signIn.json()) as { data: { token: string } }).data.token;
    close = async () => {
      server.close();
      await db.close();
    };
  });
  after(() => close());

  const view = (body: unknown, userAgent = PHONE, address = '196.188.1.2') =>
    fetch(base + '/v1/stats/view', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': userAgent, 'cf-connecting-ip': address },
      body: JSON.stringify(body),
    });

  it('counts page views, and sums them up for staff only', async () => {
    assert.equal((await view({ path: '/', lang: 'wol', ref: 'https://t.me/bushaashegaruwafrist' })).status, 204);
    // the website sends where the visit began with every page of it
    assert.equal((await view({ path: '/heritage', lang: 'wol', ref: 'https://t.me/bushaashegaruwafrist' })).status, 204);
    assert.equal((await view({ path: '/', lang: 'en', src: 'qr' }, COMPUTER, '41.0.0.9')).status, 204);
    // not counted: robots and the staff area
    assert.equal((await view({ path: '/', lang: 'en' }, 'Googlebot/2.1')).status, 204);
    assert.equal((await view({ path: '/admin', lang: 'en' })).status, 204);
    // a made-up page address is refused
    assert.equal((await view({ path: 'https://spam.example', lang: 'en' })).status, 400);

    assert.equal((await fetch(base + '/v1/stats/admin')).status, 401, 'staff only');
    const res = await fetch(base + '/v1/stats/admin?days=7', { headers: { authorization: `Bearer ${token}` } });
    assert.equal(res.status, 200);
    const stats = ((await res.json()) as any).data;
    assert.equal(stats.totals.views, 3);
    assert.equal(stats.totals.visitors, 2, 'two people');
    assert.equal(stats.today.visitors, 2);
    assert.equal(stats.daily.length, 7, 'every day of the week, the quiet ones too');
    assert.deepEqual(stats.pages[0], { path: '/', views: 2, visitors: 2 });
    assert.deepEqual(stats.languages.find((l: any) => l.lang === 'wol'), { lang: 'wol', visitors: 1 });
    assert.deepEqual(stats.sources.map((s: any) => s.source).sort(), ['qr', 'telegram']);
    assert.deepEqual(stats.devices.map((d: any) => d.device).sort(), ['computer', 'phone']);
  });
});
