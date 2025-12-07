'use client'

import type { SelectType, Where } from 'payload'

import { cn } from '@/lib/utils'
import { useModal } from '../Modal/index.js'
import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import { combineWhereConstraints, mergeListSearchAndWhere, unflatten } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { FormProps } from '../../forms/Form/index.js'
import type { OnFieldSelect } from '../FieldSelect/index.js'
import type { FieldOption } from '../FieldSelect/reduceFieldOptions.js'

import { useForm } from '@payloadcms/ui'
import { Form } from '../../forms/Form/index.js'
import { RenderField } from '../../forms/RenderFields/RenderField.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { XIcon } from '../../icons/X/index.js'
import { useAuth } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { DocumentInfoProvider } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'

import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useServerFunctions } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { FieldSelect } from '../FieldSelect/index.js'
import type { EditManyProps } from './index.js'
import { OperationContext } from '@payloadcms/ui/providers/Operation'

const Submit: React.FC<{
  readonly action: string
  readonly disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit
      className="w-[calc(50%-var(--base))] max-lg:w-full"
      disabled={disabled}
      onClick={save}
    >
      {t('general:save')}
    </FormSubmit>
  )
}

const PublishButton: React.FC<{
  action: string
  disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'published',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className="w-full" disabled={disabled} onClick={save}>
      {t('version:publishChanges')}
    </FormSubmit>
  )
}

const SaveDraftButton: React.FC<{
  action: string
  disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit buttonStyle="secondary" className="w-full" disabled={disabled} onClick={save}>
      {t('version:saveDraft')}
    </FormSubmit>
  )
}

type EditManyDrawerContentProps = {
  /**
   * The total count of selected items
   */
  count?: number
  /**
   * The slug of the drawer
   */
  drawerSlug: string
  /**
   * The IDs of the selected items
   */
  ids?: (number | string)[]
  /**
   * The function to call after a successful action
   */
  onSuccess?: () => void
  /**
   * Whether all items are selected
   */
  selectAll?: boolean
  /**
   * The fields that are selected to bulk edit
   */
  selectedFields: FieldOption[]
  /**
   * The function to set the selected fields to bulk edit
   */
  setSelectedFields: (fields: FieldOption[]) => void
  where?: Where
} & EditManyProps

export const EditManyDrawerContent: React.FC<EditManyDrawerContentProps> = (props) => {
  const {
    collection,
    collection: { fields, labels: { plural, singular } } = {},
    count,
    drawerSlug,
    ids,
    onSuccess: onSuccessFromProps,
    selectAll,
    selectedFields,
    setSelectedFields,
    where,
  } = props

  const { permissions, user } = useAuth()
  const { code: locale } = useLocale()

  const { closeModal } = useModal()

  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const { getFormState } = useServerFunctions()

  const { i18n, t } = useTranslation()

  const [isInitializing, setIsInitializing] = useState(false)

  const router = useRouter()
  const abortFormStateRef = React.useRef<AbortController>(null)
  const { clearRouteCache } = useRouteCache()
  const collectionPermissions = permissions?.collections?.[collection.slug]
  const searchParams = useSearchParams()

  const select = useMemo<SelectType>(() => {
    return unflatten(
      selectedFields.reduce((acc, option) => {
        acc[option.value.path] = true
        return acc
      }, {} as SelectType),
    )
  }, [selectedFields])

  const onChange: FormProps['onChange'][0] = useCallback(
    async ({ formState: prevFormState, submitted }) => {
      const controller = handleAbortRef(abortFormStateRef)

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState: prevFormState,
        operation: 'update',
        renderAllFields: true,
        schemaPath: collection.slug,
        select,
        signal: controller.signal,
        skipValidation: !submitted,
      })

      abortFormStateRef.current = null

      return state
    },
    [getFormState, collection, collectionPermissions, select],
  )

  useEffect(() => {
    const abortFormState = abortFormStateRef.current

    return () => {
      abortAndIgnore(abortFormState)
    }
  }, [])

  const queryString = useMemo((): string => {
    const whereConstraints: Where[] = []

    if (where) {
      whereConstraints.push(where)
    }

    const queryWithSearch = mergeListSearchAndWhere({
      collectionConfig: collection,
      search: searchParams.get('search'),
    })

    if (queryWithSearch) {
      whereConstraints.push(queryWithSearch)
    }

    if (selectAll) {
      // Match the current filter/search, or default to all docs
      whereConstraints.push(
        (parseSearchParams(searchParams)?.where as Where) || {
          id: {
            not_equals: '',
          },
        },
      )
    } else {
      // If we're not selecting all, we need to select specific docs
      whereConstraints.push({
        id: {
          in: ids || [],
        },
      })
    }

    return qs.stringify(
      {
        locale,
        select: {},
        where: combineWhereConstraints(whereConstraints),
      },
      { addQueryPrefix: true },
    )
  }, [collection, searchParams, selectAll, ids, locale, where])

  const onSuccess = () => {
    router.replace(
      qs.stringify(
        {
          ...parseSearchParams(searchParams),
          page: selectAll ? '1' : undefined,
        },
        { addQueryPrefix: true },
      ),
    )
    clearRouteCache()
    closeModal(drawerSlug)

    if (typeof onSuccessFromProps === 'function') {
      onSuccessFromProps()
    }
  }

  const onFieldSelect = useCallback<OnFieldSelect>(
    async ({ dispatchFields, formState, selected }) => {
      setIsInitializing(true)

      setSelectedFields(selected || [])

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState,
        operation: 'update',
        renderAllFields: true,
        schemaPath: collection.slug,
        select: unflatten(
          selected.reduce((acc, option) => {
            acc[option.value.path] = true
            return acc
          }, {} as SelectType),
        ),
        skipValidation: true,
      })

      dispatchFields({
        type: 'UPDATE_MANY',
        formState: state,
      })

      setIsInitializing(false)
    },
    [getFormState, collection.slug, collectionPermissions, setSelectedFields],
  )

  return (
    <DocumentInfoProvider
      collectionSlug={collection.slug}
      currentEditor={user}
      hasPublishedDoc={false}
      id={null}
      initialData={{}}
      isLocked={false}
      lastUpdateTime={0}
      mostRecentVersionIsAutosaved={false}
      unpublishedVersionCount={0}
      versionCount={0}
    >
      <OperationContext value="update">
        <div className="flex w-[calc(100%-var(--base)*15)] flex-col min-h-full max-lg:w-full max-lg:min-h-0">
          <div className="flex mt-[calc(var(--base)*2.5)] mb-(--base) w-full">
            <h2 className="m-0 grow">
              {t('general:editingLabel', {
                count,
                label: getTranslation(count > 1 ? plural : singular, i18n),
              })}
            </h2>
            <button
              aria-label={t('general:close')}
              className="border-0 bg-transparent p-0 cursor-pointer overflow-hidden size-(--base) [&_svg]:size-[calc(var(--base)*2)] [&_svg]:relative [&_svg]:start-[calc(var(--base)*-0.5)] [&_svg]:top-[calc(var(--base)*-0.5)]"
              id={`close-drawer__${drawerSlug}`}
              onClick={() => closeModal(drawerSlug)}
              type="button"
            >
              <XIcon />
            </button>
          </div>
          <Form
            className="h-full max-lg:block"
            isInitializing={isInitializing}
            onChange={[onChange]}
            onSuccess={onSuccess}
          >
            <FieldSelect
              fields={fields}
              onChange={onFieldSelect}
              permissions={collectionPermissions.fields}
            />
            {selectedFields.length === 0 || isInitializing ? null : (
              <div className="render-fields">
                {selectedFields.map((option, i) => {
                  const {
                    value: { field, fieldPermissions, path },
                  } = option

                  return (
                    <RenderField
                      clientFieldConfig={field}
                      indexPath=""
                      key={`${path}-${i}`}
                      parentPath=""
                      parentSchemaPath=""
                      path={path}
                      permissions={fieldPermissions}
                    />
                  )
                })}
              </div>
            )}
            <div
              className={cn(
                'fixed w-[calc(var(--base)*15)] h-full top-0 right-0 overflow-visible border-l border-border',
                'max-lg:static max-lg:w-full max-lg:h-auto',
                'rtl:left-0 rtl:right-auto rtl:border-l-0 rtl:border-r rtl:border-border',
              )}
            >
              <div className="w-full h-full overflow-y-auto">
                <div className="flex flex-col min-h-full">
                  <div
                    className={cn(
                      'flex p-(--base) gap-[calc(var(--base)*0.5)] sticky top-0 z-(--z-nav) *:relative *:z-1',
                      'max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:px-(--gutter-h) max-lg:backdrop-blur-sm max-lg:bg-background/80',
                      '[&_.form-submit]:w-full max-lg:[&_.form-submit]:w-auto max-lg:[&_.form-submit]:grow',
                      '[&_.form-submit_.btn]:px-[calc(var(--base)*0.5)] [&_.form-submit_.btn]:mb-0',
                    )}
                  >
                    {collection?.versions?.drafts ? (
                      <React.Fragment>
                        <SaveDraftButton
                          action={`${serverURL}${apiRoute}/${collection.slug}${queryString}&draft=true`}
                          disabled={selectedFields.length === 0}
                        />
                        <PublishButton
                          action={`${serverURL}${apiRoute}/${collection.slug}${queryString}&draft=true`}
                          disabled={selectedFields.length === 0}
                        />
                      </React.Fragment>
                    ) : (
                      <Submit
                        action={`${serverURL}${apiRoute}/${collection.slug}${queryString}`}
                        disabled={selectedFields.length === 0}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </OperationContext>
    </DocumentInfoProvider>
  )
}
