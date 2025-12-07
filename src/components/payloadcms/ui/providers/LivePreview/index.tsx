/**
 * Re-export LivePreviewProvider from original @payloadcms/ui
 * to avoid context conflicts with hooks like usePopupWindow
 */
'use client'

export { LivePreviewProvider } from '@payloadcms/ui'

// Export context and hooks from local file
export { LivePreviewContext, useLivePreviewContext, usePreviewURL } from './context.js'

// Alias for backwards compatibility
export { useLivePreviewContext as useLivePreview } from './context.js'
