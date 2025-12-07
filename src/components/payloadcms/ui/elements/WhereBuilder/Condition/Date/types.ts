import type { DateFieldClient } from 'payload'

import type { DefaultFilterProps } from '../types'

export type DateFilterProps = {
  readonly field: DateFieldClient
  readonly value: Date | string
} & DefaultFilterProps
