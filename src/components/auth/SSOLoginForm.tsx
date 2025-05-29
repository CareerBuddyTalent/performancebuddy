
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Building2, Key, Users } from "lucide-react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { toast } from "sonner";

export function SSOLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSupabaseAuth();

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate SSO login
      toast.success(`SSO login with ${provider} initiated`);
      // In production, this would redirect to the SSO provider
    } catch (error) {
      toast.error("SSO login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <span className="text-blue-700">Enterprise SSO Authentication</span>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Active Directory / Azure AD
            </CardTitle>
            <CardDescription className="text-xs">
              Sign in with your corporate Microsoft account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => handleSSOLogin('Azure AD')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Continue with Azure AD
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="h-4 w-4" />
              SAML 2.0
            </CardTitle>
            <CardDescription className="text-xs">
              Enterprise SAML single sign-on
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => handleSSOLogin('SAML')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Continue with SAML
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              LDAP
            </CardTitle>
            <CardDescription className="text-xs">
              Lightweight Directory Access Protocol
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => handleSSOLogin('LDAP')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Continue with LDAP
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Enterprise-grade security with MFA and conditional access
        </div>
      </div>
    </div>
  );
}
