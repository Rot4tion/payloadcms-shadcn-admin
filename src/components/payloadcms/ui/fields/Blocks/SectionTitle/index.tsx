'use client'
import React from 'react'

import { useField } from '../../../forms/useField/index'
import { useTranslation } from '@payloadcms/ui'

export type Props = {
  customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  customValue?: string
  path: string
  readOnly: boolean
}

/**
 * An input field representing the block's `blockName` property - responsible for reading and saving the `blockName`
 * property from/into the provided path.
 */
export const SectionTitle: React.FC<Props> = (props) => {
  const { customOnChange, customValue, path, readOnly } = props

  const { setValue, value } = useField({ path })
  const { t } = useTranslation()

  const onChange =
    customOnChange ||
    ((e) => {
      e.stopPropagation()
      e.preventDefault()
      setValue(e.target.value)
    })

  return (
    <div
      className="relative min-w-16 max-w-full pointer-events-auto flex overflow-hidden after:block after:invisible after:whitespace-nowrap after:overflow-hidden after:text-ellipsis after:max-w-full after:content-[attr(data-value)_' '] after:font-semibold after:text-xs after:p-0 after:w-full"
      data-value={customValue || value}
    >
      <input
        className="text-foreground/80 bg-transparent border-none min-w-min w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis resize-none appearance-none absolute inset-0 font-semibold text-xs p-0 hover:shadow-[inset_0px_-2px_0px_-1px_hsl(var(--muted))] hover:outline-none focus:outline-none focus:shadow-none"
        id={path}
        name={path}
        onChange={onChange}
        placeholder={t('general:untitled')}
        readOnly={readOnly}
        type="text"
        value={customValue || (value as string) || ''}
      />
    </div>
  )
}
