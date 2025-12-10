'use client'
import React from 'react'

import type { RowLabelProps } from './types'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent'
import { RowLabelProvider } from './Context'
export type { RowLabelProps }

const baseClass = 'row-label'

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  const { className, CustomComponent, label, path, rowNumber } = props

  return (
    <RowLabelProvider path={path} rowNumber={rowNumber}>
      <RenderCustomComponent
        CustomComponent={CustomComponent}
        Fallback={
          typeof label === 'string' ? (
            <span
              className={[baseClass, className].filter(Boolean).join(' ')}
              style={{
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>
          ) : (
            label
          )
        }
      />
    </RowLabelProvider>
  )
}
