import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { ListSelection } from '../ListSelection/index'

export const GroupByHeader: React.FC<{
  collectionConfig?: ClientCollectionConfig
  groupByFieldPath: string
  groupByValue: string
  heading: string
}> = ({ collectionConfig, groupByFieldPath, groupByValue, heading }) => {
  return (
    <header className="flex gap-4">
      <h4 className="m-0 grow" data-group-id={groupByValue}>
        {heading}
      </h4>
      <ListSelection
        collectionConfig={collectionConfig}
        label={heading}
        modalPrefix={groupByValue}
        where={{
          [groupByFieldPath]: {
            equals: groupByValue,
          },
        }}
      />
    </header>
  )
}
