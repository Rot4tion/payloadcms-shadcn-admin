import type { GenerateViewMetadata } from '../Root/index'

import { generateMetadata } from '../../utilities/meta'

export const generateDashboardViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    serverURL: config.serverURL,
    title: t('general:dashboard'),
    ...config.admin.meta,
    openGraph: {
      title: t('general:dashboard'),
      ...(config.admin.meta?.openGraph || {}),
    },
  })
