import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import type { VisitRequest } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { EditButtons, EditField, Notice, Pager, Panel, RowActions, SearchBox, StatusSelect, formatDate, formatDateTime, useDebounced } from '../components/ui';

const GROUP_SIZES = ['1', '2', '3–5', '6–10', '11–20', '21–50', '50+'];
type Draft = { id: number; name: string; phone: string; email: string; date: string; visitors: string; message: string };

/** Requests sent from the Plan Your Visit page. */
export default function VisitsView() {
  const { token } = useAdminSession();
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const [draft, setDraft] = useState<Draft | null>(null);
  const { page, setPage, data, error, loading, busyId, changeStatus, act } = useAdminList<VisitRequest>(
    (p) => adminApi.visits(token, p, { upcoming: upcomingOnly, search: query }),
    (id, status) => adminApi.setVisitStatus(token, id, status),
    [upcomingOnly, query],
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const { id, ...values } = draft;
    if (await act(id, () => adminApi.updateVisit(token, id, values), 'Could not save the changes')) setDraft(null);
  };

  const remove = (visit: VisitRequest) => {
    if (!confirm(`Delete the visit request from ${visit.name}? This cannot be undone.`)) return;
    void act(visit.id, () => adminApi.deleteVisit(token, visit.id), 'Could not delete the request');
  };

  return (
    <div className="space-y-4">
      <SearchBox
        value={search}
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        placeholder="Search by name, phone, email or note"
      />
      <label className="inline-flex items-center gap-2 text-sm text-[#1E3A29] cursor-pointer">
        <input
          type="checkbox"
          checked={upcomingOnly}
          onChange={(e) => {
            setPage(1);
            setUpcomingOnly(e.target.checked);
          }}
          className="w-4 h-4 accent-[#1E3A29]"
        />
        Upcoming visits only
      </label>

      {error && <Notice kind="error">{error}</Notice>}
      {loading && !data && <Notice>Loading visit requests…</Notice>}
      {data?.total === 0 && !error && (
        <Notice>{query ? `Nothing matches "${query}".` : upcomingOnly ? 'No upcoming visits.' : 'No visit requests yet.'}</Notice>
      )}

      {data && data.total > 0 && (
        <Panel>
          <ul className="divide-y divide-[#1E3A29]/10">
            {data.items.map((visit) => (
              <li key={visit.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display text-xl text-[#1E3A29]">{visit.name}</h3>
                    <div className="text-sm text-[#1E3A29]/60 mt-0.5">
                      <a href={`tel:${visit.phone.replace(/\s/g, '')}`} className="hover:text-[#C4622D]">
                        {visit.phone}
                      </a>
                      {visit.email && (
                        <>
                          {' · '}
                          <a href={`mailto:${visit.email}`} className="hover:text-[#C4622D]">
                            {visit.email}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#1E3A29]/40">asked {formatDateTime(visit.createdAt)}</span>
                    <StatusSelect
                      status={visit.status}
                      busy={busyId === visit.id}
                      onChange={(status) => changeStatus(visit.id, status)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-sm text-[#1E3A29]/75 mb-2">
                  <div>
                    <span className="text-[#C4622D] text-[11px] uppercase tracking-wider block">Visit date</span>
                    {formatDate(visit.date)}
                  </div>
                  <div>
                    <span className="text-[#C4622D] text-[11px] uppercase tracking-wider block">Guests</span>
                    {visit.visitors}
                  </div>
                </div>

                {visit.experiences.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {visit.experiences.map((experience) => (
                      <span key={experience} className="rounded-full bg-[#1E3A29]/8 text-[#1E3A29] text-xs px-3 py-1">
                        {experience}
                      </span>
                    ))}
                  </div>
                )}

                {visit.message && <p className="text-[#1E3A29]/75 leading-relaxed whitespace-pre-line">{visit.message}</p>}

                {draft?.id === visit.id ? (
                  <form onSubmit={save} className="mt-4 rounded-2xl bg-[#F4EFE4] p-4 sm:p-5 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <EditField label="Name">
                        <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="admin-field" />
                      </EditField>
                      <EditField label="Phone">
                        <input required type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="admin-field" />
                      </EditField>
                      <EditField label="Email">
                        <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="admin-field" />
                      </EditField>
                      <EditField label="Visit date">
                        <input required type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="admin-field" />
                      </EditField>
                      <EditField label="Guests">
                        <select value={draft.visitors} onChange={(e) => setDraft({ ...draft, visitors: e.target.value })} className="admin-field">
                          {GROUP_SIZES.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </EditField>
                    </div>
                    <EditField label="Note">
                      <textarea rows={3} value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} className="admin-field resize-y" />
                    </EditField>
                    <EditButtons busy={busyId === visit.id} onCancel={() => setDraft(null)} />
                  </form>
                ) : (
                  <RowActions
                    busy={busyId === visit.id}
                    onEdit={() =>
                      setDraft({ id: visit.id, name: visit.name, phone: visit.phone, email: visit.email ?? '', date: visit.date, visitors: visit.visitors, message: visit.message ?? '' })
                    }
                    onDelete={() => remove(visit)}
                  />
                )}
              </li>
            ))}
          </ul>
          <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </Panel>
      )}
    </div>
  );
}
