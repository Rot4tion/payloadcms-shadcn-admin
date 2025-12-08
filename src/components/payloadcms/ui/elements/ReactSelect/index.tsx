// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { KeyboardEventHandler } from 'react'

import { arrayMove } from '@dnd-kit/sortable'
import { getTranslation } from '@payloadcms/translations'
import React, { useEffect, useId } from 'react'
import Select, { type StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import type { Option, ReactSelectAdapterProps } from './types'
export type { Option } from './types'

import { cn } from '@/lib/utils'
import { useTranslation } from '@payloadcms/ui'
import { DraggableSortable } from '../DraggableSortable'
import { ShimmerEffect } from '../ShimmerEffect'
import { ClearIndicator } from './ClearIndicator'
import { Control } from './Control'
import { DropdownIndicator } from './DropdownIndicator'
import { Input } from './Input'
import { generateMultiValueDraggableID, MultiValue } from './MultiValue'
import { MultiValueLabel } from './MultiValueLabel'
import { MultiValueRemove } from './MultiValueRemove'
import { SingleValue } from './SingleValue'
import { ValueContainer } from './ValueContainer'

const createOption = (label: string) => ({
  label,
  value: label,
})

const SelectAdapter: React.FC<ReactSelectAdapterProps> = (props) => {
  const { i18n, t } = useTranslation()
  const [inputValue, setInputValue] = React.useState('') // for creatable select
  const uuid = useId()
  const [hasMounted, setHasMounted] = React.useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const {
    className,
    components,
    customProps,
    disabled = false,
    filterOption = undefined,
    getOptionValue,
    isClearable = true,
    isCreatable,
    isLoading,
    isSearchable = true,
    noOptionsMessage = () => t('general:noOptions'),
    numberOnly = false,
    onChange,
    onMenuClose,
    onMenuOpen,
    options,
    placeholder = t('general:selectValue'),
    showError,
    value,
  } = props

  const loadingMessage = () => t('general:loading') + '...'

  const classes = cn('react-select w-full', className, showError && 'react-select--error')

  // Tailwind-based styles for react-select using CSS variables
  const styles: StylesConfig<Option> = {
    container: (base) => ({
      ...base,
      width: '100%',
    }),
    control: (base) => ({
      ...base,
      width: '100%',
      minHeight: '2.25rem',
      backgroundColor: 'var(--color-card)',
      borderColor: showError ? 'var(--color-destructive)' : 'var(--color-border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'none',
      padding: '0.125rem 0.5rem',
      cursor: 'pointer',
      '&:hover': {
        borderColor: showError ? 'var(--color-destructive)' : 'var(--color-ring)',
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      backgroundColor: 'var(--color-popover)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: '0.25rem',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--color-accent)' : 'transparent',
      color: state.isSelected ? 'var(--color-accent-foreground)' : 'var(--color-foreground)',
      borderRadius: 'calc(var(--radius) - 4px)',
      padding: '0.375rem 0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      '&:active': {
        backgroundColor: 'var(--color-accent)',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--color-secondary)',
      borderRadius: 'calc(var(--radius) - 4px)',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--color-secondary-foreground)',
      fontSize: '0.75rem',
      padding: '0.125rem 0.25rem',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      '&:hover': {
        backgroundColor: 'var(--color-destructive)',
        color: 'var(--color-destructive-foreground)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--color-foreground)',
      fontSize: '0.875rem',
    }),
    input: (base) => ({
      ...base,
      color: 'var(--color-foreground)',
      fontSize: '0.875rem',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      padding: '0 0.25rem',
      '&:hover': {
        color: 'var(--color-foreground)',
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      padding: '0 0.25rem',
      '&:hover': {
        color: 'var(--color-foreground)',
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      fontSize: '0.875rem',
      padding: '0.5rem',
    }),
    loadingMessage: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      fontSize: '0.875rem',
    }),
    groupHeading: (base) => ({
      ...base,
      color: 'var(--color-muted-foreground)',
      fontSize: '0.75rem',
      fontWeight: 500,
      padding: '0.25rem 0.5rem',
      textTransform: 'uppercase',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0',
      gap: '0.25rem',
    }),
  }

  if (!hasMounted) {
    return <ShimmerEffect height="calc(var(--base) * 2 + 2px)" />
  }

  if (!isCreatable) {
    return (
      <Select
        captureMenuScroll
        customProps={customProps}
        isLoading={isLoading}
        {...props}
        className={classes}
        classNamePrefix="rs"
        components={{
          ClearIndicator,
          Control,
          DropdownIndicator,
          Input,
          MultiValue,
          MultiValueLabel,
          MultiValueRemove,
          SingleValue,
          ValueContainer,
          ...components,
        }}
        filterOption={filterOption}
        getOptionValue={getOptionValue}
        instanceId={uuid}
        isClearable={isClearable}
        isDisabled={disabled}
        isSearchable={isSearchable}
        loadingMessage={loadingMessage}
        menuPlacement="auto"
        noOptionsMessage={noOptionsMessage}
        onChange={onChange}
        onMenuClose={onMenuClose}
        onMenuOpen={onMenuOpen}
        options={options}
        placeholder={getTranslation(placeholder, i18n)}
        styles={styles}
        value={value}
      />
    )
  }
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (numberOnly === true) {
      const acceptableKeys = [
        'Tab',
        'Escape',
        'Backspace',
        'Enter',
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
      ]
      const isNumber = !/\D/.test(event.key)
      const isActionKey = acceptableKeys.includes(event.key)
      if (!isNumber && !isActionKey) {
        event.preventDefault()
        return
      }
    }
    if (!value || !inputValue || inputValue.trim() === '') {
      return
    }
    if (filterOption && !filterOption(null, inputValue)) {
      return
    }
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        onChange([...(value as Option[]), createOption(inputValue)])
        setInputValue('')
        event.preventDefault()
        break
      default:
        break
    }
  }

  return (
    <CreatableSelect
      captureMenuScroll
      isLoading={isLoading}
      {...props}
      className={classes}
      classNamePrefix="rs"
      components={{
        ClearIndicator,
        Control,
        DropdownIndicator,
        Input,
        MultiValue,
        MultiValueLabel,
        MultiValueRemove,
        SingleValue,
        ValueContainer,
        ...components,
      }}
      filterOption={filterOption}
      inputValue={inputValue}
      instanceId={uuid}
      isClearable={isClearable}
      isDisabled={disabled}
      isSearchable={isSearchable}
      loadingMessage={loadingMessage}
      menuPlacement="auto"
      noOptionsMessage={noOptionsMessage}
      onChange={onChange}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      onMenuClose={onMenuClose}
      onMenuOpen={onMenuOpen}
      options={options}
      placeholder={getTranslation(placeholder, i18n)}
      styles={styles}
      value={value}
    />
  )
}

const SortableSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const { getOptionValue, onChange, value } = props

  let draggableIDs: string[] = []
  if (value) {
    draggableIDs = (Array.isArray(value) ? value : [value]).map((optionValue) => {
      return generateMultiValueDraggableID(optionValue, getOptionValue)
    })
  }

  return (
    <DraggableSortable
      className="react-select-container"
      ids={draggableIDs}
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        let sorted = value
        if (value && Array.isArray(value)) {
          sorted = arrayMove(value, moveFromIndex, moveToIndex)
        }
        onChange(sorted)
      }}
    >
      <SelectAdapter {...props} />
    </DraggableSortable>
  )
}

export const ReactSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const { isMulti, isSortable } = props

  if (isMulti && isSortable) {
    return <SortableSelect {...props} />
  }

  return <SelectAdapter {...props} />
}
