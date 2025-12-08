// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { Data, FileSize, SanitizedCollectionConfig, SanitizedUploadConfig } from 'payload'

import React, { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { FileMeta } from '../FileDetails/FileMeta/index'

type FileInfo = {
  url: string
} & FileSize
type FilesSizesWithUrl = {
  [key: string]: FileInfo
}

const sortSizes = (sizes: FilesSizesWithUrl, imageSizes: SanitizedUploadConfig['imageSizes']) => {
  if (!imageSizes || imageSizes.length === 0) {
    return sizes
  }

  const orderedSizes: FilesSizesWithUrl = {}

  imageSizes.forEach(({ name }) => {
    if (sizes[name]) {
      orderedSizes[name] = sizes[name]
    }
  })

  return orderedSizes
}

type PreviewSizeCardProps = {
  active: boolean
  meta: FileInfo
  name: string
  onClick?: () => void
  previewSrc: string
}
const PreviewSizeCard: React.FC<PreviewSizeCardProps> = ({
  name,
  active,
  meta,
  onClick,
  previewSrc,
}) => {
  return (
    <div
      className={cn(
        'p-[calc(var(--base)*0.5)] flex gap-(--base) cursor-pointer transition-colors duration-200 hover:bg-muted',
        'max-md:p-[calc(var(--base)*0.25)]',
        active && 'bg-muted',
      )}
      onClick={typeof onClick === 'function' ? onClick : undefined}
      onKeyDown={(e) => {
        if (typeof onClick !== 'function') {
          return
        }
        if (e.key === 'Enter') {
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex w-[30%] min-w-[30%] items-center justify-center">
        <img alt={meta.filename} src={previewSrc} />
      </div>
      <div className="py-[calc(var(--base)*0.5)] overflow-hidden text-ellipsis">
        <div className="text-muted-foreground overflow-hidden text-ellipsis">{name}</div>
        <FileMeta {...meta} />
      </div>
    </div>
  )
}

export type PreviewSizesProps = {
  doc: {
    sizes?: FilesSizesWithUrl
  } & Data
  imageCacheTag?: string
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const PreviewSizes: React.FC<PreviewSizesProps> = ({ doc, imageCacheTag, uploadConfig }) => {
  const { imageSizes } = uploadConfig
  const { sizes } = doc

  const [orderedSizes, setOrderedSizes] = useState<FilesSizesWithUrl>(() =>
    sortSizes(sizes, imageSizes),
  )
  const [selectedSize, setSelectedSize] = useState<null | string>(null)

  const generateImageUrl = (doc) => {
    if (!doc.filename) {
      return null
    }
    if (doc.url) {
      return `${doc.url}${imageCacheTag ? `?${encodeURIComponent(imageCacheTag)}` : ''}`
    }
  }
  useEffect(() => {
    setOrderedSizes(sortSizes(sizes, imageSizes))
  }, [sizes, imageSizes, imageCacheTag])

  const mainPreviewSrc = selectedSize
    ? generateImageUrl(doc.sizes[selectedSize])
    : generateImageUrl(doc)

  const originalImage = useMemo(
    (): FileInfo => ({
      filename: doc.filename,
      filesize: doc.filesize,
      height: doc.height,
      mimeType: doc.mimeType,
      url: doc.url,
      width: doc.width,
    }),
    [doc],
  )
  const originalFilename = 'Original'

  return (
    <div className="mt-[calc(var(--base)*2)] -mx-[var(--gutter-h)] border-t border-border max-h-[calc(100vh-calc(var(--base)*6))] h-full flex flex-row max-lg:mt-(--base) max-lg:max-h-[calc(100vh-calc(var(--base)*4))] max-md:mt-0 max-md:max-h-[calc(100vh-calc(var(--base)*3.5))] max-md:flex-col max-md:justify-between">
      <div className="min-w-[60%] border-r border-border max-md:h-[60%] max-md:border-none">
        <div className="border-b border-border py-(--base) px-[var(--gutter-h)] flex flex-wrap gap-x-(--base) [&_.file-meta]:flex [&_.file-meta]:flex-wrap [&_.file-meta]:gap-x-(--base) [&_.file-meta]:text-wrap [&_.file-meta]:w-full [&_.file-meta__url]:w-full">
          <div className="text-muted-foreground overflow-hidden text-ellipsis">
            {selectedSize || originalFilename}
          </div>
          <FileMeta {...(selectedSize ? orderedSizes[selectedSize] : originalImage)} />
        </div>
        <img
          alt={doc.filename}
          className="max-h-[calc(100%-calc(var(--base)*6))] p-[calc(var(--base)*1.5)] pl-[var(--gutter-h)] object-contain max-md:max-h-[calc(100%-calc(var(--base)*4))] max-md:p-[calc(var(--gutter-h)*2)] max-md:px-[var(--gutter-h)]"
          src={mainPreviewSrc}
        />
      </div>
      <div className="pr-[var(--gutter-h)] overflow-y-scroll [scrollbar-width:none] [-webkit-scrollbar]:w-0 after:content-[''] after:block after:sticky after:bottom-0 after:left-0 after:h-[calc(var(--base)*4)] after:w-full after:bg-gradient-to-b after:from-transparent after:to-background after:pointer-events-none max-md:border-t max-md:border-border max-md:h-[40%]">
        <div className="list-none flex flex-col gap-[calc(var(--base)*0.5)] m-0 py-[calc(var(--base)*1.5)] pl-[calc(var(--base)*1.5)] pr-0 max-md:p-[calc(var(--gutter-h)*2)] max-md:px-[var(--gutter-h)]">
          <PreviewSizeCard
            active={!selectedSize}
            meta={originalImage}
            name={originalFilename}
            onClick={() => setSelectedSize(null)}
            previewSrc={generateImageUrl(doc)}
          />

          {Object.entries(orderedSizes).map(([key, val]) => {
            const selected = selectedSize === key
            const previewSrc = generateImageUrl(val)

            if (previewSrc) {
              return (
                <PreviewSizeCard
                  active={selected}
                  key={key}
                  meta={val}
                  name={key}
                  onClick={() => setSelectedSize(key)}
                  previewSrc={previewSrc}
                />
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
