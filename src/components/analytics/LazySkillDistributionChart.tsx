
import React from 'react';
import { LazyComponent } from '@/components/ui/lazy-component';
import SkillDistributionChart from './SkillDistributionChart';

export default function LazySkillDistributionChart() {
  return (
    <LazyComponent 
      height="400px"
      fallback={
        <div className="animate-pulse bg-gray-200 rounded-lg h-full flex items-center justify-center">
          <span className="text-gray-500">Loading chart...</span>
        </div>
      }
    >
      <SkillDistributionChart />
    </LazyComponent>
  );
}
