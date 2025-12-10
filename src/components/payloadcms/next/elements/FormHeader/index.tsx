import React from 'react'

type Props = {
  description?: React.ReactNode | string
  heading: string
}

/**
 * FormHeader - Form heading with optional description (Tailwind version)
 *
 * Original SCSS:
 * - display: flex, flex-direction: column
 * - gap: calc(var(--base) * 0.5) = 10px
 * - margin-bottom: var(--base) = 20px
 */
export function FormHeader({ description, heading }: Props) {
  if (!heading) {
    return null
  }

  return (
    <div className="flex flex-col gap-[calc(var(--base)*0.5)] mb-(--base)">
      <h1>{heading}</h1>
      {Boolean(description) && <p>{description}</p>}
    </div>
  )
}
