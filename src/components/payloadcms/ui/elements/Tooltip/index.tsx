'use client'
import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'

import { useIntersect } from '../../hooks/useIntersect'

export type Props = {
  alignCaret?: 'center' | 'left' | 'right'
  boundingRef?: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  className?: string
  delay?: number
  position?: 'bottom' | 'top'
  show?: boolean
  /**
   * If the tooltip position should not change depending on if the toolbar is outside the boundingRef. @default false
   */
  staticPositioning?: boolean
}

export const Tooltip: React.FC<Props> = (props) => {
  const {
    alignCaret = 'center',
    boundingRef,
    children,
    className,
    delay = 350,
    position: positionFromProps,
    show: showFromProps = true,
    staticPositioning = false,
  } = props

  const [show, setShow] = React.useState(showFromProps)
  const [position, setPosition] = React.useState<'bottom' | 'top'>('top')

  const getTitleAttribute = (content) => (typeof content === 'string' ? content : '')

  const [ref, intersectionEntry] = useIntersect(
    {
      root: boundingRef?.current || null,
      rootMargin: '-145px 0px 0px 100px',
      threshold: 0,
    },
    staticPositioning,
  )

  useEffect(() => {
    let timerID: NodeJS.Timeout

    // do not use the delay on transition-out
    if (delay && showFromProps) {
      timerID = setTimeout(() => {
        setShow(showFromProps)
      }, delay)
    } else {
      setShow(showFromProps)
    }

    return () => {
      if (timerID) {
        clearTimeout(timerID)
      }
    }
  }, [showFromProps, delay])

  useEffect(() => {
    if (staticPositioning) {
      return
    }
    setPosition(intersectionEntry?.isIntersecting ? 'top' : 'bottom')
  }, [intersectionEntry, staticPositioning])

  const finalPosition = positionFromProps || position

  const tooltipClasses = cn(
    'absolute z-50 px-2 py-1 text-xs font-medium rounded-md shadow-md',
    'bg-popover text-popover-foreground border border-border',
    'opacity-0 pointer-events-none transition-opacity duration-150',
    show && 'opacity-100',
    finalPosition === 'top' && 'bottom-full mb-2',
    finalPosition === 'bottom' && 'top-full mt-2',
    alignCaret === 'left' && 'left-0',
    alignCaret === 'center' && 'left-1/2 -translate-x-1/2',
    alignCaret === 'right' && 'right-0',
    className,
  )

  // The first aside is always on top. The purpose of that is that it can reliably be used for the interaction observer (as it's not moving around), to calculate the position of the actual tooltip.
  return (
    <React.Fragment>
      {!staticPositioning && (
        <aside aria-hidden="true" className={cn(tooltipClasses, 'opacity-0')} ref={ref}>
          <div>{children}</div>
        </aside>
      )}
      <aside className={tooltipClasses} title={getTitleAttribute(children)}>
        <div>{children}</div>
      </aside>
    </React.Fragment>
  )
}
