'use client'
import type { RadioFieldClientComponent, RadioFieldClientProps } from 'payload'

import { optionIsObject } from 'payload/shared'
import React, { useCallback, useMemo } from 'react'

import { cn } from '@/lib/utils'
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
      <RenderCustomComponent
        CustomComponent={Error}
        Fallback={<FieldError path={path} showError={showError} />}
      />
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        {BeforeInput}
        <ul
          className={cn(
            'm-0 list-none p-0',
            layout === 'horizontal' && 'flex flex-wrap',
            layout === 'horizontal' &&
              '[&>li]:shrink-0 [&>li]:pr-6 rtl:[&>li]:pl-6 rtl:[&>li]:pr-0',
          )}
          id={`field-${path.replace(/\./g, '__')}`}
        >
          {options.map((option) => {
            let optionValue = ''

            if (optionIsObject(option)) {
              optionValue = option.value
            } else {
              optionValue = option
            }

            const isSelected = String(optionValue) === String(value)

            const id = `field-${path}-${optionValue}${uuid ? `-${uuid}` : ''}`

            return (
              <li key={`${path} - ${optionValue}`}>
                <Radio
                  id={id}
                  isSelected={isSelected}
                  onChange={() => {
                    if (typeof onChangeFromProps === 'function') {
                      onChangeFromProps(optionValue)
                    }

                    if (!(readOnly || disabled)) {
                      setValue(optionValue, !!disableModifyingFormFromProps)
                    }
                  }}
                  option={optionIsObject(option) ? option : { label: option, value: option }}
                  path={path}
                  readOnly={readOnly || disabled}
                  uuid={uuid}
                />
              </li>
            )
          })}
        </ul>
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
