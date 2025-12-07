'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '../Modal/index'
import React, { useState } from 'react'

import type { FieldOption } from '../FieldSelect/reduceFieldOptions'

import { useAuth } from '@payloadcms/ui'
import { EditDepthProvider } from '@payloadcms/ui'
import { useSelection } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Drawer } from '../Drawer/index'
import { ListSelectionButton } from '../ListSelection/index'
import { EditManyDrawerContent } from './DrawerContent'
import { SelectAllStatus } from '@payloadcms/ui/providers/Selection'

export type EditManyProps = {
  readonly collection: ClientCollectionConfig
}

export const EditMany: React.FC<EditManyProps> = (props) => {
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()

  return (
    <EditMany_v4
      {...props}
      count={count}
      ids={selectedIDs}
      onSuccess={() => toggleAll()}
      selectAll={selectAll === SelectAllStatus.AllAvailable}
    />
  )
}

export const EditMany_v4: React.FC<
  {
    count: number
    ids: (number | string)[]
    /**
     * When multiple EditMany components are rendered on the page, this will differentiate them.
     */
    modalPrefix?: string
    onSuccess?: () => void
    selectAll: boolean
    where?: Where
  } & Omit<EditManyProps, 'ids'>
> = ({ collection, count, ids, modalPrefix, onSuccess, selectAll, where }) => {
  const { permissions } = useAuth()
  const { openModal } = useModal()

  const { t } = useTranslation()

  const [selectedFields, setSelectedFields] = useState<FieldOption[]>([])

  const collectionPermissions = permissions?.collections?.[collection.slug]

  const drawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}edit-${collection.slug}`

  if (count === 0 || !collectionPermissions?.update) {
    return null
  }

  return (
    <div>
      <ListSelectionButton
        aria-label={t('general:edit')}
        onClick={() => {
          openModal(drawerSlug)
          setSelectedFields([])
        }}
      >
        {t('general:edit')}
      </ListSelectionButton>
      <EditDepthProvider>
        <Drawer Header={null} slug={drawerSlug}>
          <EditManyDrawerContent
            collection={collection}
            count={count}
            drawerSlug={drawerSlug}
            ids={ids}
            onSuccess={onSuccess}
            selectAll={selectAll}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            where={where}
          />
        </Drawer>
      </EditDepthProvider>
    </div>
  )
}
