import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadEnv } from '../src/config/env.js';
import { memoryMailer } from '../src/modules/notifications/mailer.js';
import { notifier } from '../src/modules/notifications/notifier.js';

describe('staff alerts', () => {
  const message = { name: 'Abebe', email: 'guest@example.com', phone: '', message: 'Hello', language: 'en' } as never;
  const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

  it('sends every address in STAFF_EMAIL its own copy', async () => {
    const outbox = memoryMailer();
    const env = loadEnv({ NODE_ENV: 'test', STAFF_EMAIL: 'staff@bushaashegaruwa.com, me@example.com ; ' });
    notifier(outbox, env).messageReceived(message);
    await settle();
    const staff = outbox.sent.filter((email) => email.kind === 'staff-new-message').map((email) => email.to);
    assert.deepEqual(staff, ['staff@bushaashegaruwa.com', 'me@example.com']);
    assert.equal(outbox.sent.filter((email) => email.kind === 'message-received').length, 1, 'the guest still gets one reply');
  });

  it('tells no staff when STAFF_EMAIL is empty', async () => {
    const outbox = memoryMailer();
    notifier(outbox, loadEnv({ NODE_ENV: 'test', STAFF_EMAIL: '' })).messageReceived(message);
    await settle();
    assert.equal(outbox.sent.filter((email) => email.kind === 'staff-new-message').length, 0);
  });
});
