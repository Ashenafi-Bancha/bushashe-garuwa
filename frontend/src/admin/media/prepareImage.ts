/**
 * Gets a photo ready to send: straight from a phone or a camera it can be
 * 10 MB and 6000 pixels wide, far more than a web page needs. It is drawn
 * again at a sensible size and saved as a JPEG, which usually leaves a few
 * hundred kilobytes with no visible loss.
 */
export type PreparedImage = { blob: Blob; width: number; height: number; previewUrl: string };

/** Longest side, in pixels: enough for a full-screen photo on a large monitor */
const MAX_SIDE = 2400;
const QUALITY = 0.85;
/** Hosting often refuses request bodies over 1 MB, so a photo is kept under that */
const MAX_BYTES = 900 * 1024;

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) throw new Error('Choose a photo (a JPEG, PNG or WebP file).');

  let bitmap: ImageBitmap;
  try {
    // 'from-image' turns phone photos the right way up
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('This browser cannot open that photo. Save it as a JPEG or PNG and try again.');
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot prepare the photo.');

  // a very detailed photo is drawn a little smaller until it fits
  let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  let blob: Blob | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    if (!blob || blob.size <= MAX_BYTES) break;
    scale *= 0.8;
  }
  bitmap.close();
  if (!blob) throw new Error('This browser cannot prepare the photo.');

  return { blob, width: canvas.width, height: canvas.height, previewUrl: URL.createObjectURL(blob) };
}

export const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
