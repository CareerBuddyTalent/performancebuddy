
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";
import { NotificationProvider } from "./context/NotificationContext";
import PageLayout from "./components/PageLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EmployeeGoals from "./pages/EmployeeGoals";
import EmployeeFeedback from "./pages/EmployeeFeedback";
import Skills from "./pages/Skills";
import Surveys from "./pages/Surveys";
import UserManagement from "./pages/UserManagement";
import UserDetail from "./pages/UserDetail";
import Reviews from "./pages/Reviews";
import PerformanceCycles from "./pages/PerformanceCycles";
import CompanyManagement from "./pages/CompanyManagement";
import NotFound from "./pages/NotFound";
import Performance from "@/pages/Performance";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has required role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Main app component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CompanyProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route path="/home" element={
                  <ProtectedRoute roles={["manager", "employee"]}>
                    <PageLayout allowedRoles={["manager", "employee"]}>
                      <Home />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Dashboard />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <EmployeeGoals />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <EmployeeFeedback />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/skills" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Skills />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/surveys" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Surveys />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <UserManagement />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/user/:userId" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <UserDetail />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/reviews" element={
                  <ProtectedRoute roles={["admin", "manager"]}>
                    <PageLayout>
                      <Reviews />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/cycles" element={
                  <ProtectedRoute roles={["admin", "manager"]}>
                    <PageLayout>
                      <PerformanceCycles />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/companies" element={
                  <ProtectedRoute roles={["admin"]}>
                    <PageLayout>
                      <CompanyManagement />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/performance" element={<Performance />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </CompanyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
