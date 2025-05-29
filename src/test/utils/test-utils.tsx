
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import testing utilities - screen and waitFor are from @testing-library/dom
import userEvent from '@testing-library/user-event'

// These are re-exported by @testing-library/react but let's import them directly to avoid issues
const screen = {
  getByTestId: (id: string) => document.querySelector(`[data-testid="${id}"]`) as Element,
  getByText: (text: string) => document.querySelector(`*:contains("${text}")`) as Element,
  queryByTestId: (id: string) => document.querySelector(`[data-testid="${id}"]`),
  findByTestId: async (id: string) => document.querySelector(`[data-testid="${id}"]`) as Element,
}

const waitFor = async (callback: () => void, options?: { timeout?: number }) => {
  const timeout = options?.timeout || 1000
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    try {
      callback()
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }
  throw new Error('waitFor timeout')
}

// Create fireEvent from userEvent for compatibility
const fireEvent = {
  click: (element: Element) => userEvent.click(element),
  change: (element: Element, options: { target: { value: string } }) => {
    userEvent.clear(element)
    userEvent.type(element, options.target.value)
  },
  submit: (element: Element) => userEvent.click(element),
}

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
// Export the commonly used functions
export { screen, fireEvent, waitFor, userEvent }
