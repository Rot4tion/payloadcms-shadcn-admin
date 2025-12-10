'use client'
import { useDocumentInfo } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

/**
 * VersionsPill - Version count badge (Tailwind version)
 *
 * Original SCSS pill-version-count:
 * - line-height: base(0.8) = 16px
 * - min-width: base(0.8) = 16px
 * - text-align: center
 * - background-color: var(--theme-elevation-100)
 * - border-radius: var(--style-radius-s)
 */
export const VersionsPill: React.FC = () => {
  const { versionCount } = useDocumentInfo()

  if (!versionCount) {
    return null
  }

  return (
    <span
      className="pill-version-count text-center bg-muted rounded-sm"
      style={{
        lineHeight: 'calc(var(--base) * 0.8)',
        minWidth: 'calc(var(--base) * 0.8)',
      }}
    >
      {versionCount}
    </span>
  )
}
