'use client'

import { useTranslation } from '@payloadcms/ui'
import { useListDrawerContext } from '../../ListDrawer/Provider.js'
import { Pill } from '../../Pill/index.js'

const baseClass = 'list-header'

type DefaultDrawerTitleActionsProps = {
  hasCreatePermission: boolean
}

export function ListDrawerCreateNewDocButton({
  hasCreatePermission,
}: DefaultDrawerTitleActionsProps) {
  const { DocumentDrawerToggler } = useListDrawerContext()
  const { t } = useTranslation()

  if (!hasCreatePermission) {
    return null
  }

  return (
    <DocumentDrawerToggler
      className={`${baseClass}__create-new-button`}
      key="create-new-button-toggler"
    >
      <Pill size="small">{t('general:createNew')}</Pill>
    </DocumentDrawerToggler>
  )
}
