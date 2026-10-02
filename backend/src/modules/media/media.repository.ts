import type { Database } from '../../db/database.js';
import type { GalleryCategory, HeroSlot, MediaImage, MediaKind, MediaTranslations, NewMediaImage, UpdateMedia } from './media.schema.js';

type Row = {
  id: number;
  kind: MediaKind;
  slot: HeroSlot | null;
  category: GalleryCategory | null;
  mime: string;
  width: number | null;
  height: number | null;
  size: number;
  translations: MediaTranslations;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

/** Everything except the photograph itself, which is only read when it is shown */
const COLUMNS = `id, kind, slot, category, mime, width, height, octet_length(bytes) AS size, translations, published, created_at, updated_at`;

const toImage = (row: Row): MediaImage => ({
  id: row.id,
  kind: row.kind,
  slot: row.slot,
  category: row.category,
  mime: row.mime,
  width: row.width,
  height: row.height,
  size: row.size,
  translations: row.translations,
  published: row.published,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

/** All SQL for the photographs staff add. */
export function mediaRepository(db: Database) {
  return {
    /** Oldest first, so a new photo joins the end of the gallery and of the slides */
    async list(filter: { publishedOnly?: boolean } = {}): Promise<MediaImage[]> {
      const where = filter.publishedOnly ? 'WHERE published' : '';
      return (await db.query<Row>(`SELECT ${COLUMNS} FROM media_images ${where} ORDER BY id`)).map(toImage);
    },

    async find(id: number): Promise<MediaImage | undefined> {
      const [row] = await db.query<Row>(`SELECT ${COLUMNS} FROM media_images WHERE id = $1`, [id]);
      return row && toImage(row);
    },

    /** The photograph itself */
    async file(id: number): Promise<{ mime: string; bytes: Buffer } | undefined> {
      const [row] = await db.query<{ mime: string; bytes: Uint8Array }>('SELECT mime, bytes FROM media_images WHERE id = $1', [id]);
      return row && { mime: row.mime, bytes: Buffer.from(row.bytes) };
    },

    async create(image: NewMediaImage): Promise<MediaImage> {
      const [row] = await db.query<Row>(
        `INSERT INTO media_images (kind, slot, category, mime, width, height, bytes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ${COLUMNS}`,
        [image.kind, image.slot, image.category, image.mime, image.width, image.height, image.bytes],
      );
      return toImage(row!);
    },

    async update(id: number, input: UpdateMedia): Promise<MediaImage | undefined> {
      const [row] = await db.query<Row>(
        `UPDATE media_images
            SET translations = $1, category = COALESCE($2, category), published = $3, updated_at = now()
          WHERE id = $4
          RETURNING ${COLUMNS}`,
        [JSON.stringify(input.translations), input.category ?? null, input.published, id],
      );
      return row && toImage(row);
    },

    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM media_images WHERE id = $1', [id])) > 0;
    },

    /** A page shows one opening photo: the others in its slot make way for the new one */
    async removeOthersInSlot(slot: HeroSlot, keepId: number): Promise<number> {
      return db.execute(`DELETE FROM media_images WHERE kind = 'hero' AND slot = $1 AND id <> $2`, [slot, keepId]);
    },

    async stats(): Promise<{ gallery: number; heroes: number; hidden: number }> {
      const [row] = await db.query<{ gallery: number; heroes: number; hidden: number }>(
        `SELECT COUNT(*) FILTER (WHERE kind = 'gallery' AND published)::int AS gallery,
                COUNT(*) FILTER (WHERE kind = 'hero' AND published)::int AS heroes,
                COUNT(*) FILTER (WHERE NOT published)::int AS hidden
         FROM media_images`,
      );
      return row!;
    },
  };
}
export type MediaRepository = ReturnType<typeof mediaRepository>;
