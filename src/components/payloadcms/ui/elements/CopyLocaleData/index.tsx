// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import { useModal } from '../Modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import { CheckboxField } from '../../fields/Checkbox'
import { SelectInput } from '../../fields/Select'
import { useFormModified } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'
import { useRouteTransition } from '@payloadcms/ui'
import { useServerFunctions } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { DrawerHeader } from '../BulkUpload/Header'
import { Button } from '../Button'
import { Drawer } from '../Drawer'
import { PopupList } from '../Popup'

const drawerSlug = 'copy-locale'
export const CopyLocaleData: React.FC = () => {
  const {
    config: {
      localization,
      routes: { admin },
      serverURL,
    },
  } = useConfig()
  const { code } = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { i18n, t } = useTranslation()
  const modified = useFormModified()
  const { toggleModal } = useModal()
  const { copyDataFromLocale } = useServerFunctions()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const localeOptions =
    (localization &&
      localization.locales.map((locale) => ({ label: locale.label, value: locale.code }))) ||
    []

  const localeOptionsWithoutCurrent = localeOptions.filter((locale) => locale.value !== code)

  const getLocaleLabel = (code: string) => {
    const locale = localization && localization.locales.find((l) => l.code === code)
    return locale && locale.label ? getTranslation(locale.label, i18n) : code
  }

  const [copying, setCopying] = React.useState(false)
  const [toLocale, setToLocale] = React.useState<null | string>(null)
  const [fromLocale, setFromLocale] = React.useState<null | string>(code)
  const [overwriteExisting, setOverwriteExisting] = React.useState(false)

  React.useEffect(() => {
    if (fromLocale !== code) {
      setFromLocale(code)
    }
  }, [code, fromLocale])

  const copyLocaleData = useCallback(
    async ({ from, to }) => {
      setCopying(true)

      try {
        await copyDataFromLocale({
          collectionSlug,
          docID: id,
          fromLocale: from,
          globalSlug,
          overrideData: overwriteExisting,
          toLocale: to,
        })

        setCopying(false)

        startRouteTransition(() =>
          router.push(
            formatAdminURL({
              adminRoute: admin,
              path: `/${collectionSlug ? `collections/${collectionSlug}/${id}` : `globals/${globalSlug}`}`,
              serverURL,
            }) + `?locale=${to}`,
          ),
        )

        toggleModal(drawerSlug)
      } catch (error) {
        toast.error(error.message)
      }
    },
    [
      copyDataFromLocale,
      collectionSlug,
      id,
      globalSlug,
      overwriteExisting,
      toggleModal,
      router,
      serverURL,
      admin,
      startRouteTransition,
    ],
  )

  if (!id && !globalSlug) {
    return null
  }

  return (
    <React.Fragment>
      <PopupList.Button
        onClick={() => {
          if (modified) {
            toast.info(t('general:unsavedChanges'))
          } else {
            toggleModal(drawerSlug)
          }
        }}
      >
        {t('localization:copyToLocale')}
      </PopupList.Button>
      <Drawer
        gutter={false}
        Header={
          <DrawerHeader
            onClose={() => {
              toggleModal(drawerSlug)
            }}
            title={t('localization:copyToLocale')}
          />
        }
        slug={drawerSlug}
      >
        <div className="px-(--gutter-h) flex justify-between items-center border-b border-border">
          <span>
            {fromLocale && toLocale ? (
              <div>
                {t('localization:copyFromTo', {
                  from: getLocaleLabel(fromLocale),
                  to: getLocaleLabel(toLocale),
                })}
              </div>
            ) : (
              t('localization:selectLocaleToCopy')
            )}
          </span>
          <Button
            buttonStyle="primary"
            disabled={!fromLocale || !toLocale}
            iconPosition="left"
            onClick={async () => {
              if (fromLocale === toLocale) {
                toast.error(t('localization:cannotCopySameLocale'))
                return
              }
              if (!copying) {
                await copyLocaleData({
                  from: fromLocale,
                  to: toLocale,
                })
              }
            }}
            size="medium"
          >
            {copying ? t('general:copying') + '...' : t('general:copy')}
          </Button>
        </div>

        <div className="py-[calc(var(--base)*1.5)] px-(--gutter-h) flex flex-col gap-(--base) *:flex *:flex-col *:gap-[calc(var(--base)*0.25)]">
          <SelectInput
            label={t('localization:copyFrom')}
            name={'fromLocale'}
            onChange={(selectedOption: { value: string }) => {
              if (selectedOption?.value) {
                setFromLocale(selectedOption.value)
              }
            }}
            options={localeOptions}
            path="fromLocale"
            readOnly
            value={fromLocale}
          />
          <SelectInput
            label={t('localization:copyTo')}
            name="toLocale"
            onChange={(selectedOption: { value: string }) => {
              if (selectedOption?.value) {
                setToLocale(selectedOption.value)
              }
            }}
            options={localeOptionsWithoutCurrent}
            path="toLocale"
            value={toLocale}
          />
          <CheckboxField
            checked={overwriteExisting}
            field={{
              name: 'overwriteExisting',
              label: t('general:overwriteExistingData'),
            }}
            onChange={() => setOverwriteExisting(!overwriteExisting)}
            path={'overwriteExisting'}
          />
        </div>
      </Drawer>
    </React.Fragment>
  )
}
