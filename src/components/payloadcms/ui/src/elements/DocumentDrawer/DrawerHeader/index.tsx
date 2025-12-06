'use client'

import { useCallback } from 'react'

import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Gutter } from '../../../elements/Gutter/index.js'
import { useModal } from '../../../elements/Modal/index.js'
import { RenderTitle } from '../../../elements/RenderTitle/index.js'
import { useFormModified } from '../../../forms/Form/index.js'
import { useDocumentInfo } from '@payloadcms/ui'
import { useDocumentTitle } from '../../../providers/DocumentTitle/index.js'
import { useTranslation } from '@payloadcms/ui'
import { IDLabel } from '../../IDLabel/index.js'
import { LeaveWithoutSavingModal } from '../../LeaveWithoutSaving/index.js'

const leaveWithoutSavingModalSlug = 'leave-without-saving-doc-drawer'

export const DocumentDrawerHeader: React.FC<{
  AfterHeader?: React.ReactNode
  drawerSlug: string
  showDocumentID?: boolean
}> = ({ AfterHeader, drawerSlug, showDocumentID = true }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const isModified = useFormModified()

  const handleOnClose = useCallback(() => {
    if (isModified) {
      openModal(leaveWithoutSavingModalSlug)
    } else {
      closeModal(drawerSlug)
    }
  }, [isModified, openModal, closeModal, drawerSlug])

  return (
    <Gutter className="w-full mt-[calc(var(--base)*2)] flex flex-col gap-[calc(var(--base)*0.5)] border-b border-border pb-(--base) max-lg:mt-[calc(var(--base)*1.5)] max-lg:mb-[calc(var(--base)*0.5)] max-lg:px-(--gutter-h)">
      <div className="flex justify-between items-start w-full">
        <h2 className="m-0">{<RenderTitle element="span" />}</h2>
        <Button
          aria-label={t('general:close')}
          variant="ghost"
          size="icon"
          onClick={handleOnClose}
          type="button"
        >
          <XIcon className="size-5" />
        </Button>
      </div>
      {showDocumentID && <DocumentID />}
      {AfterHeader ? <div className="pt-[calc(var(--base)/4)]">{AfterHeader}</div> : null}

      <LeaveWithoutSavingModal
        modalSlug={leaveWithoutSavingModalSlug}
        onConfirm={() => closeModal(drawerSlug)}
      />
    </Gutter>
  )
}

const DocumentID: React.FC = () => {
  const { id } = useDocumentInfo()
  const { title } = useDocumentTitle()
  return id && id !== title ? <IDLabel id={id.toString()} /> : null
}
