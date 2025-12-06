'use client'
import { useNav } from '@payloadcms-local/ui'
import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Wrapper - Main layout grid container (Tailwind version)
 *
 * Original SCSS:
 * - min-height: 100vh, display: grid, position: relative, isolation: isolate
 * - grid-template-columns changes based on nav state and screen size
 * - transition: grid-template-columns var(--nav-trans-time) linear (when animating)
 *
 * Breakpoints:
 * - >= 1441px: 0 auto (closed) → var(--nav-width) auto (open)
 * - <= 1440px: 1fr auto → 0 auto (hydrated) → var(--nav-width) auto (hydrated + open)
 *
 * @internal
 */
export const Wrapper: React.FC<{
  children?: React.ReactNode
  className?: string
}> = (props) => {
  const { children, className } = props
  const { hydrated, navOpen, shouldAnimate } = useNav()

  // Compute grid-template-columns based on state
  // Using CSS custom property for nav-width
  const getGridColumns = () => {
    // Large screens (>= 1441px)
    // - closed: 0 auto
    // - open: var(--nav-width) auto

    // Small screens (<= 1440px)
    // - not hydrated: 1fr auto
    // - hydrated + closed: 0 auto
    // - hydrated + open: var(--nav-width) auto

    if (navOpen) {
      return 'var(--nav-width) auto'
    }
    if (hydrated) {
      return '0 auto'
    }
    // Not hydrated on small screens: 1fr auto (but we use 0 auto for consistency)
    return '0 auto'
  }

  return (
    <div
      className={cn(
        // Base styles
        'min-h-screen grid relative isolate',
        // Reduced motion preference
        'motion-reduce:transition-none',
        // Animation when shouldAnimate is true
        shouldAnimate && 'transition-[grid-template-columns] ease-linear',
        className,
      )}
      style={{
        gridTemplateColumns: getGridColumns(),
        transitionDuration: shouldAnimate ? 'var(--nav-trans-time)' : undefined,
      }}
    >
      {children}
    </div>
  )
}
