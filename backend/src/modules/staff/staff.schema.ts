import { z } from 'zod';
import { LIMITS, checkNewPassword, englishProblem } from '../shared/rules.js';
import { Email, PersonName } from '../shared/schemas.js';

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
export const NewPassword = z.string({ error: 'Please fill this in' }).superRefine((value, ctx) => {
  const problem = checkNewPassword(value);
  if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem, { max: LIMITS.passwordMax }) });
});

/** Body of PUT /api/v1/admin/me/password */
export const ChangePasswordBody = z.object({
  current: z.string().min(1, 'Required').max(200),
  next: NewPassword,
});
export type ChangePasswordBody = z.infer<typeof ChangePasswordBody>;

/** Body of PUT /api/v1/admin/me */
export const UpdateProfileBody = z.object({ name: PersonName(LIMITS.staffName) });

/** Body of POST /api/v1/admin/staff */
export const CreateStaffBody = z.object({ email: Email, name: PersonName(LIMITS.staffName), role: StaffRole.default('staff') });
export type CreateStaffBody = z.infer<typeof CreateStaffBody>;

/** Body of PUT /api/v1/admin/staff/:id */
export const UpdateStaffBody = z.object({ name: PersonName(LIMITS.staffName), role: StaffRole, active: z.boolean() });
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
