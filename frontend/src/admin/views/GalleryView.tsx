import { useState } from 'react';
import { photos, type PhotoKey } from '../../assets/photos';
import { en } from '../../i18n/dictionaries/en';
import { mediaUrl } from '../../lib/media';
import { GALLERY_CATEGORY_LABELS, type MediaImage } from '../api/types';
import PhotoForm, { type PhotoFormValues } from '../components/PhotoForm';
import { Icon } from '../components/icons';
import { Notice } from '../components/ui';
import { formatSize } from '../media/prepareImage';
import { useMediaLibrary } from '../media/useMediaLibrary';

const TAG = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold';

/** The Gallery page's photos: the ones staff added, and the ones built into the website. */
export default function GalleryView() {
  const library = useMediaLibrary();
  const [editing, setEditing] = useState<MediaImage | 'new' | null>(null);
  const [status, setStatus] = useState('');

  const added = library.items.filter((item) => item.kind === 'gallery');
  const builtIn = Object.keys(photos) as PhotoKey[];

  const save = async ({ image, details }: PhotoFormValues) => {
    if (editing === 'new') {
      if (!image) return;
      await library.add({ kind: 'gallery', category: details.category ?? 'grounds' }, image, details);
      setStatus(details.published ? 'Photo added. It shows in the gallery within a minute.' : 'Photo saved. It is hidden from the website for now.');
    } else if (editing) {
      await library.save(editing.id, details);
      setStatus('Saved. The website shows the change within a minute.');
    }
    setEditing(null);
  };

  const remove = (photo: MediaImage) => {
    if (!confirm(`Delete "${photo.translations.en.title || 'this photo'}" from the gallery? This cannot be undone.`)) return;
    setStatus('');
    void library.remove(photo.id);
  };

  if (editing) {
    return (
      <PhotoForm
        heading={editing === 'new' ? 'Add a photo to the gallery' : 'Edit the photo'}
        lead="The heading and the description are shown with the photo on the Gallery page."
        currentSrc={editing === 'new' ? undefined : mediaUrl(editing.id)}
        initial={editing === 'new' ? undefined : editing}
        withCategory
        withVisibility
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStatus('');
              setEditing('new');
            }}
            className="inline-flex admin-btn"
          >
            <Icon name="plus" className="w-4 h-4" />
            Add a photo
          </button>
          <button type="button" onClick={library.refresh} aria-label="Refresh" title="Refresh" className="admin-icon-btn bordered !w-10 !h-10">
            <Icon name="refresh" className="w-4 h-4" />
          </button>
          <span className="ml-auto text-[var(--a-muted)] text-[13px]">
            {added.length} added, {builtIn.length} built in
          </span>
        </div>

        {library.error && <Notice kind="error">{library.error}</Notice>}
        {status && <Notice kind="success">{status}</Notice>}
        {library.loading && added.length === 0 && <Notice>Loading the photos…</Notice>}

        {!library.loading && added.length === 0 && !library.error && (
          <div className="rounded-2xl border border-dashed border-[#D6D2C6] bg-white px-6 py-10 text-center">
            <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-[var(--a-brand-soft)] text-[var(--a-brand)] mb-4">
              <Icon name="gallery" className="w-6 h-6" />
            </span>
            <h2 className="font-display text-xl text-[var(--a-ink)]">No photos added yet</h2>
            <p className="text-[var(--a-muted)] text-sm mt-1 max-w-sm mx-auto">
              Add a photo with a heading and a description, and it joins the Gallery page after the built-in photos.
            </p>
          </div>
        )}

        {added.length > 0 && (
          <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {added.map((photo) => (
              <li key={photo.id} className="admin-card !p-0 overflow-hidden flex flex-col">
                <div className="relative aspect-[3/2] bg-[#1E3A29]/8">
                  <img src={mediaUrl(photo.id)} alt="" loading="lazy" className={`w-full h-full object-cover ${photo.published ? '' : 'opacity-50'}`} />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className={`${TAG} bg-white/90 text-[var(--a-ink)]`}>{GALLERY_CATEGORY_LABELS[photo.category ?? 'grounds']}</span>
                    {!photo.published && (
                      <span className={`${TAG} bg-[#C4622D] text-white`}>
                        <Icon name="eyeOff" className="w-3 h-3" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display text-lg text-[var(--a-ink)] leading-tight">
                    {photo.translations.en.title || <span className="text-[#C4622D]">No heading yet</span>}
                  </h3>
                  {photo.translations.en.desc && <p className="text-[var(--a-muted)] text-sm mt-1 line-clamp-2">{photo.translations.en.desc}</p>}
                  <p className="text-[var(--a-faint)] text-xs mt-2">
                    {photo.width && photo.height ? `${photo.width} × ${photo.height}, ` : ''}
                    {formatSize(photo.size)}
                    {photo.translations.am?.title ? ', አማርኛ' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--a-border)]">
                    <button type="button" onClick={() => setEditing(photo)} className="inline-flex admin-btn-quiet">
                      <Icon name="pencil" className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={library.busyId === photo.id || (!photo.published && !photo.translations.en.title)}
                      onClick={() => library.setPublished(photo, !photo.published)}
                      className="inline-flex admin-btn-quiet"
                    >
                      <Icon name={photo.published ? 'eyeOff' : 'eye'} className="w-3.5 h-3.5" />
                      {photo.published ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" disabled={library.busyId === photo.id} onClick={() => remove(photo)} className="inline-flex admin-btn-quiet danger ml-auto">
                      <Icon name="trash" className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section>
        <h2 className="admin-h3">Built into the website</h2>
        <p className="text-[var(--a-muted)] text-sm mt-1 mb-4">
          These photos are part of the website itself and always open the gallery. Your photos follow them.
        </p>
        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {builtIn.map((key) => (
            <li key={key} className="relative aspect-square rounded-xl overflow-hidden bg-[#1E3A29]/8" title={en.photoCaptions[key].title}>
              <img src={photos[key]} alt={en.photoCaptions[key].title} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-white text-[11px] font-semibold leading-tight line-clamp-2">
                {en.photoCaptions[key].title}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
