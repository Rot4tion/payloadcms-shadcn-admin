// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { StaticLabel } from 'payload'

import React, { useCallback, useId } from 'react'
import { Check, Minus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent'
import { FieldLabel } from '../../fields/FieldLabel'

export type CheckboxInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly checked?: boolean
  readonly className?: string
  readonly id?: string
  readonly inputRef?: React.RefObject<HTMLInputElement | null>
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly name?: string
  readonly onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void
  readonly partialChecked?: boolean
  readonly readOnly?: boolean
  readonly required?: boolean
}

export const inputBaseClass = 'checkbox-input'

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id: idFromProps,
  name,
  AfterInput,
  BeforeInput,
  checked,
  className,
  inputRef,
  Label,
  label,
  localized,
  onToggle,
  partialChecked,
  readOnly,
  required,
}) => {
  const fallbackID = useId()
  const id = idFromProps || fallbackID

  // Convert Radix onCheckedChange to native-like event for compatibility
  const handleCheckedChange = useCallback(
    (checkedState: boolean | 'indeterminate') => {
      // Create a synthetic event-like object for compatibility
      const syntheticEvent = {
        target: {
          checked: checkedState === true,
          name,
          type: 'checkbox',
        },
      } as React.ChangeEvent<HTMLInputElement>
      onToggle(syntheticEvent)
    },
    [name, onToggle],
  )

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2',
        !readOnly && 'cursor-pointer',
        readOnly && 'cursor-default',
        className,
      )}
    >
      {BeforeInput}
      <button
        type="button"
        role="checkbox"
        aria-checked={partialChecked ? 'mixed' : checked}
        id={id}
        disabled={readOnly}
        onClick={() => handleCheckedChange(!checked)}
        className={cn(
          'relative flex size-5 shrink-0 items-center justify-center rounded border shadow-xs transition-colors outline-none',
          'border-input bg-background',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked && 'border-primary bg-primary text-primary-foreground',
          partialChecked && !checked && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        <Check
          className={cn(
            'size-3.5 transition-opacity',
            checked && !partialChecked ? 'opacity-100' : 'opacity-0',
          )}
        />
        <Minus
          className={cn(
            'absolute size-3.5 transition-opacity',
            partialChecked && !checked ? 'opacity-100' : 'opacity-0',
          )}
        />
      </button>
      {AfterInput}
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel
            htmlFor={id}
            label={label}
            localized={localized}
            required={required}
            className="pb-0"
          />
        }
      />
    </div>
  )
}
