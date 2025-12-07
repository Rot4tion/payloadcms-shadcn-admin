'use client'
import type { DefaultCellComponentProps, JSONFieldClient } from 'payload'

import React from 'react'

export const JSONCell: React.FC<DefaultCellComponentProps<JSONFieldClient>> = ({ cellData }) => {
  const textToShow = cellData?.length > 100 ? `${cellData.substring(0, 100)}\u2026` : cellData

  return (
    <code className="text-base leading-(--base) border-0 inline-flex align-middle bg-muted text-foreground rounded-md px-[calc(var(--base)*0.25)] ltr:pl-[calc(var(--base)*0.3375)] rtl:pr-[calc(var(--base)*0.3375)]">
      <span>{JSON.stringify(textToShow)}</span>
    </code>
  )
}
