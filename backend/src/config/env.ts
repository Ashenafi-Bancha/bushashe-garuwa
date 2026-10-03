import { z } from 'zod';
import { Email } from '../modules/shared/schemas.js';

/** All settings come from environment variables (see backend/.env.example), checked once at start-up. */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:8443')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  /** The PostgreSQL database, e.g. postgres://user:password@host:5432/bushaashe. Required in production. */
  DATABASE_URL: z.string().trim().default(''),
  /** off: no encryption (same private network); require: encrypted and the certificate checked; no-verify: encrypted, certificate not checked */
  DATABASE_SSL: z.enum(['off', 'require', 'no-verify']).default('off'),
  /** Development only: where the embedded PostgreSQL keeps its files while DATABASE_URL is empty */
  DEV_DATABASE_DIR: z.string().min(1).default('./data/pgdata'),
  /**
   * The staff account. At start-up the API makes sure this email can sign in to
   * the staff area with this password. Leave both empty and nobody can sign in.
   */
  ADMIN_EMAIL: z.union([Email, z.literal('')]).default(''),
  ADMIN_PASSWORD: z
    .string()
    .default('')
    .refine((password) => password === '' || password.length >= 10, 'ADMIN_PASSWORD must be at least 10 characters'),
  FORM_RATE_LIMIT: z.coerce.number().int().positive().default(10),
  /**
   * Folder holding the built website (frontend/dist). When set, the API also serves
   * the website, so one app and one address carry both. Empty: in production the
   * website built beside the API is served if it is there; otherwise the API only.
   */
  WEB_DIST: z.string().trim().default(''),

  // ── Email ──
  /** Outgoing mail server. Leave SMTP_HOST empty and emails are written to MAIL_OUTBOX instead. */
  SMTP_HOST: z.string().trim().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  /** true for port 465; false for 587, which upgrades to TLS */
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  /** Who the emails come from */
  MAIL_FROM: z.string().default('Bushaashe Garuwa <info@bushaashegaruwa.com>'),
  /** Where new bookings, visit requests and messages are announced to staff; empty to skip */
  STAFF_EMAIL: z.string().default(''),
  /** Folder that keeps a copy of every email while there is no mail server (development) */
  MAIL_OUTBOX: z.string().default('./data/outbox'),
  /** The public website, for the logo and links inside emails */
  SITE_URL: z
    .string()
    .default('https://bushashe-garuwa.vercel.app')
    .transform((value) => value.replace(/\/$/, '')),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid environment settings:\n${problems}`);
  }
  return parsed.data;
}
