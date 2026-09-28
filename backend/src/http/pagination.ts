import { z } from 'zod';

/** ?page=1&pageSize=20 on the staff list endpoints */
export const PaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationQuery>;

export type Page<T> = { items: T[]; page: number; pageSize: number; total: number };

/** ?q=… on the staff lists: trimmed, and ignored when empty */
export const SearchQuery = z
  .string()
  .trim()
  .max(80)
  .optional()
  .transform((value) => (value ? value : undefined));
