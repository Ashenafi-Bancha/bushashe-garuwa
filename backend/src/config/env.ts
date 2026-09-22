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
