'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '../../Button/index'
import { Thumbnail } from '../../Thumbnail/index'
import { UploadActions } from '../../Upload/index'
import { FileMeta } from '../FileMeta/index'

import type { Data, FileSizes, SanitizedCollectionConfig } from 'payload'

export type StaticFileDetailsProps = {
  customUploadActions?: React.ReactNode[]
  doc: {
    sizes?: FileSizes
  } & Data
  enableAdjustments?: boolean
  handleRemove?: () => void
  hasImageSizes?: boolean
  hideRemoveFile?: boolean
  imageCacheTag?: string
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const StaticFileDetails: React.FC<StaticFileDetailsProps> = (props) => {
  const {
    customUploadActions,
    doc,
    enableAdjustments,
    handleRemove,
    hasImageSizes,
    hideRemoveFile,
    imageCacheTag,
    uploadConfig,
  } = props

  const { filename, filesize, height, mimeType, thumbnailURL, url, width } = doc

  const previewAllowed = uploadConfig.displayPreview ?? true

  return (
    <div className="bg-muted/50 border border-border rounded-md shadow-sm">
      <header className="flex flex-row flex-wrap relative max-lg:flex-wrap">
        {previewAllowed && (
          <Thumbnail
            className="max-lg:w-1/2 max-lg:order-1"
            doc={doc}
            fileSrc={thumbnailURL || url}
            imageCacheTag={imageCacheTag}
            uploadConfig={uploadConfig}
          />
        )}
        <div
          className={cn(
            'p-(--base) px-[calc(var(--base)*1.2)] w-auto grow min-w-[280px] max-w-full',
            'flex flex-col justify-between self-stretch gap-[calc(var(--base)*0.2)]',
            'max-xl:p-(--base)',
            'max-lg:order-3 max-lg:w-full',
          )}
        >
          <FileMeta
            filename={filename as string}
            filesize={filesize as number}
            height={height as number}
            mimeType={mimeType as string}
            url={url as string}
            width={width as number}
          />

          {(enableAdjustments || (hasImageSizes && doc.filename) || customUploadActions) && (
            <UploadActions
              customActions={customUploadActions}
              enableAdjustments={Boolean(enableAdjustments)}
              enablePreviewSizes={hasImageSizes && doc.filename}
              mimeType={mimeType}
            />
          )}
        </div>
        {!hideRemoveFile && handleRemove && (
          <Button
            buttonStyle="icon-label"
            className={cn(
              'absolute m-0 top-(--base) right-(--base)',
              'max-lg:order-2',
              '[&_.btn__icon]:border [&_.btn__icon]:border-border [&_.btn__icon]:bg-background [&_.btn__icon]:shadow-sm',
              '[&_.btn__icon]:transition-[border] [&_.btn__icon]:duration-100',
              'hover:[&_.btn__icon]:border-muted-foreground/50',
            )}
            icon="x"
            iconStyle="with-border"
            onClick={handleRemove}
            round
          />
        )}
      </header>
    </div>
  )
}
