import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import type { Env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** a label for the logs and the outbox file name, e.g. "booking-received" */
  kind: string;
};

/** Anything that can deliver an email. */
export type Mailer = { send(email: Email): Promise<void> };

/** Sends through the mail server in the settings. */
export function smtpMailer(env: Env): Mailer {
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return {
    async send(email) {
      await transport.sendMail({ from: env.MAIL_FROM, to: email.to, subject: email.subject, html: email.html, text: email.text });
    },
  };
}

/**
 * While there is no mail server, every email is saved as an .html file so it can
 * be opened in a browser and checked, instead of going nowhere.
 */
export function outboxMailer(folder: string): Mailer {
  return {
    async send(email) {
      mkdirSync(folder, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = join(folder, `${stamp}-${email.kind}.html`);
      writeFileSync(file, email.html, 'utf-8');
      logger.info(`mail: saved to the outbox instead of sending (no SMTP_HOST)`, { to: email.to, subject: email.subject, file });
    },
  };
}

/** Keeps emails in memory: used by the tests to see what would have been sent. */
export function memoryMailer(): Mailer & { sent: Email[] } {
  const sent: Email[] = [];
  return {
    sent,
    async send(email) {
      sent.push(email);
    },
  };
}

export function mailerFor(env: Env): Mailer {
  return env.SMTP_HOST ? smtpMailer(env) : outboxMailer(env.MAIL_OUTBOX);
}
