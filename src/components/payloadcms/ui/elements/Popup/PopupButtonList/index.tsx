'use client'
import type { LinkProps } from 'next/link'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Link } from '../../Link/index'

export { PopupListDivider as Divider } from '../PopupDivider/index'
export { PopupListGroupLabel as GroupLabel } from '../PopupGroupLabel/index'

const textAlignClasses = {
  left: 'text-left rtl:text-right',
  center: 'text-center',
  right: 'text-right rtl:text-left',
} as const

export const ButtonGroup: React.FC<{
  buttonSize?: 'default' | 'small'
  children: React.ReactNode
  className?: string
  textAlign?: 'center' | 'left' | 'right'
}> = ({ buttonSize = 'default', children, className, textAlign = 'left' }) => {
  return (
    <div className={cn('flex flex-col', textAlignClasses[textAlign], className)}>{children}</div>
  )
}

type MenuButtonProps = {
  active?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  href?: LinkProps['href']
  id?: string
  onClick?: (e?: React.MouseEvent) => void
}

const buttonStyles = cn(
  'w-full cursor-pointer rounded px-2 py-1 text-inherit no-underline',
  'leading-6 transition-colors',
  'hover:bg-accent focus-visible:bg-accent focus-within:bg-accent',
  'focus-visible:outline-none',
)

const disabledStyles = cn('cursor-not-allowed text-muted-foreground', 'hover:bg-muted/50')

const activeStyles = 'bg-muted'

export const Button: React.FC<MenuButtonProps> = ({
  id,
  active,
  children,
  className,
  disabled,
  href,
  onClick,
}) => {
  const classes = cn(buttonStyles, disabled && disabledStyles, active && activeStyles, className)

  if (!disabled) {
    if (href) {
      return (
        <Link
          className={classes}
          href={href}
          id={id}
          onClick={(e) => {
            if (onClick) {
              onClick(e)
            }
          }}
          prefetch={false}
        >
          {children}
        </Link>
      )
    }

    if (onClick) {
      return (
        <button
          className={cn(classes, 'border-0 bg-transparent text-left')}
          id={id}
          onClick={(e) => {
            if (onClick) {
              onClick(e)
            }
          }}
          type="button"
        >
          {children}
        </button>
      )
    }
  }

  return (
    <div className={classes} id={id}>
      {children}
    </div>
  )
}
