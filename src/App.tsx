
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from './context/SupabaseAuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { PageLayout } from './components/PageLayout';
import { Outlet } from 'react-router-dom';

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
  KPITracking,
  AutomatedReviews,
  TeamInvitations
} from './pages/LazyPages';

function App() {
  const { user, isLoading, isAuthenticated } = useSupabaseAuth();

  console.log('App render - Loading:', isLoading, 'Authenticated:', isAuthenticated, 'User:', !!user);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    console.log('ProtectedRoute check - Loading:', isLoading, 'Authenticated:', isAuthenticated);
    
    if (isLoading) {
      console.log('ProtectedRoute: Showing loading state');
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      console.log('ProtectedRoute: Redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    console.log('ProtectedRoute: Rendering protected content');
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <PageLayout>
                  <Outlet />
                </PageLayout>
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
            <Route path="dashboard" element={<Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>} />
            <Route path="performance" element={<Suspense fallback={<div>Loading...</div>}><Performance /></Suspense>} />
            <Route path="kpi-tracking" element={<Suspense fallback={<div>Loading...</div>}><KPITracking /></Suspense>} />
            <Route path="automated-reviews" element={<Suspense fallback={<div>Loading...</div>}><AutomatedReviews /></Suspense>} />
            <Route path="performance-management" element={<Suspense fallback={<div>Loading...</div>}><PerformanceManagement /></Suspense>} />
            <Route path="skills" element={<Suspense fallback={<div>Loading...</div>}><Skills /></Suspense>} />
            <Route path="performance/reviews" element={<Suspense fallback={<div>Loading...</div>}><Reviews /></Suspense>} />
            <Route path="okrs" element={<Suspense fallback={<div>Loading...</div>}><OKRs /></Suspense>} />
            <Route path="okr-alignment" element={<Suspense fallback={<div>Loading...</div>}><OKRAlignment /></Suspense>} />
            <Route path="surveys" element={<Suspense fallback={<div>Loading...</div>}><Surveys /></Suspense>} />
            <Route path="learning" element={<Suspense fallback={<div>Loading...</div>}><Learning /></Suspense>} />
            <Route path="workflows" element={<Suspense fallback={<div>Loading...</div>}><Workflows /></Suspense>} />
            <Route path="integrations" element={<Suspense fallback={<div>Loading...</div>}><Integrations /></Suspense>} />
            <Route path="enterprise" element={<Suspense fallback={<div>Loading...</div>}><Enterprise /></Suspense>} />
            
            {/* Admin Routes - These will be protected by RoleGuard inside PageLayout */}
            <Route path="users" element={<Suspense fallback={<div>Loading...</div>}><UserManagement /></Suspense>} />
            <Route path="companies" element={<Suspense fallback={<div>Loading...</div>}><CompanyManagement /></Suspense>} />
            <Route path="review-templates" element={<Suspense fallback={<div>Loading...</div>}><ReviewTemplates /></Suspense>} />
            <Route path="team-invitations" element={<Suspense fallback={<div>Loading...</div>}><TeamInvitations /></Suspense>} />
            <Route path="testing" element={<Suspense fallback={<div>Loading...</div>}><TestingDashboard /></Suspense>} />
            
            <Route path="settings" element={<Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
