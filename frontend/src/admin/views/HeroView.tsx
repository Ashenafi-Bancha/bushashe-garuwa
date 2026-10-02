import { useState } from 'react';
import { photos } from '../../assets/photos';
import { en } from '../../i18n/dictionaries/en';
import { HERO_SLOTS, SLIDE_SLOTS, type HeroSlot } from '../../lib/heroSlots';
import { mediaUrl } from '../../lib/media';
import type { MediaImage } from '../api/types';
import PhotoForm, { type PhotoFormValues } from '../components/PhotoForm';
import { Icon } from '../components/icons';
import { Notice } from '../components/ui';
import { useMediaLibrary } from '../media/useMediaLibrary';

const TAG = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold';
const SLOTS = Object.keys(HERO_SLOTS) as HeroSlot[];

type Editing = { slot: HeroSlot; photo?: MediaImage };

/** The photograph that opens each page: the built-in one, or the staff's own in its place. */
export default function HeroView() {
  const library = useMediaLibrary();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [status, setStatus] = useState('');

  const inSlot = (slot: HeroSlot) => library.items.filter((item) => item.kind === 'hero' && item.slot === slot);

  const save = async ({ image, details }: PhotoFormValues) => {
    if (!editing) return;
    const page = HERO_SLOTS[editing.slot].label;
    if (editing.photo) {
      await library.save(editing.photo.id, details);
      setStatus(`Saved. The ${page} page shows the change within a minute.`);
    } else {
      if (!image) return;
      await library.add({ kind: 'hero', slot: editing.slot }, image, details);
      setStatus(`Photo saved. The ${page} page shows it within a minute.`);
    }
    setEditing(null);
  };

  const remove = (slot: HeroSlot, photo: MediaImage) => {
    const slides = SLIDE_SLOTS.includes(slot);
    const question = slides
      ? `Remove the slide "${photo.translations.en.title || 'without a heading'}"? This cannot be undone.`
      : `Go back to the built-in photo on the ${HERO_SLOTS[slot].label} page? Your photo is removed, and this cannot be undone.`;
    if (!confirm(question)) return;
    setStatus('');
    void library.remove(photo.id);
  };

  if (editing) {
    const { label } = HERO_SLOTS[editing.slot];
    const slides = SLIDE_SLOTS.includes(editing.slot);
    return (
      <PhotoForm
        heading={editing.photo ? `Edit the photo: ${label}` : slides ? `Add a slide: ${label} page` : `Change the photo: ${label} page`}
        lead={
          slides
            ? 'The heading is shown on the photo as it passes. The description tells screen readers and search engines what it shows.'
            : 'The heading is shown on the photo. The description tells screen readers and search engines what it shows.'
        }
        currentSrc={editing.photo ? mediaUrl(editing.photo.id) : undefined}
        initial={editing.photo ? { ...editing.photo, published: true } : undefined}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const start = (slot: HeroSlot, photo?: MediaImage) => {
    setStatus('');
    setEditing({ slot, photo });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[#1E3A29]/60 text-sm max-w-2xl">
          Each page opens with one large photograph. Put your own in its place, with a heading, or go back to the built-in one at any time.
        </p>
        <button type="button" onClick={library.refresh} className="inline-flex admin-btn-quiet ml-auto">
          <Icon name="refresh" className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {library.error && <Notice kind="error">{library.error}</Notice>}
      {status && <Notice kind="success">{status}</Notice>}
      {library.loading && library.items.length === 0 && <Notice>Loading the photos…</Notice>}

      <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SLOTS.map((slot) => {
          const { label, path, photos: builtIn } = HERO_SLOTS[slot];
          const mine = inSlot(slot);
          const live = mine.filter((photo) => photo.published);
          const unfinished = mine.filter((photo) => !photo.published);
          const slides = SLIDE_SLOTS.includes(slot);

          return (
            <li
              key={slot}
              className={`rounded-2xl bg-white border border-[#1E3A29]/8 overflow-hidden flex flex-col ${slides ? 'sm:col-span-2 xl:col-span-3' : ''}`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-4">
                <h2 className="font-display text-lg text-[#1E3A29] leading-tight">{label}</h2>
                <span className={`${TAG} ${live.length ? 'bg-[#0E8A50]/12 text-[#0B6E40]' : 'bg-[#1E3A29]/8 text-[#1E3A29]/60'}`}>
                  {live.length ? (slides ? `${live.length} of your slides` : 'Your photo') : slides ? `${builtIn.length} built-in slides` : 'Built-in photo'}
                </span>
                <a href={path} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A29]/50 hover:text-[#0E8A50]">
                  See the page
                  <Icon name="external" className="w-3.5 h-3.5" />
                </a>
              </div>

              {slides ? (
                // the home page turns through its photos
                <div className="p-4">
                  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {live.length > 0
                      ? live.map((photo) => (
                          <li key={photo.id} className="rounded-xl overflow-hidden border border-[#1E3A29]/8">
                            <img src={mediaUrl(photo.id)} alt="" loading="lazy" className="w-full aspect-[3/2] object-cover" />
                            <div className="p-2.5">
                              <div className="text-[13px] font-semibold text-[#1E3A29] leading-tight line-clamp-2">{photo.translations.en.title}</div>
                              <div className="flex gap-1.5 mt-2">
                                <button type="button" onClick={() => start(slot, photo)} className="inline-flex admin-btn-quiet !px-2.5 !py-1.5" aria-label="Edit the slide">
                                  <Icon name="pencil" className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={library.busyId === photo.id}
                                  onClick={() => remove(slot, photo)}
                                  className="inline-flex admin-btn-quiet danger !px-2.5 !py-1.5"
                                  aria-label="Remove the slide"
                                >
                                  <Icon name="trash" className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      : builtIn.map(({ key }) => (
                          <li key={key} className="rounded-xl overflow-hidden border border-[#1E3A29]/8">
                            <img src={photos[key]} alt="" loading="lazy" className="w-full aspect-[3/2] object-cover" />
                            <div className="p-2.5 text-[13px] font-semibold text-[#1E3A29]/70 leading-tight line-clamp-2">{en.photoCaptions[key].title}</div>
                          </li>
                        ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button type="button" onClick={() => start(slot)} className="inline-flex admin-btn">
                      <Icon name="plus" className="w-4 h-4" />
                      Add a slide
                    </button>
                    <span className="text-[#1E3A29]/50 text-xs">
                      {live.length ? 'Remove all of your slides to go back to the built-in ones.' : 'Your first slide takes the place of the built-in ones.'}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative m-4 mb-0 rounded-xl overflow-hidden bg-[#1E3A29]/8">
                    <img
                      src={live[0] ? mediaUrl(live[0].id) : photos[builtIn[0]!.key]}
                      alt=""
                      loading="lazy"
                      className={`w-full aspect-[3/2] object-cover ${live[0] ? 'object-center' : builtIn[0]!.pos}`}
                    />
                    <span className="absolute right-2.5 bottom-2.5 max-w-[80%] truncate rounded-full bg-white/90 px-3 py-1.5 text-[#1E3A29] text-xs font-semibold">
                      {live[0] ? live[0].translations.en.title : en.photoCaptions[builtIn[0]!.key].title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 mt-auto">
                    <button type="button" onClick={() => start(slot)} className="inline-flex admin-btn-quiet">
                      <Icon name="upload" className="w-3.5 h-3.5" />
                      Change photo
                    </button>
                    {live[0] && (
                      <>
                        <button type="button" onClick={() => start(slot, live[0])} className="inline-flex admin-btn-quiet">
                          <Icon name="pencil" className="w-3.5 h-3.5" />
                          Edit heading
                        </button>
                        <button
                          type="button"
                          disabled={library.busyId === live[0].id}
                          onClick={() => remove(slot, live[0]!)}
                          className="inline-flex admin-btn-quiet danger"
                        >
                          Use built-in
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* a photo that was sent but never given its heading */}
              {unfinished.map((photo) => (
                <div key={photo.id} className="flex flex-wrap items-center gap-2 border-t border-[#1E3A29]/8 bg-[#C4622D]/6 px-4 py-3">
                  <img src={mediaUrl(photo.id)} alt="" loading="lazy" className="w-12 h-9 rounded-md object-cover" />
                  <span className="text-xs text-[#8c4227] font-semibold flex-1 min-w-[8rem]">Not on the website yet: it needs a heading.</span>
                  <button type="button" onClick={() => start(slot, photo)} className="inline-flex admin-btn-quiet !py-1.5">
                    Finish
                  </button>
                  <button type="button" disabled={library.busyId === photo.id} onClick={() => void library.remove(photo.id)} className="inline-flex admin-btn-quiet danger !py-1.5">
                    Remove
                  </button>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
