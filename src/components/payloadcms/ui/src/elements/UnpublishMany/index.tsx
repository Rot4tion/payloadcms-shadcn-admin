'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '../Modal/index.js'
import React from 'react'

import { useAuth } from '@payloadcms/ui'
import { SelectAllStatus, useSelection } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { ListSelectionButton } from '../ListSelection/index.js'
import { UnpublishManyDrawerContent } from './DrawerContent.js'

export type UnpublishManyProps = {
  collection: ClientCollectionConfig
}

export const UnpublishMany: React.FC<UnpublishManyProps> = (props) => {
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()

  return (
    <UnpublishMany_v4
      {...props}
      count={count}
      ids={selectedIDs}
      onSuccess={() => toggleAll()}
      selectAll={selectAll === SelectAllStatus.AllAvailable}
    />
  )
}

export const UnpublishMany_v4: React.FC<
  {
    count: number
    ids: (number | string)[]
    /**
     * When multiple UnpublishMany components are rendered on the page, this will differentiate them.
     */
    modalPrefix?: string
    onSuccess?: () => void
    selectAll: boolean
    where?: Where
  } & UnpublishManyProps
> = (props) => {
  const {
    collection,
    collection: { slug, versions } = {},
    count,
    ids,
    modalPrefix,
    onSuccess,
    selectAll,
    where,
  } = props

  const { t } = useTranslation()
  const { permissions } = useAuth()
  const { toggleModal } = useModal()

  const collectionPermissions = permissions?.collections?.[slug]
  const hasPermission = collectionPermissions?.update

  const drawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}unpublish-${slug}`

  if (!versions?.drafts || count === 0 || !hasPermission) {
    return null
  }

  return (
    <React.Fragment>
      <ListSelectionButton
        aria-label={t('version:unpublish')}
        onClick={() => {
          toggleModal(drawerSlug)
        }}
      >
        {t('version:unpublish')}
      </ListSelectionButton>
      <UnpublishManyDrawerContent
        collection={collection}
        drawerSlug={drawerSlug}
        ids={ids}
        onSuccess={onSuccess}
        selectAll={selectAll}
        where={where}
      />
    </React.Fragment>
  )
}
