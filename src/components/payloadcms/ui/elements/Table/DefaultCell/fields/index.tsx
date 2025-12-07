'use client'
import { ArrayCell } from './Array/index'
import { BlocksCell } from './Blocks/index'
import { CheckboxCell } from './Checkbox/index'
import { CodeCell } from './Code/index'
import { DateCell } from './Date/index'
import { FileCell } from './File/index'
import { JSONCell } from './JSON/index'
import { RelationshipCell } from './Relationship/index'
import { SelectCell } from './Select/index'
import { TextareaCell } from './Textarea/index'

export const cellComponents = {
  array: ArrayCell,
  blocks: BlocksCell,
  checkbox: CheckboxCell,
  code: CodeCell,
  date: DateCell,
  File: FileCell,
  join: RelationshipCell,
  json: JSONCell,
  radio: SelectCell,
  relationship: RelationshipCell,
  select: SelectCell,
  textarea: TextareaCell,
  upload: RelationshipCell,
}
