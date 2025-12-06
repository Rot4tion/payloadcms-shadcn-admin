'use client'

import type { I18nClient } from '@payloadcms/translations'
import type { ClientConfig } from 'payload'

import { useModal } from '../../Modal/index.js'
import { getTranslation } from '@payloadcms/translations'
import { setsAreEqual } from 'payload/shared'
import React, { useCallback, useMemo, useState } from 'react'

import { CheckboxInput } from '../../../fields/Checkbox/index.js'
import { useTranslation } from '@payloadcms/ui'
import { DrawerHeader } from '../../BulkUpload/Header/index.js'
import { Button } from '../../Button/index.js'
import { Drawer } from '../../Drawer/index.js'
import { cn } from '@/lib/utils'

export type LocaleOption = {
  label: string
  value: string
}

export type SelectLocalesDrawerProps = {
  readonly localization: Exclude<ClientConfig['localization'], false>
  readonly onConfirm: (args: { selectedLocales: string[] }) => Promise<void> | void
  readonly slug: string
}

const getLocaleOptions = ({
  i18n,
  localization,
}: {
  i18n: I18nClient
  localization: SelectLocalesDrawerProps['localization']
}): LocaleOption[] => {
  return localization.locales.map((locale) => ({
    label: getTranslation(locale.label, i18n),
    value: locale.code,
  }))
}

export const SelectLocalesDrawer: React.FC<SelectLocalesDrawerProps> = ({
  slug,
  localization,
  onConfirm,
}) => {
  const { i18n, t } = useTranslation()
  const { toggleModal } = useModal()
  const [selectedLocales, setSelectedLocales] = useState<string[]>([])

  const localeOptions = useMemo(
    () => getLocaleOptions({ i18n, localization }),
    [localization, i18n],
  )
  const allLocales = useMemo(() => localeOptions.map((locale) => locale.value), [localeOptions])
  const allLocalesSelected = useMemo(
    () => setsAreEqual(new Set(selectedLocales), new Set(allLocales)),
    [selectedLocales, allLocales],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedLocales(allLocalesSelected ? [] : [...allLocales])
  }, [allLocalesSelected, allLocales])

  const handleToggleLocale = useCallback((localeValue: string) => {
    setSelectedLocales((prev) =>
      prev.includes(localeValue) ? prev.filter((l) => l !== localeValue) : [...prev, localeValue],
    )
  }, [])

  const handleConfirm = useCallback(async () => {
    await onConfirm({ selectedLocales })
    toggleModal(slug)
  }, [onConfirm, selectedLocales, slug, toggleModal])

  return (
    <Drawer
      gutter={false}
      Header={
        <DrawerHeader
          onClose={() => {
            toggleModal(slug)
          }}
          title={`${t('general:duplicate')} ${t('localization:selectedLocales')}`}
        />
      }
      slug={slug}
    >
      <div className="px-(--gutter-h) flex justify-between items-center border-b border-border">
        <span>{t('localization:selectLocaleToDuplicate')}</span>
        <Button
          buttonStyle="primary"
          disabled={selectedLocales.length === 0}
          iconPosition="left"
          id="#action-duplicate-confirm"
          onClick={handleConfirm}
          size="medium"
        >
          {t('general:duplicate')}
        </Button>
      </div>
      <div className="p-[calc(var(--base)*1.5)] px-(--gutter-h) flex flex-col gap-(--base)">
        <div className="flex flex-row gap-[calc(var(--base)*0.5)]">
          <CheckboxInput
            checked={allLocalesSelected}
            id="select-locale-all"
            label={t('general:selectAll', {
              count: allLocales.length,
              label: t('general:locales'),
            })}
            onToggle={handleSelectAll}
          />
        </div>
        {localeOptions.map((locale) => (
          <div className="flex flex-row gap-[calc(var(--base)*0.5)]" key={locale.value}>
            <CheckboxInput
              checked={selectedLocales.includes(locale.value)}
              id={`select-locale-${locale.value}`}
              label={locale.label}
              onToggle={() => handleToggleLocale(locale.value)}
            />
          </div>
        ))}
      </div>
    </Drawer>
  )
}
