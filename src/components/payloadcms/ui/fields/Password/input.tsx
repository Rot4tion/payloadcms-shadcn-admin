'use client'
import type { ChangeEvent } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { PasswordInputProps } from './types'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index'
import { FieldDescription } from '../../fields/FieldDescription/index'
import { FieldError } from '../../fields/FieldError/index'
import { FieldLabel } from '../../fields/FieldLabel/index'
import { useTranslation } from '@payloadcms/ui'
import { fieldBaseClass } from '../shared/index'

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const {
    AfterInput,
    autoComplete = 'off',
    BeforeInput,
    className,
    description,
    Description,
    Error,
    inputRef,
    Label,
    label,
    localized,
    onChange,
    onKeyDown,
    path,
    placeholder,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    width,
  } = props

  const { i18n } = useTranslation()

  return (
    <div
      className={cn(fieldBaseClass, 'relative', className, readOnly && 'opacity-60')}
      style={{
        ...style,
        width,
      }}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        <div>
          {BeforeInput}
          <Input
            aria-label={getTranslation(label, i18n)}
            autoComplete={autoComplete}
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path.replace(/\./g, '__')}`}
            name={path}
            onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onKeyDown={onKeyDown}
            placeholder={getTranslation(placeholder, i18n)}
            ref={inputRef}
            type="password"
            value={value || ''}
            aria-invalid={showError}
            className={showError ? 'border-destructive' : undefined}
          />
          {AfterInput}
        </div>
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
