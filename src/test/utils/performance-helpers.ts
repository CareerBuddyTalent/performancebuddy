
import { expect } from 'vitest'

export const performanceThresholds = {
  renderTime: 50, // ms
  bundleSize: 5 * 1024 * 1024, // 5MB
  largeComponentLimit: 100, // lines of code
}

export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const startTime = performance.now()
  renderFn()
  const endTime = performance.now()
  return endTime - startTime
}

export const expectFastRender = async (renderFn: () => void) => {
  const renderTime = await measureRenderTime(renderFn)
  expect(renderTime).toBeLessThan(performanceThresholds.renderTime)
}

export const checkBundleSize = (size: number) => {
  expect(size).toBeLessThan(performanceThresholds.bundleSize)
}

export const mockPerformanceAPI = () => {
  if (typeof global.performance === 'undefined') {
    global.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
      getEntriesByName: () => [],
      getEntriesByType: () => [],
    } as any
  }
}
