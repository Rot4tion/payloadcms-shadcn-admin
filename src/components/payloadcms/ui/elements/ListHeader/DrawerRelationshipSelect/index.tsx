'use client'

import { getTranslation } from '@payloadcms/translations'

import { FieldLabel } from '../../../fields/FieldLabel/index'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { useListDrawerContext } from '../../ListDrawer/Provider'
import { ReactSelect } from '../../ReactSelect/index'

export const DrawerRelationshipSelect = () => {
  const { i18n, t } = useTranslation()
  const {
    config: { collections },
    getEntityConfig,
  } = useConfig()
  const { enabledCollections, selectedOption, setSelectedOption } = useListDrawerContext()
  const enabledCollectionConfigs = collections.filter(({ slug }) =>
    enabledCollections.includes(slug),
  )
  if (enabledCollectionConfigs.length > 1) {
    const activeCollectionConfig = getEntityConfig({ collectionSlug: selectedOption.value })

    return (
      <div className="list-drawer__select-collection-wrap">
        <FieldLabel label={t('upload:selectCollectionToBrowse')} />
        <ReactSelect
          className="list-header__select-collection"
          isClearable={false}
          onChange={setSelectedOption}
          options={enabledCollectionConfigs.map((coll) => ({
            label: getTranslation(coll.labels.singular, i18n),
            value: coll.slug,
          }))}
          value={{
            label: getTranslation(activeCollectionConfig?.labels.singular, i18n),
            value: activeCollectionConfig?.slug,
          }}
        />
      </div>
    )
  }
  return null
}
