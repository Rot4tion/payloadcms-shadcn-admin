import type { Modifier } from '@dnd-kit/core'
import type { FolderOrDocument } from 'payload/shared'

import { DragOverlay } from '@dnd-kit/core'
import { getEventCoordinates } from '@dnd-kit/utilities'

import { FolderFileCard } from '../FolderFileCard/index.js'

type DragCardsProps = {
  readonly item: FolderOrDocument
  readonly selectedCount: number
}
export function DragOverlaySelection({ item, selectedCount }: DragCardsProps) {
  return (
    <DragOverlay
      dropAnimation={null}
      modifiers={[snapTopLeftToCursor]}
      style={{
        height: 'unset',
        maxWidth: '220px',
      }}
    >
      <div className="grid grid-cols-1 grid-rows-1">
        {Array.from({ length: selectedCount > 1 ? 2 : 1 }).map((_, index) => (
          <div
            className="absolute w-full h-full col-start-1 col-end-2 row-start-1 row-end-2"
            key={index}
            style={{
              right: `${index * 3}px`,
              top: `-${index * 3}px`,
            }}
          >
            <FolderFileCard
              id={null}
              isSelected
              itemKey="overlay-card"
              title={item.value._folderOrDocumentTitle}
              type="folder"
            />
          </div>
        ))}
        {selectedCount > 1 ? (
          <span className="absolute translate-x-[calc(50%-3px)] -translate-y-[calc(50%+3px)] right-0 top-0 rounded-full leading-none w-[26px] h-[26px] flex items-center justify-center text-green-50 bg-green-600 font-bold tabular-nums">
            {selectedCount}
          </span>
        ) : null}
      </div>
    </DragOverlay>
  )
}

export const snapTopLeftToCursor: Modifier = ({ activatorEvent, draggingNodeRect, transform }) => {
  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent)

    if (!activatorCoordinates) {
      return transform
    }

    const offsetX = activatorCoordinates.x - draggingNodeRect.left
    const offsetY = activatorCoordinates.y - draggingNodeRect.top

    return {
      ...transform,
      x: transform.x + offsetX + 5,
      y: transform.y + offsetY + 5,
    }
  }

  return transform
}
