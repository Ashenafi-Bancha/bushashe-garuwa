import { useEffect } from 'react';

/** Asks search engines to leave this page out, for as long as it is shown (pages under review) */
export function useNoIndex(on = true): void {
  useEffect(() => {
    if (!on) return;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.append(meta);
    return () => meta.remove();
  }, [on]);
}
