// @ts-nocheck payloadcms original type safe issue will fix later
import type { FieldDiffClientProps, FieldDiffServerProps, FieldTypes } from 'payload'

import { Collapsible } from './Collapsible'
import { DateDiffComponent } from './Date'
import { Group } from './Group'
import { Iterable } from './Iterable'
import { Relationship } from './Relationship'
import { Row } from './Row'
import { Select } from './Select'
import { Tabs } from './Tabs'
import { Text } from './Text'
import { Upload } from './Upload'

export const diffComponents: Record<
  FieldTypes,
  React.ComponentType<FieldDiffClientProps | FieldDiffServerProps>
> = {
  array: Iterable,
  blocks: Iterable,
  checkbox: Text,
  code: Text,
  collapsible: Collapsible,
  date: DateDiffComponent,
  email: Text,
  group: Group,
  join: null,
  json: Text,
  number: Text,
  point: Text,
  radio: Select,
  relationship: Relationship,
  richText: Text,
  row: Row,
  select: Select,
  tabs: Tabs,
  text: Text,
  textarea: Text,
  ui: null,
  upload: Upload,
}
