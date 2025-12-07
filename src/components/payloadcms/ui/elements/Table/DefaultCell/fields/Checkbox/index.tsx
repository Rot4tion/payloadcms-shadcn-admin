'use client'
import type { CheckboxFieldClient, DefaultCellComponentProps } from 'payload'

import React from 'react'

import { useTranslation } from '../../../../../providers/Translation/index.js'

export const CheckboxCell: React.FC<DefaultCellComponentProps<CheckboxFieldClient>> = ({
  cellData,
}) => {
  const { t } = useTranslation()

  return (
    <code className="text-base leading-(--base) border-0 inline-flex align-middle bg-muted text-foreground rounded-sm px-[calc(var(--base)*0.25)] ltr:pl-[calc(var(--base)*0.3375)] rtl:pr-[calc(var(--base)*0.3375)]">
      <span>{t(`general:${cellData}`).toLowerCase()}</span>
    </code>
  )
}
