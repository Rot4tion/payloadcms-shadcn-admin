'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

const baseClass = 'pill-version-count'

export const VersionsPill: React.FC = () => {
  const { versionCount } = useDocumentInfo()

  if (!versionCount) {
    return null
  }

  return <span className={baseClass}>{versionCount}</span>
}
