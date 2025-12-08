'use client'
import type { DefaultCellComponentProps } from 'payload'

import React from 'react'

import { useListDrawerContext } from '../../../elements/ListDrawer/Provider'
import { DefaultCell } from '../../../elements/Table/DefaultCell'
import { useTableColumns } from '../../../providers/TableColumns'

const CellPropsContext = React.createContext<DefaultCellComponentProps | null>(null)

export const useCellProps = (): DefaultCellComponentProps | null => React.use(CellPropsContext)

export const RenderDefaultCell: React.FC<{
  clientProps: DefaultCellComponentProps
  columnIndex: number
  enableRowSelections?: boolean
  isLinkedColumn?: boolean
}> = ({ clientProps, columnIndex, isLinkedColumn }) => {
  const { drawerSlug, onSelect } = useListDrawerContext()
  const { LinkedCellOverride } = useTableColumns()

  const propsToPass: DefaultCellComponentProps = {
    ...clientProps,
    columnIndex,
  }

  if (isLinkedColumn && drawerSlug) {
    propsToPass.className =
      'border-0 bg-transparent p-0 cursor-pointer underline text-left whitespace-nowrap'
    propsToPass.link = false
    propsToPass.onClick = ({ collectionSlug: rowColl, rowData }) => {
      if (typeof onSelect === 'function') {
        onSelect({
          collectionSlug: rowColl,
          doc: rowData,
          docID: rowData.id as string,
        })
      }
    }
  }

  return (
    <CellPropsContext value={propsToPass}>
      {isLinkedColumn && LinkedCellOverride ? LinkedCellOverride : <DefaultCell {...propsToPass} />}
    </CellPropsContext>
  )
}
