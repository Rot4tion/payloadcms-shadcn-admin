/**
 * CRITICAL: Re-export from original @payloadcms/ui to share the same context
 * with Lexical RichText and other packages that import from @payloadcms/ui
 *
 * This ensures that:
 * 1. Lexical components can access the same ConfigProvider context
 * 2. All hooks (useConfig, etc.) work correctly across packages
 * 3. No context mismatch between custom and original packages
 */
'use client'

// Re-export everything from original package to share the same context
export {
  ConfigProvider,
  PageConfigProvider,
  useConfig,
  type ClientConfigContext,
} from '@payloadcms/ui'
