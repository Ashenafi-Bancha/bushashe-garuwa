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
  generatedAt: string;
};
