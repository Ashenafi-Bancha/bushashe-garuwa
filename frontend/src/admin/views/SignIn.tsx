import { useState, type ReactNode } from 'react';
import logo from '../../assets/brand/logo-small.webp';
import { photos, picture } from '../../assets/photos';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';

/**
 * The frame of the sign-in screens: the logo and the name on their own at the
 * top, the form in a white card below. On a computer a photograph of Meesho
 * Keettaa fills the left side, by itself, with nothing written over it.
 */
export function SignInFrame({ children }: { children: ReactNode }) {
  return (
    <div className="admin-signin min-h-[100svh] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[1.15fr_1fr]">
      {/* computers: the photograph, alone, in a rounded frame */}
      <div className="hidden lg:block p-4 pr-0">
        <div className="relative h-full min-h-[560px] rounded-[22px] overflow-hidden bg-[#DCE4D2]">
          <img {...picture(photos.meeshsho, '50vw')} alt="Meesho Keettaa at Bushaashe Garuwa" className="admin-ken absolute inset-0 w-full h-full object-cover" />
          <span className="absolute left-5 bottom-5 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--a-ink)]">
            Meesho Keettaa · Bushaashe Garuwa
          </span>
        </div>
      </div>

      <main className="min-h-[100svh] flex flex-col justify-center px-5 py-10 sm:px-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 40px)' }}>
        <div className="w-full max-w-[400px] mx-auto">
          {/* who this is */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left mb-8 admin-rise">
            <img src={logo} alt="" className="w-16 h-16 rounded-full bg-white object-contain p-0.5 ring-1 ring-[var(--a-border)] shadow-[0_6px_18px_-10px_rgba(19,38,26,0.35)]" />
            <div className="mt-4 text-[17px] font-bold text-[var(--a-ink)]">Bushaashe Garuwa</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[var(--a-muted)]">
              <Icon name="lock" className="w-3.5 h-3.5" />
              Staff area
            </div>
          </div>

          <div className="admin-rise [animation-delay:80ms]">{children}</div>

          <a href="/" className="mt-8 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[var(--a-muted)] hover:text-[var(--a-ink)]">
            <Icon name="arrowLeft" className="w-3.5 h-3.5" />
            Back to the website
          </a>
        </div>
      </main>
    </div>
  );
}

/** Staff sign-in: email and password, checked by the API. */
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
            : 'Could not reach the server. Check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SignInFrame>
      <div className="admin-card !p-6 sm:!p-8 shadow-[0_1px_2px_rgba(19,38,26,0.04),0_20px_40px_-30px_rgba(19,38,26,0.35)]">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[var(--a-ink)]">Sign in</h1>
        <p className="text-[14px] text-[var(--a-muted)] mt-1 mb-6">Look after visits, bookings and the website.</p>

        {!apiEnabled && <p role="alert" className="rounded-xl bg-[#FCEDEC] text-[#9B2C25] text-sm px-4 py-3 mb-5">The API address is not set (VITE_API_URL), so there is nothing to sign in to.</p>}

        <form onSubmit={submit} noValidate className="space-y-4">
          <label className="block">
            <span className="block text-[13px] font-semibold text-[var(--a-ink)] mb-1.5">Email</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="next"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error !== ''}
              className={`admin-field ${error ? '!border-[#E2A29C]' : ''}`}
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="block text-[13px] font-semibold text-[var(--a-ink)] mb-1.5">Password</span>
            <span className="relative block">
              <input
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
                className={`admin-field !pr-12 ${error ? '!border-[#E2A29C]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Hide the password' : 'Show the password'}
                aria-pressed={show}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 admin-icon-btn"
              >
                <Icon name={show ? 'eyeOff' : 'eye'} className="w-[18px] h-[18px]" />
              </button>
            </span>
          </label>

          {error && (
            <p id="admin-signin-error" role="alert" className="flex items-start gap-2 rounded-xl bg-[#FCEDEC] text-[#9B2C25] text-[13.5px] px-3.5 py-2.5">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || !apiEnabled} className="admin-btn flex w-full !min-h-[46px] !text-[15px]">
            {busy ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>

      <p className="text-[12.5px] text-[var(--a-faint)] leading-relaxed text-center mt-5 px-2">
        You stay signed in for 12 hours. No account yet? Ask an owner to add you.
      </p>
    </SignInFrame>
  );
}
