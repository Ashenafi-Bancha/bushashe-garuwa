/**
 * Can this device draw the 3D scenes smoothly?
 *
 *   none  no 3D: the photographs are shown instead (older or low-memory phones,
 *         data-saver mode, "reduce motion" switched on, no graphics support)
 *   low   3D with fewer trees and a lower resolution (phones and tablets)
 *   high  the full scene (computers)
 *
 * For testing, add ?3d=none, ?3d=low or ?3d=high to the address.
 */
export type Tier = 'none' | 'low' | 'high';

const SLOW_KEY = 'bg-3d-slow';

type Hints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** A choice forced from the address bar, if any */
export function forcedTier(): Tier | null {
  const asked = new URLSearchParams(window.location.search).get('3d');
  return asked === 'none' || asked === 'low' || asked === 'high' ? asked : null;
}

/** True when the graphics card (not slow software drawing) can run WebGL */
function hasFastGraphics(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const options = { failIfMajorPerformanceCaveat: true };
    const gl = canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options);
    if (!gl) return false;
    const context = gl as WebGLRenderingContext;
    const names = context.getExtension('WEBGL_debug_renderer_info');
    const renderer = names ? String(context.getParameter(names.UNMASKED_RENDERER_WEBGL)) : '';
    context.getExtension('WEBGL_lose_context')?.loseContext();
    // drawing done by the processor instead of a graphics chip is far too slow
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export function deviceTier(): Tier {
  const forced = forcedTier();
  if (forced) return forced;

  const device = navigator as Hints;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';
  if (device.connection?.saveData) return 'none';
  try {
    if (sessionStorage.getItem(SLOW_KEY)) return 'none';
  } catch {
    /* private windows may refuse storage; carry on */
  }
  const memory = device.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2)) return 'none';
  if (!hasFastGraphics()) return 'none';

  const handheld = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
  if (handheld || (memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4)) return 'low';
  return 'high';
}

/** The scene ran too slowly here: show photographs for the rest of this visit */
export function rememberSlow(): void {
  try {
    sessionStorage.setItem(SLOW_KEY, '1');
  } catch {
    /* nothing to do */
  }
}
