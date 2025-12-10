'use client'
import React from 'react'

import { cn } from '@/lib/utils'

const sizeClasses = {
  xsmall: 'p-0.5',
  small: 'p-1',
  medium: 'p-1.5',
  large: 'p-2',
} as const

export type PopupTriggerProps = {
  active: boolean
  button: React.ReactNode
  buttonType: 'custom' | 'default' | 'none'
  className?: string
  disabled?: boolean
  noBackground?: boolean
  setActive: (active: boolean) => void
  size?: 'large' | 'medium' | 'small' | 'xsmall'
}

export const PopupTrigger: React.FC<PopupTriggerProps> = (props) => {
  const { active, button, buttonType, className, disabled, noBackground, setActive, size } = props

  const handleClick = React.useCallback(() => {
    setActive(!active)
  }, [active, setActive])

  if (buttonType === 'none') {
    return null
  }

  const baseStyles = cn(
    'inline-flex h-full cursor-pointer items-center border-0 p-0 font-inherit text-inherit leading-inherit',
    !noBackground && 'bg-transparent',
    size && sizeClasses[size],
    disabled && 'cursor-not-allowed opacity-50',
    className,
  )

  if (buttonType === 'custom') {
    return (
      <div
        className={baseStyles}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleClick()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {button}
      </div>
    )
  }

  return (
    <button
      className={baseStyles}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleClick()
        }
      }}
      tabIndex={0}
      type="button"
    >
      {button}
    </button>
  )
}
