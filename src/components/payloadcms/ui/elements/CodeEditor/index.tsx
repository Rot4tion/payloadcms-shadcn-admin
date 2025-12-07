'use client'
import React, { lazy, Suspense } from 'react'

import type { Props } from './types'

import { ShimmerEffect } from '../ShimmerEffect/index'

const LazyEditor = lazy(() => import('./CodeEditor.js'))

export type { Props }

export const CodeEditor: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<ShimmerEffect />}>
      <LazyEditor {...props} />
    </Suspense>
  )
}
