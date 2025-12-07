import type { GenerateViewMetadata } from '../Root/index'

import { generateMetadata } from '../../utilities/meta'

export const generateAccountViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: `${t('authentication:accountOfCurrentUser')}`,
    keywords: `${t('authentication:account')}`,
    serverURL: config.serverURL,
    title: t('authentication:account'),
    ...(config.admin.meta || {}),
  })
