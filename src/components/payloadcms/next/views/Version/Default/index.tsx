'use client'

import {
  CheckboxInput,
  ChevronIcon,
  formatTimeToNow,
  Gutter,
  Pill,
  type SelectablePill,
  useConfig,
  useDocumentInfo,
  useLocale,
  useRouteTransition,
  useTranslation,
} from '@/components/payloadcms/ui/exports/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { type FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

import type { CompareOption, DefaultVersionsViewProps } from './types'

import { Restore } from '../Restore/index'
import { SelectComparison } from '../SelectComparison/index'
import { cn } from '@/lib/utils'
import { type SelectedLocaleOnChange, SelectLocales } from '../SelectLocales/index'
import { SelectedLocalesContext } from './SelectedLocalesContext'
import { SetStepNav } from './SetStepNav'

export const DefaultVersionView: React.FC<DefaultVersionsViewProps> = ({
  canUpdate,
  modifiedOnly: modifiedOnlyProp,
  RenderedDiff,
  selectedLocales: selectedLocalesFromProps,
  versionFromCreatedAt,
  versionFromID,
  versionFromOptions,
  versionToCreatedAt,
  versionToCreatedAtFormatted,
  VersionToCreatedAtLabel,
  versionToID,
  versionToStatus,
}) => {
  const { config, getEntityConfig } = useConfig()
  const { code } = useLocale()
  const { i18n, t } = useTranslation()

  const [locales, setLocales] = useState<SelectablePill[]>([])
  const [localeSelectorOpen, setLocaleSelectorOpen] = React.useState(false)

  useEffect(() => {
    if (config.localization) {
      const updatedLocales = config.localization.locales.map((locale) => {
        let label = locale.label
        if (typeof locale.label !== 'string' && locale.label[code]) {
          label = locale.label[code]
        }

        return {
          name: locale.code,
          Label: label,
          selected: selectedLocalesFromProps.includes(locale.code),
        } as SelectablePill
      })
      setLocales(updatedLocales)
    }
  }, [code, config.localization, selectedLocalesFromProps])

  const { id: originalDocID, collectionSlug, globalSlug, isTrashed } = useDocumentInfo()
  const { startRouteTransition } = useRouteTransition()

  const { collectionConfig, globalConfig } = useMemo(() => {
    return {
      collectionConfig: getEntityConfig({ collectionSlug }),
      globalConfig: getEntityConfig({ globalSlug }),
    }
  }, [collectionSlug, globalSlug, getEntityConfig])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [modifiedOnly, setModifiedOnly] = useState(modifiedOnlyProp)

  const updateSearchParams = useCallback(
    (args: {
      modifiedOnly?: boolean
      selectedLocales?: SelectablePill[]
      versionFromID?: string
    }) => {
      // If the selected comparison doc or locales change, update URL params so that version page
      // This is so that RSC can update the version comparison state
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (args?.versionFromID) {
        current.set('versionFrom', args?.versionFromID)
      }

      if (args?.selectedLocales) {
        if (!args.selectedLocales.length) {
          current.delete('localeCodes')
        } else {
          const selectedLocaleCodes: string[] = []
          for (const locale of args.selectedLocales) {
            if (locale.selected) {
              selectedLocaleCodes.push(locale.name)
            }
          }
          current.set('localeCodes', JSON.stringify(selectedLocaleCodes))
        }
      }

      if (args?.modifiedOnly === false) {
        current.set('modifiedOnly', 'false')
      } else if (args?.modifiedOnly === true) {
        current.delete('modifiedOnly')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      startRouteTransition(() => router.push(`${pathname}${query}`))
    },
    [pathname, router, searchParams, startRouteTransition],
  )

  const onToggleModifiedOnly: FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const newModified = (event.target as HTMLInputElement).checked
      setModifiedOnly(newModified)
      updateSearchParams({
        modifiedOnly: newModified,
      })
    },
    [updateSearchParams],
  )

  const onChangeSelectedLocales: SelectedLocaleOnChange = useCallback(
    ({ locales }) => {
      setLocales(locales)
      updateSearchParams({
        selectedLocales: locales,
      })
    },
    [updateSearchParams],
  )

  const onChangeVersionFrom: (val: CompareOption) => void = useCallback(
    (val) => {
      updateSearchParams({
        versionFromID: val.value,
      })
    },
    [updateSearchParams],
  )

  const { localization } = config

  const versionToTimeAgo = useMemo(
    () =>
      t('version:versionAgo', {
        distance: formatTimeToNow({
          date: versionToCreatedAt,
          i18n,
        }),
      }),
    [versionToCreatedAt, i18n, t],
  )

  const versionFromTimeAgo = useMemo(
    () =>
      versionFromCreatedAt
        ? t('version:versionAgo', {
            distance: formatTimeToNow({
              date: versionFromCreatedAt,
              i18n,
            }),
          })
        : undefined,
    [versionFromCreatedAt, i18n, t],
  )

  return (
    <main className="w-full pb-[var(--spacing-view-bottom)]">
      {/* Controls Top */}
      <Gutter className="border-b border-border py-4 px-[var(--gutter-h)]">
        <div className="flex flex-row justify-between items-center max-sm:flex-col max-sm:items-start">
          <h2 className="text-lg">{i18n.t('version:compareVersions')}</h2>
          <div className="flex flex-row items-center gap-[var(--base)]">
            <span className="ml-[var(--base)] flex items-center max-sm:ml-0">
              <CheckboxInput
                checked={modifiedOnly}
                id={'modifiedOnly'}
                label={i18n.t('version:modifiedOnly')}
                onToggle={onToggleModifiedOnly}
              />
            </span>
            {localization && (
              <Pill
                aria-controls="view-version-locales"
                aria-expanded={localeSelectorOpen}
                icon={<ChevronIcon direction={localeSelectorOpen ? 'up' : 'down'} />}
                onClick={() => setLocaleSelectorOpen((localeSelectorOpen) => !localeSelectorOpen)}
                pillStyle="light"
                size="small"
              >
                <span className="text-muted-foreground">{t('general:locales')}: </span>
                <span>
                  {locales
                    .filter((locale) => locale.selected)
                    .map((locale) => locale.name)
                    .join(', ')}
                </span>
              </Pill>
            )}
          </div>
        </div>

        {localization && (
          <SelectLocales
            locales={locales}
            localeSelectorOpen={localeSelectorOpen}
            onChange={onChangeSelectedLocales}
          />
        )}
      </Gutter>

      {/* Controls Bottom */}
      <Gutter
        className={cn(
          'border-b border-border py-4 px-[var(--gutter-h)] relative',
          // Vertical separator line
          'after:content-[""] after:absolute after:top-0 after:bottom-0 after:left-1/2 after:w-px after:bg-border after:-translate-x-1/2',
        )}
      >
        <div className="grid grid-cols-2 gap-[var(--base)]">
          {/* Version From */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between max-sm:flex-col max-sm:items-start">
              <span>{t('version:comparingAgainst')}</span>
              {versionFromTimeAgo && (
                <span className="text-muted-foreground">{versionFromTimeAgo}</span>
              )}
            </div>
            <SelectComparison
              collectionSlug={collectionSlug}
              docID={originalDocID}
              globalSlug={globalSlug}
              onChange={onChangeVersionFrom}
              versionFromID={versionFromID}
              versionFromOptions={versionFromOptions}
            />
          </div>

          {/* Version To */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between max-sm:flex-col max-sm:items-start">
              <span>{t('version:currentlyViewing')}</span>
              <span className="text-muted-foreground">{versionToTimeAgo}</span>
            </div>
            <div
              className={cn(
                'flex flex-row items-center justify-between bg-muted py-2 px-3 gap-[calc(var(--base)/2)]',
                'max-md:flex-col max-md:items-start',
                '[&_h2]:text-[13px] [&_h2]:font-normal',
              )}
            >
              {VersionToCreatedAtLabel}
              {canUpdate && !isTrashed && (
                <Restore
                  className="[&_div]:my-0"
                  collectionConfig={collectionConfig}
                  globalConfig={globalConfig}
                  label={collectionConfig?.labels.singular || globalConfig?.label}
                  originalDocID={originalDocID}
                  status={versionToStatus}
                  versionDateFormatted={versionToCreatedAtFormatted}
                  versionID={versionToID}
                />
              )}
            </div>
          </div>
        </div>
      </Gutter>

      <SetStepNav
        collectionConfig={collectionConfig}
        globalConfig={globalConfig}
        id={originalDocID}
        isTrashed={isTrashed}
        versionToCreatedAtFormatted={versionToCreatedAtFormatted}
        versionToID={versionToID}
      />

      {/* Diff Wrap */}
      <Gutter
        className={cn(
          'pt-[var(--base)] max-sm:pt-[calc(var(--base)/2)] flex flex-col gap-[var(--base)] relative',
          // Vertical separator line
          'after:content-[""] after:absolute after:top-0 after:bottom-0 after:left-1/2 after:w-px after:bg-border after:-translate-x-1/2 after:z-[2]',
        )}
      >
        <SelectedLocalesContext value={{ selectedLocales: locales.map((locale) => locale.name) }}>
          {versionToCreatedAt && RenderedDiff}
        </SelectedLocalesContext>
      </Gutter>
    </main>
  )
}
