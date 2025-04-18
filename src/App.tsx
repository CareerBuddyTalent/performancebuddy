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
import SelfReview from "./pages/SelfReview";
import ReviewSkills from "./pages/ReviewSkills";
import PerformanceCycles from "./pages/PerformanceCycles";
import CompanyManagement from "./pages/CompanyManagement";
import NotFound from "./pages/NotFound";
import Performance from "@/pages/Performance";
import MyProfile from "@/pages/MyProfile";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

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
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Dashboard />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/my-profile" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <MyProfile />
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
                  <ProtectedRoute roles={["admin", "manager"]}>
                    <PageLayout allowedRoles={["admin", "manager"]}>
                      <UserManagement />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/user/:userId" element={
                  <ProtectedRoute roles={["admin", "manager"]}>
                    <PageLayout allowedRoles={["admin", "manager"]}>
                      <UserDetail />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/reviews" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Reviews />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/self-review" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <SelfReview />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/review-skills" element={
                  <ProtectedRoute roles={["admin"]}>
                    <PageLayout allowedRoles={["admin"]}>
                      <ReviewSkills />
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
                
                <Route path="/performance" element={
                  <ProtectedRoute roles={["admin", "manager"]}>
                    <PageLayout allowedRoles={["admin", "manager"]}>
                      <Performance />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Settings />
                    </PageLayout>
                  </ProtectedRoute>
                } />
                
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
