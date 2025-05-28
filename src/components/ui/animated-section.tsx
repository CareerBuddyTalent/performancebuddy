
import React, { ReactNode } from 'react';
import { useAnimationTrigger } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-in-up' | 'scale-in';
  className?: string;
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  animation = 'fade-in',
  className = '',
  delay = 0
}: AnimatedSectionProps) {
  const { ref, inView } = useAnimationTrigger();

  const animationClasses = {
    'fade-in': 'transition-all duration-700 ease-out',
    'slide-in-up': 'transition-all duration-700 ease-out',
    'scale-in': 'transition-all duration-500 ease-out',
  };

  const visibleClasses = {
    'fade-in': 'opacity-100 translate-y-0',
    'slide-in-up': 'opacity-100 translate-y-0',
    'scale-in': 'opacity-100 scale-100',
  };

  const hiddenClasses = {
    'fade-in': 'opacity-0 translate-y-4',
    'slide-in-up': 'opacity-0 translate-y-8',
    'scale-in': 'opacity-0 scale-95',
  };

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        inView ? visibleClasses[animation] : hiddenClasses[animation],
        className
      )}
      style={{ 
        transitionDelay: inView ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}
