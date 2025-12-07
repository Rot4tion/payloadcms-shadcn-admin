'use client'

import {
  CheckboxField,
  CopyToClipboard,
  Form,
  Gutter,
  MinimizeMaximizeIcon,
  NumberField,
  SetDocumentStepNav,
  toast,
  useConfig,
  useDocumentInfo,
  useLocale,
  useTranslation,
} from '@/components/payloadcms/ui/exports/client'
import { useSearchParams } from 'next/navigation.js'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { LocaleSelector } from './LocaleSelector/index.js'
import { RenderJSON } from './RenderJSON/index.js'

export const APIViewClient: React.FC = () => {
  const { id, collectionSlug, globalSlug, initialData, isTrashed } = useDocumentInfo()

  const searchParams = useSearchParams()
  const { i18n, t } = useTranslation()
  const { code } = useLocale()

  const {
    config: {
      defaultDepth,
      localization,
      routes: { api: apiRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const globalConfig = getEntityConfig({ globalSlug })

  const localeOptions =
    localization &&
    localization.locales.map((locale) => ({ label: locale.label, value: locale.code }))

  let draftsEnabled: boolean = false
  let docEndpoint: string = ''

  if (collectionConfig) {
    draftsEnabled = Boolean(collectionConfig.versions?.drafts)
    docEndpoint = `/${collectionSlug}/${id}`
  }

  if (globalConfig) {
    draftsEnabled = Boolean(globalConfig.versions?.drafts)
    docEndpoint = `/globals/${globalSlug}`
  }

  const [data, setData] = React.useState<any>(initialData)
  const [draft, setDraft] = React.useState<boolean>(searchParams.get('draft') === 'true')
  const [locale, setLocale] = React.useState<string>(searchParams?.get('locale') || code)
  const [depth, setDepth] = React.useState<string>(
    searchParams.get('depth') || defaultDepth.toString(),
  )
  const [authenticated, setAuthenticated] = React.useState<boolean>(true)
  const [fullscreen, setFullscreen] = React.useState<boolean>(false)

  const trashParam = typeof initialData?.deletedAt === 'string'

  const params = new URLSearchParams({
    depth,
    draft: String(draft),
    locale,
    trash: trashParam ? 'true' : 'false',
  }).toString()

  const fetchURL = `${serverURL}${apiRoute}${docEndpoint}?${params}`

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fetchURL, {
          credentials: authenticated ? 'include' : 'omit',
          headers: {
            'Accept-Language': i18n.language,
          },
          method: 'GET',
        })

        try {
          const json = await res.json()
          setData(json)
        } catch (error) {
          toast.error('Error parsing response')
          console.error(error) // eslint-disable-line no-console
        }
      } catch (error) {
        toast.error('Error making request')
        console.error(error) // eslint-disable-line no-console
      }
    }

    void fetchData()
  }, [i18n.language, fetchURL, authenticated])

  return (
    <Gutter
      className={cn(
        'flex gap-[calc(var(--base)*2)] items-start',
        fullscreen && 'pl-0',
        'max-lg:flex-col max-lg:pl-0',
      )}
      right={false}
    >
      <SetDocumentStepNav
        collectionSlug={collectionSlug}
        globalLabel={globalConfig?.label}
        globalSlug={globalSlug}
        id={id}
        isTrashed={isTrashed}
        pluralLabel={collectionConfig ? collectionConfig?.labels?.plural : undefined}
        useAsTitle={collectionConfig ? collectionConfig?.admin?.useAsTitle : undefined}
        view="API"
      />
      {!fullscreen && (
        <div className="mt-[calc(var(--base)*2)] w-[60%] sticky top-(--base) max-lg:relative max-lg:w-full max-lg:top-0 max-lg:pe-(--gutter-h)">
          <div className="mb-[calc(var(--base)*1.5)] [&_a]:block [&_a]:overflow-hidden [&_a]:text-ellipsis [&_a]:no-underline [&_a:hover]:underline [&_a:focus-visible]:underline">
            <span className="text-muted-foreground">
              API URL <CopyToClipboard value={fetchURL} />
            </span>
            <a href={fetchURL} rel="noopener noreferrer" target="_blank">
              {fetchURL}
            </a>
          </div>
          <Form
            initialState={{
              authenticated: {
                initialValue: authenticated || false,
                valid: true,
                value: authenticated || false,
              },
              depth: {
                initialValue: Number(depth || 0),
                valid: true,
                value: Number(depth || 0),
              },
              draft: {
                initialValue: draft || false,
                valid: true,
                value: draft || false,
              },
              locale: {
                initialValue: locale,
                valid: true,
                value: locale,
              },
            }}
          >
            <div className="flex flex-col gap-(--base)">
              <div className="flex gap-(--base)">
                {draftsEnabled && (
                  <CheckboxField
                    field={{
                      name: 'draft',
                      label: t('version:draft'),
                    }}
                    onChange={() => setDraft(!draft)}
                    path="draft"
                  />
                )}
                <CheckboxField
                  field={{
                    name: 'authenticated',
                    label: t('authentication:authenticated'),
                  }}
                  onChange={() => setAuthenticated(!authenticated)}
                  path="authenticated"
                />
              </div>
              {localeOptions && (
                <LocaleSelector localeOptions={localeOptions} onChange={setLocale} />
              )}
              <NumberField
                field={{
                  name: 'depth',
                  admin: {
                    step: 1,
                  },
                  label: t('general:depth'),
                  max: 10,
                  min: 0,
                }}
                onChange={(value) => setDepth(value?.toString())}
                path="depth"
              />
            </div>
          </Form>
        </div>
      )}
      <div className="font-mono w-full [&_ul]:m-0 [&_li]:list-none">
        <div className="sticky top-0 z-[1] max-lg:hidden">
          <button
            aria-label="toggle fullscreen"
            className="absolute right-[calc(var(--base)*0.5)] top-[calc(var(--base)*0.5)] p-[calc(var(--base)*0.25)] bg-background cursor-pointer z-[1] m-0 border-0 rounded-[3px] text-muted-foreground hover:text-foreground"
            onClick={() => setFullscreen(!fullscreen)}
            type="button"
          >
            <MinimizeMaximizeIcon isMinimized={!fullscreen} />
          </button>
        </div>
        <div className="query-inspector__results pt-[calc(var(--base)*0.5)] pl-[calc(var(--base)*0.5)] pb-[calc(var(--base)*0.5)] bg-muted overflow-auto min-h-screen">
          <ul className="m-0 list-none">
            <RenderJSON isRoot object={data} />
          </ul>
        </div>
      </div>
    </Gutter>
  )
}
