// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ElementType, HTMLAttributes } from 'react'

import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Link } from '../Link'
import { useDraggableSortable } from '../DraggableSortable/useDraggableSortable'

const pillVariants = cva(
  'inline-flex items-center gap-[0.2em] font-normal transition-colors whitespace-nowrap text-[1rem] leading-[calc(var(--base)*1.2)]',
  {
    variants: {
      variant: {
        light: 'bg-muted text-foreground',
        dark: 'bg-foreground text-background',
        white: 'bg-background text-foreground border border-border',
        'always-white': 'bg-white text-gray-900',
        'light-gray': 'bg-muted/50 text-muted-foreground',
        error: 'bg-destructive/10 text-destructive',
        success: 'bg-green-500/10 text-green-700 dark:text-green-400',
        warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      },
      size: {
        small: 'py-0 px-[calc(var(--base)*0.4)] [--pill-icon-size:calc(var(--base)*0.9)]',
        medium: 'py-[calc(var(--base)*0.2)] px-[calc(var(--base)*0.6)]',
      },
      rounded: {
        true: 'rounded-full text-xs',
        false: 'rounded-[3px]',
      },
      hasAction: {
        true: 'cursor-pointer hover:opacity-80',
        false: '',
      },
      isDragging: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'medium',
      rounded: false,
      hasAction: false,
      isDragging: false,
    },
  },
)

export type PillStyle =
  | 'always-white'
  | 'dark'
  | 'error'
  | 'light'
  | 'light-gray'
  | 'success'
  | 'warning'
  | 'white'

export type PillProps = {
  alignIcon?: 'left' | 'right'
  'aria-checked'?: boolean
  'aria-controls'?: string
  'aria-expanded'?: boolean
  'aria-label'?: string
  children?: React.ReactNode
  className?: string
  draggable?: boolean
  elementProps?: {
    ref: React.RefCallback<HTMLElement>
  } & HTMLAttributes<HTMLElement>
  icon?: React.ReactNode
  id?: string
  onClick?: () => void
  /**
   * @default 'light'
   */
  pillStyle?: PillStyle
  rounded?: boolean
  size?: 'medium' | 'small'
  to?: string
} & VariantProps<typeof pillVariants>

export type RenderedTypeProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  to: string
  type?: 'button'
}

const DraggablePill: React.FC<PillProps & { isDraggingState?: boolean }> = (props) => {
  const { id, className } = props

  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggableSortable({
    id,
  })

  return (
    <StaticPill
      {...props}
      isDraggingState={isDragging}
      elementProps={{
        ...listeners,
        ...attributes,
        ref: setNodeRef,
        style: {
          transform,
        },
      }}
    />
  )
}

const StaticPill: React.FC<PillProps & { isDraggingState?: boolean }> = (props) => {
  const {
    id,
    alignIcon = 'right',
    'aria-checked': ariaChecked,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-label': ariaLabel,
    children,
    className,
    draggable,
    elementProps,
    icon,
    isDraggingState,
    onClick,
    pillStyle = 'light',
    rounded = false,
    size = 'medium',
    to,
  } = props

  let Element: ElementType | React.FC<RenderedTypeProps> = 'div'

  if (onClick && !to) {
    Element = 'button'
  }

  if (to) {
    Element = Link
  }

  return (
    <Element
      {...elementProps}
      aria-checked={ariaChecked}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={cn(
        pillVariants({
          variant: pillStyle,
          size,
          rounded,
          hasAction: !!(to || onClick),
          isDragging: isDraggingState,
        }),
        alignIcon === 'left' && 'flex-row-reverse',
        draggable && 'cursor-grab',
        className,
      )}
      href={to || null}
      id={id}
      onClick={onClick}
      type={Element === 'button' ? 'button' : undefined}
    >
      <span className="pill__label flex items-center gap-1">{children}</span>
      {Boolean(icon) && (
        <span className="pill__icon shrink-0 flex items-center [&_.icon]:w-[var(--pill-icon-size,calc(var(--base)*1.2))] [&_.icon]:h-[var(--pill-icon-size,calc(var(--base)*1.2))]">
          {icon}
        </span>
      )}
    </Element>
  )
}

export const Pill: React.FC<PillProps> = (props) => {
  const { draggable } = props

  if (draggable) {
    return <DraggablePill {...props} />
  }
  return <StaticPill {...props} />
}
