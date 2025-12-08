// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ClientField, Field, SanitizedCollectionConfig } from 'payload'

import React, { useMemo } from 'react'

import { SelectInput } from '../../fields/Select/Input'
import { useAuth } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { reduceFieldsToOptions } from '../../utilities/reduceFieldsToOptions'
import { ReactSelect } from '../ReactSelect/index'

export type Props = {
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  fields: ClientField[]
}

/**
 * Note: Some fields are already omitted from the list of fields:
 * - fields with nested field, e.g. `tabs`, `groups`, etc.
 * - fields that don't affect data, i.e. `row`, `collapsible`, `ui`, etc.
 * So we don't technically need to omit them here, but do anyway.
 * But some remaining fields still need an additional check, e.g. `richText`, etc.
 */
const supportedFieldTypes: Field['type'][] = [
  'text',
  'textarea',
  'number',
  'select',
  'relationship',
  'date',
  'checkbox',
  'radio',
  'email',
  'number',
  'upload',
]

export const GroupByBuilder: React.FC<Props> = ({ collectionSlug, fields }) => {
  const { i18n, t } = useTranslation()
  const { permissions } = useAuth()

  const fieldPermissions = permissions?.collections?.[collectionSlug]?.fields

  const reducedFields = useMemo(
    () =>
      reduceFieldsToOptions({
        fieldPermissions,
        fields,
        i18n,
      }),
    [fields, fieldPermissions, i18n],
  )

  const { query, refineListData } = useListQuery()

  const groupByFieldName = query.groupBy?.replace(/^-/, '')

  const groupByField = reducedFields.find((field) => field.value === groupByFieldName)

  return (
    <div className="bg-muted/50 p-(--base) flex flex-col gap-[calc(var(--base)/2)]">
      <div className="w-full flex justify-between">
        <p>
          {t('general:groupByLabel', {
            label: '',
          })}
        </p>
        {query.groupBy && (
          <button
            className="bg-transparent border-none text-muted-foreground leading-inherit cursor-pointer p-0 underline"
            id="group-by--reset"
            onClick={async () => {
              await refineListData({
                groupBy: '',
              })
            }}
            type="button"
          >
            {t('general:clear')}
          </button>
        )}
      </div>
      <div className="w-full flex gap-(--base) *:grow *:w-1/2">
        <ReactSelect
          filterOption={(option, inputValue) =>
            ((option?.data?.plainTextLabel as string) || option.label)
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          }
          id="group-by--field-select"
          isClearable
          isMulti={false}
          onChange={async (v: { value: string } | null) => {
            const value = v === null ? undefined : v.value

            // value is being cleared
            if (v === null) {
              await refineListData({
                groupBy: '',
                page: 1,
              })
            }

            await refineListData({
              groupBy: value ? (query.groupBy?.startsWith('-') ? `-${value}` : value) : undefined,
              page: 1,
            })
          }}
          options={reducedFields.filter(
            (field) =>
              !field.field.admin.disableGroupBy &&
              field.value !== 'id' &&
              supportedFieldTypes.includes(field.field.type),
          )}
          value={{
            label: groupByField?.label || t('general:selectValue'),
            value: groupByFieldName || '',
          }}
        />
        <SelectInput
          id="group-by--sort"
          isClearable={false}
          name="direction"
          onChange={async ({ value }: { value: string }) => {
            if (!groupByFieldName) {
              return
            }

            await refineListData({
              groupBy: value === 'asc' ? groupByFieldName : `-${groupByFieldName}`,
              page: 1,
            })
          }}
          options={[
            { label: t('general:ascending'), value: 'asc' },
            { label: t('general:descending'), value: 'desc' },
          ]}
          path="direction"
          readOnly={!groupByFieldName}
          value={
            !query.groupBy
              ? 'asc'
              : typeof query.groupBy === 'string'
                ? `${query.groupBy.startsWith('-') ? 'desc' : 'asc'}`
                : ''
          }
        />
      </div>
    </div>
  )
}
