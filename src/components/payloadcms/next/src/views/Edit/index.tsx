'use client'

import type { DocumentViewClientProps } from 'payload'

import { DefaultEditView } from '@payloadcms-local/ui'
import React from 'react'

export const EditView: React.FC<DocumentViewClientProps> = (props) => {
  return <DefaultEditView {...props} />
}
