// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ClientCollectionConfig, TypeWithID } from 'payload'

import React from 'react'

import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { formatDocTitle } from '../../utilities/formatDocTitle/index'
import { cn } from '@/lib/utils'

export type ThumbnailCardProps = {
  alignLabel?: 'center' | 'left'
  className?: string
  collection?: ClientCollectionConfig
  doc?: { filename?: string } & TypeWithID
  label?: string
  onClick?: () => void
  onKeyDown?: () => void
  thumbnail: React.ReactNode
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = (props) => {
  const {
    alignLabel,
    className,
    collection,
    doc,
    label: labelFromProps,
    onClick,
    thumbnail,
  } = props

  const { config } = useConfig()

  const { i18n } = useTranslation()

  const classes = cn(
    'bg-transparent border-0 p-0 m-0 cursor-pointer w-full bg-input border border-border rounded-md shadow-sm transition-[border] duration-100 p-[calc(var(--base)*0.5)]',
    typeof onClick === 'function' &&
      'cursor-pointer hover:border-muted-foreground/50 focus:border-muted-foreground/50 active:border-muted-foreground/50',
    alignLabel === 'center' && 'text-center',
    className,
  )

  let title = labelFromProps

  if (!title) {
    title = formatDocTitle({
      collectionConfig: collection,
      data: doc,
      dateFormat: config.admin.dateFormat,
      fallback: doc?.filename,
      i18n,
    })
  }

  return (
    <button className={classes} onClick={onClick} title={title} type="button">
      <div className="flex items-center justify-center">{thumbnail}</div>
      <div className="py-[calc(var(--base)*0.75)] px-[calc(var(--base)*0.5)] pb-[calc(var(--base)*0.25)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
        {title}
      </div>
    </button>
  )
}
