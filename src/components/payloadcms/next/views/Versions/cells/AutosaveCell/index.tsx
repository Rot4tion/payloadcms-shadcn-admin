'use client'
import { Pill, useTranslation } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

import { VersionPillLabel } from '../../../Version/VersionPillLabel/VersionPillLabel.js'

type AutosaveCellProps = {
  currentlyPublishedVersion?: {
    id: number | string
    updatedAt: string
  }
  latestDraftVersion?: {
    id: number | string
    updatedAt: string
  }
  rowData: {
    autosave?: boolean
    id: number | string
    publishedLocale?: string
    version: {
      _status: string
    }
  }
}

export const AutosaveCell: React.FC<AutosaveCellProps> = ({
  currentlyPublishedVersion,
  latestDraftVersion,
  rowData,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-[calc(var(--base)*0.5)]">
      {rowData?.autosave && <Pill size="small">{t('version:autosave')}</Pill>}
      <VersionPillLabel
        currentlyPublishedVersion={currentlyPublishedVersion}
        disableDate={true}
        doc={rowData}
        labelFirst={false}
        labelStyle="pill"
        latestDraftVersion={latestDraftVersion}
      />
    </div>
  )
}
