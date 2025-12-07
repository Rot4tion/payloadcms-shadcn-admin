import type { FieldDiffClientProps, FieldDiffServerProps, FieldTypes } from 'payload'

import { Collapsible } from './Collapsible/index'
import { DateDiffComponent } from './Date/index'
import { Group } from './Group/index'
import { Iterable } from './Iterable/index'
import { Relationship } from './Relationship/index'
import { Row } from './Row/index'
import { Select } from './Select/index'
import { Tabs } from './Tabs/index'
import { Text } from './Text/index'
import { Upload } from './Upload/index'

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
