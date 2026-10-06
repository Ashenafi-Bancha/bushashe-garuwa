import { useEffect, useRef, useState } from 'react';
import { ApiError } from '../../lib/api';
import { GALLERY_CATEGORY_LABELS, type GalleryCategory, type MediaLang, type MediaTranslations, type SaveMediaInput } from '../api/types';
import { formatSize, prepareImage, type PreparedImage } from '../media/prepareImage';
import { Icon } from './icons';
import { Notice, Panel } from './ui';

const LANGS: { code: MediaLang; name: string; note?: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ', note: 'Left empty, visitors reading Amharic see the English words.' },
  { code: 'wol', name: 'Wolayttatto doonaa', note: 'Left empty, visitors reading Wolaytta see the English words.' },
];

const LABEL = 'block text-xs font-bold text-[#1E3A29]/65 tracking-wider uppercase mb-2';

export type PhotoFormValues = {
  /** the new photograph; left out when only the words of an existing photo change */
  image?: PreparedImage;
  details: SaveMediaInput;
};

/**
 * Add a photo, or change the words of one: the photograph, its heading and
 * description in each language and, for the gallery, its category.
 */
export default function PhotoForm({
  heading,
  lead,
  currentSrc,
  initial,
  withCategory = false,
  withVisibility = false,
  onSave,
  onCancel,
}: {
  heading: string;
  lead?: string;
  /** the photo being edited; when set, no new file is needed */
  currentSrc?: string;
  initial?: { translations: MediaTranslations; category?: GalleryCategory | null; published: boolean };
  /** gallery photos are listed under a category */
  withCategory?: boolean;
  /** lets staff keep a photo hidden from the website */
  withVisibility?: boolean;
  onSave: (values: PhotoFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lang, setLang] = useState<MediaLang>('en');
  const [translations, setTranslations] = useState<Required<MediaTranslations>>({
    en: { title: initial?.translations.en.title ?? '', desc: initial?.translations.en.desc ?? '' },
    am: { title: initial?.translations.am?.title ?? '', desc: initial?.translations.am?.desc ?? '' },
    wol: { title: initial?.translations.wol?.title ?? '', desc: initial?.translations.wol?.desc ?? '' },
  });
  const [category, setCategory] = useState<GalleryCategory>(initial?.category ?? 'grounds');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // the preview holds memory until it is let go
  useEffect(() => () => void (image && URL.revokeObjectURL(image.previewUrl)), [image]);

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setPreparing(true);
    setError('');
    try {
      setImage(await prepareImage(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPreparing(false);
    }
  };

  const setText = (part: 'title' | 'desc', value: string) =>
    setTranslations((current) => ({ ...current, [lang]: { ...current[lang], [part]: value } }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image && !currentSrc) return setError('Choose a photo first.');
    if (published && !translations.en.title.trim()) {
      setLang('en');
      return setError('Give the photo a heading in English.');
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ image: image ?? undefined, details: { translations, category: withCategory ? category : undefined, published } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the photo');
      setSaving(false);
    }
  };

  const shown = image?.previewUrl ?? currentSrc;
  const note = LANGS.find((l) => l.code === lang)?.note;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <button type="button" onClick={onCancel} className="inline-flex admin-btn-quiet">
        <Icon name="arrowLeft" className="w-4 h-4" />
        Back
      </button>

      <Panel>
        <div className="mb-6">
          <h2 className="font-display text-2xl text-[#1E3A29]">{heading}</h2>
          {lead && <p className="text-[#1E3A29]/55 text-sm mt-1">{lead}</p>}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 lg:gap-8">
          {/* the photograph */}
          <div>
            <span className={LABEL}>Photo</span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                void choose(e.dataTransfer.files[0]);
              }}
              className={`relative rounded-2xl border-2 border-dashed overflow-hidden transition-colors ${
                dragging ? 'border-[#0E8A50] bg-[#0E8A50]/8' : 'border-[#1E3A29]/18 bg-[#F4EFE4]/60'
              }`}
            >
              {shown ? (
                <img src={shown} alt="" className="w-full aspect-[3/2] object-cover" />
              ) : (
                <button
                  type="button"
                  onClick={() => input.current?.click()}
                  className="w-full aspect-[3/2] flex flex-col items-center justify-center gap-3 text-center px-6 text-[#1E3A29]/60 hover:text-[#0E8A50]"
                >
                  <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white text-[#0E8A50] elev-1">
                    <Icon name="upload" className="w-6 h-6" />
                  </span>
                  <span className="font-semibold text-[#1E3A29]">{preparing ? 'Preparing the photo…' : 'Choose a photo'}</span>
                  <span className="text-xs">or drop it here. JPEG, PNG or WebP.</span>
                </button>
              )}
            </div>

            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                void choose(e.target.files?.[0]);
                e.target.value = '';
              }}
            />

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {image && (
                <button type="button" onClick={() => input.current?.click()} disabled={preparing} className="inline-flex admin-btn-quiet">
                  <Icon name="upload" className="w-4 h-4" />
                  {preparing ? 'Preparing…' : 'Choose another'}
                </button>
              )}
              {image && (
                <span className="text-[#1E3A29]/50 text-xs">
                  {image.width} × {image.height} pixels, {formatSize(image.blob.size)}
                </span>
              )}
            </div>
            {!currentSrc && (
              <p className="text-[#1E3A29]/45 text-xs mt-3 leading-relaxed">
                Wide photos work best. Large photos are made smaller before they are sent, so any size from a phone or a camera is fine.
              </p>
            )}
          </div>

          {/* its words */}
          <div className="space-y-5">
            <div>
              <span className={LABEL}>Language</span>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => {
                  const filled = translations[l.code].title.trim() !== '';
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      aria-pressed={lang === l.code}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                        lang === l.code ? 'bg-[#1E3A29] text-white border-[#1E3A29]' : 'border-[#1E3A29]/15 text-[#1E3A29]/70 hover:border-[#1E3A29]/50'
                      }`}
                    >
                      {l.name}
                      {filled && <Icon name="check" className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
              {note && <p className="text-[#1E3A29]/45 text-xs mt-2">{note}</p>}
            </div>

            <div>
              <label htmlFor="photo-title" className={LABEL}>
                Heading
              </label>
              <input
                id="photo-title"
                type="text"
                maxLength={120}
                value={translations[lang].title}
                onChange={(e) => setText('title', e.target.value)}
                placeholder={lang === 'en' ? 'The Main Gate' : translations.en.title}
                className="admin-field"
              />
            </div>

            <div>
              <label htmlFor="photo-desc" className={LABEL}>
                Description
              </label>
              <textarea
                id="photo-desc"
                rows={4}
                maxLength={600}
                value={translations[lang].desc}
                onChange={(e) => setText('desc', e.target.value)}
                placeholder={lang === 'en' ? 'One or two sentences about what the photo shows.' : translations.en.desc}
                className="admin-field resize-y"
              />
            </div>

            {withCategory && (
              <div>
                <label htmlFor="photo-category" className={LABEL}>
                  Category
                </label>
                <select id="photo-category" value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className="admin-field">
                  {(Object.keys(GALLERY_CATEGORY_LABELS) as GalleryCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {GALLERY_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {withVisibility && (
              <label className="flex items-start gap-3 rounded-xl bg-[#F4EFE4]/70 px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#0E8A50]" />
                <span>
                  <span className="block text-sm font-semibold text-[#1E3A29]">Show on the website</span>
                  <span className="block text-xs text-[#1E3A29]/55 mt-0.5">Untick to keep the photo here without showing it to visitors.</span>
                </span>
              </label>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <Notice kind="error">{error}</Notice>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-[#1E3A29]/10">
          <button type="submit" disabled={saving || preparing} className="inline-flex admin-btn">
            <Icon name="check" className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save photo'}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="inline-flex admin-btn-quiet">
            Cancel
          </button>
        </div>
      </Panel>
    </form>
  );
}
