import { useState } from 'react';
import logo from '../../assets/brand/logo.png';
import { photos } from '../../assets/photos';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';

/**
 * Staff sign-in: one key, checked by the API before it is kept.
 * Phones get a single full-height column; larger screens add a photo beside it.
 */
export default function SignIn() {
  const { signIn } = useAdminSession();
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await signIn(key.trim());
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? 'That key is not correct.' : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#0e2820] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Photo, on larger screens only */}
      <div className="relative hidden lg:block overflow-hidden">
        <img src={photos.house} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f19] via-[#0a1f19]/55 to-[#0a1f19]/20" />
        <div className="relative h-full flex flex-col justify-end p-12 xl:p-16">
          <h2 className="font-display text-4xl xl:text-5xl text-white leading-tight max-w-md">
            Keeping Wolaita heritage, one visitor at a time
          </h2>
          <p className="text-white/60 mt-4 max-w-sm">
            Messages, visit requests and the words on the website, all in one place.
          </p>
        </div>
      </div>

      {/* Sign-in column */}
      <div className="min-h-[100svh] lg:min-h-0 flex flex-col px-5 sm:px-8 py-8 sm:py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center gap-3">
          <img src={logo} alt="" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 object-contain p-0.5 flex-shrink-0" />
          <div className="leading-none">
            <div className="font-display text-white text-lg sm:text-xl">Bushaashe Garuwa</div>
            <div className="text-[#C99A45] text-[10px] tracking-[0.2em] uppercase mt-1.5">Staff area</div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center py-10 sm:py-12">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl text-white leading-[1.05] mb-3">Sign in</h1>
            <p className="text-white/55 text-[15px] leading-relaxed mb-8">
              Enter the staff key to manage messages, visit requests and the website content.
            </p>

            {!apiEnabled && (
              <p role="alert" className="rounded-2xl bg-[#A65A3A]/20 text-[#f0b79c] text-sm px-4 py-3 mb-5">
                The API address is not set (VITE_API_URL), so there is nothing to sign in to.
              </p>
            )}

            <form onSubmit={submit} noValidate className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="admin-key" className="text-white/70 text-xs font-semibold tracking-[0.14em] uppercase">
                    Staff key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="text-[#C99A45] text-xs font-semibold hover:text-[#e0b877] focus-visible:underline"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="admin-key"
                  type={show ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  aria-invalid={error !== ''}
                  aria-describedby={error ? 'admin-key-error' : undefined}
                  className={`w-full rounded-2xl bg-white/8 border px-4 py-4 text-base text-white placeholder:text-white/30 outline-none transition-colors ${
                    error ? 'border-[#e08a66]' : 'border-white/15 focus:border-[#C99A45]'
                  }`}
                  placeholder="Paste or type the key"
                />
                {error && (
                  <p id="admin-key-error" role="alert" className="text-[#f0b79c] text-sm mt-2">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy || !apiEnabled}
                className="w-full min-h-[52px] bg-[#C99A45] hover:bg-[#d9af65] active:scale-[0.99] text-[#0e2820] font-semibold rounded-full transition-all disabled:opacity-60 disabled:active:scale-100"
              >
                {busy ? 'Checking…' : 'Sign in'}
              </button>
            </form>

            <p className="text-white/35 text-xs leading-relaxed mt-6">
              The key is kept only until this browser window is closed. Ask the site owner if you do not have one.
            </p>
          </div>
        </div>

        <footer className="text-center">
          <a href="/" className="text-white/40 hover:text-white text-sm transition-colors">
            Back to the website
          </a>
        </footer>
      </div>
    </div>
  );
}
