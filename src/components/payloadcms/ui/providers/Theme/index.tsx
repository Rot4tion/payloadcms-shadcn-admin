/**
 * Re-export ThemeProvider and useTheme from original @payloadcms/ui
 * to share the same context with all packages
 */
'use client'

export { ThemeProvider, useTheme, defaultTheme } from '@payloadcms/ui'
export type { Theme } from '@payloadcms/ui'

// Define ThemeContext type locally as it's not exported from @payloadcms/ui
export type ThemeContext = {
  autoMode: boolean
  setTheme: (theme: 'auto' | 'dark' | 'light') => void
  theme: 'dark' | 'light'
}
