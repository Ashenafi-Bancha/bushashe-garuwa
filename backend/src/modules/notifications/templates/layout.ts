import { BRAND } from './brand.js';

/**
 * The pieces every Bushaashe Garuwa email is built from: the frame (header with
 * the logo on deep forest green and a thin band in the colours of the Wolaita
 * cloth, the white card, the footer with the social icons) and the parts that go
 * inside it (summary card, figures, buttons, note boxes).
 *
 * Written for mail apps, not browsers: tables for layout, every style inline,
 * images by absolute address with sizes and alt text, buttons that also work in
 * Outlook. A short <style> block adds what the better apps understand: the
 * phone layout and dark mode. Without it the email still reads well.
 */

export type Lang = 'en' | 'am';
const C = BRAND.colors;

/** Everything a guest typed goes through this before it reaches the HTML */
export function escape(value: string | number | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** The text face for each language; Ge'ez letters need an Ethiopic font */
export const fontFor = (lang: Lang = 'en') => (lang === 'am' ? BRAND.fonts.ethiopic : BRAND.fonts.body);
const headingFor = (lang: Lang) => (lang === 'am' ? BRAND.fonts.ethiopic : BRAND.fonts.display);
/** Small spaced capitals for labels; Ge'ez has no capitals and reads badly spaced out */
export const capsFor = (lang: Lang = 'en', tracking = '0.14em') => (lang === 'am' ? '' : `letter-spacing:${tracking};text-transform:uppercase;`);

/** A paragraph of body text (the text must already be escaped where a guest typed it) */
export function paragraph(text: string, lang: Lang = 'en', extra = ''): string {
  return `<p class="t-body" style="margin:0 0 16px;font-family:${fontFor(lang)};font-size:16px;line-height:1.65;color:${C.body};${extra}">${text}</p>`;
}

/** The large heading of an email */
export function heading(text: string, lang: Lang = 'en'): string {
  return `<h1 class="t-ink h1" style="margin:0 0 14px;font-family:${headingFor(lang)};font-size:30px;font-weight:800;${lang === 'am' ? 'line-height:1.35;' : 'line-height:1.15;letter-spacing:-0.02em;'}color:${C.ink};">${text}</h1>`;
}

/** A small rounded label above a heading */
export function eyebrow(text: string, lang: Lang = 'en', tone: 'moss' | 'clay' = 'moss'): string {
  const [bg, fg] = tone === 'clay' ? ['#FBE7DC', '#9A4A20'] : [C.sage, C.ink];
  return `<div style="margin:0 0 14px;"><span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:6px 14px;font-family:${fontFor(lang)};font-size:12px;font-weight:700;${capsFor(lang, '0.1em')}">${text}</span></div>`;
}

/** A section title inside the card */
export function subheading(text: string, lang: Lang = 'en'): string {
  return `<h2 class="t-ink" style="margin:26px 0 12px;font-family:${headingFor(lang)};font-size:19px;font-weight:800;line-height:1.3;color:${C.ink};">${text}</h2>`;
}

/**
 * The summary card: labels on the left, values on the right, thin lines between.
 * On a phone each row stacks (label above value). Values must already be escaped.
 */
export function summaryCard(rows: [label: string, value: string][], lang: Lang = 'en'): string {
  const body = rows
    .filter(([, value]) => value)
    .map(
      ([label, value], i) => `
          <tr class="stack">
            <td class="t-muted" width="40%" style="padding:13px 12px 13px 0;${i > 0 ? `border-top:1px solid ${C.line};` : ''}font-family:${fontFor(lang)};font-size:${lang === 'am' ? '14px' : '12px'};font-weight:600;${capsFor(lang, '0.08em')}color:${C.muted};vertical-align:top;">${label}</td>
            <td class="t-ink" style="padding:13px 0;${i > 0 ? `border-top:1px solid ${C.line};` : ''}font-family:${fontFor(lang)};font-size:15px;font-weight:600;line-height:1.5;color:${C.ink};vertical-align:top;text-align:right;">${value}</td>
          </tr>`,
    )
    .join('');
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bg-soft" style="margin:8px 0 8px;background:${C.cream};border-radius:18px;">
    <tr><td style="padding:6px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${body}
      </table>
    </td></tr>
  </table>`;
}

/** The booking number, large, so a guest can read it out on the phone */
export function referenceBlock(label: string, code: string, note: string, lang: Lang = 'en'): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;">
    <tr>
      <td align="center" class="ref" style="background:${C.forest};border-radius:18px;padding:20px 16px;">
        <div style="font-family:${fontFor(lang)};font-size:${lang === 'am' ? '13px' : '11px'};font-weight:700;${capsFor(lang, '0.18em')}color:${C.moss};">${label}</div>
        <div style="font-family:${BRAND.fonts.display};font-size:34px;font-weight:800;letter-spacing:0.06em;color:#FFFFFF;margin:8px 0 6px;">${escape(code)}</div>
        <div style="font-family:${fontFor(lang)};font-size:13px;color:#B7C6B5;">${note}</div>
      </td>
    </tr>
  </table>`;
}

/** Big figures side by side (dates, guests), to be read at a glance; they stack on a phone */
export function highlights(items: [label: string, value: string][], lang: Lang = 'en'): string {
  const shown = items.filter(([, value]) => value);
  if (!shown.length) return '';
  const cells = shown
    .map(
      ([label, value], i) => `
        <td class="hl" valign="top" width="${Math.floor(100 / shown.length)}%" style="padding:0 ${i < shown.length - 1 ? '12px' : '0'} 12px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background:${C.sage};border-radius:16px;padding:16px 18px;">
              <div style="font-family:${fontFor(lang)};font-size:11px;font-weight:700;${capsFor(lang, '0.14em')}color:${C.greenDark};">${label}</div>
              <div style="font-family:${BRAND.fonts.display};font-size:21px;font-weight:800;line-height:1.25;color:${C.ink};margin-top:6px;">${value}</div>
            </td>
          </tr></table>
        </td>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 8px;"><tr class="stack">${cells}</tr></table>`;
}

/** A note in a soft box: what happens next, or what the guest wrote */
export function noteBox(title: string, text: string, lang: Lang = 'en', options: { quote?: boolean } = {}): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 8px;">
    <tr>
      <td class="bg-soft" style="background:${C.cream};border-left:4px solid ${options.quote ? C.clay : C.green};border-radius:0 16px 16px 0;padding:16px 20px;">
        ${title ? `<div class="t-ink" style="font-family:${headingFor(lang)};font-size:15px;font-weight:800;color:${C.ink};margin:0 0 6px;">${title}</div>` : ''}
        <div class="t-body" style="font-family:${fontFor(lang)};font-size:15px;line-height:1.65;color:${C.body};${options.quote ? 'white-space:pre-line;' : ''}">${text}</div>
      </td>
    </tr>
  </table>`;
}

/**
 * A button that works everywhere: a rounded table cell with a link for most
 * apps, and a VML shape for Outlook on Windows. `tone` picks green or outline.
 */
export function button(href: string, label: string, lang: Lang = 'en', tone: 'solid' | 'outline' = 'solid'): string {
  const solid = tone === 'solid';
  const width = Math.max(180, Math.round(label.length * (lang === 'am' ? 15 : 9.5)) + 64);
  const safeHref = escape(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;margin:6px 8px 6px 0;"><tr><td>
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="50%" ${solid ? `stroke="f" fillcolor="${C.green}"` : `strokecolor="${C.green}" strokeweight="2px" fillcolor="#FFFFFF"`}>
<w:anchorlock/><center style="color:${solid ? '#FFFFFF' : C.green};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${label}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
  <td align="center" bgcolor="${solid ? C.green : '#FFFFFF'}" style="border-radius:999px;${solid ? '' : `border:2px solid ${C.green};`}">
    <a href="${safeHref}" target="_blank" style="display:inline-block;padding:${solid ? '14px 28px' : '12px 26px'};font-family:${fontFor(lang)};font-size:15px;font-weight:700;line-height:20px;color:${solid ? '#FFFFFF' : C.green};text-decoration:none;border-radius:999px;">${label}&nbsp;&nbsp;&rarr;</a>
  </td>
</tr></table>
<!--<![endif]-->
</td></tr></table>`;
}

/** A row of buttons */
export const buttons = (...items: string[]) => `<div style="margin:22px 0 6px;">${items.join('')}</div>`;

export type FrameInput = {
  lang: Lang;
  siteUrl: string;
  /** the line many mail apps show beside the subject */
  preheader: string;
  /** the <title> of the document */
  title: string;
  /** already-built HTML for inside the white card */
  body: string;
  /** the small note at the very bottom (why the reader got this email) */
  note: string;
};

/** The colours of the Wolaita cloth, as a thin band */
function clothBand(): string {
  const cells = BRAND.cloth.map((color) => `<td height="6" style="height:6px;line-height:6px;font-size:0;background:${color};">&nbsp;</td>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table>`;
}

/** The whole email: header, card, footer */
export function frame(input: FrameInput): string {
  const { lang } = input;
  const site = input.siteUrl.replace(/\/$/, '');
  const font = fontFor(lang);
  const year = new Date().getFullYear();
  const icons = BRAND.social
    .filter((s) => s.url)
    .map(
      (s) =>
        `<td style="padding:0 6px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#FFFFFF;border-radius:50%;padding:3px;"><a href="${escape(s.url)}" target="_blank" style="text-decoration:none;"><img src="${site}${s.icon}" width="32" height="32" alt="${s.name}" style="display:block;width:32px;height:32px;border:0;outline:none;" /></a></td></tr></table></td>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${lang}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escape(input.title)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <link href="${BRAND.fonts.googleUrl}" rel="stylesheet" />
  <style>
    body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
    img { -ms-interpolation-mode:bicubic; }
    a { color:${C.green}; }
    @media only screen and (max-width:620px) {
      .container { width:100% !important; }
      .px { padding-left:22px !important; padding-right:22px !important; }
      .h1 { font-size:25px !important; }
      .stack td { display:block !important; width:100% !important; text-align:left !important; box-sizing:border-box; }
      .stack td.t-muted { padding-bottom:2px !important; }
      .stack td + td { border-top:0 !important; padding-top:0 !important; }
      .hl { padding:0 0 10px 0 !important; }
    }
    @media (prefers-color-scheme: dark) {
      .bg-page { background:#0E1A12 !important; }
      .bg-card { background:#17251B !important; }
      .bg-soft { background:#1F3125 !important; }
      .t-ink { color:#F4EFE4 !important; }
      .t-body { color:#D5DDD1 !important; }
      .t-muted { color:#A9B5A6 !important; }
      .ref { background:#0E1A12 !important; border:1px solid #3F7D20 !important; }
      .bg-soft td, .rule { border-color:#2F4636 !important; }
    }
  </style>
</head>
<body class="bg-page" style="margin:0;padding:0;background:${C.cream};">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;mso-hide:all;">${escape(input.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bg-page" style="background:${C.cream};">
    <tr>
      <td align="center" style="padding:28px 12px 18px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="container" style="max-width:600px;">

          <!-- header: the logo on deep forest green, the name, the line of the website -->
          <tr>
            <td align="center" style="background:${C.forest};border-radius:24px 24px 0 0;padding:30px 24px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" style="background:#FFFFFF;border-radius:50%;padding:4px;">
                <img src="${site}${BRAND.logo}" width="68" height="68" alt="${BRAND.name}" style="display:block;width:68px;height:68px;border:0;border-radius:50%;" />
              </td></tr></table>
              <div style="font-family:${BRAND.fonts.display};font-size:24px;font-weight:800;letter-spacing:-0.01em;color:#FFFFFF;margin-top:14px;">${BRAND.name}</div>
              <div style="font-family:${font};font-size:13px;font-weight:600;${capsFor(lang, '0.16em')}color:${C.moss};margin-top:6px;">${BRAND.tagline[lang]}</div>
            </td>
          </tr>
          <tr><td style="font-size:0;line-height:0;">${clothBand()}</td></tr>

          <!-- the card -->
          <tr>
            <td class="bg-card px" style="background:#FFFFFF;padding:34px 40px 34px;">
              ${input.body}
            </td>
          </tr>

          <!-- footer: in the green of the website's buttons, the words in white -->
          <tr>
            <td align="center" bgcolor="${C.green}" style="background:${C.green};border-radius:0 0 24px 24px;padding:28px 24px 26px;">
              ${icons ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;"><tr>${icons}</tr></table>` : ''}
              <div style="font-family:${font};font-size:13px;line-height:1.8;color:#FFFFFF;">
                <a href="${site}" target="_blank" style="color:#FFFFFF;font-weight:700;text-decoration:underline;">${site.replace(/^https?:\/\//, '')}</a><br />
                ${BRAND.contact.address[lang]}<br />
                &copy; ${year} ${BRAND.name}<br />
                <span style="font-size:12px;color:#FFFFFF;opacity:0.85;">${input.note}</span>
              </div>
            </td>
          </tr>
          <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** A plain-text copy for mail apps that do not show HTML */
export function plainText(lines: (string | false | null | undefined)[], lang: Lang = 'en'): string {
  return [
    ...lines.filter((line): line is string => typeof line === 'string'),
    '',
    '—',
    BRAND.name,
    BRAND.contact.address[lang],
    `${BRAND.contact.phone} · ${BRAND.contact.email}`,
    BRAND.site,
  ].join('\n');
}
