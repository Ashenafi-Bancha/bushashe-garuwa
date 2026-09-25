import { useCallback, useEffect, useMemo, useState } from 'react';
import { am } from '../../i18n/dictionaries/am';
import { en } from '../../i18n/dictionaries/en';
import { wal } from '../../i18n/dictionaries/wal';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { ContentEntry } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { EDITABLE_GROUPS, valueAtPath, type EditableField } from '../content/editableFields';
import { Notice, Panel } from '../components/ui';

type Lang = 'en' | 'am' | 'wal';
const LANGS: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'wal', name: 'Wolayttatto doonaa' },
];
const builtIn: Record<Lang, unknown> = { en, am, wal };

const field = 'w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]';

/** Editing the words on the website, one page at a time, in each language. */
export default function ContentView() {
  const { key } = useAdminSession();
  const [lang, setLang] = useState<Lang>('en');
  const [groupId, setGroupId] = useState(EDITABLE_GROUPS[0]!.id);
  const [saved, setSaved] = useState<ContentEntry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const group = EDITABLE_GROUPS.find((g) => g.id === groupId) ?? EDITABLE_GROUPS[0]!;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSaved((await adminApi.content(key)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the saved text');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** What is stored for a field right now: the staff edit if there is one */
  const savedValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of saved) map.set(`${entry.key}|${entry.lang}`, entry.value);
    return map;
  }, [saved]);

  const langOf = (f: EditableField) => (f.shared ? '*' : lang);
  const draftKey = (f: EditableField) => `${f.path}|${langOf(f)}`;
  const current = (f: EditableField) => drafts[draftKey(f)] ?? savedValue.get(draftKey(f)) ?? '';
  const original = (f: EditableField) => valueAtPath(builtIn[f.shared ? 'en' : lang], f.path);
  const changed = Object.keys(drafts).length > 0;

  const save = async () => {
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const entries = Object.entries(drafts).map(([composite, value]) => {
        const [path, entryLang] = composite.split('|');
        return { key: path as string, lang: entryLang as string, value };
      });
      await adminApi.saveContent(key, entries);
      setDrafts({});
      await refresh();
      setStatus('Saved. The website shows the new words within a minute.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
              lang === l.code ? 'bg-[#173F35] text-white border-[#173F35]' : 'border-[#173F35]/15 text-[#173F35]/70 hover:border-[#173F35]/50'
            }`}
          >
            {l.name}
          </button>
        ))}
        <button type="button" onClick={refresh} className="admin-btn-quiet ml-auto">Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EDITABLE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroupId(g.id)}
            aria-pressed={g.id === groupId}
            className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
              g.id === groupId ? 'bg-[#C99A45] text-[#173F35] border-[#C99A45]' : 'border-[#173F35]/15 text-[#173F35]/60 hover:border-[#173F35]/40'
            }`}
          >
            {g.title}
          </button>
        ))}
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {status && <Notice>{status}</Notice>}
      {loading && <Notice>Loading the website text…</Notice>}

      <Panel>
        <div className="mb-5">
          <h2 className="font-display text-2xl text-[#0e2820]">{group.title}</h2>
          <p className="text-[#1D211E]/50 text-sm mt-1">
            {group.note ?? 'Leave a box empty to go back to the words built into the website.'}
          </p>
        </div>

        <div className="space-y-6">
          {group.fields.map((f) => {
            const builtInText = original(f);
            const value = current(f);
            const isEdited = savedValue.has(draftKey(f)) || drafts[draftKey(f)] !== undefined;
            return (
              <div key={f.path}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <label htmlFor={`f-${f.path}`} className="text-xs font-semibold text-[#173F35]/70 tracking-wider uppercase">
                    {f.label}
                    {f.shared && <span className="text-[#1D211E]/35 normal-case tracking-normal"> · all languages</span>}
                  </label>
                  {isEdited && <span className="text-[#C99A45] text-[11px] font-semibold uppercase tracking-wider">Edited</span>}
                </div>
                {f.multiline ? (
                  <textarea
                    id={`f-${f.path}`}
                    rows={3}
                    value={value}
                    placeholder={builtInText}
                    onChange={(e) => setDrafts({ ...drafts, [draftKey(f)]: e.target.value })}
                    className={`${field} resize-y`}
                  />
                ) : (
                  <input
                    id={`f-${f.path}`}
                    type="text"
                    value={value}
                    placeholder={builtInText}
                    onChange={(e) => setDrafts({ ...drafts, [draftKey(f)]: e.target.value })}
                    className={field}
                  />
                )}
                {builtInText && <p className="text-[#1D211E]/40 text-xs mt-1.5">Built in: {builtInText}</p>}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-[#173F35]/10">
          <button
            type="button"
            onClick={save}
            disabled={!changed || saving}
            className="rounded-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-semibold text-sm px-7 py-3 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {changed && (
            <button type="button" onClick={() => setDrafts({})} className="admin-btn-quiet">
              Undo my changes
            </button>
          )}
        </div>
      </Panel>
    </div>
  );
}
