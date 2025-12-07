import React from 'react'

import { useSelection } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Pill } from '../Pill/index'

export const SelectMany: React.FC<{
  onClick?: (ids: ReturnType<typeof useSelection>['selected']) => void
}> = (props) => {
  const { onClick } = props

  const { count, selected } = useSelection()
  const { t } = useTranslation()

  if (!selected || !count) {
    return null
  }

  return (
    <Pill
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick(selected)
        }
      }}
      pillStyle="white"
      size="small"
    >
      {t('general:select')} {count}
    </Pill>
  )
}
