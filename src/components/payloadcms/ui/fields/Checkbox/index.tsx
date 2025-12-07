'use client'
import type {
  CheckboxFieldClientComponent,
  CheckboxFieldClientProps,
  CheckboxFieldValidation,
} from 'payload'

import { rtlLanguages } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import type { CheckboxInputProps } from './Input'

import { cn } from '@/lib/utils'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index'
import { FieldDescription } from '../../fields/FieldDescription/index'
import { FieldError } from '../../fields/FieldError/index'
import { useForm } from '@payloadcms/ui'
import { useField } from '../../forms/useField/index'
import { withCondition } from '../../forms/withCondition/index'
import { useEditDepth } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { generateFieldID } from '../../utilities/generateFieldID'
import { mergeFieldStyles } from '../mergeFieldStyles'
import { fieldBaseClass } from '../shared/index'
import { CheckboxInput } from './Input'

export { CheckboxFieldClientProps, CheckboxInput, type CheckboxInputProps }

const CheckboxFieldComponent: CheckboxFieldClientComponent = (props) => {
  const {
    id,
    checked: checkedFromProps,
    disableFormData,
    field,
    field: {
      admin: { className, description } = {} as CheckboxFieldClientProps['field']['admin'],
      label,
      required,
    } = {} as CheckboxFieldClientProps['field'],
    onChange: onChangeFromProps,
    partialChecked,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { uuid } = useForm()

  const editDepth = useEditDepth()

  const {
    i18n: { language },
  } = useTranslation()
  const isRTL = (rtlLanguages as readonly string[]).includes(language)

  const memoizedValidate: CheckboxFieldValidation = useCallback(
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
    disableFormData,
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const onToggle = useCallback(() => {
    if (!readOnly) {
      setValue(!value)
      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(!value)
      }
    }
  }, [onChangeFromProps, readOnly, setValue, value])

  const checked = checkedFromProps || Boolean(value)

  const fieldID = id || generateFieldID(path, editDepth, uuid)

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={cn(
        fieldBaseClass,
        'relative mb-6',
        showError && 'error',
        className,
        (readOnly || disabled) && 'opacity-60',
      )}
      style={styles}
    >
      <div className="flex items-center justify-between">
        <CheckboxInput
          AfterInput={AfterInput}
          BeforeInput={BeforeInput}
          checked={checked}
          id={fieldID}
          inputRef={null}
          Label={Label}
          label={label}
          name={path}
          onToggle={onToggle}
          partialChecked={partialChecked}
          readOnly={readOnly || disabled}
          required={required}
        />
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={
            <FieldError alignCaret={isRTL ? 'right' : 'left'} path={path} showError={showError} />
          }
        />
      </div>
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}

export const CheckboxField = withCondition(CheckboxFieldComponent)
