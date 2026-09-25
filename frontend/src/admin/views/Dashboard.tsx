import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/brand/logo.png';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { Summary } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { Notice, StatCard } from '../components/ui';
import MessagesView from './MessagesView';
import VisitsView from './VisitsView';

type Tab = 'visits' | 'messages';

/** The staff dashboard: counts on top, then visit requests or messages. */
export default function Dashboard() {
  const { key, signOut } = useAdminSession();
  const [tab, setTab] = useState<Tab>('visits');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  const loadSummary = useCallback(async () => {
    try {
      setSummary(await adminApi.summary(key));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the counts');
    }
  }, [key]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <header className="bg-[#0e2820] text-white">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="w-10 h-10 rounded-full bg-white/90 object-contain p-0.5" />
            <div>
              <div className="font-display text-lg leading-none">Bushaashe Garuwa</div>
              <div className="text-[#C99A45] text-[10px] tracking-[0.18em] uppercase mt-1">Staff area</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="admin-btn-quiet on-dark">
              View website
            </Link>
            <button type="button" onClick={signOut} className="admin-btn-quiet on-dark">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {error && (
          <div className="mb-6">
            <Notice kind="error">{error}</Notice>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Upcoming visits" value={summary?.visits.upcoming ?? '–'} hint="Today and later" />
          <StatCard label="New requests" value={summary?.visits.new ?? '–'} hint="Not handled yet" />
          <StatCard label="New messages" value={summary?.contact.new ?? '–'} hint="Not handled yet" />
          <StatCard label="Messages this week" value={summary?.contact.last7Days ?? '–'} hint="Last 7 days" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {(['visits', 'messages'] as Tab[]).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              aria-pressed={tab === name}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold border transition-colors ${
                tab === name
                  ? 'bg-[#0e2820] text-white border-[#0e2820]'
                  : 'border-[#0e2820]/15 text-[#0e2820]/70 hover:border-[#0e2820]/50 hover:text-[#0e2820]'
              }`}
            >
              {name === 'visits' ? 'Visit requests' : 'Messages'}
            </button>
          ))}
          <button type="button" onClick={loadSummary} className="admin-btn-quiet ml-auto">
            Refresh counts
          </button>
        </div>

        {tab === 'visits' ? <VisitsView /> : <MessagesView />}
      </main>
    </div>
  );
}
