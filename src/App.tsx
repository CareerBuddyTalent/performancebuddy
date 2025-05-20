import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { GlobalLoading } from "@/components/ui/global-loading";
import { ErrorState } from "@/components/ui/error-state";
import PageLayout from "./components/PageLayout";
import React from 'react';
import analytics from './services/analytics';

// Lazy-loaded components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Performance = lazy(() => import('./pages/Performance'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const CompanyManagement = lazy(() => import('./pages/CompanyManagement'));
const Settings = lazy(() => import('./pages/Settings'));
const Surveys = lazy(() => import('./pages/Surveys'));
const Documentation = lazy(() => import('./pages/Documentation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OKRs = lazy(() => import('./pages/OKRs'));

// Define interface for ErrorBoundary props
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Error boundary component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    analytics.error(error.message || 'Unknown error');
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorState 
          title="Something went wrong" 
          message="We're sorry, but an unexpected error has occurred."
          fullScreen
          retry={() => window.location.reload()}
        />
      );
    }
    
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Initialize analytics when the App component mounts
  React.useEffect(() => {
    analytics.initialize();
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CompanyProvider>
            <NotificationProvider>
              <BrowserRouter>
                <AnalyticsProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Suspense fallback={<GlobalLoading fullScreen message="Loading application..." />}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        <Route path="/dashboard" element={
                          <PageLayout>
                            <Dashboard />
                          </PageLayout>
                        } />
                        
                        <Route path="/my-profile" element={
                          <PageLayout>
                            <MyProfile />
                          </PageLayout>
                        } />
                        
                        <Route path="/performance" element={
                          <PageLayout>
                            <Performance />
                          </PageLayout>
                        } />
                        
                        <Route path="/okrs" element={
                          <PageLayout>
                            <OKRs />
                          </PageLayout>
                        } />
                        
                        <Route path="/users" element={
                          <PageLayout allowedRoles={["admin", "manager"]}>
                            <UserManagement />
                          </PageLayout>
                        } />
                        
                        <Route path="/user/:userId" element={
                          <PageLayout allowedRoles={["admin", "manager"]}>
                            <UserDetail />
                          </PageLayout>
                        } />
                        
                        <Route path="/companies" element={
                          <PageLayout allowedRoles={["admin"]}>
                            <CompanyManagement />
                          </PageLayout>
                        } />
                        
                        <Route path="/settings" element={
                          <PageLayout>
                            <Settings />
                          </PageLayout>
                        } />
                        
                        <Route path="/surveys" element={
                          <PageLayout>
                            <Surveys />
                          </PageLayout>
                        } />
                        
                        <Route path="/documentation" element={
                          <PageLayout>
                            <Documentation />
                          </PageLayout>
                        } />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </TooltipProvider>
                </AnalyticsProvider>
              </BrowserRouter>
            </NotificationProvider>
          </CompanyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
