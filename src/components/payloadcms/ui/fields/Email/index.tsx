'use client'
import type {
  EmailFieldClientComponent,
  EmailFieldClientProps,
  EmailFieldValidation,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useTranslation } from '@payloadcms/ui'
import { FieldLabel } from '../FieldLabel/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'

const EmailFieldComponent: EmailFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: {
        autoComplete,
        className,
        description,
        placeholder,
      } = {} as EmailFieldClientProps['field']['admin'],
      label,
      localized,
      required,
    } = {} as EmailFieldClientProps['field'],
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { i18n } = useTranslation()

  const memoizedValidate: EmailFieldValidation = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required })
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={cn(fieldBaseClass, 'relative', className, (readOnly || disabled) && 'opacity-60')}
      style={styles}
    >
      <div className="flex items-center justify-between">
        <RenderCustomComponent
          CustomComponent={Label}
          Fallback={
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          }
        />
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      </div>
      <div className={`${fieldBaseClass}__wrap`}>
        {BeforeInput}
        <Input
          autoComplete={autoComplete}
          disabled={readOnly || disabled}
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={setValue}
          placeholder={getTranslation(placeholder, i18n)}
          required={required}
          type="email"
          value={(value as string) || ''}
          aria-invalid={showError}
          className={showError ? 'border-destructive' : undefined}
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

export const EmailField = withCondition(EmailFieldComponent)
