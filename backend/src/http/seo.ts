/**
 * What search engines and link previews read about each page.
 *
 * The website is drawn in the browser, but its <head> is written here, on the
 * server, so that Google, Bing, Facebook, Telegram and WhatsApp see the right
 * title, description, photograph and business details for every address
 * without running any script. The words come from frontend/src/seo/site.json,
 * which the website build copies to frontend/dist/seo.json.
 */

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  image?: string;
  /** the short name in the breadcrumb trail */
  name?: string;
  /** the page above this one in the breadcrumb trail */
  parent?: string;
  priority?: string;
};

export type SeoSite = {
  url: string;
  name: string;
  alternateNames: string[];
  description: string;
  image: string;
  logo: string;
  telephone: string;
  email: string;
  address: { streetAddress: string; addressLocality: string; addressRegion: string; addressCountry: string };
  plusCode: string;
  maps: string;
  opens: string;
  closes: string;
  sameAs: string[];
  keywords: string;
  /** addresses kept out of search results (the staff area, pages under review) */
  noindex: string[];
  pages: SeoPage[];
  /** addresses whose sub-pages show the page above them (/heritage/houses shows /heritage) */
  sections: string[];
};

export type SeoAnswer = { status: number; head: string };

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const absolute = (site: SeoSite, path: string) => (path.startsWith('http') ? path : site.url + path);

/** "/heritage/" and "/Heritage" are the same page as "/heritage" */
function normalise(path: string): string {
  let clean = path.split('?')[0]!.split('#')[0]!;
  try {
    clean = decodeURI(clean);
  } catch {
    // an address that cannot be read is simply not found
  }
  if (clean.length > 1) clean = clean.replace(/\/+$/, '');
  return clean || '/';
}

/** The place itself, described for search engines (schema.org) */
function placeData(site: SeoSite) {
  return {
    '@type': ['TouristAttraction', 'LocalBusiness'],
    '@id': `${site.url}/#place`,
    name: site.name,
    alternateName: site.alternateNames,
    description: site.description,
    url: site.url,
    logo: absolute(site, site.logo),
    image: [...new Set(site.pages.map((page) => absolute(site, page.image ?? site.image)))],
    telephone: site.telephone,
    email: site.email,
    address: { '@type': 'PostalAddress', ...site.address },
    hasMap: site.maps,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: site.opens,
        closes: site.closes,
      },
    ],
    sameAs: site.sameAs,
    keywords: site.keywords,
    knowsLanguage: ['en', 'am', 'wal'],
    touristType: ['Cultural tourism', 'Heritage tourism', 'Families', 'School groups', 'Nature lovers'],
  };
}

function structuredData(site: SeoSite, page: SeoPage, url: string): string {
  // the pages above this one, for the breadcrumb trail
  const trail: SeoPage[] = [];
  let at: SeoPage | undefined = page;
  while (at && at.path !== '/') {
    trail.unshift(at);
    const above: string | undefined = at.parent;
    at = above ? site.pages.find((p) => p.path === above) : undefined;
  }
  const graph = [
    placeData(site),
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      alternateName: site.alternateNames,
      inLanguage: ['en', 'am', 'wal'],
      publisher: { '@id': `${site.url}/#place` },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: 'en',
      isPartOf: { '@id': `${site.url}/#website` },
      about: { '@id': `${site.url}/#place` },
      primaryImageOfPage: absolute(site, page.image ?? site.image),
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [{ path: '/', name: site.name }, ...trail.map((p) => ({ path: p.path, name: p.name ?? p.title }))].map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: absolute(site, item.path === '/' ? '/' : item.path),
        })),
      },
    },
  ];
  // "<" is written as < so the data can never close the <script> early
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

/** The <head> tags for one address, and the status to answer with (404 for an unknown address) */
export function seoFor(site: SeoSite, rawPath: string): SeoAnswer {
  const path = normalise(rawPath);
  const hidden = site.noindex.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
  const own = site.pages.find((page) => page.path === path);
  const section = own ? undefined : site.sections.find((prefix) => path.startsWith(prefix));
  const page = own ?? (section ? site.pages.find((p) => p.path === section.replace(/\/$/, '')) : undefined);

  if (hidden || !page) {
    const title = hidden ? site.name : `Page not found | ${site.name}`;
    return {
      status: hidden ? 200 : 404,
      head: [`<title>${escapeText(title)}</title>`, '<meta name="robots" content="noindex, nofollow">'].join('\n    '),
    };
  }

  const url = absolute(site, page.path === '/' ? '/' : page.path);
  const image = absolute(site, page.image ?? site.image);
  const tags = [
    `<title>${escapeText(page.title)}</title>`,
    `<meta name="description" content="${escapeAttr(page.description)}">`,
    `<meta name="keywords" content="${escapeAttr(site.keywords)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">',
    `<link rel="canonical" href="${escapeAttr(url)}">`,
    `<meta name="geo.region" content="ET">`,
    `<meta name="geo.placename" content="${escapeAttr(`${site.address.addressLocality}, Wolaita, Ethiopia`)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${escapeAttr(site.name)}">`,
    `<meta property="og:title" content="${escapeAttr(page.title)}">`,
    `<meta property="og:description" content="${escapeAttr(page.description)}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escapeAttr(page.title)}">`,
    '<meta property="og:locale" content="en_US">',
    '<meta property="og:locale:alternate" content="am_ET">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeAttr(page.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(page.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(image)}">`,
    `<script type="application/ld+json">${structuredData(site, page, url)}</script>`,
  ];
  return { status: 200, head: tags.join('\n    ') };
}

/** The page shell with its general <head> lines replaced by the ones for this address */
export function withSeo(html: string, head: string): string {
  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="(description|robots|keywords|twitter:[a-z:]+)"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[a-z:_]+"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
  return stripped.replace(/<\/head>/i, `    ${head}\n  </head>`);
}
