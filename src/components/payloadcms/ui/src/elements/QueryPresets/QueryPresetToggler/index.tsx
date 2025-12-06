'use client'
import type { QueryPreset } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import { PeopleIcon } from '../../../icons/People/index.js'
import { XIcon } from '../../../icons/X/index.js'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Pill } from '../../Pill/index.js'
import { cn } from '@/lib/utils'

export function QueryPresetToggler({
  activePreset,
  openPresetListDrawer,
  resetPreset,
}: {
  activePreset: QueryPreset
  openPresetListDrawer: () => void
  resetPreset: () => Promise<void>
}) {
  const { i18n, t } = useTranslation()
  const { getEntityConfig } = useConfig()

  const presetsConfig = getEntityConfig({
    collectionSlug: 'payload-query-presets',
  })

  return (
    <Pill
      className={cn(
        activePreset &&
          'shadow-[inset_0_0_0_1px_var(--theme-elevation-200)] dark:shadow-[inset_0_0_0_1px_var(--theme-elevation-300)] bg-background dark:bg-muted hover:bg-muted dark:hover:bg-muted/80 dark:text-background pr-1',
      )}
      id="select-preset"
      onClick={() => {
        openPresetListDrawer()
      }}
      pillStyle="light"
      size="small"
    >
      <div className="flex items-center">
        {activePreset?.isShared && <PeopleIcon className="mr-0.5" />}
        <div className="max-w-[100px] overflow-hidden">
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {activePreset?.title ||
              t('general:selectLabel', {
                label: getTranslation(presetsConfig.labels.singular, i18n),
              })}
          </div>
        </div>
        {activePreset ? (
          <div
            className="flex items-center w-(--pill-icon-size) h-(--pill-icon-size)"
            id="clear-preset"
            onClick={async (e) => {
              e.stopPropagation()
              await resetPreset()
            }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                await resetPreset()
              }
            }}
            role="button"
            tabIndex={0}
          >
            <XIcon />
          </div>
        ) : null}
      </div>
    </Pill>
  )
}
