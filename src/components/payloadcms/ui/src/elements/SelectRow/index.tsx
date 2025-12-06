'use client'
import type { ClientUser } from 'payload'

import React from 'react'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useAuth } from '@payloadcms/ui'
import { useSelection } from '@payloadcms/ui'
import { Locked } from '../Locked/index.js'

export const SelectRow: React.FC<{
  rowData: {
    _isLocked: boolean
    _userEditing: ClientUser
    id: string
  }
}> = ({ rowData }) => {
  const { user } = useAuth()
  const { selected, setSelection } = useSelection()
  const { _isLocked, _userEditing } = rowData || {}

  const documentIsLocked = _isLocked && _userEditing

  if (documentIsLocked && _userEditing.id !== user?.id) {
    return <Locked user={_userEditing} />
  }

  return (
    <CheckboxInput
      checked={Boolean(selected.get(rowData.id))}
      className="block w-min"
      onToggle={() => setSelection(rowData.id)}
    />
  )
}
