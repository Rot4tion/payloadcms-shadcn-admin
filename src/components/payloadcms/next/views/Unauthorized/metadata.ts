// @ts-nocheck payloadcms original type safe issue will fix later
import type { GenerateViewMetadata } from '../Root'

import { generateMetadata } from '../../utilities/meta'

export const generateUnauthorizedViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    description: t('error:unauthorized'),
    keywords: t('error:unauthorized'),
    serverURL: config.serverURL,
    title: t('error:unauthorized'),
    ...(config.admin.meta || {}),
  })
