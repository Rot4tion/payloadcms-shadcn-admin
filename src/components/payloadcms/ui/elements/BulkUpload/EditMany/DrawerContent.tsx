'use client'

import type { ClientCollectionConfig, SelectType } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { unflatten } from 'payload/shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../Modal'

import type { FormProps } from '../../../forms/Form'
import type { OnFieldSelect } from '../../FieldSelect'
import type { FieldOption } from '../../FieldSelect/reduceFieldOptions'
import type { State } from '../FormsManager/reducer'
import type { EditManyBulkUploadsProps } from '.'

import { Button } from '@/components/ui/button'
import { useAuth, useServerFunctions, useTranslation } from '@payloadcms/ui'
import { XIcon } from 'lucide-react'
import { Form } from '../../../forms/Form'
import { RenderField } from '../../../forms/RenderFields/RenderField'
import { FieldPathContext } from '../../../forms/RenderFields/context'
import { abortAndIgnore, handleAbortRef } from '../../../utilities/abortAndIgnore'
import { FieldSelect } from '../../FieldSelect'
import { useFormsManager } from '../FormsManager'

export const EditManyBulkUploadsDrawerContent: React.FC<
  {
    collection: ClientCollectionConfig
    drawerSlug: string
    forms: State['forms']
  } & EditManyBulkUploadsProps
> = (props) => {
  const {
    // @ts-expect-error
    collection: { fields, labels: { plural, singular } } = {},
    collection,
    drawerSlug,
    forms,
  } = props

  const [isInitializing, setIsInitializing] = useState(false)
  const { permissions } = useAuth()
  const { i18n, t } = useTranslation()
  const { closeModal } = useModal()
  const { bulkUpdateForm } = useFormsManager()
  const { getFormState } = useServerFunctions()
  const abortFormStateRef = React.useRef<AbortController>(null)

  const [selectedFields, setSelectedFields] = useState<FieldOption[]>([])
  const collectionPermissions = permissions?.collections?.[collection.slug]!

  const select = useMemo<SelectType>(() => {
    return unflatten(
      selectedFields.reduce((acc, option) => {
        acc[option.value.path] = true
        return acc
      }, {} as SelectType),
    )
  }, [selectedFields])

  // @ts-expect-error
  const onChange: FormProps['onChange'][0] = useCallback(
    async ({ formState: prevFormState, submitted }: any) => {
      const controller = handleAbortRef(abortFormStateRef)

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        // @ts-expect-error
        docPreferences: null,
        formState: prevFormState,
        operation: 'update',
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
      abortAndIgnore(abortFormState!)
    }
  }, [])

  const handleSubmit: FormProps['onSubmit'] = useCallback(
    (formState: any) => {
      const pairedData = selectedFields.reduce((acc, option) => {
        if (formState[option.value.path]) {
          acc[option.value.path] = formState[option.value.path].value
        }
        return acc
      }, {} as any)

      void bulkUpdateForm(pairedData, () => closeModal(drawerSlug))
    },
    [closeModal, drawerSlug, bulkUpdateForm, selectedFields],
  )

  const onFieldSelect = useCallback<OnFieldSelect>(
    async ({ dispatchFields, formState, selected }) => {
      setIsInitializing(true)

      setSelectedFields(selected || [])

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        // @ts-expect-error
        docPreferences: null,
        formState,
        operation: 'update',
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
        formState: state!,
      })

      setIsInitializing(false)
    },
    [getFormState, collection, collectionPermissions],
  )

  return (
    <div className="w-[calc(100%-var(--base)*15)] flex flex-col min-h-full max-lg:w-full max-lg:min-h-0">
      <div className="flex mt-[calc(var(--base)*2.5)] mb-(--base) w-full">
        <h2 className="m-0 grow">
          {t('general:editingLabel', {
            count: forms.length,
            label: getTranslation(forms.length > 1 ? plural : singular, i18n),
          })}
        </h2>
        <Button
          aria-label={t('general:close')}
          variant="ghost"
          size="icon-sm"
          id={`close-drawer__${drawerSlug}`}
          onClick={() => closeModal(drawerSlug)}
          type="button"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <Form
        className="h-full"
        isInitializing={isInitializing}
        onChange={[onChange]}
        onSubmit={handleSubmit}
      >
        <FieldSelect
          fields={fields!}
          onChange={onFieldSelect}
          permissions={collectionPermissions.fields}
        />
        {selectedFields.length === 0 ? null : (
          <div className="render-fields">
            {/* @ts-expect-error */}
            <FieldPathContext value={undefined}>
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
            </FieldPathContext>
          </div>
        )}
        <div className="fixed w-[calc(var(--base)*15)] h-full top-0 right-0 overflow-visible border-l border-border max-lg:static max-lg:w-full max-lg:h-auto rtl:left-0 rtl:right-auto rtl:border-r rtl:border-l-0">
          <div className="w-full h-full overflow-y-auto">
            <div className="flex flex-col min-h-full">
              <div className="flex flex-wrap p-(--base) gap-[calc(var(--base)*0.5)] sticky top-0 z-[var(--z-nav)] max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:px-(--gutter-h)">
                <Button type="submit">{t('general:applyChanges')}</Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}
