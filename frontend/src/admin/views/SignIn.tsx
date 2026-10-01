import { useState } from 'react';
import logo from '../../assets/brand/logo.png';
import { photos } from '../../assets/photos';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';

const FIELD =
  'w-full rounded-2xl bg-white/8 border px-4 py-4 text-base text-white placeholder:text-white/30 outline-none transition-colors';
const LABEL = 'text-white/70 text-xs font-semibold tracking-[0.14em] uppercase';

/**
 * Staff sign-in: email and password, checked by the API.
 * Phones get a single full-height column; larger screens add a photo beside it.
 */
export default function SignIn() {
  const { signIn } = useAdminSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setError('Enter your email and your password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(
        status === 401 || status === 400
          ? 'That email or password is not correct.'
          : status === 429
            ? 'Too many tries. Please wait a few minutes and try again.'
            : (err as Error).message,
      );
    } finally {
      setBusy(false);
    }
  };

  const border = error ? 'border-[#e08a66]' : 'border-white/15 focus:border-[#86A94F]';

  return (
    <div className="min-h-[100svh] bg-[#13261A] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Photo, on larger screens only */}
      <div className="relative hidden lg:block overflow-hidden">
        <img src={photos.meeshsho} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13261A] via-[#13261A]/55 to-[#13261A]/20" />
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
            <div className="text-[#B9D38A] text-[10px] tracking-[0.2em] uppercase mt-1.5">Staff area</div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center py-10 sm:py-12">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl text-white leading-[1.05] mb-3">Sign in</h1>
            <p className="text-white/55 text-[15px] leading-relaxed mb-8">
              Sign in with your staff email and password to manage messages, visit requests, bookings and the website content.
            </p>

            {!apiEnabled && (
              <p role="alert" className="rounded-2xl bg-[#1E3A29]/20 text-[#f0b79c] text-sm px-4 py-3 mb-5">
                The API address is not set (VITE_API_URL), so there is nothing to sign in to.
              </p>
            )}

            <form onSubmit={submit} noValidate className="space-y-4">
              <div>
                <label htmlFor="admin-email" className={`block mb-2 ${LABEL}`}>
                  Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  required
                  autoFocus
                  autoComplete="username"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error !== ''}
                  className={`${FIELD} ${border}`}
                  placeholder="you@bushaashegaruwa.com"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="admin-password" className={LABEL}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="text-[#B9D38A] text-xs font-semibold hover:text-white focus-visible:underline"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={error !== ''}
                  aria-describedby={error ? 'admin-signin-error' : undefined}
                  className={`${FIELD} ${border}`}
                />
                {error && (
                  <p id="admin-signin-error" role="alert" className="text-[#f0b79c] text-sm mt-2">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy || !apiEnabled}
                className="w-full min-h-[52px] bg-[#86A94F] hover:bg-[#B9D38A] active:scale-[0.99] text-[#13261A] font-semibold rounded-full transition-all disabled:opacity-60 disabled:active:scale-100"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="text-white/35 text-xs leading-relaxed mt-6">
              You stay signed in until you sign out or close this browser window, for up to 12 hours. Ask the site owner if you do not
              have an account.
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
