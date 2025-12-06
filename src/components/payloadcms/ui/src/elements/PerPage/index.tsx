'use client'
// TODO: abstract the `next/navigation` dependency out from this component
import { collectionDefaults, isNumber } from 'payload/shared'
import React from 'react'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { useTranslation } from '@payloadcms/ui'
import { Popup, PopupList } from '../Popup/index.js'

const defaultLimits = collectionDefaults.admin.pagination.limits

export type PerPageProps = {
  readonly defaultLimit?: number
  readonly handleChange?: (limit: number) => void
  readonly limit: number
  readonly limits: number[]
  readonly resetPage?: boolean
}

export const PerPage: React.FC<PerPageProps> = ({
  defaultLimit = 10,
  handleChange,
  limit,
  limits = defaultLimits,
}) => {
  const { t } = useTranslation()

  const limitToUse = isNumber(limit) ? limit : defaultLimit

  return (
    <div className="per-page">
      <Popup
        button={
          <div className="flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <span>{t('general:perPage', { limit: limitToUse })}</span>
            <ChevronIcon />
          </div>
        }
        horizontalAlign="right"
        render={({ close }) => (
          <PopupList.ButtonGroup>
            {limits.map((limitNumber, i) => (
              <PopupList.Button
                className={cn(
                  'flex items-center gap-1',
                  limitNumber === limitToUse && 'font-medium text-primary',
                )}
                key={i}
                onClick={() => {
                  close()
                  if (handleChange) {
                    handleChange(limitNumber)
                  }
                }}
              >
                {limitNumber === limitToUse && <ChevronIcon direction="right" size="small" />}
                <span>{limitNumber}</span>
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
        )}
        size="small"
      />
    </div>
  )
}
