'use client'
import React, { useState } from 'react'

import { CopyIcon } from '../../icons/Copy'
import { useTranslation } from '@payloadcms/ui'
import { Tooltip } from '../Tooltip'
import { cn } from '@/lib/utils'

export type Props = {
  className?: string
  defaultMessage?: string
  successMessage?: string
  value?: string
}

/**
 * CopyToClipboard - Copy button with tooltip (Tailwind version)
 *
 * Original SCSS:
 * - %btn-reset, position: relative, cursor: pointer
 * - vertical-align: middle, border-radius: 100%
 * - focus-visible: outline: var(--accessibility-outline)
 */
export const CopyToClipboard: React.FC<Props> = ({
  className,
  defaultMessage,
  successMessage,
  value,
}) => {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()

  if (value) {
    return (
      <button
        className={cn(
          // btn-reset + base styles
          'relative cursor-pointer align-middle rounded-full',
          'bg-transparent border-0 p-0 m-0',
          'focus:outline-none active:outline-none',
          'focus-visible:outline-2 focus-visible:outline-ring',
          className,
        )}
        onClick={async () => {
          await navigator.clipboard.writeText(value)
          setCopied(true)
        }}
        onMouseEnter={() => {
          setHovered(true)
          setCopied(false)
        }}
        onMouseLeave={() => {
          setHovered(false)
          setCopied(false)
        }}
        type="button"
      >
        <CopyIcon />
        <Tooltip delay={copied ? 0 : undefined} show={hovered || copied}>
          {copied && (successMessage ?? t('general:copied'))}
          {!copied && (defaultMessage ?? t('general:copy'))}
        </Tooltip>
      </button>
    )
  }

  return null
}
