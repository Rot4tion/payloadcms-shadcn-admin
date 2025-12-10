'use client'
import React from 'react'

import { XIcon } from 'lucide-react'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'

type Props = {
  readonly onClick: () => void
}
export function DrawerCloseButton({ onClick }: Props) {
  const { t } = useTranslation()

  return (
    <Button
      aria-label={t('general:close')}
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      type="button"
    >
      <XIcon className="size-4" />
    </Button>
  )
}
