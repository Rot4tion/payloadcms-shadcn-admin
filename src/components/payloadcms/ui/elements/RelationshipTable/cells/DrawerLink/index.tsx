'use client'

import React from 'react'

import type { OnDrawerOpen } from '../../index'

import { EditIcon } from '../../../../icons/Edit/index'
import { useCellProps } from '../../../../providers/TableColumns/RenderDefaultCell/index'
import { DefaultCell } from '../../../Table/DefaultCell/index'

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
