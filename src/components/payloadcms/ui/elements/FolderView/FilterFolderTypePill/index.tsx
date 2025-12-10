// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useConfig } from '@payloadcms/ui'
import { useFolder } from '../../../providers/Folders'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../../Button'
import { CheckboxPopup } from '../../CheckboxPopup'

export function FilterFolderTypePill() {
  const {
    activeCollectionFolderSlugs: visibleCollectionSlugs,
    allCollectionFolderSlugs: folderCollectionSlugs,
    folderCollectionSlug,
    refineFolderData,
  } = useFolder()
  const { i18n, t } = useTranslation()
  const { config, getEntityConfig } = useConfig()

  const [allCollectionOptions] = React.useState(() => {
    return config.collections.reduce(
      (acc, collection) => {
        if (collection.folders && folderCollectionSlugs.includes(collection.slug)) {
          acc.push({
            label: getTranslation(collection.labels?.plural, i18n),
            value: collection.slug,
          })
        }

        return acc
      },
      [
        {
          label: getTranslation(
            getEntityConfig({ collectionSlug: folderCollectionSlug }).labels?.plural,
            i18n,
          ),
          value: folderCollectionSlug,
        },
      ],
    )
  })

  return (
    <CheckboxPopup
      Button={
        <Button buttonStyle="pill" el="div" icon="chevron" margin={false} size="small">
          {visibleCollectionSlugs.length ? (
            <span className="font-semibold tabular-nums bg-background text-foreground px-[3px] rounded-sm -ml-1 mr-[calc(var(--base)*0.25)]">
              {visibleCollectionSlugs.length}
            </span>
          ) : null}
          {t('version:type')}
        </Button>
      }
      key="relation-to-selection-popup"
      onChange={({ selectedValues: relationTo }) => {
        void refineFolderData({ query: { relationTo }, updateURL: true })
      }}
      options={allCollectionOptions}
      selectedValues={visibleCollectionSlugs}
    />
  )
}
