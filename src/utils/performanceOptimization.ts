
// Performance monitoring and optimization utilities
class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Start timing a performance metric
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  // End timing and log the result
  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    // Preload critical images
    const criticalImages = [
      '/placeholder.svg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Optimize font loading
  optimizeFontLoading(): void {
    // Add font-display: swap to improve text rendering
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize performance optimizations
  initialize(): void {
    // Run optimizations when the page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.preloadCriticalResources();
        this.optimizeFontLoading();
      });
    } else {
      this.preloadCriticalResources();
      this.optimizeFontLoading();
    }

    // Monitor Core Web Vitals
    this.monitorWebVitals();
  }

  private monitorWebVitals(): void {
    // Monitor Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (import.meta.env.DEV) {
          console.log('LCP:', entry.startTime);
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Monitor First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (import.meta.env.DEV) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      }
    }).observe({ type: 'first-input', buffered: true });

    // Monitor Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (import.meta.env.DEV && !entry.hadRecentInput) {
          console.log('CLS:', entry.value);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  const startTiming = () => performanceOptimizer.startTiming(componentName);
  const endTiming = () => performanceOptimizer.endTiming(componentName);

  return { startTiming, endTiming };
};

// Utility for debouncing expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Utility for throttling frequent operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
