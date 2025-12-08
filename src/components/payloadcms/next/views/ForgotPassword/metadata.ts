// @ts-nocheck payloadcms original type safe issue will fix later
import type { GenerateViewMetadata } from '../Root'

import { generateMetadata } from '../../utilities/meta'

export const generateForgotPasswordViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    description: t('authentication:forgotPassword'),
    keywords: t('authentication:forgotPassword'),
    title: t('authentication:forgotPassword'),
    ...(config.admin.meta || {}),
    serverURL: config.serverURL,
  })
