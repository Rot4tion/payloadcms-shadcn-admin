'use client'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation'
import * as qs from 'qs-esm'
import React, { Fragment } from 'react'

import { cn } from '@/lib/utils'
// Import from @payloadcms/ui to share context
import { useConfig, useLocale, useRouteTransition, useTranslation } from '@payloadcms/ui'
// useLocaleLoading is not exported from main entry, import from sub-path
import { useLocaleLoading } from '@payloadcms/ui/providers/Locale'
import { Popup, PopupList } from '../Popup/index'
import { LocalizerLabel } from './LocalizerLabel/index'

export const Localizer: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  const {
    config: { localization },
  } = useConfig()

  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const { setLocaleIsLoading } = useLocaleLoading()

  const { i18n } = useTranslation()
  const locale = useLocale()

  if (localization) {
    const { locales } = localization

    return (
      <div className={cn('relative flex items-center flex-nowrap', className)}>
        <Popup
          button={<LocalizerLabel />}
          horizontalAlign="right"
          render={({ close }) => (
            <PopupList.ButtonGroup>
              {locales.map((localeOption) => {
                const localeOptionLabel = getTranslation(localeOption.label, i18n)

                return (
                  <PopupList.Button
                    active={locale.code === localeOption.code}
                    disabled={locale.code === localeOption.code}
                    key={localeOption.code}
                    onClick={() => {
                      setLocaleIsLoading(true)
                      close()

                      // can't use `useSearchParams` here because it is stale due to `window.history.pushState` in `ListQueryProvider`
                      const searchParams = new URLSearchParams(window.location.search)

                      const url = qs.stringify(
                        {
                          ...qs.parse(searchParams.toString(), {
                            depth: 10,
                            ignoreQueryPrefix: true,
                          }),
                          locale: localeOption.code,
                        },
                        { addQueryPrefix: true },
                      )

                      startRouteTransition(() => {
                        router.push(url)
                      })
                    }}
                  >
                    {localeOptionLabel !== localeOption.code ? (
                      <Fragment>
                        {localeOptionLabel}
                        <span data-locale={localeOption.code}>{`(${localeOption.code})`}</span>
                      </Fragment>
                    ) : (
                      <span data-locale={localeOption.code}>{localeOptionLabel}</span>
                    )}
                  </PopupList.Button>
                )
              })}
            </PopupList.ButtonGroup>
          )}
          showScrollbar
          size="large"
        />
      </div>
    )
  }

  return null
}
