/**
 * Counting visits to the public pages (shown to staff under Visitors).
 *
 * No cookie and nothing personal: the website only says which page was opened,
 * in which language, and where the visit began (the site that linked here, or
 * a mark in the link such as ?ref=qr on the posters). That beginning is kept
 * for the rest of the visit in sessionStorage, which the browser forgets when
 * the tab is closed. The API turns the rest into numbers (backend/src/modules/stats).
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { API_BASE, apiEnabled } from './api';

const KEY = 'bg-visit-began';

type Began = { ref?: string; src?: string };

/** Where this visit began, read once on its first page */
function visitBegan(): Began {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Began;
  } catch {
    /* private browsing: read it fresh each time */
  }
  const params = new URLSearchParams(window.location.search);
  const src = (params.get('ref') ?? params.get('utm_source') ?? '').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 40) || undefined;
  const fromElsewhere = document.referrer && !document.referrer.startsWith(window.location.origin);
  const began: Began = { ref: fromElsewhere ? document.referrer.slice(0, 500) : undefined, src };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(began));
  } catch {
    /* nothing to keep it in */
  }
  return began;
}

function countView(path: string, lang: string) {
  if (!apiEnabled || /^\/(admin|preview)(\/|$)/.test(path)) return;
  const page = path.replace(/[^A-Za-z0-9/_-]/g, '').slice(0, 200) || '/';
  void fetch(`${API_BASE}/v1/stats/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: page, lang, ...visitBegan() }),
    keepalive: true,
  }).catch(() => undefined); // a count that fails must never trouble the visitor
}

/** Counts each page as it is opened (once, even when React draws it twice) */
export function VisitCounter() {
  const { pathname } = useLocation();
  const { lang } = useI18n();
  const last = useRef('');
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    countView(pathname, lang);
    // the language is read at the moment the page opens; switching language is not a new page
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
