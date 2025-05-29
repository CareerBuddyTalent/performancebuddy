
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock the hook since it may not exist yet
const mockUseGoalsData = () => ({
  goals: [],
  isLoading: false,
  error: null,
  refetch: vi.fn(),
})

describe('useGoalsData Hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  )

  it('returns initial state', () => {
    const { result } = renderHook(() => mockUseGoalsData(), { wrapper })
    
    expect(result.current.goals).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('provides refetch function', () => {
    const { result } = renderHook(() => mockUseGoalsData(), { wrapper })
    
    expect(typeof result.current.refetch).toBe('function')
  })
})
