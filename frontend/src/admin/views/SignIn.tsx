import { useState } from 'react';
import logo from '../../assets/brand/logo-small.webp';
import { photos, picture } from '../../assets/photos';
import { ApiError, apiEnabled } from '../../lib/api';
import { useAdminSession } from '../auth/AdminSession';
import { Icon } from '../components/icons';

const FIELD =
  'w-full rounded-2xl bg-[#F4EFE4]/70 border px-4 py-4 text-base text-[#1E3A29] placeholder:text-[#1E3A29]/30 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_4px_rgba(63,125,32,0.12)]';
const LABEL = 'text-[#1E3A29]/60 text-[12px] font-bold';

/**
 * Staff sign-in, drawn like the opening screen of a phone app: the photograph
 * of Meeshsho Keettaa across the top with the name over it, and the form on a
 * white sheet rising over the photograph. On a computer the photograph fills
 * the left half and the form sits on the right.
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

  const border = error ? 'border-[#C4622D]' : 'border-transparent focus:border-[#3F7D20]';

  return (
    <div className="min-h-[100svh] bg-[#F4EFE4] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* the photograph, with the name over it */}
      <div className="relative h-[40svh] min-h-[260px] lg:h-auto lg:min-h-[100svh] overflow-hidden">
        <img {...picture(photos.meeshsho, '(min-width: 1024px) 55vw, 100vw')} alt="" className="admin-ken absolute inset-0 w-full h-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,38,26,0.25)_0%,rgba(19,38,26,0.15)_40%,rgba(30,70,20,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-10 lg:bottom-14 px-6 lg:px-14 text-white" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <img src={logo} alt="" className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white p-0.5 shadow-lg mb-4 admin-rise" />
          <div className="font-display text-[2rem] lg:text-5xl font-extrabold tracking-tight leading-none admin-rise [animation-delay:80ms]">Bushaashe Garuwa</div>
          <div className="inline-flex items-center gap-2 mt-3 rounded-full bg-white/18 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase admin-rise [animation-delay:160ms]">
            <Icon name="lock" className="w-3.5 h-3.5" />
            Staff app
          </div>
        </div>
      </div>

      {/* the form, on a sheet rising over the photograph */}
      <main className="relative -mt-7 lg:mt-0 rounded-t-[30px] lg:rounded-none bg-white lg:bg-[#F4EFE4] flex flex-col lg:justify-center min-h-[calc(60svh+28px)] lg:min-h-0">
        <div className="w-full max-w-md mx-auto px-6 pt-8 pb-8 lg:px-10 admin-rise [animation-delay:120ms]">
          <div className="lg:bg-white lg:rounded-[28px] lg:p-10 lg:shadow-[0_30px_70px_-40px_rgba(19,38,26,0.45)]">
            <h1 className="font-display text-[1.9rem] font-extrabold text-[#1E3A29] leading-tight tracking-tight">Welcome back</h1>
            <p className="text-[#1E3A29]/55 text-[15px] leading-relaxed mt-1.5 mb-7">Sign in to look after visits, bookings and the website.</p>

            {!apiEnabled && (
              <p role="alert" className="rounded-2xl bg-[#C4622D]/12 text-[#8c4227] text-sm px-4 py-3 mb-5">
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
                <label htmlFor="admin-password" className={`block mb-2 ${LABEL}`}>
                  Password
                </label>
                <div className="relative">
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
                    className={`${FIELD} ${border} pr-14`}
                  />
                  {/* the eye: show the password to check it, hide it again */}
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide the password' : 'Show the password'}
                    aria-pressed={show}
                    className="hit-slim absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-xl text-[#1E3A29]/55 hover:text-[#346A1A] hover:bg-[#1E3A29]/5 transition-colors"
                  >
                    <Icon name={show ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
                {error && (
                  <p id="admin-signin-error" role="alert" className="text-[#9A4A20] text-sm font-semibold mt-2">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy || !apiEnabled}
                className="w-full min-h-[56px] mt-2 inline-flex items-center justify-center gap-2 bg-[#3F7D20] hover:bg-[#346A1A] active:scale-[0.98] text-white text-[16px] font-bold rounded-2xl shadow-[0_16px_30px_-16px_rgba(63,125,32,0.9)] transition-all disabled:opacity-60 disabled:active:scale-100"
              >
                {busy ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <Icon name="arrowRight" className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[#1E3A29]/45 text-[12px] leading-relaxed mt-6">
              You stay signed in for up to 12 hours, or until you sign out. No account yet? Ask an owner to add you.
            </p>
          </div>

          <a href="/" className="flex items-center justify-center gap-1.5 mt-8 text-[13px] font-semibold text-[#346A1A] hover:underline underline-offset-4">
            <Icon name="arrowLeft" className="w-3.5 h-3.5" />
            Back to the website
          </a>
        </div>
      </main>
    </div>
  );
}
