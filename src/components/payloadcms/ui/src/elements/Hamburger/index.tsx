'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { CloseMenuIcon } from '../../icons/CloseMenu/index.js'
import { MenuIcon } from '../../icons/Menu/index.js'
import { useTranslation } from '@payloadcms/ui'

export const Hamburger: React.FC<{
  readonly closeIcon?: 'collapse' | 'x'
  readonly isActive?: boolean
}> = (props) => {
  const { t } = useTranslation()
  const { closeIcon = 'x', isActive = false } = props

  return (
    <div
      className={cn(
        'relative z-1 h-full w-full cursor-pointer rounded-[3px] border-0 p-[calc(var(--base)*0.1)] outline-none',
        'bg-background text-foreground',
        'shadow-[0_0_0_1px_var(--theme-elevation-150)]',
        'transition-[box-shadow,background-color] duration-100 ease-[cubic-bezier(0,0.2,0.2,1)]',
        'hover:bg-muted hover:shadow-[0_0_0_1px_var(--theme-elevation-500)]',
        'focus:outline-none',
      )}
    >
      {!isActive && (
        <div
          aria-label={t('general:open')}
          className="flex size-(--base) items-center justify-center"
          title={t('general:open')}
        >
          <MenuIcon />
        </div>
      )}
      {isActive && (
        <div
          aria-label={closeIcon === 'collapse' ? t('general:collapse') : t('general:close')}
          className="flex size-(--base) items-center justify-center"
          title={closeIcon === 'collapse' ? t('general:collapse') : t('general:close')}
        >
          {closeIcon === 'x' && <CloseMenuIcon />}
          {closeIcon === 'collapse' && <ChevronIcon direction="left" />}
        </div>
      )}
    </div>
  )
}
