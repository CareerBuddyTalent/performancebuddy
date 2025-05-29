
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Supabase context
const MockSupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-auth-provider">{children}</div>
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <MockSupabaseAuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </MockSupabaseAuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Export everything from @testing-library/react
export * from '@testing-library/react'
// Override render with our custom render
export { customRender as render }
// Explicitly export the commonly used functions from @testing-library/dom
export { screen, fireEvent, waitFor }
