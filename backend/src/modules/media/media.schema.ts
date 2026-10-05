import { z } from 'zod';

/**
 * A media image is a photograph staff added from the admin area.
 *
 * `gallery` photos join the Gallery page. `hero` photos open a page: each page
 * (its "slot") shows one, except the home page, which turns through all of its
 * photos as slides.
 */
export const MediaKind = z.enum(['gallery', 'hero']);
export type MediaKind = z.infer<typeof MediaKind>;

/** The pages whose opening photograph staff can change (frontend/src/lib/heroSlots.ts) */
export const HeroSlot = z.enum([
  'home',
  'discover',
  'heritage',
  'heritageTrees',
  'experiences',
  'events',
  'stay',
  'vip',
  'dine',
  'gallery',
  'visit',
  'contact',
  'about',
]);
export type HeroSlot = z.infer<typeof HeroSlot>;

/** Slots that keep every photo, shown one after another */
export const SLIDE_SLOTS: readonly HeroSlot[] = ['home'];

/** The Gallery page's filters */
export const GalleryCategory = z.enum(['grounds', 'culture']);
export type GalleryCategory = z.infer<typeof GalleryCategory>;

const Caption = z.object({
  title: z.string().trim().max(120).default(''),
  desc: z.string().trim().max(600).default(''),
});

/** The heading and description shown with the photo, in each language; English is the fallback */
export const MediaTranslations = z.object({
  en: Caption.default({ title: '', desc: '' }),
  am: Caption.optional(),
  wal: Caption.optional(),
});
export type MediaTranslations = z.infer<typeof MediaTranslations>;

/** The photograph itself arrives as the request body; these describe where it goes */
export const UploadQuery = z
  .object({
    kind: MediaKind,
    slot: HeroSlot.optional(),
    category: GalleryCategory.optional(),
    width: z.coerce.number().int().min(1).max(20000).optional(),
    height: z.coerce.number().int().min(1).max(20000).optional(),
  })
  .refine((query) => query.kind !== 'hero' || query.slot !== undefined, 'A page photo needs the page it belongs to (slot)');
export type UploadQuery = z.infer<typeof UploadQuery>;

export const UpdateMedia = z
  .object({
    translations: MediaTranslations,
    category: GalleryCategory.optional(),
    published: z.boolean(),
  })
  .refine((media) => !media.published || media.translations.en.title !== '', {
    path: ['translations', 'en', 'title'],
    message: 'Give the photo a heading in English before it goes on the website',
  });
export type UpdateMedia = z.infer<typeof UpdateMedia>;

export type MediaImage = {
  id: number;
  kind: MediaKind;
  slot: HeroSlot | null;
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

export type NewMediaImage = {
  kind: MediaKind;
  slot: HeroSlot | null;
  category: GalleryCategory | null;
  mime: string;
  width: number | null;
  height: number | null;
  bytes: Buffer;
};
