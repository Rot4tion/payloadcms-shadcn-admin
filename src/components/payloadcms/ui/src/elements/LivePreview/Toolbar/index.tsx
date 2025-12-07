'use client'
import type { EditViewProps } from 'payload'

import { useDraggable } from '@dnd-kit/core'
import React from 'react'

import { DragHandleIcon } from '../../../icons/DragHandle/index.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import { ToolbarControls } from './Controls/index.js'

const DraggableToolbar: React.FC<EditViewProps> = (props) => {
  const { toolbarPosition } = useLivePreviewContext()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'live-preview-toolbar',
  })

  return (
    <div
      className="flex bg-background text-foreground h-[calc(var(--base)*1.75)] items-center shrink-0 shadow-lg absolute top-0 left-0 m-0 rounded"
      style={{
        left: `${toolbarPosition.x}px`,
        top: `${toolbarPosition.y}px`,
        ...(transform
          ? {
              transform: transform
                ? `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`
                : undefined,
            }
          : {}),
      }}
    >
      <button
        {...listeners}
        {...attributes}
        className="bg-transparent border-0 p-0 cursor-grab active:cursor-grabbing [&_.icon--drag-handle_.fill]:fill-(--theme-elevation-300)"
        ref={setNodeRef}
        type="button"
      >
        <DragHandleIcon />
      </button>
      <ToolbarControls {...props} />
    </div>
  )
}

const StaticToolbar: React.FC<EditViewProps> = (props) => {
  return (
    <div className="flex bg-background text-foreground h-[calc(var(--base)*1.75)] items-center shrink-0 relative w-full justify-center border-b border-(--theme-elevation-100)">
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
