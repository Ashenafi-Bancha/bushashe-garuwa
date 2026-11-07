import { z } from 'zod';
import { LIMITS } from '../shared/rules.js';
import { Email, Honeypot, Language, OptionalPhone, PersonName, RequestStatus, text } from '../shared/schemas.js';

/** Body of POST /api/v1/contact (the form on the Contact page) */
export const CreateContactMessage = z.object({
  name: PersonName(LIMITS.name),
  email: Email,
  phone: OptionalPhone,
  message: text(LIMITS.contactMessage),
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
