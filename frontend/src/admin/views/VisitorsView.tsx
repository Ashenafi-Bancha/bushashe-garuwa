import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import type { StatsSummary } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';
import { ListSkeleton, Notice, Segmented, StatCard } from '../components/ui';

/**
 * How many people visit the website, which pages they read, where they come
 * from and in which language: the numbers that show whether promotion works.
 * Counted by the website itself, without cookies (backend/src/modules/stats).
 */

const PERIODS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
] as const;

/** The places visitors come from, in words */
const SOURCES: Record<string, string> = {
  direct: 'Typed the address, or from an app',
  google: 'Google',
  bing: 'Bing',
  duckduckgo: 'DuckDuckGo',
  yahoo: 'Yahoo',
  facebook: 'Facebook',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  linkedin: 'LinkedIn',
  tripadvisor: 'Tripadvisor',
  qr: 'QR code posters',
};
const LANGUAGES: Record<string, string> = { wol: 'Wolayttatto', am: 'Amharic', en: 'English' };
const DEVICES: Record<string, string> = { phone: 'Phones', tablet: 'Tablets', computer: 'Computers' };
/** The pages, in words */
const PAGES: Record<string, string> = {
  '/': 'Home',
  '/discover': 'Discover',
  '/heritage': 'Heritage',
  '/experiences': 'Experiences',
  '/events': 'Events',
  '/vip': 'VIP Service',
  '/meeting-hall': 'Meeting Hall',
  '/dine': 'Restaurant',
  '/stay': 'Guest House',
  '/gallery': 'Gallery',
  '/visit': 'Plan Your Visit',
  '/contact': 'Contact',
  '/about': 'About',
  '/family-history': 'Family History',
};
const pageName = (path: string) => PAGES[path] ?? (path.startsWith('/heritage/') ? `Heritage · ${path.slice(10).replace(/-/g, ' ')}` : path);

const shortDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** A list of names with a bar for each share */
function Shares({ title, rows, total }: { title: string; rows: { label: string; value: number; note?: string }[]; total: number }) {
  return (
    <div className="admin-card">
      <h3 className="admin-h3 mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-[13px] text-[var(--a-faint)]">Nothing yet.</p>
      ) : (
        <ul className="space-y-3.5">
          {rows.map((row) => {
            const share = total > 0 ? Math.round((row.value / total) * 100) : 0;
            return (
              <li key={row.label}>
                <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                  <span className="font-semibold text-[var(--a-ink)] truncate">{row.label}</span>
                  <span className="text-[var(--a-muted)] tabular-nums flex-shrink-0">
                    {row.value}
                    {row.note ? ` ${row.note}` : ''} · {share}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-[var(--a-brand-soft)] overflow-hidden" aria-hidden="true">
                  <div className="h-full rounded-full bg-[var(--a-brand)]" style={{ width: `${Math.max(share, row.value > 0 ? 3 : 0)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function VisitorsView() {
  const { token } = useAdminSession();
  const [days, setDays] = useState<(typeof PERIODS)[number]['value']>('30');
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setStats(await adminApi.stats(token, Number(days)));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the visitor numbers');
    }
  }, [token, days]);
  useEffect(() => void load(), [load]);

  const peak = Math.max(1, ...(stats?.daily.map((d) => d.visitors) ?? [1]));
  const wolaytta = stats?.languages.find((l) => l.lang === 'wol')?.visitors ?? 0;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented options={[...PERIODS]} value={days} onChange={setDays} />
        <button type="button" onClick={load} className="inline-flex admin-btn-quiet">
          <Icon name="refresh" className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {!stats && !error && <ListSkeleton rows={3} />}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Visitors" value={stats.totals.visitors} hint={`in the last ${stats.days} days`} icon="team" />
            <StatCard label="Pages opened" value={stats.totals.views} hint={stats.totals.visitors ? `${(stats.totals.views / stats.totals.visitors).toFixed(1)} per visitor` : 'by all visitors'} icon="overview" />
            <StatCard label="Today" value={stats.today.visitors} hint={`${stats.today.views} pages opened`} icon="clock" />
            <StatCard label="Read in Wolayttatto" value={wolaytta} hint={stats.totals.visitors ? `${Math.round((wolaytta / stats.totals.visitors) * 100)}% of visitors` : 'visitors'} icon="text" />
          </div>

          {/* visitors per day */}
          <div className="admin-card">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h3 className="admin-h3">Visitors per day</h3>
              <span className="text-[12px] text-[var(--a-faint)]">
                {shortDay(stats.from)} – {shortDay(stats.to)}
              </span>
            </div>
            <div className="flex items-end gap-[3px] h-40" role="img" aria-label={`Visitors per day, highest ${peak}`}>
              {stats.daily.map((d) => (
                <div key={d.day} className="group relative flex-1 h-full flex items-end">
                  <div
                    className="w-full rounded-t-[4px] bg-[var(--a-brand)] opacity-85 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${d.visitors === 0 ? 2 : Math.max(6, (d.visitors / peak) * 100)}%`, opacity: d.visitors === 0 ? 0.18 : undefined }}
                  />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-[var(--a-ink)] text-white text-[11px] font-semibold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {shortDay(d.day)} · {d.visitors} {d.visitors === 1 ? 'visitor' : 'visitors'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-[var(--a-faint)] mt-2">
              <span>{shortDay(stats.from)}</span>
              <span>Today</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Shares title="Where visitors came from" total={stats.totals.visitors} rows={stats.sources.map((s) => ({ label: SOURCES[s.source] ?? s.source, value: s.visitors }))} />
            <Shares title="Language they read in" total={stats.totals.visitors} rows={stats.languages.map((l) => ({ label: LANGUAGES[l.lang] ?? l.lang, value: l.visitors }))} />
            <Shares title="Most visited pages" total={stats.totals.views} rows={stats.pages.map((p) => ({ label: pageName(p.path), value: p.views, note: p.views === 1 ? 'view' : 'views' }))} />
            <Shares title="Phones and computers" total={stats.totals.visitors} rows={stats.devices.map((d) => ({ label: DEVICES[d.device] ?? d.device, value: d.visitors }))} />
          </div>

          {/* how to see which promotion works */}
          <div className="admin-card bg-[var(--a-brand-soft)] border-transparent">
            <h3 className="admin-h3 mb-2">See which promotion brings visitors</h3>
            <p className="text-[13.5px] text-[var(--a-muted)] leading-relaxed">
              Add <strong className="text-[var(--a-ink)]">?ref=</strong> and a short name to the website address you share, and those visitors are counted under that name above. For example{' '}
              <strong className="text-[var(--a-ink)]">bushaashegaruwa.com/?ref=qr</strong> on the QR code posters,{' '}
              <strong className="text-[var(--a-ink)]">?ref=radio</strong> when it is read on the radio, or{' '}
              <strong className="text-[var(--a-ink)]">?ref=university</strong> in a message to the university.
            </p>
            <p className="text-[12px] text-[var(--a-faint)] mt-2">
              Counted without cookies and without keeping anyone's address. A visitor is one person on one day; the staff area is not counted.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
