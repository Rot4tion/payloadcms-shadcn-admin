// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import React from 'react'

import type { OnDrawerOpen } from '../..'

import { EditIcon } from '../../../../icons/Edit'
import { useCellProps } from '../../../../providers/TableColumns/RenderDefaultCell'
import { DefaultCell } from '../../../Table/DefaultCell'

export const DrawerLink: React.FC<{
  currentDrawerID?: string
  onDrawerOpen: OnDrawerOpen
}> = ({ onDrawerOpen }) => {
  const cellProps = useCellProps()

  return (
    <div className="flex gap-[calc(var(--base)/2)]">
      <DefaultCell {...cellProps} link={false} onClick={null} />
      <button
        className="border-0 bg-transparent p-0 cursor-pointer text-foreground text-[inherit] leading-[inherit]"
        onClick={() => {
          onDrawerOpen(cellProps.rowData.id)
        }}
        type="button"
      >
        <EditIcon />
      </button>
    </div>
  )
}
