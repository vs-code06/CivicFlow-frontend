import React from 'react';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/admin/Dashboard';
import { Zones } from './pages/admin/Zones';
import { ZoneDetails } from './pages/admin/ZoneDetails';
import { Tasks } from './pages/admin/Tasks';
import { Fleet } from './pages/admin/Fleet';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { PersonnelDashboard } from './pages/personnel/PersonnelDashboard';
import { ResidentDashboard } from './pages/resident/ResidentDashboard';
import { Complaints } from './pages/admin/Complaints';

// Guard Component
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'personnel' | 'resident' }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-civic-green-600" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role check
  if (role && user?.role !== role) {
    // Redirect to correct dashboard if role mismatch
    if (user?.role === 'admin') return <Navigate to="/" replace />;
    if (user?.role === 'personnel') return <Navigate to="/driver" replace />;
    if (user?.role === 'resident') return <Navigate to="/resident" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route path="/" element={
        <ProtectedRoute role="admin">
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="zones" element={<Zones />} />
        <Route path="zones/:id" element={<ZoneDetails />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Personnel Routes */}
      <Route path="/driver" element={
        <ProtectedRoute role="personnel">
          <PersonnelDashboard />
        </ProtectedRoute>
      } />

      {/* Resident Routes */}
      <Route path="/resident" element={
        <ProtectedRoute role="resident">
          <ResidentDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="wasteheroes-theme">
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;



