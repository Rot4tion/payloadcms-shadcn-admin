'use client'
import React from 'react'

import { Modal } from '../Modal/index.js'
import { useEditDepth } from '@payloadcms/ui'

type FullscreenModalProps = {
  children: React.ReactNode
  className?: string
  closeOnBlur?: boolean
  slug: string
  style?: React.CSSProperties
}

export function FullscreenModal(props: FullscreenModalProps) {
  const currentDepth = useEditDepth()

  return (
    <Modal
      closeOnBlur={false}
      {...props}
      style={{
        ...(props.style || {}),
        zIndex: `calc(100 + ${currentDepth || 0} + 1)`,
      }}
    />
  )
}
