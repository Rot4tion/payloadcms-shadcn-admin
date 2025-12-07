import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Column } from 'payload'
import type { HTMLAttributes, Ref } from 'react'

import { cn } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/ui/table'

export type Props = {
  readonly cellMap: Record<string, number>
  readonly columns: Column[]
  readonly dragAttributes?: HTMLAttributes<unknown>
  readonly dragListeners?: DraggableSyntheticListeners
  readonly ref?: Ref<HTMLTableRowElement>
  readonly rowId: number | string
} & HTMLAttributes<HTMLTableRowElement>

export const OrderableRow = ({
  cellMap,
  className,
  columns,
  dragAttributes = {},
  dragListeners = {},
  rowId,
  ...rest
}: Props) => (
  <TableRow className={className} {...rest}>
    {columns.map((col, colIndex) => {
      const { accessor } = col

      // Use the cellMap to find which index in the renderedCells to use
      const cell = col.renderedCells[cellMap[rowId]]

      // For drag handles, wrap in div with drag attributes
      if (accessor === '_dragHandle') {
        return (
          <TableCell
            className={cn(
              `cell-${accessor}`,
              'py-3 px-3 first:ps-4 last:pe-4 align-top whitespace-nowrap min-w-[120px]',
            )}
            key={colIndex}
          >
            <div {...dragAttributes} {...dragListeners}>
              {cell}
            </div>
          </TableCell>
        )
      }

      return (
        <TableCell
          className={cn(
            `cell-${accessor}`,
            'py-3 px-3 first:ps-4 last:pe-4 align-top whitespace-nowrap min-w-[120px]',
          )}
          key={colIndex}
        >
          {cell}
        </TableCell>
      )
    })}
  </TableRow>
)
