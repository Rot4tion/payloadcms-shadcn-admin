// @ts-nocheck payloadcms original type safe issue will fix later
import type { GenerateViewMetadata } from '../Root'

import { generateMetadata } from '../../utilities/meta'

export const generateLoginViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: `${t('authentication:login')}`,
    keywords: `${t('authentication:login')}`,
    serverURL: config.serverURL,
    title: t('authentication:login'),
    ...(config.admin.meta || {}),
  })
