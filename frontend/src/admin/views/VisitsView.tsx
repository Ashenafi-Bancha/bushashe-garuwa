import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import type { VisitRequest } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { Notice, Pager, Panel, SearchBox, StatusSelect, formatDate, formatDateTime, useDebounced } from '../components/ui';

/** Requests sent from the Plan Your Visit page. */
export default function VisitsView() {
  const { key } = useAdminSession();
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const { page, setPage, data, error, loading, busyId, changeStatus } = useAdminList<VisitRequest>(
    (p) => adminApi.visits(key, p, { upcoming: upcomingOnly, search: query }),
    (id, status) => adminApi.setVisitStatus(key, id, status),
    [upcomingOnly, query],
  );

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
              </li>
            ))}
          </ul>
          <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </Panel>
      )}
    </div>
  );
}
