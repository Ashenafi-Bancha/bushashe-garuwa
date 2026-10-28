import { useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import { ROLE_LABELS } from '../api/types';
import { useAdminSession } from '../auth/AdminSession';
import Avatar from '../components/Avatar';
import { Icon } from '../components/icons';
import PasswordForm from '../components/PasswordForm';
import { InstallCard, Notice } from '../components/ui';
import type { StaffApp } from '../pwa';

/** My account: one's own name and password, the app, and signing out. */
export default function AccountView({ app }: { app: StaffApp }) {
  const { token, user, setUser, signOut } = useAdminSession();
  const [name, setName] = useState(user?.name ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  if (!user) return null;

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      setUser(await adminApi.rename(token, name));
      setMessage({ kind: 'success', text: 'Your name is saved.' });
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof ApiError ? err.message : 'Could not save your name' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* who you are */}
      <section className="admin-card overflow-hidden !p-0">
        <div className="relative px-5 sm:px-6 pt-6 pb-5 border-b border-[var(--a-border)]">
          <div className="relative flex items-center gap-4">
            <span className="rounded-full">
              <Avatar name={user.name} email={user.email} size="lg" />
            </span>
            <div className="min-w-0">
              <div className="text-[18px] font-bold text-[var(--a-ink)] leading-tight truncate">{user.name || 'Add your name'}</div>
              <div className="text-[var(--a-muted)] text-[13px] truncate">{user.email}</div>
              <span className="inline-flex items-center gap-1 mt-1.5 rounded-md bg-[var(--a-brand-soft)] text-[var(--a-brand-dark)] px-2 py-0.5 text-[11.5px] font-semibold">
                <Icon name={user.role === 'owner' ? 'shield' : 'user'} className="w-3.5 h-3.5" />
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        </div>
        <form onSubmit={saveName} className="px-5 sm:px-7 py-5 space-y-3">
          <label className="block">
            <span className="block text-[var(--a-muted)] text-[12px] font-bold mb-1.5">Your name, as your colleagues see it</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="e.g. Almaz Tesfaye" className="admin-field" />
          </label>
          {message && <Notice kind={message.kind}>{message.text}</Notice>}
          <button type="submit" disabled={busy || name.trim() === user.name} className="admin-btn">
            {busy ? 'Saving…' : 'Save name'}
          </button>
        </form>
      </section>

      {/* the password */}
      <section className="admin-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--a-brand-soft)] text-[var(--a-brand)]">
            <Icon name="key" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--a-ink)]">Password</h3>
            <p className="text-[var(--a-muted)] text-sm">Changing it signs you out on your other phones and computers.</p>
          </div>
        </div>
        <PasswordForm />
      </section>

      <InstallCard canInstall={app.canInstall} appleHint={app.appleHint} onInstall={app.install} />

      <button type="button" onClick={signOut} className="w-full admin-card flex items-center justify-center gap-2 !py-4 text-[#C62828] font-bold hover:bg-[#C62828]/5 transition-colors">
        <Icon name="signOut" className="w-5 h-5" />
        Sign out
      </button>
    </div>
  );
}
