'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../../icons/Chevron'
import { useLocale } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

export const LocalizerLabel: React.FC<{
  ariaLabel?: string
  className?: string
}> = (props) => {
  const { ariaLabel, className } = props
  const locale = useLocale()
  const { i18n, t } = useTranslation()

  return (
    <div
      aria-label={ariaLabel || t('general:locale')}
      className={cn(
        'flex items-center whitespace-nowrap ps-[calc(var(--base)*0.4)] pe-[calc(var(--base)*0.2)] bg-muted rounded-sm',
        '[&_button]:text-current [&_button]:p-0 [&_button]:text-base [&_button]:leading-(--base) [&_button]:bg-transparent [&_button]:border-0 [&_button]:font-semibold [&_button]:cursor-pointer',
        'hover:[&_button]:underline focus-visible:[&_button]:underline',
        'active:[&_button]:outline-none focus:[&_button]:outline-none',
        className,
      )}
      data-locale={locale ? locale.code : undefined}
    >
      <div className="text-muted-foreground max-md:hidden">{`${t('general:locale')}:`}&nbsp;</div>
      <div className="flex items-center">
        <span>{`${getTranslation(locale.label, i18n)}`}</span>
        <ChevronIcon className="[&_.stroke]:stroke-current" />
      </div>
    </div>
  )
}
