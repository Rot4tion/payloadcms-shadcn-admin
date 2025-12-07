'use client'

import React from 'react'

import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'
import { Dropzone } from '../../Dropzone/index'
import { DrawerHeader } from '../Header/index'

type Props = {
  readonly acceptMimeTypes?: string
  readonly onCancel: () => void
  readonly onDrop: (acceptedFiles: FileList) => void
}
export function AddFilesView({ acceptMimeTypes, onCancel, onDrop }: Props) {
  const { t } = useTranslation()

  const inputRef = React.useRef(null)

  return (
    <div className="h-full flex flex-col">
      <DrawerHeader onClose={onCancel} title={t('upload:addFiles')} />
      <div className="h-full p-[calc(var(--base)*2)] px-(--gutter-h)">
        <Dropzone multipleFiles onChange={onDrop}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click()
              }
            }}
          >
            {t('upload:selectFile')}
          </Button>
          <input
            accept={acceptMimeTypes}
            aria-hidden="true"
            className="hidden"
            hidden
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onDrop(e.target.files)
              }
            }}
            ref={inputRef}
            type="file"
          />

          <p className="m-0 lowercase self-center">
            {t('general:or')} {t('upload:dragAndDrop')}
          </p>
        </Dropzone>
      </div>
    </div>
  )
}
