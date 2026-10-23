import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SESSION_ENDED_EVENT, adminApi } from '../api/adminClient';
import type { StaffUser } from '../api/types';

const STORAGE_KEY = 'bg-admin-session';

type Stored = { token: string; user: StaffUser | null };
const SIGNED_OUT: Stored = { token: '', user: null };

/** Kept in sessionStorage, so it is forgotten when the browser window closes. */
function readStored(): Stored {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as (Partial<Stored> & { email?: string }) | null;
    if (!saved?.token) return SIGNED_OUT;
    // a session saved before accounts had names and roles: the API fills them in when the app opens
    const user = saved.user ?? (saved.email ? { id: 0, email: saved.email, name: '', role: 'staff' as const, mustChangePassword: false } : null);
    return { token: saved.token, user };
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
  user: StaffUser | null;
  /** their email, kept for the places that only show that */
  email: string;
  /** may add and manage staff accounts */
  isOwner: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  /** after a change to one's own account (a new name, a new password) */
  setUser: (user: StaffUser) => void;
};

const SessionContext = createContext<Session | null>(null);

/** First name, or the part of the email before the @, for greetings */
export const firstName = (user: StaffUser | null) => (user?.name.trim().split(/\s+/)[0] || user?.email.split('@')[0] || '');

/** One or two letters for the round picture of a person */
export const initials = (name: string, email = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0]![0]! + words[words.length - 1]![0]! : (words[0] ?? email).slice(0, 2);
  return letters.toUpperCase();
};

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(readStored);

  const save = useCallback((next: Stored) => {
    store(next);
    setSession(next);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      // throws when the email or password is wrong, or the API cannot be reached
      const result = await adminApi.signIn(email, password);
      save({ token: result.token, user: result.user });
    },
    [save],
  );

  const forget = useCallback(() => save(SIGNED_OUT), [save]);

  const signOut = useCallback(() => {
    // tell the API to end the session; the browser forgets it either way
    if (session.token) void adminApi.signOut(session.token).catch(() => undefined);
    forget();
  }, [session.token, forget]);

  const setUser = useCallback((user: StaffUser) => save({ token: session.token, user }), [save, session.token]);

  // when the app opens, the latest name and role (an owner may have changed them)
  useEffect(() => {
    if (!session.token) return;
    adminApi
      .session(session.token)
      .then(({ user }) => save({ token: session.token, user }))
      .catch(() => undefined); // a session that ran out is handled by SESSION_ENDED_EVENT
    // only once per session
  }, [session.token]); // eslint-disable-line react-hooks/exhaustive-deps

  // the API said the session is no longer valid (it ran out, or the password changed)
  useEffect(() => {
    window.addEventListener(SESSION_ENDED_EVENT, forget);
    return () => window.removeEventListener(SESSION_ENDED_EVENT, forget);
  }, [forget]);

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      email: session.user?.email ?? '',
      isOwner: session.user?.role === 'owner',
      signedIn: session.token !== '',
      signIn,
      signOut,
      setUser,
    }),
    [session, signIn, signOut, setUser],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAdminSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useAdminSession must be used inside AdminSessionProvider');
  return session;
}
