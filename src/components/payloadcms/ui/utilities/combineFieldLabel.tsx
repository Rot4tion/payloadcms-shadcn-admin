// @ts-nocheck payloadcms original type safe issue will fix later
import type { ClientField } from 'payload'

import { Fragment } from 'react'

import { RenderCustomComponent } from '../elements/RenderCustomComponent'
import { FieldLabel } from '../fields/FieldLabel'

export const combineFieldLabel = ({
  CustomLabel,
  field,
  prefix,
}: {
  CustomLabel?: React.ReactNode
  field?: ClientField
  prefix?: React.ReactNode
}): React.ReactNode => {
  return (
    <Fragment>
      {prefix ? (
        <Fragment>
          <span style={{ display: 'inline-block' }}>{prefix}</span>
          {' > '}
        </Fragment>
      ) : null}
      <span style={{ display: 'inline-block' }}>
        <RenderCustomComponent
          CustomComponent={CustomLabel}
          Fallback={<FieldLabel label={'label' in field && field.label} />}
        />
      </span>
    </Fragment>
  )
}
