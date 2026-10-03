import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';
import type { Env } from '../config/env.js';
import { logger } from '../lib/logger.js';

/**
 * Where the built website is: WEB_DIST when it is set. Otherwise, in production,
 * the website built beside the API (frontend/dist, made by `pnpm build`), so a
 * host that simply runs `pnpm build` and `pnpm start` serves both. '' means none.
 */
export function websiteFolder(env: Env): string {
  if (env.WEB_DIST) return env.WEB_DIST;
  if (env.NODE_ENV !== 'production') return '';
  // from backend/dist/http (or backend/src/http) up to the repository, then frontend/dist
  const beside = fileURLToPath(new URL('../../../frontend/dist', import.meta.url));
  return existsSync(join(beside, 'index.html')) ? beside : '';
}

/**
 * Serves the built website (frontend/dist) from the same app as the API.
 *
 * Files under /assets carry a fingerprint in their name, so browsers may keep
 * them for a year; everything else is checked again on each visit. Any other
 * address (/heritage, /admin, ...) gets index.html, and the website's own
 * router shows the right page.
 */
export function website(folder: string) {
  const root = resolve(folder);
  const index = join(root, 'index.html');
  const router = Router();

  if (!existsSync(index)) {
    logger.warn(`website: no index.html in ${root}, so only the API is served`);
    return router;
  }

  router.use('/assets', express.static(join(root, 'assets'), { immutable: true, maxAge: '1y' }));
  // a missing asset is a plain 404, never the page shell
  router.use('/assets', (_req, res) => void res.status(404).end());
  router.use(express.static(root, { index: false, maxAge: '1h' }));

  router.get('/{*page}', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(index);
  });

  logger.info(`website: serving ${root}`);
  return router;
}
