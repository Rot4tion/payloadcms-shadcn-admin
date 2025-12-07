import type { LabelFunction, StaticLabel } from 'payload'

import { cn } from '@/lib/utils'
import { getTranslation, type I18nClient } from '@payloadcms/translations'

import { FieldDiffLabel } from '../FieldDiffLabel/index.js'

export const FieldDiffContainer: React.FC<{
  className?: string
  From: React.ReactNode
  i18n: I18nClient
  label: {
    label?: false | LabelFunction | StaticLabel
    locale?: string
  }
  nestingLevel?: number
  To: React.ReactNode
}> = (args) => {
  const {
    className,
    From,
    i18n,
    label: { label, locale },
    nestingLevel = 0,
    To,
  } = args

  return (
    <div
      className={cn('relative', className)}
      style={
        nestingLevel
          ? ({
              '--left-offset': `calc(50% - (${nestingLevel} * calc(calc(var(--base)*0.5) - 2.5px)))`,
            } as React.CSSProperties)
          : ({
              '--left-offset': '50%',
            } as React.CSSProperties)
      }
    >
      <FieldDiffLabel>
        {locale && (
          <span className="bg-muted rounded-sm p-[calc(var(--base)*0.2)] me-[calc(var(--base)*0.25)]">
            {locale}
          </span>
        )}
        {typeof label !== 'function' && getTranslation(label || '', i18n)}
      </FieldDiffLabel>
      <div
        className="grid gap-(--base) bg-muted/50 p-[calc(var(--base)*0.5)]"
        style={{
          gridTemplateColumns: nestingLevel
            ? `calc(var(--left-offset) - calc(var(--base)*0.5)) calc(50% - calc(var(--base)*0.5) + calc(50% - var(--left-offset)))`
            : 'calc(50% - calc(var(--base)*0.5)) calc(50% - calc(var(--base)*0.5))',
        }}
      >
        {From}
        {To}
      </div>
    </div>
  )
}
