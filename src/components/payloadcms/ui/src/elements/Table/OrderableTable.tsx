'use client'

import type { ClientCollectionConfig, Column, OrderableEndpointBody } from 'payload'

import { DragOverlay } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useConfig } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { DraggableSortableItem } from '../DraggableSortable/DraggableSortableItem/index.js'
import { DraggableSortable } from '../DraggableSortable/index.js'
import { OrderableRow } from './OrderableRow.js'
import { OrderableRowDragPreview } from './OrderableRowDragPreview.js'

export type Props = {
  readonly appearance?: 'condensed' | 'default'
  readonly BeforeTable?: React.ReactNode
  readonly collection: ClientCollectionConfig
  readonly columns?: Column[]
  readonly data: Record<string, unknown>[]
  readonly heading?: React.ReactNode
}

export const OrderableTable: React.FC<Props> = ({
  appearance = 'default',
  BeforeTable,
  collection,
  columns,
  data: initialData,
}) => {
  const { config } = useConfig()
  const { data: listQueryData, orderableFieldName, query } = useListQuery()
  // Use the data from ListQueryProvider if available, otherwise use the props
  const serverData = listQueryData?.docs || initialData

  // Local state to track the current order of rows
  const [localData, setLocalData] = useState(serverData)

  // id -> index for each column
  const [cellMap, setCellMap] = useState<Record<string, number>>({})

  const [dragActiveRowId, setDragActiveRowId] = useState<number | string | undefined>()

  // Update local data when server data changes
  useEffect(() => {
    setLocalData(serverData)
    setCellMap(
      Object.fromEntries(serverData.map((item, index) => [String(item.id ?? item._id), index])),
    )
  }, [serverData])

  const activeColumns = columns?.filter((col) => col?.active)

  if (
    !activeColumns ||
    activeColumns.filter((col) => !['_dragHandle', '_select'].includes(col.accessor)).length === 0
  ) {
    return <div>No columns selected</div>
  }

  const handleDragEnd = async ({ moveFromIndex, moveToIndex }) => {
    if (query.sort !== orderableFieldName && query.sort !== `-${orderableFieldName}`) {
      toast.warning('To reorder the rows you must first sort them by the "Order" column')
      setDragActiveRowId(undefined)
      return
    }

    if (moveFromIndex === moveToIndex) {
      setDragActiveRowId(undefined)
      return
    }

    const movedId = localData[moveFromIndex].id ?? localData[moveFromIndex]._id
    const newBeforeRow =
      moveToIndex > moveFromIndex ? localData[moveToIndex] : localData[moveToIndex - 1]
    const newAfterRow =
      moveToIndex > moveFromIndex ? localData[moveToIndex + 1] : localData[moveToIndex]

    // Store the original data for rollback
    const previousData = [...localData]

    // Optimisitc update of local state to reorder the rows
    setLocalData((currentData) => {
      const newData = [...currentData]
      // Update the rendered cell for the moved row to show "pending"
      newData[moveFromIndex][orderableFieldName] = `pending`
      // Move the item in the array
      newData.splice(moveToIndex, 0, newData.splice(moveFromIndex, 1)[0])
      return newData
    })

    try {
      const target: OrderableEndpointBody['target'] = newBeforeRow
        ? {
            id: newBeforeRow.id ?? newBeforeRow._id,
            key: newBeforeRow[orderableFieldName],
          }
        : {
            id: newAfterRow.id ?? newAfterRow._id,
            key: newAfterRow[orderableFieldName],
          }

      const newKeyWillBe =
        (newBeforeRow && query.sort === orderableFieldName) ||
        (!newBeforeRow && query.sort === `-${orderableFieldName}`)
          ? 'greater'
          : 'less'

      const jsonBody: OrderableEndpointBody = {
        collectionSlug: collection.slug,
        docsToMove: [movedId],
        newKeyWillBe,
        orderableFieldName,
        target,
      }

      const response = await fetch(`${config.serverURL}${config.routes.api}/reorder`, {
        body: JSON.stringify(jsonBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.status === 403) {
        throw new Error('You do not have permission to reorder these rows')
      }

      if (!response.ok) {
        throw new Error(
          'Failed to reorder. This can happen if you reorder several rows too quickly. Please try again.',
        )
      }

      if (response.status === 200 && (await response.json())['message'] === 'initial migration') {
        throw new Error(
          'You have enabled "orderable" on a collection with existing documents' +
            'and this is the first time you have sorted documents. We have run an automatic migration ' +
            'to add an initial order to the documents. Please refresh the page and try again.',
        )
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      // Rollback to previous state if the request fails
      setLocalData(previousData)
      toast.error(error)
    } finally {
      setDragActiveRowId(undefined)
    }
  }

  const handleDragStart = ({ id }) => {
    setDragActiveRowId(id)
  }

  const rowIds = localData.map((row) => row.id ?? row._id)
  const isCondensed = appearance === 'condensed'

  return (
    <div
      className={cn(
        'orderable-table mb-4 overflow-auto w-full isolate',
        isCondensed && 'rounded-md',
      )}
    >
      {BeforeTable}
      <DraggableSortable ids={rowIds} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Table className="text-[length:inherit]">
          <TableHeader className={cn(isCondensed && 'bg-muted')}>
            <TableRow className="hover:bg-transparent border-b-0">
              {activeColumns.map((col, i) => (
                <TableHead
                  id={`heading-${col.accessor}`}
                  key={i}
                  className={cn(
                    'text-muted-foreground font-normal py-3 px-3 whitespace-nowrap min-w-[120px]',
                    'first:ps-4 last:pe-4',
                    isCondensed && 'py-1.5 px-1.5 first:ps-3 last:pe-3 border border-border',
                  )}
                >
                  {col.Heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((row, rowIndex) => (
              <DraggableSortableItem id={rowIds[rowIndex]} key={rowIds[rowIndex]}>
                {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
                  <OrderableRow
                    cellMap={cellMap}
                    className={cn(
                      `row-${rowIndex + 1}`,
                      'border-0 hover:bg-muted/50',
                      rowIndex % 2 === 0 && 'bg-muted/30',
                      isCondensed && 'bg-transparent',
                    )}
                    columns={activeColumns}
                    dragAttributes={attributes}
                    dragListeners={listeners}
                    ref={setNodeRef}
                    rowId={row.id ?? row._id}
                    style={{
                      opacity: isDragging ? 0 : 1,
                      transform,
                      transition,
                    }}
                  />
                )}
              </DraggableSortableItem>
            ))}
          </TableBody>
        </Table>

        <DragOverlay>
          <OrderableRowDragPreview
            className="orderable-table cursor-grabbing z-10"
            rowId={dragActiveRowId}
          >
            <OrderableRow cellMap={cellMap} columns={activeColumns} rowId={dragActiveRowId} />
          </OrderableRowDragPreview>
        </DragOverlay>
      </DraggableSortable>
    </div>
  )
}
