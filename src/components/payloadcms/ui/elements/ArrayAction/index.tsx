'use client'
import React from 'react'

import { ChevronIcon } from '../../icons/Chevron/index'
import { CopyIcon } from '../../icons/Copy/index'
import { MoreIcon } from '../../icons/More/index'
import { PlusIcon } from '../../icons/Plus/index'
import { XIcon } from '../../icons/X/index'
import { useTranslation } from '@payloadcms/ui'
import { ClipboardActionLabel } from '../ClipboardAction/ClipboardActionLabel'
import { Popup, PopupList } from '../Popup/index'

export type Props = {
  addRow: (current: number, blockType?: string) => Promise<void> | void
  copyRow: (index: number) => void
  duplicateRow: (current: number) => void
  hasMaxRows: boolean
  index: number
  isSortable?: boolean
  moveRow: (from: number, to: number) => void
  pasteRow: (index: number) => void
  removeRow: (index: number) => void
  rowCount: number
}

export const ArrayAction: React.FC<Props> = ({
  addRow,
  copyRow,
  duplicateRow,
  hasMaxRows,
  index,
  isSortable,
  moveRow,
  pasteRow,
  removeRow,
  rowCount,
}) => {
  const { t } = useTranslation()

  // Action item styles: flex, gap, items-center
  const actionClass =
    'flex gap-[calc(var(--base)/2)] items-center [&_svg]:relative [&_.stroke]:stroke-1'

  return (
    <Popup
      button={<MoreIcon />}
      buttonClassName="bg-transparent border-0 p-0 m-0 cursor-pointer rounded-full hover:bg-muted"
      horizontalAlign="center"
      render={({ close }) => {
        return (
          <PopupList.ButtonGroup buttonSize="small">
            {isSortable && index !== 0 && (
              <PopupList.Button
                className={actionClass}
                onClick={() => {
                  moveRow(index, index - 1)
                  close()
                }}
              >
                <div>
                  <ChevronIcon direction="up" />
                </div>
                {t('general:moveUp')}
              </PopupList.Button>
            )}
            {isSortable && index < rowCount - 1 && (
              <PopupList.Button
                className={actionClass}
                onClick={() => {
                  moveRow(index, index + 1)
                  close()
                }}
              >
                <div>
                  <ChevronIcon />
                </div>
                {t('general:moveDown')}
              </PopupList.Button>
            )}
            {!hasMaxRows && (
              <React.Fragment>
                <PopupList.Button
                  className={actionClass}
                  onClick={() => {
                    void addRow(index + 1)
                    close()
                  }}
                >
                  <PlusIcon />
                  {t('general:addBelow')}
                </PopupList.Button>
                <PopupList.Button
                  className={actionClass}
                  onClick={() => {
                    duplicateRow(index)
                    close()
                  }}
                >
                  <CopyIcon />
                  {t('general:duplicate')}
                </PopupList.Button>
              </React.Fragment>
            )}
            <PopupList.Button
              className={actionClass}
              onClick={() => {
                copyRow(index)
                close()
              }}
            >
              <ClipboardActionLabel isRow />
            </PopupList.Button>
            <PopupList.Button
              className={actionClass}
              onClick={() => {
                pasteRow(index)
                close()
              }}
            >
              <ClipboardActionLabel isPaste isRow />
            </PopupList.Button>
            <PopupList.Button
              className={actionClass}
              onClick={() => {
                removeRow(index)
                close()
              }}
            >
              <XIcon />
              {t('general:remove')}
            </PopupList.Button>
          </PopupList.ButtonGroup>
        )
      }}
      size="medium"
    />
  )
}
