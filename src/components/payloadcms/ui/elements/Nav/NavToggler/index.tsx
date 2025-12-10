'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { usePreferences } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { useWindowInfo } from '@payloadcms/ui'
import { useNav } from '../context'

export const NavToggler: React.FC<{
  children?: React.ReactNode
  className?: string
  id?: string
  tabIndex?: number
}> = (props) => {
  const { id, children, className, tabIndex = 0 } = props

  const { t } = useTranslation()

  const { setPreference } = usePreferences()

  const { navOpen, setNavOpen } = useNav()

  const {
    breakpoints: { l: largeBreak },
  } = useWindowInfo()

  return (
    <button
      aria-label={`${navOpen ? t('general:close') : t('general:open')} ${t('general:menu')}`}
      className={cn('relative bg-transparent p-0 m-0 border-0 cursor-pointer', className)}
      id={id}
      onClick={async () => {
        setNavOpen(!navOpen)

        // only when the user explicitly toggles the nav on desktop do we want to set the preference
        // this is because the js may open or close the nav based on the window size, routing, etc
        if (!largeBreak) {
          await setPreference(
            'nav',
            {
              open: !navOpen,
            },
            true,
          )
        }
      }}
      tabIndex={tabIndex}
      type="button"
    >
      {children}
    </button>
  )
}
