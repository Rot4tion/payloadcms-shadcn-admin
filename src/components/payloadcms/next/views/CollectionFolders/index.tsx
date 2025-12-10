// @ts-nocheck payloadcms original type safe issue will fix later
import type React from 'react'

import { notFound } from 'next/navigation'

import type { BuildCollectionFolderViewStateArgs } from './buildView'

import { buildCollectionFolderView } from './buildView'

export const CollectionFolderView: React.FC<BuildCollectionFolderViewStateArgs> = async (args) => {
  try {
    const { View } = await buildCollectionFolderView(args)
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
