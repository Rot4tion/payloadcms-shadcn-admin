'use client'
import type { EditViewProps } from 'payload'

import { useDraggable } from '@dnd-kit/core'
import React from 'react'

import { useLivePreviewContext } from '@payloadcms/ui'
import { ToolbarControls } from './Controls/index.js'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'

const DraggableToolbar: React.FC<EditViewProps> = (props) => {
  const { toolbarPosition } = useLivePreviewContext()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'live-preview-toolbar',
  })

  return (
    <div
      className={cn(
        'flex bg-background text-foreground h-[calc(var(--base)*1.75)] items-center shrink-0',
        'shadow-lg absolute top-0 left-0 m-0 rounded',
      )}
      style={{
        left: `${toolbarPosition?.x || 0}px`,
        top: `${toolbarPosition?.y || 0}px`,
        ...(transform
          ? {
              transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
            }
          : {}),
      }}
    >
      <button
        {...listeners}
        {...attributes}
        className="bg-transparent border-0 p-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        ref={setNodeRef}
        type="button"
      >
        <GripVertical className="size-(--base)" />
      </button>
      <ToolbarControls {...props} />
    </div>
  )
}

const StaticToolbar: React.FC<EditViewProps> = (props) => {
  return (
    <div className="flex bg-background text-foreground h-[calc(var(--base)*1.75)] items-center shrink-0 relative w-full justify-center border-b border-border">
      <ToolbarControls {...props} />
    </div>
  )
}

export const LivePreviewToolbar: React.FC<
  {
    draggable?: boolean
  } & EditViewProps
> = (props) => {
  const { draggable } = props

  if (draggable) {
    return <DraggableToolbar {...props} />
  }

  return <StaticToolbar {...props} />
}
