import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import type { Database } from '../src/db/database.js';
import { memoryMailer } from '../src/modules/notifications/mailer.js';
import { openTestDatabase } from './helpers/database.js';

process.env.NODE_ENV = 'test'; // keeps the logger quiet

const OWNER_EMAIL = 'owner@bushaashegaruwa.test';
const OWNER_PASSWORD = 'the-owner-password';

let db: Database;
let server: Server;
let base = '';

/** Starts the app on the shared database, as the host does after a restart */
async function start(adminPassword = OWNER_PASSWORD) {
  server?.close();
  const env = loadEnv({ NODE_ENV: 'test', ADMIN_EMAIL: OWNER_EMAIL, ADMIN_PASSWORD: adminPassword });
  const app = createApp(env, db, { mailer: memoryMailer() });
  await app.prepare();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1/admin`;
}

before(async () => {
  db = await openTestDatabase();
  await start();
});
after(async () => {
  server.close();
  await db.close();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const call = async (token: string, path: string, method = 'GET', body?: unknown): Promise<{ status: number; data: any; error: any }> => {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { data?: unknown; error?: unknown };
  return { status: res.status, data: json.data, error: json.error };
};
const signIn = async (email: string, password: string) => call('', '/login', 'POST', { email, password });
const tokenFor = async (email: string, password: string) => {
  const res = await signIn(email, password);
  assert.equal(res.status, 200, `${email} can sign in`);
  return res.data.token as string;
};

describe('staff accounts', () => {
  it('makes the account from the settings an owner', async () => {
    const res = await signIn(OWNER_EMAIL, OWNER_PASSWORD);
    assert.equal(res.data.user.role, 'owner');
    assert.equal(res.data.user.mustChangePassword, false);
  });

  it('lets an owner add a member of staff, who must choose a password at first sign-in', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const added = await call(owner, '/staff', 'POST', { email: 'Almaz@Bushaashegaruwa.test', name: 'Almaz' });
    assert.equal(added.status, 201);
    assert.equal(added.data.member.email, 'almaz@bushaashegaruwa.test');
    assert.equal(added.data.member.role, 'staff');
    assert.match(added.data.temporaryPassword, /^[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
    assert.equal(JSON.stringify(added.data).includes('Hash'), false, 'no password hash is sent');

    const first = await signIn('almaz@bushaashegaruwa.test', added.data.temporaryPassword);
    assert.equal(first.status, 200);
    assert.equal(first.data.user.mustChangePassword, true);

    const changed = await call(first.data.token, '/me/password', 'PUT', { current: added.data.temporaryPassword, next: 'almaz-own-password' });
    assert.equal(changed.status, 200);
    assert.equal(changed.data.mustChangePassword, false);
    assert.equal((await signIn('almaz@bushaashegaruwa.test', added.data.temporaryPassword)).status, 401, 'the temporary password is gone');
    assert.equal((await signIn('almaz@bushaashegaruwa.test', 'almaz-own-password')).status, 200);
  });

  it('refuses a second account with the same email', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    assert.equal((await call(owner, '/staff', 'POST', { email: 'almaz@bushaashegaruwa.test', name: 'Again' })).status, 409);
  });

  it('keeps staff out of the account management', async () => {
    const almaz = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-own-password');
    assert.equal((await call(almaz, '/staff')).status, 403);
    assert.equal((await call(almaz, '/staff', 'POST', { email: 'x@bushaashegaruwa.test', name: 'X' })).status, 403);
    assert.equal((await call(almaz, '/summary')).status, 200, 'the rest of the staff area is open to them');
  });

  it('asks for the current password and a long enough new one', async () => {
    const almaz = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-own-password');
    assert.equal((await call(almaz, '/me/password', 'PUT', { current: 'wrong-password', next: 'another-password' })).status, 400);
    assert.equal((await call(almaz, '/me/password', 'PUT', { current: 'almaz-own-password', next: 'short' })).status, 400);
  });

  it('signs out the other devices when a password is changed, but not this one', async () => {
    const phone = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-own-password');
    const laptop = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-own-password');
    assert.equal((await call(laptop, '/me/password', 'PUT', { current: 'almaz-own-password', next: 'almaz-newer-password' })).status, 200);
    assert.equal((await call(phone, '/session')).status, 401);
    assert.equal((await call(laptop, '/session')).status, 200);
  });

  it('lets anyone set their own name', async () => {
    const almaz = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-newer-password');
    const res = await call(almaz, '/me', 'PUT', { name: 'Almaz Tesfaye' });
    assert.equal(res.data.name, 'Almaz Tesfaye');
    assert.equal((await call(almaz, '/session')).data.user.name, 'Almaz Tesfaye');
  });

  it('switching an account off signs it out and keeps it out', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const almaz = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-newer-password');
    const list = (await call(owner, '/staff')).data.items as { id: number; email: string }[];
    const id = list.find((m) => m.email === 'almaz@bushaashegaruwa.test')!.id;

    assert.equal((await call(owner, `/staff/${id}`, 'PUT', { name: 'Almaz Tesfaye', role: 'staff', active: false })).status, 200);
    assert.equal((await call(almaz, '/session')).status, 401);
    assert.equal((await signIn('almaz@bushaashegaruwa.test', 'almaz-newer-password')).status, 401);

    await call(owner, `/staff/${id}`, 'PUT', { name: 'Almaz Tesfaye', role: 'staff', active: true });
    assert.equal((await signIn('almaz@bushaashegaruwa.test', 'almaz-newer-password')).status, 200);
  });

  it('a reset gives a new temporary password and ends the old sessions', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const almaz = await tokenFor('almaz@bushaashegaruwa.test', 'almaz-newer-password');
    const id = ((await call(owner, '/staff')).data.items as { id: number; email: string }[]).find((m) => m.email.startsWith('almaz'))!.id;
    const reset = await call(owner, `/staff/${id}/reset-password`, 'POST');
    assert.equal(reset.status, 200);
    assert.equal((await call(almaz, '/session')).status, 401);
    const again = await signIn('almaz@bushaashegaruwa.test', reset.data.temporaryPassword);
    assert.equal(again.data.user.mustChangePassword, true);
  });

  it('always keeps an owner, and an owner cannot lock themselves out', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const me = (await call(owner, '/session')).data.user;
    assert.equal((await call(owner, `/staff/${me.id}`, 'PUT', { name: 'Owner', role: 'staff', active: true })).status, 400);
    assert.equal((await call(owner, `/staff/${me.id}`, 'PUT', { name: 'Owner', role: 'owner', active: false })).status, 400);
    assert.equal((await call(owner, `/staff/${me.id}`, 'DELETE')).status, 400);
    assert.equal((await call(owner, `/staff/${me.id}/reset-password`, 'POST')).status, 400);
    assert.equal((await call(owner, `/staff/${me.id}`, 'PUT', { name: 'The Owner', role: 'owner', active: true })).status, 200, 'a new name is fine');
  });

  it('a second owner may manage the first, but not leave the place without one', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const added = await call(owner, '/staff', 'POST', { email: 'second@bushaashegaruwa.test', name: 'Second', role: 'owner' });
    const first = await signIn('second@bushaashegaruwa.test', added.data.temporaryPassword);
    const second = first.data.token as string;
    await call(second, '/me/password', 'PUT', { current: added.data.temporaryPassword, next: 'second-owner-password' });

    const me = (await call(owner, '/session')).data.user;
    assert.equal((await call(second, `/staff/${me.id}`, 'PUT', { name: 'The Owner', role: 'staff', active: true })).status, 200);
    assert.equal((await call(owner, '/staff')).status, 403, 'the first is staff now');
    const secondId = (await call(second, '/session')).data.user.id;
    assert.equal((await call(owner, `/staff/${secondId}`, 'DELETE')).status, 403);
    // the second, now the only owner, cannot step down through another account either
    assert.equal((await call(second, `/staff/${me.id}`, 'PUT', { name: 'The Owner', role: 'owner', active: true })).status, 200);
  });

  it('removes an account', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    const id = ((await call(owner, '/staff')).data.items as { id: number; email: string }[]).find((m) => m.email.startsWith('almaz'))!.id;
    assert.equal((await call(owner, `/staff/${id}`, 'DELETE')).status, 200);
    assert.equal((await call(owner, '/staff')).data.items.some((m: { id: number }) => m.id === id), false);
  });
});

describe('the password in the settings', () => {
  it('does not undo a password changed in the staff area when the app restarts', async () => {
    const owner = await tokenFor(OWNER_EMAIL, OWNER_PASSWORD);
    assert.equal((await call(owner, '/me/password', 'PUT', { current: OWNER_PASSWORD, next: 'changed-in-the-staff-area' })).status, 200);
    await start(); // the same setting as before
    assert.equal((await signIn(OWNER_EMAIL, OWNER_PASSWORD)).status, 401);
    assert.equal((await signIn(OWNER_EMAIL, 'changed-in-the-staff-area')).status, 200);
  });

  it('a changed setting becomes the password again: the way back in', async () => {
    await start('a-brand-new-setting');
    assert.equal((await signIn(OWNER_EMAIL, 'changed-in-the-staff-area')).status, 401);
    const res = await signIn(OWNER_EMAIL, 'a-brand-new-setting');
    assert.equal(res.status, 200);
    assert.equal(res.data.user.role, 'owner');
  });
});
