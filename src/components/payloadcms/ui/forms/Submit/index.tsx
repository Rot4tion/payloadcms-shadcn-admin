'use client'
import React from 'react'

import type { Props } from '../../elements/Button/types'

import { Button } from '../../elements/Button/index'
// Import form hooks from @payloadcms/ui to share context
import {
  useForm,
  useFormBackgroundProcessing,
  useFormInitializing,
  useFormProcessing,
} from '@payloadcms/ui'

export const FormSubmit: React.FC<Props> = (props) => {
  const {
    type = 'submit',
    buttonId: id,
    children,
    disabled: disabledFromProps,
    onClick,
    programmaticSubmit,
    ref,
  } = props

  const processing = useFormProcessing()
  const backgroundProcessing = useFormBackgroundProcessing()
  const initializing = useFormInitializing()
  const { disabled, submit } = useForm()

  const canSave = !(
    disabledFromProps ||
    initializing ||
    processing ||
    backgroundProcessing ||
    disabled
  )

  const handleClick =
    onClick ??
    (programmaticSubmit
      ? () => {
          void submit()
        }
      : undefined)

  return (
    <div className="[form>&_.btn]:w-full">
      <Button
        ref={ref}
        {...props}
        disabled={canSave ? undefined : true}
        id={id}
        onClick={handleClick}
        type={type}
      >
        {children}
      </Button>
    </div>
  )
}
