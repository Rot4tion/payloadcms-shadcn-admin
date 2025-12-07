'use client'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment } from 'react'

import type { StepNavItem } from './types.js'

import { PayloadIcon } from '../../graphics/Icon/index.js'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Link } from '../Link/index.js'
import { RenderCustomComponent } from '../RenderCustomComponent/index.js'
import { useStepNav } from './context.js'

import { cn } from '@/lib/utils'
import { StepNavProvider } from '@payloadcms/ui/elements/StepNav'

export { SetStepNav } from './SetStepNav.js'

const StepNav: React.FC<{
  readonly className?: string
  readonly CustomIcon?: React.ReactNode
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  readonly Link?: React.ComponentType
}> = ({ className, CustomIcon }) => {
  const { i18n } = useTranslation()

  const { stepNav } = useStepNav()

  const {
    config: {
      routes: { admin },
    },
  } = useConfig()

  const { t } = useTranslation()

  return (
    <Fragment>
      {stepNav.length > 0 ? (
        <nav className={cn('flex items-center gap-1.5', className)}>
          <Link
            className="size-5 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            href={admin}
            prefetch={false}
            tabIndex={0}
          >
            <span title={t('general:dashboard')}>
              <RenderCustomComponent CustomComponent={CustomIcon} Fallback={<PayloadIcon />} />
            </span>
          </Link>
          <span className="text-muted-foreground">/</span>
          {stepNav.map((item, i) => {
            const StepLabel = getTranslation(item.label, i18n)
            const isLast = stepNav.length === i + 1

            const Step = isLast ? (
              <span className="max-w-32 truncate" key={i}>
                {StepLabel}
              </span>
            ) : (
              <Fragment key={i}>
                {item.url ? (
                  <Link
                    href={item.url}
                    prefetch={false}
                    className="font-semibold no-underline hover:underline focus-visible:underline"
                  >
                    <span className="max-w-32 truncate" key={i}>
                      {StepLabel}
                    </span>
                  </Link>
                ) : (
                  <span className="max-w-32 truncate" key={i}>
                    {StepLabel}
                  </span>
                )}
                <span className="text-muted-foreground">/</span>
              </Fragment>
            )

            return Step
          })}
        </nav>
      ) : (
        <div className={cn('flex items-center gap-1.5', className)}>
          <div className="size-5">
            <span title={t('general:dashboard')}>
              <RenderCustomComponent CustomComponent={CustomIcon} Fallback={<PayloadIcon />} />
            </span>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export { StepNav, StepNavItem, StepNavProvider, useStepNav }
