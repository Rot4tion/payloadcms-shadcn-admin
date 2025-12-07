'use client'
import type { CSSProperties } from 'react'

export * as PopupList from './PopupButtonList/index'

import React, { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger as ShadcnPopoverTrigger,
} from '@/components/ui/popover'
import { PopupTrigger } from './PopupTrigger/index'

export type PopupProps = {
  backgroundColor?: CSSProperties['backgroundColor']
  boundingRef?: React.RefObject<HTMLElement>
  button?: React.ReactNode
  buttonClassName?: string
  buttonSize?: 'large' | 'medium' | 'small' | 'xsmall'
  buttonType?: 'custom' | 'default' | 'none'
  caret?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  forceOpen?: boolean
  horizontalAlign?: 'center' | 'left' | 'right'
  id?: string
  initActive?: boolean
  noBackground?: boolean
  onToggleClose?: () => void
  onToggleOpen?: (active: boolean) => void
  render?: (any) => React.ReactNode
  showOnHover?: boolean
  showScrollbar?: boolean
  size?: 'fit-content' | 'large' | 'medium' | 'small'
  verticalAlign?: 'bottom' | 'top'
}

const sizeClasses = {
  'fit-content': 'w-auto',
  small: 'min-w-[100px]',
  medium: 'min-w-[150px]',
  large: 'min-w-[200px]',
} as const

export const Popup: React.FC<PopupProps> = (props) => {
  const {
    id,
    button,
    buttonClassName,
    buttonSize,
    buttonType = 'default',
    children,
    className,
    disabled,
    forceOpen,
    horizontalAlign = 'left',
    initActive = false,
    noBackground,
    onToggleClose,
    onToggleOpen,
    render,
    showOnHover = false,
    showScrollbar = false,
    size = 'medium',
    verticalAlign = 'top',
  } = props

  const [open, setOpen] = useState(initActive)

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen && typeof onToggleOpen === 'function') {
        onToggleOpen(true)
      }
      if (!newOpen && typeof onToggleClose === 'function') {
        onToggleClose()
      }
      setOpen(newOpen)
    },
    [onToggleClose, onToggleOpen],
  )

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen)
    }
  }, [forceOpen])

  // Map horizontal align to Radix align
  const align =
    horizontalAlign === 'center' ? 'center' : horizontalAlign === 'right' ? 'end' : 'start'
  // Map vertical align to Radix side
  const side = verticalAlign === 'bottom' ? 'bottom' : 'top'

  const triggerContent = (
    <PopupTrigger
      active={open}
      button={button}
      buttonType={buttonType}
      className={buttonClassName}
      disabled={disabled}
      noBackground={noBackground}
      setActive={handleOpenChange}
      size={buttonSize}
    />
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <ShadcnPopoverTrigger asChild disabled={disabled}>
        {showOnHover ? (
          <div
            className="inline-flex h-full cursor-pointer items-stretch"
            onMouseEnter={() => handleOpenChange(true)}
            onMouseLeave={() => handleOpenChange(false)}
            role="button"
            tabIndex={0}
            id={id}
          >
            {triggerContent}
          </div>
        ) : (
          <div className={cn('inline-flex h-full items-stretch', className)} id={id}>
            {triggerContent}
          </div>
        )}
      </ShadcnPopoverTrigger>

      <PopoverContent
        align={align}
        side={side}
        sideOffset={8}
        className={cn(
          'z-50 rounded-md border bg-popover p-2 text-popover-foreground shadow-lg',
          sizeClasses[size] || sizeClasses.medium,
          showScrollbar ? 'overflow-y-auto' : 'overflow-hidden',
          className,
        )}
      >
        <div className={cn('max-h-40 overflow-y-auto', !showScrollbar && 'scrollbar-hide')}>
          {render && render({ close: () => handleOpenChange(false) })}
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
}
