'use client'
import { useNav } from '@/components/payloadcms/ui/exports/client'
import React from 'react'
import { cn } from '@/lib/utils'

/**
 * NavWrapper - Sidebar container (Tailwind version)
 *
 * Original SCSS values:
 * - width: var(--nav-width) = 275px (100vw on small screens)
 * - height: 100vh
 * - border-right: 1px solid var(--theme-elevation-100)
 * - opacity: 0 (1 when open)
 * - padding: var(--app-header-height) var(--base) calc(var(--base)*2) var(--base)
 *
 * @internal
 */
export const NavWrapper: React.FC<{
  baseClass?: string
  children: React.ReactNode
}> = (props) => {
  const { children } = props

  const { hydrated, navOpen, navRef, shouldAnimate } = useNav()

  return (
    <aside
      className={cn(
        // Base styles - matching original SCSS exactly
        'sticky top-0 left-0 shrink-0 h-screen overflow-hidden',
        'border-r border-border',
        'rtl:border-r-0 rtl:border-l rtl:border-border',
        // Opacity states
        'opacity-0',
        navOpen && 'opacity-100',
        // Animation
        shouldAnimate && 'transition-opacity ease-in-out',
      )}
      style={{
        width: 'var(--nav-width)',
        transitionDuration: shouldAnimate ? 'var(--nav-trans-time)' : undefined,
      }}
      inert={!navOpen ? true : undefined}
    >
      {/* nav__scroll - scrollable content area */}
      <div
        className={cn(
          'h-full flex flex-col overflow-y-auto',
          // Hide scrollbar
          'scrollbar-none [&::-webkit-scrollbar]:hidden',
        )}
        style={{
          // Original: padding: var(--nav-padding-block-start) var(--nav-padding-inline-end) var(--nav-padding-block-end) var(--nav-padding-inline-start)
          paddingBlockStart: 'var(--app-header-height)',
          paddingBlockEnd: 'calc(var(--base) * 2)',
          paddingInlineStart: 'var(--base)',
          paddingInlineEnd: 'var(--base)',
        }}
        ref={navRef}
      >
        {children}
      </div>
    </aside>
  )
}
