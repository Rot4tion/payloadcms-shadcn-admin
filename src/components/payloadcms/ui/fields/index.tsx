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

import type { ConfirmPasswordFieldProps } from './ConfirmPassword/index'

import { RowLabel } from '../forms/RowLabel/index'
import { ArrayField } from './Array/index'
import { BlocksField } from './Blocks/index'
import { CheckboxField } from './Checkbox/index'
import { CodeField } from './Code/index'
import { CollapsibleField } from './Collapsible/index'
import { ConfirmPasswordField } from './ConfirmPassword/index'
import { DateTimeField } from './DateTime/index'
import { EmailField } from './Email/index'
import { FieldDescription } from './FieldDescription/index'
import { FieldError } from './FieldError/index'
import { FieldLabel } from './FieldLabel/index'
import { GroupField } from './Group/index'
import { HiddenField } from './Hidden/index'
import { JoinField } from './Join/index'
import { JSONField } from './JSON/index'
import { NumberField } from './Number/index'
import { PasswordField } from './Password/index'
import { PointField } from './Point/index'
import { RadioGroupField } from './RadioGroup/index'
import { RelationshipField } from './Relationship/index'
import { RichTextField } from './RichText/index'
import { RowField } from './Row/index'
import { SelectField } from './Select/index'
import { TabsField } from './Tabs/index'
import { TextField } from './Text/index'
import { TextareaField } from './Textarea/index'
import { UIField } from './UI/index'
import { UploadField } from './Upload/index'

export * from './shared/index'

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
