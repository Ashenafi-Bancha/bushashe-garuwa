import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import express, { Router } from 'express';
import { logger } from '../lib/logger.js';

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
