import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Simple test component to verify setup works
function TestComponent({ message = 'Hello, Vitest!' }: { message?: string }) {
  return <div data-testid="test-message">{message}</div>
}

describe('Basic Setup Verification', () => {
  it('renders without crashing', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('test-message')).toBeInTheDocument()
  })

  it('displays the correct message', () => {
    render(<TestComponent message="Citronela MVP" />)
    expect(screen.getByTestId('test-message')).toHaveTextContent('Citronela MVP')
  })

  it('supports custom messages', () => {
    const customMessage = 'ONG Cannabis Medicinal'
    render(<TestComponent message={customMessage} />)
    expect(screen.getByTestId('test-message')).toHaveTextContent(customMessage)
  })
})

describe('Vitest Utilities', () => {
  it('adds numbers correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('handles arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('handles objects', () => {
    const obj = { name: 'Citronela', type: 'ONG' }
    expect(obj).toHaveProperty('name', 'Citronela')
  })
})