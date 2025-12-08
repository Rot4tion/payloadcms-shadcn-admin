// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { SanitizedCollectionConfig } from 'payload'

import { useModal } from '../Modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment, useCallback, useState } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerContextType } from '../DocumentDrawer/Provider'

import { CheckboxInput } from '../../fields/Checkbox/Input'
import { useForm } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { useDocumentTitle } from '../../providers/DocumentTitle'
import { useRouteTransition } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { requests } from '../../utilities/api'
import { ConfirmationModal } from '../ConfirmationModal'
import { PopupList } from '../Popup'
import { Translation } from '../Translation'

export type Props = {
  readonly buttonId?: string
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  readonly id?: string
  readonly onDelete?: DocumentDrawerContextType['onDelete']
  readonly redirectAfterDelete?: boolean
  readonly singularLabel: SanitizedCollectionConfig['labels']['singular']
  readonly title?: string
  readonly useAsTitle: SanitizedCollectionConfig['admin']['useAsTitle']
}

export const DeleteDocument: React.FC<Props> = (props) => {
  const {
    id,
    buttonId,
    collectionSlug,
    onDelete,
    redirectAfterDelete = true,
    singularLabel,
    title: titleFromProps,
  } = props

  const {
    config: {
      routes: { admin: adminRoute, api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { setModified } = useForm()
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const { title } = useDocumentTitle()
  const { startRouteTransition } = useRouteTransition()
  const { openModal } = useModal()

  const modalSlug = `delete-${id}`

  const [deletePermanently, setDeletePermanently] = useState(false)

  const addDefaultError = useCallback(() => {
    toast.error(t('error:deletingTitle', { title }))
  }, [t, title])

  const handleDelete = useCallback(async () => {
    setModified(false)

    try {
      const res =
        deletePermanently || !collectionConfig.trash
          ? await requests.delete(`${serverURL}${api}/${collectionSlug}/${id}`, {
              headers: {
                'Accept-Language': i18n.language,
                'Content-Type': 'application/json',
              },
            })
          : await requests.patch(`${serverURL}${api}/${collectionSlug}/${id}`, {
              body: JSON.stringify({
                deletedAt: new Date().toISOString(),
              }),
              headers: {
                'Accept-Language': i18n.language,
                'Content-Type': 'application/json',
              },
            })

      const json = await res.json()

      if (res.status < 400) {
        toast.success(
          t(
            deletePermanently || !collectionConfig.trash
              ? 'general:titleDeleted'
              : 'general:titleTrashed',
            {
              label: getTranslation(singularLabel, i18n),
              title,
            },
          ) || json.message,
        )

        if (redirectAfterDelete) {
          return startRouteTransition(() =>
            router.push(
              formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}`,
              }),
            ),
          )
        }

        if (typeof onDelete === 'function') {
          await onDelete({ id, collectionConfig })
        }

        return
      }

      if (json.errors) {
        json.errors.forEach((error) => toast.error(error.message))
      } else {
        addDefaultError()
      }

      return
    } catch (_err) {
      return addDefaultError()
    }
  }, [
    deletePermanently,
    setModified,
    serverURL,
    api,
    collectionSlug,
    id,
    t,
    singularLabel,
    addDefaultError,
    i18n,
    title,
    router,
    adminRoute,
    redirectAfterDelete,
    onDelete,
    collectionConfig,
    startRouteTransition,
  ])

  if (id) {
    return (
      <Fragment>
        <PopupList.Button
          id={buttonId}
          onClick={() => {
            openModal(modalSlug)
          }}
        >
          {t('general:delete')}
        </PopupList.Button>
        <ConfirmationModal
          body={
            <Fragment>
              <Translation
                elements={{
                  '1': ({ children }) => <strong>{children}</strong>,
                }}
                i18nKey={collectionConfig.trash ? 'general:aboutToTrash' : 'general:aboutToDelete'}
                t={t}
                variables={{
                  label: getTranslation(singularLabel, i18n),
                  title: titleFromProps || title || id,
                }}
              />
              {collectionConfig.trash && (
                <div className="py-[calc(var(--base)*0.5)] [&_.checkbox-input_label]:pb-0">
                  <CheckboxInput
                    checked={deletePermanently}
                    id="delete-forever"
                    label={t('general:deletePermanently')}
                    name="delete-forever"
                    onToggle={(e) => setDeletePermanently(e.target.checked)}
                  />
                </div>
              )}
            </Fragment>
          }
          className="backdrop-blur-sm bg-background/80 flex items-center justify-center h-full"
          confirmingLabel={t('general:deleting')}
          heading={t('general:confirmDeletion')}
          modalSlug={modalSlug}
          onConfirm={handleDelete}
        />
      </Fragment>
    )
  }

  return null
}
