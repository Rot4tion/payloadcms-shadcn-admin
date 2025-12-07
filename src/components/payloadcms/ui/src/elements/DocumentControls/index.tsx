'use client'
import type {
  ClientUser,
  Data,
  SanitizedCollectionConfig,
  SanitizedCollectionPermission,
  SanitizedGlobalPermission,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment, useEffect } from 'react'

// Import hooks from @payloadcms/ui to share context
import {
  useFormInitializing,
  useFormProcessing,
  useConfig,
  useEditDepth,
  useTranslation,
  useLivePreviewContext,
} from '@payloadcms/ui'
import { formatDate } from '../../utilities/formatDocTitle/formatDateTitle.js'
import { Autosave } from '../Autosave/index.js'
import { Button } from '../Button/index.js'
import { CopyLocaleData } from '../CopyLocaleData/index.js'
import { DeleteDocument } from '../DeleteDocument/index.js'
import { DuplicateDocument } from '../DuplicateDocument/index.js'
import { MoveDocToFolder } from '../FolderView/MoveDocToFolder/index.js'
import { Gutter } from '../Gutter/index.js'
import { LivePreviewToggler } from '../LivePreview/Toggler/index.js'
import { Locked } from '../Locked/index.js'
import { PermanentlyDeleteButton } from '../PermanentlyDeleteButton/index.js'
import { Popup, PopupList } from '../Popup/index.js'
import { PreviewButton } from '../PreviewButton/index.js'
import { PublishButton } from '../PublishButton/index.js'
import { RenderCustomComponent } from '../RenderCustomComponent/index.js'
import { RestoreButton } from '../RestoreButton/index.js'
import { SaveButton } from '../SaveButton/index.js'
import { cn } from '@/lib/utils'
import { SaveDraftButton } from '../SaveDraftButton/index.js'
import { Status } from '../Status/index.js'
import { DocumentDrawerContextType } from 'node_modules/@payloadcms/ui/dist/elements/DocumentDrawer/Provider.js'

export const DocumentControls: React.FC<{
  readonly apiURL: string
  readonly BeforeDocumentControls?: React.ReactNode
  readonly customComponents?: {
    readonly PreviewButton?: React.ReactNode
    readonly PublishButton?: React.ReactNode
    readonly SaveButton?: React.ReactNode
    readonly SaveDraftButton?: React.ReactNode
  }
  readonly data?: Data
  readonly disableActions?: boolean
  readonly disableCreate?: boolean
  readonly EditMenuItems?: React.ReactNode
  readonly hasPublishPermission?: boolean
  readonly hasSavePermission?: boolean
  readonly id?: number | string
  readonly isAccountView?: boolean
  readonly isEditing?: boolean
  readonly isInDrawer?: boolean
  readonly isTrashed?: boolean
  readonly onDelete?: DocumentDrawerContextType['onDelete']
  readonly onDrawerCreateNew?: () => void
  /* Only available if `redirectAfterDuplicate` is `false` */
  readonly onDuplicate?: DocumentDrawerContextType['onDuplicate']
  readonly onRestore?: DocumentDrawerContextType['onRestore']
  readonly onSave?: DocumentDrawerContextType['onSave']
  readonly onTakeOver?: () => void
  readonly permissions: null | SanitizedCollectionPermission | SanitizedGlobalPermission
  readonly readOnlyForIncomingUser?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
  readonly slug: SanitizedCollectionConfig['slug']
  readonly user?: ClientUser
}> = (props) => {
  const {
    id,
    slug,
    BeforeDocumentControls,
    customComponents: {
      PreviewButton: CustomPreviewButton,
      PublishButton: CustomPublishButton,
      SaveButton: CustomSaveButton,
      SaveDraftButton: CustomSaveDraftButton,
    } = {},
    data,
    disableActions,
    disableCreate,
    EditMenuItems,
    hasSavePermission,
    isAccountView,
    isEditing,
    isInDrawer,
    isTrashed,
    onDelete,
    onDrawerCreateNew,
    onDuplicate,
    onRestore,
    onTakeOver,
    permissions,
    readOnlyForIncomingUser,
    redirectAfterDelete,
    redirectAfterDuplicate,
    redirectAfterRestore,
    user,
  } = props

  const { i18n, t } = useTranslation()

  const editDepth = useEditDepth()

  const { config, getEntityConfig } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug: slug })

  const globalConfig = getEntityConfig({ globalSlug: slug })

  const { isLivePreviewEnabled } = useLivePreviewContext()

  const {
    admin: { dateFormat },
    localization,
    routes: { admin: adminRoute },
  } = config

  // Settings these in state to avoid hydration issues if there is a mismatch between the server and client
  const [updatedAt, setUpdatedAt] = React.useState<string>('')
  const [createdAt, setCreatedAt] = React.useState<string>('')

  const processing = useFormProcessing()
  const initializing = useFormInitializing()

  useEffect(() => {
    if (data?.updatedAt) {
      setUpdatedAt(formatDate({ date: data.updatedAt, i18n, pattern: dateFormat }))
    }
    if (data?.createdAt) {
      setCreatedAt(formatDate({ date: data.createdAt, i18n, pattern: dateFormat }))
    }
  }, [data, i18n, dateFormat])

  const hasCreatePermission = permissions && 'create' in permissions && permissions.create

  const hasDeletePermission = permissions && 'delete' in permissions && permissions.delete

  const showDotMenu = Boolean(
    collectionConfig && id && !disableActions && (hasCreatePermission || hasDeletePermission),
  )

  const unsavedDraftWithValidations =
    !id && collectionConfig?.versions?.drafts && collectionConfig.versions?.drafts.validate

  const collectionConfigDrafts = collectionConfig?.versions?.drafts
  const globalConfigDrafts = globalConfig?.versions?.drafts

  const autosaveEnabled =
    (collectionConfigDrafts && collectionConfigDrafts?.autosave) ||
    (globalConfigDrafts && globalConfigDrafts?.autosave)

  const collectionAutosaveEnabled = collectionConfigDrafts && collectionConfigDrafts?.autosave
  const globalAutosaveEnabled = globalConfigDrafts && globalConfigDrafts?.autosave

  const showSaveDraftButton =
    (collectionAutosaveEnabled &&
      collectionConfigDrafts.autosave !== false &&
      collectionConfigDrafts.autosave.showSaveDraftButton === true) ||
    (globalAutosaveEnabled &&
      globalConfigDrafts.autosave !== false &&
      globalConfigDrafts.autosave.showSaveDraftButton === true)

  const showCopyToLocale = localization && !collectionConfig?.admin?.disableCopyToLocale

  const showFolderMetaIcon = collectionConfig && collectionConfig.folders
  const showLockedMetaIcon = user && readOnlyForIncomingUser

  return (
    <Gutter
      className={cn(
        'doc-controls',
        'sticky top-0 w-full z-[5] flex items-center',
        'bg-background/80 backdrop-blur-sm',
        'max-lg:top-[calc(var(--base)*-2.8)] max-lg:px-0',
      )}
    >
      <div
        className={cn(
          'relative w-full flex items-center justify-between gap-(--base) pb-px z-[4]',
          'h-(--doc-controls-height)',
          'max-lg:flex-col max-lg:gap-0 max-lg:h-auto',
        )}
      >
        <div
          className={cn(
            'flex items-center grow overflow-hidden py-[calc(var(--base)*0.8)] gap-[calc(var(--base)*0.5)]',
            'max-lg:w-full max-lg:overflow-auto max-lg:px-[calc(var(--base)*2)] max-lg:scrollbar-hide',
            'max-md:px-[calc(var(--base)*0.8)]',
          )}
        >
          {showLockedMetaIcon || showFolderMetaIcon ? (
            <div className="flex items-center gap-[calc(var(--base)*0.2)] shrink-0">
              {showLockedMetaIcon && (
                <Locked
                  className="[&.locked]:static [&_.tooltip]:top-[calc(var(--base)*-0.5)]"
                  user={user}
                />
              )}
              {showFolderMetaIcon && config.folders && !isTrashed && (
                <MoveDocToFolder
                  folderCollectionSlug={config.folders.slug}
                  folderFieldName={config.folders.fieldName}
                />
              )}
            </div>
          ) : null}
          <ul
            className={cn(
              'grow flex list-none p-0 gap-(--base) m-0 w-full [&_button]:m-0',
              'max-lg:w-auto max-lg:gap-[calc(var(--base)/2)]',
            )}
          >
            {collectionConfig && !isEditing && !isAccountView && (
              <li className="flex items-center m-0">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap m-0 font-semibold leading-[calc(var(--base)*1.2)]">
                  {i18n.t('general:creatingNewLabel', {
                    label: getTranslation(
                      collectionConfig?.labels?.singular ?? i18n.t('general:document'),
                      i18n,
                    ),
                  })}
                </p>
              </li>
            )}
            {(collectionConfig?.versions?.drafts || globalConfig?.versions?.drafts) && (
              <Fragment>
                {(globalConfig || (collectionConfig && isEditing)) && (
                  <li className="flex items-center m-0">
                    <Status />
                  </li>
                )}
                {hasSavePermission &&
                  autosaveEnabled &&
                  !unsavedDraftWithValidations &&
                  !isTrashed && (
                    <li className="flex items-center m-0">
                      <Autosave
                        collection={collectionConfig}
                        global={globalConfig}
                        id={id}
                        publishedDocUpdatedAt={data?.createdAt}
                      />
                    </li>
                  )}
              </Fragment>
            )}
            {collectionConfig?.timestamps && (isEditing || isAccountView) && (
              <Fragment>
                <li
                  className="flex items-center m-0 overflow-hidden"
                  title={data?.updatedAt ? updatedAt : ''}
                >
                  <p className="text-muted-foreground whitespace-nowrap m-0">
                    {i18n.t(isTrashed ? 'general:deleted' : 'general:lastModified')}:&nbsp;
                  </p>
                  {data?.updatedAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap m-0 font-semibold leading-[calc(var(--base)*1.2)]">
                      {updatedAt}
                    </p>
                  )}
                </li>
                <li
                  className="flex items-center m-0 overflow-hidden"
                  title={data?.createdAt ? createdAt : ''}
                >
                  <p className="text-muted-foreground whitespace-nowrap m-0">
                    {i18n.t('general:created')}:&nbsp;
                  </p>
                  {data?.createdAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap m-0 font-semibold leading-[calc(var(--base)*1.2)]">
                      {createdAt}
                    </p>
                  )}
                </li>
              </Fragment>
            )}
          </ul>
        </div>
        <div
          className={cn(
            'flex items-center m-0 gap-[calc(var(--base)/2)] relative',
            'max-lg:bg-background max-lg:w-full max-lg:translate-z-0',
            'max-lg:pr-(--gutter-h) max-lg:justify-between',
            'max-lg:h-(--doc-controls-height) max-lg:border-t max-lg:border-border',
          )}
        >
          <div
            className={cn(
              'flex items-center m-0 gap-[calc(var(--base)/2)] [&_button]:m-0 [&_button]:whitespace-nowrap',
              'max-lg:ltr:pl-(--gutter-h) max-lg:overflow-auto max-lg:scrollbar-hide',
            )}
          >
            {BeforeDocumentControls}
            {isLivePreviewEnabled && !isInDrawer && <LivePreviewToggler />}
            {(collectionConfig?.admin.preview || globalConfig?.admin.preview) && (
              <RenderCustomComponent
                CustomComponent={CustomPreviewButton}
                Fallback={<PreviewButton />}
              />
            )}
            {hasSavePermission && !isTrashed && (
              <Fragment>
                {collectionConfig?.versions?.drafts || globalConfig?.versions?.drafts ? (
                  <Fragment>
                    {(unsavedDraftWithValidations ||
                      !autosaveEnabled ||
                      (autosaveEnabled && showSaveDraftButton)) && (
                      <RenderCustomComponent
                        CustomComponent={CustomSaveDraftButton}
                        Fallback={<SaveDraftButton />}
                      />
                    )}
                    <RenderCustomComponent
                      CustomComponent={CustomPublishButton}
                      Fallback={<PublishButton />}
                    />
                  </Fragment>
                ) : (
                  <RenderCustomComponent
                    CustomComponent={CustomSaveButton}
                    Fallback={<SaveButton />}
                  />
                )}
              </Fragment>
            )}
            {hasDeletePermission && isTrashed && (
              <PermanentlyDeleteButton
                buttonId="action-permanently-delete"
                collectionSlug={collectionConfig?.slug}
                id={id.toString()}
                onDelete={onDelete}
                redirectAfterDelete={redirectAfterDelete}
                singularLabel={collectionConfig?.labels?.singular}
              />
            )}
            {hasSavePermission && isTrashed && (
              <RestoreButton
                buttonId="action-restore"
                collectionSlug={collectionConfig?.slug}
                id={id.toString()}
                onRestore={onRestore}
                redirectAfterRestore={redirectAfterRestore}
                singularLabel={collectionConfig?.labels?.singular}
              />
            )}
            {user && readOnlyForIncomingUser && (
              <Button
                buttonStyle="secondary"
                id="take-over"
                onClick={onTakeOver}
                size="medium"
                type="button"
              >
                {t('general:takeOver')}
              </Button>
            )}
          </div>
          {showDotMenu && !readOnlyForIncomingUser && (
            <Popup
              button={
                <div
                  className={cn(
                    'm-0 flex items-center justify-center flex-col gap-0.5',
                    'border border-border rounded-md',
                    'size-[calc(var(--base)*1.6)]',
                    'hover:border-muted-foreground hover:bg-muted',
                    '[&>div]:size-[3px] [&>div]:rounded-full [&>div]:bg-current',
                  )}
                >
                  <div />
                  <div />
                  <div />
                </div>
              }
              className="relative [&_.popup__trigger-wrap]:flex"
              disabled={initializing || processing}
              horizontalAlign="right"
              size="large"
              verticalAlign="bottom"
            >
              <PopupList.ButtonGroup>
                {showCopyToLocale && <CopyLocaleData />}
                {hasCreatePermission && (
                  <React.Fragment>
                    {!disableCreate && (
                      <Fragment>
                        {editDepth > 1 ? (
                          <PopupList.Button id="action-create" onClick={onDrawerCreateNew}>
                            {i18n.t('general:createNew')}
                          </PopupList.Button>
                        ) : (
                          <PopupList.Button
                            href={formatAdminURL({
                              adminRoute,
                              path: `/collections/${collectionConfig?.slug}/create`,
                            })}
                            id="action-create"
                          >
                            {i18n.t('general:createNew')}
                          </PopupList.Button>
                        )}
                      </Fragment>
                    )}
                    {collectionConfig.disableDuplicate !== true && isEditing && (
                      <>
                        <DuplicateDocument
                          id={id}
                          onDuplicate={onDuplicate}
                          redirectAfterDuplicate={redirectAfterDuplicate}
                          singularLabel={collectionConfig?.labels?.singular}
                          slug={collectionConfig?.slug}
                        />
                        {localization && (
                          <DuplicateDocument
                            id={id}
                            onDuplicate={onDuplicate}
                            redirectAfterDuplicate={redirectAfterDuplicate}
                            selectLocales={true}
                            singularLabel={collectionConfig?.labels?.singular}
                            slug={collectionConfig?.slug}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                )}
                {hasDeletePermission && (
                  <DeleteDocument
                    buttonId="action-delete"
                    collectionSlug={collectionConfig?.slug}
                    id={id.toString()}
                    onDelete={onDelete}
                    redirectAfterDelete={redirectAfterDelete}
                    singularLabel={collectionConfig?.labels?.singular}
                    useAsTitle={collectionConfig?.admin?.useAsTitle}
                  />
                )}
                {EditMenuItems}
              </PopupList.ButtonGroup>
            </Popup>
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="absolute h-px bg-border w-full left-0 top-full" />
    </Gutter>
  )
}
