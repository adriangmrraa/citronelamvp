import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/headers (requires Next.js runtime, unavailable in unit tests)
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));