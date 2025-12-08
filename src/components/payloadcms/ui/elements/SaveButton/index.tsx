'use client'

import type { SaveButtonClientProps } from 'payload'

import React, { useRef } from 'react'

import { useForm, useFormModified } from '@payloadcms/ui'
import { FormSubmit } from '../../forms/Submit'
import { useHotkey } from '../../hooks/useHotkey'
import { useDocumentInfo } from '@payloadcms/ui'
import { useEditDepth } from '@payloadcms/ui'
import { useOperation } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

export function SaveButton({ label: labelProp }: SaveButtonClientProps) {
  const { uploadStatus } = useDocumentInfo()
  const { t } = useTranslation()
  const { submit } = useForm()
  const modified = useFormModified()
  const label = labelProp || t('general:save')
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const operation = useOperation()

  const disabled = (operation === 'update' && !modified) || uploadStatus === 'uploading'

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    if (disabled) {
      // absorb the event
    }

    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  const handleSubmit = () => {
    if (uploadStatus === 'uploading') {
      return
    }

    return void submit()
  }

  return (
    <FormSubmit
      buttonId="action-save"
      disabled={disabled}
      onClick={handleSubmit}
      ref={ref}
      size="medium"
      type="button"
    >
      {label}
    </FormSubmit>
  )
}
