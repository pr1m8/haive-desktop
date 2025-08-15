import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@haive/ui/theme';
import { Toaster } from '@haive/ui/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TerminalPage } from './pages/TerminalPage';
import { FilesPage } from './pages/FilesPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className=\"flex items-center justify-center h-screen\">
        <div className=\"animate-spin rounded-full h-32 w-32 border-b-2 border-primary\"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path=\"/\" element={<Navigate to=\"/dashboard\" replace />} />
        <Route path=\"/dashboard\" element={<DashboardPage />} />
        <Route path=\"/terminal\" element={<TerminalPage />} />
        <Route path=\"/files\" element={<FilesPage />} />
        <Route path=\"/settings\" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme=\"dark\" storageKey=\"haive-desktop-theme\">
        <AuthProvider>
          <Router>
            <AuthenticatedApp />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
