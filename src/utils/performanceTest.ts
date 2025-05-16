
import { testComponentRender } from './testUtils';

/**
 * Run performance tests on a component and return metrics
 * 
 * @param Component The React component to test
 * @param props Optional props to pass to the component
 * @param iterations Number of render iterations to perform
 */
export const measureComponentPerformance = (
  Component: React.ComponentType<any>, 
  props = {}, 
  iterations = 10
): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {
    renderTimes: [],
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: Infinity,
    memoryUsage: {},
    errors: []
  };

  try {
    // Check if performance API is available
    if (typeof performance === 'undefined') {
      throw new Error('Performance API not available in this environment');
    }

    // Run rendering iterations and measure time
    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        const rendered = testComponentRender(Component, props);
        const endTime = performance.now();
        
        if (rendered) {
          const renderTime = endTime - startTime;
          metrics.renderTimes.push(renderTime);
          metrics.maxRenderTime = Math.max(metrics.maxRenderTime, renderTime);
          metrics.minRenderTime = Math.min(metrics.minRenderTime, renderTime);
        } else {
          metrics.errors.push(`Render failed on iteration ${i}`);
        }
      } catch (error) {
        metrics.errors.push(`Error in iteration ${i}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Calculate averages if we have successful renders
    if (metrics.renderTimes.length > 0) {
      const sum = metrics.renderTimes.reduce((acc, time) => acc + time, 0);
      metrics.averageRenderTime = sum / metrics.renderTimes.length;
    } else {
      metrics.minRenderTime = 0; // Reset min time if no successful renders
    }

    // Try to get memory usage if available
    if (window.performance && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      metrics.memoryUsage = {
        usedJSHeapSize: memory?.usedJSHeapSize,
        totalJSHeapSize: memory?.totalJSHeapSize,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit
      };
    }
  } catch (error) {
    metrics.errors.push(`Performance test error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return metrics;
};

/**
 * Run a performance audit on the current page
 */
export const auditPagePerformance = async (): Promise<PagePerformanceAudit> => {
  const audit: PagePerformanceAudit = {
    domNodes: 0,
    resourceCount: 0,
    totalResourceSize: 0,
    loadTime: 0,
    largeElements: [],
    accessibilityIssues: [],
    timeToInteractive: 0
  };

  try {
    // Count DOM nodes
    audit.domNodes = document.querySelectorAll('*').length;

    // Get resource information
    if (window.performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      audit.resourceCount = resources.length;
      
      // Calculate total resource size and load time
      let totalSize = 0;
      let maxLoadTime = 0;
      
      resources.forEach(resource => {
        if ('transferSize' in resource) {
          totalSize += (resource as any).transferSize || 0;
        }
        
        if ('duration' in resource) {
          maxLoadTime = Math.max(maxLoadTime, resource.duration);
        }
      });
      
      audit.totalResourceSize = totalSize;
      audit.loadTime = maxLoadTime;
    }

    // Find large elements that might cause performance issues
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Identify elements with large dimensions that might impact rendering
      if (rect.width > 1000 || rect.height > 1000) {
        audit.largeElements.push({
          element: el.tagName.toLowerCase(),
          id: (el as HTMLElement).id || undefined,
          className: (el as HTMLElement).className || undefined,
          width: rect.width,
          height: rect.height
        });
      }
    });

    // Check for accessibility issues using our utility
    const accessibilityCheck = await import('./testUtils').then(module => {
      return module.checkAccessibility();
    });
    
    if (accessibilityCheck && accessibilityCheck.hasIssues) {
      audit.accessibilityIssues = accessibilityCheck.issues;
    }

    // Estimate time to interactive
    if (window.performance && performance.timing) {
      const navStart = performance.timing.navigationStart;
      const loadEventEnd = performance.timing.loadEventEnd;
      if (navStart && loadEventEnd) {
        audit.timeToInteractive = loadEventEnd - navStart;
      }
    }
  } catch (error) {
    console.error('Error during performance audit:', error);
  }

  return audit;
};

// Type definitions
export interface PerformanceMetrics {
  renderTimes: number[];
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  memoryUsage: Record<string, number | undefined>;
  errors: string[];
}

export interface PagePerformanceAudit {
  domNodes: number;
  resourceCount: number;
  totalResourceSize: number;
  loadTime: number;
  largeElements: Array<{
    element: string;
    id?: string;
    className?: string;
    width: number;
    height: number;
  }>;
  accessibilityIssues: string[];
  timeToInteractive: number;
}

// Thresholds for performance warnings
export const PERFORMANCE_THRESHOLDS = {
  RENDER_TIME_WARNING: 50, // ms
  RENDER_TIME_ERROR: 200, // ms
  MAX_DOM_NODES: 1500,
  MAX_RESOURCES: 100,
  MAX_RESOURCE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_LOAD_TIME: 3000, // 3 seconds
};
