'use client'

import type { DocumentViewClientProps } from 'payload'

import { DefaultEditView } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

export const EditView: React.FC<DocumentViewClientProps> = (props) => {
  return <DefaultEditView {...props} />
}
