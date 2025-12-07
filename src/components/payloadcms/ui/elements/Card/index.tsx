'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '../Button/index.js'

export type Props = {
  actions?: React.ReactNode
  buttonAriaLabel?: string
  className?: string
  href?: string
  id?: string
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ElementType
  onClick?: () => void
  title: string
  titleAs?: React.ElementType
}

export const Card: React.FC<Props> = (props) => {
  const { id, actions, buttonAriaLabel, className, href, onClick, title, titleAs } = props

  const isClickable = onClick || href
  const Tag = titleAs ?? 'div'

  return (
    <div
      className={cn(
        'relative flex w-full min-h-16 justify-between self-start gap-3',
        'rounded-md border border-border bg-muted/50 p-3',
        'transition-all duration-100 ease-out',
        isClickable && [
          'cursor-pointer',
          'hover:bg-muted/50 hover:border-border/80 hover:shadow-sm',
        ],
        className,
      )}
      id={id}
    >
      <Tag className={cn('text-sm font-semibold leading-5 w-full my-0.5', 'tracking-normal')}>
        {title}
      </Tag>
      {actions && (
        <div
          className={cn(
            'relative z-[2] inline-flex',
            '[&_.btn]:m-0 [&_.btn]:shrink-0',
            '[&_.btn__icon]:border [&_.btn__icon]:border-border',
            '[&_.btn__icon]:transition-all [&_.btn__icon]:duration-100',
            '[&_.btn__icon:hover]:border-muted-foreground [&_.btn__icon:hover]:bg-background [&_.btn__icon:hover]:shadow-sm',
          )}
        >
          {actions}
        </div>
      )}
      {isClickable && (
        <Button
          aria-label={buttonAriaLabel}
          buttonStyle="none"
          className="absolute inset-0 z-[1] m-0 size-full"
          el="link"
          onClick={onClick}
          to={href}
        />
      )}
    </div>
  )
}
