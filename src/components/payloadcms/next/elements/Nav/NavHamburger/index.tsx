'use client'
import { Hamburger, useNav } from '@/components/payloadcms/ui/exports/client'
import React from 'react'
import { cn } from '@/lib/utils'

/**
 * NavHamburger - Mobile close button (Tailwind version)
 *
 * Original SCSS nav__mobile-close:
 * - display: none by default
 * - display: flex on @include small-break (< 768px) - to CLOSE the sidebar on mobile
 * - background: none, border: 0, outline: 0
 * - padding: base(0.8) 0 = 16px 0
 *
 * @internal
 */
export const NavHamburger: React.FC = () => {
  const { navOpen, setNavOpen } = useNav()

  return (
    <button
      className={cn(
        // Hidden by default on large screens, flex on small screens (< 768px) to close sidebar
        'hidden max-md:flex items-center',
        // Reset button styles
        'bg-transparent border-0 outline-none',
      )}
      style={{
        // padding: base(0.8) 0 = 16px 0
        paddingBlock: 'calc(var(--base) * 0.8)',
        paddingInline: 0,
      }}
      onClick={() => {
        setNavOpen(false)
      }}
      tabIndex={!navOpen ? -1 : undefined}
      type="button"
    >
      <Hamburger isActive />
    </button>
  )
}
