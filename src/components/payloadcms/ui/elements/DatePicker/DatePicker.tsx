'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Clock, X } from 'lucide-react'

import type { Props } from './types.js'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
        <Clock className="size-4 text-muted-foreground" />
        <Input
          type="time"
          value={timeInputValue}
          onChange={handleTimeInputChange}
          className="h-9 w-full"
        />
      </div>

      {/* Scroll selectors */}
      <div className="flex gap-1">
        {/* Hours */}
        <ScrollArea className="h-48 w-14 rounded-md border" ref={hourRef}>
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
        <ScrollArea className="h-48 w-14 rounded-md border" ref={minuteRef}>
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

  // Determine date format based on picker appearance
  const dateFormat = useMemo(() => {
    if (customDisplayFormat) return customDisplayFormat
    switch (pickerAppearance) {
      case 'dayAndTime':
        return 'PPP p'
      case 'timeOnly':
        return 'p'
      case 'dayOnly':
        return 'MMM dd'
      case 'monthOnly':
        return 'MMMM yyyy'
      default:
        return 'PPP'
    }
  }, [customDisplayFormat, pickerAppearance])

  const selectedDate = useMemo(() => {
    if (!value) return undefined
    return new Date(value)
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChangeFromProps?.(null as unknown as Date)
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

    // Close popover for non-time pickers
    if (pickerAppearance !== 'dayAndTime' && pickerAppearance !== 'timeOnly') {
      setOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChangeFromProps?.(null as unknown as Date)
  }

  const displayValue = useMemo(() => {
    if (!selectedDate) return ''
    try {
      return format(selectedDate, dateFormat)
    } catch {
      return format(selectedDate, 'PPP')
    }
  }, [selectedDate, dateFormat])

  const showTimeInput = pickerAppearance === 'dayAndTime' || pickerAppearance === 'timeOnly'

  const handleTimePickerChange = (date: Date) => {
    onChangeFromProps?.(date)
  }

  // Time-only picker
  if (pickerAppearance === 'timeOnly') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={readOnly}>
          <Button
            id={id}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
            )}
            disabled={readOnly}
          >
            <Clock className="mr-2 size-4" />
            {selectedDate ? (
              format(selectedDate, 'h:mm a')
            ) : (
              <span>{placeholderText || 'Pick a time'}</span>
            )}
            {selectedDate && !readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto -mr-2 size-6 hover:bg-transparent"
                onClick={handleClear}
              >
                <X className="size-3 text-muted-foreground" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <TimePicker value={selectedDate} onChange={handleTimePickerChange} use12Hour={true} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={readOnly}>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )}
          disabled={readOnly}
        >
          <CalendarIcon className="mr-2 size-4" />
          {displayValue || <span>{placeholderText || 'Pick a date'}</span>}
          {selectedDate && !readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto -mr-2 size-6 hover:bg-transparent"
              onClick={handleClear}
            >
              <X className="size-3 text-muted-foreground" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className={cn('flex', showTimeInput && 'flex-row')}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            numberOfMonths={Math.min(2, monthsToShow)}
            captionLayout={pickerAppearance === 'monthOnly' ? 'dropdown' : 'label'}
            initialFocus
          />
          {showTimeInput && (
            <div className="border-l border-border p-3">
              <TimePicker value={selectedDate} onChange={handleTimePickerChange} use12Hour={true} />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// eslint-disable-next-line no-restricted-exports
export default DatePicker
