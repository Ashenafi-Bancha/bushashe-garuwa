import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { GalleryCategory, MediaImage, SaveMediaInput } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import type { PreparedImage } from './prepareImage';

/** Where a new photo goes: the gallery, or the top of one page */
export type MediaPlace = { kind: 'gallery'; category: GalleryCategory } | { kind: 'hero'; slot: string };

/**
 * The photos staff added, and the ways to change them. The Gallery and the
 * Page photos screens both work on this list.
 */
export function useMediaLibrary() {
  const { token } = useAdminSession();
  const [items, setItems] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems((await adminApi.media(token)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the photos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Sends the photograph, then its heading: it only shows on the website once both are in */
  const add = async (place: MediaPlace, image: PreparedImage, details: SaveMediaInput) => {
    const uploaded = await adminApi.uploadMedia(token, image.blob, { ...place, width: image.width, height: image.height });
    try {
      await adminApi.saveMedia(token, uploaded.id, details);
    } finally {
      await refresh();
    }
  };

  const save = async (id: number, details: SaveMediaInput) => {
    await adminApi.saveMedia(token, id, details);
    await refresh();
  };

  /** For the buttons on a card: failures land in `error` instead of being thrown */
  const quietly = async (id: number, failed: string, work: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await work();
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : failed);
    } finally {
      setBusyId(null);
    }
  };

  const remove = (id: number) => quietly(id, 'Could not remove the photo', () => adminApi.deleteMedia(token, id));

  const setPublished = (image: MediaImage, published: boolean) =>
    quietly(image.id, 'Could not save the change', () =>
      adminApi.saveMedia(token, image.id, { translations: image.translations, category: image.category ?? undefined, published }),
    );

  return { items, loading, error, busyId, refresh, add, save, remove, setPublished };
}
