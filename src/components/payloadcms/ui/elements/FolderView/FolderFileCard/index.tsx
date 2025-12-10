// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { FolderOrDocument } from 'payload/shared'

import { useDroppable } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { DocumentIcon } from '../../../icons/Document'
import { ThreeDotsIcon } from '../../../icons/ThreeDots'
import { useConfig } from '@payloadcms/ui'
import { useFolder } from '../../../providers/Folders'
import { useTranslation } from '@payloadcms/ui'
import { Popup } from '../../Popup'
import { Thumbnail } from '../../Thumbnail'
import { ColoredFolderIcon } from '../ColoredFolderIcon'
import { DraggableWithClick } from '../DraggableWithClick'

type Props = {
  readonly className?: string
  readonly disabled?: boolean
  readonly folderType?: string[]
  readonly id: number | string
  readonly isDeleting?: boolean
  readonly isFocused?: boolean
  readonly isSelected?: boolean
  readonly itemKey: string
  readonly onClick?: (e: React.MouseEvent) => void
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
  readonly PopupActions?: React.ReactNode
  readonly previewUrl?: string
  readonly selectedCount?: number
  readonly title: string
  readonly type: 'file' | 'folder'
}
export function FolderFileCard({
  id,
  type,
  className = '',
  disabled = false,
  folderType,
  isDeleting = false,
  isFocused = false,
  isSelected = false,
  itemKey,
  onClick,
  onKeyDown,
  PopupActions,
  previewUrl,
  selectedCount = 0,
  title,
}: Props) {
  const disableDrop = !id || disabled || type !== 'folder'
  const { isOver, setNodeRef } = useDroppable({
    id: itemKey,
    data: {
      id,
      type,
      folderType,
    },
    disabled: disableDrop,
  })
  const ref = React.useRef(null)

  React.useEffect(() => {
    const copyOfRef = ref.current
    if (isFocused && ref.current) {
      ref.current.focus()
    } else if (!isFocused && ref.current) {
      ref.current.blur()
    }

    return () => {
      if (copyOfRef) {
        copyOfRef.blur()
      }
    }
  }, [isFocused])

  return (
    <DraggableWithClick
      className={cn(
        'folder-file-card',
        'relative grid rounded-md border cursor-pointer',
        'border-border bg-card',
        // Icon dots styling
        '[&_.icon--dots]:rotate-90 [&_.icon--dots]:transition-opacity [&_.icon--dots]:duration-200',
        // File type: preview on top, details below
        type === 'file' && 'grid-rows-[1fr_auto]',
        // Selected state
        isSelected && [
          'border-primary/50 bg-primary/5',
          '[&_.icon--dots]:opacity-100',
          '[&_.folder-file-card__preview]:bg-primary/5',
          '[&_.folder-file-card__titlebar]:bg-primary/5',
          '[&_.folder-file-card__name]:text-primary',
          '[&_.folder-file-card__icon]:text-primary',
        ],
        // Not selected: show dots on hover
        !isSelected && [
          '[&_.icon--dots]:opacity-0',
          'hover:bg-muted hover:[&_.icon--dots]:opacity-100',
        ],
        // Disabled state
        disabled && [
          'bg-muted cursor-not-allowed',
          'after:content-[""] after:absolute after:bg-background/50 after:inset-0 after:rounded-[inherit]',
        ],
        // Drag over state
        isOver && 'border-foreground/50 bg-muted',
        className,
      )}
      disabled={disabled || (!onClick && !onKeyDown)}
      key={itemKey}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {!disableDrop ? (
        <div
          className="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none"
          ref={setNodeRef}
        />
      ) : null}

      {/* Preview area for files */}
      {type === 'file' ? (
        <div
          className={cn(
            'folder-file-card__preview',
            'aspect-square bg-muted rounded-t-sm border-b border-border',
            'flex items-center justify-center pointer-events-none overflow-hidden',
          )}
        >
          {previewUrl ? (
            <Thumbnail className="[&_img]:rounded-t-sm" fileSrc={previewUrl} size="expand" />
          ) : (
            <DocumentIcon className="w-1/4 h-1/4 text-muted-foreground" />
          )}
        </div>
      ) : null}

      {/* Titlebar area */}
      <div
        className={cn(
          'folder-file-card__titlebar',
          'relative pointer-events-none rounded-[inherit]',
          'grid grid-cols-[auto_1fr_auto] gap-4 items-center',
          'p-[calc(var(--base)/2)] bg-card',
          '[&_.popup]:pointer-events-auto',
        )}
      >
        <div className="folder-file-card__icon text-muted-foreground">
          {type === 'file' ? <DocumentIcon /> : <ColoredFolderIcon />}
        </div>
        <div className="grid min-w-0">
          <p
            className={cn(
              'folder-file-card__name',
              'overflow-hidden font-bold whitespace-nowrap text-ellipsis leading-normal',
            )}
            title={title}
          >
            {title}
          </p>
          {folderType && folderType.length > 0 ? (
            <AssignedCollections folderType={folderType} />
          ) : null}
        </div>
        {PopupActions ? (
          <Popup
            button={<ThreeDotsIcon />}
            disabled={selectedCount > 1 || (selectedCount === 1 && !isSelected)}
            horizontalAlign="right"
            size="large"
            verticalAlign="bottom"
          >
            {PopupActions}
          </Popup>
        ) : null}
      </div>
    </DraggableWithClick>
  )
}

function AssignedCollections({ folderType }: { folderType: string[] }) {
  const { config } = useConfig()
  const { i18n } = useTranslation()

  const collectionsDisplayText = React.useMemo(() => {
    return folderType.reduce<string[]>((acc, collection) => {
      const collectionConfig = config.collections?.find((c) => c.slug === collection)
      if (collectionConfig) {
        return [...acc, getTranslation(collectionConfig.labels.plural, i18n)]
      }
      return acc
    }, [])
  }, [folderType, config.collections, i18n])

  return (
    <p className="text-muted-foreground opacity-50 mt-1 leading-normal">
      {collectionsDisplayText.map((label: string, index: number) => (
        <span key={label}>
          {label}
          {index < folderType.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  )
}

type ContextCardProps = {
  readonly className?: string
  readonly index: number // todo: possibly remove
  readonly item: FolderOrDocument
  readonly type: 'file' | 'folder'
}
export function ContextFolderFileCard({ type, className, index, item }: ContextCardProps) {
  const { checkIfItemIsDisabled, focusedRowIndex, onItemClick, onItemKeyPress, selectedItemKeys } =
    useFolder()
  const isSelected = selectedItemKeys.has(item.itemKey)
  const isDisabled = checkIfItemIsDisabled(item)

  return (
    <FolderFileCard
      className={className}
      disabled={isDisabled}
      folderType={item.value.folderType || []}
      id={item.value.id}
      isFocused={focusedRowIndex === index}
      isSelected={isSelected}
      itemKey={item.itemKey}
      onClick={(event) => {
        void onItemClick({ event, index, item })
      }}
      onKeyDown={(event) => {
        void onItemKeyPress({ event, index, item })
      }}
      previewUrl={item.value.url}
      title={item.value._folderOrDocumentTitle}
      type={type}
    />
  )
}
