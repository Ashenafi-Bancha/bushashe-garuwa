import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import type { ContactMessage } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { useAdminList } from '../components/useAdminList';
import { Notice, Pager, Panel, SearchBox, StatusSelect, formatDateTime, useDebounced } from '../components/ui';

/** Messages sent from the Contact page. */
export default function MessagesView() {
  const { key } = useAdminSession();
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const { page, setPage, data, error, loading, busyId, changeStatus } = useAdminList<ContactMessage>(
    (p) => adminApi.messages(key, p, query),
    (id, status) => adminApi.setMessageStatus(key, id, status),
    [query],
  );

  const box = (
    <SearchBox
      value={search}
      onChange={(value) => {
        setPage(1);
        setSearch(value);
      }}
      placeholder="Search by name, email, phone or words in the message"
    />
  );
  const nothing = query ? `Nothing matches "${query}".` : 'No messages yet.';

  if (error) return <div className="space-y-4">{box}<Notice kind="error">{error}</Notice></div>;
  if (loading && !data) return <div className="space-y-4">{box}<Notice>Loading messages…</Notice></div>;
  if (data && data.total === 0) return <div className="space-y-4">{box}<Notice>{nothing}</Notice></div>;

  return (
    <div className="space-y-4">
    {box}
    <Panel>
      <ul className="divide-y divide-[#35723A]/10">
        {data?.items.map((message) => (
          <li key={message.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-xl text-[#12150F]">{message.name}</h3>
                <div className="text-sm text-[#12150F]/60 mt-0.5">
                  <a href={`mailto:${message.email}`} className="hover:text-[#B8863B]">
                    {message.email}
                  </a>
                  {message.phone && (
                    <>
                      {' · '}
                      <a href={`tel:${message.phone.replace(/\s/g, '')}`} className="hover:text-[#B8863B]">
                        {message.phone}
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#12150F]/40">{formatDateTime(message.createdAt)}</span>
                <StatusSelect
                  status={message.status}
                  busy={busyId === message.id}
                  onChange={(status) => changeStatus(message.id, status)}
                />
              </div>
            </div>
            <p className="text-[#12150F]/75 leading-relaxed whitespace-pre-line">{message.message}</p>
            <div className="text-[11px] uppercase tracking-wider text-[#12150F]/35 mt-2">
              Written in {message.language}
            </div>
          </li>
        ))}
      </ul>
      {data && <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </Panel>
    </div>
  );
}
