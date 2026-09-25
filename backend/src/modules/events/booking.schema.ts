import { z } from 'zod';
import { Email, Honeypot, Language, Phone, optionalText, text } from '../shared/schemas.js';

/**
 * A booking's life:
 *   pending    the guest asked for places, staff have not called yet
 *   confirmed  staff called and the places are theirs
 *   attended   they came
 *   cancelled  they called it off, or staff did; the places go back to the event
 *
 * Every status except `cancelled` holds the places.
 */
export const BookingStatus = z.enum(['pending', 'confirmed', 'attended', 'cancelled']);
export type BookingStatus = z.infer<typeof BookingStatus>;

/** Statuses that keep the guest's places reserved */
export const HOLDS_PLACES: BookingStatus[] = ['pending', 'confirmed', 'attended'];

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

export const UpdateBookingStatus = z.object({ status: BookingStatus });

export type Booking = {
  id: number;
  eventId: number;
  /** short code the guest can quote, e.g. BG-7K3Q */
  reference: string;
  /** filled in when the staff page lists bookings across events */
  eventDate?: string;
  eventName?: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  message: string | null;
  language: string;
  status: BookingStatus;
  createdAt: string;
};
