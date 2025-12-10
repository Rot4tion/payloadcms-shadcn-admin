'use client'
import React, { Fragment } from 'react'

import { useDocumentInfo } from '@payloadcms/ui'
import { useDocumentTitle } from '../../providers/DocumentTitle'
import { IDLabel } from '../IDLabel'
import { cn } from '@/lib/utils'

export type RenderTitleProps = {
  className?: string
  element?: React.ElementType
  fallback?: string
  fallbackToID?: boolean
  title?: string
}

export const RenderTitle: React.FC<RenderTitleProps> = (props) => {
  const { className, element = 'h1', fallback, title: titleFromProps } = props

  const { id, isInitializing } = useDocumentInfo()
  const { title: titleFromContext } = useDocumentTitle()

  const title = titleFromProps || titleFromContext || fallback

  const idAsTitle = title === id

  const Tag = element

  // Render and invisible character to prevent layout shift when the title populates from context
  const EmptySpace = <Fragment>&nbsp;</Fragment>

  return (
    <Tag
      className={cn(
        // Base styles - inline-block
        'inline-block',
        // h1 styles from PayloadCMS type.scss: font-size: base(1.6)=32px, line-height: base(1.8)=36px
        // On small screens: font-size: base(1.25)=25px
        // Use leading-normal to prevent clipping of brackets []
        element === 'h1' &&
          'text-[32px] leading-normal font-medium max-sm:text-[25px] max-sm:tracking-tight',
        className,
      )}
      data-doc-id={id}
      title={title}
    >
      {isInitializing ? (
        EmptySpace
      ) : (
        <Fragment>
          {idAsTitle ? (
            <IDLabel className="align-middle relative" id={id ?? ''} />
          ) : (
            title || EmptySpace
          )}
        </Fragment>
      )}
    </Tag>
  )
}
