import type { Dictionary } from './en';
import type { DeepPartial } from '../types';
import shared from './wol/shared';
import home from './wol/home';
import about from './wol/about';
import discover from './wol/discover';
import heritage from './wol/heritage';
import experiences from './wol/experiences';
import events from './wol/events';
import vip from './wol/vip';
import stay from './wol/stay';
import dine from './wol/dine';
import visit from './wol/visit';
import contact from './wol/contact';
import gallery from './wol/gallery';
import photos from './wol/photos';
import immersive from './wol/immersive';

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
  ...shared,
  ...home,
  ...about,
  ...discover,
  ...heritage,
  ...experiences,
  ...events,
  ...vip,
  ...stay,
  ...dine,
  ...visit,
  ...contact,
  ...gallery,
  ...photos,
  ...immersive,
};
