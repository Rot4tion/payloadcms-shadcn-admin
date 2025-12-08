'use client'

import React from 'react'

import { DrawerCloseButton } from '../DrawerCloseButton'

type Props = {
  readonly onClose: () => void
  readonly title: string
}
export function DrawerHeader({ onClose, title }: Props) {
  return (
    <div className="flex justify-between items-center py-[calc(var(--base)*2.5)] px-(--gutter-h) h-12 border-b border-border">
      <h2 className="m-0" title={title}>
        {title}
      </h2>
      <DrawerCloseButton onClick={onClose} />
    </div>
  )
}
