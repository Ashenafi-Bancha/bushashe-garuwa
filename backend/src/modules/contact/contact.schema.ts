import { z } from 'zod';
import { Email, Honeypot, Language, Phone, RequestStatus, text } from '../shared.js';

/** Body of POST /api/v1/contact (the form on the Contact page) */
export const CreateContactMessage = z.object({
  name: text(120),
  email: Email,
  phone: z.union([Phone, z.literal('')]).optional().transform((value) => value || undefined),
  message: text(5000),
  language: Language,
  website: Honeypot,
});
export type CreateContactMessage = z.infer<typeof CreateContactMessage>;

export const UpdateContactStatus = z.object({ status: RequestStatus });

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  language: string;
  status: RequestStatus;
  createdAt: string;
};
