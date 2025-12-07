'use client'
import type { ClientCollectionConfig, CodeFieldClient, DefaultCellComponentProps } from 'payload'

import React from 'react'

export interface CodeCellProps extends DefaultCellComponentProps<CodeFieldClient> {
  readonly collectionConfig: ClientCollectionConfig
  readonly nowrap?: boolean
}

export const CodeCell: React.FC<CodeCellProps> = ({ cellData, nowrap }) => {
  const textToShow = cellData?.length > 100 ? `${cellData.substring(0, 100)}\u2026` : cellData

  const noWrapStyle: React.CSSProperties = nowrap ? { whiteSpace: 'nowrap' } : {}

  return (
    <code
      className="text-base leading-(--base) border-0 inline-flex align-middle bg-muted text-foreground rounded-md px-[calc(var(--base)*0.25)] ltr:pl-[calc(var(--base)*0.3375)] rtl:pr-[calc(var(--base)*0.3375)] hover:no-underline"
      style={noWrapStyle}
    >
      <span>{textToShow}</span>
    </code>
  )
}
