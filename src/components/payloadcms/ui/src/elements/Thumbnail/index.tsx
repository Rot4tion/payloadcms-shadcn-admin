'use client'
import React from 'react'

import { cn } from '@/lib/utils'

import type { SanitizedCollectionConfig } from 'payload'

import { File } from '../../graphics/File/index.js'
import { ShimmerEffect } from '../ShimmerEffect/index.js'

export type ThumbnailProps = {
  className?: string
  collectionSlug?: string
  doc?: Record<string, unknown>
  fileSrc?: string
  height?: number
  imageCacheTag?: string
  size?: 'expand' | 'large' | 'medium' | 'none' | 'small'
  uploadConfig?: SanitizedCollectionConfig['upload']
  width?: number
}

export const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const {
    className = '',
    doc: { filename } = {},
    fileSrc,
    height,
    imageCacheTag,
    size,
    width,
  } = props
  const [fileExists, setFileExists] = React.useState(undefined)

  const sizeClasses = {
    none: '',
    small: 'max-h-[calc(var(--base)*5)] w-[calc(var(--base)*5)]',
    medium: 'max-h-[calc(var(--base)*7)] w-[calc(var(--base)*7)]',
    large: 'max-h-[calc(var(--base)*9)] w-[calc(var(--base)*9)]',
    expand:
      'w-full h-full relative [&_img]:absolute [&_img]:inset-0 [&_img]:w-full [&_img]:h-full [&_svg]:absolute [&_svg]:inset-0',
  }
  const classNames = cn(
    size !== 'none' &&
      'min-h-full shrink-0 self-stretch overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover',
    sizeClasses[size || 'medium'],
    className,
  )

  React.useEffect(() => {
    if (!fileSrc) {
      setFileExists(false)
      return
    }
    setFileExists(undefined)

    const img = new Image()
    img.src = fileSrc
    img.onload = () => {
      setFileExists(true)
    }
    img.onerror = () => {
      setFileExists(false)
    }
  }, [fileSrc])

  let src: null | string = null

  /**
   * If an imageCacheTag is provided, append it to the fileSrc
   * Check if the fileSrc already has a query string, if it does, append the imageCacheTag with an ampersand
   */
  if (fileSrc) {
    const queryChar = fileSrc?.includes('?') ? '&' : '?'
    src = imageCacheTag ? `${fileSrc}${queryChar}${encodeURIComponent(imageCacheTag)}` : fileSrc
  }

  return (
    <div className={classNames}>
      {fileExists === undefined && <ShimmerEffect height="100%" />}
      {fileExists && <img alt={filename as string} height={height} src={src} width={width} />}
      {fileExists === false && <File />}
    </div>
  )
}

type ThumbnailComponentProps = {
  readonly alt?: string
  readonly className?: string
  readonly filename: string
  readonly fileSrc: string
  readonly imageCacheTag?: string
  readonly size?: 'expand' | 'large' | 'medium' | 'none' | 'small'
}
export function ThumbnailComponent(props: ThumbnailComponentProps) {
  const { alt, className = '', filename, fileSrc, imageCacheTag, size } = props
  const [fileExists, setFileExists] = React.useState(undefined)

  const sizeClasses2 = {
    none: '',
    small: 'max-h-[calc(var(--base)*5)] w-[calc(var(--base)*5)]',
    medium: 'max-h-[calc(var(--base)*7)] w-[calc(var(--base)*7)]',
    large: 'max-h-[calc(var(--base)*9)] w-[calc(var(--base)*9)]',
    expand:
      'max-h-full w-full pt-[100%] relative [&_img]:absolute [&_img]:top-0 [&_svg]:absolute [&_svg]:top-0',
  }
  const classNames2 = cn(
    size !== 'none' &&
      'min-h-full shrink-0 self-stretch overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover',
    sizeClasses2[size || 'medium'],
    className,
  )

  React.useEffect(() => {
    if (!fileSrc) {
      setFileExists(false)
      return
    }
    setFileExists(undefined)

    const img = new Image()
    img.src = fileSrc
    img.onload = () => {
      setFileExists(true)
    }
    img.onerror = () => {
      setFileExists(false)
    }
  }, [fileSrc])

  let src: string = ''

  /**
   * If an imageCacheTag is provided, append it to the fileSrc
   * Check if the fileSrc already has a query string, if it does, append the imageCacheTag with an ampersand
   */
  if (fileSrc) {
    const queryChar = fileSrc?.includes('?') ? '&' : '?'
    src = imageCacheTag ? `${fileSrc}${queryChar}${encodeURIComponent(imageCacheTag)}` : fileSrc
  }

  return (
    <div className={classNames2}>
      {fileExists === undefined && <ShimmerEffect height="100%" />}
      {fileExists && <img alt={alt || filename} src={src} />}
      {fileExists === false && <File />}
    </div>
  )
}
