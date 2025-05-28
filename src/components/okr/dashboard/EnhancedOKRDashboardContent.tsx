
import React from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { LazyComponent } from '@/components/ui/lazy-component';
import { OKRCompletionCard } from './OKRCompletionCard';
import { OKRStatusChart } from './OKRStatusChart';

export default function EnhancedOKRDashboardContent() {
  // Sample data - in a real app, this would come from an API
  const objectiveProgress = [
    { name: 'Completed', value: 25, color: '#4ade80' },
    { name: 'In Progress', value: 45, color: '#60a5fa' },
    { name: 'At Risk', value: 20, color: '#f97316' },
    { name: 'Not Started', value: 10, color: '#94a3b8' },
  ];

  const keyResultsData = [
    { name: 'On Track', value: 60, color: '#4ade80' },
    { name: 'Behind', value: 30, color: '#f97316' },
    { name: 'At Risk', value: 10, color: '#ef4444' },
  ];

  const alignmentScore = 85;

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatedSection animation="scale-in" delay={100}>
            <OKRCompletionCard
              title="OKR Completion"
              description="Overall progress on objectives"
              value={70}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="scale-in" delay={200}>
            <OKRCompletionCard
              title="Key Results"
              description="Progress on key metrics"
              value={objectiveProgress.length}
              showProgress={false}
              subtitle={`${keyResultsData[0].value}% on track`}
            />
          </AnimatedSection>
          
          <AnimatedSection animation="scale-in" delay={300}>
            <OKRCompletionCard
              title="Alignment Score"
              description="Objectives aligned with company goals"
              value={alignmentScore}
            />
          </AnimatedSection>
        </div>
      </AnimatedSection>
      
      <AnimatedSection animation="slide-in-up" delay={400}>
        <div className="grid gap-4 md:grid-cols-2">
          <LazyComponent height="400px">
            <OKRStatusChart
              title="Objective Status"
              description="Distribution by completion status"
              data={objectiveProgress}
            />
          </LazyComponent>
          
          <LazyComponent height="400px">
            <OKRStatusChart
              title="Key Results Status"
              description="Distribution by performance"
              data={keyResultsData}
            />
          </LazyComponent>
        </div>
      </AnimatedSection>
    </div>
  );
}
