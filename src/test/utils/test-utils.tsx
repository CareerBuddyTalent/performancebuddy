

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import screen, fireEvent, and waitFor directly
import { screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { waitFor } from '@testing-library/react'

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
// Explicitly export the commonly used functions
export { screen, fireEvent, waitFor }

