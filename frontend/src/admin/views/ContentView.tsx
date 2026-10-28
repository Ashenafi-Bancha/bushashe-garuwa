import { useCallback, useEffect, useMemo, useState } from 'react';
import { am } from '../../i18n/dictionaries/am';
import { en } from '../../i18n/dictionaries/en';
import { wol } from '../../i18n/dictionaries/wol';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { ContentEntry } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { EDITABLE_GROUPS, valueAtPath, type EditableField } from '../content/editableFields';
import { Notice, Panel, Segmented } from '../components/ui';

type Lang = 'en' | 'am' | 'wol';
const LANGS: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'wol', name: 'Wolaytta' },
];
const builtIn: Record<Lang, unknown> = { en, am, wol };

const field = 'admin-field';

/** Editing the words on the website, one page at a time, in each language. */
export default function ContentView() {
  const { token } = useAdminSession();
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
      setSaved((await adminApi.content(token)).items);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the saved text');
    } finally {
      setLoading(false);
    }
  }, [token]);

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
      await adminApi.saveContent(token, entries);
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <Segmented options={LANGS.map((l) => ({ value: l.code, label: l.name }))} value={lang} onChange={setLang} />
        <select value={groupId} onChange={(e) => setGroupId(e.target.value)} aria-label="Which part of the website" className="admin-field sm:!w-auto sm:min-w-[240px]">
          {EDITABLE_GROUPS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {status && <Notice kind="success">{status}</Notice>}
      {loading && <Notice>Loading the website text…</Notice>}

      <Panel>
        <div className="mb-5">
          <h2 className="text-[17px] font-bold text-[var(--a-ink)]">{group.title}</h2>
          <p className="text-[var(--a-muted)] text-[13px] mt-0.5">
            {group.note ?? 'Leave a box empty to go back to the words built into the website.'}
          </p>
        </div>

        <div className="space-y-5">
          {group.fields.map((f) => {
            const builtInText = original(f);
            const value = current(f);
            const isEdited = savedValue.has(draftKey(f)) || drafts[draftKey(f)] !== undefined;
            return (
              <div key={f.path}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <label htmlFor={`f-${f.path}`} className="text-[13px] font-semibold text-[var(--a-ink)]">
                    {f.label}
                    {f.shared && <span className="text-[#1E3A29]/35 normal-case tracking-normal"> · all languages</span>}
                  </label>
                  {isEdited && <span className="rounded-md bg-[#FBEAE0] text-[#9A4A20] text-[11px] font-semibold px-1.5 py-0.5">Edited</span>}
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
                {builtInText && <p className="text-[var(--a-faint)] text-[12px] mt-1.5 line-clamp-2">Built in: {builtInText}</p>}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-[calc(60px+env(safe-area-inset-bottom))] lg:bottom-4 z-10 flex flex-wrap items-center gap-3 mt-6 -mx-[18px] sm:-mx-[22px] -mb-[18px] sm:-mb-[22px] px-[18px] sm:px-[22px] py-3.5 border-t border-[var(--a-border)] bg-white/95 backdrop-blur rounded-b-[14px]">
          <button
            type="button"
            onClick={save}
            disabled={!changed || saving}
            className="inline-flex admin-btn"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {changed && (
            <button type="button" onClick={() => setDrafts({})} className="inline-flex admin-btn-quiet">
              Undo my changes
            </button>
          )}
        </div>
      </Panel>
    </div>
  );
}
