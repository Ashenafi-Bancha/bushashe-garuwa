import { useState } from 'react';
import logo from '../../assets/brand/logo.png';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';
import { Notice } from '../components/ui';

/** Staff sign-in: one key, checked by the API before it is kept. */
export default function SignIn() {
  const { signIn } = useAdminSession();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(key.trim());
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401 ? 'That key is not correct.' : (err as Error).message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e2820] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="" className="w-12 h-12 rounded-full bg-white/90 object-contain p-0.5" />
          <div>
            <div className="font-display text-white text-lg">Bushaashe Garuwa</div>
            <div className="text-[#C99A45] text-[10px] tracking-[0.18em] uppercase mt-0.5">Staff area</div>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white p-7 space-y-5">
          <div>
            <h1 className="font-display text-2xl text-[#0e2820] mb-1">Sign in</h1>
            <p className="text-[#1D211E]/55 text-sm">Enter the staff key to see messages and visit requests.</p>
          </div>

          {!apiEnabled && <Notice kind="error">The API address is not set (VITE_API_URL), so there is nothing to sign in to.</Notice>}
          {error && <Notice kind="error">{error}</Notice>}

          <div>
            <label htmlFor="admin-key" className="block text-xs font-semibold text-[#173F35]/70 tracking-wider uppercase mb-2">
              Staff key
            </label>
            <input
              id="admin-key"
              type="password"
              required
              autoComplete="current-password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded-xl border border-[#173F35]/20 focus:border-[#173F35] px-4 py-3 text-sm text-[#1D211E] outline-none transition-colors bg-[#F7F5F0]"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy || !apiEnabled}
            className="w-full bg-[#C99A45] hover:bg-[#d9af65] text-[#173F35] font-semibold text-sm rounded-full py-4 transition-colors disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>

        <p className="text-white/35 text-xs text-center mt-6">The key is kept only until this browser window is closed.</p>
      </div>
    </div>
  );
}
