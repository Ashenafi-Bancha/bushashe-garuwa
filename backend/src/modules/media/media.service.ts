import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { MediaRepository } from './media.repository.js';
import { SLIDE_SLOTS, type HeroSlot, type MediaImage, type UpdateMedia, type UploadQuery } from './media.schema.js';

/** Reads the kind of picture from its first bytes, so a renamed file cannot pass as a photo */
export function imageType(bytes: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | undefined {
  if (bytes.length < 12) return undefined;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
  return undefined;
}

/** Rules for the photographs staff add to the gallery and to the top of the pages. */
export function mediaService(repo: MediaRepository) {
  const found = async (id: number): Promise<MediaImage> => {
    const image = await repo.find(id);
    if (!image) throw HttpError.notFound('That photo is no longer there');
    return image;
  };

  return {
    /** What the public website asks for: the gallery photos, and the opening photos page by page */
    async published() {
      const images = await repo.list({ publishedOnly: true });
      const heroes: Partial<Record<HeroSlot, MediaImage[]>> = {};
      for (const image of images) {
        if (image.kind === 'hero' && image.slot) (heroes[image.slot] ??= []).push(image);
      }
      return { gallery: images.filter((image) => image.kind === 'gallery'), heroes };
    },

    all: () => repo.list(),

    async file(id: number) {
      const file = await repo.file(id);
      if (!file) throw HttpError.notFound('That photo is no longer there');
      return file;
    },

    /** A new photo waits, hidden, until its heading is saved */
    async upload(query: UploadQuery, body: unknown) {
      if (!Buffer.isBuffer(body) || body.length === 0) throw HttpError.badRequest('Send the photo as a JPEG, PNG or WebP file');
      const mime = imageType(body);
      if (!mime) throw HttpError.badRequest('That file is not a JPEG, PNG or WebP photo');

      const image = await repo.create({
        kind: query.kind,
        slot: query.kind === 'hero' ? (query.slot ?? null) : null,
        category: query.kind === 'gallery' ? (query.category ?? 'grounds') : null,
        mime,
        width: query.width ?? null,
        height: query.height ?? null,
        bytes: body,
      });
      logger.info('media: photo added', { id: image.id, kind: image.kind, slot: image.slot, size: image.size });
      return image;
    },

    async update(id: number, input: UpdateMedia) {
      const before = await found(id);
      const image = (await repo.update(id, input)) ?? before;
      // a page keeps one opening photo; only the home page turns through several
      if (image.published && image.kind === 'hero' && image.slot && !SLIDE_SLOTS.includes(image.slot)) {
        await repo.removeOthersInSlot(image.slot, image.id);
      }
      return image;
    },

    async remove(id: number) {
      if (!(await repo.remove(id))) throw HttpError.notFound('That photo is no longer there');
      logger.info('media: photo removed', { id });
    },
  };
}
export type MediaService = ReturnType<typeof mediaService>;
