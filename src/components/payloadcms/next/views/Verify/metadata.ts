// @ts-nocheck payloadcms original type safe issue will fix later
import type { GenerateViewMetadata } from '../Root'

import { generateMetadata } from '../../utilities/meta'

export const generateVerifyViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: t('authentication:verifyUser'),
    keywords: t('authentication:verify'),
    serverURL: config.serverURL,
    title: t('authentication:verify'),
    ...(config.admin.meta || {}),
  })
