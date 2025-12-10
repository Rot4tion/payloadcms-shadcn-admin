import type { HTMLAttributes } from 'react'

export type Props = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly gutter?: boolean
  readonly Header?: React.ReactNode
  /** Hide the default close button from SheetContent (use when Header has its own close button) */
  readonly hideDefaultCloseButton?: boolean
  readonly hoverTitle?: boolean
  readonly slug: string
  readonly title?: string
}

export type TogglerProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  slug: string
} & HTMLAttributes<HTMLButtonElement>
