/**
 * Re-export RichTextField from @payloadcms/richtext-lexical
 * Since we now re-export ConfigProvider from @payloadcms/ui,
 * the context is shared and Lexical should work correctly.
 */
'use client'

export { RichTextField } from '@payloadcms/richtext-lexical/client'
