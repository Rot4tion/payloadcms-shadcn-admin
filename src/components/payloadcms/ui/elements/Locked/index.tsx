'use client'
import type { ClientUser } from 'payload'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { LockIcon } from '../../icons/Lock/index.js'
import { useTranslation } from '@payloadcms/ui'
import { isClientUserObject } from '../../utilities/isClientUserObject.js'
import { Tooltip } from '../Tooltip/index.js'

export const Locked: React.FC<{
  className?: string
  user: ClientUser
}> = ({ className, user }) => {
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()

  const userToUse = isClientUserObject(user) ? (user.email ?? user.id) : t('general:anotherUser')

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center pointer-events-auto',
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
    >
      <Tooltip
        alignCaret="left"
        className="left-0 translate-x-0 -translate-y-(--caret-size)"
        position="top"
        show={hovered}
      >{`${userToUse} ${t('general:isEditing')}`}</Tooltip>
      <LockIcon />
    </div>
  )
}
