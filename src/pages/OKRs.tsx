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
    <OKRDashboard>
      <PersonalOKRs userId={user.id} />
      {user.role === 'manager' && (
        <TeamObjectives managerId={user.id} />
      )}
    </OKRDashboard>
  );
}
