'use client'
import type { ChangeEvent } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'
import type { TextInputProps } from './types.js'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ReactSelect } from '../../elements/ReactSelect/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

export const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    hasMany,
    htmlAttributes,
    inputRef,
    Label,
    label,
    localized,
    maxRows,
    onChange,
    onKeyDown,
    path,
    placeholder: placeholderFromProps,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    valueToRender,
  } = props

  const { i18n, t } = useTranslation()

  const editableProps: ReactSelectAdapterProps['customProps']['editableProps'] = (
    data,
    className,
    selectProps,
  ) => {
    const editableClassName = `${className}--editable`

    return {
      onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
        event.currentTarget.contentEditable = 'false'
      },
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.contentEditable = 'true'
        event.currentTarget.classList.add(editableClassName)
        event.currentTarget.focus()
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'Escape') {
          event.currentTarget.contentEditable = 'false'
          event.currentTarget.classList.remove(editableClassName)
          data.value.value = event.currentTarget.innerText
          data.label = event.currentTarget.innerText

          if (data.value.value.replaceAll('\n', '')) {
            selectProps.onChange(selectProps.value, {
              action: 'create-option',
              option: data,
            })
          } else {
            if (Array.isArray(selectProps.value)) {
              const newValues = selectProps.value.filter((v) => v.id !== data.id)
              selectProps.onChange(newValues, {
                action: 'pop-value',
                removedValue: data,
              })
            }
          }

          event.preventDefault()
        }
        event.stopPropagation()
      },
    }
  }

  const placeholder = getTranslation(placeholderFromProps, i18n)

  return (
    <div
      className={cn(
        'field-type text relative flex flex-col gap-2',
        className,
        showError && 'error',
        readOnly && 'read-only pointer-events-none opacity-60',
        hasMany && 'has-many',
      )}
      style={style}
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
      <div className="flex flex-col gap-1.5">
        {BeforeInput}
        {hasMany ? (
          <ReactSelect
            className={`field-${path.replace(/\./g, '__')}`}
            components={{ DropdownIndicator: null }}
            customProps={{
              editableProps,
            }}
            disabled={readOnly}
            // prevent adding additional options if maxRows is reached
            filterOption={() =>
              !maxRows ? true : !(Array.isArray(value) && maxRows && value.length >= maxRows)
            }
            isClearable={false}
            isCreatable
            isMulti
            isSortable
            menuIsOpen={false}
            noOptionsMessage={() => {
              const isOverHasMany = Array.isArray(value) && value.length >= maxRows
              if (isOverHasMany) {
                return t('validation:limitReached', { max: maxRows, value: value.length + 1 })
              }
              return null
            }}
            onChange={onChange}
            options={[]}
            placeholder={placeholder}
            showError={showError}
            value={valueToRender}
          />
        ) : (
          <Input
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path?.replace(/\./g, '__')}`}
            name={path}
            onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={value || ''}
            aria-invalid={showError}
            {...(htmlAttributes ?? {})}
          />
        )}
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
