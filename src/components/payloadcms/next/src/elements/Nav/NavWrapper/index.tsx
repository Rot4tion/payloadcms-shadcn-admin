'use client'
import { useNav } from '@payloadcms-local/ui'
import React from 'react'
import { cn } from '@/lib/utils'

/**
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
        'sticky top-0 left-0 flex-shrink-0 h-screen w-64 border-r border-border opacity-0 overflow-hidden bg-sidebar',
        navOpen && 'opacity-100',
        shouldAnimate && 'transition-opacity duration-200 ease-in-out',
        hydrated && 'visible',
      )}
      inert={!navOpen ? true : undefined}
    >
      <div
        className="h-full flex flex-col pt-16 pb-8 px-4 overflow-y-auto scrollbar-hide"
        ref={navRef}
      >
        {children}
      </div>
    </aside>
  )
}
