'use client'
import type {
  ClientCollectionConfig,
  DefaultCellComponentProps,
  TextFieldClient,
  UploadFieldClient,
} from 'payload'

import { getBestFitFromSizes, isImage } from 'payload/shared'
import React from 'react'

import { Thumbnail } from '../../../../Thumbnail/index.js'

export interface FileCellProps extends DefaultCellComponentProps<
  TextFieldClient | UploadFieldClient
> {
  readonly collectionConfig: ClientCollectionConfig
}

export const FileCell: React.FC<FileCellProps> = ({
  cellData: filename,
  collectionConfig,
  field,
  rowData,
}) => {
  const fieldPreviewAllowed = 'displayPreview' in field ? field.displayPreview : undefined
  const previewAllowed = fieldPreviewAllowed ?? collectionConfig.upload?.displayPreview ?? true

  if (previewAllowed) {
    const isFileImage = isImage(rowData?.mimeType)
    let fileSrc: string | undefined = isFileImage
      ? rowData?.thumbnailURL || rowData?.url
      : rowData?.thumbnailURL

    if (isFileImage) {
      fileSrc = getBestFitFromSizes({
        sizes: rowData?.sizes,
        thumbnailURL: rowData?.thumbnailURL,
        url: rowData?.url,
        width: rowData?.width,
      })
    }

    return (
      <div className="flex flex-nowrap">
        <Thumbnail
          className="inline-block max-w-[calc(var(--base)*2)] h-[calc(var(--base)*2)] rounded-sm"
          collectionSlug={collectionConfig?.slug}
          doc={{
            ...rowData,
            filename,
          }}
          fileSrc={fileSrc}
          size="small"
          uploadConfig={collectionConfig?.upload}
        />
        <span className="self-center ltr:ml-(--base) rtl:mr-(--base)">{String(filename)}</span>
      </div>
    )
  } else {
    return <>{String(filename)}</>
  }
}
