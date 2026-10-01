import { z } from 'zod';
import { Email } from '../shared/schemas.js';

/** Body of POST /api/v1/admin/login */
export const LoginBody = z.object({
  email: Email,
  password: z.string().min(1, 'Required').max(200),
});
export type LoginBody = z.infer<typeof LoginBody>;

/** A member of staff, as the staff area sees them (never the password) */
export type StaffUser = { id: number; email: string };

export type StaffSession = {
  /** sent back by the browser as `Authorization: Bearer <token>` */
  token: string;
  expiresAt: string;
  user: StaffUser;
};
