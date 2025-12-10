'use client'

import type { FolderOrDocument } from 'payload/shared'

import React from 'react'

import { ContextFolderFileCard } from '../FolderFileCard'

type ItemCardGridProps = {
  items: FolderOrDocument[]
  title?: string
} & (
  | {
      subfolderCount: number
      type: 'file'
    }
  | {
      subfolderCount?: never
      type: 'folder'
    }
)
export function ItemCardGrid({ type, items, subfolderCount, title }: ItemCardGridProps) {
  return (
    <>
      {title && <p className="text-muted-foreground mb-[calc(var(--base)/2)]">{title}</p>}
      <div className="gap-(--base) grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mb-(--base)">
        {!items || items?.length === 0
          ? null
          : items.map((item, _index) => {
              const index = _index + (subfolderCount || 0)
              const { itemKey } = item

              return <ContextFolderFileCard index={index} item={item} key={itemKey} type={type} />
            })}
      </div>
    </>
  )
}
