/* SHADCN ADMIN - Using local PayloadCMS packages */
import type { Metadata } from 'next'

import { importMap } from '@/app/(payload)/admin/importMap'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@/components/payloadcms/next/exports/views'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
