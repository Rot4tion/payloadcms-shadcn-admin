'use client'
import type { OptionObject } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { useEditDepth } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

export const Radio: React.FC<{
  id: string
  isSelected: boolean
  option: OptionObject
  path: string
  readOnly?: boolean
  uuid?: string
}> = (props) => {
  const { option, path, readOnly, uuid } = props
  const { i18n } = useTranslation()

  const editDepth = useEditDepth()

  const id = `field-${path}-${option.value}${editDepth > 1 ? `-${editDepth}` : ''}${uuid ? `-${uuid}` : ''}`

  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem id={id} value={option.value} disabled={readOnly} className="size-5" />
      <Label
        htmlFor={id}
        className={cn(
          'cursor-pointer font-normal',
          readOnly && 'cursor-default text-muted-foreground',
        )}
      >
        {getTranslation(option.label, i18n)}
      </Label>
    </div>
  )
}
