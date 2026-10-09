/**
 * The frame every Bushaashe Garuwa email sits in, drawn the way the website is:
 * a white card on deep forest green, the logo and name at the top, a moss label,
 * the message, and the address and contacts at the foot.
 *
 * Built from tables with inline styles on purpose: that is what Gmail, Outlook
 * and phone mail apps render reliably. No external CSS, no scripts.
 */

export const BRAND = {
  ink: '#1E3A29',
  body: '#4B5C50',
  muted: '#83907F',
  green: '#1E3A29',
  /** the accent: moss green, as on the website */
  gold: '#86A94F',
  mossText: '#5E7F35',
  mossSoft: '#E6EDD8',
  canvas: '#13261A',
  line: '#ECE7DA',
  soft: '#F4EFE4',
  font: "'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif",
  display: "'Bricolage Grotesque', 'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif",
  address: 'Damot Sore Woreda, Wolaita Zone, Ethiopia',
  phone: '+251 932 196 502',
  phoneHref: '+251932196502',
  email: 'bushaashegaruwa@gmail.com',
  facebook: 'https://www.facebook.com/bushaashe.garuwa',
  telegram: 'https://t.me/bushaashegaruwafrist',
  whatsapp: 'https://wa.me/251932196502',
  youtube: 'https://www.youtube.com/results?search_query=bushaashe+garuwa',
} as const;

export type Lang = 'en' | 'am';

/** The typeface for each language; Ge'ez letters need an Ethiopic font */
export function fontFor(lang: Lang = 'en'): string {
  return lang === 'am' ? "'Noto Sans Ethiopic', Nyala, 'Abyssinica SIL', 'Segoe UI', sans-serif" : BRAND.font;
}

/** Small spaced capitals for labels; Ge'ez has no capitals and reads badly spaced out */
export function capsFor(lang: Lang = 'en', tracking = '0.18em'): string {
  return lang === 'am' ? '' : `letter-spacing:${tracking};text-transform:uppercase;`;
}

/** Everything a guest typed goes through this before it reaches the HTML */
export function escape(value: string | number | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function paragraph(text: string, lang: Lang = 'en'): string {
  return `<p style="margin:0 0 16px;font-family:${fontFor(lang)};font-size:15px;line-height:1.65;color:${BRAND.body};">${text}</p>`;
}

/** The label/value list used for booking and visit details */
export function details(rows: [label: string, value: string][], lang: Lang = 'en'): string {
  const body = rows
    .filter(([, value]) => value)
    .map(
      ([label, value], i) => `
      <tr>
        <td style="padding:12px 0;${i > 0 ? `border-top:1px solid ${BRAND.line};` : ''}font-family:${fontFor(lang)};font-size:${lang === 'am' ? '13px' : '12px'};${capsFor(lang, '0.08em')}color:${BRAND.muted};width:38%;vertical-align:top;">${label}</td>
        <td style="padding:12px 0;${i > 0 ? `border-top:1px solid ${BRAND.line};` : ''}font-family:${fontFor(lang)};font-size:15px;font-weight:600;color:${BRAND.ink};vertical-align:top;">${value}</td>
      </tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border-collapse:collapse;">${body}</table>`;
}

/** The booking number, large, so a guest can read it out on the phone */
export function referenceBlock(label: string, code: string, note: string, lang: Lang = 'en'): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;">
    <tr>
      <td align="center" style="background:${BRAND.soft};border-radius:20px;padding:22px 16px;">
        <div style="font-family:${fontFor(lang)};font-size:${lang === 'am' ? '13px' : '11px'};${capsFor(lang)}font-weight:700;color:${BRAND.mossText};">${label}</div>
        <div style="font-family:${BRAND.display};font-size:34px;font-weight:800;letter-spacing:0.04em;color:${BRAND.ink};margin:8px 0 6px;">${escape(code)}</div>
        <div style="font-family:${fontFor(lang)};font-size:13px;color:${BRAND.muted};">${note}</div>
      </td>
    </tr>
  </table>`;
}

/** The green pill button, as on the website */
export function button(href: string, label: string, lang: Lang = 'en'): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px;">
    <tr>
      <td style="border-radius:999px;background:${BRAND.green};">
        <a href="${escape(href)}" style="display:inline-block;padding:7px 7px 7px 24px;font-family:${fontFor(lang)};font-size:14px;font-weight:700;color:${BRAND.soft};text-decoration:none;border-radius:999px;line-height:34px;">${label}&nbsp;&nbsp;<span style="display:inline-block;width:34px;height:34px;line-height:34px;border-radius:999px;background:${BRAND.gold};color:${BRAND.canvas};text-align:center;font-size:16px;vertical-align:middle;">&rarr;</span></a>
      </td>
    </tr>
  </table>`;
}

export type LayoutInput = {
  lang: Lang;
  siteUrl: string;
  /** the grey line many mail apps show beside the subject */
  preheader: string;
  eyebrow: string;
  title: string;
  /** already-built HTML: paragraphs, details, reference, button */
  body: string;
  /** words in the footer, in the email's language */
  footer: { followUs: string; why: string };
};

export function layout(input: LayoutInput): string {
  const { siteUrl, lang } = input;
  const font = fontFor(lang);
  const logo = `${siteUrl}/apple-touch-icon.png`;

  return `<!doctype html>
<html lang="${input.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>${escape(input.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${BRAND.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(input.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.canvas};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- the card -->
          <tr>
            <td style="background:#FFFFFF;border-radius:28px;padding:0;">

              <!-- logo and name -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:28px 32px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;"><img src="${logo}" width="44" height="44" alt="Bushaashe Garuwa" style="display:block;border-radius:50%;border:0;" /></td>
                        <td style="vertical-align:middle;padding-left:12px;">
                          <div style="font-family:${BRAND.display};font-size:18px;font-weight:800;color:${BRAND.ink};letter-spacing:-0.02em;">Bushaashe Garuwa</div>
                          <div style="font-family:${BRAND.font};font-size:12px;color:${BRAND.muted};margin-top:3px;">Damot Sore · Wolaita · Ethiopia</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- the message -->
                <tr>
                  <td style="padding:30px 32px 10px;">
                    <div style="margin:0 0 16px;"><span style="display:inline-block;background:${BRAND.mossSoft};color:${BRAND.ink};border-radius:999px;padding:6px 14px;font-family:${font};font-size:13px;font-weight:700;">${input.eyebrow}</span></div>
                    <h1 style="margin:0 0 18px;font-family:${lang === 'am' ? font : BRAND.display};font-size:30px;font-weight:800;${lang === 'am' ? 'line-height:1.35;' : 'line-height:1.15;letter-spacing:-0.03em;'}color:${BRAND.ink};">${input.title}</h1>
                    ${input.body}
                  </td>
                </tr>

                <!-- address and contacts -->
                <tr>
                  <td style="padding:8px 32px 28px;">
                    <div style="border-top:1px solid ${BRAND.line};padding-top:20px;font-family:${BRAND.font};font-size:13px;line-height:1.7;color:${BRAND.muted};">
                      <strong style="color:${BRAND.ink};">Bushaashe Garuwa</strong><br />
                      ${BRAND.address}<br />
                      <a href="tel:${BRAND.phoneHref}" style="color:${BRAND.green};text-decoration:none;">${BRAND.phone}</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:${BRAND.email}" style="color:${BRAND.green};text-decoration:none;">${BRAND.email}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- below the card, on the black -->
          <tr>
            <td align="center" style="padding:22px 16px 6px;font-family:${font};font-size:12px;line-height:1.7;color:#9DB09F;">
              ${input.footer.followUs}
              <a href="${BRAND.facebook}" style="color:#FFFFFF;text-decoration:none;">Facebook</a> ·
              <a href="${BRAND.telegram}" style="color:#FFFFFF;text-decoration:none;">Telegram</a> ·
              <a href="${BRAND.whatsapp}" style="color:#FFFFFF;text-decoration:none;">WhatsApp</a> ·
              <a href="${BRAND.youtube}" style="color:#FFFFFF;text-decoration:none;">YouTube</a><br />
              <a href="${siteUrl}" style="color:#FFFFFF;text-decoration:none;">${siteUrl.replace(/^https?:\/\//, '')}</a><br />
              <span style="color:#71877A;">${input.footer.why}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
