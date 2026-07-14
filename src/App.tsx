import { useEffect, useState, type ReactNode } from 'react';
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom';
import LEIDashboard from './pages/lei/LEIDashboard';
import { isAuthAvailable } from './api';
import { supabase } from './supabaseClient';
import styles from './App.module.css';

function TopNav() {
  return (
    <header className={styles.nav}>
      <div className={styles.brand}>Litera</div>
      <nav className={styles.links}>
        <NavLink
          to="/dashboard/lei"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          My LEI Score
        </NavLink>
      </nav>
    </header>
  );
}

function useIsAuthed(): boolean | null {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    // Dev/demo mode (VITE_DEV_JWT) counts as authenticated.
    if (import.meta.env.VITE_DEV_JWT) {
      setAuthed(true);
      return;
    }
    if (!supabase) {
      setAuthed(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
  }, []);
  return authed;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const authed = useIsAuthed();
  if (authed === null) return null; // resolving
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Login() {
  return (
    <div className={styles.login}>
      <h1>Litera</h1>
      <p>
        {isAuthAvailable()
          ? 'Sign in to view your LEI dashboard.'
          : 'Auth is not configured. Set VITE_DEV_JWT (dev) or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/lei" replace />} />
        <Route
          path="/dashboard/lei"
          element={
            <ProtectedRoute>
              <LEIDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
