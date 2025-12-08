// @ts-nocheck payloadcms original type safe issue will fix later
import type { Locale, PayloadRequest } from 'payload'

import { upsertPreferences } from '@/components/payloadcms/ui/exports/rsc'
import { findLocaleFromCode } from '@/components/payloadcms/ui/exports/shared'

import { getPreferences } from './getPreferences'

type GetRequestLocalesArgs = {
  req: PayloadRequest
}

export async function getRequestLocale({ req }: GetRequestLocalesArgs): Promise<Locale> {
  if (req.payload.config.localization) {
    const localeFromParams = req.query.locale as string | undefined

    if (req.user && localeFromParams) {
      await upsertPreferences<Locale['code']>({ key: 'locale', req, value: localeFromParams })
    }

    return (
      (req.user &&
        findLocaleFromCode(
          req.payload.config.localization,
          localeFromParams ||
            (
              await getPreferences<Locale['code']>(
                'locale',
                req.payload,
                req.user.id,
                req.user.collection,
              )
            )?.value,
        )) ||
      findLocaleFromCode(
        req.payload.config.localization,
        req.payload.config.localization.defaultLocale || 'en',
      )
    )
  }

  return undefined
}
