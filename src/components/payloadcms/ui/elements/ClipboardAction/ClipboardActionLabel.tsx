'use client'

import { Fragment } from 'react'

import { CopyIcon } from '../../icons/Copy'
import { EditIcon } from '../../icons/Edit'
import { useTranslation } from '@payloadcms/ui'

export const ClipboardActionLabel = ({
  isPaste,
  isRow,
}: {
  isPaste?: boolean
  isRow?: boolean
}) => {
  const { t } = useTranslation()

  let label = t('general:copyField')
  if (!isRow && isPaste) {
    label = t('general:pasteField')
  } else if (isRow && !isPaste) {
    label = t('general:copyRow')
  } else if (isRow && isPaste) {
    label = t('general:pasteRow')
  }

  return (
    <Fragment>
      {isPaste ? <EditIcon /> : <CopyIcon />} {label}
    </Fragment>
  )
}
