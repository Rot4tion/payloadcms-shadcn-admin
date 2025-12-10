import type { ParsedQs } from 'qs-esm'

export type SearchFilterProps = {
  handleChange?: (search: string) => void
  label: string
  searchQueryParam?: string
}
