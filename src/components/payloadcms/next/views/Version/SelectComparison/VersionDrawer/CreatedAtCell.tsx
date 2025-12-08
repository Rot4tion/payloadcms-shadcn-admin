'use client'
import {
  useConfig,
  useModal,
  useRouteTransition,
  useTranslation,
} from '@/components/payloadcms/ui/exports/client'
import { formatDate } from '@/components/payloadcms/ui/exports/shared'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { CreatedAtCellProps } from '../../../Versions/cells/CreatedAt'

export const VersionDrawerCreatedAtCell: React.FC<CreatedAtCellProps> = ({
  rowData: { id, updatedAt } = {},
}) => {
  const {
    config: {
      admin: { dateFormat },
    },
  } = useConfig()
  const { closeAllModals } = useModal()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startRouteTransition } = useRouteTransition()

  const { i18n } = useTranslation()

  return (
    <button
      className="created-at-cell"
      onClick={() => {
        closeAllModals()
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        if (id) {
          current.set('versionFrom', String(id))
        }

        const search = current.toString()
        const query = search ? `?${search}` : ''

        startRouteTransition(() => router.push(`${pathname}${query}`))
      }}
      type="button"
    >
      {formatDate({ date: updatedAt, i18n, pattern: dateFormat })}
    </button>
  )
}
