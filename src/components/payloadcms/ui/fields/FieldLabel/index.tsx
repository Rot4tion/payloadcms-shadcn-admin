'use client'

import type { GenericLabelProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { useForm } from '@payloadcms/ui'
import { useEditDepth } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { generateFieldID } from '../../utilities/generateFieldID'

export const FieldLabel: React.FC<GenericLabelProps> = (props) => {
  const {
    as: ElementFromProps = 'label',
    hideLocale = false,
    htmlFor: htmlForFromProps,
    label,
    localized = false,
    path,
    required = false,
    unstyled = false,
  } = props

  const { uuid } = useForm()
  const editDepth = useEditDepth()

  const htmlFor = htmlForFromProps || generateFieldID(path, editDepth, uuid)

  const { i18n } = useTranslation()
  const { code, label: localLabel } = useLocale()

  const Element =
    ElementFromProps === 'label' ? (htmlFor ? 'label' : 'span') : ElementFromProps || 'span'

  if (label) {
    return (
      <Element
        className={cn(
          'flex items-center',
          !unstyled &&
            'pb-[calc(var(--base)*0.25)] text-foreground/80 font-body ltr:mr-auto rtl:ml-auto',
          unstyled && 'unstyled',
        )}
        htmlFor={htmlFor}
      >
        {getTranslation(label, i18n)}
        {required && !unstyled && (
          <span className="text-destructive ltr:ml-[calc(var(--base)*0.25)] rtl:mr-[calc(var(--base)*0.25)]">
            *
          </span>
        )}
        {localized && !hideLocale && (
          <span className="ltr:ml-[calc(var(--base)*0.25)] rtl:mr-[calc(var(--base)*0.25)]">
            &mdash; {typeof localLabel === 'string' ? localLabel : code}
          </span>
        )}
      </Element>
    )
  }

  return null
}
