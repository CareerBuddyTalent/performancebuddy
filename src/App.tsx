import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseAuth } from './context/SupabaseAuthContext';
import LandingPage from './pages/LandingPage';
import PageLayout from './components/PageLayout';
import RoleGuard from './components/auth/RoleGuard';

import { 
  Dashboard, 
  Home, 
  Performance, 
  Skills, 
  Reviews, 
  OKRs, 
  OKRAlignment,
  UserManagement, 
  CompanyManagement, 
  ReviewTemplates, 
  Surveys, 
  Settings, 
  TestingDashboard,
  NotFound,
  Learning,
  Workflows,
  Integrations,
  Enterprise,
  PerformanceManagement,
  KPITracking
} from './pages/LazyPages';

function App() {
  const [loading, setLoading] = useState(true);
  const { session, user, role } = useSupabaseAuth();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Optionally fetch user details or perform other session-related tasks
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [session, supabase]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public route for landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PageLayout />}>
              <Route path="/home" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>} />
              <Route path="/performance" element={<Suspense fallback={<div>Loading...</div>}><Performance /></Suspense>} />
              <Route path="/kpi-tracking" element={<Suspense fallback={<div>Loading...</div>}><KPITracking /></Suspense>} />
              <Route path="/performance-management" element={<Suspense fallback={<div>Loading...</div>}><PerformanceManagement /></Suspense>} />
              <Route path="/skills" element={<Suspense fallback={<div>Loading...</div>}><Skills /></Suspense>} />
              <Route path="/performance/reviews" element={<Suspense fallback={<div>Loading...</div>}><Reviews /></Suspense>} />
              <Route path="/okrs" element={<Suspense fallback={<div>Loading...</div>}><OKRs /></Suspense>} />
              <Route path="/okr-alignment" element={<Suspense fallback={<div>Loading...</div>}><OKRAlignment /></Suspense>} />
              <Route path="/surveys" element={<Suspense fallback={<div>Loading...</div>}><Surveys /></Suspense>} />
              <Route path="/learning" element={<Suspense fallback={<div>Loading...</div>}><Learning /></Suspense>} />
              <Route path="/workflows" element={<Suspense fallback={<div>Loading...</div>}><Workflows /></Suspense>} />
              <Route path="/integrations" element={<Suspense fallback={<div>Loading...</div>}><Integrations /></Suspense>} />
              <Route path="/enterprise" element={<Suspense fallback={<div>Loading...</div>}><Enterprise /></Suspense>} />
              
              {/* Admin Routes */}
              <Route element={<RoleGuard allowedRoles={['admin', 'manager']} />}>
                <Route path="/users" element={<Suspense fallback={<div>Loading...</div>}><UserManagement /></Suspense>} />
              </Route>
              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/companies" element={<Suspense fallback={<div>Loading...</div>}><CompanyManagement /></Suspense>} />
                <Route path="/review-templates" element={<Suspense fallback={<div>Loading...</div>}><ReviewTemplates /></Suspense>} />
                <Route path="/testing" element={<Suspense fallback={<div>Loading...</div>}><TestingDashboard /></Suspense>} />
              </Route>
              
              <Route path="/settings" element={<Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>} />
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
