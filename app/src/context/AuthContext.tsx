import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, UserRole } from '../types';
import { mockUsers } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PASSWORDS: Record<string, string> = {
  'admin@acmefinancial.ca': 'Xcelr8Admin2026!',
  'sarah.chen@acmefinancial.ca': 'Xcelr8Mkt2026!',
  'james.wilson@acmefinancial.ca': 'Xcelr8Mkt2026!',
  'priya.sharma@acmefinancial.ca': 'Xcelr8Legal2026!',
  'david.laurent@acmefinancial.ca': 'Xcelr8Legal2026!',
};

async function fetchUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: data.email || firebaseUser.email || '',
        name: data.name || firebaseUser.displayName || '',
        role: data.role || 'marketer',
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    }
  } catch {
    // Firestore unavailable — continue to fallback
  }

  // Fallback: match by email to mock user (preserves role info)
  const mock = mockUsers.find((u) => u.email === firebaseUser.email);
  if (mock) return { ...mock, id: firebaseUser.uid };

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email || '',
    role: 'marketer',
    createdAt: new Date(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on page load via Firebase Auth persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(firebaseUser);
      setUser(profile);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      const msg =
        firebaseErr.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : firebaseErr.code === 'auth/too-many-requests'
            ? 'Too many attempts. Try again later.'
            : firebaseErr.message || 'Sign in failed';
      setError(msg);
      throw err;
    }
  };

  const loginDemo = async (role: UserRole) => {
    const found = mockUsers.find((u) => u.role === role);
    if (!found) return;

    try {
      await login(found.email, DEMO_PASSWORDS[found.email]);
    } catch {
      // Firebase Auth not configured or users not seeded — use mock mode
      setError(null);
      setUser(found);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // If Firebase sign out fails, just clear local state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
