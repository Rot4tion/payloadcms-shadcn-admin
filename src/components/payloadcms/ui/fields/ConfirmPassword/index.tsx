'use client'

import { confirmPassword } from 'payload/shared'
import React from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useField } from '../../forms/useField'
import { useTranslation } from '@payloadcms/ui'
import { FieldError } from '../FieldError'
import { FieldLabel } from '../FieldLabel'
import { fieldBaseClass } from '../shared'

export type ConfirmPasswordFieldProps = {
  readonly disabled?: boolean
  readonly path?: string
}

export const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = (props) => {
  const { disabled: disabledFromProps, path = 'confirm-password' } = props
  const { t } = useTranslation()

  const { disabled, setValue, showError, value } = useField({
    path,
    validate: (value, options) => {
      return confirmPassword(value, {
        name: 'confirm-password',
        type: 'text',
        required: true,
        ...options,
      })
    },
  })

  const isDisabled = !!(disabled || disabledFromProps)

  return (
    <div className={cn(fieldBaseClass, 'relative', isDisabled && 'opacity-60')}>
      <FieldLabel
        htmlFor="field-confirm-password"
        label={t('authentication:confirmPassword')}
        required
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError path={path} showError={showError} />
        <Input
          aria-label={t('authentication:confirmPassword')}
          autoComplete="off"
          disabled={isDisabled}
          id="field-confirm-password"
          name="confirm-password"
          onChange={(e) => setValue(e.target.value)}
          type="password"
          value={(value as string) || ''}
          aria-invalid={showError}
          className={showError ? 'border-destructive' : undefined}
        />
      </div>
    </div>
  )
}
