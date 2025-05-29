
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';

// Import contexts
import { SupabaseAuthProvider } from '@/context/SupabaseAuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CompanyProvider } from '@/context/CompanyContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AnalyticsProvider } from '@/context/AnalyticsContext';

// Import components
import PageLayout from '@/components/layout/PageLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/layout/RoleGuard';
import { GlobalLoading } from '@/components/ui/global-loading';

// Import pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import Collaboration from './pages/Collaboration';
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
  Enterprise
} from './pages/LazyPages';

function App() {
  return (
    <Router>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <SupabaseAuthProvider>
          <SecurityProvider>
            <CompanyProvider>
              <NotificationProvider>
                <ThemeProvider>
                  <AnalyticsProvider>
                    <div className="min-h-screen bg-background">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Protected routes with layout */}
                        <Route element={
                          <ProtectedRoute>
                            <SidebarProvider>
                              <PageLayout />
                            </SidebarProvider>
                          </ProtectedRoute>
                        }>
                          {/* Main routes */}
                          <Route path="/home" element={<Home />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          
                          {/* Work routes */}
                          <Route path="/performance" element={<Performance />} />
                          <Route path="/performance/reviews" element={<Reviews />} />
                          <Route path="/okrs" element={<OKRs />} />
                          <Route path="/okr-alignment" element={<OKRAlignment />} />
                          <Route path="/collaboration" element={<Collaboration />} />
                          <Route path="/skills" element={<Skills />} />
                          <Route path="/surveys" element={<Surveys />} />
                          
                          {/* Advanced features */}
                          <Route path="/learning" element={
                            <RoleGuard allowedRoles={['employee', 'manager', 'admin']}>
                              <Learning />
                            </RoleGuard>
                          } />
                          <Route path="/workflows" element={
                            <RoleGuard allowedRoles={['manager', 'admin']}>
                              <Workflows />
                            </RoleGuard>
                          } />
                          <Route path="/integrations" element={
                            <RoleGuard allowedRoles={['admin']}>
                              <Integrations />
                            </RoleGuard>
                          } />
                          
                          {/* Enterprise features */}
                          <Route path="/enterprise" element={
                            <RoleGuard allowedRoles={['admin']}>
                              <Enterprise />
                            </RoleGuard>
                          } />
                          
                          {/* Admin routes */}
                          <Route path="/users" element={
                            <RoleGuard allowedRoles={['admin', 'manager']}>
                              <UserManagement />
                            </RoleGuard>
                          } />
                          <Route path="/companies" element={
                            <RoleGuard allowedRoles={['admin']}>
                              <CompanyManagement />
                            </RoleGuard>
                          } />
                          <Route path="/review-templates" element={
                            <RoleGuard allowedRoles={['admin', 'manager']}>
                              <ReviewTemplates />
                            </RoleGuard>
                          } />
                          <Route path="/testing" element={
                            <RoleGuard allowedRoles={['admin']}>
                              <TestingDashboard />
                            </RoleGuard>
                          } />
                          
                          {/* Settings */}
                          <Route path="/settings" element={<Settings />} />
                        </Route>

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      
                      <Toaster />
                      <GlobalLoading />
                    </div>
                  </AnalyticsProvider>
                </ThemeProvider>
              </NotificationProvider>
            </CompanyProvider>
          </SecurityProvider>
        </SupabaseAuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
