'use client'
import type { LabelFunction, OptionObject, StaticDescription, StaticLabel } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useState, useMemo, useCallback } from 'react'
import { ChevronsUpDown, X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

// Sortable Badge component for drag & drop
function SortableBadge({
  option,
  onRemove,
}: {
  option: OptionObject
  onRemove: (value: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: option.value,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Badge
      ref={setNodeRef}
      style={style}
      variant="secondary"
      className="cursor-grab gap-1 pr-1 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      {String(option.label)}
      <button
        type="button"
        className="ml-0.5 rounded-full outline-none ring-offset-background hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(option.value)
        }}
      >
        <X className="size-3 text-muted-foreground hover:text-foreground" />
      </button>
    </Badge>
  )
}

export type SelectInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly Description?: React.ReactNode
  readonly description?: StaticDescription
  readonly Error?: React.ReactNode
  readonly hasMany?: boolean
  readonly id?: string
  readonly isClearable?: boolean
  readonly isSortable?: boolean
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly name: string
  readonly onChange?: (value: OptionObject | OptionObject[] | null) => void
  readonly options?: OptionObject[]
  readonly path: string
  readonly placeholder?: LabelFunction | string
  readonly readOnly?: boolean
  readonly required?: boolean
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: string | string[]
}

export const SelectInput: React.FC<SelectInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    hasMany = false,
    isClearable = true,
    isSortable = true,
    label,
    Label,
    localized,
    onChange,
    options = [],
    path,
    placeholder,
    readOnly,
    required,
    showError,
    style,
    value,
  } = props

  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Translate options
  const translatedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: getTranslation(option.label, i18n),
      })),
    [options, i18n],
  )

  const placeholderText =
    typeof placeholder === 'string'
      ? placeholder
      : getTranslation(placeholder, i18n) || 'Select a value'

  // Get selected values for multi-select display (preserving order)
  const selectedValues = useMemo(() => {
    if (!hasMany || !Array.isArray(value)) return []
    return value
      .map((v) => translatedOptions.find((opt) => opt.value === v))
      .filter(Boolean) as OptionObject[]
  }, [hasMany, value, translatedOptions])

  // Get available (unselected) options for dropdown
  const availableOptions = useMemo(() => {
    if (!hasMany) return translatedOptions
    const selectedSet = new Set(Array.isArray(value) ? value : [])
    return translatedOptions.filter((opt) => !selectedSet.has(opt.value))
  }, [hasMany, value, translatedOptions])

  // Handle single select change
  const handleSingleChange = (newValue: string) => {
    if (newValue === '__clear__') {
      onChange?.(null)
    } else {
      const selectedOption = translatedOptions.find((opt) => opt.value === newValue)
      if (selectedOption) {
        onChange?.(selectedOption)
      }
    }
  }

  // Handle multi-select add
  const handleMultiAdd = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValues = [...currentValues, optionValue]

    const selectedOptions = newValues
      .map((v) => translatedOptions.find((opt) => opt.value === v))
      .filter(Boolean) as OptionObject[]

    onChange?.(selectedOptions.length > 0 ? selectedOptions : null)
  }

  // Remove a single value from multi-select
  const handleRemoveValue = useCallback(
    (optionValue: string) => {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.filter((v) => v !== optionValue)

      const selectedOptions = newValues
        .map((v) => translatedOptions.find((opt) => opt.value === v))
        .filter(Boolean) as OptionObject[]

      onChange?.(selectedOptions.length > 0 ? selectedOptions : null)
    },
    [value, translatedOptions, onChange],
  )

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const currentValues = Array.isArray(value) ? value : []
      const oldIndex = currentValues.indexOf(active.id as string)
      const newIndex = currentValues.indexOf(over.id as string)

      const newValues = arrayMove(currentValues, oldIndex, newIndex)

      const selectedOptions = newValues
        .map((v) => translatedOptions.find((opt) => opt.value === v))
        .filter(Boolean) as OptionObject[]

      onChange?.(selectedOptions.length > 0 ? selectedOptions : null)
    }
  }

  return (
    <div
      className={cn(
        'field-type select relative flex flex-col gap-2',
        className,
        showError && 'error',
        readOnly && 'read-only pointer-events-none opacity-60',
      )}
      id={`field-${path.replace(/\./g, '__')}`}
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
          // Multi-select using Popover + Command
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                tabIndex={readOnly ? -1 : 0}
                className={cn(
                  'flex h-auto min-h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  !selectedValues.length && 'text-muted-foreground',
                  showError && 'border-destructive',
                  readOnly && 'cursor-not-allowed opacity-50',
                )}
              >
                <div className="flex flex-1 flex-wrap gap-1">
                  {selectedValues.length > 0 ? (
                    isSortable ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={selectedValues.map((o) => o.value)}
                          strategy={horizontalListSortingStrategy}
                        >
                          {selectedValues.map((option) => (
                            <SortableBadge
                              key={option.value}
                              option={option}
                              onRemove={handleRemoveValue}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      selectedValues.map((option) => (
                        <Badge key={option.value} variant="secondary" className="gap-1 pr-1">
                          {String(option.label)}
                          <button
                            type="button"
                            className="ml-0.5 rounded-full outline-none ring-offset-background hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleRemoveValue(option.value)
                            }}
                          >
                            <X className="size-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      ))
                    )
                  ) : (
                    <span>{placeholderText}</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                    {availableOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          handleMultiAdd(option.value)
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          // Single select using Shadcn Select
          <Select
            value={value as string | undefined}
            onValueChange={handleSingleChange}
            disabled={readOnly}
          >
            <SelectTrigger className={cn('w-full', showError && 'border-destructive')}>
              <SelectValue placeholder={placeholderText} />
            </SelectTrigger>
            <SelectContent>
              {isClearable && value && (
                <SelectItem value="__clear__" className="text-muted-foreground">
                  Clear selection
                </SelectItem>
              )}
              {translatedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
