
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "@/context/SupabaseAuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/components/notifications/NotificationSystem";
import { ReminderSystem } from "@/components/automation/ReminderSystem";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalLoading } from "@/components/ui/global-loading";

// Lazy load pages
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
  NotFound
} from "@/pages/LazyPages";

// Import the new collaboration page
import Collaboration from "@/pages/Collaboration";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SupabaseAuthProvider>
          <SecurityProvider>
            <NotificationProvider>
              <Router>
                <ReminderSystem />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected routes with lazy loading */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Suspense fallback={<GlobalLoading message="Loading page..." />}>
                            <Outlet />
                          </Suspense>
                        </PageLayout>
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="home" element={<Home />} />
                    <Route path="performance" element={<Performance />} />
                    <Route path="performance/reviews" element={<Reviews />} />
                    <Route path="performance/templates" element={<ReviewTemplates />} />
                    <Route path="okrs" element={<OKRs />} />
                    <Route path="okrs/alignment" element={<OKRAlignment />} />
                    <Route path="collaboration" element={<Collaboration />} />
                    <Route path="skills" element={<Skills />} />
                    <Route path="surveys" element={<Surveys />} />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "manager"]}>
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="companies"
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <CompanyManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="settings" element={<Settings />} />
                    <Route 
                      path="testing" 
                      element={
                        <ProtectedRoute requiredRoles={["admin"]}>
                          <TestingDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  
                  {/* 404 page */}
                  <Route path="*" element={
                    <Suspense fallback={<GlobalLoading message="Loading..." />}>
                      <NotFound />
                    </Suspense>
                  } />
                </Routes>
              </Router>
              <Toaster position="top-right" />
            </NotificationProvider>
          </SecurityProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
