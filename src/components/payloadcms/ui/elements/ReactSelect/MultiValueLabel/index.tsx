'use client'
import type { OptionLabel } from 'payload'
import type { MultiValueProps } from 'react-select'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

import { useTranslation } from '@payloadcms/ui'

export const MultiValueLabel: React.FC<MultiValueProps<Option>> = (props) => {
  // @ts-expect-error-next-line// TODO Fix this - moduleResolution 16 breaks our declare module
  const { data, selectProps: { customProps: { draggableProps, editableProps } = {} } = {} } = props
  const { i18n } = useTranslation()

  const textClassName = 'text-ellipsis overflow-hidden whitespace-nowrap'
  const labelText = data.label ? getTranslation(data.label as OptionLabel, i18n) : ''
  const titleText = typeof labelText === 'string' ? labelText : ''

  return (
    <div
      className="text-sm flex items-center max-w-[150px] text-current px-[calc(var(--base)*0.4)] focus-visible:outline-[var(--accessibility-outline)]"
      title={titleText}
    >
      <SelectComponents.MultiValueLabel
        {...props}
        innerProps={{
          className: textClassName,
          ...((editableProps && editableProps(data, textClassName, props.selectProps)) || {}),
          ...(draggableProps || {}),
        }}
      />
    </div>
  )
}
