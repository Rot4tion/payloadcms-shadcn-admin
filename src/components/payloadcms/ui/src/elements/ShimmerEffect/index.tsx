'use client'
import * as React from 'react'

import { useDelay } from '../../hooks/useDelay.js'
import { cn } from '@/lib/utils'

export type ShimmerEffectProps = {
  readonly animationDelay?: string
  readonly className?: string
  readonly disableInlineStyles?: boolean
  readonly height?: number | string
  readonly width?: number | string
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  animationDelay = '0ms',
  className,
  disableInlineStyles = false,
  height = '60px',
  width = '100%',
}) => {
  return (
    <div
      className={cn('relative overflow-hidden bg-muted/50', className)}
      style={{
        height: !disableInlineStyles && (typeof height === 'number' ? `${height}px` : height),
        width: !disableInlineStyles && (typeof width === 'number' ? `${width}px` : width),
      }}
    >
      <div
        className="absolute scale-150 w-full h-full -translate-x-full animate-[shimmer_1.75s_infinite] opacity-75 bg-gradient-to-r from-muted/50 via-muted to-muted/50"
        style={{
          animationDelay,
        }}
      />
    </div>
  )
}

export type StaggeredShimmersProps = {
  className?: string
  count: number
  height?: number | string
  renderDelay?: number
  shimmerDelay?: number | string
  shimmerItemClassName?: string
  width?: number | string
}

export const StaggeredShimmers: React.FC<StaggeredShimmersProps> = ({
  className,
  count,
  height,
  renderDelay = 500,
  shimmerDelay = 25,
  shimmerItemClassName,
  width,
}) => {
  const shimmerDelayToPass = typeof shimmerDelay === 'number' ? `${shimmerDelay}ms` : shimmerDelay
  const [hasDelayed] = useDelay(renderDelay, true)

  if (!hasDelayed) {
    return null
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div className={shimmerItemClassName} key={i}>
          <ShimmerEffect
            animationDelay={`calc(${i} * ${shimmerDelayToPass})`}
            height={height}
            width={width}
          />
        </div>
      ))}
    </div>
  )
}
