'use client'
import type { ClientBlock, Labels } from 'payload'

import { useModal } from '../../../elements/Modal/index'
import { getTranslation } from '@payloadcms/translations'
import React, { useEffect } from 'react'

import { Drawer } from '../../../elements/Drawer/index'
import { useTranslation } from '@payloadcms/ui'
import { BlockSelector } from '../BlockSelector/index'

export type Props = {
  readonly addRow: (index: number, blockType?: string) => Promise<void> | void
  readonly addRowIndex: number
  readonly blocks: (ClientBlock | string)[]
  readonly drawerSlug: string
  readonly labels: Labels
}

export const BlocksDrawer: React.FC<Props> = (props) => {
  const { addRow, addRowIndex, blocks, drawerSlug, labels } = props

  const { closeModal, isModalOpen } = useModal()
  const { i18n, t } = useTranslation()
  const [searchTermOverride, setSearchTermOverride] = React.useState('')

  useEffect(() => {
    if (!isModalOpen(drawerSlug)) {
      setSearchTermOverride('')
    }
  }, [isModalOpen, drawerSlug])

  return (
    <Drawer
      slug={drawerSlug}
      title={t('fields:addLabel', { label: getTranslation(labels.singular, i18n) })}
    >
      <BlockSelector
        blocks={blocks}
        onSelect={(slug) => {
          void addRow(addRowIndex, slug)
          closeModal(drawerSlug)
        }}
        searchTerm={searchTermOverride}
      />
    </Drawer>
  )
}
