'use client'

import React from 'react'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useSelection, useTranslation } from '@payloadcms/ui'
import { SelectAllStatus } from '@payloadcms/ui/providers/Selection'

export const SelectAll: React.FC = () => {
  const { selectAll, toggleAll } = useSelection()
  const { i18n } = useTranslation()

  return (
    <CheckboxInput
      aria-label={
        selectAll === SelectAllStatus.None
          ? i18n.t('general:selectAllRows')
          : i18n.t('general:deselectAllRows')
      }
      checked={
        selectAll === SelectAllStatus.AllInPage || selectAll === SelectAllStatus.AllAvailable
      }
      className="block"
      id="select-all"
      name="select-all"
      onToggle={() => toggleAll()}
      partialChecked={selectAll === SelectAllStatus.Some}
    />
  )
}
