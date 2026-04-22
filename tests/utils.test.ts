import { describe, it, expect } from 'vitest'

// --- Utility Functions for Testing ---

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// --- Tests ---

describe('cn utility', () => {
  it('joins multiple class names', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('returns empty string for all falsy', () => {
    expect(cn(undefined, null, false)).toBe('')
  })
})

describe('capitalize utility', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('leaves already capitalized strings unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })
})

describe('truncate utility', () => {
  it('returns original string if shorter than maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('truncates with ellipsis when longer', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...')
  })

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})

describe('formatCurrency utility', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('handles decimal amounts', () => {
    expect(formatCurrency(99.99)).toBe('$99.99')
  })

  it('handles large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
  })
})

describe('isValidEmail utility', () => {
  it('validates correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.org')).toBe(true)
  })

  it('rejects invalid email formats', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('no@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('generateId utility', () => {
  it('generates a non-empty string', () => {
    expect(generateId()).toBeTruthy()
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})