'use client'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback } from 'react'

import type { OnCancel } from '../ConfirmationModal/index.js'

import { useAuth } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { useRouteTransition } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { ConfirmationModal } from '../ConfirmationModal/index.js'

export const stayLoggedInModalSlug = 'stay-logged-in'

export const StayLoggedInModal: React.FC = () => {
  const { refreshCookie } = useAuth()

  const router = useRouter()
  const { config } = useConfig()

  const {
    admin: {
      routes: { logout: logoutRoute },
    },
    routes: { admin: adminRoute },
  } = config

  const { t } = useTranslation()
  const { startRouteTransition } = useRouteTransition()

  const onConfirm = useCallback(() => {
    return startRouteTransition(() =>
      router.push(
        formatAdminURL({
          adminRoute,
          path: logoutRoute,
        }),
      ),
    )
  }, [router, startRouteTransition, adminRoute, logoutRoute])

  const onCancel: OnCancel = useCallback(() => {
    refreshCookie()
  }, [refreshCookie])

  return (
    <ConfirmationModal
      body={t('authentication:youAreInactive')}
      cancelLabel={t('authentication:stayLoggedIn')}
      confirmLabel={t('authentication:logOut')}
      heading={t('authentication:stayLoggedIn')}
      modalSlug={stayLoggedInModalSlug}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
