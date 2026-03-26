import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  const storage = window.localStorage as { clear?: () => void } | undefined
  storage?.clear?.()
  cleanup()
})
