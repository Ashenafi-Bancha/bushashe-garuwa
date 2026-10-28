import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Review, SaveReviewInput } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
import { Icon } from '../components/icons';
import Sheet from '../components/Sheet';
import { IconActions, ListSkeleton, Notice, Segmented } from '../components/ui';

type Lang = 'en' | 'am' | 'wol';
const LANGS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'am', label: 'Amharic' },
  { value: 'wol', label: 'Wolaytta' },
];
const EMPTY: SaveReviewInput = { name: '', origin: '', words: { en: '', am: '', wol: '' }, rating: 5, published: true };

/** One to five stars, to show or to choose */
function Stars({ value, onChange, size = 'w-4 h-4' }: { value: number | null; onChange?: (value: number | null) => void; size?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={value ? `${value} of 5 stars` : 'No stars'}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button key={n} type="button" onClick={() => onChange(value === n ? null : n)} aria-label={`${n} stars`} className="p-1 -m-0.5 active:scale-90 transition-transform">
            <Icon name={value !== null && n <= value ? 'starFilled' : 'star'} className={`${size} ${value !== null && n <= value ? 'text-[#E8A21A]' : 'text-[#1E3A29]/25'}`} />
          </button>
        ) : (
          <Icon key={n} name={value !== null && n <= value ? 'starFilled' : 'star'} className={`${size} ${value !== null && n <= value ? 'text-[#E8A21A]' : 'text-[#1E3A29]/20'}`} />
        ),
      )}
    </span>
  );
}

/** Guests' reviews: what shows in "What Our Guests Say" on the home page. */
export default function ReviewsView() {
  const { token } = useAdminSession();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<{ id: number | null; draft: SaveReviewInput } | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [busy, setBusy] = useState(false);
  const [sheetError, setSheetError] = useState('');

  const load = useCallback(async () => {
    try {
      setReviews((await adminApi.reviews(token)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the reviews');
    }
  }, [token]);
  useEffect(() => void load(), [load]);

  const open = (review?: Review) => {
    setLang('en');
    setSheetError('');
    setEditing(
      review
        ? { id: review.id, draft: { name: review.name, origin: review.origin ?? '', words: { en: review.words.en, am: review.words.am ?? '', wol: review.words.wol ?? '' }, rating: review.rating, published: review.published } }
        : { id: null, draft: EMPTY },
    );
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.draft.words.en.trim()) {
      setLang('en');
      return setSheetError('Write the guest\'s words in English (the other languages are optional).');
    }
    setBusy(true);
    setSheetError('');
    try {
      if (editing.id === null) await adminApi.addReview(token, editing.draft);
      else await adminApi.updateReview(token, editing.id, editing.draft);
      setEditing(null);
      await load();
    } catch (err) {
      setSheetError(err instanceof ApiError ? err.message : 'Could not save the review');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (review: Review) => {
    try {
      await adminApi.updateReview(token, review.id, {
        name: review.name,
        origin: review.origin ?? '',
        words: { en: review.words.en, am: review.words.am ?? '', wol: review.words.wol ?? '' },
        rating: review.rating,
        published: !review.published,
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the review');
    }
  };

  const remove = async (review: Review) => {
    if (!confirm(`Remove the review from ${review.name}?`)) return;
    try {
      await adminApi.deleteReview(token, review.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not remove the review');
    }
  };

  const shown = reviews?.filter((r) => r.published).length ?? 0;
  const draft = editing?.draft;
  const setDraft = (next: Partial<SaveReviewInput>) => editing && setEditing({ ...editing, draft: { ...editing.draft, ...next } });

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="admin-card flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#E8A21A]/15 text-[#B07A0E] flex-shrink-0">
          <Icon name="quote" />
        </span>
        <p className="flex-1 text-sm text-[var(--a-muted)] leading-relaxed">
          Add what guests said, with their permission. Shown reviews appear in <strong className="text-[var(--a-ink)]">What Our Guests Say</strong> on the home page{reviews ? ` (${shown} shown now)` : ''}.
        </p>
        <button type="button" onClick={() => open()} className="admin-btn inline-flex items-center justify-center gap-2 flex-shrink-0">
          <Icon name="plus" className="w-4 h-4" />
          Add a review
        </button>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {!reviews && !error && <ListSkeleton rows={2} />}
      {reviews?.length === 0 && <Notice>No reviews yet. When a guest says something kind, ask if you may share it, then add it here.</Notice>}

      {reviews && reviews.length > 0 && (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className={`admin-card !p-4 sm:!p-5 ${review.published ? '' : 'opacity-70'}`}>
              <div className="flex items-start gap-3">
                <Avatar name={review.name} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[16px] text-[var(--a-ink)] leading-tight truncate">{review.name}</h3>
                  <div className="text-[13px] text-[var(--a-muted)] truncate mt-0.5">{[review.origin, timeAgo(review.createdAt)].filter(Boolean).join(' · ')}</div>
                </div>
                <Stars value={review.rating} />
              </div>
              <blockquote className="mt-3.5 font-display text-[17px] leading-snug text-[var(--a-ink)]">“{review.words.en}”</blockquote>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {LANGS.filter((l) => review.words[l.value]).map((l) => (
                  <span key={l.value} className="rounded-full bg-[#1E3A29]/6 px-2.5 py-1 text-[11px] font-bold text-[var(--a-muted)]">{l.label}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" role="switch" checked={review.published} onChange={() => toggle(review)} className="admin-switch" />
                  <span className="text-[13px] font-bold text-[var(--a-ink)]">{review.published ? 'Shown on the website' : 'Hidden'}</span>
                </label>
                <IconActions onEdit={() => open(review)} onDelete={() => remove(review)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={editing !== null} onClose={() => setEditing(null)} title={editing?.id === null ? 'Add a review' : 'Change the review'}>
        {draft && (
          <form onSubmit={save} className="space-y-4 pb-2">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[var(--a-muted)] text-[12px] font-bold mb-1.5">Guest's name</span>
                <input required maxLength={80} value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} placeholder="e.g. Selam B." className="admin-field" />
              </label>
              <label className="block">
                <span className="block text-[var(--a-muted)] text-[12px] font-bold mb-1.5">From (optional)</span>
                <input maxLength={80} value={draft.origin} onChange={(e) => setDraft({ origin: e.target.value })} placeholder="e.g. Addis Ababa" className="admin-field" />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[var(--a-muted)] text-[12px] font-bold">Their words</span>
                <Segmented options={LANGS} value={lang} onChange={setLang} />
              </div>
              <textarea
                rows={5}
                maxLength={1200}
                value={draft.words[lang] ?? ''}
                onChange={(e) => setDraft({ words: { ...draft.words, [lang]: e.target.value } })}
                placeholder={lang === 'en' ? 'What the guest said, in English' : `Optional: the same words in ${LANGS.find((l) => l.value === lang)?.label}. Empty shows the English.`}
                className="admin-field resize-y"
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-[var(--a-border)] px-4 py-3">
              <span className="text-[13px] font-bold text-[var(--a-ink)]">Stars</span>
              <Stars value={draft.rating} onChange={(rating) => setDraft({ rating })} size="w-6 h-6" />
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl bg-white border border-[var(--a-border)] p-4 cursor-pointer">
              <span>
                <span className="block font-bold text-sm text-[var(--a-ink)]">Show on the website</span>
                <span className="block text-[12px] text-[var(--a-muted)]">Only with the guest's permission.</span>
              </span>
              <input type="checkbox" role="switch" checked={draft.published} onChange={(e) => setDraft({ published: e.target.checked })} className="admin-switch" />
            </label>

            {sheetError && <Notice kind="error">{sheetError}</Notice>}
            <button type="submit" disabled={busy} className="admin-btn w-full">
              {busy ? 'Saving…' : 'Save the review'}
            </button>
          </form>
        )}
      </Sheet>
    </div>
  );
}
