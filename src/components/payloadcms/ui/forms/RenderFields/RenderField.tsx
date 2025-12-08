// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type {
  ClientComponentProps,
  ClientField,
  FieldPaths,
  SanitizedFieldPermissions,
} from 'payload'

import React from 'react'

import { ArrayField } from '../../fields/Array'
import { BlocksField } from '../../fields/Blocks'
import { CheckboxField } from '../../fields/Checkbox'
import { CodeField } from '../../fields/Code'
import { CollapsibleField } from '../../fields/Collapsible'
import { DateTimeField } from '../../fields/DateTime'
import { EmailField } from '../../fields/Email'
import { GroupField } from '../../fields/Group'
import { HiddenField } from '../../fields/Hidden'
import { JoinField } from '../../fields/Join'
import { JSONField } from '../../fields/JSON'
import { NumberField } from '../../fields/Number'
import { PointField } from '../../fields/Point'
import { RadioGroupField } from '../../fields/RadioGroup'
import { RelationshipField } from '../../fields/Relationship'
import { RichTextField } from '../../fields/RichText'
import { RowField } from '../../fields/Row'
import { SelectField } from '../../fields/Select'
import { TabsField } from '../../fields/Tabs'
import { TextField } from '../../fields/Text'
import { TextareaField } from '../../fields/Textarea'
import { UIField } from '../../fields/UI'
import { UploadField } from '../../fields/Upload'
import { useFormFields } from '../../forms/Form'

type RenderFieldProps = {
  clientFieldConfig: ClientField
  permissions: SanitizedFieldPermissions
} & FieldPaths &
  Pick<ClientComponentProps, 'forceRender' | 'readOnly' | 'schemaPath'>

export function RenderField({
  clientFieldConfig,
  forceRender,
  indexPath,
  parentPath,
  parentSchemaPath,
  path,
  permissions,
  readOnly,
  schemaPath,
}: RenderFieldProps) {
  const CustomField = useFormFields(([fields]) => fields && fields?.[path]?.customComponents?.Field)

  const baseFieldProps: Pick<
    ClientComponentProps,
    'forceRender' | 'permissions' | 'readOnly' | 'schemaPath'
  > = {
    forceRender,
    permissions,
    readOnly,
    schemaPath,
  }

  if (clientFieldConfig.admin?.hidden) {
    return <HiddenField {...baseFieldProps} path={path} />
  }

  if (CustomField !== undefined) {
    return CustomField || null
  }

  const iterableFieldProps = {
    ...baseFieldProps,
    indexPath,
    parentPath,
    parentSchemaPath,
  }

  switch (clientFieldConfig.type) {
    case 'array':
      return <ArrayField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'blocks':
      return <BlocksField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'checkbox':
      return <CheckboxField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'code':
      return <CodeField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'collapsible':
      return <CollapsibleField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'date':
      return <DateTimeField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'email':
      return <EmailField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'group':
      return <GroupField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'join':
      return <JoinField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'json':
      return <JSONField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'number':
      return <NumberField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'point':
      return <PointField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'radio':
      return <RadioGroupField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'relationship':
      return <RelationshipField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'richText': {
      // RichTextField from lexical requires clientFeatures prop which comes from the field config
      // If clientFeatures is not present, the field wasn't properly initialized (e.g., in EditMany context)
      // Return null to avoid "Cannot convert undefined or null to object" error
      const richTextField = clientFieldConfig as ClientField & { clientFeatures?: unknown }
      if (!richTextField.clientFeatures) {
        return null
      }
      return <RichTextField {...baseFieldProps} field={clientFieldConfig} path={path} />
    }

    case 'row':
      return <RowField {...iterableFieldProps} field={clientFieldConfig} />

    case 'select':
      return <SelectField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'tabs':
      return <TabsField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'text':
      return <TextField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'textarea':
      return <TextareaField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'ui':
      return <UIField />

    case 'upload':
      return <UploadField {...baseFieldProps} field={clientFieldConfig} path={path} />
  }
}
