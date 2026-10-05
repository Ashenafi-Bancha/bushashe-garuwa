/**
 * `pnpm build`: what the host (AletCloud) runs before `pnpm start`.
 *
 * Building the website needs more than 500 MB of memory at its peak, more than
 * the host's builder has, so its builds were failing. The website is therefore
 * built on a developer's computer and committed (frontend/dist), and the host
 * only has to build the small API.
 *
 *   pnpm web:prebuild   on your computer, before committing a change to the
 *                       website: checks the types, builds frontend/dist and
 *                       stamps it with a fingerprint of the website's source
 *   pnpm build          on the host: uses frontend/dist when its stamp matches
 *                       the source; otherwise builds the website itself (which
 *                       may fail there for lack of memory). Then builds the API.
 *   pnpm web:check      says whether frontend/dist matches the source
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'frontend', 'dist');
const STAMP = join(DIST, '.source-stamp');

/** Everything the built website depends on */
const SOURCES = ['frontend/src', 'frontend/public', 'frontend/index.html', 'frontend/vite.config.ts', 'frontend/package.json', '.figma/make/site.json', 'pnpm-lock.yaml'];
/** Text files are compared without line endings, which differ between Windows and the host */
const TEXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.json', '.md', '.svg', '.txt', '.yaml']);

function files(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path)
    .sort()
    .flatMap((name) => files(join(path, name)));
}

function fingerprint() {
  const hash = createHash('sha256');
  for (const source of SOURCES) {
    for (const file of files(join(ROOT, source))) {
      hash.update(relative(ROOT, file).replace(/\\/g, '/'));
      const content = readFileSync(file);
      hash.update(TEXT.has(extname(file).toLowerCase()) ? content.toString('utf8').replace(/\r\n/g, '\n') : content);
    }
  }
  return hash.digest('hex');
}

const run = (command) => execSync(command, { cwd: ROOT, stdio: 'inherit' });
const upToDate = () => existsSync(STAMP) && readFileSync(STAMP, 'utf8').trim() === fingerprint();

const mode = process.argv[2];

if (mode === '--prebuild') {
  run('pnpm --filter @bushaashe/frontend typecheck');
  run('pnpm --filter @bushaashe/frontend build:app');
  writeFileSync(STAMP, `${fingerprint()}\n`);
  console.log('\n✓ frontend/dist is built and stamped. Commit it together with your change.');
} else if (mode === '--check') {
  if (upToDate()) console.log('✓ frontend/dist matches the website source.');
  else {
    console.log('✗ frontend/dist is out of date. Run:  pnpm web:prebuild   and commit frontend/dist.');
    process.exit(1);
  }
} else {
  if (upToDate()) console.log('website: using the prebuilt copy in frontend/dist');
  else {
    console.log('website: frontend/dist is missing or out of date, so it is built here (run `pnpm web:prebuild` and commit it to avoid this)');
    run('pnpm --filter @bushaashe/frontend build:app');
  }
  run('pnpm --filter @bushaashe/backend build');
}
