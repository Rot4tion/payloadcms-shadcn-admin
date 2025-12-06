'use client'
import type { RadioFieldClientComponent, RadioFieldClientProps } from 'payload'

import { optionIsObject } from 'payload/shared'
import React, { useCallback, useMemo } from 'react'

import { cn } from '@/lib/utils'
import { RadioGroup } from '@/components/ui/radio-group'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import { Radio } from './Radio/index.js'

const RadioGroupFieldComponent: RadioFieldClientComponent = (props) => {
  const {
    disableModifyingForm: disableModifyingFormFromProps,
    field,
    field: {
      admin: {
        className,
        description,
        layout = 'horizontal',
      } = {} as RadioFieldClientProps['field']['admin'],
      label,
      localized,
      options = [],
      required,
    } = {} as RadioFieldClientProps['field'],
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
    value: valueFromProps,
  } = props

  const { uuid } = useForm()

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, options, required })
      }
    },
    [validate, options, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value: valueFromContext,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const value = valueFromContext || valueFromProps

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={cn(
        fieldBaseClass,
        className,
        (readOnly || disabled) && 'opacity-60 [&_.radio-input]:cursor-default',
      )}
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
        <RadioGroup
          className={cn(
            'm-0 list-none p-0',
            layout === 'horizontal' && 'flex flex-wrap gap-4',
            layout === 'vertical' && 'flex flex-col gap-2',
          )}
          id={`field-${path.replace(/\./g, '__')}`}
          value={value || ''}
          onValueChange={(newValue) => {
            if (typeof onChangeFromProps === 'function') {
              onChangeFromProps(newValue)
            }
            if (!(readOnly || disabled)) {
              setValue(newValue, !!disableModifyingFormFromProps)
            }
          }}
          disabled={readOnly || disabled}
        >
          {options.map((option) => {
            let optionValue = ''

            if (optionIsObject(option)) {
              optionValue = option.value
            } else {
              optionValue = option
            }

            const id = `field-${path}-${optionValue}${uuid ? `-${uuid}` : ''}`

            return (
              <Radio
                key={`${path} - ${optionValue}`}
                id={id}
                isSelected={String(optionValue) === String(value)}
                option={optionIsObject(option) ? option : { label: option, value: option }}
                path={path}
                readOnly={readOnly || disabled}
                uuid={uuid}
              />
            )
          })}
        </RadioGroup>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}

export const RadioGroupField: any = withCondition(RadioGroupFieldComponent)
