'use client'

import type { FolderBreadcrumb } from 'payload/shared'

import { cn } from '@/lib/utils'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron'

type Props = {
  readonly breadcrumbs: {
    id: null | number | string
    name: React.ReactNode | string
    onClick: () => void
  }[]
  className?: string
}
export function FolderBreadcrumbs({ breadcrumbs, className }: Props) {
  return (
    <div className={cn('flex', className)}>
      {breadcrumbs?.map((crumb, index) => (
        <div
          className="text-base font-semibold flex items-center m-0 max-lg:text-(--base) [&:has(.icon--folder)]:h-[calc(var(--base)*1.6)] [&:has(.icon--folder)_.btn__label]:flex [&:has(.icon--folder)_.btn__label]:items-center [&:has(.icon--folder)_.btn__label]:h-full"
          key={index}
        >
          {crumb.onClick ? (
            <DroppableBreadcrumb id={crumb.id} onClick={crumb.onClick}>
              {crumb.name}
            </DroppableBreadcrumb>
          ) : (
            crumb.name
          )}
          {breadcrumbs.length > 0 && index !== breadcrumbs.length - 1 && (
            <ChevronIcon
              className="relative top-px [&_.stroke]:stroke-muted-foreground/50"
              direction="right"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function DroppableBreadcrumb({
  id,
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
} & Pick<FolderBreadcrumb, 'id'>) {
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${id}`,
    data: {
      id,
      type: 'folder',
    },
  })

  return (
    <button
      className={cn(
        'bg-transparent border-0 p-0 m-0 cursor-pointer font-semibold font-inherit',
        'text-base font-semibold flex items-center max-lg:text-(--base)',
        isOver && 'opacity-50',
      )}
      onClick={onClick}
      ref={setNodeRef}
      type="button"
    >
      {children}
    </button>
  )
}
