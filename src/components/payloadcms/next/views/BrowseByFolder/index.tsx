// @ts-nocheck payloadcms original type safe issue will fix later
import type React from 'react'

import { notFound } from 'next/navigation'

import type { BuildFolderViewArgs } from './buildView'

import { buildBrowseByFolderView } from './buildView'

export const BrowseByFolder: React.FC<BuildFolderViewArgs> = async (args) => {
  try {
    const { View } = await buildBrowseByFolderView(args)
    return View
  } catch (error) {
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }
    if (error.message === 'not-found') {
      notFound()
    } else {
      console.error(error) // eslint-disable-line no-console
    }
  }
}
