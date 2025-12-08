'use client'
import { formatFilesize } from 'payload/shared'
import React from 'react'

export type FileMetaProps = {
  filename: string
  filesize: number
  height?: number
  mimeType: string
  sizes?: unknown
  url: string
  width?: number
}

import { CopyToClipboard } from '../../CopyToClipboard'

export const FileMeta: React.FC<FileMetaProps> = (props) => {
  const { filename, filesize, height, mimeType, url: fileURL, width } = props

  return (
    <div>
      <div className="flex gap-[calc(var(--base)*0.4)] [&_a]:font-semibold [&_a]:no-underline [&_a]:overflow-hidden [&_a]:text-ellipsis [&_a]:whitespace-nowrap hover:[&_a]:underline focus-visible:[&_a]:underline">
        <a href={fileURL} rel="noopener noreferrer" target="_blank">
          {filename}
        </a>
        <CopyToClipboard defaultMessage="Copy URL" value={fileURL} />
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {formatFilesize(filesize)}
        {typeof width === 'number' && typeof height === 'number' && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {width}x{height}
          </React.Fragment>
        )}
        {mimeType && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {mimeType}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
