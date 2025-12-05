'use client'
import { useTranslation } from '@payloadcms-local/ui'
import React, { Fragment } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type SettingsMenuButtonProps = {
  settingsMenu?: React.ReactNode[]
}

export const SettingsMenuButton: React.FC<SettingsMenuButtonProps> = ({ settingsMenu }) => {
  const { t } = useTranslation()

  if (!settingsMenu || settingsMenu.length === 0) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t('general:menu')}>
          <Settings className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-48 p-2">
        <div className="flex flex-col gap-1">
          {settingsMenu.map((item, i) => (
            <Fragment key={`settings-menu-item-${i}`}>{item}</Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
