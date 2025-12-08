// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { ListViewClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation'
import { formatAdminURL, formatFilesize } from 'payload/shared'
import React, { Fragment, useEffect } from 'react'

import { cn } from '@/lib/utils'
import { useBulkUpload } from '../../elements/BulkUpload'
import { Button } from '../../elements/Button'
import { Gutter } from '../../elements/Gutter'
import { ListControls } from '../../elements/ListControls'
import { useListDrawerContext } from '../../elements/ListDrawer/Provider'
import { useModal } from '../../elements/Modal'
import { PageControls } from '../../elements/PageControls'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent'
import { SelectMany } from '../../elements/SelectMany'
import { useStepNav } from '../../elements/StepNav'
import { StickyToolbar } from '../../elements/StickyToolbar'
import { RelationshipProvider } from '../../elements/Table/RelationshipProvider'
import { ViewDescription } from '../../elements/ViewDescription'
import { useControllableState } from '../../hooks/useControllableState'
import { useConfig } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { SelectionProvider } from '@payloadcms/ui'
import { TableColumnsProvider } from '../../providers/TableColumns'
import { useTranslation } from '@payloadcms/ui'
import { useWindowInfo } from '@payloadcms/ui'
import { ListSelection } from '../../views/List/ListSelection'
import { CollectionListHeader } from './ListHeader'

const baseClass = 'collection-list'

export function DefaultListView(props: ListViewClientProps) {
  const {
    AfterList,
    AfterListTable,
    beforeActions,
    BeforeList,
    BeforeListTable,
    collectionSlug,
    columnState,
    Description,
    disableBulkDelete,
    disableBulkEdit,
    disableQueryPresets,
    enableRowSelections,
    hasCreatePermission: hasCreatePermissionFromProps,
    hasDeletePermission,
    listMenuItems,
    newDocumentURL,
    queryPreset,
    queryPresetPermissions,
    renderedFilters,
    resolvedFilterOptions,
    Table: InitialTable,
    viewType,
  } = props

  const [Table] = useControllableState(InitialTable)

  const { allowCreate, createNewDrawerSlug, isInDrawer, onBulkSelect } = useListDrawerContext()

  const hasCreatePermission =
    allowCreate !== undefined
      ? allowCreate && hasCreatePermissionFromProps
      : hasCreatePermissionFromProps

  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig()
  const router = useRouter()

  const { data, isGroupingBy } = useListQuery()

  const { openModal } = useModal()
  const { drawerSlug: bulkUploadDrawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels, upload } = collectionConfig

  const isUploadCollection = Boolean(upload)

  const isBulkUploadEnabled = isUploadCollection && collectionConfig.upload.bulkUpload

  const isTrashEnabled = Boolean(collectionConfig.trash)

  const { i18n } = useTranslation()

  const { setStepNav } = useStepNav()

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const docs = React.useMemo(() => {
    if (isUploadCollection) {
      return data.docs.map((doc) => {
        return {
          ...doc,
          filesize: formatFilesize(doc.filesize),
        }
      })
    } else {
      return data?.docs
    }
  }, [data?.docs, isUploadCollection])

  useEffect(() => {
    if (!isInDrawer) {
      const baseLabel = {
        label: getTranslation(labels?.plural, i18n),
        url:
          isTrashEnabled && viewType === 'trash'
            ? formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}`,
              })
            : undefined,
      }

      const trashLabel = {
        label: i18n.t('general:trash'),
      }

      const navItems =
        isTrashEnabled && viewType === 'trash' ? [baseLabel, trashLabel] : [baseLabel]

      setStepNav(navItems)
    }
  }, [adminRoute, setStepNav, labels, isInDrawer, isTrashEnabled, viewType, i18n, collectionSlug])

  return (
    <Fragment>
      <TableColumnsProvider collectionSlug={collectionSlug} columnState={columnState}>
        <div className={cn('w-full', baseClass, `${baseClass}--${collectionSlug}`)}>
          <SelectionProvider docs={docs} totalDocs={data?.totalDocs}>
            {BeforeList}
            <Gutter
              className={cn('pb-[var(--spacing-view-bottom)] space-y-4', `${baseClass}__wrap`)}
            >
              <CollectionListHeader
                collectionConfig={collectionConfig}
                Description={
                  <div className="w-full pt-3">
                    <RenderCustomComponent
                      CustomComponent={Description}
                      Fallback={
                        <ViewDescription
                          collectionSlug={collectionSlug}
                          description={collectionConfig?.admin?.description}
                        />
                      }
                    />
                  </div>
                }
                disableBulkDelete={disableBulkDelete}
                disableBulkEdit={disableBulkEdit}
                hasCreatePermission={hasCreatePermission}
                hasDeletePermission={hasDeletePermission}
                i18n={i18n}
                isBulkUploadEnabled={isBulkUploadEnabled && !upload.hideFileInputOnCreate}
                isTrashEnabled={isTrashEnabled}
                newDocumentURL={newDocumentURL}
                smallBreak={smallBreak}
                viewType={viewType}
              />
              <ListControls
                beforeActions={
                  enableRowSelections && typeof onBulkSelect === 'function'
                    ? beforeActions
                      ? [...beforeActions, <SelectMany key="select-many" onClick={onBulkSelect} />]
                      : [<SelectMany key="select-many" onClick={onBulkSelect} />]
                    : beforeActions
                }
                collectionConfig={collectionConfig}
                collectionSlug={collectionSlug}
                disableQueryPresets={
                  collectionConfig?.enableQueryPresets !== true || disableQueryPresets
                }
                listMenuItems={listMenuItems}
                queryPreset={queryPreset}
                queryPresetPermissions={queryPresetPermissions}
                renderedFilters={renderedFilters}
                resolvedFilterOptions={resolvedFilterOptions}
              />
              {BeforeListTable}
              {docs?.length > 0 && (
                <div className="[&_.table-wrap:not(:last-child)]:mb-8 [&_.table-wrap--group-by:first-child]:mt-8">
                  <RelationshipProvider>{Table}</RelationshipProvider>
                </div>
              )}
              {docs?.length === 0 && (
                <div className="flex flex-col items-start gap-4 [&>*]:m-0">
                  <p>
                    {i18n.t(viewType === 'trash' ? 'general:noTrashResults' : 'general:noResults', {
                      label: getTranslation(labels?.plural, i18n),
                    })}
                  </p>
                  {hasCreatePermission && newDocumentURL && viewType !== 'trash' && (
                    <Fragment>
                      {isInDrawer ? (
                        <Button el="button" onClick={() => openModal(createNewDrawerSlug)}>
                          {i18n.t('general:createNewLabel', {
                            label: getTranslation(labels?.singular, i18n),
                          })}
                        </Button>
                      ) : (
                        <Button el="link" to={newDocumentURL}>
                          {i18n.t('general:createNewLabel', {
                            label: getTranslation(labels?.singular, i18n),
                          })}
                        </Button>
                      )}
                    </Fragment>
                  )}
                </div>
              )}
              {AfterListTable}
              {docs?.length > 0 && !isGroupingBy && (
                <PageControls
                  AfterPageControls={
                    smallBreak ? (
                      <div className="fixed bottom-0 z-10 py-3 w-full bg-background">
                        <ListSelection
                          collectionConfig={collectionConfig}
                          disableBulkDelete={disableBulkDelete}
                          disableBulkEdit={disableBulkEdit}
                          label={getTranslation(collectionConfig.labels.plural, i18n)}
                          showSelectAllAcrossPages={!isGroupingBy}
                        />
                        <div className="flex gap-1">
                          {enableRowSelections && typeof onBulkSelect === 'function'
                            ? beforeActions
                              ? [
                                  ...beforeActions,
                                  <SelectMany key="select-many" onClick={onBulkSelect} />,
                                ]
                              : [<SelectMany key="select-many" onClick={onBulkSelect} />]
                            : beforeActions}
                        </div>
                      </div>
                    ) : null
                  }
                  collectionConfig={collectionConfig}
                />
              )}
            </Gutter>
            {AfterList}
          </SelectionProvider>
        </div>
      </TableColumnsProvider>
      {docs?.length > 0 && isGroupingBy && data.totalPages > 1 && (
        <StickyToolbar>
          <PageControls collectionConfig={collectionConfig} />
        </StickyToolbar>
      )}
    </Fragment>
  )
}
