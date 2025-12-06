/* SHADCN ADMIN - Using local PayloadCMS packages */
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms-local/next/layouts'
import type { ServerFunctionClient } from 'payload'
import React from 'react'

import '../(frontend)/global.css'
import { importMap } from '../(payload)/admin/importMap'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
