import { z } from 'zod';

/** All settings come from environment variables (see backend/.env.example), checked once at start-up. */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:8443')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  DATABASE_PATH: z.string().min(1).default('./data/bushaashe.db'),
  ADMIN_API_KEY: z
    .string()
    .default('')
    .refine((key) => key === '' || key.length >= 24, 'ADMIN_API_KEY must be at least 24 characters'),
  FORM_RATE_LIMIT: z.coerce.number().int().positive().default(10),

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
