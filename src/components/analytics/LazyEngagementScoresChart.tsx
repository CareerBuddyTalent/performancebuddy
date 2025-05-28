
import React from 'react';
import { LazyComponent } from '@/components/ui/lazy-component';
import EngagementScoresChart from './EngagementScoresChart';

export default function LazyEngagementScoresChart() {
  return (
    <LazyComponent 
      height="320px"
      fallback={
        <div className="animate-pulse bg-gray-200 rounded-lg h-full flex items-center justify-center md:col-span-2">
          <span className="text-gray-500">Loading engagement data...</span>
        </div>
      }
    >
      <EngagementScoresChart />
    </LazyComponent>
  );
}
