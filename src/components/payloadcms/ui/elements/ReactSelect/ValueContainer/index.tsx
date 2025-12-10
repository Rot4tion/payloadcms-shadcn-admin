// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { OptionLabel } from 'payload'
import type { ValueContainerProps } from 'react-select'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types'

import { useTranslation } from '@payloadcms/ui'

export const ValueContainer: React.FC<ValueContainerProps<Option, any>> = (props) => {
  // @ts-expect-error-next-line // TODO Fix this - moduleResolution 16 breaks our declare module
  const { selectProps: { customProps, value } = {} } = props
  const { i18n } = useTranslation()

  // Get the title for single-value selects
  let titleText = ''
  if (value && !Array.isArray(value) && typeof value === 'object' && 'label' in value) {
    const labelText = value.label ? getTranslation(value.label as OptionLabel, i18n) : ''
    titleText = typeof labelText === 'string' ? labelText : ''
  }

  return (
    <div
      className="grow min-w-0 flex items-center flex-row gap-[calc(var(--base)/2)] [&_.rs__value-container]:overflow-visible [&_.rs__value-container]:p-0.5 [&_.rs__value-container]:gap-0.5 [&_.rs__value-container>*]:m-0 [&_.rs__value-container>*]:py-0 [&_.rs__value-container>*]:text-current [&_.rs__value-container_.field-label]:pb-0 [&_.rs__value-container--is-multi]:w-[calc(100%+calc(var(--base)*0.25))] [&_.rs__value-container--is-multi.rs__value-container--has-value]:p-0 [&_.rs__value-container--is-multi.rs__value-container--has-value]:ms-[-4px]"
      ref={customProps?.droppableRef}
      title={titleText}
    >
      {customProps?.valueContainerLabel && (
        <span className="text-muted-foreground">{customProps?.valueContainerLabel}</span>
      )}
      <SelectComponents.ValueContainer {...props} />
    </div>
  )
}
