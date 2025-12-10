'use client'
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { format, parse, isValid } from 'date-fns'
import { CalendarIcon, Clock, X } from 'lucide-react'

import type { Props } from './types'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

// Time picker component with scroll selectors and keyboard input
function TimePicker({
  value,
  onChange,
  use12Hour = true,
}: {
  value: Date | undefined
  onChange: (date: Date) => void
  use12Hour?: boolean
}) {
  const hours = use12Hour
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const currentHour = value ? (use12Hour ? value.getHours() % 12 || 12 : value.getHours()) : 12
  const currentMinute = value ? value.getMinutes() : 0
  const currentPeriod = value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM'

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  // Scroll to selected values on mount
  useEffect(() => {
    const scrollToSelected = (
      ref: React.RefObject<HTMLDivElement | null>,
      val: number,
      items: number[],
    ) => {
      if (ref.current) {
        const index = items.indexOf(val)
        if (index !== -1) {
          const itemHeight = 32
          ref.current.scrollTop = index * itemHeight
        }
      }
    }
    scrollToSelected(hourRef, currentHour, hours)
    scrollToSelected(minuteRef, Math.floor(currentMinute / 5) * 5, minutes)
  }, [currentHour, currentMinute, hours, minutes])

  const handleHourChange = (hour: number) => {
    const newDate = value ? new Date(value) : new Date()
    if (use12Hour) {
      const isPM = currentPeriod === 'PM'
      let h = hour
      if (isPM && hour !== 12) h = hour + 12
      if (!isPM && hour === 12) h = 0
      newDate.setHours(h)
    } else {
      newDate.setHours(hour)
    }
    onChange(newDate)
  }

  const handleMinuteChange = (minute: number) => {
    const newDate = value ? new Date(value) : new Date()
    newDate.setMinutes(minute)
    onChange(newDate)
  }

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    const newDate = value ? new Date(value) : new Date()
    const currentHours = newDate.getHours()
    if (period === 'AM' && currentHours >= 12) {
      newDate.setHours(currentHours - 12)
    } else if (period === 'PM' && currentHours < 12) {
      newDate.setHours(currentHours + 12)
    }
    onChange(newDate)
  }

  // Handle keyboard input for time
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    if (!time) return

    const [hours, mins] = time.split(':').map(Number)
    if (isNaN(hours) || isNaN(mins)) return

    const newDate = value ? new Date(value) : new Date()
    newDate.setHours(hours, mins, 0, 0)
    onChange(newDate)
  }

  // Format current time for input
  const timeInputValue = value
    ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
    : ''

  return (
    <div className="flex flex-col gap-3">
      {/* Keyboard input */}
      <div className="flex items-center gap-2">
        <Input
          type="time"
          value={timeInputValue}
          onChange={handleTimeInputChange}
          className="h-9 w-full appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>

      {/* Scroll selectors */}
      <div className="flex gap-1">
        {/* Hours */}
        <ScrollArea className="h-48 w-14 rounded-md border" scrollHideDelay={0} ref={hourRef}>
          <div className="p-1">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => handleHourChange(hour)}
                className={cn(
                  'flex h-8 w-full items-center justify-center rounded-sm text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  currentHour === hour &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                )}
              >
                {hour.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Minutes */}
        <ScrollArea className="h-48 w-14 rounded-md border" scrollHideDelay={0} ref={minuteRef}>
          <div className="p-1">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => handleMinuteChange(minute)}
                className={cn(
                  'flex h-8 w-full items-center justify-center rounded-sm text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  Math.floor(currentMinute / 5) * 5 === minute &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                )}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* AM/PM */}
        {use12Hour && (
          <div className="flex h-48 w-14 flex-col gap-1 rounded-md border p-1">
            {(['AM', 'PM'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => handlePeriodChange(period)}
                className={cn(
                  'flex h-8 w-full items-center justify-center rounded-sm text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  currentPeriod === period &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                )}
              >
                {period}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Parse formats for manual text input (user-friendly patterns)
const PARSE_FORMATS: Record<string, string[]> = {
  default: ['MM/dd/yyyy', 'M/d/yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'd/M/yyyy'],
  dayAndTime: [
    'MM/dd/yyyy HH:mm',
    'MM/dd/yyyy h:mm a',
    'M/d/yyyy h:mm a',
    'yyyy-MM-dd HH:mm',
    'dd/MM/yyyy HH:mm',
  ],
  timeOnly: ['HH:mm', 'h:mm a', 'H:mm'],
  dayOnly: ['MM/dd', 'M/d', 'MMM dd', 'dd/MM'],
  monthOnly: ['MMMM yyyy', 'MM/yyyy', 'yyyy-MM'],
}

const DatePicker: React.FC<Props> = (props) => {
  const {
    id,
    displayFormat: customDisplayFormat,
    maxDate,
    minDate,
    monthsToShow = 1,
    onChange: onChangeFromProps,
    pickerAppearance = 'default',
    placeholder: placeholderText,
    readOnly,
    value,
  } = props

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [previewDate, setPreviewDate] = useState<Date | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Determine date format based on picker appearance
  const dateFormat = useMemo(() => {
    if (customDisplayFormat) return customDisplayFormat
    switch (pickerAppearance) {
      case 'dayAndTime':
        return 'MM/dd/yyyy h:mm a'
      case 'timeOnly':
        return 'h:mm a'
      case 'dayOnly':
        return 'MMM dd'
      case 'monthOnly':
        return 'MMMM yyyy'
      default:
        return 'MM/dd/yyyy'
    }
  }, [customDisplayFormat, pickerAppearance])

  const selectedDate = useMemo(() => {
    if (!value) return undefined
    return new Date(value)
  }, [value])

  // Format display value
  const displayValue = useMemo(() => {
    if (!selectedDate) return ''
    try {
      return format(selectedDate, dateFormat)
    } catch {
      return format(selectedDate, 'MM/dd/yyyy')
    }
  }, [selectedDate, dateFormat])

  // Sync input value with selected date when not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(displayValue)
      setPreviewDate(selectedDate)
    }
  }, [displayValue, isEditing, selectedDate])

  // Parse user input and try to extract a valid date
  const parseInputDate = useCallback(
    (input: string): Date | null => {
      if (!input.trim()) return null

      const formats = PARSE_FORMATS[pickerAppearance] || PARSE_FORMATS.default
      const referenceDate = selectedDate || new Date()

      for (const fmt of formats) {
        try {
          const parsed = parse(input, fmt, referenceDate)
          if (isValid(parsed)) {
            return parsed
          }
        } catch {
          // Continue to next format
        }
      }

      // Try native Date parsing as fallback
      const nativeDate = new Date(input)
      if (isValid(nativeDate)) {
        return nativeDate
      }

      return null
    },
    [pickerAppearance, selectedDate],
  )

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChangeFromProps?.(null as unknown as Date)
      setInputValue('')
      return
    }

    // Preserve time if dayAndTime mode
    if (pickerAppearance === 'dayAndTime' && selectedDate) {
      date.setHours(selectedDate.getHours(), selectedDate.getMinutes())
    } else if (['dayOnly', 'default', 'monthOnly'].includes(pickerAppearance)) {
      // Set to noon to avoid timezone issues
      const tzOffset = date.getTimezoneOffset() / 60
      date.setHours(12 - tzOffset, 0, 0, 0)
    }

    date.setMilliseconds(0)
    onChangeFromProps?.(date)
    setPreviewDate(date)

    // Update input value immediately
    try {
      setInputValue(format(date, dateFormat))
    } catch {
      setInputValue(format(date, 'MM/dd/yyyy'))
    }

    // Close popover for non-time pickers
    if (pickerAppearance !== 'dayAndTime' && pickerAppearance !== 'timeOnly') {
      setOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Try to parse and update preview in real-time
    const parsed = parseInputDate(newValue)
    if (parsed) {
      setPreviewDate(parsed)
    }
  }

  const handleInputFocus = () => {
    setIsEditing(true)
    setOpen(true)
  }

  // Prevent popover from stealing focus when it opens
  const handlePopoverAutoFocus = (e: Event) => {
    e.preventDefault()
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if focus is moving to the popover - if so, don't process blur
    const relatedTarget = e.relatedTarget as Node | null
    if (popoverRef.current?.contains(relatedTarget)) {
      return
    }

    setIsEditing(false)

    if (!inputValue.trim()) {
      onChangeFromProps?.(null as unknown as Date)
      return
    }

    const parsed = parseInputDate(inputValue)
    if (parsed) {
      // Apply timezone and millisecond adjustments
      if (['dayOnly', 'default', 'monthOnly'].includes(pickerAppearance)) {
        const tzOffset = parsed.getTimezoneOffset() / 60
        parsed.setHours(12 - tzOffset, 0, 0, 0)
      }
      parsed.setMilliseconds(0)

      // Validate against min/max
      if (minDate && parsed < minDate) {
        setInputValue(displayValue)
        return
      }
      if (maxDate && parsed > maxDate) {
        setInputValue(displayValue)
        return
      }

      onChangeFromProps?.(parsed)
    } else {
      // Invalid input, revert to previous value
      setInputValue(displayValue)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setInputValue(displayValue)
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onChangeFromProps?.(null as unknown as Date)
    setInputValue('')
  }

  const showTimeInput = pickerAppearance === 'dayAndTime' || pickerAppearance === 'timeOnly'

  const handleTimePickerChange = (date: Date) => {
    onChangeFromProps?.(date)
    setPreviewDate(date)
    // Update input value immediately to reflect the time change
    try {
      setInputValue(format(date, dateFormat))
    } catch {
      setInputValue(format(date, 'MM/dd/yyyy'))
    }
  }

  // Get placeholder based on picker type
  const getPlaceholder = () => {
    if (placeholderText) return placeholderText
    switch (pickerAppearance) {
      case 'dayAndTime':
        return 'MM/DD/YYYY h:mm AM/PM'
      case 'timeOnly':
        return 'h:mm AM/PM'
      case 'dayOnly':
        return 'MMM DD'
      case 'monthOnly':
        return 'MMMM YYYY'
      default:
        return 'MM/DD/YYYY'
    }
  }

  // Time-only picker
  if (pickerAppearance === 'timeOnly') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative flex items-center">
            <PopoverTrigger asChild disabled={readOnly}>
              <button
                type="button"
                className="absolute left-3 z-10 text-muted-foreground hover:text-foreground focus:outline-none"
                disabled={readOnly}
              >
                <Clock className="size-4" />
              </button>
            </PopoverTrigger>
            <Input
              ref={inputRef}
              id={id}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder={getPlaceholder()}
              disabled={readOnly}
              className={cn('pl-9', selectedDate && !readOnly ? 'pr-8' : 'pr-3')}
            />
            {selectedDate && !readOnly && (
              <button
                type="button"
                className="absolute right-2 rounded-sm p-0.5 text-muted-foreground opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={handleClear}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          ref={popoverRef}
          className="w-auto p-3"
          align="start"
          onOpenAutoFocus={handlePopoverAutoFocus}
        >
          <TimePicker
            value={previewDate || selectedDate}
            onChange={handleTimePickerChange}
            use12Hour={true}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder={getPlaceholder()}
            disabled={readOnly}
            className={cn('pr-9', selectedDate && !readOnly && 'pr-16')}
          />
          {selectedDate && !readOnly && (
            <button
              type="button"
              className="absolute right-9 rounded-sm p-0.5 text-muted-foreground opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={handleClear}
            >
              <X className="size-4" />
            </button>
          )}
          <PopoverTrigger asChild disabled={readOnly}>
            <button
              type="button"
              className="absolute right-2 z-10 text-muted-foreground hover:text-foreground focus:outline-none"
              disabled={readOnly}
            >
              <CalendarIcon className="size-4" />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent
        ref={popoverRef}
        className="w-auto p-0"
        align="start"
        onOpenAutoFocus={handlePopoverAutoFocus}
      >
        <div className={cn('flex', showTimeInput && 'flex-row')}>
          <Calendar
            mode="single"
            selected={selectedDate}
            month={previewDate || selectedDate}
            onMonthChange={setPreviewDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            numberOfMonths={Math.min(2, monthsToShow)}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(2100, 11)}
          />
          {showTimeInput && (
            <div className="border-l border-border p-3">
              <TimePicker
                value={previewDate || selectedDate}
                onChange={handleTimePickerChange}
                use12Hour={true}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// eslint-disable-next-line no-restricted-exports
export default DatePicker
