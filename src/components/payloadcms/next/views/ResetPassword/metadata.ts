// @ts-nocheck payloadcms original type safe issue will fix later
import type { Metadata } from 'next'

import type { GenerateViewMetadata } from '../Root'

import { generateMetadata } from '../../utilities/meta'

export const generateResetPasswordViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}): Promise<Metadata> =>
  generateMetadata({
    description: t('authentication:resetPassword'),
    keywords: t('authentication:resetPassword'),
    serverURL: config.serverURL,
    title: t('authentication:resetPassword'),
    ...(config.admin.meta || {}),
  })
