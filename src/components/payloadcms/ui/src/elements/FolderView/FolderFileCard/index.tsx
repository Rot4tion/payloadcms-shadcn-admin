'use client'

import type { FolderOrDocument } from 'payload/shared'

import { useDroppable } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { DocumentIcon } from '../../../icons/Document/index.js'
import { ThreeDotsIcon } from '../../../icons/ThreeDots/index.js'
import { useConfig } from '@payloadcms/ui'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '@payloadcms/ui'
import { Popup } from '../../Popup/index.js'
import { Thumbnail } from '../../Thumbnail/index.js'
import { ColoredFolderIcon } from '../ColoredFolderIcon/index.js'
import { DraggableWithClick } from '../DraggableWithClick/index.js'

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
        'folder-file-card relative grid grid-areas-[details] rounded-md border border-[var(--card-border-color)] bg-[var(--card-bg-color)] cursor-pointer',
        '[--card-border-color:var(--theme-elevation-150)] [--card-bg-color:var(--theme-elevation-0)]',
        '[--card-preview-bg-color:var(--theme-elevation-50)] [--card-icon-dots-bg-color:transparent]',
        '[--card-icon-dots-color:var(--theme-elevation-600)] [--card-titlebar-icon-color:var(--theme-elevation-300)]',
        '[--card-label-color:var(--theme-text)] [--card-preview-icon-color:var(--theme-elevation-400)]',
        '[--assigned-collections-color:var(--theme-elevation-900)]',
        '[&_.icon--dots]:rotate-90 [&_.icon--dots]:transition-opacity [&_.icon--dots]:duration-200',
        '[&_.icon--dots]:text-[var(--card-icon-dots-color)] [&_.icon--dots]:rounded-sm [&_.icon--dots]:bg-[var(--card-icon-dots-bg-color)]',
        type === 'file' && 'grid-rows-[1fr_auto] grid-areas-[preview_details]',
        isSelected && [
          '[--card-border-color:var(--theme-success-300)] [--card-bg-color:var(--theme-success-50)]',
          '[--card-preview-bg-color:var(--theme-success-50)] [--card-icon-dots-bg-color:var(--theme-success-50)]',
          '[--card-icon-dots-color:var(--theme-success-400)] [--card-titlebar-icon-color:var(--theme-success-800)]',
          '[--card-label-color:var(--theme-success-800)] [--card-preview-icon-color:var(--theme-success-800)]',
          '[--assigned-collections-color:var(--theme-success-850)]',
          '[&_.icon--dots]:opacity-100',
        ],
        !isSelected &&
          '[&_.icon--dots]:opacity-0 hover:[--card-bg-color:var(--theme-elevation-50)] hover:[&_.icon--dots]:opacity-100',
        disabled &&
          '[--card-bg-color:var(--theme-elevation-50)] cursor-not-allowed after:content-[""] after:absolute after:bg-background after:opacity-50 after:w-[calc(100%+2px)] after:h-[calc(100%+2px)] after:-top-px after:-left-px after:rounded-[inherit]',
        isOver &&
          '[--card-border-color:var(--theme-elevation-500)] [--card-bg-color:var(--theme-elevation-150)] [--card-titlebar-icon-color:var(--theme-elevation-250)]',
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

      {type === 'file' ? (
        <div className="[grid-area:preview] aspect-square bg-[var(--card-preview-bg-color)] rounded-t-sm border-b border-[var(--card-border-color)] grid items-center justify-center pointer-events-none [grid-template-columns:auto_50%_auto] [&:has(.thumbnail)]:[grid-template-columns:unset] [&:has(.thumbnail)]:justify-stretch [&>.icon]:col-[2] [&_.icon--document]:pointer-events-none [&_.icon--document]:h-1/2 [&_.icon--document]:w-1/2 [&_.icon--document]:m-auto [&_.icon--document]:text-[var(--card-preview-icon-color)] [&_.thumbnail]:w-full [&_.thumbnail]:h-full [&_.thumbnail]:relative [&_.thumbnail]:rounded-[inherit] [&_.thumbnail>img]:absolute [&_.thumbnail>img]:inset-0 [&_.thumbnail>img]:w-full [&_.thumbnail>img]:h-full [&_.thumbnail>img]:object-cover [&_.thumbnail>img]:rounded-[inherit]">
          {previewUrl ? <Thumbnail fileSrc={previewUrl} /> : <DocumentIcon />}
        </div>
      ) : null}

      <div className="relative pointer-events-none flex flex-col [grid-area:details] rounded-[inherit] grid grid-cols-[auto_1fr_auto] gap-4 items-center p-[calc(var(--base)/2)] bg-[var(--card-bg-color)] [&_.popup]:pointer-events-auto">
        <div className="[&_.icon]:shrink-0 [&_.icon]:text-[var(--card-titlebar-icon-color)]">
          {type === 'file' ? <DocumentIcon /> : <ColoredFolderIcon />}
        </div>
        <div className="grid">
          <p
            className="overflow-hidden font-bold indent-px whitespace-nowrap text-ellipsis leading-normal text-[var(--card-label-color)]"
            title={title}
          >
            <span>{title}</span>
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
    return folderType.reduce((acc, collection) => {
      const collectionConfig = config.collections?.find((c) => c.slug === collection)
      if (collectionConfig) {
        return [...acc, getTranslation(collectionConfig.labels.plural, i18n)]
      }
      return acc
    }, [])
  }, [folderType, config.collections, i18n])

  return (
    <p className="text-[var(--assigned-collections-color)] opacity-50 mt-1 leading-normal">
      {collectionsDisplayText.map((label, index) => (
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
