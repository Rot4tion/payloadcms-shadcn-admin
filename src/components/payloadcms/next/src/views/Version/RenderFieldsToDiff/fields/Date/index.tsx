'use client'
import type { DateFieldDiffClientComponent } from 'payload'

import {
  FieldDiffContainer,
  getHTMLDiffComponents,
  useConfig,
  useTranslation,
} from '@payloadcms-local/ui'
import { formatDate } from '@payloadcms-local/ui/shared'
import React from 'react'

export const DateDiffComponent: DateFieldDiffClientComponent = ({
  comparisonValue: valueFrom,
  field,
  locale,
  nestingLevel,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const {
    config: {
      admin: { dateFormat },
    },
  } = useConfig()

  const formattedFromDate = valueFrom
    ? formatDate({
        date: typeof valueFrom === 'string' ? new Date(valueFrom) : (valueFrom as Date),
        i18n,
        pattern: dateFormat,
      })
    : ''

  const formattedToDate = valueTo
    ? formatDate({
        date: typeof valueTo === 'string' ? new Date(valueTo) : (valueTo as Date),
        i18n,
        pattern: dateFormat,
      })
    : ''

  const { From, To } = getHTMLDiffComponents({
    fromHTML:
      `<div data-enable-match="true" data-date="${formattedFromDate}"><p>` +
      formattedFromDate +
      '</p></div>',
    toHTML:
      `<div data-enable-match="true" data-date="${formattedToDate}"><p>` +
      formattedToDate +
      '</p></div>',
    tokenizeByCharacter: false,
  })

  return (
    <FieldDiffContainer
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}
