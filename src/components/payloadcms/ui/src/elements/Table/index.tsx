'use client'

import type { Column } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type Props = {
  readonly appearance?: 'condensed' | 'default'
  readonly BeforeTable?: React.ReactNode
  readonly columns?: Column[]
  readonly data: Record<string, unknown>[]
}

export const Table: React.FC<Props> = ({ appearance, BeforeTable, columns, data }) => {
  const activeColumns = columns?.filter((col) => col?.active)

  if (!activeColumns || activeColumns.length === 0) {
    return <div className="text-muted-foreground p-4">No columns selected</div>
  }

  const isCondensed = appearance === 'condensed'

  return (
    <div
      className={cn('table-wrapper mb-4 overflow-auto w-full isolate', isCondensed && 'rounded-md')}
    >
      {BeforeTable}
      <ShadcnTable className="text-[length:inherit]">
        <TableHeader className={cn(isCondensed && 'bg-muted')}>
          <TableRow className="hover:bg-transparent border-b-0">
            {activeColumns.map((col, i) => (
              <TableHead
                id={`heading-${col.accessor.replace(/\./g, '__')}`}
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
          {data &&
            data?.map((row, rowIndex) => {
              return (
                <TableRow
                  className={cn(
                    `row-${rowIndex + 1}`,
                    'border-0 hover:bg-muted/50',
                    rowIndex % 2 === 0 && 'bg-muted/30 rounded-md',
                    isCondensed && 'bg-transparent',
                  )}
                  data-id={row.id}
                  key={
                    typeof row.id === 'string' || typeof row.id === 'number'
                      ? String(row.id)
                      : rowIndex
                  }
                >
                  {activeColumns.map((col, colIndex) => {
                    const { accessor } = col

                    return (
                      <TableCell
                        className={cn(
                          `cell-${accessor.replace(/\./g, '__')}`,
                          'py-3 px-3 first:ps-4 last:pe-4 align-top whitespace-nowrap min-w-[120px]',
                          colIndex === 0 && rowIndex % 2 === 0 && 'rounded-l-md',
                          colIndex === activeColumns.length - 1 &&
                            rowIndex % 2 === 0 &&
                            'rounded-r-md',
                          isCondensed &&
                            'py-1.5 px-1.5 first:ps-3 last:pe-3 border border-border rounded-none',
                        )}
                        key={colIndex}
                      >
                        {col.renderedCells[rowIndex]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
        </TableBody>
      </ShadcnTable>
    </div>
  )
}
