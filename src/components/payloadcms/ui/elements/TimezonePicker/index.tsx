// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { OptionObject } from 'payload'
import type React from 'react'

import { useMemo } from 'react'

import type { Props } from './types'

import { FieldLabel } from '../../fields/FieldLabel'
import { useTranslation } from '@payloadcms/ui'
import { ReactSelect } from '../ReactSelect'
import { formatOptions } from '../WhereBuilder/Condition/Select/formatOptions'

export const TimezonePicker: React.FC<Props> = (props) => {
  const {
    id,
    onChange: onChangeFromProps,
    options: optionsFromProps,
    readOnly: readOnlyFromProps,
    required,
    selectedTimezone: selectedTimezoneFromProps,
  } = props

  const { t } = useTranslation()

  const options = formatOptions(optionsFromProps)

  const selectedTimezone = useMemo(() => {
    return options.find((t) => {
      const value = typeof t === 'string' ? t : t.value
      return value === (selectedTimezoneFromProps || 'UTC')
    })
  }, [options, selectedTimezoneFromProps])

  const readOnly = Boolean(readOnlyFromProps) || options.length === 1

  return (
    <div className="flex gap-[calc(var(--base)/4)] mt-[calc(var(--base)/4)] items-center [&_.field-label]:mr-0 [&_.field-label]:text-muted-foreground [&_.field-label]:shrink-0">
      <FieldLabel
        htmlFor={id}
        label={`${t('general:timezone')} ${required ? '*' : ''}`}
        required={required}
        unstyled
      />
      <ReactSelect
        className="inline-block [&_.rs__menu]:min-w-[calc(var(--base)*14)] [&_.rs__menu]:overflow-hidden [&_.rs__menu]:rounded-sm [&_.rs__value-container]:text-center [&_.rs__control]:bg-transparent [&_.rs__control]:border-none [&_.rs__control]:p-0 [&_.rs__control]:pl-[calc(var(--base)*0.25)] [&_.rs__control]:min-h-0 [&_.rs__control]:relative [&_.rs__control]:shadow-none [&_.rs__control]:min-w-(--base) [&_.rs__control:hover]:cursor-pointer [&_.rs__control:hover]:shadow-none [&_.rs__indicators]:ms-[calc(var(--base)*0.25)]"
        disabled={readOnly}
        inputId={id}
        isClearable={!required}
        isCreatable={false}
        onChange={(val: OptionObject) => {
          if (onChangeFromProps) {
            onChangeFromProps(val?.value || '')
          }
        }}
        options={options}
        value={selectedTimezone}
      />
    </div>
  )
}
