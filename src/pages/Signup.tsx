
import { Navigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { SecureSignupForm } from "@/components/auth/SecureSignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Signup() {
  const { isAuthenticated } = useSupabaseAuth();
  const isMobile = useIsMobile();

  // Redirect to dashboard if already signed in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className={`${isMobile ? 'px-4 pt-6 pb-4' : 'px-6 pt-8 pb-6'}`}>
            <div className="flex flex-col items-center space-y-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">P</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">PerformanceBuddy</h1>
            </div>
            <CardTitle className={`text-center ${isMobile ? 'text-xl' : 'text-2xl'}`}>Create Account</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join thousands of teams improving performance
            </CardDescription>
          </CardHeader>
          <CardContent className={`${isMobile ? 'px-4 pb-6' : 'px-6 pb-8'}`}>
            <SecureSignupForm />
            <div className={`${isMobile ? 'mt-4' : 'mt-6'} text-center space-y-3`}>
              <Link 
                to="/login" 
                className="text-sm text-blue-600 hover:text-blue-500 block transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
            
            {/* Mobile-specific features */}
            {isMobile && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Download our mobile app for the best experience
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Trusted by teams worldwide • Enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
