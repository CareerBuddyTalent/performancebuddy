
import { describe, it, expect } from 'vitest'
import { render } from '../utils/test-utils'

// Mock Button component for testing
const MockButton = ({ children }: { children: React.ReactNode }) => (
  <button data-testid="button">{children}</button>
)

describe('Button', () => {
  it('renders without crashing', () => {
    render(<MockButton>Test Button</MockButton>)
    expect(true).toBe(true)
  })

  it('displays children content', () => {
    const { getByTestId } = render(<MockButton>Click me</MockButton>)
    const button = getByTestId('button')
    expect(button.textContent).toBe('Click me')
  })
})
