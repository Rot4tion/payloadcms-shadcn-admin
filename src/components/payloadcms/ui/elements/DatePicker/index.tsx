'use client'
import React, { lazy, Suspense } from 'react'

import type { Props } from './types'

import { ShimmerEffect } from '../ShimmerEffect'

const DatePicker = lazy(() => import('./DatePicker.js'))

export const DatePickerField: React.FC<Props> = (props) => (
  <Suspense fallback={<ShimmerEffect height={50} />}>
    <DatePicker {...props} />
  </Suspense>
)
