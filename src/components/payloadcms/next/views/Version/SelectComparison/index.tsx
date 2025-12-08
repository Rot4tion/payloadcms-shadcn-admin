// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import {
  fieldBaseClass,
  ReactSelect,
  useTranslation,
} from '@/components/payloadcms/ui/exports/client'
import React, { memo, useCallback, useMemo } from 'react'

import type { CompareOption } from '../Default/types'

import type { Props } from './types'

import { useVersionDrawer } from './VersionDrawer/index'

export const SelectComparison: React.FC<Props> = memo((props) => {
  const {
    collectionSlug,
    docID,
    globalSlug,
    onChange: onChangeFromProps,
    versionFromID,
    versionFromOptions,
  } = props
  const { t } = useTranslation()

  const { Drawer, openDrawer } = useVersionDrawer({ collectionSlug, docID, globalSlug })

  const options = useMemo(() => {
    return [
      ...versionFromOptions,
      {
        label: <span className="text-muted-foreground">{t('version:moreVersions')}</span>,
        value: 'more',
      },
    ]
  }, [t, versionFromOptions])

  const currentOption = useMemo(
    () => versionFromOptions.find((option) => option.value === versionFromID),
    [versionFromOptions, versionFromID],
  )

  const onChange = useCallback(
    (val: CompareOption) => {
      if (val.value === 'more') {
        openDrawer()
        return
      }
      onChangeFromProps(val)
    },
    [onChangeFromProps, openDrawer],
  )

  return (
    <div className={fieldBaseClass}>
      <ReactSelect
        isClearable={false}
        isSearchable={false}
        onChange={onChange}
        options={options}
        placeholder={t('version:selectVersionToCompare')}
        value={currentOption}
      />
      <Drawer />
    </div>
  )
})
