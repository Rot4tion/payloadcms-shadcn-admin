'use client'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { useAuth } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { DefaultAccountIcon } from './Default/index.js'
import { GravatarAccountIcon } from './Gravatar/index.js'

export const Account = () => {
  const {
    config: {
      admin: {
        avatar,
        routes: { account: accountRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { user } = useAuth()
  const pathname = usePathname()
  const isOnAccountPage = pathname === formatAdminURL({ adminRoute, path: accountRoute })

  if (!user?.email || avatar === 'default') {
    return <DefaultAccountIcon active={isOnAccountPage} />
  }
  if (avatar === 'gravatar') {
    return <GravatarAccountIcon />
  }
}
