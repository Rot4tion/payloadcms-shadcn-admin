'use client'
import type { MouseEvent } from 'react'

import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Link } from '../Link/index.js'

const bannerVariants = cva(
  'flex items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-foreground',
        error: 'border-destructive/50 bg-destructive/10 text-destructive',
        info: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
        success: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
      },
      hasAction: {
        true: 'cursor-pointer hover:opacity-80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasAction: false,
    },
  },
)

type onClick = (event: MouseEvent) => void

export type Props = Readonly<{
  alignIcon?: 'left' | 'right'
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  onClick?: onClick
  to?: string
  type?: 'default' | 'error' | 'info' | 'success'
}> &
  VariantProps<typeof bannerVariants>

export type RenderedTypeProps = {
  children?: React.ReactNode
  className?: string
  onClick?: onClick
  to: string
}

export const Banner: React.FC<Props> = ({
  type = 'default',
  alignIcon = 'right',
  children,
  className,
  icon,
  onClick,
  to,
}) => {
  let RenderedType: React.ComponentType<RenderedTypeProps> | React.ElementType = 'div'

  if (onClick && !to) {
    RenderedType = 'button'
  }
  if (to) {
    RenderedType = Link
  }

  return (
    <RenderedType
      className={cn(
        bannerVariants({ variant: type, hasAction: !!(to || onClick) }),
        alignIcon === 'left' && 'flex-row',
        alignIcon === 'right' && 'flex-row-reverse',
        className,
      )}
      href={to || null}
      onClick={onClick}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </RenderedType>
  )
}
