// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { FieldDiffClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useConfig, useTranslation } from '@/components/payloadcms/ui/exports/client'
import { fieldIsArrayType, fieldIsBlockType } from 'payload/shared'
import React from 'react'

import { useSelectedLocales } from '../../../Default/SelectedLocalesContext'
import { DiffCollapser } from '../../DiffCollapser'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff'
import { getFieldsForRowComparison } from '../../utilities/getFieldsForRowComparison'

export const Iterable: React.FC<FieldDiffClientProps> = ({
  baseVersionField,
  comparisonValue: valueFrom,
  field,
  locale,
  parentIsLocalized,
  versionValue: valueTo,
}) => {
  const { i18n, t } = useTranslation()
  const { selectedLocales } = useSelectedLocales()
  const { config } = useConfig()

  if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) {
    throw new Error(`Expected field to be an array or blocks type but got: ${field.type}`)
  }

  const valueToRowCount = Array.isArray(valueTo) ? valueTo.length : 0
  const valueFromRowCount = Array.isArray(valueFrom) ? valueFrom.length : 0
  const maxRows = Math.max(valueToRowCount, valueFromRowCount)

  return (
    <div>
      <DiffCollapser
        field={field}
        isIterable
        Label={
          'label' in field &&
          field.label &&
          typeof field.label !== 'function' && (
            <span>
              {locale && <span className="text-muted-foreground mr-1">{locale}</span>}
              {getTranslation(field.label, i18n)}
            </span>
          )
        }
        locales={selectedLocales}
        parentIsLocalized={parentIsLocalized}
        valueFrom={valueFrom}
        valueTo={valueTo}
      >
        {maxRows > 0 && (
          <div className="flex flex-col gap-(--base)">
            {Array.from({ length: maxRows }, (_, i) => {
              const valueToRow = valueTo?.[i] || {}
              const valueFromRow = valueFrom?.[i] || {}

              const { fields, versionFields } = getFieldsForRowComparison({
                baseVersionField,
                config,
                field,
                row: i,
                valueFromRow,
                valueToRow,
              })

              if (!versionFields?.length) {
                // Rows without a diff create "holes" in the baseVersionField.rows (=versionFields) array - this is to maintain the correct row indexes.
                // It does mean that this row has no diff and should not be rendered => skip it.
                return null
              }

              const rowNumber = String(i + 1).padStart(2, '0')
              const rowLabel = fieldIsArrayType(field)
                ? `${t('general:item')} ${rowNumber}`
                : `${t('fields:block')} ${rowNumber}`

              return (
                <div key={i}>
                  <DiffCollapser
                    fields={fields}
                    hideGutter={true}
                    Label={
                      <div className="flex items-center">
                        <div></div>
                        <span>{rowLabel}</span>
                      </div>
                    }
                    locales={selectedLocales}
                    parentIsLocalized={parentIsLocalized || field.localized}
                    valueFrom={valueFromRow}
                    valueTo={valueToRow}
                  >
                    <RenderVersionFieldsToDiff versionFields={versionFields} />
                  </DiffCollapser>
                </div>
              )
            })}
          </div>
        )}
        {maxRows === 0 && (
          <div className="text-muted-foreground py-2">
            {i18n.t('version:noRowsFound', {
              label:
                'labels' in field && field.labels?.plural
                  ? getTranslation(field.labels.plural, i18n)
                  : i18n.t('general:rows'),
            })}
          </div>
        )}
      </DiffCollapser>
    </div>
  )
}
