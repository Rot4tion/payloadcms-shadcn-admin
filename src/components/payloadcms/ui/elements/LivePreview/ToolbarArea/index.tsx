'use client'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'

export const ToolbarArea: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props

  const { setNodeRef } = useDroppable({
    id: 'live-preview-area',
  })

  return (
    <div className="w-full h-full" ref={setNodeRef}>
      {children}
    </div>
  )
}
