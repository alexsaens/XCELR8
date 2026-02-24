import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MarketerDashboard from './pages/MarketerDashboard';
import NewSubmission from './pages/NewSubmission';
import SubmissionDetail from './pages/SubmissionDetail';
import LegalDashboard from './pages/LegalDashboard';
import LegalReview from './pages/LegalReview';
import AdminUsers from './pages/AdminUsers';
import AdminRepository from './pages/AdminRepository';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminAudit from './pages/AdminAudit';

function AppRoutes() {
  const { user } = useAuth();

  const homeRedirect = user?.role === 'legal' ? '/legal' : '/dashboard';

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route
          path="/"
          element={user ? <Navigate to={homeRedirect} replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={homeRedirect} replace /> : <Login />}
        />

        {/* Marketer + Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['marketer', 'admin']}>
              <MarketerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute allowedRoles={['marketer', 'admin']}>
              <NewSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submission/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetail />
            </ProtectedRoute>
          }
        />

        {/* Legal + Admin */}
        <Route
          path="/legal"
          element={
            <ProtectedRoute allowedRoles={['legal', 'admin']}>
              <LegalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal/review/:id"
          element={
            <ProtectedRoute allowedRoles={['legal', 'admin']}>
              <LegalReview />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/repository"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRepository />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAudit />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
