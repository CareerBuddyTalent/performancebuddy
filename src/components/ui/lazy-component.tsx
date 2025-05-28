
import React, { ReactNode } from 'react';
import { useLazyLoad } from '@/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  height?: string;
  className?: string;
}

export function LazyComponent({ 
  children, 
  fallback, 
  height = 'auto',
  className = '' 
}: LazyComponentProps) {
  const { ref, inView } = useLazyLoad();

  if (!inView) {
    return (
      <div ref={ref} className={className} style={{ height }}>
        {fallback || <Skeleton className="w-full h-full" />}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
