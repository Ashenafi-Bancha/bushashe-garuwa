import { z } from 'zod';
import { Email, Honeypot, Language, Phone, RequestStatus, optionalText, text } from '../shared/schemas.js';

/** Body of POST /api/v1/events/:id/bookings: reserving places at an event */
export const CreateBooking = z.object({
  name: text(120),
  phone: Phone,
  email: z
    .union([Email, z.literal('')])
    .optional()
    .transform((value) => value || undefined),
  guests: z.coerce.number().int().min(1, 'At least one guest').max(200, 'For very large groups, please call us'),
  message: optionalText(2000),
  language: Language,
  website: Honeypot,
});
export type CreateBooking = z.infer<typeof CreateBooking>;

export const UpdateBookingStatus = z.object({ status: RequestStatus });

export type Booking = {
  id: number;
  eventId: number;
  /** filled in when the staff page lists bookings across events */
  eventDate?: string;
  eventName?: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  message: string | null;
  language: string;
  status: z.infer<typeof RequestStatus>;
  createdAt: string;
};
