'use client'
import React, { useEffect, useRef } from 'react'

import { usePatchAnimateHeight } from './usePatchAnimateHeight.js'
import { cn } from '@/lib/utils'

export const AnimateHeight: React.FC<{
  children: React.ReactNode
  className?: string
  duration?: number
  height?: 'auto' | number
  id?: string
}> = ({ id, children, className, duration = 300, height }) => {
  const [open, setOpen] = React.useState(() => Boolean(height))

  const prevIsOpen = useRef(open)

  const [childrenDisplay, setChildrenDisplay] = React.useState<CSSStyleDeclaration['display']>(
    () => (open ? '' : 'none'),
  )

  const [parentOverflow, setParentOverflow] = React.useState<CSSStyleDeclaration['overflow']>(() =>
    open ? '' : 'hidden',
  )

  const [isAnimating, setIsAnimating] = React.useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let displayTimer: number
    let overflowTimer: number

    const newIsOpen = Boolean(height)
    const hasChanged = prevIsOpen.current !== newIsOpen
    prevIsOpen.current = newIsOpen

    if (hasChanged) {
      setIsAnimating(true)
      setParentOverflow('hidden')

      if (newIsOpen) {
        setChildrenDisplay('')
      } else {
        // `display: none` once closed
        displayTimer = window.setTimeout(() => {
          setChildrenDisplay('none')
        }, duration)
      }

      setOpen(newIsOpen)

      // reset overflow once open
      overflowTimer = window.setTimeout(() => {
        setParentOverflow('')
        setIsAnimating(false)
      }, duration)
    }

    return () => {
      if (displayTimer) {
        clearTimeout(displayTimer)
      }

      if (overflowTimer) {
        clearTimeout(overflowTimer)
      }
    }
  }, [height, duration])

  usePatchAnimateHeight({
    containerRef,
    contentRef,
    duration,
    open,
  })

  return (
    <div
      aria-hidden={!open}
      className={cn(
        // Base: height 0, interpolate-size for smooth transitions
        'h-0 [interpolate-size:allow-keywords]',
        open && height === 'auto' && 'h-auto',
        className,
      )}
      id={id}
      ref={containerRef}
      style={{
        overflow: parentOverflow,
        transition: `height ${duration}ms ease`,
      }}
    >
      <div ref={contentRef} {...(childrenDisplay ? { style: { display: childrenDisplay } } : {})}>
        {children}
      </div>
    </div>
  )
}
