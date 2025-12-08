// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'

import { cn } from '@/lib/utils'
import { DraggableWithClick } from '../DraggableWithClick/index'
import { HiddenCell, TableCell } from '../SimpleTable/index'
type Props = {
  readonly columns: React.ReactNode[]
  readonly disabled?: boolean
  readonly dragData?: Record<string, unknown>
  readonly id: number | string
  readonly isDroppable?: boolean
  readonly isFocused?: boolean
  readonly isSelected?: boolean
  readonly isSelecting?: boolean
  readonly itemKey: string
  readonly onClick?: (e: React.MouseEvent) => void
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
}
export function DraggableTableRow({
  id,
  columns,
  disabled = false,
  dragData,
  isDroppable: _isDroppable,
  isFocused,
  isSelected,
  isSelecting,
  itemKey,
  onClick,
  onKeyDown,
}: Props) {
  const isDroppable = !disabled && _isDroppable && !isSelected
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: dragData,
    disabled: !isDroppable,
  })
  const ref = React.useRef(null)

  React.useEffect(() => {
    const copyOfRef = ref.current
    if (isFocused && ref.current) {
      ref.current.focus()
    } else if (!isFocused && ref.current) {
      ref.current.blur()
    }

    return () => {
      if (copyOfRef) {
        copyOfRef.blur()
      }
    }
  }, [isFocused])

  return (
    <DraggableWithClick
      as="tr"
      className={cn(
        'draggable-table-row relative isolate cursor-[var(--row-cursor)] opacity-[var(--row-opacity)]',
        '[--border-top-left-radius:var(--style-radius-m)] [--border-top-right-radius:var(--style-radius-m)]',
        '[--border-bottom-right-radius:var(--style-radius-m)] [--border-bottom-left-radius:var(--style-radius-m)]',
        '[--row-text-color:var(--theme-text)] [--row-icon-opacity:1] [--row-icon-color:var(--theme-elevation-400)]',
        '[--row-bg-color:transparent] [--row-opacity:1] [--foreground-opacity:0] [--row-cursor:pointer]',
        'odd:[--row-bg-color:var(--theme-elevation-50)]',
        '[&_.icon]:text-[var(--row-icon-color)] [&_.icon]:opacity-[var(--row-icon-opacity)]',
        isSelected &&
          'draggable-table-row--selected [--row-icon-color:var(--theme-success-800)] [--row-icon-opacity:0.6] odd:[--row-bg-color:var(--theme-success-150)] even:[--row-bg-color:var(--theme-success-150)]',
        disabled && '[--row-cursor:no-drop] [--row-opacity:0.6]',
        isFocused &&
          'odd:[--row-bg-color:var(--theme-elevation-100)] even:[--row-bg-color:var(--theme-elevation-100)]',
        isOver &&
          'odd:[--row-bg-color:var(--theme-elevation-150)] even:[--row-bg-color:var(--theme-elevation-150)]',
      )}
      key={itemKey}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {columns.map((col, i) => (
        <TableCell
          className={cn(
            'relative z-[1] text-[var(--row-text-color)] bg-[var(--row-bg-color)]',
            i === 0 &&
              'rounded-tl-[var(--border-top-left-radius)] rounded-bl-[var(--border-bottom-left-radius)]',
            i === columns.length - 1 &&
              'rounded-tr-[var(--border-top-right-radius)] rounded-br-[var(--border-bottom-right-radius)] pe-[calc(var(--base)*0.8)]',
          )}
          key={`${itemKey}-${i}`}
        >
          {col}
        </TableCell>
      ))}

      {isDroppable ? (
        <HiddenCell>
          <div className="absolute inset-0 w-full h-full" ref={setNodeRef} />
        </HiddenCell>
      ) : null}
    </DraggableWithClick>
  )
}
