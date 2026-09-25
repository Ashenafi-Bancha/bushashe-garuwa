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
  contact: { total: number; new: number; last7Days: number };
  visits: { total: number; new: number; upcoming: number };
  events: { total: number; upcoming: number; drafts: number };
  bookings: { total: number; new: number; guestsUpcoming: number };
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
  translations: { en: { name: string; desc?: string }; am?: { name?: string; desc?: string }; wal?: { name?: string; desc?: string } };
  createdAt: string;
  updatedAt: string;
};

export type SaveEventInput = Omit<AdminEvent, 'id' | 'createdAt' | 'updatedAt'>;

export type Booking = {
  id: number;
  eventId: number;
  eventDate?: string;
  eventName?: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  message: string | null;
  language: string;
  status: RequestStatus;
  createdAt: string;
};

export type ContentEntry = { key: string; lang: 'en' | 'am' | 'wal' | '*'; value: string; updatedAt: string };
