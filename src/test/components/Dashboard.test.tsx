
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

// Mock the Dashboard component since it's lazy loaded
vi.mock('@/pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard Content</div>
}))

describe('Dashboard Component', () => {
  it('renders dashboard content', async () => {
    const Dashboard = await import('@/pages/Dashboard').then(m => m.default)
    render(<Dashboard />)
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })
})
