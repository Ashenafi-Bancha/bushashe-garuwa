import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import { STATUS_LABELS, type ContactMessage, type RequestStatus } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
import { useAdminList } from '../components/useAdminList';
import { ContactActions, Fact, FilterChips, IconActions, ListSkeleton, Notice, Pager, SearchBox, StatusSelect, useDebounced } from '../components/ui';

type StatusFilter = RequestStatus | 'all';
const LANGUAGES: Record<string, string> = { en: 'English', am: 'Amharic', wol: 'Wolaytta' };

/** Messages sent from the Contact page. */
export default function MessagesView({ newCount }: { newCount?: number }) {
  const { token } = useAdminSession();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const { page, setPage, data, error, loading, busyId, changeStatus, act } = useAdminList<ContactMessage>(
    (p) => adminApi.messages(token, p, query, status === 'all' ? undefined : status),
    (id, next) => adminApi.setMessageStatus(token, id, next),
    [query, status],
  );

  const remove = (message: ContactMessage) => {
    if (!confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    void act(message.id, () => adminApi.deleteMessage(token, message.id), 'Could not delete the message');
  };

  const nothing = query ? `Nothing matches "${query}".` : status !== 'all' ? `No ${STATUS_LABELS[status].toLowerCase()} messages.` : 'No messages yet.';

  return (
    <div className="space-y-4">
      <SearchBox
        value={search}
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        placeholder="Search by name, email, phone or words in the message"
      />
      <FilterChips<StatusFilter>
        options={[
          { value: 'all', label: 'All' },
          { value: 'new', label: 'New', count: newCount },
          { value: 'in_progress', label: 'In progress' },
          { value: 'done', label: 'Done' },
          { value: 'archived', label: 'Archived' },
        ]}
        value={status}
        onChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />

      {error && <Notice kind="error">{error}</Notice>}
      {loading && !data && <ListSkeleton />}
      {data?.total === 0 && !error && <Notice>{nothing}</Notice>}

      {data && data.total > 0 && (
        <>
          <ul className="space-y-3">
            {data.items.map((message) => (
              <li key={message.id} className={`admin-card !p-4 sm:!p-5 ${message.status === 'new' ? 'admin-card-new' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={message.name} email={message.email} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[16px] text-[#1E3A29] leading-tight truncate">{message.name}</h3>
                    <div className="text-[13px] text-[#1E3A29]/55 truncate mt-0.5">{timeAgo(message.createdAt)}</div>
                  </div>
                  <StatusSelect status={message.status} busy={busyId === message.id} onChange={(next) => changeStatus(message.id, next)} />
                </div>

                <p className="mt-3.5 rounded-2xl rounded-tl-md bg-[#F4EFE4] px-4 py-3 text-[14.5px] text-[#1E3A29]/85 leading-relaxed whitespace-pre-line">{message.message}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Fact icon="mail">{message.email}</Fact>
                  {message.phone && <Fact icon="phone">{message.phone}</Fact>}
                  <Fact icon="text">{LANGUAGES[message.language] ?? message.language}</Fact>
                </div>

                {/* a visitor's own words are kept as written: a message can be deleted, not rewritten */}
                <ContactActions name={message.name} phone={message.phone} email={message.email} subject="Re: your message to Bushaashe Garuwa">
                  <IconActions busy={busyId === message.id} onDelete={() => remove(message)} />
                </ContactActions>
              </li>
            ))}
          </ul>
          <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
