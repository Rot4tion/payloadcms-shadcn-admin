'use client'

import React from 'react'

import { cn } from '@/lib/utils'

type TableProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly className?: string
  readonly headerCells: React.ReactNode[]
  readonly tableRows: React.ReactNode[]
}
export const SimpleTable = ({
  appearance,
  className,
  headerCells: headers,
  tableRows: rows,
}: TableProps) => {
  return (
    <div className={cn('mb-(--base) overflow-auto max-w-full', className)}>
      <table cellPadding={0} cellSpacing={0} className="min-w-full border-collapse">
        <TableHead>
          <TableRow>{headers}</TableRow>
        </TableHead>

        <TableBody>{rows}</TableBody>
      </table>
    </div>
  )
}

export const TableHead = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className={cn('text-muted-foreground', className)} {...rest}>
      {children}
    </thead>
  )
}

export const TableBody = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tbody className={cn(className)} {...rest}>
      {children}
    </tbody>
  )
}

export const TableRow = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr className={cn(className)} {...rest}>
      {children}
    </tr>
  )
}

export const TableCell = ({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      className={cn(
        'align-top p-[calc(var(--base)*0.6)] min-w-[150px] relative first:ps-[calc(var(--base)*0.8)] last:pe-[calc(var(--base)*0.8)] max-lg:max-w-[70vw]',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  )
}

export const TableHeader = ({
  children,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(
        'font-normal text-left rtl:text-right align-top p-[calc(var(--base)*0.6)] min-w-[150px] relative first:ps-[calc(var(--base)*0.8)] last:pe-[calc(var(--base)*0.8)] max-lg:max-w-[70vw]',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

export const HiddenCell = ({
  children,
  className,
  ...rest
}: { children?: React.ReactNode } & React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={cn('absolute p-0', className)} {...rest}>
      {children}
    </td>
  )
}
