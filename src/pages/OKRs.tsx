
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import OKRDashboard from "@/components/okr/OKRDashboard";
import PersonalOKRs from "@/pages/PersonalOKRs";
import TeamObjectives from "@/components/okr/TeamObjectives";

export default function OKRs() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("my-okrs");

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">OKRs Management</h1>
      
      <div className="space-y-6">
        <PersonalOKRs />
        
        {user.role === 'manager' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Objectives</h2>
            <TeamObjectives managerId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
}
