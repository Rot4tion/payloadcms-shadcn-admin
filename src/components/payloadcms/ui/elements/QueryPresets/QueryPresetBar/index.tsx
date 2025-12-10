// @ts-nocheck payloadcms original type safe issue will fix later
import type { QueryPreset, SanitizedCollectionPermission } from 'payload'

import { useModal } from '../../Modal'
import { getTranslation } from '@payloadcms/translations'
import { transformColumnsToPreferences, transformColumnsToSearchParams } from 'payload/shared'
import React, { Fragment, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import { PlusIcon } from '../../../icons/Plus'
import { useConfig } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { ConfirmationModal } from '../../ConfirmationModal'
import { useDocumentDrawer } from '../../DocumentDrawer'
import { useListDrawer } from '../../ListDrawer'
import { ListSelectionButton } from '../../ListSelection'
import { Pill } from '../../Pill'
import { Translation } from '../../Translation'
import { QueryPresetToggler } from '../QueryPresetToggler'
import { cn } from '@/lib/utils'

const confirmDeletePresetModalSlug = 'confirm-delete-preset'

const queryPresetsSlug = 'payload-query-presets'

export const QueryPresetBar: React.FC<{
  activePreset: QueryPreset
  collectionSlug?: string
  queryPresetPermissions: SanitizedCollectionPermission
}> = ({ activePreset, collectionSlug, queryPresetPermissions }) => {
  const { modified, query, refineListData, setModified: setQueryModified } = useListQuery()

  const { i18n, t } = useTranslation()
  const { openModal } = useModal()

  const {
    config: {
      routes: { api: apiRoute },
    },
    getEntityConfig,
  } = useConfig()

  const presetConfig = getEntityConfig({ collectionSlug: queryPresetsSlug })

  const [PresetDocumentDrawer, , { openDrawer: openDocumentDrawer }] = useDocumentDrawer({
    id: activePreset?.id,
    collectionSlug: queryPresetsSlug,
  })

  const [
    CreateNewPresetDrawer,
    ,
    { closeDrawer: closeCreateNewDrawer, openDrawer: openCreateNewDrawer },
  ] = useDocumentDrawer({
    collectionSlug: queryPresetsSlug,
  })

  const filterOptions = useMemo(
    () => ({
      'payload-query-presets': {
        isTemp: {
          not_equals: true,
        },
        relatedCollection: {
          equals: collectionSlug,
        },
      },
    }),
    [collectionSlug],
  )

  const [ListDrawer, , { closeDrawer: closeListDrawer, openDrawer: openListDrawer }] =
    useListDrawer({
      collectionSlugs: [queryPresetsSlug],
      filterOptions,
      selectedCollection: queryPresetsSlug,
    })

  const handlePresetChange = useCallback(
    async (preset: QueryPreset) => {
      await refineListData(
        {
          columns: preset.columns ? transformColumnsToSearchParams(preset.columns) : undefined,
          preset: preset.id,
          where: preset.where,
        },
        false,
      )
    },
    [refineListData],
  )

  const resetQueryPreset = useCallback(async () => {
    await refineListData(
      {
        columns: [],
        preset: '',
        where: {},
      },
      false,
    )
  }, [refineListData])

  const handleDeletePreset = useCallback(async () => {
    try {
      await fetch(`${apiRoute}/${queryPresetsSlug}/${activePreset.id}`, {
        method: 'DELETE',
      }).then(async (res) => {
        try {
          const json = await res.json()

          if (res.status < 400) {
            toast.success(
              t('general:titleDeleted', {
                label: getTranslation(presetConfig?.labels?.singular, i18n),
                title: activePreset.title,
              }),
            )

            await resetQueryPreset()
          } else {
            if (json.errors) {
              json.errors.forEach((error) => toast.error(error.message))
            } else {
              toast.error(t('error:deletingTitle', { title: activePreset.title }))
            }
          }
        } catch (_err) {
          toast.error(t('error:deletingTitle', { title: activePreset.title }))
        }
      })
    } catch (_err) {
      toast.error(t('error:deletingTitle', { title: activePreset.title }))
    }
  }, [apiRoute, activePreset?.id, activePreset?.title, t, presetConfig, i18n, resetQueryPreset])

  const saveCurrentChanges = useCallback(async () => {
    try {
      await fetch(`${apiRoute}/payload-query-presets/${activePreset.id}`, {
        body: JSON.stringify({
          columns: transformColumnsToPreferences(query.columns),
          where: query.where,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      }).then(async (res) => {
        try {
          const json = await res.json()

          if (res.status < 400) {
            toast.success(
              t('general:updatedLabelSuccessfully', {
                label: getTranslation(presetConfig?.labels?.singular, i18n),
              }),
            )

            setQueryModified(false)
          } else {
            if (json.errors) {
              json.errors.forEach((error) => toast.error(error.message))
            } else {
              toast.error(t('error:unknown'))
            }
          }
        } catch (_err) {
          toast.error(t('error:unknown'))
        }
      })
    } catch (_err) {
      toast.error(t('error:unknown'))
    }
  }, [
    apiRoute,
    activePreset?.id,
    query.columns,
    query.where,
    t,
    presetConfig?.labels?.singular,
    i18n,
    setQueryModified,
  ])

  const hasModifiedPreset = activePreset && modified

  return (
    <Fragment>
      <div className="flex gap-[calc(var(--base)*0.5)] justify-between bg-muted/50 rounded-md p-[calc(var(--base)*0.5)]">
        <div className="flex items-center gap-1 grow">
          <QueryPresetToggler
            activePreset={activePreset}
            openPresetListDrawer={openListDrawer}
            resetPreset={resetQueryPreset}
          />
          <Pill
            aria-label={t('general:newLabel', { label: presetConfig?.labels?.singular })}
            className="h-full px-[3px] bg-transparent shadow-[inset_0_0_0_1px_var(--theme-elevation-150)] hover:bg-transparent"
            icon={<PlusIcon />}
            id="create-new-preset"
            onClick={() => {
              openCreateNewDrawer()
            }}
            size="small"
          />
        </div>
        <div className="overflow-auto flex gap-[calc(var(--base)*0.5)] [&_button]:text-muted-foreground [&_button]:m-0">
          {hasModifiedPreset && (
            <ListSelectionButton
              id="reset-preset"
              key="reset"
              onClick={async () => {
                await refineListData(
                  {
                    columns: transformColumnsToSearchParams(activePreset.columns),
                    where: activePreset.where,
                  },
                  false,
                )
              }}
              type="button"
            >
              {t('general:reset')}
            </ListSelectionButton>
          )}
          {hasModifiedPreset && queryPresetPermissions.update && (
            <ListSelectionButton
              id="save-preset"
              key="save"
              onClick={async () => {
                await saveCurrentChanges()
              }}
              type="button"
            >
              {activePreset?.isShared ? t('general:updateForEveryone') : t('fields:saveChanges')}
            </ListSelectionButton>
          )}
          {activePreset && queryPresetPermissions?.delete && (
            <Fragment>
              <ListSelectionButton
                id="delete-preset"
                onClick={() => openModal(confirmDeletePresetModalSlug)}
                type="button"
              >
                {t('general:deleteLabel', { label: presetConfig?.labels?.singular })}
              </ListSelectionButton>
              <ListSelectionButton
                id="edit-preset"
                onClick={() => {
                  openDocumentDrawer()
                }}
                type="button"
              >
                {t('general:editLabel', { label: presetConfig?.labels?.singular })}
              </ListSelectionButton>
            </Fragment>
          )}
        </div>
      </div>
      <CreateNewPresetDrawer
        initialData={{
          columns: transformColumnsToPreferences(query.columns),
          relatedCollection: collectionSlug,
          where: query.where,
        }}
        onSave={async ({ doc }) => {
          closeCreateNewDrawer()
          await handlePresetChange(doc as QueryPreset)
        }}
        redirectAfterCreate={false}
      />
      <ConfirmationModal
        body={
          <Translation
            elements={{
              '1': ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="general:aboutToDelete"
            t={t}
            variables={{
              label: presetConfig?.labels?.singular,
              title: activePreset?.title,
            }}
          />
        }
        confirmingLabel={t('general:deleting')}
        heading={t('general:confirmDeletion')}
        modalSlug={confirmDeletePresetModalSlug}
        onConfirm={handleDeletePreset}
      />
      <PresetDocumentDrawer
        onDelete={() => {
          // setSelectedPreset(undefined)
        }}
        onDuplicate={async ({ doc }) => {
          await handlePresetChange(doc as QueryPreset)
        }}
        onSave={async ({ doc }) => {
          await handlePresetChange(doc as QueryPreset)
        }}
      />
      <ListDrawer
        allowCreate={false}
        disableQueryPresets
        onSelect={async ({ doc }) => {
          closeListDrawer()
          await handlePresetChange(doc as QueryPreset)
        }}
      />
    </Fragment>
  )
}
