/** Shapes the API returns to the staff pages (see backend/src/modules). */

export type RequestStatus = 'new' | 'in_progress' | 'done' | 'archived';

export const STATUSES: RequestStatus[] = ['new', 'in_progress', 'done', 'archived'];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  done: 'Done',
  archived: 'Archived',
};

export type Page<T> = { items: T[]; page: number; pageSize: number; total: number };

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

export type VisitRequest = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  visitors: string;
  experiences: string[];
  message: string | null;
  language: string;
  status: RequestStatus;
  createdAt: string;
};

export type Summary = {
  contact: { total: number; new: number; last7Days: number; handledToday: number };
  visits: { total: number; new: number; upcoming: number; handledToday: number };
  events: { total: number; upcoming: number; drafts: number };
  bookings: { total: number; pending: number; guestsUpcoming: number; handledToday: number };
  media: { gallery: number; heroes: number; hidden: number };
  content: { edited: number; lastUpdatedAt: string | null };
  generatedAt: string;
};

export type AdminEvent = {
  id: number;
  date: string;
  time: string | null;
  category: 'food' | 'culture' | 'education' | 'music' | 'community';
  availability: 'open' | 'limited' | 'full';
  featured: boolean;
  published: boolean;
  photo: string | null;
  partner: string | null;
  bookable: boolean;
  capacity: number | null;
  placesLeft?: number | null;
  translations: { en: { name: string; desc?: string }; am?: { name?: string; desc?: string }; wol?: { name?: string; desc?: string } };
  createdAt: string;
  updatedAt: string;
};

export type SaveEventInput = Omit<AdminEvent, 'id' | 'createdAt' | 'updatedAt' | 'placesLeft'>;

/** A booking's life: pending → confirmed → attended, or cancelled (which frees the places) */
export type BookingStatus = 'pending' | 'confirmed' | 'attended' | 'cancelled';
export const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'attended', 'cancelled'];
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'To call',
  confirmed: 'Confirmed',
  attended: 'Came',
  cancelled: 'Cancelled',
};

export type Booking = {
  id: number;
  eventId: number;
  reference: string;
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

// ── Photos staff add: the gallery, and the pages' opening photos ──
export type MediaCaption = { title: string; desc: string };
export type MediaLang = 'en' | 'am' | 'wol';
export type MediaTranslations = { en: MediaCaption; am?: MediaCaption; wol?: MediaCaption };
export type GalleryCategory = 'grounds' | 'culture';

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  grounds: 'Grounds & Nature',
  culture: 'Culture & Events',
};

export type MediaImage = {
  id: number;
  kind: 'gallery' | 'hero';
  /** hero only: the page it opens (see src/lib/heroSlots.ts) */
  slot: string | null;
  category: GalleryCategory | null;
  mime: string;
  width: number | null;
  height: number | null;
  /** size of the stored file, in bytes */
  size: number;
  translations: MediaTranslations;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaveMediaInput = { translations: MediaTranslations; category?: GalleryCategory; published: boolean };

export type ContentEntry = { key: string; lang: 'en' | 'am' | 'wol' | '*'; value: string; updatedAt: string };
