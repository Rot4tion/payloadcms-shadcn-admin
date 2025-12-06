'use client'
import type { CSSProperties } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { TextAreaInputProps } from './types.js'

import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

export const TextareaInput: React.FC<TextAreaInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    Label,
    label,
    localized,
    onChange,
    path,
    placeholder,
    readOnly,
    required,
    rows,
    rtl,
    showError,
    style,
    value,
  } = props

  const { i18n } = useTranslation()

  return (
    <div
      className={cn(
        'field-type textarea relative flex flex-col gap-2',
        className,
        showError && 'error',
        readOnly && 'read-only pointer-events-none opacity-60',
      )}
      style={style}
    >
      <div className="flex items-center justify-between">
        <RenderCustomComponent
          CustomComponent={Label}
          Fallback={
            <FieldLabel
              htmlFor={`field-${path.replace(/\./g, '__')}`}
              label={label}
              localized={localized}
              path={path}
              required={required}
            />
          }
        />
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {BeforeInput}
        <Textarea
          data-rtl={rtl}
          disabled={readOnly}
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={onChange}
          placeholder={getTranslation(placeholder, i18n)}
          rows={rows}
          value={value || ''}
          aria-invalid={showError}
          className="resize-y"
          style={
            {
              '--rows': rows,
              minHeight: rows ? `calc(${rows} * 1.5rem + 1rem)` : undefined,
            } as CSSProperties
          }
        />
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
