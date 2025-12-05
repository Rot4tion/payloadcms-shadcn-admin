'use client'
import type { StaticLabel } from 'payload'

import React, { useCallback, useId } from 'react'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { LineIcon } from '../../icons/Line/index.js'

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
      <Checkbox
        id={id}
        name={name}
        checked={partialChecked ? 'indeterminate' : checked}
        onCheckedChange={handleCheckedChange}
        disabled={readOnly}
        required={required}
        aria-labelledby={name}
        className={cn('size-5', partialChecked && '[&_svg]:hidden')}
      />
      {partialChecked && !checked && (
        <LineIcon className="pointer-events-none absolute size-3.5 text-foreground" />
      )}
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
