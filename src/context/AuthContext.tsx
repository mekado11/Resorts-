import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  mobile?: string;
  country?: string;
  dateOfBirth?: string;
  emailVerified: boolean;
  marketingConsent: boolean;
  memberId?: string;
  createdAt: number;
  lastLoginAt?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  displayName: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  displayName: '',
});

const TOKEN_KEY = 'eldorado_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  // We read token from React state only (no localStorage — blocked in iframe)
  // Token is kept in memory and re-seeded on mount from a module-level variable
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signInMutation = useMutation(api.auth.signIn);
  const signOutMutation = useMutation(api.auth.signOut);

  const userQuery = useQuery(api.auth.getMe, token ? { token } : { token: undefined });

  // On mount, try to recover token from sessionStorage
  // (sessionStorage works in same tab but doesn't persist across closes — acceptable for hotel UX)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (stored) setToken(stored);
    } catch { /* blocked */ }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInMutation({ email, password });
    if (result.success && result.token) {
      setToken(result.token);
      try { sessionStorage.setItem(TOKEN_KEY, result.token); } catch { /* blocked */ }
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const signOut = async () => {
    if (token) await signOutMutation({ token });
    setToken(null);
    try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* blocked */ }
  };

  const user = userQuery ?? null;
  const displayName = user?.preferredName || user?.firstName || '';

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, displayName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
