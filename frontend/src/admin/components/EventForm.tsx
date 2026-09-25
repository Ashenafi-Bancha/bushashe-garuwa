import { useState } from 'react';
import { ApiError } from '../../lib/api';
import type { SaveEventInput } from '../api/types';
import { Notice, Panel } from './ui';

const CATEGORIES: SaveEventInput['category'][] = ['food', 'culture', 'education', 'music', 'community'];
const AVAILABILITY: SaveEventInput['availability'][] = ['open', 'limited', 'full'];

/** A new event, ready to fill in: the cultural food evening is the usual one */
export const emptyEvent = (): SaveEventInput => ({
  date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
  time: '17:00 – 21:00',
  category: 'food',
  availability: 'open',
  featured: true,
  published: true,
  photo: 'food',
  partner: 'Lidya Cultural Food',
  bookable: true,
  capacity: 40,
  translations: { en: { name: '', desc: '' }, am: { name: '', desc: '' }, wal: { name: '', desc: '' } },
});

const field = 'w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]';
const label = 'block text-xs font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2';

/** Add or change one event, with its words in each language. */
export default function EventForm({
  initial,
  heading,
  onSave,
  onCancel,
}: {
  initial: SaveEventInput;
  heading: string;
  onSave: (values: SaveEventInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<SaveEventInput>(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (change: Partial<SaveEventInput>) => setValues((current) => ({ ...current, ...change }));
  const setText = (lang: 'en' | 'am' | 'wal', part: 'name' | 'desc', value: string) =>
    setValues((current) => ({
      ...current,
      translations: { ...current.translations, [lang]: { ...current.translations[lang], [part]: value } },
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(values);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the event');
      setSaving(false);
    }
  };

  return (
    <Panel>
      <form onSubmit={submit} className="space-y-6">
        <h2 className="font-display text-2xl text-[#0e2820]">{heading}</h2>
        {error && <Notice kind="error">{error}</Notice>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={label} htmlFor="event-date">Date</label>
            <input id="event-date" type="date" required value={values.date} onChange={(e) => set({ date: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="event-time">Time</label>
            <input id="event-time" type="text" value={values.time ?? ''} onChange={(e) => set({ time: e.target.value })} className={field} placeholder="17:00 – 21:00" />
          </div>
          <div>
            <label className={label} htmlFor="event-category">Kind of event</label>
            <select id="event-category" value={values.category} onChange={(e) => set({ category: e.target.value as SaveEventInput['category'] })} className={field}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="event-availability">Places</label>
            <select id="event-availability" value={values.availability} onChange={(e) => set({ availability: e.target.value as SaveEventInput['availability'] })} className={field}>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>{a === 'open' ? 'Places available' : a === 'limited' ? 'Limited places' : 'Fully booked'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label} htmlFor="event-partner">Partner (optional)</label>
            <input id="event-partner" type="text" value={values.partner ?? ''} onChange={(e) => set({ partner: e.target.value })} className={field} placeholder="Lidya Cultural Food" />
          </div>
          <div>
            <label className={label} htmlFor="event-capacity">How many guests fit</label>
            <input
              id="event-capacity"
              type="number"
              min={1}
              max={5000}
              value={values.capacity ?? ''}
              onChange={(e) => set({ capacity: e.target.value === '' ? null : Number(e.target.value) })}
              className={field}
              placeholder="Leave empty for no limit"
            />
            <p className="text-[#1D211E]/45 text-xs mt-1.5">
              The website counts the places left and stops taking bookings when the event is full.
            </p>
          </div>
          <div>
            <label className={label} htmlFor="event-photo">Photo</label>
            <select id="event-photo" value={values.photo ?? ''} onChange={(e) => set({ photo: e.target.value || null })} className={field}>
              <option value="">No photo</option>
              {['food', 'home', 'house', 'pavilions', 'gardens', 'lawn', 'gifaataa1', 'gifaataa2', 'gifaataa3', 'enset', 'zigba'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          {([
            ['published', 'Show on the website'],
            ['featured', 'Show on the home page'],
            ['bookable', 'People can reserve a place'],
          ] as const).map(([name, text]) => (
            <label key={name} className="inline-flex items-center gap-2 text-sm text-[#173F35] cursor-pointer">
              <input type="checkbox" checked={values[name]} onChange={(e) => set({ [name]: e.target.checked })} className="w-4 h-4 accent-[#173F35]" />
              {text}
            </label>
          ))}
        </div>

        <div className="space-y-5">
          {(['en', 'am', 'wal'] as const).map((lang) => (
            <div key={lang} className="rounded-2xl border border-[#173F35]/10 p-4">
              <div className="text-[#C99A45] text-[11px] font-semibold tracking-[0.16em] uppercase mb-3">
                {lang === 'en' ? 'English (required)' : lang === 'am' ? 'Amharic' : 'Wolayttatto doonaa'}
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  required={lang === 'en'}
                  value={values.translations[lang]?.name ?? ''}
                  onChange={(e) => setText(lang, 'name', e.target.value)}
                  className={field}
                  placeholder="Name of the event"
                />
                <textarea
                  rows={2}
                  value={values.translations[lang]?.desc ?? ''}
                  onChange={(e) => setText(lang, 'desc', e.target.value)}
                  className={`${field} resize-none`}
                  placeholder="Short description"
                />
              </div>
            </div>
          ))}
          <p className="text-[#1D211E]/45 text-xs">Left empty, Amharic and Wolaytta show the English words.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-semibold text-sm px-7 py-3 transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save event'}
          </button>
          <button type="button" onClick={onCancel} className="admin-btn-quiet">Cancel</button>
        </div>
      </form>
    </Panel>
  );
}
