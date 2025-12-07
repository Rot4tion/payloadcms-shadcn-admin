import type { PopupProps } from '../Popup/index'

import { CheckboxInput } from '../../fields/Checkbox/Input'
import { Popup } from '../Popup/index'
import { cn } from '@/lib/utils'

type CheckboxPopupProps = {
  Button: React.ReactNode
  onChange: (args: { close: () => void; selectedValues: string[] }) => void
  options: {
    label: string
    value: string
  }[]
  selectedValues: string[]
} & Omit<PopupProps, 'button' | 'render'>

export function CheckboxPopup({
  Button,
  className,
  onChange,
  options,
  selectedValues,
  ...popupProps
}: CheckboxPopupProps) {
  return (
    <Popup
      button={Button}
      className={cn('[&_.checkbox-input]:items-center [&_.checkbox-input_label]:pb-0', className)}
      horizontalAlign="right"
      render={({ close }) => (
        <div className="flex flex-col gap-[calc(var(--base)*0.5)] px-[3px]">
          {options.map(({ label, value }) => (
            <CheckboxInput
              checked={selectedValues?.includes(value)}
              key={value}
              label={label}
              onToggle={() => {
                const newSelectedValues = selectedValues?.includes(value)
                  ? selectedValues.filter((v) => v !== value)
                  : [...selectedValues, value]
                onChange({ close, selectedValues: newSelectedValues })
              }}
            />
          ))}
        </div>
      )}
      showScrollbar
      verticalAlign="bottom"
      {...popupProps}
    />
  )
}
