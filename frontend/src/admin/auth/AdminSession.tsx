import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { adminApi } from '../api/adminClient';

const STORAGE_KEY = 'bg-admin-key';

/** Kept in sessionStorage, so it is forgotten when the browser window closes. */
function readStoredKey(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

type Session = {
  key: string;
  signedIn: boolean;
  signIn: (key: string) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState(readStoredKey);

  const signIn = useCallback(async (candidate: string) => {
    await adminApi.checkKey(candidate); // throws when the key is wrong or the API is unreachable
    try {
      sessionStorage.setItem(STORAGE_KEY, candidate);
    } catch {
      /* private browsing: the key stays in memory only */
    }
    setKey(candidate);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing stored */
    }
    setKey('');
  }, []);

  const value = useMemo(() => ({ key, signedIn: key !== '', signIn, signOut }), [key, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAdminSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useAdminSession must be used inside AdminSessionProvider');
  return session;
}
