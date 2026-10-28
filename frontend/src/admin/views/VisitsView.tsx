import { useState } from 'react';
import { adminApi } from '../api/adminClient';
import { STATUS_LABELS, type RequestStatus, type VisitRequest } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar, { timeAgo } from '../components/Avatar';
import { useAdminList } from '../components/useAdminList';
import {
  ContactActions,
  EditButtons,
  EditField,
  Fact,
  FilterChips,
  IconActions,
  ListSkeleton,
  Notice,
  Pager,
  SearchBox,
  Segmented,
  StatusSelect,
  useDebounced,
  whenLabel,
} from '../components/ui';

const GROUP_SIZES = ['1', '2', '3–5', '6–10', '11–20', '21–50', '50+'];
type Draft = { id: number; name: string; phone: string; email: string; date: string; visitors: string; message: string };
type StatusFilter = RequestStatus | 'all';

/** What visitors ticked on the Plan Your Visit form, in words */
const EXPERIENCES: Record<string, string> = {
  heritage: 'Heritage tour',
  cultural: 'Cultural experience',
  food: 'Traditional food',
  restaurant: 'Restaurant',
  guesthouse: 'Guest house',
  group: 'Group visit',
  education: 'School / education',
  meeting: 'Meeting hall',
};

/** Requests sent from the Plan Your Visit page. */
export default function VisitsView({ newCount }: { newCount?: number }) {
  const { token } = useAdminSession();
  const [when, setWhen] = useState<'upcoming' | 'all'>('upcoming');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const [draft, setDraft] = useState<Draft | null>(null);
  const { page, setPage, data, error, loading, busyId, changeStatus, act } = useAdminList<VisitRequest>(
    (p) => adminApi.visits(token, p, { upcoming: when === 'upcoming', search: query, status: status === 'all' ? undefined : status }),
    (id, next) => adminApi.setVisitStatus(token, id, next),
    [when, status, query],
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

  const nothing = query
    ? `Nothing matches "${query}".`
    : status !== 'all'
      ? `No ${STATUS_LABELS[status].toLowerCase()} requests${when === 'upcoming' ? ' coming up' : ''}.`
      : when === 'upcoming'
        ? 'No upcoming visits.'
        : 'No visit requests yet.';

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
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Segmented
          options={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'all', label: 'All dates' },
          ]}
          value={when}
          onChange={(value) => {
            setPage(1);
            setWhen(value);
          }}
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
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {loading && !data && <ListSkeleton />}
      {data?.total === 0 && !error && <Notice>{nothing}</Notice>}

      {data && data.total > 0 && (
        <>
          <ul className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
            {data.items.map((visit) => (
              <li key={visit.id} className={`admin-card !p-4 sm:!p-5 ${visit.status === 'new' ? 'admin-card-new' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={visit.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[15px] text-[var(--a-ink)] leading-tight truncate">{visit.name}</h3>
                    <div className="text-[13px] text-[var(--a-muted)] truncate mt-0.5">
                      {visit.phone}
                      {visit.email ? ` · ${visit.email}` : ''}
                    </div>
                  </div>
                  <StatusSelect status={visit.status} busy={busyId === visit.id} onChange={(next) => changeStatus(visit.id, next)} />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Fact icon="events" tone="strong">{whenLabel(visit.date)}</Fact>
                  <Fact icon="guests">
                    {visit.visitors} {visit.visitors === '1' ? 'guest' : 'guests'}
                  </Fact>
                  {visit.experiences.map((experience) => (
                    <Fact key={experience} icon="sparkle">{EXPERIENCES[experience] ?? experience}</Fact>
                  ))}
                </div>

                {visit.message && <p className="mt-3 border-l-2 border-[var(--a-border)] pl-3 text-[14px] text-[#3C4740] leading-relaxed whitespace-pre-line">{visit.message}</p>}
                <div className="text-[12px] text-[var(--a-faint)] mt-2.5">Asked {timeAgo(visit.createdAt)}</div>

                {draft?.id === visit.id ? (
                  <form onSubmit={save} className="mt-4 rounded-2xl bg-[var(--a-bg)] p-4 sm:p-5 space-y-3">
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
                  <ContactActions name={visit.name} phone={visit.phone} email={visit.email} subject="Your visit to Bushaashe Garuwa">
                    <IconActions
                      busy={busyId === visit.id}
                      onEdit={() =>
                        setDraft({ id: visit.id, name: visit.name, phone: visit.phone, email: visit.email ?? '', date: visit.date, visitors: visit.visitors, message: visit.message ?? '' })
                      }
                      onDelete={() => remove(visit)}
                    />
                  </ContactActions>
                )}
              </li>
            ))}
          </ul>
          <Pager page={page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
