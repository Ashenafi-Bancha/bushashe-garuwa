import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SESSION_ENDED_EVENT, adminApi } from '../api/adminClient';

const STORAGE_KEY = 'bg-admin-session';

type Stored = { token: string; email: string };
const SIGNED_OUT: Stored = { token: '', email: '' };

/** Kept in sessionStorage, so it is forgotten when the browser window closes. */
function readStored(): Stored {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<Stored> | null;
    return saved?.token ? { token: saved.token, email: saved.email ?? '' } : SIGNED_OUT;
  } catch {
    return SIGNED_OUT;
  }
}

function store(session: Stored) {
  try {
    if (session.token) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private browsing: the session stays in memory only */
  }
}

type Session = {
  /** what the API gave this browser at sign-in; sent with every staff request */
  token: string;
  /** who is signed in */
  email: string;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(readStored);

  const signIn = useCallback(async (email: string, password: string) => {
    // throws when the email or password is wrong, or the API cannot be reached
    const result = await adminApi.signIn(email, password);
    const next = { token: result.token, email: result.user.email };
    store(next);
    setSession(next);
  }, []);

  const forget = useCallback(() => {
    store(SIGNED_OUT);
    setSession(SIGNED_OUT);
  }, []);

  const signOut = useCallback(() => {
    // tell the API to end the session; the browser forgets it either way
    if (session.token) void adminApi.signOut(session.token).catch(() => undefined);
    forget();
  }, [session.token, forget]);

  // the API said the session is no longer valid (it ran out, or the password changed)
  useEffect(() => {
    window.addEventListener(SESSION_ENDED_EVENT, forget);
    return () => window.removeEventListener(SESSION_ENDED_EVENT, forget);
  }, [forget]);

  const value = useMemo(
    () => ({ token: session.token, email: session.email, signedIn: session.token !== '', signIn, signOut }),
    [session, signIn, signOut],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAdminSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useAdminSession must be used inside AdminSessionProvider');
  return session;
}
