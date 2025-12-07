'use client'
import type { MultiValueRemoveProps } from 'react-select'

import React, { type JSX } from 'react'

import type { Option as OptionType } from '../types.js'

import { cn } from '@/lib/utils'
import { XIcon } from '../../../icons/X/index.js'
import { useTranslation } from '@payloadcms/ui'
import { Tooltip } from '../../Tooltip/index.js'

export const MultiValueRemove: React.FC<
  {
    innerProps: JSX.IntrinsicElements['button']
  } & MultiValueRemoveProps<OptionType>
> = (props) => {
  const {
    innerProps: { className, onClick, onTouchEnd },
  } = props

  const [showTooltip, setShowTooltip] = React.useState(false)
  const { t } = useTranslation()

  return (
    <button
      aria-label={t('general:remove')}
      className={cn(
        'cursor-pointer w-(--base) flex items-center justify-center relative bg-transparent border-0 p-0 text-inherit hover:text-foreground/80 hover:bg-muted',
        className,
      )}
      onClick={(e) => {
        setShowTooltip(false)
        onClick(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.stopPropagation()
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchEnd={onTouchEnd}
      type="button"
    >
      <Tooltip show={showTooltip}>{t('general:remove')}</Tooltip>
      <XIcon className="w-full h-full" />
    </button>
  )
}
