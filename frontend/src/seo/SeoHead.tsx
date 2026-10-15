import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import site from './site.json';

/** One <meta> or <link> in the head, made if it is not there yet */
function headTag(selector: string, make: () => HTMLElement): HTMLElement {
  const found = document.head.querySelector<HTMLElement>(selector);
  if (found) return found;
  const tag = make();
  document.head.appendChild(tag);
  return tag;
}

/**
 * Keeps the browser tab title, the description and the page's own address in
 * step with the page being shown. The API writes the same lines into the page
 * it sends (backend/src/http/seo.ts), so search engines read them without
 * running scripts; this keeps them right while visitors move from page to page.
 * In Amharic and Wolaytta the tab shows the name of the place in that language.
 */
export default function SeoHead() {
  const { pathname } = useLocation();
  const { lang, t } = useI18n();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
    const section = site.sections.find((prefix) => path.startsWith(prefix));
    const page =
      site.pages.find((p) => p.path === path) ?? (section ? site.pages.find((p) => p.path === section.replace(/\/$/, '')) : undefined);

    document.title = lang === 'en' && page ? page.title : t.meta.title;
    if (!page) return;

    const description = headTag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }));
    description.setAttribute('content', page.description);
    const canonical = headTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
    canonical.setAttribute('href', site.url + (page.path === '/' ? '/' : page.path));
  }, [pathname, lang, t]);

  return null;
}
