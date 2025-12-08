// @ts-nocheck payloadcms original type safe issue will fix later
import type { I18n } from '@payloadcms/translations'
import type { BasePayload, Config, LanguageOptions, TypedUser } from 'payload'

import { FieldLabel } from '@/components/payloadcms/ui/exports/client'
import { cn } from '@/lib/utils'
import React from 'react'

import { ResetPreferences } from '../ResetPreferences/index'
import { ToggleTheme } from '../ToggleTheme/index'
import { LanguageSelector } from './LanguageSelector'

export const Settings: React.FC<{
  readonly className?: string
  readonly i18n: I18n
  readonly languageOptions: LanguageOptions
  readonly payload: BasePayload
  readonly theme: Config['admin']['theme']
  readonly user?: TypedUser
}> = (props) => {
  const { className, i18n, languageOptions, payload, theme, user } = props

  const apiRoute = payload.config.routes.api

  return (
    <div
      className={cn(
        'relative flex flex-col gap-[var(--base)]',
        'mt-[calc(var(--base)*3)] pt-[calc(var(--base)*3)] pb-[calc(var(--base)*3)] mb-[calc(var(--base)*2)]',
        'max-lg:mt-[calc(var(--base)*2)] max-lg:pt-[calc(var(--base)*2)] max-lg:pb-[calc(var(--base)*2)] max-lg:mb-[var(--base)]',
        'before:content-[""] before:block before:h-px before:bg-border before:w-[calc(100%+calc(var(--base)*5))] before:absolute before:left-[calc(var(--gutter-h)*-1)] before:top-0',
        'max-lg:after:content-[""] max-lg:after:block max-lg:after:h-px max-lg:after:bg-border max-lg:after:w-[calc(100%+calc(var(--base)*5))] max-lg:after:absolute max-lg:after:left-[calc(var(--gutter-h)*-1)] max-lg:after:bottom-0',
        className,
      )}
    >
      <h3 className="m-0">{i18n.t('general:payloadSettings')}</h3>
      <div>
        <FieldLabel htmlFor="language-select" label={i18n.t('general:language')} />
        <LanguageSelector languageOptions={languageOptions} />
      </div>
      {theme === 'all' && <ToggleTheme />}
      <ResetPreferences apiRoute={apiRoute} user={user} />
    </div>
  )
}
