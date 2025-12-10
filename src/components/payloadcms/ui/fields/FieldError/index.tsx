'use client'

import type { GenericErrorProps } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { useFormFields, useFormSubmitted } from '@payloadcms/ui'

export const FieldError: React.FC<GenericErrorProps> = (props) => {
  const {
    alignCaret = 'right',
    message: messageFromProps,
    path,
    showError: showErrorFromProps,
  } = props

  const hasSubmitted = useFormSubmitted()
  const field = useFormFields(([fields]) => (fields && path ? fields?.[path] : null) || null)

  const { errorMessage, valid } = field || {}

  const message = messageFromProps || errorMessage
  const showMessage = showErrorFromProps || (hasSubmitted && valid === false)

  if (showMessage && message?.length) {
    return (
      <div
        className={cn(
          'relative inline-flex items-center text-xs font-medium text-destructive',
          alignCaret === 'left' && 'flex-row',
          alignCaret === 'right' && 'flex-row-reverse',
          alignCaret === 'center' && 'justify-center',
        )}
      >
        {/* Arrow/Caret pointing down */}
        <svg
          className={cn(
            'size-2.5 fill-destructive',
            alignCaret === 'left' && 'mr-1',
            alignCaret === 'right' && 'ml-1',
          )}
          viewBox="0 0 10 10"
        >
          <polygon points="5,10 0,0 10,0" />
        </svg>
        <span>{message}</span>
      </div>
    )
  }

  return null
}
