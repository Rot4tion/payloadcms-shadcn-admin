'use client'
import type { I18nClient } from '@payloadcms/translations'

import React from 'react'
import { cn } from '@/lib/utils'

export type ErrorPillProps = {
  className?: string
  count: number
  i18n: I18nClient
  withMessage?: boolean
}

/**
 * ErrorPill - Error count badge (Tailwind version)
 *
 * Original SCSS:
 * - align-self: center, flex-shrink: 0, border-radius: var(--style-radius-l)
 * - line-height: 18px, font-size: 11px, font-weight: 500
 * - background: var(--theme-error-300), color: var(--theme-error-950)
 * - --fixed-width: 18px circle for small counts
 */
export const ErrorPill: React.FC<ErrorPillProps> = (props) => {
  const { className, count, i18n, withMessage } = props
  const isFixedWidth = !withMessage && count < 99

  if (count === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'self-center shrink-0 flex items-center justify-center',
        'border-0 text-center font-medium',
        'bg-destructive/30 text-destructive-foreground',
        'text-[11px] leading-[18px] px-1 rounded-lg',
        isFixedWidth && 'size-[18px] rounded-full p-0',
        className,
      )}
    >
      <div className="flex items-center justify-center">
        <span className="tracking-wide ml-px">{count}</span>
        {withMessage && ` ${count > 1 ? i18n.t('general:errors') : i18n.t('general:error')}`}
      </div>
    </div>
  )
}
