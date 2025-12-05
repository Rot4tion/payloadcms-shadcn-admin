'use client'
import { Hamburger, useNav } from '@payloadcms-local/ui'
import React from 'react'

/**
 * @internal
 */
export const NavHamburger: React.FC = () => {
  const { navOpen, setNavOpen } = useNav()

  return (
    <button
      className="hidden sm:flex items-center bg-transparent border-0 outline-none py-3"
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
