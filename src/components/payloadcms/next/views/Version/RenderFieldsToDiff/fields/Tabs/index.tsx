// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type {
  ClientTab,
  FieldDiffClientProps,
  TabsFieldClient,
  TabsFieldDiffClientComponent,
  VersionTab,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useTranslation } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

import { useSelectedLocales } from '../../../Default/SelectedLocalesContext'
import { DiffCollapser } from '../../DiffCollapser'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff'

export const Tabs: TabsFieldDiffClientComponent = (props) => {
  const { baseVersionField, comparisonValue: valueFrom, field, versionValue: valueTo } = props
  const { selectedLocales } = useSelectedLocales()

  return (
    <div className="flex flex-col gap-(--base)">
      {baseVersionField.tabs.map((tab, i) => {
        if (!tab?.fields?.length) {
          return null
        }
        const fieldTab = field.tabs?.[i]
        return (
          <div key={i}>
            {(() => {
              if ('name' in fieldTab && selectedLocales && fieldTab.localized) {
                // Named localized tab
                return selectedLocales.map((locale, index) => {
                  const localizedTabProps: TabProps = {
                    ...props,
                    comparisonValue: valueFrom?.[tab.name]?.[locale],
                    fieldTab,
                    locale,
                    tab,
                    versionValue: valueTo?.[tab.name]?.[locale],
                  }
                  return (
                    <div key={[locale, index].join('-')}>
                      <div>
                        <Tab key={locale} {...localizedTabProps} />
                      </div>
                    </div>
                  )
                })
              } else if ('name' in tab && tab.name) {
                // Named tab
                const namedTabProps: TabProps = {
                  ...props,
                  comparisonValue: valueFrom?.[tab.name],
                  fieldTab,
                  tab,
                  versionValue: valueTo?.[tab.name],
                }
                return <Tab key={i} {...namedTabProps} />
              } else {
                // Unnamed tab
                return <Tab fieldTab={fieldTab} key={i} {...props} tab={tab} />
              }
            })()}
          </div>
        )
      })}
    </div>
  )
}

type TabProps = {
  fieldTab: ClientTab
  tab: VersionTab
} & FieldDiffClientProps<TabsFieldClient>

const Tab: React.FC<TabProps> = ({
  comparisonValue: valueFrom,
  fieldTab,
  locale,
  parentIsLocalized,
  tab,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const { selectedLocales } = useSelectedLocales()

  if (!tab.fields?.length) {
    return null
  }

  return (
    <DiffCollapser
      fields={fieldTab.fields}
      Label={
        'label' in tab &&
        tab.label &&
        typeof tab.label !== 'function' && (
          <span>
            {locale && <span className="text-muted-foreground mr-1">{locale}</span>}
            {getTranslation(tab.label, i18n)}
          </span>
        )
      }
      locales={selectedLocales}
      parentIsLocalized={parentIsLocalized || fieldTab.localized}
      valueFrom={valueFrom}
      valueTo={valueTo}
    >
      <RenderVersionFieldsToDiff versionFields={tab.fields} />
    </DiffCollapser>
  )
}
