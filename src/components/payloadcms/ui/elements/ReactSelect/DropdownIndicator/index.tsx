// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { DropdownIndicatorProps } from 'react-select'

import React, { type JSX } from 'react'

import type { Option as OptionType } from '../types'

import { ChevronIcon } from '../../../icons/Chevron'
export const DropdownIndicator: React.FC<
  {
    innerProps: JSX.IntrinsicElements['button']
  } & DropdownIndicatorProps<OptionType, true>
> = (props) => {
  const {
    innerProps: { ref, ...restInnerProps },
  } = props

  return (
    <button
      className="cursor-pointer flex bg-transparent border-0 p-0 m-0 focus-visible:outline-[var(--accessibility-outline)] [&_.stroke]:stroke-1"
      ref={ref}
      {...restInnerProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.key = ' '
        }
      }}
      type="button"
    >
      <ChevronIcon />
    </button>
  )
}
