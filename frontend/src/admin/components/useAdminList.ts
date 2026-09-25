import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import type { Page } from '../api/types';

/**
 * Loads one page of a staff list and keeps it in step with status changes.
 * Both list views (messages and visit requests) work the same way, so they share this.
 */
export function useAdminList<T extends { id: number; status: S }, S extends string = T['status']>(
  load: (page: number) => Promise<Page<T>>,
  update: (id: number, status: S) => Promise<T>,
  deps: unknown[] = [],
) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<T> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await load(page));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the list');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const changeStatus = async (id: number, status: S) => {
    setBusyId(id);
    setError('');
    try {
      const updated = await update(id, status);
      setData((current) =>
        current ? { ...current, items: current.items.map((item) => (item.id === id ? updated : item)) } : current,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the status');
    } finally {
      setBusyId(null);
    }
  };

  return { page, setPage, data, error, loading, busyId, refresh, changeStatus };
}
