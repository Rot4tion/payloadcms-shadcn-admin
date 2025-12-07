'use client'
import type { NavPreferences } from 'payload'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron/index'
import { usePreferences } from '@payloadcms/ui'
import { AnimateHeight } from '../AnimateHeight/index'
import { useNav } from '../Nav/context'

type Props = {
  children: React.ReactNode
  isOpen?: boolean
  label: string
}

const preferencesKey = 'nav'

export const NavGroup: React.FC<Props> = ({ children, isOpen: isOpenFromProps, label }) => {
  const [collapsed, setCollapsed] = useState(
    typeof isOpenFromProps !== 'undefined' ? !isOpenFromProps : false,
  )

  const [animate, setAnimate] = useState(false)
  const { setPreference } = usePreferences()
  const { navOpen } = useNav()

  if (label) {
    const toggleCollapsed = () => {
      setAnimate(true)
      const newGroupPrefs: NavPreferences['groups'] = {}

      if (!newGroupPrefs?.[label]) {
        newGroupPrefs[label] = { open: Boolean(collapsed) }
      } else {
        newGroupPrefs[label].open = Boolean(collapsed)
      }

      void setPreference(preferencesKey, { groups: newGroupPrefs }, true)
      setCollapsed(!collapsed)
    }

    return (
      <div
        className={cn(
          'w-full mb-[calc(var(--base)*0.5)]',
          collapsed && '[&_.collapsible__toggle]:rounded-b-md',
        )}
        id={`nav-group-${label}`}
      >
        <button
          className={cn(
            'cursor-pointer text-muted-foreground bg-transparent border-0 p-0 w-full text-left',
            'flex items-start gap-[calc(var(--base)*0.5)] justify-between mb-[calc(var(--base)*0.25)]',
            '[&_svg]:shrink-0 [&_svg]:mt-[calc(var(--base)*-0.2)]',
            'hover:text-foreground focus-visible:text-foreground focus-visible:outline-none',
            'hover:[&_.stroke]:stroke-foreground focus-visible:[&_.stroke]:stroke-foreground',
          )}
          onClick={toggleCollapsed}
          tabIndex={!navOpen ? -1 : 0}
          type="button"
        >
          <div>{label}</div>
          <div className="relative shrink-0 [&_svg_.stroke]:stroke-muted-foreground/40">
            <ChevronIcon direction={!collapsed ? 'up' : undefined} />
          </div>
        </button>
        <AnimateHeight duration={animate ? 200 : 0} height={collapsed ? 0 : 'auto'}>
          <div>{children}</div>
        </AnimateHeight>
      </div>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}
