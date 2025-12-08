// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { MultiValueProps } from 'react-select'

import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types'

import { cn } from '@/lib/utils'
import { useDraggableSortable } from '../../DraggableSortable/useDraggableSortable/index'

export function generateMultiValueDraggableID(optionData, valueFunction) {
  return typeof valueFunction === 'function' ? valueFunction(optionData) : optionData?.value
}
export const MultiValue: React.FC<MultiValueProps<Option>> = (props) => {
  const {
    className,
    data,
    innerProps,
    isDisabled,
    // @ts-expect-error // TODO Fix this - moduleResolution 16 breaks our declare module
    selectProps: { customProps: { disableMouseDown } = {}, getOptionValue, isSortable } = {},
  } = props

  const id = generateMultiValueDraggableID(data, getOptionValue)

  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggableSortable({
    id,
    disabled: !isSortable,
  })

  const classes = cn(
    'multi-value [&.rs__multi-value]:flex [&.rs__multi-value]:p-0 [&.rs__multi-value]:border [&.rs__multi-value]:border-border [&.rs__multi-value]:rounded-sm [&.rs__multi-value]:leading-[calc(var(--baseline)-2px)] [&.rs__multi-value]:my-[calc(var(--base)*0.25)] [&.rs__multi-value]:mr-[calc(var(--base)*0.5)] [&.rs__multi-value]:ml-0 [&.rs__multi-value]:transition-[border] [&.rs__multi-value]:duration-200 [&.rs__multi-value]:ease-[cubic-bezier(0.2,0,0,1)] [&.rs__multi-value]:hover:border-[var(--theme-elevation-250)] [&.rs__multi-value]:bg-muted',
    className,
    !isDisabled && isSortable && 'draggable',
    isDragging && 'z-[2]',
  )

  return (
    <React.Fragment>
      <SelectComponents.MultiValue
        {...props}
        className={classes}
        innerProps={{
          ...(isSortable
            ? {
                ...attributes,
                ...listeners,
              }
            : {}),
          ...innerProps,
          onMouseDown: (e) => {
            if (!disableMouseDown) {
              // we need to prevent the dropdown from opening when clicking on the drag handle, but not when a modal is open (i.e. the 'Relationship' field component)
              e.stopPropagation()
            }
          },
          ref: setNodeRef,
          style: isSortable
            ? {
                transform,
                ...attributes?.style,
              }
            : {},
        }}
      />
    </React.Fragment>
  )
}
