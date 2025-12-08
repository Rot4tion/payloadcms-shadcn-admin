'use client'
import type { ColumnPreference, JSONFieldClientComponent } from 'payload'

import { toWords, transformColumnsToSearchParams } from 'payload/shared'
import React from 'react'

import { FieldLabel } from '../../../../fields/FieldLabel'
import { useField } from '../../../../forms/useField'
import { Pill } from '../../../Pill'

export const QueryPresetsColumnField: JSONFieldClientComponent = ({
  field: { label, required },
}) => {
  const { path, value } = useField()

  return (
    <div className="field-type [&_.field-label]:mb-[calc(var(--base)/2)]">
      <FieldLabel as="h3" label={label} path={path} required={required} />
      <div className="bg-(--theme-elevation-50) p-(--base) flex flex-wrap gap-[calc(var(--base)/2)]">
        {value
          ? transformColumnsToSearchParams(value as ColumnPreference[]).map((column, i) => {
              const isColumnActive = !column.startsWith('-')

              return (
                <Pill
                  key={i}
                  pillStyle={isColumnActive ? 'always-white' : 'light-gray'}
                  size="small"
                >
                  {toWords(column)}
                </Pill>
              )
            })
          : 'No columns selected'}
      </div>
    </div>
  )
}
