import { z } from 'zod';
import { Email, text } from '../shared/schemas.js';

/** Body of POST /api/v1/admin/login */
export const LoginBody = z.object({
  email: Email,
  password: z.string().min(1, 'Required').max(200),
});
export type LoginBody = z.infer<typeof LoginBody>;

/** owner: may add and manage staff; staff: everything else */
export const StaffRole = z.enum(['owner', 'staff']);
export type StaffRole = z.infer<typeof StaffRole>;

/** A new password: long enough to be safe, short enough to type */
export const NewPassword = z.string().min(10, 'At least 10 characters').max(200, 'At most 200 characters');

/** Body of PUT /api/v1/admin/me/password */
export const ChangePasswordBody = z.object({
  current: z.string().min(1, 'Required').max(200),
  next: NewPassword,
});
export type ChangePasswordBody = z.infer<typeof ChangePasswordBody>;

/** Body of PUT /api/v1/admin/me */
export const UpdateProfileBody = z.object({ name: text(80) });

/** Body of POST /api/v1/admin/staff */
export const CreateStaffBody = z.object({ email: Email, name: text(80), role: StaffRole.default('staff') });
export type CreateStaffBody = z.infer<typeof CreateStaffBody>;

/** Body of PUT /api/v1/admin/staff/:id */
export const UpdateStaffBody = z.object({ name: text(80), role: StaffRole, active: z.boolean() });
export type UpdateStaffBody = z.infer<typeof UpdateStaffBody>;

/** The signed-in member of staff, as the staff area sees them (never the password) */
export type StaffUser = {
  id: number;
  email: string;
  name: string;
  role: StaffRole;
  /** signed in with a temporary password: they choose their own before anything else */
  mustChangePassword: boolean;
};

/** A member of staff in the owner's list */
export type StaffMember = StaffUser & { active: boolean; createdAt: string; lastLoginAt: string | null };

export type StaffSession = {
  /** sent back by the browser as `Authorization: Bearer <token>` */
  token: string;
  expiresAt: string;
  user: StaffUser;
};
