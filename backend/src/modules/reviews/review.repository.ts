import type { Queryable } from '../../db/database.js';
import type { Review, SaveReview } from './review.schema.js';

type Row = {
  id: number;
  name: string;
  origin: string | null;
  words: Review['words'] | string;
  rating: number | null;
  published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

const toReview = (row: Row): Review => ({
  id: row.id,
  name: row.name,
  origin: row.origin,
  words: typeof row.words === 'string' ? (JSON.parse(row.words) as Review['words']) : row.words,
  rating: row.rating,
  published: row.published,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

/** All SQL for the guests' reviews. */
export function reviewRepository(db: Queryable) {
  return {
    /** What the website shows: published reviews, newest first */
    async published(limit = 12): Promise<Review[]> {
      const rows = await db.query<Row>('SELECT * FROM reviews WHERE published ORDER BY created_at DESC, id DESC LIMIT $1', [limit]);
      return rows.map(toReview);
    },

    async all(): Promise<Review[]> {
      const rows = await db.query<Row>('SELECT * FROM reviews ORDER BY created_at DESC, id DESC');
      return rows.map(toReview);
    },

    async create(input: SaveReview): Promise<Review> {
      const [row] = await db.query<Row>(
        `INSERT INTO reviews (name, origin, words, rating, published) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [input.name, input.origin ?? null, JSON.stringify(input.words), input.rating, input.published],
      );
      return toReview(row!);
    },

    async update(id: number, input: SaveReview): Promise<Review | undefined> {
      const [row] = await db.query<Row>(
        `UPDATE reviews SET name = $2, origin = $3, words = $4, rating = $5, published = $6, updated_at = now()
         WHERE id = $1 RETURNING *`,
        [id, input.name, input.origin ?? null, JSON.stringify(input.words), input.rating, input.published],
      );
      return row && toReview(row);
    },

    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM reviews WHERE id = $1', [id])) > 0;
    },
  };
}
export type ReviewRepository = ReturnType<typeof reviewRepository>;
