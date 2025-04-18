
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettingsForm from "@/components/settings/AccountSettingsForm";
import EmailSettingsForm from "@/components/settings/EmailSettingsForm";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-4">
          <AccountSettingsForm />
        </TabsContent>
        
        <TabsContent value="email" className="mt-4">
          <EmailSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
