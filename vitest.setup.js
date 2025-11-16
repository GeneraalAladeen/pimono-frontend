import { vi } from 'vitest'

globalThis.console = {
  ...console,

  error: vi.fn(),
}