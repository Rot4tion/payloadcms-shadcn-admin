'use client'
import type { Column, SanitizedCollectionConfig } from 'payload'

import {
  LoadingOverlayToggle,
  Pagination,
  PerPage,
  Table,
  useListQuery,
  useTranslation,
} from '@/components/payloadcms/ui/exports/client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export const VersionsViewClient: React.FC<{
  readonly columns: Column[]
  readonly fetchURL: string
  readonly paginationLimits?: SanitizedCollectionConfig['admin']['pagination']['limits']
}> = (props) => {
  const { columns, paginationLimits } = props

  const { data, handlePageChange, handlePerPageChange } = useListQuery()

  const searchParams = useSearchParams()
  const limit = searchParams.get('limit')

  const { i18n } = useTranslation()

  const versionCount = data?.totalDocs || 0

  return (
    <React.Fragment>
      <LoadingOverlayToggle name="versions" show={!data} />
      {versionCount === 0 && (
        <div className="mt-[calc(var(--base)*1.5)] text-[length:var(--font-body-size)]">
          {i18n.t('version:noFurtherVersionsFound')}
        </div>
      )}
      {versionCount > 0 && (
        <React.Fragment>
          <Table columns={columns} data={data?.docs} />
          <div className="w-full flex items-center flex-wrap max-md:flex-wrap">
            <Pagination
              hasNextPage={data.hasNextPage}
              hasPrevPage={data.hasPrevPage}
              limit={data.limit}
              nextPage={data.nextPage}
              numberOfNeighbors={1}
              onChange={handlePageChange}
              page={data.page}
              prevPage={data.prevPage}
              totalPages={data.totalPages}
            />
            {data?.totalDocs > 0 && (
              <React.Fragment>
                <div className="ltr:ml-auto ltr:mr-(--base) rtl:mr-auto rtl:ml-(--base) max-md:ltr:ml-0 max-md:rtl:mr-0">
                  {data.page * data.limit - (data.limit - 1)}-
                  {data.totalPages > 1 && data.totalPages !== data.page
                    ? data.limit * data.page
                    : data.totalDocs}{' '}
                  {i18n.t('general:of')} {data.totalDocs}
                </div>
                <PerPage
                  handleChange={handlePerPageChange}
                  limit={limit ? Number(limit) : 10}
                  limits={paginationLimits}
                />
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
