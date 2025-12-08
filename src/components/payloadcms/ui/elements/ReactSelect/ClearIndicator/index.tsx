// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ClearIndicatorProps } from 'react-select'

import React from 'react'

import type { Option as OptionType } from '../types'

import { XIcon } from '../../../icons/X/index'

export const ClearIndicator: React.FC<ClearIndicatorProps<OptionType, true>> = (props) => {
  const {
    clearValue,
    innerProps: { ref, ...restInnerProps },
  } = props

  return (
    <div
      className="cursor-pointer flex focus-visible:outline-[var(--accessibility-outline)]"
      // TODO Fix this - Broke with React 19 types
      ref={typeof ref === 'string' ? null : ref}
      {...restInnerProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          clearValue()
          e.stopPropagation()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <XIcon />
    </div>
  )
}
