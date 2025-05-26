
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { ClerkAuthProvider } from "@/context/ClerkAuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Performance from "@/pages/Performance";
import Skills from "@/pages/Skills";
import Reviews from "@/pages/Reviews";
import OKRs from "@/pages/OKRs";
import OKRAlignment from "@/pages/OKRAlignment";
import UserManagement from "@/pages/UserManagement";
import CompanyManagement from "@/pages/CompanyManagement";
import ReviewTemplates from "@/pages/ReviewTemplates";
import Settings from "@/pages/Settings";
import TestingDashboard from "@/pages/TestingDashboard";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ClerkAuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Outlet />
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
                <Route path="skills" element={<Skills />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </ClerkAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
