
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Performance from "@/pages/Performance";
import Skills from "@/pages/Skills";
import Reviews from "@/pages/Reviews";
import OKRs from "@/pages/OKRs";
import UserManagement from "@/pages/UserManagement";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="performance" element={<Performance />} />
              <Route path="performance/reviews" element={<Reviews />} />
              <Route path="okrs" element={<OKRs />} />
              <Route path="skills" element={<Skills />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRoles={["admin", "manager"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
