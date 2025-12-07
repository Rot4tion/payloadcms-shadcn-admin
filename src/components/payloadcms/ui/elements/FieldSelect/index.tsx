'use client'
import type { ClientField, FormState, SanitizedFieldPermissions } from 'payload'

import React, { useState } from 'react'

import type { FieldAction } from '../../forms/Form/types'
import type { FieldOption } from './reduceFieldOptions'

import { FieldLabel } from '../../fields/FieldLabel/index'
import { useForm } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { filterOutUploadFields } from '../../utilities/filterOutUploadFields'
import { ReactSelect } from '../ReactSelect/index'
import { reduceFieldOptions } from './reduceFieldOptions'

export type OnFieldSelect = ({
  dispatchFields,
  formState,
  selected,
}: {
  dispatchFields: React.Dispatch<FieldAction>
  formState: FormState
  selected: FieldOption[]
}) => void

export type FieldSelectProps = {
  readonly fields: ClientField[]
  readonly onChange: OnFieldSelect
  readonly permissions:
    | {
        [fieldName: string]: SanitizedFieldPermissions
      }
    | SanitizedFieldPermissions
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ fields, onChange, permissions }) => {
  const { t } = useTranslation()
  const { dispatchFields, getFields } = useForm()

  const [options] = useState<FieldOption[]>(() =>
    reduceFieldOptions({
      fields: filterOutUploadFields(fields),
      formState: getFields(),
      permissions,
    }),
  )

  return (
    <div className="mb-(--base)">
      <FieldLabel label={t('fields:selectFieldsToEdit')} />
      <ReactSelect
        getOptionValue={(option) => {
          if (typeof option.value === 'object' && 'path' in option.value) {
            return String(option.value.path)
          }
          return String(option.value)
        }}
        isMulti
        onChange={(selected: FieldOption[]) =>
          onChange({ dispatchFields, formState: getFields(), selected })
        }
        options={options}
      />
    </div>
  )
}
