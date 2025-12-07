import type { Config, ImportMap, ServerProps } from 'payload'

import { RenderServerComponent } from '@/components/payloadcms/ui/elements/RenderServerComponent'
import '@/components/payloadcms/ui/scss/app.css'
import React from 'react'

type Args = {
  readonly children: React.ReactNode
  readonly importMap: ImportMap
  readonly providers: Config['admin']['components']['providers']
  readonly serverProps: ServerProps
}

export function NestProviders({
  children,
  importMap,
  providers,
  serverProps,
}: Args): React.ReactNode {
  return RenderServerComponent({
    clientProps: {
      children:
        providers.length > 1 ? (
          <NestProviders
            importMap={importMap}
            providers={providers.slice(1)}
            serverProps={serverProps}
          >
            {children}
          </NestProviders>
        ) : (
          children
        ),
    },
    Component: providers[0],
    importMap,
    serverProps,
  })
}
