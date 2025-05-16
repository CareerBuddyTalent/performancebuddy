
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Spinner } from "@/components/ui/spinner";
import PageLayout from "./components/PageLayout";

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Spinner size="lg" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

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
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CompanyProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
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
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </CompanyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
