
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
import RoleGuard from "@/components/layout/RoleGuard";

const queryClient = new QueryClient();

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
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </CompanyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
