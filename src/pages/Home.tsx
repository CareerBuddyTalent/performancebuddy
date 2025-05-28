import React from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import HomeHeader from "@/components/home/HomeHeader";

export default function Home() {
  const { user } = useSupabaseAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HomeHeader user={user} />
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add your home page content here */}
          <div className="col-span-4">
            <p>Welcome to your dashboard! This is a great place to showcase key metrics, important updates, and personalized content for the user.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

