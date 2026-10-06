/**
 * Helper for the Wolaytta translation (see docs/WOLAYTTA-TRANSLATION.md).
 *
 *   pnpm wolaytta         how far the translation is, page by page, and any mistakes
 *   pnpm wolaytta:sync    rebuild the translation files from the English text,
 *                         keeping every Wolaytta line already written
 *
 * The English text is src/i18n/dictionaries/en.ts. The Wolaytta text is one file
 * per page in src/i18n/dictionaries/wol/. A line left empty ("") is not yet
 * translated and shows in English on the site.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DICTIONARIES = join(HERE, '..', 'src', 'i18n', 'dictionaries');
const WOL_DIR = join(DICTIONARIES, 'wol');

/**
 * The translation files, in the order to work through them: which parts of the
 * English text each one holds, and where to see it on the site.
 */
const PAGES = [
  { file: 'shared', title: 'On every page: header menu, footer, buttons, notices', see: 'any page', keys: ['meta', 'common', 'nav', 'notice', 'footer', 'notFound'] },
  { file: 'home', title: 'Home page', see: '/', keys: ['home'] },
  { file: 'about', title: 'About page', see: '/about', keys: ['about'] },
  { file: 'discover', title: 'Discover page', see: '/discover', keys: ['discover'] },
  { file: 'heritage', title: 'Heritage page', see: '/heritage', keys: ['heritage'] },
  { file: 'experiences', title: 'Experiences page', see: '/experiences', keys: ['experiences'] },
  { file: 'events', title: 'Events page', see: '/events', keys: ['events'] },
  { file: 'vip', title: 'VIP Service page', see: '/vip', keys: ['vip'] },
  { file: 'stay', title: 'Guest House page (coming soon)', see: '/stay', keys: ['stay'] },
  { file: 'dine', title: 'Dine page', see: '/dine', keys: ['dine'] },
  { file: 'visit', title: 'Plan Your Visit page', see: '/visit', keys: ['visit'] },
  { file: 'contact', title: 'Contact page', see: '/contact', keys: ['contact'] },
  { file: 'gallery', title: 'Gallery page', see: '/gallery', keys: ['gallery'] },
  { file: 'photos', title: 'Photo descriptions and captions (gallery, and read aloud by screen readers)', see: '/gallery', keys: ['photos', 'photoCaptions'] },
  { file: 'immersive', title: '3D pages under review (not public yet: translate last)', see: '/preview', keys: ['immersive'] },
];

const load = async (path) => (await import(`${pathToFileURL(path).href}?t=${Date.now()}`));
const isText = (value) => typeof value === 'string';
const placeholders = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join(' ');

/** Reads one translation file; explains a typing mistake in plain words instead of a stack trace. */
async function readPage(page) {
  const path = join(WOL_DIR, `${page.file}.ts`);
  if (!existsSync(path)) return {};
  try {
    return (await load(path)).default ?? {};
  } catch (error) {
    console.error(`\n✗ src/i18n/dictionaries/wol/${page.file}.ts cannot be read. There is a typing mistake in it:`);
    console.error(`  ${String(error.message).split('\n')[0]}`);
    console.error('  Usual causes: a missing " at the end of a line, a missing comma after the closing ",');
    console.error('  or a " typed inside the text (write \\" instead). Fix it and run the command again.\n');
    process.exit(1);
  }
}

/* ── writing the files ── */

const quote = (text) => `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
const keyName = (key) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key));
const note = (text) => text.replace(/\s*\n\s*/g, ' ');

/** One part of the text as TypeScript source: every English line as a comment, the Wolaytta line beneath it */
function emit(english, wolaytta, indent, label) {
  const pad = '  '.repeat(indent);
  if (isText(english)) {
    const kept = isText(wolaytta) ? wolaytta : '';
    return `${pad}// EN: ${note(english)}\n${pad}${label}${quote(kept)},\n`;
  }
  if (Array.isArray(english)) {
    const items = english.map((item, i) => emit(item, Array.isArray(wolaytta) ? wolaytta[i] : undefined, indent + 1, '')).join('');
    return `${pad}${label}[\n${items}${pad}],\n`;
  }
  const inner = Object.keys(english)
    .map((key) => emit(english[key], wolaytta?.[key], indent + 1, `${keyName(key)}: `))
    .join('');
  return `${pad}${label}{\n${inner}${pad}},\n`;
}

function pageSource(page, en, existing) {
  const body = page.keys.map((key) => emit(en[key], existing[key], 1, `${keyName(key)}: `)).join('\n');
  return `import type { Dictionary } from '../en';
import type { DeepPartial } from '../../types';

/**
 * WOLAYTTATTO · ${page.title}
 * See it on the site: ${page.see}
 *
 * Under each "// EN:" line, type the Wolaytta between the two quotation marks.
 *   - Change only what is between the quotation marks. Leave the word before the colon as it is.
 *   - A line left empty ("") is not translated yet and shows in English.
 *   - Keep {count}, {n} and other words in curly brackets exactly as they are.
 *   - Do not edit the "// EN:" lines: they are rewritten from the English text.
 * The full guide is docs/WOLAYTTA-TRANSLATION.md. Check your work with:  pnpm wolaytta
 */
const page: DeepPartial<Dictionary> = {
${body}};

export default page;
`;
}

function indexSource() {
  const imports = PAGES.map((page) => `import ${page.file} from './wol/${page.file}';`).join('\n');
  return `import type { Dictionary } from './en';
import type { DeepPartial } from '../types';
${imports}

/**
 * WOLAYTTATTO — the Wolaytta translation, put together from one file per page
 * in the wol/ folder beside this file. Translate there, not here.
 *
 * Guide: docs/WOLAYTTA-TRANSLATION.md
 *   pnpm wolaytta        shows how far each page is and points out mistakes
 *   pnpm wolaytta:sync   brings the files up to date after the English text changes
 *
 * Any line not yet translated shows the English text. Until the translation is
 * published (WOLAYTTA_READY in src/i18n/config.ts), visitors who choose WOL see
 * a "coming soon" notice; on the local dev server the notice offers a preview.
 */
export const wol: DeepPartial<Dictionary> = {
${PAGES.map((page) => `  ...${page.file},`).join('\n')}
};
`;
}

/** Every Wolaytta line already written, whichever file it is in now */
async function existingTranslation(en) {
  const found = {};
  for (const page of PAGES) Object.assign(found, await readPage(page));
  // the first time: lines in the old single file that are no longer plain English
  const old = join(DICTIONARIES, 'wol.ts');
  if (!existsSync(WOL_DIR) && existsSync(old)) {
    const { wol } = await load(old);
    const keep = (english, wolaytta) => {
      if (isText(english)) return isText(wolaytta) && wolaytta !== english ? wolaytta : '';
      if (Array.isArray(english)) return english.map((item, i) => keep(item, wolaytta?.[i]));
      return Object.fromEntries(Object.keys(english).map((key) => [key, keep(english[key], wolaytta?.[key])]));
    };
    Object.assign(found, keep(en, wol));
  }
  return found;
}

async function sync(en) {
  const unplaced = Object.keys(en).filter((key) => !PAGES.some((page) => page.keys.includes(key)));
  if (unplaced.length > 0) {
    console.error(`✗ The English text has new parts that belong to no translation file yet: ${unplaced.join(', ')}.`);
    console.error('  Add them to PAGES at the top of frontend/scripts/wolaytta.mjs, then run this again.');
    process.exit(1);
  }
  const existing = await existingTranslation(en);
  mkdirSync(WOL_DIR, { recursive: true });
  for (const page of PAGES) writeFileSync(join(WOL_DIR, `${page.file}.ts`), pageSource(page, en, existing));
  writeFileSync(join(DICTIONARIES, 'wol.ts'), indexSource());
  console.log(`✓ ${PAGES.length} translation files written to src/i18n/dictionaries/wol/ (Wolaytta already written is kept).`);
}

/* ── checking ── */

function compare(english, wolaytta, path, result) {
  if (isText(english)) {
    result.total++;
    if (wolaytta === undefined) return void result.missing.push(path);
    if (!isText(wolaytta)) return void result.problems.push(`${path}: should be text between quotation marks`);
    if (wolaytta.trim() === '') return;
    result.done++;
    if (placeholders(english) !== placeholders(wolaytta)) {
      result.problems.push(`${path}: must keep ${placeholders(english) || 'no curly-bracket words'} exactly as in the English (found: ${placeholders(wolaytta) || 'none'})`);
    }
    return;
  }
  if (Array.isArray(english)) {
    if (!Array.isArray(wolaytta) || wolaytta.length !== english.length) result.missing.push(path);
    return english.forEach((item, i) => compare(item, Array.isArray(wolaytta) ? wolaytta[i] : undefined, `${path}[${i + 1}]`, result));
  }
  for (const key of Object.keys(english)) compare(english[key], wolaytta?.[key], path ? `${path}.${key}` : key, result);
  if (wolaytta && typeof wolaytta === 'object') {
    for (const key of Object.keys(wolaytta)) if (!(key in english)) result.problems.push(`${path}.${key}: this line is not in the English text (a renamed or removed line?)`);
  }
}

async function check(en) {
  if (!existsSync(WOL_DIR)) {
    console.log('The translation files are not there yet. Run:  pnpm wolaytta:sync');
    process.exit(1);
  }
  let total = 0;
  let done = 0;
  const problems = [];
  let outOfDate = false;
  console.log('\nWolaytta translation\n');
  for (const page of PAGES) {
    const wolaytta = await readPage(page);
    const result = { total: 0, done: 0, missing: [], problems: [] };
    for (const key of page.keys) compare(en[key], wolaytta[key], key, result);
    total += result.total;
    done += result.done;
    if (result.missing.length > 0) outOfDate = true;
    problems.push(...result.problems.map((problem) => `wol/${page.file}.ts  ${problem}`));
    const share = result.total ? Math.round((result.done / result.total) * 100) : 100;
    const bar = '█'.repeat(Math.round(share / 10)).padEnd(10, '·');
    const mark = result.done === result.total ? '✓' : ' ';
    console.log(`  ${mark} ${`wol/${page.file}.ts`.padEnd(20)} ${bar} ${String(result.done).padStart(3)} of ${String(result.total).padEnd(3)}  ${page.title}`);
  }
  console.log(`\n  ${done} of ${total} lines translated (${Math.round((done / total) * 100)}%).`);

  const strays = readdirSync(WOL_DIR).filter((name) => name.endsWith('.ts') && !PAGES.some((page) => `${page.file}.ts` === name));
  if (strays.length > 0) problems.push(`wol/ holds files the site does not use: ${strays.join(', ')}`);
  const index = readFileSync(join(DICTIONARIES, 'wol.ts'), 'utf8');
  if (PAGES.some((page) => !index.includes(`./wol/${page.file}'`))) outOfDate = true;

  if (outOfDate) console.log('\n  ! The English text has changed since the files were made. Run:  pnpm wolaytta:sync');
  if (problems.length > 0) {
    console.log(`\n  ${problems.length} thing(s) to fix:`);
    for (const problem of problems) console.log(`   - ${problem}`);
    console.log('');
    process.exit(1);
  }
  console.log(done === total ? '\n  Everything is translated. To publish, see "Publishing" in docs/WOLAYTTA-TRANSLATION.md.\n' : '\n  No mistakes found. Lines still empty show in English on the site.\n');
}

const { en } = await load(join(DICTIONARIES, 'en.ts'));
await (process.argv[2] === 'sync' ? sync(en) : check(en));
