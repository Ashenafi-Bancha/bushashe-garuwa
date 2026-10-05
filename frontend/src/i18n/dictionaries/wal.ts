import type { Dictionary } from './en';
import type { DeepPartial } from '../types';
import shared from './wal/shared';
import home from './wal/home';
import about from './wal/about';
import discover from './wal/discover';
import heritage from './wal/heritage';
import experiences from './wal/experiences';
import events from './wal/events';
import vip from './wal/vip';
import stay from './wal/stay';
import dine from './wal/dine';
import visit from './wal/visit';
import contact from './wal/contact';
import gallery from './wal/gallery';
import photos from './wal/photos';
import immersive from './wal/immersive';

/**
 * WOLAYTTATTO — the Wolaytta translation, put together from one file per page
 * in the wal/ folder beside this file. Translate there, not here.
 *
 * Guide: docs/WOLAYTTA-TRANSLATION.md
 *   pnpm wolaytta        shows how far each page is and points out mistakes
 *   pnpm wolaytta:sync   brings the files up to date after the English text changes
 *
 * Any line not yet translated shows the English text. Until the translation is
 * published (WOLAYTTA_READY in src/i18n/config.ts), visitors who choose WOL see
 * a "coming soon" notice; on the local dev server the notice offers a preview.
 */
export const wal: DeepPartial<Dictionary> = {
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
