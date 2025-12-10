// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import React from 'react'

import { useListQuery } from '@payloadcms/ui'
import { Pagination } from '../Pagination'

export const RelationshipTablePagination: React.FC = () => {
  const { data, handlePageChange } = useListQuery()

  return (
    <Pagination
      hasNextPage={data.hasNextPage}
      hasPrevPage={data.hasPrevPage}
      limit={data.limit}
      nextPage={data.nextPage || 2}
      numberOfNeighbors={1}
      onChange={(e) => {
        void handlePageChange(e)
      }}
      page={data.page || 1}
      prevPage={data.prevPage || undefined}
      totalPages={data.totalPages}
    />
  )
}
