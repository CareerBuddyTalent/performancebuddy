
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock environment variables
Object.defineProperty(process.env, 'VITE_SUPABASE_URL', {
  value: 'https://test.supabase.co',
  writable: true
})

Object.defineProperty(process.env, 'VITE_SUPABASE_ANON_KEY', {
  value: 'test-anon-key',
  writable: true
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return [] }
}

global.IntersectionObserver = MockIntersectionObserver as any

// Mock ResizeObserver
class MockResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

global.ResizeObserver = MockResizeObserver as any

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
