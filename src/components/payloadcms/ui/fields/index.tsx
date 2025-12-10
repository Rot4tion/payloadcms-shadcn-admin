// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type {
  ClientFieldBase,
  FieldTypes,
  GenericDescriptionProps,
  GenericErrorProps,
  GenericLabelProps,
  HiddenFieldProps,
} from 'payload'
import type React from 'react'

import type { ConfirmPasswordFieldProps } from './ConfirmPassword'

import { RowLabel } from '../forms/RowLabel'
import { ArrayField } from './Array'
import { BlocksField } from './Blocks'
import { CheckboxField } from './Checkbox'
import { CodeField } from './Code'
import { CollapsibleField } from './Collapsible'
import { ConfirmPasswordField } from './ConfirmPassword'
import { DateTimeField } from './DateTime'
import { EmailField } from './Email'
import { FieldDescription } from './FieldDescription'
import { FieldError } from './FieldError'
import { FieldLabel } from './FieldLabel'
import { GroupField } from './Group'
import { HiddenField } from './Hidden'
import { JoinField } from './Join'
import { JSONField } from './JSON'
import { NumberField } from './Number'
import { PasswordField } from './Password'
import { PointField } from './Point'
import { RadioGroupField } from './RadioGroup'
import { RelationshipField } from './Relationship'
import { RichTextField } from './RichText'
import { RowField } from './Row'
import { SelectField } from './Select'
import { TabsField } from './Tabs'
import { TextField } from './Text'
import { TextareaField } from './Textarea'
import { UIField } from './UI'
import { UploadField } from './Upload'

export * from './shared'

export type FieldTypesComponents = {
  [K in 'password' | FieldTypes]: React.FC<ClientFieldBase>
} & {
  confirmPassword: React.FC<ConfirmPasswordFieldProps>
  hidden: React.FC<HiddenFieldProps>
}

export const fieldComponents: FieldTypesComponents = {
  array: ArrayField,
  blocks: BlocksField,
  checkbox: CheckboxField,
  code: CodeField,
  collapsible: CollapsibleField,
  confirmPassword: ConfirmPasswordField,
  date: DateTimeField,
  email: EmailField,
  group: GroupField,
  hidden: HiddenField,
  join: JoinField,
  json: JSONField,
  number: NumberField,
  password: PasswordField,
  point: PointField,
  radio: RadioGroupField,
  relationship: RelationshipField,
  richText: RichTextField,
  row: RowField,
  select: SelectField,
  tabs: TabsField,
  text: TextField,
  textarea: TextareaField,
  ui: UIField,
  upload: UploadField,
}

export type FieldComponentsWithSlots = {
  Description: React.FC<GenericDescriptionProps>
  Error: React.FC<GenericErrorProps>
  Label: React.FC<GenericLabelProps>
  RowLabel: React.FC
} & FieldTypesComponents

export const allFieldComponents: FieldComponentsWithSlots = {
  ...fieldComponents,
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
  RowLabel,
}
