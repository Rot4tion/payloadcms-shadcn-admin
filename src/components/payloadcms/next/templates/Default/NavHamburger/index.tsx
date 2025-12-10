'use client'
import { Hamburger, useNav } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

export const NavHamburger: React.FC = () => {
  const { navOpen } = useNav()
  return <Hamburger closeIcon="collapse" isActive={navOpen} />
}
