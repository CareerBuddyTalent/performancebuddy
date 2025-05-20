
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Performance from './pages/Performance';
import EmployeeGoals from './pages/EmployeeGoals';
import Skills from './pages/Skills';
import Surveys from './pages/Surveys';
import PageLayout from './components/layout/PageLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './integrations/supabase/client';
import { User } from './types';

// Add import for ReviewTemplates page
import ReviewTemplates from "./pages/ReviewTemplates";

function AppContent() {
  const { setUser, setLoading } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }

          const userProfile: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.email || 'Unknown User',
            role: profile?.role || 'employee',
            profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'Unknown User')}&background=random`
          };
          setUser(userProfile);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    loadUser();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Dashboard />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Profile />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Performance />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee-goals"
        element={
          <ProtectedRoute>
            <PageLayout>
              <EmployeeGoals />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Skills />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/surveys"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Surveys />
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/review-templates" 
        element={
          <ProtectedRoute>
            <PageLayout>
              <ReviewTemplates />
            </PageLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
