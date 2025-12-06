import React from 'react'

import { cn } from '@/lib/utils'

export type MinimalTemplateProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  width?: 'normal' | 'wide'
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = (props) => {
  const { children, className, style = {}, width = 'normal' } = props

  return (
    <section
      className={cn(
        'flex w-full justify-center items-center py-12 px-4 mx-auto min-h-full bg-background text-foreground',
        className,
      )}
      style={style}
    >
      <div
        className={cn('w-full', width === 'normal' && 'max-w-md', width === 'wide' && 'max-w-3xl')}
      >
        {children}
      </div>
    </section>
  )
}
