/* SHADCN ADMIN - Using local PayloadCMS packages */
import config from '@payload-config'
import '@/components/payloadcms/next/src/dummy.css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms-local/next/layouts'
import React from 'react'

import { importMap } from './shadcn-admin/importMap.js'
import './custom.scss'
import '../(frontend)/global.css'

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
