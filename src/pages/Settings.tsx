import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettingsForm from "@/components/settings/AccountSettingsForm";
import EmailSettingsForm from "@/components/settings/EmailSettingsForm";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function Settings() {
  const { user } = useSupabaseAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="space-y-4">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your profile information and manage your account.
                  </p>
                </div>
                <AccountSettingsForm user={user} />
              </div>
            </TabsContent>
            <TabsContent value="email">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your email preferences and notifications.
                  </p>
                </div>
                <EmailSettingsForm user={user} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
