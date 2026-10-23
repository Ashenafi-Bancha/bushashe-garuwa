import { useState } from 'react';
import { ApiError } from '../../lib/api';
import { adminApi } from '../api/adminClient';
import { useAdminSession } from '../auth/AdminSession';
import { Icon } from './icons';
import { Notice } from './ui';

/** How safe a new password looks, from its length and the kinds of characters in it */
function strength(password: string): { score: 0 | 1 | 2 | 3; label: string } {
  if (password.length < 10) return { score: 0, label: password ? 'Too short: at least 10 characters' : 'At least 10 characters' };
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) => r.test(password)).length;
  if (password.length >= 14 && kinds >= 3) return { score: 3, label: 'Strong' };
  if (password.length >= 12 || kinds >= 3) return { score: 2, label: 'Good' };
  return { score: 1, label: 'Fair: a longer password is safer' };
}

const BAR = ['bg-[#C62828]', 'bg-[#E8B23A]', 'bg-[#7FA548]', 'bg-[#3F7D20]'];

/** A password box with a show/hide eye */
function PasswordField({ label, value, onChange, autoComplete }: { label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [shown, setShown] = useState(false);
  return (
    <label className="block">
      <span className="block text-[#1E3A29]/60 text-[12px] font-bold mb-1.5">{label}</span>
      <span className="relative block">
        <input
          type={shown ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="admin-field pr-12"
        />
        <button
          type="button"
          onClick={() => setShown(!shown)}
          aria-label={shown ? 'Hide the password' : 'Show the password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-[#1E3A29]/50 hover:bg-[#1E3A29]/6"
        >
          <Icon name={shown ? 'eyeOff' : 'eye'} className="w-4 h-4" />
        </button>
      </span>
    </label>
  );
}

/**
 * Changing one's own password: the one used now, the new one twice. Every
 * other device is signed out; this one stays signed in.
 */
export default function PasswordForm({ currentLabel = 'Current password', onDone }: { currentLabel?: string; onDone?: () => void }) {
  const { token, setUser } = useAdminSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const rating = strength(next);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== again) return setError('The two new passwords are not the same');
    if (next.length < 10) return setError('Choose a password of at least 10 characters');
    setBusy(true);
    try {
      setUser(await adminApi.changePassword(token, current, next));
      setCurrent('');
      setNext('');
      setAgain('');
      setDone(true);
      onDone?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <PasswordField label={currentLabel} value={current} onChange={setCurrent} autoComplete="current-password" />
      <div>
        <PasswordField label="New password" value={next} onChange={setNext} autoComplete="new-password" />
        <div className="flex gap-1.5 mt-2.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${next && rating.score >= n ? BAR[rating.score] : 'bg-[#1E3A29]/10'}`} />
          ))}
        </div>
        <p className="text-[12px] text-[#1E3A29]/55 mt-1.5">{rating.label}</p>
      </div>
      <PasswordField label="New password again" value={again} onChange={setAgain} autoComplete="new-password" />
      {error && <Notice kind="error">{error}</Notice>}
      {done && !error && <Notice kind="success">Your password is changed. Any other phone or computer signed in with your account has been signed out.</Notice>}
      <button type="submit" disabled={busy} className="admin-btn w-full">
        {busy ? 'Saving…' : 'Save the new password'}
      </button>
    </form>
  );
}
