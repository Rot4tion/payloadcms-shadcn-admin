import type { ReactNode } from 'react'

import { Table, TableBody } from '@/components/ui/table'

export type Props = {
  readonly children: ReactNode
  readonly className?: string
  readonly rowId?: number | string
}

export const OrderableRowDragPreview = ({ children, className, rowId }: Props) =>
  typeof rowId === 'undefined' ? null : (
    <div className={className}>
      <Table className="text-[length:inherit]">
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
