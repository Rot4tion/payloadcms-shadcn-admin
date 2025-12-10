'use client'
import type { ClientCollectionConfig, Data, DefaultDocumentIDType, Operation } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import type { DocumentDrawerProps } from '../DocumentDrawer/types'
import type { Props } from './types'

import { useRelatedCollections } from '../../hooks/useRelatedCollections'
import { PlusIcon } from '../../icons/Plus'
import { useAuth } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../Button'
import { useDocumentDrawer } from '../DocumentDrawer'
import { Popup } from '../Popup'
import * as PopupList from '../Popup/PopupButtonList'
import { Tooltip } from '../Tooltip'
import { cn } from '@/lib/utils'

export const AddNewRelation: React.FC<Props> = ({
  Button: ButtonFromProps,
  hasMany,
  onChange,
  path,
  relationTo,
  unstyled,
  value,
}) => {
  const relatedCollections = useRelatedCollections(relationTo)
  const { permissions } = useAuth()
  const [show, setShow] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<string>()

  const relatedToMany = relatedCollections.length > 1

  const [collectionConfig, setCollectionConfig] = useState<ClientCollectionConfig | undefined>(
    () => (!relatedToMany ? relatedCollections[0] : undefined),
  )

  const [popupOpen, setPopupOpen] = useState(false)
  const { i18n, t } = useTranslation()
  const [showTooltip, setShowTooltip] = useState(false)

  const [DocumentDrawer, DocumentDrawerToggler, { isDrawerOpen, toggleDrawer }] = useDocumentDrawer(
    {
      collectionSlug: collectionConfig?.slug!,
    },
  )

  const onSave: DocumentDrawerProps['onSave'] = useCallback(
    ({ doc, operation }: { doc: Data; operation: Operation }) => {
      // if autosave is enabled, the operation will be 'update'
      const isAutosaveEnabled =
        typeof collectionConfig?.versions?.drafts === 'object'
          ? collectionConfig.versions.drafts.autosave
          : false

      if (operation === 'create' || (operation === 'update' && isAutosaveEnabled)) {
        // ensure the value is not already in the array
        let isNewValue = false
        if (!value) {
          isNewValue = true
        } else {
          isNewValue = Array.isArray(value)
            ? !value.some((v) => v && v.value === doc.id)
            : value.value !== doc.id
        }

        if (isNewValue) {
          if (hasMany === true) {
            onChange([
              ...(Array.isArray(value) ? value : []),
              {
                relationTo: collectionConfig!.slug,
                value: doc.id,
              },
            ])
          } else {
            onChange({
              relationTo: relatedCollections[0]!.slug,
              value: doc.id,
            })
          }
        }

        setSelectedCollection(undefined)
      }
    },
    [collectionConfig, hasMany, onChange, value, relatedCollections],
  )

  const onPopupToggle = useCallback((state: boolean) => {
    setPopupOpen(state)
  }, [])

  useEffect(() => {
    if (permissions) {
      if (relatedCollections.length === 1) {
        setShow(permissions.collections?.[relatedCollections[0]?.slug]?.create ?? false)
      } else {
        setShow(
          relatedCollections.some(
            (collection) => permissions.collections?.[collection?.slug]?.create,
          ),
        )
      }
    }
  }, [permissions, relatedCollections])

  useEffect(() => {
    if (relatedToMany && selectedCollection) {
      setCollectionConfig(
        relatedCollections.find((collection) => collection?.slug === selectedCollection),
      )
    }
  }, [selectedCollection, relatedToMany, relatedCollections])

  useEffect(() => {
    if (relatedToMany && collectionConfig) {
      // the drawer must be rendered on the page before before opening it
      // this is why 'selectedCollection' is different from 'collectionConfig'
      toggleDrawer()
      setSelectedCollection(undefined)
    }
  }, [toggleDrawer, relatedToMany, collectionConfig])

  useEffect(() => {
    if (relatedToMany && !isDrawerOpen) {
      setCollectionConfig(undefined)
    }
  }, [isDrawerOpen, relatedToMany])

  const label = t('fields:addNewLabel', {
    label: getTranslation(relatedCollections[0]?.labels.singular, i18n),
  })

  if (!show) {
    return null
  }

  // Add button styles
  const addButtonClass = cn(
    'm-0 rounded-l-none relative h-full -ml-px flex items-center cursor-pointer',
    'px-[calc(var(--base)*0.5)]',
    !unstyled && 'border border-input bg-background',
  )

  return (
    <div
      className="flex items-stretch [&_.popup__trigger-wrap]:flex [&_.popup__trigger-wrap]:items-stretch [&_.popup__trigger-wrap]:h-full"
      id={`${path}-add-new`}
    >
      {relatedCollections.length === 1 && (
        <Fragment>
          <DocumentDrawerToggler
            className={addButtonClass}
            onClick={() => {
              setShowTooltip(false)
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {ButtonFromProps ? (
              ButtonFromProps
            ) : (
              <Fragment>
                <Tooltip show={showTooltip}>{label}</Tooltip>
                <PlusIcon />
              </Fragment>
            )}
          </DocumentDrawerToggler>
          <DocumentDrawer onSave={onSave} />
        </Fragment>
      )}
      {relatedCollections.length > 1 && (
        <Fragment>
          <Popup
            button={
              ButtonFromProps ? (
                ButtonFromProps
              ) : (
                <Button
                  buttonStyle="none"
                  className={addButtonClass}
                  tooltip={popupOpen ? undefined : t('fields:addNew')}
                >
                  <PlusIcon />
                </Button>
              )
            }
            buttonType="custom"
            horizontalAlign="center"
            onToggleOpen={onPopupToggle}
            render={({ close: closePopup }) => (
              <PopupList.ButtonGroup>
                {relatedCollections.map((relatedCollection) => {
                  if (permissions?.collections?.[relatedCollection?.slug]?.create) {
                    return (
                      <PopupList.Button
                        key={relatedCollection?.slug}
                        onClick={() => {
                          closePopup()
                          setSelectedCollection(relatedCollection?.slug)
                        }}
                      >
                        {getTranslation(relatedCollection?.labels?.singular, i18n)}
                      </PopupList.Button>
                    )
                  }

                  return null
                })}
              </PopupList.ButtonGroup>
            )}
            size="medium"
          />
          {collectionConfig && permissions?.collections?.[collectionConfig?.slug]?.create && (
            <DocumentDrawer onSave={onSave} />
          )}
        </Fragment>
      )}
    </div>
  )
}
